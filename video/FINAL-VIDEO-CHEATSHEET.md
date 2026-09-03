# HW05 Final Video Cheatsheet

Target **9:30** · Minimum **6:00** · Vietnamese human narration · No live rerun

## Before Record

- Do Not Disturb; close credentials/private tabs; Terminal font 18–20.
- `cd /Users/phamngocgiabao/eshop-sut-hw05-23127027`
- `Command + Shift + 5` → entire screen → microphone → Record.
- Never show password/JWT/Auth header/serial/UUID/private runtime.

## Timeline

| Time | Do | Say |
|---|---|---|
| 00:00 | `hostname`; `k6 version`; `git remote get-url origin` | 23127027, macOS, k6 2.2.0, existing evidence only |
| 00:45 | `rg -n "getWorkload|executeWf03|export function" performance/scenarios/official/*.js` | Three official names; one shared flow |
| 01:30 | `rg -n "executeWf03|group\('|thinkTime\(|context\.(jwt|userId|productId|price|orderId)" performance/lib/workflow.js` | Login→Search→Detail→Checkout→Pending→Cancel→Canceled; dynamic IDs |
| 02:10 | `sed -n '1,7p' performance/data/workflow.csv` | Public CSV; 20 dedicated rows; credentials outside Git |
| 02:30 | `open performance/results/load/20260902T092131+0700/report/load-aggregate.html` | 345/345; 2,415/0; p95 4.1019 ms |
| 03:20 | `open performance/results/stress/20260902T101857+0700/report/stress-timeseries.html` | 1,281/1,281; 8,967/0; p95 3.9147 ms; 20 VUs ≠ capacity |
| 04:15 | `open performance/results/spike/20260902T104549+0700/report/spike-dashboard.html` | 377/377; 2,639/0; p95 3.9654 ms; one recovery observation |
| 05:05 | Open four `*-k6-backend-resource.png` images, then `evidence/hardware/hardware-specs-hostname.jpg` | Genuine same-frame evidence; screenshot ≠ continuous telemetry |
| 06:00 | `open performance/results/endurance/20260902T143823+0700/report/endurance-timeseries.html` | 5 VUs/12m; 713/713; 4,991/0; p95 4.377 ms; local point only |
| 06:50 | `sed -n '1,90p' skills/hw05-k6-performance/SKILL.md`; run checker | Skill scope/safety; `CHECKED` Load/Stress/Spike |
| 07:45 | Show `reviews/test-plan-review.md`, `reviews/ai-analysis-review.md`, `reviews/optimization-review.md` | `::`, tight loop 21.6 GiB, human verdicts |
| 08:45 | Show `proposal/continuous-performance-testing.md`; open main PDF | CPT, no confirmed SUT issue, limitations, conclusion |

## Numbers

| Run | Workflows | HTTP failed | Overall p95 |
|---|---:|---:|---:|
| Load | 345/345 | 0/2,415 | 4.1019 ms |
| Stress | 1,281/1,281 | 0/8,967 | 3.9147 ms |
| Spike | 377/377 | 0/2,639 | 3.9654 ms |
| Endurance | 713/713 | 0/4,991 | 4.377 ms |

Total: **2,716/2,716 workflows; 19,012 requests; 0 failed**.

## Never Claim

- 20 VUs is capacity.
- 5 VUs/12m is maximum endurance.
- One screenshot proves average CPU/RAM.
- Proposed numeric thresholds are validated.
- Harness/setup failures are SUT bugs.
- k6 JSON/CSV is JMeter JTL.

## After Record

Watch once → confirm ≥6:00 and no secrets → upload **Unlisted** → test URL in
incognito → send:

```text
YOUTUBE_URL=https://...
SELF_ASSESSED_GRADE=000..100
```
