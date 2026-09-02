# Official Spike Preflight — Run `20260902T104549+0700`

Status: **PASS — WAITING AT REAL SCREENSHOT-READINESS GATE; NO TRAFFIC**

Fresh no-hardlink runtime `/private/tmp/eshop-hw05-spike.21Nvt8/runtime` is
pinned to `eeb02fb83216dfdb6db2c028295f7f5804ee0722`. Exact one-start backend
PID `48405` owns port 3000 from the clone backend cwd. Twenty fresh dedicated
accounts, roles/unlocked/login/zero orders, products, public/private contracts,
wrapper, pinned k6, DB boundary/integrity, disk, and original hash passed.

Actual result root `performance/results/spike/20260902T104549+0700/` remains
absent. The approved 20-VU peak is an input, not capacity. Because the rise is
only ten seconds and hold 45 seconds, Activity Monitor PID `48405` and the
screen framing must be ready before starting traffic.
