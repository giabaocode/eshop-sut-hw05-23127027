# Official Stress Preflight — Run `20260902T101857+0700`

Status: **PASS — WAITING AT REAL SCREENSHOT-READINESS GATE; NO MEASURED TRAFFIC**

Maximum safe automation created a fresh no-hardlink clone pinned to official
Load evidence commit `0c17457371d7b9bff75aa27ae61854c84b12ba3f`, installed
lockfile dependencies, and started its backend exactly once. Exact PID `45430`
owns port 3000 from `/private/tmp/eshop-hw05-stress.X7FeN0/runtime/backend`.

The unchanged setup helper provisioned and validated exactly 20 fresh dedicated
accounts through the real registration/login/order API. All are role `user`,
unlocked, authenticate, and have zero starting orders. Five seeded products,
positive prices, the 20-row public/private contracts, wrapper hash, pinned k6,
disk, SQLite integrity, distinct DB inode, and protected original hash passed.

The approved 12m30s Stress plan retains targets
`2,2,5,5,10,10,15,15,20,20,5,5,0`, maximum planned input 20 VUs, 30-second
graceful settings, and a 14-minute safety cap. Twenty VUs remain an input—not
measured capacity. The planned result root
`performance/results/stress/20260902T101857+0700/` remains absent.

No trustworthy combined macOS GUI screenshot can be guaranteed from the
headless runner. The human must arrange Activity Monitor for PID `45430` beside
the live Stress view and reply `READY` before measured traffic starts.
