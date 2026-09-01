# Official Load Runbook

Status: **PREPARED — NOT EXECUTED; HUMAN OFFICIAL FILENAME REQUIRED**

| Item | Approved value |
|---|---|
| Executor | `ramping-vus` |
| Workload | 0→5/1m; 5/5m; 5→0/1m |
| Scheduled duration | 7 minutes |
| Graceful settings | 30s ramp-down and 30s stop |
| Safety cap | 8 minutes (480 seconds) |
| Required preflight pool | Exactly 20 valid accounts |
| Active mapping | VUs 1..5→customers 01..05 |
| Canonical raw | `<OUTPUT_ROOT>/raw/load-raw.json` |
| Primary distinct view | Aggregate stdout/native summary; reviewed real-data Load HTML/equivalent in `report/` |
| k6 logs/evidence | `<OUTPUT_ROOT>/logs/k6.stdout.log`, `<OUTPUT_ROOT>/logs/k6.stderr.log`, `<OUTPUT_ROOT>/evidence/` |
| Backend log | `<SETUP_EVIDENCE_ROOT>/backend.log`, opened before the one backend start |
| Screenshot | `<HUMAN_SELECTED_SCREENSHOT_PATH>`, captured during the five-VU hold |

Execute the full procedure in
[`official-preconditioning.md`](../docs/official-preconditioning.md). After the
human creates the official attributable plan and approves the run, the prepared
runner invocation is:

```sh
/Users/phamngocgiabao/eshop-sut-hw05-23127027/performance/tools/run-official.sh \
  load \
  "<FRESH_DISPOSABLE_RUNTIME_ROOT>" \
  "<MODE_0600_PRIVATE_CREDENTIAL_FILE>" \
  "<HUMAN_CREATED_OFFICIAL_LOAD_PLAN_PATH_IN_RUNTIME>" \
  "/Users/phamngocgiabao/eshop-sut-hw05-23127027/performance/results/load/<ACTUAL_RUN_ID>"
```

The runner records the exact expanded k6 command, PID, numeric exit, timestamps,
watchdog, raw JSON, summary, stdout, and stderr. It does not generate the human
filename or the pending real-data aggregate HTML renderer. During the five-VU
hold, the human captures k6 and exact backend resource usage together as
specified in `official-evidence-capture.md`.
