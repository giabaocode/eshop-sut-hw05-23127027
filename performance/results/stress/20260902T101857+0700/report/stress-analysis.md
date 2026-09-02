# Stress Raw-Result Analysis

**MEASURED SCENARIO VALUES — DERIVED FROM GENUINE NATIVE K6 JSON**

Source: `/Users/phamngocgiabao/eshop-sut-hw05-23127027/performance/results/stress/20260902T101857+0700/raw/stress-raw.json` and `/Users/phamngocgiabao/eshop-sut-hw05-23127027/performance/results/stress/20260902T101857+0700/raw/stress-summary.json`. No final acceptance threshold or capacity claim is made.

## Outcome

| Metric | Measured value |
|---|---|
| Workflow attempts | 1281 |
| Workflow successes | 1281 |
| Workflow failures | 0 |
| Workflow success rate | 100% |
| HTTP requests | 8967 |
| HTTP failed requests | 0 |
| HTTP error rate | 0% |
| Throughput | 11.878 requests/s |
| Checks passed / total | 48678 / 48678 |
| Orders created / canceled | 1281 / 1281 |
| Unexpected auth responses | 0 |
| First-terminal failures | 0 |
| k6 exit / watchdog | 0 / no |

## HTTP endpoint latency (milliseconds)

| Step | Count | Mean | Median | p90 | p95 | p99 | Max |
|---|---|---|---|---|---|---|---|
| cancellation | 1281 | 3.448 | 3.471 | 4.183 | 4.45 | 5.773 | 11.899 |
| checkout | 1281 | 3.205 | 3.235 | 3.939 | 4.125 | 5.417 | 11.618 |
| detail | 1281 | 1.286 | 1.269 | 1.729 | 1.909 | 2.518 | 4.551 |
| final_probe | 1281 | 0.756 | 0.734 | 0.968 | 1.064 | 1.64 | 3.42 |
| login | 1281 | 1.101 | 1.056 | 1.397 | 1.605 | 2.682 | 5.136 |
| pending_probe | 1281 | 0.796 | 0.77 | 1.02 | 1.159 | 1.75 | 4.376 |
| search | 1281 | 1.311 | 1.292 | 1.77 | 1.933 | 2.537 | 4.24 |

## Overall latency

| Metric | Mean | Median | p90 | p95 | p99 | Max |
|---|---|---|---|---|---|---|
| HTTP request duration (ms) | 1.7 | 1.208 | 3.599 | 3.915 | 4.454 | 11.899 |
| Lifecycle duration (ms) | 757.377 | 755 | 960 | 986 | 1006 | 1012 |
| Iteration duration (ms) | 5309.38 | 5321.082 | 6038.647 | 6233.411 | 6506.687 | 6822.746 |

## Interpretation boundary

These are measured stress values. Interpretation, acceptance thresholds, stable capacity, and cross-scenario conclusions require separate evidence and review.
