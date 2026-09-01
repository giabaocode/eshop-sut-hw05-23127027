# Fresh Corrected Pilot Postflight

Recorded: 2026-09-01 22:47:05 +0700

- k6 PID `23298` exited numerically `0`; process/output completion was recorded
  by the exact-PID runner after 246 seconds; watchdog did not fire.
- Backend PID `23201` remained the same from reset through provisioning/Pilot,
  then received Ctrl-C. Its wait wrapper returned 1 from the interrupt.
- PID 23201 no longer existed and port 3000 had no listener.
- Disposable SQLite integrity: `ok`; 4 users, exactly 2 Pilot users, 81 orders,
  all 81 canceled.
- Per-account final state: customer 01 owned 36 canceled orders; customer 02
  owned 45 canceled orders.
- Original SQLite integrity: `ok`; SHA-256 remained
  `c63f00544180ba1fbb1427a9b9dd3f1784842698809972f33ce90482e7420ba6`.
- Original worktree had no `backend/node_modules`, private credential file,
  `.env.local`, runtime DB mutation, or temporary secret.
- Private directory remained mode `0700`; credential CSV remained mode `0600`
  outside Git.
- Full artifact scan found no password field/value, Authorization/Bearer value,
  JWT-shaped token, or private Pilot email. Custom tags contain only bounded
  `scenario=pilot,traffic=pilot` and approved low-cardinality values.
- No official scenario, threshold, or push occurred.
