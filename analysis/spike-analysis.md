# Official Spike Analysis — WF-03

**MEASURED SPIKE VALUES — NOT A CAPACITY OR FINAL-THRESHOLD CLAIM**

Run: `performance/results/spike/20260902T104549+0700/`

Canonical sources are native `spike-raw.json`, native summary/runner metadata,
and the genuine k6 dashboard. The reproducible parsers are under
`performance/tools/analysis/`.

## Aggregate outcome

| Metric | Actual value |
|---|---:|
| k6 exit / watchdog | 0 / no |
| Workflow attempts / successes / failures | 377 / 377 / 0 |
| HTTP requests / failed | 2,639 / 0 |
| HTTP error rate | 0% |
| Aggregate throughput | 7.226561 requests/s |
| Checks passed / total | 14,326 / 14,326 |
| Orders created / canceled | 377 / 377 |
| Unexpected auth / terminal failures | 0 / 0 |

Overall HTTP duration was mean 1.693911 ms, median 1.256 ms, p90 3.474 ms,
p95 3.9654 ms, p99 4.91164 ms, and max 16.712 ms. Lifecycle duration was p95
987 ms and p99 1,006 ms.

## Endpoint p95/p99 (milliseconds)

| Step | p95 | p99 | Max |
|---|---:|---:|---:|
| Login | 2.1352 | 3.85508 | 7.371 |
| Search | 2.053 | 2.90448 | 3.515 |
| Detail | 1.9914 | 2.83716 | 5.51 |
| Checkout | 4.3082 | 6.03384 | 16.712 |
| Pending probe | 1.3824 | 2.10616 | 5.068 |
| Cancellation | 4.8544 | 5.7758 | 7.06 |
| Final probe | 1.25 | 2.292 | 3.178 |

## Spike and recovery phases

Phase boundaries follow the approved workload from the first genuine `vus`
sample. Values below are reproduced by `analyze-spike-phases.mjs`.

| Phase | VUs avg/max | Requests/s | p95 ms | p99 ms | Failures |
|---|---:|---:|---:|---:|---:|
| Baseline (120s) | 3 / 3 | 3.925 | 4.324 | 5.0547 | 0 |
| Rise (10s) | 11.8 / 19 | 15.6 | 4.564 | 6.7727 | 0 |
| Peak (45s) | 20 / 20 | 26.377778 | 3.5988 | 4.41028 | 0 |
| Fall (10s) | 15.2 / 20 | 20.3 | 3.8587 | 5.50854 | 0 |
| Recovery (120s) | 3.066667 / 8 | 4.108333 | 4.038 | 4.41376 | 0 |

The recovery window returned to approximately the intended 3-VU level and had
zero failed requests. Its p95 did not exceed the pre-spike baseline p95 in this
single run. That is evidence of recovery for this tested input, not proof about
larger spikes or all environments.

## Visual and state evidence

The genuine peak screenshot shows 20/20 VUs and backend PID `48405` at a
point-in-time 4.0% CPU, 69.0 MB real memory, and 11 threads. The disposable DB
ended with 377 canceled orders; original integrity remained unchanged.
