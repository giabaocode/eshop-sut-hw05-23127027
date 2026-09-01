# WF-03 Workload Model Proposal

## Status and evidence boundary

> **HUMAN-APPROVED PLANNING VALUES — NOT EMPIRICALLY VALIDATED**

- Phase: PHASE B — Workload Model Proposal
- Prepared: 2026-09-01 (Asia/Ho_Chi_Minh)
- Original proposal prepared: 2026-09-01
- Human review recorded: 2026-09-01 13:37:42 +07
- Subsequent human corrections recorded: 2026-09-01 15:58:08 +07
- Authorized future target: disposable local SUT only
- Current execution: none
- k6 status: not installed or run
- Performance measurements: none
- Production traffic profile: unavailable

The workload values were initially AI proposals and were subsequently accepted
as human-approved planning inputs. The correction history below preserves the
superseded values. No value is production traffic, system capacity, a measured
local limit, or a final performance threshold.

### Phase B correction history

| Parameter | OLD VALUE | HUMAN CORRECTION | CURRENT APPROVED PLANNING VALUE |
|-----------|-----------|------------------|---------------------------------|
| Pending verification → cancellation | `0 s`; immediate test-control lifecycle completion | Human required a short user-facing pause because purchase-followed-by-cancellation is more defensible with a small delay while still bounding pending-order buildup | Independent uniform random `0.5–1.0 s` |
| Account strategy | One seeded customer was the approved initial constraint; additional accounts were preferable but deferred | Human required the official data strategy to support reproducible provisioning of up to 20 dedicated valid customers only inside each disposable runtime | Design for up to 20 runtime-provisioned customers; prefer one dedicated account per active VU; provisioning remains setup and has not occurred |
| Isolated unexpected login 401/403 | Abort the entire test on the first response | Human determined isolated auth failure under Stress/Spike may be valid degradation evidence | Fail that iteration and stop its later requests; reserve test-level abort for confirmed lockout or systemic/unsafe execution; numeric systemic cutoff deferred |

The old values remain historical evidence. The current values above supersede
them from 2026-09-01 15:58:08 +07 onward.

## 1. Invariant executable workflow

Load, Stress, and Spike must execute this identical seven-request sequence:

```text
1. POST login
2. GET product search/list
3. GET correlated product detail
4. POST checkout/create order
5. GET that new order; verify pending
6. PUT cancel that exact order
7. GET that same order; verify canceled
```

The pending and canceled probes are invariant executable validation substeps.
They contribute real requests, latency, and iteration duration. No scenario may
omit, replace, or add a business/API step merely to alter workload shape.

Shared functional contract:
[`selected-workflow-specification.md`](selected-workflow-specification.md).

## 2. Think-time proposal

### Current approved pacing

| Location | Current approved planning value | Rationale | Iteration-rate impact | Classification |
|----------|------------------|-----------|-----------------------|----------------|
| Login → Product Search | Uniform random `0.5–1.0 s` | Short transition from authenticated landing state to catalog intent | Adds 0.5–1.0 seconds per iteration | Realistic user behavior |
| Product Search → Product Detail | Uniform random `1.0–2.0 s` | User scans results and chooses a product | Adds 1.0–2.0 seconds per iteration | Realistic user behavior |
| Product Detail → Checkout | Uniform random `1.5–3.0 s` | User reads product information and decides to place the order | Adds 1.5–3.0 seconds per iteration | Realistic user behavior |
| Pending verification → Cancellation | Uniform random `0.5–1.0 s` | A short pause represents a user deciding to cancel while remaining bounded enough to limit pending-order backlog | Adds 0.5–1.0 seconds per iteration | Human-approved user-behavior planning value |

Total current intentional think time is composed from four independent uniform
draws, with a per-iteration sum between `3.5` and `7.0` seconds. The exact
randomization implementation requires later script review.

Ignoring all HTTP/service time, this pacing imposes a mathematical ceiling of
approximately `0.143–0.286 iterations/s per VU`. Actual iteration rate must be
lower and is **not measured**. No sleep is proposed merely to smooth charts.

The same approved think-time behavior must be shared by Load, Stress, and
Spike. Only the workload model changes.

