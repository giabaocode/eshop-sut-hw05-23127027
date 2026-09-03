# Final HW05 WF-03 Test-Plan Review

Status: **FINAL DESIGN AND GENUINE EXECUTION EVIDENCE REVIEW**

The table preserves the real AI proposal, runtime concern/evidence, human
decision, resulting design, and later genuine execution evidence. Pilot values
validate the harness only and remain separate from official Load, Stress,
Spike, and endurance results. None of the runs establishes universal capacity.

| Area | Original AI Proposal | Pilot Evidence / Concern | Human Decision | Final Design |
|---|---|---|---|---|
| Load VU count | Five steady VUs; separate conservative two-VU Pilot | Pilot exercised the shared implementation; official Load later completed 345/345 workflows with 0/2,415 failed requests | Approve five VUs as a bounded planning input | Five active VUs using accounts 01..05; genuine Load evidence exists, but five VUs is not a capacity claim |
| Load ramp-up | `ramping-vus`, 0→5 in 1 minute | Pilot used a different approved 0→2/30s validation ramp | Approve the one-minute Load ramp | 0→5 VUs over 1 minute |
| Load duration | Five-minute hold then one-minute ramp-down | Pilot duration was not reusable; the official seven-minute schedule subsequently ran to completion | Approve planned Load duration and 30-second graceful settings | 5 VUs for 5m; 5→0 for 1m; 7m scheduled; 8m wall cap; official aggregate p95 4.1019 ms |
| Stress stage progression | Progressive 2→5→10→15→20, recovery to 5, then zero | Pilot did not exercise the stages; official Stress later completed 1,281/1,281 workflows with 0/8,967 failed requests | Approve the bounded progressive schedule | 0→2/30s; alternating 1m holds/ramps at 2, 5, 10, 15, 20; 20→5/1m; hold 5/1m; 5→0/1m; the exact 12m30s schedule was executed |
| Stress maximum | 20 VUs | Pilot validated only two; official 20-VU buckets later recorded about 25.93/26.53 RPS, p95 3.7523/3.71925 ms, and zero failures | Approve 20 as an initial bounded maximum, never measured capacity | Maximum tested input 20 VUs in this schedule; no degradation knee was observed and no maximum-capacity claim is made |
| Stress stage duration | One-minute holds/ramps after a 30-second warm ramp | Short stages may be noisy and one run cannot establish repeatability | Approve exact 12m30s plan for the official Stress run | 12m30s scheduled and executed; 30s graceful settings; 14m wall cap |
| Spike baseline | Three VUs with a two-minute observation after a 30-second ramp | Pilot did not exercise Spike shape; the official Spike later exercised the complete shape | Approve three-VU baseline | 0→3/30s, then 3 VUs/2m; measured baseline p95 4.324 ms |
| Spike peak | 20 VUs | Pilot validated only two; official peak recorded 26.377778 RPS, p95 3.5988 ms, and zero failures | Approve bounded 20-VU peak, not capacity | Peak input 20 VUs was executed once; it is not a capacity result |
| Spike rise/fall | 3→20/10s and 20→3/10s | Abrupt transitions were an untested concern before the official run | Approve genuine rapid rise/fall | Exact 10-second rise/fall executed; recovery p95 was 4.038 ms with zero failures in this run |
| Spike duration | 20 VUs/45s, 3-VU recovery/2m, final 30s ramp-down | The short peak and single run limit generalization | Approve the planned observation windows | 6m5s scheduled and executed; 30s graceful settings; 7m wall cap; 377/377 workflows succeeded |
| Think time | 0.5–1.0s, 1.0–2.0s, 1.5–3.0s, then initially 0s before cancel | Successful Pilot exercised all four waits; immediate cancellation was judged artificial | Human corrected pending→cancel to random 0.5–1.0s | Four independent waits: 0.5–1.0s; 1.0–2.0s; 1.5–3.0s; 0.5–1.0s |
| Assertions/check strength | Exact status, JSON, identity, role, product, price, order, owner, amount/address, and state checks | Corrected Pilot passed 3,078/3,078 checks; this validates implementation, not official behavior | Keep strong business checks; never weaken to improve success rate | Success only after the current iteration's exact order is verified canceled |
| JWT correlation | Extract login token per iteration; no fallback/global token | Real Pilot login/token/authenticated calls passed | Approved current-iteration ownership | Login response→validated nonempty JWT→Bearer header; discard at iteration end |
| Product correlation | Exact one-name match, dynamic ID, detail ID/name, dynamic positive price | Pilot exercised the exact products assigned to rows 01/02 and passed correlation checks; the full five-product rotation remains an official preflight item | Exact match required; no first/partial/static fallback | Search response→one exact product→productId→detail→validated price |
| Order ID correlation | Extract checkout orderId and reuse it for both probes/cancel | 81/81 Pilot lifecycles created and canceled their same order | Preserve residual orders on post-checkout failure; no substitution or DB cleanup | Checkout orderId remains iteration-local through pending, cancel, and final probe |
| Account mapping | Initially one seeded account; later dedicated account design | Pilot verified VU 1/2 identities; each official preflight subsequently provisioned and validated the complete 20-account pool | Up to 20 provisioned accounts; `exec.vu.idInTest` guard; no wrapping/sharing | Load activated 01..05; Stress/Spike used dedicated 01..20 mappings; no fallback was observed |
| Account lockout handling | Original draft proposed whole-test abort on first unexpected 401/403 | Pilot had zero unexpected auth responses, so lockout behavior was not observed | Isolated auth failure fails one iteration; confirmed lockout/invalid run may stop test | Valid credentials only; preserve genuine lockout evidence and reset via fresh disposable runtime between runs |
| Failure handling | Fail current workflow at first terminal boundary; early draft generic catch returned | Failed Pilot showed an unexpected harness exception could tight-loop | Expected workflow failure ends once; unexpected harness/runtime exception emits sanitized evidence and aborts test | One attempted count, one final Boolean outcome, at most one bounded terminal failure; unexpected harness defects stop the test |
| Test-data exhaustion | Public 20 rows plus private pool; fail on missing mapping | Pilot proved two-row binding; official preflights proved complete 20-row provisioning and authentication | Incomplete required pool is preflight failure; no fallback or automatic load reduction | Exactly 20 valid credentials were required before each official/endurance run; only first five active in Load/endurance |
| Persistent order growth | Estimate one persistent canceled row per successful lifecycle | Real disposable runs ended with 345 Load, 1,281 Stress, 377 Spike, and 713 endurance created orders, all canceled | Fresh comparable disposable runtime for every scenario and preserve residual lifecycle evidence | Start/end counts were recorded; every scenario used a fresh DB; no scenario state was reused or cleaned mid-run |
| SQLite contention risk | Source-backed risk from login updates, order insert/update, delete journaling, and no configured busy timeout | No `SQLITE_BUSY`, HTTP failure, or visible p95 degradation occurred through the bounded 20-VU Stress/Spike inputs | Observe under bounded official runs; do not call risk proven or absent beforehand | Risk was not manifested in these runs; it remains possible outside tested schedules/data/machine, and 20 VUs is not capacity |
| Report/output mapping | Load summary, Stress CSV, Spike dashboard; initial concern over literal JTL/HTML wording | Pinned k6 verified capabilities; official runs produced native JSON plus genuinely distinct real views | Use PDF-permitted k6 equivalents; never fabricate or rename JTL | Load aggregate HTML/summary, Stress CSV-derived time-series HTML, and Spike real k6 dashboard exist in separate run directories |
| Pilot `::` naming defect | Draft used `wf03::NN_step` group names | k6 v2.2.0 rejected them before HTTP with `GoError: group and check names may not contain '::'` | Replace executable names with stable `wf03_NN_step`; no semantic/assertion change | Seven k6-safe groups and stable checks, validated in corrected Pilot |
| Pilot tight exception-loop defect | Generic catch emitted failure and allowed another iteration | About 9.7m exception iterations produced roughly 21.6 GiB without HTTP | Distinguish expected workflow failures from unexpected harness exceptions; test-level abort; bounded outputs/watchdog | Sanitized diagnostic + `exec.test.abort()` for unexpected harness/runtime errors; exact-PID wall cap |
| Provisioning-helper invocation defect | Helper protection derived original root from its own file location | Clone-local invocation treated the clone as protected original and stopped before registration | Invoke unchanged helper from actual original worktree and pass fresh clone via `WF03_DISPOSABLE_ROOT` | Preserve original guard; verify distinct roots/inodes/marker/commit/PID/port before provisioning |

