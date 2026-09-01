# Corrected Pilot Preflight Evidence

Status: **SETUP BLOCKED BEFORE PROVISIONING — NO K6 TRAFFIC**

| Gate | Actual result |
|---|---|
| Artifact ID | `20260901T221331+0700` |
| Source commit | `c75b514dd75b7378d55117acbd1f9d095d759275` |
| Disposable runtime | `/private/tmp/eshop-hw05-corrected-pilot.vURuwy/runtime` |
| Private directory | `/private/tmp/eshop-hw05-corrected-pilot.vURuwy/private`, mode `0700` |
| Original DB inode | `16777234:6621788` |
| Disposable DB inode | `16777234:6703052` |
| Original DB SHA-256 | `c63f00544180ba1fbb1427a9b9dd3f1784842698809972f33ce90482e7420ba6` |
| k6 | `v2.2.0 (commit/devel, go1.26.5, darwin/arm64)` |
| Backend | PID `22146`, `node server.js`, cwd in the fresh clone, owned port 3000 |
| Reset/seed state | SQLite `ok`; 2 seed users; 5 seeded products with positive prices; 0 orders |
| Public input | rows 01/02 present with exact expected seeded products |
| Disk | More than 2 GiB free |
| Locked dependencies | `npm ci` added 135 packages in clone only; warning for deprecated `prebuild-install`; audit reported 4 vulnerabilities (low/moderate/high/critical); no fix applied |

The backend was started exactly once. Readiness returned the five expected
products. The original database hash remained unchanged after clone reset.

Provisioning did not pass, so later gates—two-account authentication, mapping,
starting order comparability after provisioning, and k6 execution—were not
entered.
