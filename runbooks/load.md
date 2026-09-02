# Official Load Runbook

Status: **OFFICIAL LOAD COMPLETED — RUN `20260902T092131+0700`**

| Item | Approved value |
|---|---|
| Executor | `ramping-vus` |
| Workload | 0→5/1m; 5/5m; 5→0/1m |
| Scheduled duration | 7 minutes |
| Graceful settings | 30s ramp-down and 30s stop |
| Safety cap | 8 minutes (480 seconds) |
| Executable source snapshot | `90fb1ae` or a later human-reviewed commit with identical executable files |
| Official entry | `performance/scenarios/official/23127027_Load_20260901.js` |
| Required preflight pool | Exactly 20 valid accounts |
| Active mapping | VUs 1..5→customers 01..05 |
| Canonical raw | `<OUTPUT_ROOT>/raw/load-raw.json` |
| Primary distinct view | Aggregate stdout/native summary; reviewed real-data Load HTML/equivalent in `report/` |
| k6 logs/evidence | `<OUTPUT_ROOT>/logs/k6.stdout.log`, `<OUTPUT_ROOT>/logs/k6.stderr.log`, `<OUTPUT_ROOT>/evidence/` |
| Backend log | Private setup path during execution, then `<OUTPUT_ROOT>/logs/backend.log` after shutdown/redaction review |
| Screenshot | `<OUTPUT_ROOT>/evidence/screenshots/load-k6-backend-resource.png`, captured by the human during the five-VU hold |

These values are human-approved test inputs, not measured capacity or final
performance thresholds.

## 1. Actual-run identifiers and paths

Immediately before setup, the human/operator records one real local timestamp
in the form `YYYYMMDDTHHMMSS+0700` as `WF03_LOAD_RUN_ID`. Do not predict it in
advance. The resulting path contract is:

```text
WF03_LOAD_RUNTIME_ROOT=<new /private/tmp/.../runtime clone>
WF03_LOAD_PRIVATE_ROOT=<new mode-0700 /private/tmp/.../private directory>
WF03_LOAD_SETUP_ROOT=<WF03_LOAD_PRIVATE_ROOT>/setup
WF03_LOAD_RESULT_ROOT=/Users/phamngocgiabao/eshop-sut-hw05-23127027/performance/results/load/<WF03_LOAD_RUN_ID>
```

`WF03_LOAD_RESULT_ROOT` must not exist when the official runner starts. Pilot
paths under `performance/results/pilot/` are never accepted as inputs or copied
as Load evidence.

## 2. Fresh one-start runtime and account setup

Execute the full procedure in
[`official-preconditioning.md`](../docs/official-preconditioning.md), restricted
to Load. Required order:

```text
record source/original DB/disk/port evidence
→ fresh commit-pinned no-hardlink clone and disposable marker
→ prove different roots/database inodes
→ start clone backend exactly once and capture its exact PID/log
→ verify normal clone-local reset/reseed, SQLite integrity, five products,
  and zero orders
→ invoke the unchanged helper from the original worktree with account count 20
→ validate exactly customers 01..20, credentials, role, unlocked state,
  successful login, zero orders, public rows, products, and positive prices
→ confirm screenshot/resource-monitor readiness
→ mark setup-finished/measured-traffic-start boundary
→ run official Load on the same backend process
→ preserve/scan/hash evidence
→ stop exact backend PID and verify port/original integrity
```

The exact prepared setup-only helper invocation is:

```sh
WF03_BASE_URL=http://127.0.0.1:3000 \
WF03_ACCOUNT_COUNT=20 \
WF03_DISPOSABLE_ROOT="$WF03_LOAD_RUNTIME_ROOT" \
WF03_PRIVATE_DIR="$WF03_LOAD_PRIVATE_ROOT" \
node /Users/phamngocgiabao/eshop-sut-hw05-23127027/performance/tools/provision-accounts.mjs
```

Provisioning and its validation finish before measured k6 starts. The private
credential file remains mode 0600 outside both Git worktrees. Load uses only
accounts 01..05 through guarded `exec.vu.idInTest`; the other 15 accounts prove
the complete approved pool and remain inactive.

## 3. Exact planned Load runner command

Only after the human approves execution and all preflight gates pass:

```sh
/Users/phamngocgiabao/eshop-sut-hw05-23127027/performance/tools/run-official.sh \
  load \
  "$WF03_LOAD_RUNTIME_ROOT" \
  "$WF03_LOAD_PRIVATE_ROOT/credentials.local.csv" \
  "$WF03_LOAD_RUNTIME_ROOT/performance/scenarios/official/23127027_Load_20260901.js" \
  "/Users/phamngocgiabao/eshop-sut-hw05-23127027/performance/results/load/$WF03_LOAD_RUN_ID"
```

