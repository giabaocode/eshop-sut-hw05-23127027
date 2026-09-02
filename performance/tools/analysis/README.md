# k6 Raw-Result Analysis Tools

`analyze-k6.mjs` reads genuine newline-delimited native k6 JSON plus the native
summary and runner metadata. It generates scenario-local JSON, Markdown, and an
aggregate HTML view without external dependencies.

```sh
node performance/tools/analysis/analyze-k6.mjs \
  --scenario load \
  --result-root performance/results/load/<ACTUAL_RUN_ID>
```

Calculated values include workflow outcomes, HTTP/check counts, error rate,
native-summary throughput, raw duration min/max/mean/median/p90/p95/p99,
endpoint latencies, lifecycle/iteration durations, order counters, unexpected
authentication responses, and bounded failure classes/steps. It never invents
missing samples and does not assign acceptance thresholds or capacity.
