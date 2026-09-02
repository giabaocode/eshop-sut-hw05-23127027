# Official Load Analysis — WF-03

**MEASURED LOAD VALUES — NOT A FINAL THRESHOLD OR CAPACITY CLAIM**

Run: `performance/results/load/20260902T092131+0700/`

Sources:

- genuine native k6 JSON: `raw/load-raw.json`;
- native k6 summary: `raw/load-summary.json`;
- exact runner metadata and command under `evidence/`;
- reproducible parser: `performance/tools/analysis/analyze-k6.mjs`;
- generated detailed JSON/Markdown/HTML under the run's `report/` directory.

## Measured outcome

| Metric | Actual value |
|---|---:|
| k6 exit / watchdog | `0` / `no` |
| Workflow attempts | 345 |
| Workflow successes / failures | 345 / 0 |
| Workflow success rate | 100% |
| Final outcome samples | 345 — exactly one per attempt |
| HTTP requests / failed | 2,415 / 0 |
| HTTP error rate | 0% |
| Throughput | 5.731666 requests/s |
| Checks passed / total | 13,110 / 13,110 |
| Orders created / canceled | 345 / 345 |
| Unexpected auth responses | 0 |
| First-terminal failures | 0 |
| Observed wall clock | 422 seconds |

## Raw HTTP latency (milliseconds)

| Scope | Count | Mean | Median | p90 | p95 | p99 | Max |
|---|---:|---:|---:|---:|---:|---:|---:|
| All requests | 2,415 | 1.821239 | 1.427 | 3.8268 | 4.1019 | 4.69974 | 17.008 |
| Login | 345 | 1.049545 | 0.908 | 1.4816 | 1.6128 | 2.35748 | 5.253 |
| Search | 345 | 1.56558 | 1.6 | 1.929 | 2.121 | 2.53764 | 3.048 |
| Detail | 345 | 1.553551 | 1.588 | 1.9324 | 2.0712 | 2.56456 | 3.029 |
| Checkout | 345 | 3.468336 | 3.579 | 4.2266 | 4.4126 | 5.60576 | 8.138 |
| Pending probe | 345 | 0.775951 | 0.715 | 1.0706 | 1.2452 | 1.6934 | 2.303 |
| Cancellation | 345 | 3.603838 | 3.679 | 4.387 | 4.6472 | 5.46264 | 17.008 |
| Final probe | 345 | 0.731872 | 0.673 | 1.0026 | 1.1256 | 1.59704 | 1.971 |

Lifecycle duration was p95 `989.8 ms` and p99 `1005.12 ms`; iteration duration,
which includes approved think time, was p95 `6097.637808 ms` and p99
`6422.231038 ms`.

## Resource and state evidence

The genuine human screenshot shows backend PID `42059` during five-VU traffic
at a point-in-time 1.4% CPU, 55.6 MB real memory, and 11 threads. This is a
single visual observation, not a continuous resource profile. The disposable
database ended with 345 orders, all canceled, and SQLite integrity `ok`. The
protected original database hash and integrity remained unchanged.

## Interpretation boundary

The bounded five-VU Load completed without observed HTTP, check, authentication,
correlation, or lifecycle failure. This single local run does not establish a
final p95 target, allowed error rate, maximum stable capacity, or endurance
threshold. Cross-scenario and threshold conclusions remain pending real Stress,
Spike, and endurance evidence.
