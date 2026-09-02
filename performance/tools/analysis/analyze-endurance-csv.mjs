#!/usr/bin/env node
// Generate endurance stability evidence from genuine native k6 CSV.

import { createReadStream, readFileSync, writeFileSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { createInterface } from 'node:readline';

const position = process.argv.indexOf('--result-root');
if (position === -1 || !process.argv[position + 1]) {
  throw new Error('usage: analyze-endurance-csv.mjs --result-root PATH');
}
const resultRoot = resolve(process.argv[position + 1]);
const bucketSeconds = 60;

function quantile(sorted, fraction) {
  if (!sorted.length) return null;
  const at = (sorted.length - 1) * fraction;
  const low = Math.floor(at);
  const high = Math.ceil(at);
  return sorted[low] + (sorted[high] - sorted[low]) * (at - low);
}

function round(value) {
  return value === null ? null : Number(value.toFixed(6));
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

const csvPath = join(resultRoot, 'raw', 'endurance-timeseries.csv');
const metadataText = readFileSync(join(resultRoot, 'evidence', 'runner-metadata.txt'), 'utf8');
const metadata = Object.fromEntries(metadataText.trim().split('\n').map((line) => {
  const index = line.indexOf('=');
  return index === -1 ? [line, ''] : [line.slice(0, index), line.slice(index + 1)];
}));
const allowed = new Set([
  'vus',
  'http_reqs',
  'http_req_duration',
  'http_req_failed',
  'wf03_workflow_attempted',
  'wf03_workflow_success',
  'wf03_orders_created',
  'wf03_orders_canceled',
  'wf03_lifecycle_duration',
]);
let firstTimestamp = null;
const buckets = new Map();
let headerSeen = false;
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
    buckets.set(bucketStart, {
      vus: [], requests: 0, durations: [], failed: 0, attempts: 0,
      successes: 0, created: 0, canceled: 0, lifecycle: [],
    });
  }
  const bucket = buckets.get(bucketStart);
  if (metric === 'vus') bucket.vus.push(value);
  if (metric === 'http_reqs') bucket.requests += value;
  if (metric === 'http_req_duration') bucket.durations.push(value);
  if (metric === 'http_req_failed') bucket.failed += value;
  if (metric === 'wf03_workflow_attempted') bucket.attempts += value;
  if (metric === 'wf03_workflow_success') bucket.successes += value;
  if (metric === 'wf03_orders_created') bucket.created += value;
  if (metric === 'wf03_orders_canceled') bucket.canceled += value;
  if (metric === 'wf03_lifecycle_duration') bucket.lifecycle.push(value);
}

let cumulativeOrders = 0;
const series = [...buckets.entries()].sort(([left], [right]) => left - right).map(([offset, bucket]) => {
  const durations = bucket.durations.sort((left, right) => left - right);
  const lifecycle = bucket.lifecycle.sort((left, right) => left - right);
  cumulativeOrders += bucket.created;
  return {
    offset_seconds: offset,
    elapsed: `${Math.floor(offset / 60)}:${String(offset % 60).padStart(2, '0')}`,
    average_vus: round(bucket.vus.reduce((sum, value) => sum + value, 0) / Math.max(bucket.vus.length, 1)),
    maximum_vus: bucket.vus.length ? Math.max(...bucket.vus) : 0,
    requests: bucket.requests,
    requests_per_second: round(bucket.requests / bucketSeconds),
    failed_requests: bucket.failed,
    average_duration_ms: durations.length ? round(durations.reduce((sum, value) => sum + value, 0) / durations.length) : null,
    p95_duration_ms: round(quantile(durations, 0.95)),
    p99_duration_ms: round(quantile(durations, 0.99)),
    lifecycle_p95_ms: round(quantile(lifecycle, 0.95)),
    workflow_attempts: bucket.attempts,
    workflow_successes: bucket.successes,
    orders_created: bucket.created,
    orders_canceled: bucket.canceled,
    cumulative_orders_created: cumulativeOrders,
  };
});

