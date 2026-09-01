# Interaction 008 — Phase B Workload Model Proposal

## AI tool

Codex CLI

## Date/time

- Human approval/correction received: 2026-09-01 13:26:24 +07
- Phase: PHASE B — Workload Model Proposal
- Documentation completed: 2026-09-01 13:31:51 +07

## Human prompt/instruction — preserved verbatim

> Phase A reviewed and approved with one required clarification.
>
> Please record H-031 — Phase A contract review as DONE BY HUMAN.
>
> Human correction:
>
> The pre-cancellation and post-cancellation order-detail HTTP probes are real
> requests if they are executed by k6.
>
> Therefore, do NOT describe them as having no effect on the executable workflow.
>
> Treat them as invariant validation substeps of WF-03.
>
> The executable workflow used identically by Load, Stress, and Spike is:
>
> Login
> → Product Search/List
> → Product Detail
> → Checkout/Create Order
> → Verify newly created Order is pending
> → Cancel that exact Order
> → Verify that exact Order is canceled
>
> The business journey remains WF-03 — Purchase followed by customer
> cancellation.
>
> All three performance scenarios must execute this same sequence.
> Only their workload models may differ.
>
> Update:
> docs/selected-workflow-specification.md
> docs/selected-workflow.md
> ai-audit/audit.md
> and the relevant interaction record if necessary.
>
> Preserve this correction as HUMAN review evidence.
>
> Then proceed to:
>
> PHASE B — Workload Model Proposal
>
> ============================================================
> PHASE B GOAL
> ============================================================
>
> Propose realistic INITIAL workload models for:
>
> 1. Load
> 2. Stress
> 3. Spike
>
> These are:
>
> INITIAL AI PROPOSALS — NOT EMPIRICALLY VALIDATED
>
> Do NOT install k6.
> Do NOT execute k6.
> Do NOT run the SUT.
> Do NOT generate final scenario scripts yet.
>
> ============================================================
> 1. COMMON WORKFLOW
> ============================================================
>
> All three scenarios MUST use the exact same verified WF-03 executable
> workflow.
>
> Do not remove or add business/API steps between scenarios.
>
> Only workload configuration may change.
>
> ============================================================
> 2. THINK-TIME PROPOSAL
> ============================================================
>
> Propose concrete initial think-time values for realistic user pauses.
>
> Consider at minimum:
>
> Login → Product Search
> Product Search → Product Detail
> Product Detail → Checkout
>
> Also determine whether a user-facing pause before cancellation is realistic
> for this artificial performance workflow or whether cancellation should occur
> immediately as a lifecycle completion step.
>
> For every proposed think time provide:
>
> - exact value or bounded randomized range
> - rationale
> - impact on iteration rate
> - whether it represents realistic user behavior or test-control behavior
>
> Avoid arbitrary sleeps.
>
> ============================================================
> 3. LOAD TEST MODEL
> ============================================================
>
> Propose one primary k6 workload model for normal sustained load.
>
> Provide:
>
> - recommended k6 executor
> - starting VUs / rate
> - ramp-up
> - steady-state duration
> - ramp-down
> - graceful stop
> - estimated iteration behavior
> - safety considerations
> - rationale
>
> Also provide one conservative alternative.
>
> Do not claim either model represents real production traffic because no
> production traffic profile is available.
>
> Label all values as assumptions.
>
> ============================================================
> 4. STRESS TEST MODEL
> ============================================================
>
> Propose a progressive bounded stress model.
>
> Include:
>
> - recommended executor
> - starting level
> - load-increase stages
> - exact stage values
> - stage durations
> - maximum proposed load
> - recovery/ramp-down
> - safety stop conditions
>
> The purpose is to observe degradation, not to perform an unbounded denial of
> service.
>
> Consider:
>
> - SQLite write contention
> - one INSERT + one UPDATE per successful workflow
> - persistent canceled-order growth
> - authentication traffic
> - local macOS hardware limitations
>
> Do not call the highest proposed level the system capacity.
>
> ============================================================
> 5. SPIKE TEST MODEL
> ============================================================
>
> Propose a clear baseline → sudden spike → recovery workload.
>
> Include:
>
> - recommended executor
> - baseline level
> - spike level
> - ramp-to-spike duration
> - spike duration
> - return-to-baseline duration
> - recovery observation period
> - graceful stop
>
> Explain what makes it a genuine Spike test rather than merely a short Stress
> test.
>
> ============================================================
> 6. DATABASE / STATE GROWTH
> ============================================================
>
> Estimate workflow-level state growth mathematically from the proposed models.
>
> Each successful iteration creates one order row that becomes canceled.
>
> For each scenario estimate, using assumptions only:
>
> - approximate possible iteration count range
> - approximate resulting order-row growth
>
> Clearly label these as MODEL ESTIMATES, NOT MEASURED VALUES.
>
> Use this to judge whether the proposed workload is safe for the disposable
> runtime.
>
> Do not fabricate actual throughput.
>
> ============================================================
> 7. SCENARIO ISOLATION
> ============================================================
>
> Design the scenario-isolation policy.
>
> Each Load/Stress/Spike execution should begin from a comparable clean
> disposable runtime state.
>
> Propose:
>
> - evidence preservation before reset
> - fresh disposable clone/reseed strategy
> - unique result directory
> - unique timestamps
> - no reuse of previous raw performance results
>
> Explain why this matters for comparison.
>
> ============================================================
> 8. AUTH / ACCOUNT STRATEGY
> ============================================================
>
> Determine whether the initial model can safely use one valid seeded customer
> account or whether multiple accounts are materially preferable.
>
> Analyse:
>
> - shared-account effects
> - authentication frequency
> - order ownership
> - cancellation ownership
> - login lockout risk
> - data-driven requirements
>
> Do not invent additional accounts.
>
> If multiple accounts would improve validity, mark their provisioning as a
> future HUMAN decision.
>
> ============================================================
> 9. SAFETY GUARDRAILS VS PERFORMANCE THRESHOLDS
> ============================================================
>
> Important distinction:
>
> Do NOT establish final homework performance thresholds yet.
>
> The assignment later requires AI to analyse real results and suggest
> performance thresholds.
>
> For Phase B, only propose operational safety guardrails where useful, such as:
>
> - maximum run duration
> - bounded maximum VUs/rate
> - catastrophic error-rate abort condition
> - backend crash/port-loss stop condition
> - disk-space safety
> - runaway process protection
>
> Clearly label:
>
> SAFETY GUARDRAIL
> versus
> FUTURE PERFORMANCE THRESHOLD
>
> Do not present latency p95 targets as empirically justified yet.
>
> ============================================================
> 10. K6 EXECUTOR RATIONALE
> ============================================================
>
> For each scenario explain why the proposed executor is appropriate.
>
> Compare relevant options where useful, such as:
>
> - constant-vus
> - ramping-vus
> - constant-arrival-rate
> - ramping-arrival-rate
>
> Do not select executors purely because they produce different-looking graphs.
>
> ============================================================
> 11. OUTPUT REQUIRED
> ============================================================
>
> Create:
>
> docs/workload-model-proposal.md
>
> Include a summary comparison table:
>
> | Scenario | Executor | Initial load | Peak/load target | Ramp | Main phase | Recovery | Purpose |
> |----------|----------|--------------|------------------|------|------------|----------|---------|
>
> Also create a human-review table:
>
> | Parameter | AI Proposal | Rationale | Risk/Concern | Human Decision | Final Value |
> |-----------|-------------|-----------|--------------|----------------|-------------|
>
> Include at least:
>
> - Load starting level
> - Load steady level
> - Load ramp-up
> - Load duration
> - Stress stages
> - Stress maximum
> - Stress stage duration
> - Spike baseline
> - Spike peak
> - Spike duration
> - think times
> - safety guardrails
> - account strategy
>
> Leave Human Decision and Final Value blank.
>
> Update:
>
> ai-audit/audit.md
> MANUAL-TODO.md
>
> Create a detailed interaction record under:
> ai-audit/interactions/
>
> Preserve this actual human prompt and relevant AI output.
>
> ============================================================
> 12. STOP CONDITION
> ============================================================
>
> At the end show:
>
> A. Load proposal
> B. Stress proposal
> C. Spike proposal
> D. Think-time proposal
> E. Estimated state growth
> F. Scenario-isolation strategy
> G. Account strategy
> H. Safety guardrails
> I. Parameters requiring human approval
> J. Proposed next phase
>
> Then print:
>
> ============================================================
> HUMAN CHECKPOINT REQUIRED — WORKLOAD MODEL REVIEW
> ============================================================
>
> STOP.
>
> Do NOT:
> - install k6
> - generate final scripts
> - run performance tests
> - convert these proposals into measured facts
> - finalize performance thresholds