## 3. Summary comparison

| Scenario | Executor | Initial load | Peak/load target | Ramp | Main phase | Recovery | Purpose |
|----------|----------|--------------|------------------|------|------------|----------|---------|
| Load | `ramping-vus` | 0 VUs | 5 VUs sustained | 0 → 5 over 1 min | 5 VUs for 5 min | 5 → 0 over 1 min | Observe normal bounded concurrent behavior |
| Stress | `ramping-vus` | 0 → 2 VUs | Bounded maximum 20 VUs | Progressive 2 → 5 → 10 → 15 → 20 | One-minute hold at each level | 20 → 5 over 1 min; hold 5 for 1 min; 5 → 0 over 1 min | Observe progressive degradation and recovery signals |
| Spike | `ramping-vus` | 3-VU baseline | 20-VU spike | 3 → 20 in 10 sec | 20 VUs for 45 sec | 20 → 3 in 10 sec; 3 VUs for 2 min; then 0 | Observe response to a sudden concurrency discontinuity and recovery |

All scenario `gracefulStop` and `gracefulRampDown` proposals are 30 seconds.
They are approved operational planning inputs, not measured behavior or final
performance thresholds.

## 4. Load model

### Primary proposal

**Executor:** `ramping-vus`.

| Stage | Duration | Target VUs | Purpose |
|-------|----------|------------|---------|
| Ramp-up | `1 min` | `5` | Introduce a small concurrent population without an instantaneous start burst |
| Steady | `5 min` | `5` | Provide a bounded sustained observation window |
| Ramp-down | `1 min` | `0` | Stop new iterations progressively and observe completion |

- Starting VUs: `0`.
- Steady level: `5 VUs`.
- `gracefulRampDown`: `30 s`.
- `gracefulStop`: `30 s`.
- Scheduled stage duration: `7 min`; safety wall-clock cap proposed as `8 min`.
- Intentional think time: 3.5–7 seconds per iteration.

**Estimated iteration behavior — model assumption only:** during the five-VU
steady stage, think time alone limits the theoretical rate to at most about
`0.71–1.43 iterations/s` for all five VUs, before adding HTTP duration. Actual
rate will be lower and cannot be claimed before execution.

**Rationale:** five closed-model users are modest for a local single-process
Node/SQLite SUT while still overlapping login updates, order inserts, and order
cancellations. Five minutes supplies a sustained window without replacing the
separate required 10–15 minute endurance phase.

**Safety considerations:** do not raise VUs during the run; preserve the 20-VU
global Phase B cap; abort on auth safety events, backend loss, or catastrophic
failure conditions defined below.

### Conservative alternative

| Stage | Duration | Target VUs |
|-------|----------|------------|
| Ramp-up | `30 s` | `2` |
| Steady | `3 min` | `2` |
| Ramp-down | `30 s` | `0` |

- `gracefulRampDown`: `30 s`; `gracefulStop`: `30 s`.
- Scheduled duration: `4 min`; proposed safety cap: `5 min`.
- Use when the student prefers lower initial database growth or when preflight
  shows resource/background-process concerns.

Neither Load proposal represents production traffic; there is no production
concurrency or arrival-rate evidence.

## 5. Stress model

### Primary progressive bounded proposal

**Executor:** `ramping-vus`.

| Stage | Duration | From → target VUs | Intent |
|-------|----------|-------------------|--------|
| Warm ramp | `30 s` | `0 → 2` | Validate the initial active path |
| Hold 1 | `1 min` | `2 → 2` | Low-load reference within the same run |
| Increase 1 | `1 min` | `2 → 5` | Begin progressive pressure |
| Hold 2 | `1 min` | `5 → 5` | Observe five-VU behavior |
| Increase 2 | `1 min` | `5 → 10` | Double concurrent workflows |
| Hold 3 | `1 min` | `10 → 10` | Observe ten-VU behavior |
| Increase 3 | `1 min` | `10 → 15` | Continue bounded growth |
| Hold 4 | `1 min` | `15 → 15` | Observe fifteen-VU behavior |
| Increase 4 | `1 min` | `15 → 20` | Reach the proposal's hard maximum |
| Hold 5 | `1 min` | `20 → 20` | Briefly observe the maximum proposed level |
| Recovery ramp | `1 min` | `20 → 5` | Remove most pressure |
| Recovery hold | `1 min` | `5 → 5` | Observe whether failures/latency persist |
| Final ramp-down | `1 min` | `5 → 0` | Finish progressively |

