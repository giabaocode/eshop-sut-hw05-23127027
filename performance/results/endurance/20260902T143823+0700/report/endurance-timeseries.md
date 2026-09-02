# Endurance Native-CSV Time-Series Analysis

**MEASURED ENDURANCE TIME SERIES — DERIVED FROM GENUINE NATIVE K6 CSV**

60-second buckets. This is bounded local evidence, not maximum capacity.

| Elapsed | Avg VUs | RPS | p95 ms | p99 ms | Failed | Workflows | Created | Canceled | Cumulative orders |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 0:00 | 3.5 | 4.7 | 4.6266 | 5.06757 | 0 | 38 | 40 | 38 | 40 |
| 1:00 | 5 | 6.5 | 4.49725 | 4.99506 | 0 | 56 | 55 | 56 | 95 |
| 2:00 | 5 | 6.666667 | 4.51205 | 4.95922 | 0 | 57 | 57 | 57 | 152 |
| 3:00 | 5 | 6.45 | 4.4391 | 5.05086 | 0 | 55 | 55 | 55 | 207 |
| 4:00 | 5 | 6.733333 | 4.3294 | 4.6875 | 0 | 58 | 59 | 58 | 266 |
| 5:00 | 5 | 6.65 | 4.4763 | 4.84762 | 0 | 58 | 56 | 58 | 322 |
| 6:00 | 5 | 6.6 | 4.38425 | 4.78845 | 0 | 56 | 56 | 56 | 378 |
| 7:00 | 5 | 6.6 | 4.2965 | 4.6637 | 0 | 56 | 57 | 56 | 435 |
| 8:00 | 5 | 6.65 | 4.11 | 4.45726 | 0 | 57 | 58 | 57 | 493 |
| 9:00 | 5 | 6.683333 | 3.798 | 4.201 | 0 | 58 | 56 | 58 | 549 |
| 10:00 | 5 | 6.766667 | 3.95925 | 4.25655 | 0 | 58 | 58 | 58 | 607 |
| 11:00 | 5 | 6.516667 | 3.962 | 4.5204 | 0 | 55 | 56 | 55 | 663 |
| 12:00 | 4.166667 | 5.6 | 4.46175 | 5.0246 | 0 | 50 | 49 | 50 | 712 |
| 13:00 | 1 | 0.066667 | 3.04395 | 3.21999 | 0 | 1 | 1 | 1 | 713 |

## Steady-window half comparison

```json
{
  "first_half": {
    "bucket_count": 5,
    "mean_rps": 6.6,
    "mean_bucket_p95_ms": 4.45082,
    "max_bucket_p95_ms": 4.51205,
    "failed_requests": 0
  },
  "second_half": {
    "bucket_count": 6,
    "mean_rps": 6.636111,
    "mean_bucket_p95_ms": 4.085,
    "max_bucket_p95_ms": 4.38425,
    "failed_requests": 0
  }
}
```
