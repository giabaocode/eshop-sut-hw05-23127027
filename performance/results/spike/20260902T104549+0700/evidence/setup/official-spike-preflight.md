# Official Spike Preflight Evidence

Status: **PASS — MEASURED SPIKE TRAFFIC NOT STARTED**

Recorded: 2026-09-02 10:45:49 +0700

| Field | Actual value |
|---|---|
| Run ID | `20260902T104549+0700` |
| Planned result root | `/Users/phamngocgiabao/eshop-sut-hw05-23127027/performance/results/spike/20260902T104549+0700` (absent) |
| Source commit | `eeb02fb83216dfdb6db2c028295f7f5804ee0722` |
| Runtime | `/private/tmp/eshop-hw05-spike.21Nvt8/runtime` |
| Private root | `/private/tmp/eshop-hw05-spike.21Nvt8/private`, mode 0700 |
| Backend | exact PID `48405`, clone backend cwd, port 3000 |
| Target | `http://127.0.0.1:3000` |
| Accounts | exactly 20 role user/unlocked/authenticated; private CSV mode 0600 |
| Products/orders | five positive-price products / zero orders |
| Runtime DB | distinct inode; integrity `ok` |
| Original DB | SHA-256 `c63f00544180ba1fbb1427a9b9dd3f1784842698809972f33ce90482e7420ba6` unchanged |
| Official wrapper | `23127027_Spike_20260901.js`, SHA-256 `9f8520ae7700458ad02fb9c17154013ef1d72af5bb04d95a9552f8a846d4abeb` |
| Workload | 0→3/30s, 3/2m, 3→20/10s, 20/45s, 20→3/10s, 3/2m, 3→0/30s; 7m cap |
| Output | native JSON + web-dashboard HTML planned, not created |
| Screenshot | human readiness required before the ten-second rise |

No secret, measurement, screenshot, threshold, or capacity is claimed here.
