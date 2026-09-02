# Endurance / Soak Runbook

Status: **PREPARED — REAL EXECUTION AUTHORIZED; SCREENSHOT GATE REMAINS**

Use a fresh no-hardlink clone pinned to the committed endurance design. Start
the disposable backend once, provision and validate 20 accounts outside the
measured stream, then keep that same exact backend PID through execution.
Only VUs/accounts 01..05 are active.

The runner command is:

```sh
/Users/phamngocgiabao/eshop-sut-hw05-23127027/performance/tools/run-official.sh \
  endurance \
  "$WF03_ENDURANCE_RUNTIME_ROOT" \
  "$WF03_ENDURANCE_PRIVATE_ROOT/credentials.local.csv" \
  "$WF03_ENDURANCE_RUNTIME_ROOT/performance/scenarios/endurance.js" \
  "/Users/phamngocgiabao/eshop-sut-hw05-23127027/performance/results/endurance/$WF03_ENDURANCE_RUN_ID"
```

Before starting, verify the original/disposable database boundary and hashes,
marker, source commit, backend PID/port ownership, 20 credentials and logins,
five products, zero orders, at least 2 GiB free, a new output root, and pinned
k6 v2.2.0. Prepare Activity Monitor for the exact backend PID and capture during
the middle of the 12-minute steady interval.

After k6 flushes, record the numeric exit and watchdog result, query order
status and SQLite integrity, preserve evidence, stop only the owned backend
PID, verify port 3000 is free and original DB unchanged, then analyze trends by
time bucket. Never reuse Pilot or official scenario artifacts as endurance
evidence.
