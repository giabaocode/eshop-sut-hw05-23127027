#!/usr/bin/env node
// Analyze genuine native k6 JSON points without third-party dependencies.

import { createReadStream, readFileSync, writeFileSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';
import { createInterface } from 'node:readline';

function parseArgs(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!key?.startsWith('--') || !value) throw new Error('arguments must be --key value pairs');
    values[key.slice(2)] = value;
  }
  if (!values.scenario || !values['result-root']) {
    throw new Error('usage: analyze-k6.mjs --scenario NAME --result-root PATH');
  }
  return { scenario: values.scenario, resultRoot: resolve(values['result-root']) };
}

function quantile(sorted, fraction) {
  if (sorted.length === 0) return null;
  const position = (sorted.length - 1) * fraction;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (position - lower);
}

function round(value, digits = 6) {
  return value === null || value === undefined ? null : Number(value.toFixed(digits));
}

function statistics(values) {
  if (values.length === 0) return null;
  const sorted = [...values].sort((left, right) => left - right);
  const sum = sorted.reduce((total, value) => total + value, 0);
  return {
    count: sorted.length,
    min: round(sorted[0]),
    max: round(sorted.at(-1)),
    mean: round(sum / sorted.length),
    median: round(quantile(sorted, 0.5)),
    p90: round(quantile(sorted, 0.9)),
    p95: round(quantile(sorted, 0.95)),
    p99: round(quantile(sorted, 0.99)),
  };
}

function sum(values) {
  return values.reduce((total, value) => total + value, 0);
}