The runner verifies the exact filename shape, disposable marker, private-file
location/mode/schema/20-row count, disk minimum, and new output root. It starts
only its owned k6 child, records numeric exit/timestamps, and enforces the
480-second exact-PID cap. It does not start or stop the backend.

## 4. Planned genuine artifact map

| Artifact | Planned path below `<OUTPUT_ROOT>` |
|---|---|
| Native granular k6 JSON | `raw/load-raw.json` |
| Native aggregate summary JSON | `raw/load-summary.json` |
| Captured aggregate console view | `logs/k6.stdout.log` |
| k6 stderr | `logs/k6.stderr.log` |
| Exact expanded command | `evidence/k6-command.txt` |
| PID/exit/start/end/flush/watchdog metadata | `evidence/runner-metadata.txt` |
| Backend log after shutdown review | `logs/backend.log` |
| Redacted preflight/provisioning/runtime evidence | `evidence/setup/` |
| Human screenshot | `evidence/screenshots/load-k6-backend-resource.png` |
| Load aggregate report directory | `report/` |
| Real-data aggregate HTML/equivalent target | `report/load-aggregate.html` |
| Artifact checksums | `evidence/SHA256SUMS` |

The runner creates the raw/report/log/evidence directories only during a real
run. `load-aggregate.html` must be derived transparently from the genuine Load
summary/raw data after those inputs exist; it must not be fabricated now. After
the backend stops, copy only reviewed non-secret setup/backend evidence from the
private setup root into the result paths, then compute SHA-256 over every
preserved artifact and record generator commands/versions.

## 5. Human screen readiness gate

Before the measured command starts, the human must already have the official
k6 terminal and Activity Monitor arrangement described in
[`official-evidence-capture.md`](official-evidence-capture.md). Record the exact
backend PID that owns `127.0.0.1:3000`; do not watch an unrelated `node` or the
k6 PID. If the screen is not ready, wait—do not restart the backend after
provisioning.

## 6. Static preflight result

Recorded 2026-09-02 before any official runtime setup or traffic:

| Gate | Static result |
|---|---|
| Official filename and location | PASS — exact human-created `23127027_Load_20260901.js` under `performance/scenarios/official/` |
| Wrapper initialization | PASS — pinned k6 v2.2.0, external synthetic credentials, no HTTP |
| Shared workflow | PASS — thin wrapper calls the same `executeWf03()` as the internal Load entry; normalized diff is empty |
| Workload | PASS — ramping VUs 0→5/1m, 5/5m, 5→0/1m; 30s graceful settings |
| Account mapping | PASS by static contract — VUs 1..5 map to rows/accounts 01..05; runtime still requires exactly 20 validated rows |
| Runner arguments | PASS — five-argument order and exact disposable/private/official/result path boundaries match `run-official.sh` |
| Output separation | PASS — new timestamped `performance/results/load/` root; no Pilot path accepted |
| Performance thresholds | PASS — none configured |
| Deferred numeric abort rules | PASS — none enabled |
| Secret/dynamic-ID scan | PASS — no credential, JWT, product ID, price, or order ID is hard-coded in the wrapper |
| Runtime preflight and provisioning | NOT EXECUTED — requires the next human checkpoint |
| Official Load traffic and evidence | NOT EXECUTED / NOT CAPTURED |

This is a static readiness finding only. It is not evidence that the future
20-account setup, backend, measured workflow, output flush, or report generation
will pass at runtime.

## 7. Current authorized run checkpoint

Official run ID `20260902T092131+0700` passed the real preflight recorded in
[`official-load-preflight.md`](../docs/official-load-preflight.md). The exact
one-start backend PID is `42059`; the complete 20-account pool is valid and the
starting order count is zero. The runner/result root has not been started or
created. Execution is paused only for the genuine macOS screenshot-readiness
gate, not for another technical-design approval.

## 8. Execution outcome

The human replied `READY` and captured real Load/backend-resource evidence.
Official Load completed with k6 exit 0, watchdog `no`, 345/345 workflow success,
zero of 2,415 failed HTTP requests, and 345/345 created orders canceled. Exact
artifacts and postflight are under
`performance/results/load/20260902T092131+0700/`; measured analysis is in
[`../analysis/load-analysis.md`](../analysis/load-analysis.md). This result does
not establish final thresholds or capacity.
