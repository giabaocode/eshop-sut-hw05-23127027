#!/usr/bin/env node
// Derive approved Spike-phase observations from genuine native k6 JSON.

import { createReadStream, readFileSync, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { join, resolve } from 'node:path';

const resultRoot = resolve(process.argv[2] ?? '');
if (!process.argv[2]) {
  throw new Error('usage: analyze-spike-phases.mjs RESULT_ROOT');
}

const phases = [
  { name: 'ramp_to_baseline', start: 0, end: 30 },
  { name: 'baseline', start: 30, end: 150 },
  { name: 'rise', start: 150, end: 160 },
  { name: 'peak', start: 160, end: 205 },
  { name: 'fall', start: 205, end: 215 },
  { name: 'recovery', start: 215, end: 335 },
  { name: 'final_ramp_down', start: 335, end: 365 },
].map((phase) => ({ ...phase, durations: [], requests: 0, failed: 0, vus: [] }));

const metadata = Object.fromEntries(
  readFileSync(join(resultRoot, 'evidence', 'runner-metadata.txt'), 'utf8')
    .trim()
    .split('\n')
    .map((line) => {
      const separator = line.indexOf('=');
      return [line.slice(0, separator), line.slice(separator + 1)];
    }),
);
let startMs = null;
const phaseFor = (elapsed) => phases.find((phase) => elapsed >= phase.start && elapsed < phase.end);

const lines = createInterface({
  input: createReadStream(join(resultRoot, 'raw', 'spike-raw.json')),
  crlfDelay: Infinity,
});
for await (const line of lines) {
  if (!line.trim()) continue;
  const record = JSON.parse(line);
  if (record.type !== 'Point') continue;
  if (startMs === null && record.metric === 'vus') startMs = Date.parse(record.data.time);
  if (startMs === null) continue;
  const elapsed = (Date.parse(record.data.time) - startMs) / 1000;
  const phase = phaseFor(elapsed);
  if (!phase) continue;
  if (record.metric === 'http_reqs') phase.requests += Number(record.data.value);
  if (record.metric === 'http_req_failed') phase.failed += Number(record.data.value);
  if (record.metric === 'http_req_duration') phase.durations.push(Number(record.data.value));
  if (record.metric === 'vus') phase.vus.push(Number(record.data.value));
}

function quantile(values, fraction) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const position = (sorted.length - 1) * fraction;
  const low = Math.floor(position);
  const high = Math.ceil(position);
  return sorted[low] + (sorted[high] - sorted[low]) * (position - low);
}

function round(value) {
  return value === null ? null : Number(value.toFixed(6));
}

const output = phases.map((phase) => ({
  phase: phase.name,
  elapsed_seconds: `${phase.start}-${phase.end}`,
  planned_seconds: phase.end - phase.start,
  avg_vus: round(phase.vus.reduce((sum, value) => sum + value, 0) / phase.vus.length),
  max_vus: phase.vus.length ? Math.max(...phase.vus) : null,
  requests: phase.requests,
  throughput_rps: round(phase.requests / (phase.end - phase.start)),
  failed_requests: phase.failed,
  latency_ms: {
    mean: phase.durations.length
      ? round(phase.durations.reduce((sum, value) => sum + value, 0) / phase.durations.length)
      : null,
    p90: round(quantile(phase.durations, 0.9)),
    p95: round(quantile(phase.durations, 0.95)),
    p99: round(quantile(phase.durations, 0.99)),
    max: phase.durations.length ? Math.max(...phase.durations) : null,
  },
}));

const outputPath = join(resultRoot, 'report', 'spike-phases.json');
writeFileSync(outputPath, `${JSON.stringify({
  label: 'MEASURED SPIKE PHASE VALUES — DERIVED FROM GENUINE NATIVE K6 JSON',
  source: 'raw/spike-raw.json',
  phase_origin: new Date(startMs).toISOString(),
  runner_start: metadata.start_time,
  phases: output,
}, null, 2)}\n`);
process.stdout.write(`${outputPath}\n`);