function metricFromSummary(summary, name) {
  return summary?.metrics?.[name] ?? null;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function formatNumber(value, digits = 3) {
  if (value === null || value === undefined) return 'n/a';
  return Number(value).toFixed(digits).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1');
}

function markdownTable(headers, rows) {
  return [
    `| ${headers.join(' | ')} |`,
    `|${headers.map(() => '---').join('|')}|`,
    ...rows.map((row) => `| ${row.join(' | ')} |`),
  ].join('\n');
}

async function main() {
  const { scenario, resultRoot } = parseArgs(process.argv.slice(2));
  const rawPath = join(resultRoot, 'raw', `${scenario}-raw.json`);
  const summaryPath = join(resultRoot, 'raw', `${scenario}-summary.json`);
  const metadataPath = join(resultRoot, 'evidence', 'runner-metadata.txt');
  const reportDir = join(resultRoot, 'report');
  await mkdir(reportDir, { recursive: true });

  const summary = JSON.parse(readFileSync(summaryPath, 'utf8'));
  const metadataText = readFileSync(metadataPath, 'utf8');
  const metadata = Object.fromEntries(
    metadataText.trim().split('\n').map((line) => {
      const separator = line.indexOf('=');
      return separator === -1 ? [line, ''] : [line.slice(0, separator), line.slice(separator + 1)];
    }),
  );

  const valuesByMetric = new Map();
  const endpointDurations = new Map();
  const failureClasses = new Map();
  const failureSteps = new Map();
  let firstPointTime = null;
  let lastPointTime = null;

  const lines = createInterface({ input: createReadStream(rawPath), crlfDelay: Infinity });
  for await (const line of lines) {
    if (!line.trim()) continue;
    const record = JSON.parse(line);
    if (record.type !== 'Point') continue;
    const time = Date.parse(record.data.time);
    if (!Number.isNaN(time)) {
      firstPointTime = firstPointTime === null ? time : Math.min(firstPointTime, time);
      lastPointTime = lastPointTime === null ? time : Math.max(lastPointTime, time);
    }
    const metric = record.metric;
    const value = Number(record.data.value);
    if (!valuesByMetric.has(metric)) valuesByMetric.set(metric, []);
    valuesByMetric.get(metric).push(value);
    if (metric === 'http_req_duration') {
      const step = record.data.tags?.step ?? 'untagged';
      if (!endpointDurations.has(step)) endpointDurations.set(step, []);
      endpointDurations.get(step).push(value);
    }
    if (metric === 'wf03_failures') {
      const failureClass = record.data.tags?.failure_class ?? 'unknown';
      const step = record.data.tags?.step ?? 'unknown';
      failureClasses.set(failureClass, (failureClasses.get(failureClass) ?? 0) + value);
      failureSteps.set(step, (failureSteps.get(step) ?? 0) + value);
    }
  }

  const metricValues = (name) => valuesByMetric.get(name) ?? [];
  const attempts = sum(metricValues('wf03_workflow_attempted'));
  const workflowOutcomes = metricValues('wf03_workflow_success');
  const successes = sum(workflowOutcomes);
  const requestCount = sum(metricValues('http_reqs'));
  const failedRequests = sum(metricValues('http_req_failed'));
  const checkValues = metricValues('checks');
  const passedChecks = sum(checkValues);
  const totalChecks = checkValues.length;
  const summaryRequestRate = metricFromSummary(summary, 'http_reqs')?.rate ?? null;
  const rawSpanSeconds = firstPointTime === null || lastPointTime === null
    ? null
    : (lastPointTime - firstPointTime) / 1000;

  const endpoints = Object.fromEntries(
    [...endpointDurations.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([step, values]) => [step, statistics(values)]),
  );

  const analysis = {
    label: 'MEASURED SCENARIO VALUES — DERIVED FROM GENUINE NATIVE K6 JSON',
    scenario,
    result_root: resultRoot,
    raw_file: rawPath,
    summary_file: summaryPath,
    source_files: [basename(rawPath), basename(summaryPath), basename(metadataPath)],
    process: {
      start_time: metadata.start_time ?? null,
      process_exit_time: metadata.process_exit_time ?? null,
      artifact_flush_completion_time: metadata.artifact_flush_completion_time ?? null,
      wall_clock_seconds: Number(metadata.wall_clock_seconds),
      k6_exit_code: Number(metadata.k6_exit_code),
      watchdog_fired: metadata.watchdog_fired,
      runner_interrupted: metadata.runner_interrupted,
      raw_point_span_seconds: round(rawSpanSeconds),
    },
    workflow: {
      attempts,
      successes,
      failures: attempts - successes,
      success_rate: attempts === 0 ? null : round(successes / attempts),
      final_outcome_samples: workflowOutcomes.length,
      one_outcome_per_attempt: workflowOutcomes.length === attempts,
    },
    http: {
      request_count: requestCount,
      failed_requests: failedRequests,
      error_rate: requestCount === 0 ? null : round(failedRequests / requestCount),
      throughput_rps: round(summaryRequestRate),
      duration_ms: statistics(metricValues('http_req_duration')),
      endpoints,
    },
    checks: {
      total: totalChecks,
      passed: passedChecks,
      failed: totalChecks - passedChecks,
      pass_rate: totalChecks === 0 ? null : round(passedChecks / totalChecks),
    },
    lifecycle_duration_ms: statistics(metricValues('wf03_lifecycle_duration')),
    iteration_duration_ms: statistics(metricValues('iteration_duration')),
    business: {
      orders_created: sum(metricValues('wf03_orders_created')),
      orders_canceled: sum(metricValues('wf03_orders_canceled')),
      unexpected_auth_responses: sum(metricValues('wf03_unexpected_auth_response')),
      first_terminal_failures: sum(metricValues('wf03_failures')),
      failures_by_class: Object.fromEntries([...failureClasses.entries()].sort()),
      failures_by_step: Object.fromEntries([...failureSteps.entries()].sort()),
    },
  };

  const endpointRows = Object.entries(analysis.http.endpoints).map(([step, stats]) => [
    step,
    stats.count,
    formatNumber(stats.mean),
    formatNumber(stats.median),
    formatNumber(stats.p90),
    formatNumber(stats.p95),
    formatNumber(stats.p99),
    formatNumber(stats.max),
  ]);
  const markdown = `# ${scenario[0].toUpperCase()}${scenario.slice(1)} Raw-Result Analysis\n\n` +
    `**${analysis.label}**\n\n` +
    `Source: \`${rawPath}\` and \`${summaryPath}\`. No final acceptance threshold or capacity claim is made.\n\n` +
    `## Outcome\n\n` +
    markdownTable(['Metric', 'Measured value'], [
      ['Workflow attempts', attempts],
      ['Workflow successes', successes],
      ['Workflow failures', attempts - successes],
      ['Workflow success rate', formatNumber(analysis.workflow.success_rate * 100) + '%'],
      ['HTTP requests', requestCount],
      ['HTTP failed requests', failedRequests],
      ['HTTP error rate', formatNumber(analysis.http.error_rate * 100) + '%'],
      ['Throughput', formatNumber(analysis.http.throughput_rps) + ' requests/s'],
      ['Checks passed / total', `${passedChecks} / ${totalChecks}`],
      ['Orders created / canceled', `${analysis.business.orders_created} / ${analysis.business.orders_canceled}`],
      ['Unexpected auth responses', analysis.business.unexpected_auth_responses],
      ['First-terminal failures', analysis.business.first_terminal_failures],
      ['k6 exit / watchdog', `${analysis.process.k6_exit_code} / ${analysis.process.watchdog_fired}`],
    ]) + '\n\n' +
    `## HTTP endpoint latency (milliseconds)\n\n` +
    markdownTable(['Step', 'Count', 'Mean', 'Median', 'p90', 'p95', 'p99', 'Max'], endpointRows) + '\n\n' +
    `## Overall latency\n\n` +
    markdownTable(['Metric', 'Mean', 'Median', 'p90', 'p95', 'p99', 'Max'], [
      ['HTTP request duration (ms)', formatNumber(analysis.http.duration_ms.mean), formatNumber(analysis.http.duration_ms.median), formatNumber(analysis.http.duration_ms.p90), formatNumber(analysis.http.duration_ms.p95), formatNumber(analysis.http.duration_ms.p99), formatNumber(analysis.http.duration_ms.max)],
      ['Lifecycle duration (ms)', formatNumber(analysis.lifecycle_duration_ms.mean), formatNumber(analysis.lifecycle_duration_ms.median), formatNumber(analysis.lifecycle_duration_ms.p90), formatNumber(analysis.lifecycle_duration_ms.p95), formatNumber(analysis.lifecycle_duration_ms.p99), formatNumber(analysis.lifecycle_duration_ms.max)],
      ['Iteration duration (ms)', formatNumber(analysis.iteration_duration_ms.mean), formatNumber(analysis.iteration_duration_ms.median), formatNumber(analysis.iteration_duration_ms.p90), formatNumber(analysis.iteration_duration_ms.p95), formatNumber(analysis.iteration_duration_ms.p99), formatNumber(analysis.iteration_duration_ms.max)],
    ]) + '\n\n' +
    `## Interpretation boundary\n\nThese are measured ${scenario} values. Interpretation, acceptance thresholds, stable capacity, and cross-scenario conclusions require separate evidence and review.\n`;

  const htmlRows = endpointRows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('\n');
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>WF-03 ${escapeHtml(scenario)} aggregate report</title>
<style>body{font:15px system-ui,sans-serif;max-width:1100px;margin:2rem auto;padding:0 1rem;color:#172033}h1,h2{color:#0b4f6c}table{border-collapse:collapse;width:100%;margin:1rem 0}th,td{border:1px solid #ccd6dd;padding:.5rem;text-align:right}th:first-child,td:first-child{text-align:left}.notice{padding:1rem;background:#fff6d8;border-left:4px solid #d99b00}.ok{color:#176b35;font-weight:700}code{overflow-wrap:anywhere}</style></head>
<body><h1>WF-03 ${escapeHtml(scenario)} aggregate report</h1>
<p class="notice">Generated reproducibly from genuine native k6 JSON. This report does not define final thresholds or measured capacity.</p>
<h2>Outcome</h2><table><tbody>
<tr><th>Workflow success</th><td class="ok">${successes}/${attempts} (${formatNumber(analysis.workflow.success_rate * 100)}%)</td></tr>
<tr><th>HTTP requests / failures</th><td>${requestCount} / ${failedRequests}</td></tr>
<tr><th>Checks passed / total</th><td>${passedChecks} / ${totalChecks}</td></tr>
<tr><th>Orders created / canceled</th><td>${analysis.business.orders_created} / ${analysis.business.orders_canceled}</td></tr>
<tr><th>Throughput</th><td>${formatNumber(analysis.http.throughput_rps)} requests/s</td></tr>
<tr><th>k6 exit / watchdog</th><td>${analysis.process.k6_exit_code} / ${escapeHtml(analysis.process.watchdog_fired)}</td></tr>
</tbody></table>
<h2>Endpoint latency (milliseconds)</h2><table><thead><tr><th>Step</th><th>Count</th><th>Mean</th><th>Median</th><th>p90</th><th>p95</th><th>p99</th><th>Max</th></tr></thead><tbody>${htmlRows}</tbody></table>
<h2>Traceability</h2><p>Raw: <code>${escapeHtml(rawPath)}</code><br>Summary: <code>${escapeHtml(summaryPath)}</code><br>Source artifact flush: ${escapeHtml(metadata.artifact_flush_completion_time ?? 'not recorded')}</p>
</body></html>\n`;

  writeFileSync(join(reportDir, `${scenario}-analysis.json`), `${JSON.stringify(analysis, null, 2)}\n`);
  writeFileSync(join(reportDir, `${scenario}-analysis.md`), markdown);
  writeFileSync(join(reportDir, `${scenario}-aggregate.html`), html);
  process.stdout.write(`${JSON.stringify(analysis, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`k6 analysis failed: ${error.message}\n`);
  process.exitCode = 1;
});