const fullSteadyBuckets = series.filter((item) => item.offset_seconds >= 60 && item.offset_seconds < 720);
const midpoint = Math.floor(fullSteadyBuckets.length / 2);
const summarizeHalf = (items) => ({
  bucket_count: items.length,
  mean_rps: round(items.reduce((sum, item) => sum + item.requests_per_second, 0) / Math.max(items.length, 1)),
  mean_bucket_p95_ms: round(items.reduce((sum, item) => sum + item.p95_duration_ms, 0) / Math.max(items.length, 1)),
  max_bucket_p95_ms: items.length ? Math.max(...items.map((item) => item.p95_duration_ms)) : null,
  failed_requests: items.reduce((sum, item) => sum + item.failed_requests, 0),
});
const stability = {
  first_half: summarizeHalf(fullSteadyBuckets.slice(0, midpoint)),
  second_half: summarizeHalf(fullSteadyBuckets.slice(midpoint)),
};
const report = {
  label: 'MEASURED ENDURANCE TIME SERIES — DERIVED FROM GENUINE NATIVE K6 CSV',
  source_csv: csvPath,
  bucket_seconds: bucketSeconds,
  source_flush_time: metadata.artifact_flush_completion_time ?? null,
  steady_window_rule: 'complete minute buckets from elapsed 1:00 through before 12:00',
  stability,
  series,
};

const rowHtml = series.map((item) => `<tr><td>${item.elapsed}</td><td>${item.average_vus}</td><td>${item.requests_per_second}</td><td>${item.p95_duration_ms ?? 'n/a'}</td><td>${item.p99_duration_ms ?? 'n/a'}</td><td>${item.failed_requests}</td><td>${item.workflow_successes}</td><td>${item.orders_created}</td><td>${item.orders_canceled}</td><td>${item.cumulative_orders_created}</td></tr>`).join('\n');
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>WF-03 Endurance time-series report</title><style>body{font:15px system-ui,sans-serif;max-width:1200px;margin:2rem auto;padding:0 1rem;color:#172033}h1,h2,h3{color:#0b4f6c}.notice{background:#fff6d8;border-left:4px solid #d99b00;padding:1rem}svg{width:100%;background:#f7fafc;border:1px solid #ccd6dd}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ccd6dd;padding:.4rem;text-align:right}th:first-child,td:first-child{text-align:left}</style></head><body><h1>WF-03 Endurance CSV time-series report</h1><p class="notice">Generated from genuine native k6 CSV in 60-second buckets. It describes this bounded local run and does not establish maximum capacity.</p>${chart(series.map((item) => item.requests_per_second), '#167d3c', 'Request throughput (requests/s)')}${chart(series.map((item) => item.p95_duration_ms ?? 0), '#c05621', 'Per-bucket HTTP duration p95 (ms)')}${chart(series.map((item) => item.cumulative_orders_created), '#805ad5', 'Cumulative persistent orders created')}<h2>One-minute measurements</h2><table><thead><tr><th>Elapsed</th><th>Avg VUs</th><th>RPS</th><th>p95 ms</th><th>p99 ms</th><th>Failed</th><th>Workflows</th><th>Created</th><th>Canceled</th><th>Cumulative</th></tr></thead><tbody>${rowHtml}</tbody></table><p>Source flush: ${escapeHtml(report.source_flush_time)}<br>Source: <code>${escapeHtml(csvPath)}</code></p></body></html>\n`;
const rows = series.map((item) => `| ${item.elapsed} | ${item.average_vus} | ${item.requests_per_second} | ${item.p95_duration_ms ?? 'n/a'} | ${item.p99_duration_ms ?? 'n/a'} | ${item.failed_requests} | ${item.workflow_successes} | ${item.orders_created} | ${item.orders_canceled} | ${item.cumulative_orders_created} |`).join('\n');
const markdown = `# Endurance Native-CSV Time-Series Analysis\n\n**${report.label}**\n\n60-second buckets. This is bounded local evidence, not maximum capacity.\n\n| Elapsed | Avg VUs | RPS | p95 ms | p99 ms | Failed | Workflows | Created | Canceled | Cumulative orders |\n|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|\n${rows}\n\n## Steady-window half comparison\n\n\`\`\`json\n${JSON.stringify(stability, null, 2)}\n\`\`\`\n`;

const outputDir = join(resultRoot, 'report');
await mkdir(outputDir, { recursive: true });
writeFileSync(join(outputDir, 'endurance-timeseries.json'), `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(join(outputDir, 'endurance-timeseries.md'), markdown);
writeFileSync(join(outputDir, 'endurance-timeseries.html'), html);
process.stdout.write(`${JSON.stringify({ buckets: series.length, stability }, null, 2)}\n`);
