# Endurance Execution Result

Status: **COMPLETED — GENUINE LOCAL ENDURANCE POINT; NOT MAXIMUM CAPACITY**

Run `20260902T143823+0700` completed the evidence-informed 13-minute schedule
with k6 exit 0 and no watchdog. All 713 workflows succeeded; all 4,991 HTTP
requests and 27,094 checks passed; all 713 created orders reached canceled
state.

The demonstrated local endurance point is five concurrent VUs sustained for 12
minutes on this exact environment. Aggregate p95 was 4.377 ms and p99 4.8056
ms. Native one-minute CSV buckets showed no failed requests or second-half
latency/throughput deterioration. This is not maximum capacity or a final
acceptance threshold.

See [`../analysis/endurance-analysis.md`](../analysis/endurance-analysis.md).
