# PILOT / RUNTIME VALIDATION — NOT OFFICIAL LOAD RESULT

## Postflight

| Check | Actual result |
|---|---|
| k6 scheduled workload | Completed 4m00s; max 2 VUs; 0 interrupted iterations |
| k6 numeric exit code | **NOT CAPTURED** by the orchestration session; not invented |
| Result flush completion | Approximately `2026-09-01 21:38:43 +0700` |
| External elapsed observation | Approximately 5m19s from documented command start; about 19s over five-minute cap due huge output flushing |
| Backend shutdown | Exact PID 20315 sent Ctrl-C; harness exit code 1 from interrupt |
| Port 3000 | Free after shutdown |
| Disposable DB | `PRAGMA integrity_check=ok`; 4 users; exactly 2 Pilot users; 0 orders |
| Original DB after Pilot | SHA-256 `c63f00544180ba1fbb1427a9b9dd3f1784842698809972f33ce90482e7420ba6`; device/inode `16777234:6621788` |
| Original tracked runtime mutation | None observed |
| Official scenarios | None executed |
| Push/publication | None |

The Pilot failed before HTTP on invalid `::` group names. The first failure was
preserved; no corrected Pilot rerun occurred.
