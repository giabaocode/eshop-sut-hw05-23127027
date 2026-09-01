# 2-VU k6 Pilot Runbook

Status: **DRAFT — NOT EXECUTED — H-037 HUMAN APPROVAL REQUIRED**

Pinned tool: k6 `v2.2.0` at `/opt/homebrew/bin/k6`

Purpose: validate the real runtime/data/correlation/check/metric/output chain
conservatively before any official Load, Stress, or Spike execution. This pilot
is not an official Load result and must never be reused or relabeled as one.

## 1. Source-derived startup constraint

`backend/server.js` imports `backend/database.js`, and that module drops,
recreates, and seeds the database on every backend process start. Account
provisioning uses the real `POST /api/register` behavior and therefore needs the
backend running. Consequently the safe executable order is:

```text
fresh commit-pinned disposable clone
  → mark and verify disposable boundary
  → hash original database
  → start clone backend once (clone-local reset/seed occurs)
  → prove PID/cwd/port ownership and verify seed/database integrity
  → provision exactly two accounts through registration API
  → validate credentials/role/unlocked/zero orders
  → keep that exact owned backend running
  → begin separate 2-VU k6 pilot
  → preserve pilot evidence
  → stop exact owned backend PID
  → verify original database/hash and repository integrity
```

Stopping and restarting the backend between provisioning and the pilot would
erase the provisioned accounts, so the generic “provision, then start backend”
ordering is not valid for this SUT. Preconditioning still finishes before k6;
registration/login/order-list setup traffic is not part of the k6 process or
its result stream. This source-derived ordering requires H-037 review before it
is executed.

## 2. Hard preflight gates

Before creating or starting anything, the operator must record and verify:

1. explicit H-037 approval for this exact pilot only;
2. the reviewed Phase G commit hash; do not use an invented date or official
   assignment plan filename;
3. branch/remotes/push target and a clean intended source snapshot;
4. original `backend/database.sqlite` path, SHA-256, inode/device, and Git status;
5. no listener on port 3000 and no stale owned process;
6. at least 2 GiB free disk;
7. pinned `/opt/homebrew/bin/k6` reports v2.2.0/arm64;
8. a fresh `mktemp -d` parent below `/private/tmp`, with a no-hardlink clone
   checked out at the exact approved commit;
9. clone database and original database are different paths and inodes;
10. a clone-root `.wf03-disposable-runtime` marker whose exact content is
    `WF03_DISPOSABLE_RUNTIME` followed by one newline;
11. a separate mode-0700 private directory under `/private/tmp`, outside both
    the original and clone worktrees;
12. a unique pilot evidence directory labelled `pilot`, never `load`.

Any failed gate stops setup. Do not delete/reset the original repository,
change workload, lower account count silently, or take over an unknown port.

## 3. Disposable SUT and setup-only provisioning

Run the clone's normal backend start command only from the verified clone.
Capture its exact PID, command, cwd, start time, and stdout/stderr. After port
3000 opens, use `lsof`/process evidence to prove the listener belongs to that
PID and its cwd is the disposable clone. Re-hash the original database.

Verify the clone-local reset has exactly the expected seeded users and five
seeded products, zero orders, and valid SQLite integrity. Do not record seeded
or generated passwords in evidence.

The draft helper is:

```text
performance/tools/provision-accounts.mjs
```

It must be invoked from the reviewed commit with these private parameters
provided as environment values, not pasted into a report:

- `WF03_BASE_URL=http://127.0.0.1:3000`;
- `WF03_ACCOUNT_COUNT=2`;
- `WF03_DISPOSABLE_ROOT=<verified clone root>`;
- `WF03_PRIVATE_DIR=<separate private mode-0700 directory>`.

The helper must remain setup-only. It sequentially registers accounts 01 and
02, generates cryptographically random passwords in memory, validates login,
role=user, unlocked state, and empty `my-orders`, writes the credential CSV
mode 0600 outside Git, and emits redacted evidence. It must not be run if the
PID/cwd/port/database relationship is unproven. Do not display the private CSV.

After helper success, independently require:

- exactly keys `wf03-customer-01` and `wf03-customer-02`;
- deterministic approved emails and private non-placeholder passwords;
- two successful setup logins, both role `user`, unlocked;
- no orders for either account;
- the five exact seeded products and valid positive prices;
- public manifest schema/count/key/search/product/address validation;
- SQLite integrity and unchanged original repository database.

Any incomplete account pool is **FAIL PREFLIGHT**. Never modulo-wrap, share an
account, use the seeded user as fallback, reduce to one VU, or fabricate data.

## 4. Prepared pilot workload

Internal draft entry: `performance/scenarios/pilot.js`.

| Stage | Duration | Target |
|---:|---:|---:|
| Ramp | 30s | 2 VUs |
| Hold | 3m | 2 VUs |
| Ramp down | 30s | 0 VUs |

The scheduled duration is 4 minutes, maximum is 2 VUs, and external wall-clock
safety cap is 5 minutes. It calls the same `executeWf03()` as all official
scenarios and uses accounts 01..02 directly through `exec.vu.idInTest`.
Pilot samples are tagged `scenario=pilot,traffic=pilot` so they cannot be
mistaken for official `traffic=measured` samples.

## 5. Execution and evidence plan — not authorized yet

After all setup evidence is complete, record a boundary timestamp, then invoke
the pinned binary with explicit k6 `-e` target and private credential-file
values. Do not print the credential file or the full environment. Use only the
pilot entry and an output directory whose name identifies it as non-official.

Preserve genuine pilot-only artifacts:

- native granular k6 JSON;
- captured stdout/stderr and exit status;
- enabled custom/end summary with real pilot metrics;
- options/commit/tool/runtime manifest and SHA-256 checksums;
- if explicitly enabled for the pilot, real CSV/dashboard capability and
  overhead observations clearly labelled pilot;
- backend PID/log/resource evidence with secrets and dynamic IDs redacted;
- preflight and postflight integrity records.

Do not use `--summary-mode=disabled` when a `handleSummary()` artifact is
required on pinned k6 2.2.0. Do not create `.jtl`, official report folders,
Load/Stress/Spike results, performance acceptance claims, or final thresholds.

Individual workflow failures remain classified and visible. The four numeric
abort proposals stay deferred. Stop the test only for the already approved
confirmed unsafe/invalid conditions or the five-minute wall-clock cap.

## 6. Shutdown and preservation

Stop only the exact PID recorded as owned by this run. Confirm port 3000 closes.
Preserve evidence before any disposable reset/removal. Recheck original DB
SHA-256/inode/Git status and confirm no credentials entered Git. Cleanup of the
disposable/private directories is a later explicit, exact-path action after
evidence preservation; this runbook does not authorize broad deletion.

## 7. Manual official-filename checklist

The pilot keeps the internal `pilot.js` name. Before each later official run,
the student must explicitly approve/create the attributable filename:

```text
23127027_{ScenarioType}_{ACTUAL-YYYYMMDD}
```

Checklist: actual execution date; exact `Load|Stress|Spike` spelling required
by the PDF; student ID `23127027`; reviewed commit; no predicted/backdated date;
no auto-generated official filename. This checklist does not create any such
file now.
