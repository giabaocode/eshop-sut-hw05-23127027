# Interaction 018 — Invocation-Boundary Review and Fresh Corrected-Pilot Authorization

| Field | Actual record |
|---|---|
| AI tool | Codex CLI |
| Recorded | 2026-09-01 22:35:38 +0700 (Asia/Ho_Chi_Minh) |
| Human gate | H-039 invocation correction approved; one new fresh corrected 2-VU Pilot authorized after exact boundary/provisioning gates |
| Protected original root | `/Users/phamngocgiabao/eshop-sut-hw05-23127027` |
| Prohibited scope | No official Load/Stress/Spike/endurance, thresholds, SUT changes, workflow changes, or push |

## Actual human review and correction

The human reviewed blocked attempt `20260901T221331+0700` and explicitly
confirmed:

> This was a provisioning-helper invocation/setup defect.
>
> It is NOT SUT performance evidence.
>
> It is NOT a confirmed SUT bug.
>
> No k6 traffic occurred.
>
> No account was created.
>
> The failed preflight evidence must remain preserved.

The human approved only this invocation-boundary correction:

> Run the SAME reviewed provisioning helper from the ACTUAL original HW05
> worktree:
>
> `/Users/phamngocgiabao/eshop-sut-hw05-23127027`
>
> and explicitly provide the NEW disposable clone path using:
>
> `WF03_DISPOSABLE_ROOT=<fresh disposable runtime root>`
>
> Do not copy or execute the helper from inside the disposable clone.

The unchanged helper must resolve the protected original root to the path above
and the disposable root to a new absolute `/private/tmp/...` runtime. Before
registration, the two roots and database inodes must differ, the marker must be
exact, the approved commit relationship must be recorded, and original DB hash,
disposable DB path, backend PID/cwd/port ownership, and exact localhost target
must pass. Any failure stops before registration; the guard must not be bypassed
or weakened.

The human required a new runtime, not `20260901T221331+0700` or any earlier
runtime, and retained the one-start ordering: clone; isolation; start backend
once/reset; keep exact PID; invoke helper from the original worktree targeting
the clone; provision/validate exactly customers 01/02; run one corrected 2-VU
Pilot on that same backend; preserve output; stop exact PID; verify integrity.

Account setup remains sequential through the real registration API with secure
private generated passwords, a mode-0600 credential file outside Git, no
secret/JWT audit output, role `user`, unlocked authentication, and zero starting
orders. Any incomplete account/validation pool stops before k6.

If setup passes, the human authorized only the existing 30s ramp 0→2, 3m hold,
30s ramp-down Pilot using the unchanged shared WF-03 workflow and full checks.
All earlier safe-name, context-traffic, unexpected-exception abort, exact-PID
watchdog/exit capture, bounded JSON/summary/log output, no-Pilot-CSV/dashboard,
and deferred-numeric-abort decisions remain mandatory.

The requested evidence includes native JSON and summary, stdout/stderr, exact
commands, numeric exit, timestamps/watchdog, preflight/provisioning/backend/
runtime/checksum records, actual VU/account and correlation/check observations,
and real Pilot metrics where execution occurs. Values must be labeled measured
Pilot values—not official performance, capacity, thresholds, or Load results.

Another failure must be preserved/classified and stop at the appropriate point,
without silent fixes/reruns. Afterward, the exact backend must stop, port 3000
must be free, and the original hash/worktree must remain free of runtime
dependencies, credentials, DB mutation, and secrets.

## Decision recorded before execution

The prior blocked attempt remains preserved. No helper, SUT, business workflow,
check, correlation, metric, workload, or runner semantic change is authorized.
H-040 will review the resulting fresh attempt before any official-plan work.
