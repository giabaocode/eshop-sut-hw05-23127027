# Interaction 033 — Endurance Execution

| Field | Actual record |
|---|---|
| AI tool | Codex CLI |
| Human screenshot gate | `READY` |
| Run | Endurance `20260902T143823+0700` |
| Result | k6 exit 0; 713/713 workflows |

Codex reverified exact foreground backend PID `53376`, cwd, port, original DB
hash, 20 accounts, and zero orders before starting. The same shared WF-03
implementation ran 0→5 VUs/30s, 5 VUs/12m, and 5→0/30s. It completed in 784
seconds within the 840-second exact-PID cap; the watchdog did not fire.

The human captured a genuine midpoint screenshot in the correct run folder.
Visual inspection confirmed 5/5 VUs at 6m29.9s and Activity Monitor PID
`53376` with point-in-time 1.3% CPU, 56.1 MB memory, and 11 threads. Codex made
a genuine PNG conversion and did not synthesize visual evidence.

Raw analysis measured 713/713 workflows, 4,991 HTTP requests with zero
failures, 27,094/27,094 checks, 713/713 orders created/canceled, p95 4.377 ms,
p99 4.8056 ms, and 6.372423 requests/s. One-minute native-CSV analysis found
first/second-half mean RPS 6.6/6.636111 and mean bucket p95 4.45082/4.085 ms,
both with zero failures. These facts demonstrate 5 VUs sustained for 12 minutes
locally; they do not prove maximum capacity.

After artifact flush, Codex terminated only PID `53376`, observed session exit
143, verified port 3000 free, and verified protected original DB SHA-256 and
integrity unchanged. Credentials remained private and uncommitted.
