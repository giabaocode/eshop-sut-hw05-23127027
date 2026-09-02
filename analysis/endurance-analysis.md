# Endurance / Soak Analysis — WF-03

Run: `performance/results/endurance/20260902T143823+0700/`

Canonical sources are genuine native `endurance-raw.json`, native
`endurance-timeseries.csv`, native summary/runner metadata, and the reproducible
tools under `performance/tools/analysis/`.

## Measured facts

| Metric | Actual value |
|---|---:|
| Workload | 0→5/30s; 5 VUs/12m; 5→0/30s |
| k6 exit / watchdog / wall clock | 0 / no / 784 seconds |
| Workflow attempts / successes / failures | 713 / 713 / 0 |
| HTTP requests / failed / error rate | 4,991 / 0 / 0% |
| Aggregate throughput | 6.372423 requests/s |
| Checks passed / total | 27,094 / 27,094 |
| Orders created / canceled | 713 / 713 |
| Unexpected auth / terminal failures | 0 / 0 |
| HTTP duration mean / median | 1.885093 / 1.422 ms |
| HTTP duration p90 / p95 / p99 / max | 4.088 / 4.377 / 4.8056 / 7.327 ms |
| Lifecycle p95 / p99 / max | 984.8 / 1,006.64 / 1,009 ms |

Endpoint p95/p99 values were: login 1.4968/2.10792 ms, search
2.2326/2.56304 ms, detail 2.3042/2.95944 ms, checkout 4.4698/5.0664 ms,
pending probe 1.1746/1.4242 ms, cancellation 4.8412/5.54044 ms, and final
probe 1.1766/1.52204 ms.

Across complete one-minute steady buckets, the first-half mean RPS was 6.6 and
the second-half mean was 6.636111. Mean bucket p95 changed from 4.45082 ms to
4.085 ms; maximum bucket p95 was 4.51205 ms first-half and 4.38425 ms
second-half. Both halves had zero failed requests. The persistent orders table
grew to 713 rows as expected from the workflow, while all final states were
`canceled` and SQLite integrity remained `ok`.

The genuine midpoint screenshot shows backend PID `53376` at a point-in-time
1.3% CPU, 56.1 MB real memory, and 11 threads. No continuous CPU/memory series
was collected, so memory-leak or CPU-trend conclusions cannot be made from the
single image.

## Interpretation

This local environment empirically sustained **five concurrent VUs for 12
minutes** with 100% complete WF-03 lifecycle success and no transport,
authentication, correlation, business, or lifecycle failures. Throughput and
bucket p95 did not deteriorate in the second half. The demonstrated local
endurance point is therefore **5 VUs / 12 minutes** for this exact commit,
machine, data, and workflow.

The order table's linear growth did not produce observable latency degradation
within 713 rows. Checkout and cancellation were the slowest endpoint groups,
consistent with their SQLite writes, but no confirmed lock contention or SUT
defect appeared at this load.

## Uncertainty

This result is not maximum stable capacity, an endurance guarantee beyond 12
minutes, or a final universal p95/RPS acceptance threshold. It does not measure
multiple machines, network latency, much larger databases, or continuous
resource trends. More duration, repeat runs, and continuous resource telemetry
would be required for stronger claims.
