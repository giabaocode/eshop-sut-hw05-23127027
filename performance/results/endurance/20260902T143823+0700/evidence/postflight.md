# Endurance Postflight Evidence

Status: **PASS — REAL ENDURANCE ARTIFACTS PRESERVED**

| Field | Actual value |
|---|---|
| Scenario | Endurance / soak — WF-03 |
| k6 start / exit / flush | `2026-09-02 14:41:01 +0700` / `14:54:05 +0700` / `14:54:05 +0700` |
| Scheduled / observed wall clock | 13m / 784 seconds |
| k6 PID / exit | `53587` / `0` |
| Watchdog / runner interruption | `no` / `0` |
| Backend | exact foreground PID `53376`, same process from reset through setup and measured traffic |
| Backend stop | exact PID received `TERM` after flush; process session exit 143; port 3000 free |
| Runtime orders | 713 total, all `canceled` |
| Runtime SQLite integrity | `ok` |
| Protected original DB | SHA-256 unchanged: `c63f00544180ba1fbb1427a9b9dd3f1784842698809972f33ce90482e7420ba6`; integrity `ok` |
| Screenshot | genuine steady 5/5-VU JPEG plus genuine PNG conversion; Activity Monitor PID `53376` |
| Secrets | credential file remained private outside Git/results |

The result is a measured local endurance point, not maximum capacity or a
universal acceptance threshold.
