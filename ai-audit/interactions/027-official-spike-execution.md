# Interaction 027 — Official Spike Execution

| Field | Actual record |
|---|---|
| AI tool | Codex CLI |
| Human gate input | `READY` |
| Human resume input | `continue where you stopped` |
| Run | Official Spike `20260902T104549+0700` |
| Result | k6 exit 0; 377/377 workflows |

Codex executed the exact official Spike wrapper against the same one-start
backend PID `48405`. The approved 6m05s bounded schedule completed in 367
seconds with watchdog `no`, native granular JSON, native summary, and the real
k6 web-dashboard export.

At the 20-VU peak Codex reported the live progress and exact backend PID. The
human saved a genuine screenshot in the run's screenshot folder. Visual
inspection confirmed 20/20 VUs at 2m59s, PID `48405`, point-in-time 4.0% CPU,
69.0 MB memory, and 11 threads. A genuine PNG conversion was made without
synthesizing or altering the evidence content.

Raw analysis measured 377/377 workflows, 2,639 HTTP requests with zero
failures, 14,326/14,326 checks, 377/377 orders created/canceled, overall p95
3.9654 ms, p99 4.91164 ms, and 7.226561 requests/s. Phase analysis found zero
failures at baseline, rise, peak, fall, and recovery; the 45-second 20-VU peak
was 26.377778 requests/s with p95 3.5988 ms. These are measured facts, not a
capacity or final-threshold conclusion.

After artifact flush, Codex terminated only PID `48405`, observed process exit
143 from SIGTERM, verified port 3000 free, and verified protected original DB
SHA-256/integrity unchanged. Credentials remained private and were not copied
to results, audit, or Git.
