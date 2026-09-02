# Official Spike Postflight Evidence

Status: **PASS — REAL OFFICIAL SPIKE ARTIFACTS PRESERVED**

| Field | Actual value |
|---|---|
| Scenario | Official Spike — WF-03 |
| k6 start / exit / flush | `2026-09-02 10:49:21 +0700` / `10:55:28 +0700` / `10:55:28 +0700` |
| Scheduled / observed wall clock | 6m05s / 367 seconds |
| k6 PID / exit | `48766` / `0` |
| Watchdog / runner interruption | `no` / `0` |
| Backend | exact PID `48405`, same process from reset through setup and measured traffic |
| Backend stop | exact PID received `TERM` after flush; process session exit 143; port 3000 free |
| Runtime orders | 377 total, all `canceled` |
| Runtime SQLite integrity | `ok` |
| Protected original DB | SHA-256 unchanged: `c63f00544180ba1fbb1427a9b9dd3f1784842698809972f33ce90482e7420ba6`; integrity `ok` |
| Screenshot | genuine 20/20-VU JPEG plus genuine PNG conversion; Activity Monitor PID `48405` |
| Secrets | credential file remained private outside Git/results |

The genuine k6 web-dashboard export is the scenario's distinct primary view.
No JTL was fabricated and no threshold or capacity conclusion is made here.
