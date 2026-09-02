# Spike Raw-Result Analysis

**MEASURED SCENARIO VALUES — DERIVED FROM GENUINE NATIVE K6 JSON**

Source: `/Users/phamngocgiabao/eshop-sut-hw05-23127027/performance/results/spike/20260902T104549+0700/raw/spike-raw.json` and `/Users/phamngocgiabao/eshop-sut-hw05-23127027/performance/results/spike/20260902T104549+0700/raw/spike-summary.json`. No final acceptance threshold or capacity claim is made.

## Outcome

| Metric | Measured value |
|---|---|
| Workflow attempts | 377 |
| Workflow successes | 377 |
| Workflow failures | 0 |
| Workflow success rate | 100% |
| HTTP requests | 2639 |
| HTTP failed requests | 0 |
| HTTP error rate | 0% |
| Throughput | 7.227 requests/s |
| Checks passed / total | 14326 / 14326 |
| Orders created / canceled | 377 / 377 |
| Unexpected auth responses | 0 |
| First-terminal failures | 0 |
| k6 exit / watchdog | 0 / no |

## HTTP endpoint latency (milliseconds)

| Step | Count | Mean | Median | p90 | p95 | p99 | Max |
|---|---|---|---|---|---|---|---|
| cancellation | 377 | 3.293 | 3.193 | 4.416 | 4.854 | 5.776 | 7.06 |
| checkout | 377 | 3.168 | 3.138 | 4.134 | 4.308 | 6.034 | 16.712 |
| detail | 377 | 1.314 | 1.256 | 1.772 | 1.991 | 2.837 | 5.51 |
| final_probe | 377 | 0.749 | 0.672 | 1.036 | 1.25 | 2.292 | 3.178 |
| login | 377 | 1.154 | 0.959 | 1.684 | 2.135 | 3.855 | 7.371 |
| pending_probe | 377 | 0.809 | 0.733 | 1.147 | 1.382 | 2.106 | 5.068 |
| search | 377 | 1.37 | 1.339 | 1.858 | 2.053 | 2.904 | 3.515 |

## Overall latency

| Metric | Mean | Median | p90 | p95 | p99 | Max |
|---|---|---|---|---|---|---|
| HTTP request duration (ms) | 1.694 | 1.256 | 3.474 | 3.965 | 4.912 | 16.712 |
| Lifecycle duration (ms) | 765.83 | 764 | 967.8 | 987 | 1006 | 1011 |
| Iteration duration (ms) | 5284.044 | 5312.453 | 6040.632 | 6261.166 | 6532.978 | 6708.759 |

## Interpretation boundary

These are measured spike values. Interpretation, acceptance thresholds, stable capacity, and cross-scenario conclusions require separate evidence and review.
