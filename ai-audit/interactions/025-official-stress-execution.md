# Interaction 025 — Official Stress Execution and Screenshot Recovery

| Field | Actual record |
|---|---|
| AI tool | Codex CLI |
| Human gate input | `READY` |
| Human follow-up | `can you check it again i have put screenshot into screenshot folder` |
| Run | Official Stress `20260902T101857+0700` |
| Result | k6 exit 0; 1,281/1,281 workflows |

Codex executed the exact official Stress wrapper against the same one-start
backend PID `45430`. The bounded 12m30s schedule completed in 755 seconds with
watchdog `no`, native JSON and CSV, and exit 0.

The expected Stress screenshot directory was empty after the run. The human
asked Codex to check again. A recent-image search found the genuine file under
the previous Load screenshot directory. Visual inspection proved it was the
Stress capture: 20/20 VUs at 8m50s, backend PID `45430`, 4.0% CPU, 79.9 MB, and
11 threads. Codex moved the unchanged JPEG to the Stress result and made a real
PNG conversion; the path correction is preserved rather than hidden.

Raw analysis measured 1,281/1,281 workflows, 8,967 HTTP requests with zero
failures, 48,678/48,678 checks, 1,281/1,281 orders created/canceled, overall p95
3.9147 ms, p99 4.45374 ms, and 11.877557 requests/s. A distinct 30-second
native-CSV analysis/HTML was generated. These are measurements, not capacity or
final thresholds.

After flush, Codex terminated only PID `45430`, observed session exit 143,
verified port 3000 free, and verified protected original DB hash/integrity.
