# Endurance Preflight Failure — No k6 Traffic

Status: **BLOCKED — WRONG LOCALHOST LISTENER; HUMAN ACTION REQUIRED**

At 2026-09-02 14:18–14:23 +0700, fresh runtime
`/private/tmp/eshop-hw05-endurance.E1yKbJ/runtime` was pinned to `54848d2`.
Its first backend launch encountered a short native-binding build race. A
subsequent launch initialized/reset the disposable DB and printed startup
lines, but the tool-owned command session exited and did not retain that
listener.

Before provisioning, a combined shell command printed the actual port owner
and then continued to invoke the helper. Its read-only output showed PID
`52187`, cwd `/Users/phamngocgiabao/eshop-sut/backend`, but the command was not
guarded to stop after that mismatch. This was an AI orchestration/preflight
defect. The helper safely validated its filesystem arguments, but its HTTP
target was only `127.0.0.1:3000`; it therefore registered exactly 20 accounts
against the wrong already-running local SUT.

## Read-only observed state

| Target | Observed fact |
|---|---|
| Port owner | PID `52187`, started 2026-09-02 14:18:47 +0700, parent process associated with Antigravity IDE |
| Unexpected listener cwd | `/Users/phamngocgiabao/eshop-sut/backend` |
| Disposable DB | integrity `ok`; 2 users; **0 WF-03 accounts**; 0 orders |
| Unexpected listener DB | integrity `ok`; 62 users; **20 WF-03 accounts**; 3 orders; post-event SHA-256 `aef336e7d1f8566fd19d98a87d9f91ba5cd1434e0d26af2309abd53633095bc5` |
| Protected HW05 DB | integrity `ok`; 2 users; 3 orders; unchanged SHA-256 `c63f00544180ba1fbb1427a9b9dd3f1784842698809972f33ce90482e7420ba6` |
| Private credentials | mode 0600 under `/private/tmp`; not printed or committed |
| k6 traffic/results | **none** |

Codex did not kill the unowned PID, reset or edit the unexpected database, or
continue to endurance traffic. The affected 20 synthetic accounts remain in
that other local database pending explicit human direction. Any eventual run
must use another fresh runtime and an atomic fail-closed port/cwd check before
registration.