- Maximum proposed load: **20 VUs**, a safety-bounded input—not capacity.
- Scheduled duration: `12 min 30 s`.
- `gracefulRampDown`: `30 s`; `gracefulStop`: `30 s`.
- Proposed wall-clock safety cap: `14 min`.

**Rationale:** progressive closed-model concurrency permits observation by
level while users retain the identical 3.5–7 second think-time contract. It does
not force a fixed request arrival rate when response time degrades, making it a
safer first local stress model before any baseline measurement.

**Stress-specific concerns:**

- each completed lifecycle performs one order INSERT and one order UPDATE;
- successful login also issues a user-row UPDATE, creating a shared-account
  write hotspot beyond the two order writes;
- canceled-order rows persist and grow across stages;
- SQLite uses delete journaling and the app configures no busy timeout;
- auth traffic occurs once per iteration;
- macOS CPU/memory/resource behavior is unknown and must be monitored later;
- failure at 20 VUs does not prove a system capacity, and success at 20 VUs does
  not justify an automatic increase.

## 6. Spike model

### Primary bounded proposal

**Executor:** `ramping-vus`.

| Stage | Duration | From → target VUs | Intent |
|-------|----------|-------------------|--------|
| Baseline ramp | `30 s` | `0 → 3` | Establish the small baseline population |
| Baseline hold | `2 min` | `3 → 3` | Observe pre-spike behavior |
| Sudden rise | `10 s` | `3 → 20` | Create a rapid 6.7× concurrency jump |
| Spike hold | `45 s` | `20 → 20` | Sustain the burst long enough for multiple lifecycle attempts |
| Sudden fall | `10 s` | `20 → 3` | Remove burst pressure quickly |
| Recovery observation | `2 min` | `3 → 3` | Observe lifecycle/error recovery at baseline |
| Final ramp-down | `30 s` | `3 → 0` | Finish cleanly |

- `gracefulRampDown`: `30 s`; `gracefulStop`: `30 s`.
- Scheduled duration: `6 min 5 s`.
- Proposed wall-clock safety cap: `7 min`.

**Why this is a Spike test:** the defining change is the abrupt jump from 3 to
20 VUs in 10 seconds and equally abrupt removal, with explicit baseline and
post-spike recovery periods. Stress instead moves through multiple increasing
levels over minutes. The difference is workload shape and rate of change—not a
different workflow or a graph-styling choice.

`ramping-vus` is chosen for the initial spike because it bounds concurrency at
20. A `ramping-arrival-rate` spike could maintain request starts during
degradation but may allocate extra VUs and amplify local overload; it should not
be adopted without measured iteration timing and separate human review.

## 7. Model-estimated iteration and database growth

> **MODEL ESTIMATES — NOT MEASURED VALUES**

The original 3–6-second-based estimates remain preserved in Interaction 008.
The table below is the corrected planning calculation after the human-approved
0.5–1.0-second cancellation pause; neither version is measured throughput.

### Estimation assumptions

For planning only, assume a successful iteration takes `4.5–11 seconds`:

- 3.5–7 seconds are current approved think time;
- 1–4 additional seconds are an unmeasured modeling allowance for seven local
  HTTP requests and script work under non-catastrophic conditions.

The HTTP allowance is not observed latency. Under degradation, iterations may
take longer or fail, making actual successful counts lower. Think time alone
sets a more permissive theoretical maximum at 3.5 seconds per iteration.

For ramping VUs:

```text
modeled iterations ≈ total VU-seconds ÷ assumed iteration seconds
order-row growth ≈ successful checkout count
```

