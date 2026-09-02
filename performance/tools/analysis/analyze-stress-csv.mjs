#!/usr/bin/env node
// Generate a distinct Stress time-series view from genuine native k6 CSV.

import { createReadStream, readFileSync, writeFileSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { createInterface } from 'node:readline';

function resultRootFromArgs() {
  const position = process.argv.indexOf('--result-root');
  if (position === -1 || !process.argv[position + 1]) {
    throw new Error('usage: analyze-stress-csv.mjs --result-root PATH');
  }
  return resolve(process.argv[position + 1]);
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
  return value === null ? null : Number(value.toFixed(digits));
}

function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function chart(values, color, label) {
  const width = 1000;
  const height = 220;
  const padding = 35;
  const finite = values.filter(Number.isFinite);
  const maximum = Math.max(...finite, 1);
  const minimum = Math.min(...finite, 0);
  const range = maximum - minimum || 1;
  const points = values.map((value, index) => {
    const x = padding + (index * (width - padding * 2)) / Math.max(values.length - 1, 1);
    const y = height - padding - ((value - minimum) * (height - padding * 2)) / range;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return `<section><h3>${escapeHtml(label)}</h3><svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(label)}"><line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#8091a5"/><line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="#8091a5"/><polyline fill="none" stroke="${color}" stroke-width="3" points="${points}"/><text x="4" y="${padding + 4}" font-size="16">${maximum.toFixed(2)}</text><text x="4" y="${height - padding}" font-size="16">${minimum.toFixed(2)}</text></svg></section>`;
}

async function main() {
  const resultRoot = resultRootFromArgs();
  const csvPath = join(resultRoot, 'raw', 'stress-timeseries.csv');
  const metadataText = readFileSync(join(resultRoot, 'evidence', 'runner-metadata.txt'), 'utf8');
  const metadata = Object.fromEntries(metadataText.trim().split('\n').map((line) => {
    const index = line.indexOf('=');
    return index === -1 ? [line, ''] : [line.slice(0, index), line.slice(index + 1)];
  }));
  const bucketSeconds = 30;
  let firstTimestamp = null;
  const buckets = new Map();
  let headerSeen = false;
  const allowed = new Set(['vus', 'http_reqs', 'http_req_duration', 'http_req_failed', 'wf03_workflow_attempted', 'wf03_workflow_success']);

  const lines = createInterface({ input: createReadStream(csvPath), crlfDelay: Infinity });
  for await (const line of lines) {
    if (!headerSeen) {
      if (!line.startsWith('metric_name,timestamp,metric_value,')) throw new Error('unexpected native CSV header');
      headerSeen = true;
      continue;
    }
    const firstComma = line.indexOf(',');
    const secondComma = line.indexOf(',', firstComma + 1);
    const thirdComma = line.indexOf(',', secondComma + 1);
    if (firstComma === -1 || secondComma === -1 || thirdComma === -1) continue;
    const metric = line.slice(0, firstComma);
    if (!allowed.has(metric)) continue;
    const timestamp = Number(line.slice(firstComma + 1, secondComma));
    const value = Number(line.slice(secondComma + 1, thirdComma));
    if (!Number.isFinite(timestamp) || !Number.isFinite(value)) continue;
    firstTimestamp = firstTimestamp === null ? timestamp : Math.min(firstTimestamp, timestamp);
    const offset = Math.max(0, timestamp - firstTimestamp);
    const bucketStart = Math.floor(offset / bucketSeconds) * bucketSeconds;
    if (!buckets.has(bucketStart)) {
      buckets.set(bucketStart, { vus: [], requests: 0, durations: [], failed: 0, attempts: 0, successes: 0 });
    }
    const bucket = buckets.get(bucketStart);
    if (metric === 'vus') bucket.vus.push(value);
    if (metric === 'http_reqs') bucket.requests += value;
    if (metric === 'http_req_duration') bucket.durations.push(value);
    if (metric === 'http_req_failed') bucket.failed += value;
    if (metric === 'wf03_workflow_attempted') bucket.attempts += value;
    if (metric === 'wf03_workflow_success') bucket.successes += value;
  }

  const series = [...buckets.entries()].sort(([left], [right]) => left - right).map(([offset, bucket]) => {
    const durations = bucket.durations.sort((left, right) => left - right);
    const averageVus = bucket.vus.length === 0 ? 0 : bucket.vus.reduce((a, b) => a + b, 0) / bucket.vus.length;
    return {
      offset_seconds: offset,
      elapsed: `${Math.floor(offset / 60)}:${String(offset % 60).padStart(2, '0')}`,
      average_vus: round(averageVus),
      maximum_vus: bucket.vus.length === 0 ? 0 : Math.max(...bucket.vus),
      requests: bucket.requests,
      requests_per_second: round(bucket.requests / bucketSeconds),
      failed_requests: bucket.failed,
      error_rate: bucket.requests === 0 ? 0 : round(bucket.failed / bucket.requests),
      average_duration_ms: durations.length === 0 ? null : round(durations.reduce((a, b) => a + b, 0) / durations.length),
      p95_duration_ms: durations.length === 0 ? null : round(quantile(durations, 0.95)),
      workflow_attempts: bucket.attempts,
      workflow_successes: bucket.successes,
    };
  });

  const report = {
    label: 'MEASURED STRESS TIME SERIES — DERIVED FROM GENUINE NATIVE K6 CSV',
    source_csv: csvPath,
    bucket_seconds: bucketSeconds,
    source_flush_time: metadata.artifact_flush_completion_time ?? null,
    series,
  };
  const rows = series.map((item) => `<tr><td>${item.elapsed}</td><td>${item.average_vus}</td><td>${item.maximum_vus}</td><td>${item.requests}</td><td>${item.requests_per_second}</td><td>${item.average_duration_ms ?? 'n/a'}</td><td>${item.p95_duration_ms ?? 'n/a'}</td><td>${item.failed_requests}</td><td>${item.workflow_attempts}</td><td>${item.workflow_successes}</td></tr>`).join('\n');
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>WF-03 Stress time-series report</title><style>body{font:15px system-ui,sans-serif;max-width:1200px;margin:2rem auto;padding:0 1rem;color:#172033}h1,h2,h3{color:#0b4f6c}.notice{background:#fff6d8;border-left:4px solid #d99b00;padding:1rem}svg{width:100%;background:#f7fafc;border:1px solid #ccd6dd}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ccd6dd;padding:.4rem;text-align:right}th:first-child,td:first-child{text-align:left}</style></head><body><h1>WF-03 Stress CSV time-series report</h1><p class="notice">Distinct Stress view generated from genuine native k6 CSV in 30-second buckets. Workflow starts and successful completions may fall in adjacent buckets. It does not define capacity or final thresholds.</p>${chart(series.map((item) => item.average_vus), '#805ad5', 'Average active VUs')}${chart(series.map((item) => item.requests_per_second), '#167d3c', 'Request throughput (requests/s)')}${chart(series.map((item) => item.p95_duration_ms ?? 0), '#c05621', 'Per-bucket HTTP duration p95 (ms)')}<h2>30-second measurements</h2><table><thead><tr><th>Elapsed</th><th>Avg VUs</th><th>Max VUs</th><th>Requests</th><th>RPS</th><th>Avg ms</th><th>p95 ms</th><th>Failed</th><th>Workflow starts</th><th>Successful completions</th></tr></thead><tbody>${rows}</tbody></table><p>Source flush: ${escapeHtml(report.source_flush_time)}<br>Source: <code>${escapeHtml(csvPath)}</code></p></body></html>\n`;
  const markdownRows = series.map((item) => `| ${item.elapsed} | ${item.average_vus} | ${item.maximum_vus} | ${item.requests} | ${item.requests_per_second} | ${item.average_duration_ms ?? 'n/a'} | ${item.p95_duration_ms ?? 'n/a'} | ${item.failed_requests} | ${item.workflow_attempts} | ${item.workflow_successes} |`).join('\n');
  const markdown = `# Stress Native-CSV Time-Series Analysis\n\n**${report.label}**\n\n30-second buckets; workflow starts and successful completions can fall in adjacent buckets. No capacity or final-threshold claim.\n\n| Elapsed | Avg VUs | Max VUs | Requests | RPS | Avg ms | p95 ms | Failed | Workflow starts | Successful completions |\n|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|\n${markdownRows}\n`;
  const outputDir = join(resultRoot, 'report');
  await mkdir(outputDir, { recursive: true });
  writeFileSync(join(outputDir, 'stress-timeseries.json'), `${JSON.stringify(report, null, 2)}\n`);
  writeFileSync(join(outputDir, 'stress-timeseries.md'), markdown);
  writeFileSync(join(outputDir, 'stress-timeseries.html'), html);
  process.stdout.write(`${JSON.stringify({ buckets: series.length, source: csvPath }, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`Stress CSV analysis failed: ${error.message}\n`);
  process.exitCode = 1;
});
