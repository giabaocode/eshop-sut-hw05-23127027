# Official Load Preflight Evidence

Status: **PASS — MEASURED LOAD TRAFFIC NOT STARTED**

Recorded: 2026-09-02 09:21:31 +0700

| Field | Actual value |
|---|---|
| Run ID reserved for this actual setup | `20260902T092131+0700` |
| Planned result root (must remain absent until runner starts) | `/Users/phamngocgiabao/eshop-sut-hw05-23127027/performance/results/load/20260902T092131+0700` |
| Source commit | `e28da7b813d69c1eadfd799d309fb396170a71e0` |
| Protected original root | `/Users/phamngocgiabao/eshop-sut-hw05-23127027` |
| Disposable runtime | `/private/tmp/eshop-hw05-load.24cMIo/runtime` |
| Private credential root | `/private/tmp/eshop-hw05-load.24cMIo/private-official` (mode 0700) |
| Backend | PID `42059`, cwd `/private/tmp/eshop-hw05-load.24cMIo/runtime/backend`, owned listener on port 3000 |
| Measured client target | `http://127.0.0.1:3000` only |
| Original DB SHA-256 | `c63f00544180ba1fbb1427a9b9dd3f1784842698809972f33ce90482e7420ba6` |
| Original/runtime DB inode | `16777234:6621788` / `16777234:6746180` — different |
| Runtime SQLite integrity | `ok` |
| Seed users/products/orders before setup | `2 / 5 / 0` |
| After setup | `22` users total; exactly `20` WF-03 users; `5` products; `0` orders |
| Account validation | 20/20 role `user`, login attempts 0, `locked_until IS NULL`, successful helper login, zero starting orders |
| Account identities | `wf03-customer-01` through `wf03-customer-20`; emails follow the approved deterministic pattern |
| Private credentials | exactly 20 rows, approved header, mode 0600; values omitted |
| Public data | exactly 20 approved rows; required five seeded product names exist with positive prices |
| Official wrapper | `23127027_Load_20260901.js`, SHA-256 `bb6fd25b57dd9102f5b7fbb5daf3abea091160a50232f73923ab8dc1cc974b05` |
| k6 | `v2.2.0`, darwin/arm64 |
| Free disk | `767982884` KiB at validation |
| Screenshot | not captured; human readiness gate required immediately before traffic |

## Preserved setup anomalies

1. Fresh attempt `/private/tmp/eshop-hw05-load.8yi5tl/runtime` printed normal
   startup/reset lines inside the restrictive sandbox but did not retain a
   process or listener. No account or k6 traffic occurred; the attempt was not
   reused.
2. On the successful one-start runtime, the first helper invocation inside the
   networking sandbox failed safely with `sut_request_failed`. Database checks
   proved zero WF-03 accounts and zero orders, and no credential file existed.
   Its mode-0600 redacted failure evidence is preserved at
   `/private/tmp/eshop-hw05-load.24cMIo/private/provisioning-evidence.redacted.json`
   with SHA-256
   `b0a271c86c5fc4f60f8bee8e03c6cc4d3e96a4db3ef5046e432b356967596fc6`.
3. The unchanged helper then ran outside that networking restriction with a
   new private output root and succeeded for exactly 20 accounts. Its redacted
   evidence SHA-256 is
   `e6b161638a7a0566a65a3380925ea0ff8b8b13018b570616c29e646b8aaa3fcf`.

No password, JWT, or private credential value is present in this evidence.