| Scenario/model | Integrated VU-seconds | Modeled successful iteration range at 4.5–11 s | Think-time-only mathematical maximum | Approximate order-row growth if each modeled iteration reaches checkout |
|----------------|----------------------:|----------------------------------------------:|----------------------------------------:|--------------------------------------------------------------------------:|
| Load primary | 1,800 | 164–400 | 514 | Approximately 164–400 canceled rows |
| Load conservative | 420 | 38–93 | 120 | Approximately 38–93 canceled rows |
| Stress primary | 6,810 | 619–1,513 | 1,946 | Approximately 619–1,513 canceled rows |
| Spike primary | 1,940 | 176–431 | 554 | Approximately 176–431 canceled rows |

These ranges are not throughput predictions. Pre-checkout failures create no
order; checkout success followed by cancellation/probe failure still creates a
pending or canceled row even though the full iteration is unsuccessful. Actual
order growth therefore follows validated checkout count, not only successful
lifecycle count.

The proposed row counts are modest as storage quantities for a disposable
SQLite file, but row count alone does not prove concurrency safety. Simultaneous
writes and account-row updates are the more immediate uncertainty.

## 8. Scenario-isolation policy

Every eventual Load, Stress, and Spike execution should use a separately named,
comparable disposable runtime and unique result directory.

### Proposed evidence-first sequence

1. Before any reset, stop the exact prior backend/test PIDs and preserve its raw
   output, summaries, logs, resource evidence, command, configuration, commit,
   timestamps, and exit codes.
2. Verify expected artifacts exist and are not being overwritten.
3. Create a new temp root such as
   `/private/tmp/eshop-hw05-<scenario>-<timestamp>/`.
4. Locally clone the approved source commit without modifying the homework
   checkout; install dependencies only in that clone when separately approved.
5. Start the unmodified clone, allowing its normal initializer to reseed only
   the clone database.
6. Verify commit, clone working directory/PID, port 3000, zero seed orders,
   unlocked approved accounts, expected products, and SQLite integrity.
7. Write new artifacts only under a unique repository-local path proposed as
   `performance/results/<scenario>/<timestamp>/` and a distinct report path.
8. Never copy, rename, or reuse an older raw result as a new scenario result.
9. After execution, stop exact PIDs, verify original hash/integrity, and preserve
   the mutated clone until evidence is accepted.

Isolation matters because prior canceled/pending rows change database size and
query state; process restart also clears in-memory state. Starting from the same
commit/seed makes scenario comparison more defensible without pretending local
runs are perfectly noise-free.

## 9. Authentication/account strategy

### Historical initial strategy — superseded

One valid seeded customer account was originally accepted as the initial
constraint because every iteration could extract its own JWT and order ID. That
value is preserved here as history but is no longer the approved design
direction.

### Why the shared-account value was corrected

- Every iteration logs in; authentication frequency equals attempted workflow
  iteration frequency.
- Successful logins repeatedly update the same user row, potentially creating a
  SQLite hotspot under concurrency.
- All orders share one user ID, but iteration-local order IDs preserve order/
  cancellation correlation when implemented correctly.
- Any invalid shared password could produce many concurrent failures and expose
  the known lockout path. Valid-data preflight is mandatory. An isolated
  unexpected 401/403 fails its iteration; confirmed lockout/systemic auth failure
  is handled by a reviewed test-level safety rule.
- A shared account cannot reveal between-account variance and increases the
  blast radius of credential/account-state errors.

### Current human-approved design direction

- The official data strategy must support reproducible provisioning of up to 20
  dedicated valid customer accounts inside each disposable runtime.
- Prefer one dedicated account per active VU. Load needs five active mappings;
  Stress and Spike need up to 20.
- Provisioning is test setup, excluded from measured WF-03 traffic.
- No account is claimed to exist until a later approved provisioning run
  genuinely creates and validates it.
- Credentials remain private and must never be committed.
- The original homework database must remain untouched.
- If later runtime verification shows this strategy is inappropriate, stop for
  human review; do not silently return to shared credentials.

The detailed provisioning and mapping design is maintained in
[`test-data-strategy.md`](test-data-strategy.md).

## 10. Safety guardrails versus performance thresholds

### Operational safety guardrails — initial proposals

These protect the authorized local environment. They are not pass/fail claims
about SUT quality.

