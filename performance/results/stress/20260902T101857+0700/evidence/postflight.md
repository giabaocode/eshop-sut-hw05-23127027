# Official Stress Postflight Evidence

Status: **PASS — REAL OFFICIAL STRESS ARTIFACTS PRESERVED**

| Field | Actual value |
|---|---|
| Scenario | Official Stress — WF-03 |
| k6 start / exit / flush | `2026-09-02 10:24:36 +0700` / `10:37:11 +0700` / `10:37:11 +0700` |
| Scheduled / observed wall clock | 12m30s / 755 seconds |
| k6 PID / exit | `45769` / `0` |
| Watchdog / runner interruption | `no` / `0` |
| Backend | exact PID `45430`, same from reset through setup and measured traffic |
| Backend stop | exact PID received `TERM` after flush; process session exit 143; port 3000 free |
| Runtime orders | 1,281 total, all `canceled` |
| Runtime SQLite integrity | `ok` |
| Protected original DB | SHA-256 unchanged: `c63f00544180ba1fbb1427a9b9dd3f1784842698809972f33ce90482e7420ba6`; integrity `ok` |
| Screenshot | genuine 20/20-VU JPEG plus genuine PNG conversion; Activity Monitor PID `45430` |
| Secrets | credential file remained private outside Git/results |

The human initially saved the Stress JPEG under the prior Load screenshot
directory. Codex found it by timestamp, visually verified genuine Stress/PID/
20-VU content, moved the unchanged JPEG to this Stress result, and generated the
PNG using `sips`. No screenshot was synthesized or relabeled by extension.
