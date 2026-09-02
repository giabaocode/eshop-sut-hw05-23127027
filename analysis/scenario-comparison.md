# WF-03 Scenario Comparison

**MEASURED CROSS-SCENARIO VALUES — EACH ROW RETAINS ITS OWN WORKLOAD CONTEXT**

| Scenario | Workflows attempted/succeeded | HTTP total/failed | Aggregate RPS | Mean ms | p95 ms | p99 ms | Max ms | Lifecycle p95 ms | Orders created/canceled |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| load | 345/345 | 2415/0 | 5.731666 | 1.821239 | 4.1019 | 4.69974 | 17.008 | 989.8 | 345/345 |
| stress | 1281/1281 | 8967/0 | 11.877557 | 1.700244 | 3.9147 | 4.45374 | 11.899 | 986 | 1281/1281 |
| spike | 377/377 | 2639/0 | 7.226561 | 1.693911 | 3.9654 | 4.91164 | 16.712 | 987 | 377/377 |
| endurance | 713/713 | 4991/0 | 6.372423 | 1.885093 | 4.377 | 4.8056 | 7.327 | 984.8 | 713/713 |

## Totals

Across the four genuine runs: 2716/2716 complete workflows, 19012 HTTP requests with 0 failed, and 2716/2716 created orders canceled. These totals combine different workload shapes and are evidence counts, not one performance sample.

## Workload-specific observations

- Load: five-VU steady input, overall p95 4.1019 ms and 5.731666 requests/s.
- Stress: stages through 20 VUs, overall p95 3.9147 ms; full 20-VU buckets were approximately 25.93–26.53 requests/s with p95 approximately 3.72–3.75 ms and zero failures.
- Spike: 20-VU peak p95 3.5988 ms versus baseline 4.324 ms and recovery 4.038 ms, with zero failures in every phase.
- Endurance: at five steady VUs, first/second-half mean bucket p95 was 4.45082/4.085 ms and mean RPS 6.6/6.636111, with zero failures.

## Interpretation boundary

The data did not expose a failure knee, capacity ceiling, or sustained degradation within these inputs. Checkout and cancellation are consistently the highest-latency steps, but their low absolute durations and clean outcomes do not establish a bottleneck. Aggregate RPS differs partly because each closed-model schedule spends different time at each VU level and includes user think time. Twenty VUs is not measured capacity, screenshots are point-in-time, and the 5-VU/12-minute endurance point is not a guarantee beyond this local run.