| Safety guardrail | Initial proposal | Purpose |
|------------------|------------------|---------|
| Authorized target | Exact `127.0.0.1:3000`/localhost disposable PID and verified clone path only | Prevent accidental external testing |
| Maximum concurrency | Hard cap `20 VUs` for Phase B primary proposals | Prevent unbounded escalation |
| Duration caps | Load 8 min; Stress 14 min; Spike 7 min wall-clock safety caps | Prevent runaway execution |
| Authentication safety | Isolated unexpected login 401/403 fails that iteration; never retry guessed credentials; confirmed lockout/systemic unsafe auth may abort the test | Preserve degradation evidence without amplifying unsafe lockout/system failure |
| Catastrophic request failures | Proposed abort review trigger when `http_req_failed` is at least 20% for two consecutive 15-second observation windows after startup | Stop sustained broad failure; implementation method still needs review |
| Backend availability | Stop if verified backend PID exits, port is lost, or five consecutive connection attempts fail | Avoid hammering an unavailable process |
| Transactional failure burst | Stop/review on ten consecutive checkout or cancellation 5xx responses | Avoid repeated writes during systemic failure |
| Disk preflight | Do not start with less than 2 GiB free in temp/result volumes; monitor artifact growth | Protect local filesystem/evidence |
| Process control | Record exact backend/k6 PIDs; never use `killall`, force-kill, or an unbounded process command | Prevent unrelated-process damage |
| Escalation | Never raise VUs/rate during a run or automatically exceed the planned maximum | Keep tests bounded and approved |

The percentage/window/count guardrails are AI proposals for human review and
may need implementation adaptation. They are not measured failure points.

### Phase E human supersession of error-based numeric aborts

The following historical AI/Phase B proposals are **DEFERRED — REQUIRES
PILOT/RUNTIME EVIDENCE** after explicit Phase E human review:

- five consecutive connection failures;
- five consecutive unexpected authentication responses across two accounts;
- ten consecutive checkout/cancellation 5xx responses;
- `http_req_failed >= 20%` for two consecutive 15-second windows.

They must not be implemented or treated as current abort rules. Individual
failures remain visible; confirmed unsafe runtime conditions may still stop a
test; the 20-VU maximum, scenario wall-clock/graceful bounds, and 2 GiB disk
preflight remain approved safety controls. The historical table above is
retained rather than rewritten.

### Future performance thresholds — deliberately unset

No final p90/p95/p99 latency target, workflow success target, request-error
threshold, throughput requirement, capacity number, or regression boundary is
established in Phase B. Those require real results, reproducible analysis, and
human review. Safety aborts must not be reported as homework performance
thresholds.

## 11. Executor rationale

| Executor | Strength | Limitation here | Phase B use |
|----------|----------|-----------------|-------------|
| `constant-vus` | Simple steady closed concurrency | Does not express required ramp/spike transitions by itself | Conservative option only if separate setup/ramp is designed later |
| `ramping-vus` | Bounded closed concurrency; explicit rises/holds/recovery; honors think-time user pacing | Throughput falls when SUT slows, so it does not maintain an open arrival rate | **Selected for initial Load, Stress, and Spike proposals** |
| `constant-arrival-rate` | Maintains a requested iteration-start rate | Needs measured iteration timing/preallocated VUs; can add pressure during degradation | Deferred until baseline evidence exists |
| `ramping-arrival-rate` | Directly models changing arrival rates and open-model bursts | Can require/allocate more VUs and amplify overload; no production arrival profile exists | Deferred; not needed merely for different-looking graphs |

Using `ramping-vus` for all three keeps the concurrency mechanism bounded. The
scenario distinction comes from sustained vs progressive vs discontinuous
workload shape, not executor novelty.

## 12. Human-review table

The matrix began as the blank Phase B AI-review table. The two later corrections
are filled below without erasing their original proposals; other approvals are
authoritatively summarized in `CODEX-RESUME-CHECKPOINT.md`.

