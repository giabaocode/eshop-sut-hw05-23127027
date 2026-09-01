# Fresh Corrected 2-VU Pilot Preflight

Status before k6: **PASS**

Label: **MEASURED PILOT VALUES — NOT OFFICIAL PERFORMANCE RESULTS**

| Gate | Actual result |
|---|---|
| Artifact ID | `20260901T223944+0700` |
| Approved source commit | `34bb80e6dd2e1fcf940bae7a440fd14854565b54` |
| Helper execution/protected root | `/Users/phamngocgiabao/eshop-sut-hw05-23127027` |
| Disposable root | `/private/tmp/eshop-hw05-fresh-corrected-pilot.wyN9jR/runtime` |
| Roots | Different absolute paths: PASS |
| Helper hashes | Original/clone identical: `f22643e4ee381e5b4b335e495d63ac1caf97d82f2cc5151b093bbd0608f86970` |
| Original DB | `/Users/phamngocgiabao/eshop-sut-hw05-23127027/backend/database.sqlite`; inode `16777234:6621788` |
| Disposable DB | `/private/tmp/eshop-hw05-fresh-corrected-pilot.wyN9jR/runtime/backend/database.sqlite`; inode `16777234:6708692` |
| Original DB SHA-256 | `c63f00544180ba1fbb1427a9b9dd3f1784842698809972f33ce90482e7420ba6` |
| Marker | Exact `WF03_DISPOSABLE_RUNTIME\n`: PASS |
| Backend | PID `23201`, `node server.js`, cwd `/private/tmp/eshop-hw05-fresh-corrected-pilot.wyN9jR/runtime/backend` |
| Port/target | PID 23201 owns port 3000; target exactly `http://127.0.0.1:3000` |
| Reset/seed | SQLite `ok`; 2 seed users; 5 exact positive-price products; 0 orders |
| Public data | rows 01/02 and exact expected products: PASS |
| k6 | v2.2.0, darwin/arm64, `/opt/homebrew/bin/k6` |
| Disk | More than 2 GiB free |
| Static regression gates | no executable `::`; shell/Node syntax pass; context traffic; test abort; JSON-only runner; no CSV/dashboard |

Locked dependency installation was confined to the clone and added 135
packages. npm repeated a deprecated-package warning and four audit findings
(low/moderate/high/critical); no dependency fix was applied.

## Provisioning gate

- Existing unchanged helper executed from the protected original worktree.
- Exactly accounts `wf03-customer-01` and `wf03-customer-02` were created
  sequentially through `POST /api/register`.
- Helper exit code: 0.
- Private directory mode: `0700`; credential CSV mode: `0600`; 2 rows/keys.
- Helper authentication, role/unlocked validation, and zero starting orders:
  PASS.
- Disposable DB after setup: integrity `ok`; 4 total users; 2 Pilot users,
  both `role=user`, `login_attempts=0`, `locked_until=NULL`; 0 orders.
- Original DB hash remained unchanged.

The redacted helper output's literal `helper_status` is a stale draft label from
the unchanged source. Actual human authorization is HD-012; actual result and
all validation fields are PASS. The label was preserved, not rewritten.
