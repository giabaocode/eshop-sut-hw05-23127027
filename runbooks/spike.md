# Official Spike Runbook

Status: **OFFICIAL SPIKE COMPLETED — RUN `20260902T104549+0700`**

| Stage | Duration | Target VUs |
|---:|---:|---:|
| Baseline ramp | 30s | 3 |
| Baseline observation | 2m | 3 |
| Sudden rise | 10s | 20 |
| Spike hold | 45s | 20 |
| Sudden fall | 10s | 3 |
| Recovery observation | 2m | 3 |
| Final ramp-down | 30s | 0 |

- Scheduled duration: exactly 6m5s.
- Maximum planned input: 20 VUs, not measured capacity.
- Graceful settings: 30s ramp-down and 30s stop.
- Safety cap: 7 minutes (420 seconds).
- Required/active pool: exactly customers 01..20, dedicated without sharing.
- Canonical raw: `<OUTPUT_ROOT>/raw/spike-raw.json`.
- Primary distinct view: real k6 web-dashboard export at
  `<OUTPUT_ROOT>/report/spike-dashboard.html`.
- k6 stdout/stderr: `<OUTPUT_ROOT>/logs/k6.stdout.log` and
  `<OUTPUT_ROOT>/logs/k6.stderr.log`; runner evidence is under
  `<OUTPUT_ROOT>/evidence/`.
- Backend log: `<SETUP_EVIDENCE_ROOT>/backend.log`, opened before the one
  backend start. Human screenshot path is selected at execution time.

After fresh preconditioning, human filename creation, and per-run approval:

```sh
/Users/phamngocgiabao/eshop-sut-hw05-23127027/performance/tools/run-official.sh \
  spike \
  "<FRESH_DISPOSABLE_RUNTIME_ROOT>" \
  "<MODE_0600_PRIVATE_CREDENTIAL_FILE>" \
  "<HUMAN_CREATED_OFFICIAL_SPIKE_PLAN_PATH_IN_RUNTIME>" \
  "/Users/phamngocgiabao/eshop-sut-hw05-23127027/performance/results/spike/<ACTUAL_RUN_ID>"
```

The runner uses pinned k6 dashboard export plus native JSON and records exact
PID/exit/watchdog evidence. The human should arrange Activity Monitor before
the rapid rise and capture the 20-VU hold with k6/dashboard context and exact
backend resource usage in the same frame.

## Preserved preflight checkpoint

Fresh runtime `/private/tmp/eshop-hw05-spike.21Nvt8/runtime` is pinned to
`eeb02fb83216dfdb6db2c028295f7f5804ee0722`; exact backend PID is `48405`.
Exactly 20 accounts passed setup with zero orders. At this checkpoint the
planned result root `performance/results/spike/20260902T104549+0700/` was still
absent, and Activity Monitor/capture framing had to be ready before the
45-second peak. The run later completed and its genuine result is documented in
`docs/official-spike-results.md`; this preserved preflight makes no capacity
claim.
