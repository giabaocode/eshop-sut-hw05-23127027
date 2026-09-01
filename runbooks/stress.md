# Official Stress Runbook

Status: **PREPARED — NOT EXECUTED; HUMAN OFFICIAL FILENAME REQUIRED**

| Stage | Duration | Target VUs |
|---:|---:|---:|
| Warm ramp | 30s | 2 |
| Hold | 1m | 2 |
| Ramp / hold | 1m / 1m | 5 / 5 |
| Ramp / hold | 1m / 1m | 10 / 10 |
| Ramp / hold | 1m / 1m | 15 / 15 |
| Ramp / hold | 1m / 1m | 20 / 20 |
| Recovery ramp / hold | 1m / 1m | 5 / 5 |
| Final ramp-down | 1m | 0 |

- Scheduled duration: exactly 12m30s.
- Maximum planned input: 20 VUs, not measured capacity.
- Graceful settings: 30s ramp-down and 30s stop.
- Safety cap: 14 minutes (840 seconds).
- Required/active pool: exactly customers 01..20, dedicated without sharing.
- Canonical raw: `<OUTPUT_ROOT>/raw/stress-raw.json`.
- Primary distinct view: native
  `<OUTPUT_ROOT>/raw/stress-timeseries.csv` and a reviewed real-data
  time-series HTML/equivalent under `report/`.
- k6 stdout/stderr: `<OUTPUT_ROOT>/logs/k6.stdout.log` and
  `<OUTPUT_ROOT>/logs/k6.stderr.log`; runner evidence is under
  `<OUTPUT_ROOT>/evidence/`.
- Backend log: `<SETUP_EVIDENCE_ROOT>/backend.log`, opened before the one
  backend start. Human screenshot path is selected at execution time.

After fresh preconditioning, human filename creation, and per-run approval:

```sh
/Users/phamngocgiabao/eshop-sut-hw05-23127027/performance/tools/run-official.sh \
  stress \
  "<FRESH_DISPOSABLE_RUNTIME_ROOT>" \
  "<MODE_0600_PRIVATE_CREDENTIAL_FILE>" \
  "<HUMAN_CREATED_OFFICIAL_STRESS_PLAN_PATH_IN_RUNTIME>" \
  "/Users/phamngocgiabao/eshop-sut-hw05-23127027/performance/results/stress/<ACTUAL_RUN_ID>"
```

The runner additionally writes native CSV; it does not fabricate JTL or create
the pending reviewed CSV-to-analysis renderer. The human should capture the
tool and exact backend resource view during the highest valid stage, preferably
the 20-VU hold, without hiding an earlier stop or exposing secrets.