## Final approval boundary

The shared WF-03 implementation was first runtime-validated by the corrected
2-VU Pilot, then exercised unchanged by all three official scenarios and the
endurance run. Genuine result and report artifacts now exist. The student later
completed the AI-analysis, threshold-limitation, optimization, and 278-word
critique reviews. The evidence still does not establish maximum capacity or
validated universal acceptance thresholds.

## Phase I static consistency findings

| Review | Actual finding |
|---|---|
| One shared workflow | Load, Stress, and Spike each import and call the same `executeWf03()` and contain no endpoint or assertion logic |
| Workflow completeness | Shared source retains seven request groups and all four approved think-time calls in exact order |
| Assertion/correlation consistency | All official entries reach the same checks and iteration-local JWT/user/product/price/order state; no scenario override exists |
| Traffic tags | Pinned-k6 `inspect` shows `traffic=measured` and the correct static scenario tag for all three entries |
| Workloads | `inspect` reproduced exact approved stage arrays, `startVUs=0`, `ramping-vus`, 30s graceful ramp-down/stop, and `thresholds=null` |
| Account bounds | Config requests 5 active rows for Load and 20 for Stress/Spike; official preflight/runner require exactly 20 private rows for every official run |
| Dynamic/static boundary | No hard-coded JWT, product ID, price, or order ID; no account modulo/shared fallback |
| Metric cardinality | Dynamic URL system tag remains excluded; stable group/name/step tags contain no secrets or IDs |
| Safety rules | Only VU/duration/disk/target/process/output operational controls exist; the four deferred numeric error-abort rules are absent |
| Output separation | All scenarios preserve native JSON; only Stress adds CSV and only Spike adds dashboard HTML; Pilot remains under `results/pilot/` |
| Official runner | It executed the official scenarios with exact-PID watchdogs and numeric exit capture; it contains no business API logic |
| Secret/static validation | Repository diff scans found no credential/JWT/private-file content; the synthetic 20-row init file was mode 0600 under `/private/tmp` and removed |
| Negative init observation | First Phase I `k6 inspect` invocation used shell environment variables rather than k6 `-e`; the existing target guard rejected it before HTTP. Repeating with explicit `-e` passed all three entries; port 3000 stayed unused |

`k6 inspect` is init/static evidence only. It does not execute stages or prove
five-/20-VU runtime behavior, renderer output, account provisioning at 20, or
official performance.
