# Official Load Postflight Evidence

Status: **PASS — REAL OFFICIAL LOAD ARTIFACTS PRESERVED**

| Field | Actual value |
|---|---|
| Scenario | Official Load — WF-03 |
| k6 start / process exit / flush | `2026-09-02 10:03:20 +0700` / `10:10:22 +0700` / `10:10:22 +0700` |
| Scheduled / observed wall clock | 7 minutes / 422 seconds |
| k6 PID / exit | `43262` / `0` |
| Watchdog / runner interruption | `no` / `0` |
| Backend | exact owned PID `42059`, same from reset through setup and measured traffic |
| Backend stop | exact PID received `TERM` after artifact flush; process session exit `143`; port 3000 verified free |
| Runtime orders | 345 total, 345 `canceled`, five distinct active users |
| Runtime SQLite integrity | `ok` |
| Protected original DB | SHA-256 unchanged: `c63f00544180ba1fbb1427a9b9dd3f1784842698809972f33ce90482e7420ba6`; integrity `ok` |
| Screenshot | genuine JPEG captured during 5-VU traffic plus genuine PNG conversion; Activity Monitor shows PID `42059` |
| Secrets | credential file remained outside Git/results; result scan required before commit |

The non-escalated post-run signal probe could not signal the outside-sandbox
backend and was initially interpreted as an exited process. A subsequent port
check proved PID `42059` still owned port 3000. Codex then terminated only that
exact PID after k6 flush. This diagnostic correction did not affect measured
traffic or artifacts.
