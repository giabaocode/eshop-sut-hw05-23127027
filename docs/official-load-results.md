# Official Load Execution Result

Status: **COMPLETED — REAL OFFICIAL LOAD; ANALYSIS DOES NOT DEFINE THRESHOLDS**

Official entry: `performance/scenarios/official/23127027_Load_20260901.js`

Run ID: `20260902T092131+0700`

Result root: `performance/results/load/20260902T092131+0700/`

The genuine run used the human-approved ramping-VU schedule 0→5/1m, 5/5m,
5→0/1m. k6 exited 0 after 422 seconds; watchdog did not fire. The exact shared
WF-03 implementation completed 345/345 workflows with 2,415 HTTP requests,
zero failed requests, 13,110/13,110 checks, and 345/345 created orders canceled.

Native raw JSON, native summary, stdout/stderr, exact command, runner metadata,
backend/setup/postflight evidence, genuine screenshot source/PNG conversion,
and generated aggregate JSON/Markdown/HTML are preserved. See
[`../analysis/load-analysis.md`](../analysis/load-analysis.md) for reproducible
measured values and interpretation boundaries.

No final p95/RPS/error-rate/capacity threshold is established here. The next
technical step is a fresh official Stress preflight/run under maximum safe
automation, with its own real screenshot gate and isolated artifacts.