## Relevant actual AI output

Codex marked H-031 `DONE BY HUMAN`, recorded the correction as HD-003, and
amended the Phase A documents plus Interaction 007 without deleting the
original pre-review output. The corrected seven-request executable sequence is
explicitly invariant across Load, Stress, and Spike.

Codex created `docs/workload-model-proposal.md` with all values labelled initial
AI assumptions. It proposed:

- think-time ranges of 0.5–1.0, 1.0–2.0, and 1.5–3.0 seconds, with immediate
  lifecycle cancellation after the pending probe;
- Load: `ramping-vus`, 0→5 VUs in one minute, five VUs for five minutes, then
  one-minute ramp-down; conservative alternative at two VUs;
- Stress: `ramping-vus`, bounded progressive 2/5/10/15/20-VU stages and
  recovery, maximum 20 VUs—not capacity;
- Spike: `ramping-vus`, three-VU baseline, 3→20 in ten seconds, 45-second peak,
  return to three and two-minute recovery.

Model-only state estimates use integrated VU-seconds and an explicitly
unmeasured 4–10 second iteration assumption. It proposed isolated fresh
commit-pinned disposable runtimes/results, analyzed one shared seeded account
versus future human-approved accounts, distinguished operational safety aborts
from unset performance thresholds, compared k6 executor options, and left all
human-decision/final-value cells blank.

No SUT/k6 execution, installation, script generation, measured result,
performance threshold, commit, or push occurred.

## Files created

- `docs/workload-model-proposal.md`
- `ai-audit/interactions/008-phase-b-workload-model-proposal.md`

## Files modified

- `docs/selected-workflow-specification.md`
- `docs/selected-workflow.md`
- `docs/human-decisions.md`
- `ai-audit/interactions/007-phase-a-selected-workflow-specification.md`
- `ai-audit/audit.md`
- `MANUAL-TODO.md`

## Human-review status

`WAITING FOR HUMAN` — H-032 and the blank workload review table require
explicit human corrections/approval before Phase C. No Phase B value is final.
