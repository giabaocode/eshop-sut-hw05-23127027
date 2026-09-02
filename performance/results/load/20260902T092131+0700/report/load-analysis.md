# Load Raw-Result Analysis

**MEASURED SCENARIO VALUES — DERIVED FROM GENUINE NATIVE K6 JSON**

Source: `/Users/phamngocgiabao/eshop-sut-hw05-23127027/performance/results/load/20260902T092131+0700/raw/load-raw.json` and `/Users/phamngocgiabao/eshop-sut-hw05-23127027/performance/results/load/20260902T092131+0700/raw/load-summary.json`. No final acceptance threshold or capacity claim is made.

## Outcome

| Metric | Measured value |
|---|---|
| Workflow attempts | 345 |
| Workflow successes | 345 |
| Workflow failures | 0 |
| Workflow success rate | 100% |
| HTTP requests | 2415 |
| HTTP failed requests | 0 |
| HTTP error rate | 0% |
| Throughput | 5.732 requests/s |
| Checks passed / total | 13110 / 13110 |
| Orders created / canceled | 345 / 345 |
| Unexpected auth responses | 0 |
| First-terminal failures | 0 |
| k6 exit / watchdog | 0 / no |

## HTTP endpoint latency (milliseconds)

| Step | Count | Mean | Median | p90 | p95 | p99 | Max |
|---|---|---|---|---|---|---|---|
| cancellation | 345 | 3.604 | 3.679 | 4.387 | 4.647 | 5.463 | 17.008 |
| checkout | 345 | 3.468 | 3.579 | 4.227 | 4.413 | 5.606 | 8.138 |
| detail | 345 | 1.554 | 1.588 | 1.932 | 2.071 | 2.565 | 3.029 |
| final_probe | 345 | 0.732 | 0.673 | 1.003 | 1.126 | 1.597 | 1.971 |
| login | 345 | 1.05 | 0.908 | 1.482 | 1.613 | 2.357 | 5.253 |
| pending_probe | 345 | 0.776 | 0.715 | 1.071 | 1.245 | 1.693 | 2.303 |
| search | 345 | 1.566 | 1.6 | 1.929 | 2.121 | 2.538 | 3.048 |

## Overall latency

| Metric | Mean | Median | p90 | p95 | p99 | Max |
|---|---|---|---|---|---|---|
| HTTP request duration (ms) | 1.821 | 1.427 | 3.827 | 4.102 | 4.7 | 17.008 |
| Lifecycle duration (ms) | 752.42 | 730 | 966.2 | 989.8 | 1005.12 | 1011 |
| Iteration duration (ms) | 5238.45 | 5215.879 | 5978.776 | 6097.638 | 6422.231 | 6735.234 |

## Interpretation boundary

These are measured load values. Interpretation, acceptance thresholds, stable capacity, and cross-scenario conclusions require separate evidence and review.
