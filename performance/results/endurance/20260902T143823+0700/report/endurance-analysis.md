# Endurance Raw-Result Analysis

**MEASURED SCENARIO VALUES — DERIVED FROM GENUINE NATIVE K6 JSON**

Source: `/Users/phamngocgiabao/eshop-sut-hw05-23127027/performance/results/endurance/20260902T143823+0700/raw/endurance-raw.json` and `/Users/phamngocgiabao/eshop-sut-hw05-23127027/performance/results/endurance/20260902T143823+0700/raw/endurance-summary.json`. No final acceptance threshold or capacity claim is made.

## Outcome

| Metric | Measured value |
|---|---|
| Workflow attempts | 713 |
| Workflow successes | 713 |
| Workflow failures | 0 |
| Workflow success rate | 100% |
| HTTP requests | 4991 |
| HTTP failed requests | 0 |
| HTTP error rate | 0% |
| Throughput | 6.372 requests/s |
| Checks passed / total | 27094 / 27094 |
| Orders created / canceled | 713 / 713 |
| Unexpected auth responses | 0 |
| First-terminal failures | 0 |
| k6 exit / watchdog | 0 / no |

## HTTP endpoint latency (milliseconds)

| Step | Count | Mean | Median | p90 | p95 | p99 | Max |
|---|---|---|---|---|---|---|---|
| cancellation | 713 | 3.864 | 3.959 | 4.652 | 4.841 | 5.54 | 7.327 |
| checkout | 713 | 3.61 | 3.707 | 4.376 | 4.47 | 5.066 | 7.041 |
| detail | 713 | 1.633 | 1.655 | 2.079 | 2.304 | 2.959 | 4.626 |
| final_probe | 713 | 0.726 | 0.678 | 0.972 | 1.177 | 1.522 | 2.544 |
| login | 713 | 0.963 | 0.896 | 1.298 | 1.497 | 2.108 | 3.401 |
| pending_probe | 713 | 0.748 | 0.714 | 0.995 | 1.175 | 1.424 | 1.953 |
| search | 713 | 1.651 | 1.679 | 2.12 | 2.233 | 2.563 | 4.417 |

## Overall latency

| Metric | Mean | Median | p90 | p95 | p99 | Max |
|---|---|---|---|---|---|---|
| HTTP request duration (ms) | 1.885 | 1.422 | 4.088 | 4.377 | 4.806 | 7.327 |
| Lifecycle duration (ms) | 757.147 | 756 | 956 | 984.8 | 1006.64 | 1009 |
| Iteration duration (ms) | 5280.92 | 5294.467 | 6009.064 | 6193.206 | 6439.38 | 6711.525 |

## Interpretation boundary

These are measured endurance values. Interpretation, acceptance thresholds, stable capacity, and cross-scenario conclusions require separate evidence and review.
