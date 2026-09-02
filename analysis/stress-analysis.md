# Official Stress Analysis — WF-03

**MEASURED STRESS VALUES — 20 VUs WAS AN INPUT, NOT MEASURED CAPACITY**

Run: `performance/results/stress/20260902T101857+0700/`

Canonical sources are native `stress-raw.json`, native
`stress-timeseries.csv`, native summary/runner metadata, and the reproducible
tools under `performance/tools/analysis/`.

## Aggregate outcome

| Metric | Actual value |
|---|---:|
| k6 exit / watchdog | 0 / no |
| Workflow attempts / successes / failures | 1,281 / 1,281 / 0 |
| HTTP requests / failed | 8,967 / 0 |
| HTTP error rate | 0% |
| Aggregate throughput | 11.877557 requests/s |
| Checks passed / total | 48,678 / 48,678 |
| Orders created / canceled | 1,281 / 1,281 |
| Unexpected auth / terminal failures | 0 / 0 |

Overall HTTP duration was mean 1.700244 ms, median 1.208 ms, p90 3.5994
ms, p95 3.9147 ms, p99 4.45374 ms, and max 11.899 ms. Lifecycle duration
was p95 986 ms and p99 1,006 ms.

## Endpoint p95/p99 (milliseconds)

| Step | p95 | p99 | Max |
|---|---:|---:|---:|
| Login | 1.605 | 2.6822 | 5.136 |
| Search | 1.933 | 2.5374 | 4.24 |
| Detail | 1.909 | 2.518 | 4.551 |
| Checkout | 4.125 | 5.4174 | 11.618 |
| Pending probe | 1.159 | 1.7504 | 4.376 |
| Cancellation | 4.45 | 5.773 | 11.899 |
| Final probe | 1.064 | 1.6404 | 3.42 |

## Native CSV time series

The distinct Stress report uses genuine CSV in 30-second buckets. During the
two full 20-VU buckets:

| Elapsed | Avg/max VUs | RPS | p95 ms | Failed requests |
|---|---:|---:|---:|---:|
| 8:30 | 20 / 20 | 25.933333 | 3.7523 | 0 |
| 9:00 | 20 / 20 | 26.533333 | 3.71925 | 0 |

Workflow starts and completions may cross adjacent buckets, so they are kept as
separate counts rather than treated as per-bucket success rates. Across the
complete run, the one-outcome-per-attempt invariant passed exactly.

## Evidence and interpretation boundary

The genuine 20-VU screenshot shows backend PID `45430` at a point-in-time 4.0%
CPU, 79.9 MB real memory, and 11 threads. The disposable DB ended with 1,281
canceled orders; original integrity remained unchanged.

Within the tested 2→20-VU input range, no transport, auth, correlation,
business, or lifecycle failure and no increasing p95 pattern was observed.
This means degradation was not observed in this run; it does not prove 20 VUs
is maximum stable capacity or establish a final threshold.