| Parameter | AI Proposal | Rationale | Risk/Concern | Human Decision | Final Value |
|-----------|-------------|-----------|--------------|----------------|-------------|
| Common executable flow | Seven invariant requests including pending/canceled probes | Human correction; comparable scenarios | Omitting probes invalidates workflow equivalence | | |
| Login → search think time | Uniform 0.5–1.0 s | Short catalog transition | May be too short/long for intended user model | | |
| Search → detail think time | Uniform 1.0–2.0 s | Result review/selection | Directly lowers iteration rate | | |
| Detail → checkout think time | Uniform 1.5–3.0 s | Purchase consideration | Dominant pacing range | | |
| Pending → cancel think time | 0 s | Immediate controlled lifecycle completion | Artificial versus real customer behavior | Superseded by explicit human correction on 2026-09-01 | Uniform random 0.5–1.0 s |
| Load executor | `ramping-vus` | Bounded closed model with ramp | Does not hold arrival rate during slowdown | | |
| Load starting level | 0 VUs | Controlled ramp | No instant baseline traffic | | |
| Load steady level | 5 VUs | Modest local concurrency | Unvalidated for this Mac/SUT | | |
| Load ramp-up | 1 min to 5 VUs | Avoid instant start | May hide startup sensitivity | | |
| Load duration | 5 min steady; 7 min stages | Sustained but separate from endurance | May be insufficient for slow drift | | |
| Load alternative | 2 VUs for 3 min with 30 s ramps | Conservative first option | Less analytical pressure | | |
| Stress executor | `ramping-vus` | Progressive bounded concurrency | Closed model self-throttles | | |
| Stress stages | 2, 5, 10, 15, 20 VUs with one-minute holds | Observe successive levels | Short holds may not stabilize | | |
| Stress maximum | 20 VUs | Bounded initial local ceiling | Not measured capacity; may be too low/high | | |
| Stress stage duration | One-minute ramps/holds after 30 s warm ramp | Keeps run under 14-min cap | Noise may dominate short stages | | |
| Spike executor | `ramping-vus` | Bounded sudden concurrency change | Not a controlled arrival-rate burst | | |
| Spike baseline | 3 VUs for 2 min | Small pre/post reference | Unvalidated baseline | | |
| Spike peak | 20 VUs | 6.7× baseline jump within cap | Could overwhelm login/SQLite unexpectedly | | |
| Spike duration | 45 s | Multiple lifecycle attempts at peak | May be too short for delayed effects | | |
| Spike rise/fall | 10 s each | Genuine rapid discontinuity | Scheduler/local machine noise | | |
| Recovery | 3 VUs for 2 min | Observe return after spike | Recovery criteria not finalized | | |
| Graceful settings | 30 s ramp-down/stop | Let active lifecycles finish | Could leave incomplete rows if exceeded | | |
| Account strategy | One seeded customer initially; multiple accounts preferred later | No invented accounts; order IDs remain local | Shared login row/lockout blast radius | Superseded by explicit human correction on 2026-09-01 | Reproducibly provision up to 20 disposable-runtime customers; prefer one per active VU; do not provision yet |
| State isolation | Fresh commit-pinned disposable runtime per scenario | Comparable seed and evidence separation | Reinstall/setup overhead | | |
| Safety maximum | 20 VUs and scenario duration caps | Prevent unbounded local load | May constrain observable degradation | | |
| Catastrophic failure guardrail | ≥20% broad failures for two 15 s windows | Protect local SUT during systemic failure | May conceal useful degradation and requires cross-window coordination | Deferred by Phase E human review | Do not implement before controlled pilot/runtime evidence and a new human decision |
| Auth guardrail | Abort first unexpected 401/403 | Avoid lockout amplification | One transient auth error ends run | Superseded by explicit Phase D human correction | Isolated 401/403 fails iteration; test abort only for confirmed/systemic unsafe condition; numeric cutoff deferred |

## 13. Remaining decisions and non-decisions

Phase B is human-reviewed. Later Phase C–E decisions supersede this section's
then-pending review state: data/correlation/checks are now human-reviewed, while
provisioning execution, tool/runtime work, and the four numeric error-abort
proposals remain unauthorized or deferred as recorded in the resume checkpoint.

Phase B does not:

- claim actual iteration counts/order growth;
- define SUT capacity or production traffic;
- set performance thresholds;
- install or run k6;
- generate scenario scripts;
- start the SUT or mutate either database.
