#!/usr/bin/env node
// Reproduce the cross-scenario aggregate table from committed analysis JSON.

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(process.argv[2] ?? '.');
const inputs = [
  ['load', 'performance/results/load/20260902T092131+0700/report/load-analysis.json'],
  ['stress', 'performance/results/stress/20260902T101857+0700/report/stress-analysis.json'],
  ['spike', 'performance/results/spike/20260902T104549+0700/report/spike-analysis.json'],
  ['endurance', 'performance/results/endurance/20260902T143823+0700/report/endurance-analysis.json'],
];
const rows = inputs.map(([scenario, path]) => {
  const value = JSON.parse(readFileSync(resolve(root, path), 'utf8'));
  return {
    scenario,
    source: path,
    attempts: value.workflow.attempts,
    successes: value.workflow.successes,
    workflow_success_rate: value.workflow.success_rate,
    http_requests: value.http.request_count,
    failed_requests: value.http.failed_requests,
    throughput_rps: value.http.throughput_rps,
    mean_ms: value.http.duration_ms.mean,
    median_ms: value.http.duration_ms.median,
    p90_ms: value.http.duration_ms.p90,
    p95_ms: value.http.duration_ms.p95,
    p99_ms: value.http.duration_ms.p99,
    max_ms: value.http.duration_ms.max,
    lifecycle_p95_ms: value.lifecycle_duration_ms.p95,
    orders_created: value.business.orders_created,
    orders_canceled: value.business.orders_canceled,
    unexpected_auth: value.business.unexpected_auth_responses,
    terminal_failures: value.business.first_terminal_failures,
  };
});

const totals = rows.reduce((result, row) => ({
  workflow_attempts: result.workflow_attempts + row.attempts,
  workflow_successes: result.workflow_successes + row.successes,
  http_requests: result.http_requests + row.http_requests,
  failed_requests: result.failed_requests + row.failed_requests,
  orders_created: result.orders_created + row.orders_created,
  orders_canceled: result.orders_canceled + row.orders_canceled,
}), { workflow_attempts: 0, workflow_successes: 0, http_requests: 0, failed_requests: 0, orders_created: 0, orders_canceled: 0 });

const output = {
  label: 'MEASURED CROSS-SCENARIO VALUES — EACH ROW RETAINS ITS OWN WORKLOAD CONTEXT',
  rows,
  totals,
  cautions: [
    'Aggregate RPS is not directly comparable as capacity because stage shapes and durations differ.',
    'Twenty VUs is the tested Stress/Spike input, not maximum capacity.',
    'Point-in-time screenshots are not continuous resource averages.',
  ],
};
writeFileSync(resolve(root, 'analysis/scenario-comparison.json'), `${JSON.stringify(output, null, 2)}\n`);

const table = rows.map((row) => `| ${row.scenario} | ${row.attempts}/${row.successes} | ${row.http_requests}/${row.failed_requests} | ${row.throughput_rps} | ${row.mean_ms} | ${row.p95_ms} | ${row.p99_ms} | ${row.max_ms} | ${row.lifecycle_p95_ms} | ${row.orders_created}/${row.orders_canceled} |`).join('\n');
const markdown = `# WF-03 Scenario Comparison\n\n**${output.label}**\n\n| Scenario | Workflows attempted/succeeded | HTTP total/failed | Aggregate RPS | Mean ms | p95 ms | p99 ms | Max ms | Lifecycle p95 ms | Orders created/canceled |\n|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|\n${table}\n\n## Totals\n\nAcross the four genuine runs: ${totals.workflow_successes}/${totals.workflow_attempts} complete workflows, ${totals.http_requests} HTTP requests with ${totals.failed_requests} failed, and ${totals.orders_canceled}/${totals.orders_created} created orders canceled. These totals combine different workload shapes and are evidence counts, not one performance sample.\n\n## Workload-specific observations\n\n- Load: five-VU steady input, overall p95 4.1019 ms and 5.731666 requests/s.\n- Stress: stages through 20 VUs, overall p95 3.9147 ms; full 20-VU buckets were approximately 25.93–26.53 requests/s with p95 approximately 3.72–3.75 ms and zero failures.\n- Spike: 20-VU peak p95 3.5988 ms versus baseline 4.324 ms and recovery 4.038 ms, with zero failures in every phase.\n- Endurance: at five steady VUs, first/second-half mean bucket p95 was 4.45082/4.085 ms and mean RPS 6.6/6.636111, with zero failures.\n\n## Interpretation boundary\n\nThe data did not expose a failure knee, capacity ceiling, or sustained degradation within these inputs. Checkout and cancellation are consistently the highest-latency steps, but their low absolute durations and clean outcomes do not establish a bottleneck. Aggregate RPS differs partly because each closed-model schedule spends different time at each VU level and includes user think time. Twenty VUs is not measured capacity, screenshots are point-in-time, and the 5-VU/12-minute endurance point is not a guarantee beyond this local run.\n`;
writeFileSync(resolve(root, 'analysis/scenario-comparison.md'), markdown);
process.stdout.write(`${JSON.stringify(totals, null, 2)}\n`);
