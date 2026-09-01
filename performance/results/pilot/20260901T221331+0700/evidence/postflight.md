# Corrected Pilot Blocked-Attempt Postflight

Recorded: 2026-09-01 22:15:58 +0700

- Exact owned backend PID `22146` was interrupted and its runner returned 1
  from Ctrl-C.
- Port 3000 had no listener afterward.
- Disposable SQLite integrity: `ok`.
- Disposable state: 2 seed users, 0 Pilot users, 0 orders.
- Private directory remained mode `0700` and contained no credential/evidence
  file because the helper failed before output creation.
- Original SQLite integrity: `ok`.
- Original database SHA-256 remained
  `c63f00544180ba1fbb1427a9b9dd3f1784842698809972f33ce90482e7420ba6`.
- No k6 process was started; therefore no k6 PID, command, exit code, raw JSON,
  workflow metric, or HTTP measurement exists for this blocked attempt.
- No official scenario and no push occurred.
