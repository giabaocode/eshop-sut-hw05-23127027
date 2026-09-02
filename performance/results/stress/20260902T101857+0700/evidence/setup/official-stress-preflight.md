# Official Stress Preflight Evidence

Status: **PASS — MEASURED STRESS TRAFFIC NOT STARTED**

Recorded: 2026-09-02 10:18:57 +0700

| Field | Actual value |
|---|---|
| Run ID | `20260902T101857+0700` |
| Planned absent result root | `/Users/phamngocgiabao/eshop-sut-hw05-23127027/performance/results/stress/20260902T101857+0700` |
| Source commit | `0c17457371d7b9bff75aa27ae61854c84b12ba3f` |
| Protected original | `/Users/phamngocgiabao/eshop-sut-hw05-23127027` |
| Disposable runtime | `/private/tmp/eshop-hw05-stress.X7FeN0/runtime` |
| Private root | `/private/tmp/eshop-hw05-stress.X7FeN0/private` (mode 0700) |
| Backend | PID `45430`, clone backend cwd, owned listener on port 3000 |
| Measured target | `http://127.0.0.1:3000` |
| Original/runtime DB inode | `16777234:6621788` / `16777234:6757573` — different |
| Original DB SHA-256 | `c63f00544180ba1fbb1427a9b9dd3f1784842698809972f33ce90482e7420ba6` |
| Runtime | SQLite `ok`; 20/20 WF-03 accounts role user/unlocked/authenticated; five positive-price products; zero orders |
| Credentials | exactly 20 rows, approved schema, mode 0600; values omitted |
| Official wrapper | `23127027_Stress_20260901.js`, SHA-256 `00ac2e6829aecbdb14792773c5611d9e00fdf86192c474fbcca82a25bcd36d43` |
| Workload | exact approved 12m30s stages, maximum planned input 20 VUs, 14m cap |
| Outputs | native JSON + native CSV + summary/log/evidence/report paths prepared, not created |
| k6 | v2.2.0 darwin/arm64 |
| Free disk | 773184204 KiB |
| Screenshot | human readiness required immediately before traffic |

No secret, performance measurement, threshold, capacity, or screenshot is
claimed by this preflight.
