# Interaction 021 — Wrapper Path Correction and Official Load Preparation

| Field | Actual record |
|---|---|
| AI tool | Codex CLI |
| Human approval | Received 2026-09-01 (Asia/Ho_Chi_Minh) |
| Continued record | 2026-09-02 09:05:14 +0700 |
| Human-approved source change | Only relative path depth in three official wrappers |
| Conditional continuation | Prepare official Load only after all three wrappers pass |
| Prohibited scope | No backend, official accounts, Load/Stress/Spike/endurance traffic, thresholds, screenshot fabrication, or push |

## Actual human approval

The human reviewed the missing-module result and approved the exact correction
from `../` to `../../` for the two config imports, two library imports, and
public `workflow.csv` path in all three wrappers. The human required the three
filenames and every scenario/workflow/check/correlation/metric/tag/safety/data
semantic to remain unchanged. Any other difference had to stop the work.

After successful validation, the human authorized staging/committing the three
human-created wrappers and resuming official Load preparation only. The Load
workload remains 0→5 VUs/1m, five VUs/5m, 5→0/1m, 30-second graceful settings,
seven-minute schedule, eight-minute cap, accounts 01..05 active, and a complete
20-account preflight pool. No execution was authorized.

## Actual correction and validation

Codex changed only the five approved path strings in each wrapper. Pinned k6
v2.2.0 initialized all three using an ephemeral external mode-0600 synthetic
credential file. Inspection showed exact workloads, `traffic=measured`, and
`thresholds=null`. All wrappers call the shared `executeWf03()` and contain no
endpoint/check business logic, hard-coded dynamic ID, credential, or secret.

After replacing only `../../` with `../` for comparison, each official wrapper
had an empty diff against its internal counterpart. The synthetic file was
deleted, no HTTP was sent, and no port 3000 listener existed.

The staged set contained exactly the three human-named wrappers. Secret scans
passed. Local commit `90fb1ae` (`test: add human-named official k6 wrappers`)
was created and not pushed.

## Load-only preparation outcome

Codex updated the Load runbook with the exact official entry, source snapshot,
fresh one-start clone/setup sequence, 20-account helper/validation contract,
actual timestamp-based result-root rule, exact runner command, native JSON and
summary/log/backend/preflight/report/checksum paths, 480-second exact-PID cap,
and macOS resource-evidence timing. Account-lockout handling remains awaiting
H-009 confirmation, and the real screenshot/hardware tasks remain human-only.

No actual run timestamp/path was claimed, no result/report/screenshot was
created, and no backend/account/k6 traffic occurred.
