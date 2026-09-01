# Interaction 007 — Phase A Selected Workflow Specification

## AI tool

Codex CLI

## Date/time

- Human approval/instruction received: 2026-09-01 13:05:55 +07
- Phase: PHASE A — Selected Workflow Specification
- Documentation completed: 2026-09-01 13:12:08 +07

## Human prompt/instruction — preserved verbatim

> Phase 3 evidence and the WF-03 functional smoke verification are reviewed
> and approved by me.
>
> I confirm again that:
>
> Selected workflow:
> WF-03 — Purchase followed by customer cancellation
>
> Selected E2E flow:
> Login
> → Product Search/List
> → Product Detail
> → Checkout / Create Order
> → Cancel the newly created Order
>
> Group uniqueness:
> I have already coordinated with my group of 4 students and confirmed that
> no other group member is using WF-03.
>
> Please record these as HUMAN approvals.
>
> You may mark:
> - H-029 — Phase 3 evidence review: DONE BY HUMAN
> - H-030 — WF-03 functional smoke review: DONE BY HUMAN
>
> Preserve the date/time and this actual human approval in the AI Audit.
>
> Proceed to:
>
> PHASE A — Selected Workflow Specification
>
> ============================================================
> PHASE A GOAL
> ============================================================
>
> Create the formal performance-testing contract for the selected WF-03
> workflow.
>
> Do NOT generate the final Load/Stress/Spike scripts yet.
>
> Do NOT run performance testing yet.
>
> Do NOT install k6 yet unless a later phase explicitly requires approval.
>
> ============================================================
> 1. FORMALIZE THE EXACT WORKFLOW
> ============================================================
>
> Document the exact runtime-verified sequence:
>
> 1. Login
> 2. Product Search/List
> 3. Product Detail
> 4. Checkout / Create Order
> 5. Cancel the newly created Order
>
> For every step document:
>
> - endpoint category:
>   AUTH-HEAVY / READ-HEAVY / TRANSACTIONAL
> - HTTP method
> - exact route
> - authentication requirement
> - request headers
> - request/query/body
> - runtime-verified expected status
> - relevant response fields
> - values extracted for later steps
> - database/state mutation
> - failure conditions
>
> Explicitly explain how WF-03 satisfies the HW05 requirement to cover:
>
> - Auth-heavy
> - Read-heavy
> - Transactional
>
> ============================================================
> 2. CORRELATION CONTRACT
> ============================================================
>
> Define the exact dynamic correlation chain.
>
> Required dynamic values include at least:
>
> Login
> → extract JWT
>
> Product search/list
> → extract/select productId
>
> Product detail
> → validate productId
> → obtain required product information such as price
>
> Checkout
> → use correlated data
> → extract new orderId
>
> Order cancellation
> → use that dynamically extracted orderId
>
> No final script may substitute static fallback values when extraction fails.
>
> Define fail-fast behavior for missing:
>
> - JWT
> - productId
> - product detail/price
> - orderId
>
> ============================================================
> 3. ITERATION SEMANTICS
> ============================================================
>
> Define exactly what ONE virtual-user iteration means.
>
> For example conceptually:
>
> VU iteration begins
> → authenticate
> → read/select product
> → inspect product
> → create order
> → cancel the same created order
> → iteration ends
>
> Document what successful completion means.
>
> Do not yet decide final Load/Stress/Spike workload levels.
>
> ============================================================
> 4. STATE AND REPEATABILITY
> ============================================================
>
> Use the verified runtime behavior.
>
> Document:
>
> - one order row is created per successful iteration
> - that same order becomes canceled
> - canceled orders remain persisted
> - no inventory is consumed because this SUT has no inventory/order-item model
> - database size/order count therefore grows over a run
> - SQLite write contention may become relevant under concurrency
> - this has NOT yet been performance-measured
>
> Explain implications for:
>
> - Load
> - Stress
> - Spike
> - comparable scenario reruns
> - database reseeding/reset between scenarios
>
> Do not invent cleanup behavior that does not exist.
>
> ============================================================
> 5. AUTHENTICATION / LOCKOUT SAFETY
> ============================================================
>
> Because successful iterations require login:
>
> define rules ensuring the performance test never intentionally uses invalid
> passwords.
>
> Document:
>
> - valid credentials only
> - failed authentication must fail the iteration
> - never retry with guessed credentials
> - monitor for unexpected 401/lockout responses
> - do not intentionally trigger the known login-lockout behavior
>
> The exact lockout implementation remains an observed SUT characteristic.
>
> ============================================================
> 6. TEST-DATA REQUIREMENTS
> ============================================================
>
> Determine what WF-03 needs to become data-driven.
>
> Propose the CSV schema(s), but do not generate large final datasets yet.
>
> Consider:
>
> - username/email
> - password handling
> - product/search input
> - any other runtime-required data
>
> Explain:
>
> - which values should come from CSV
> - which values must instead be dynamically correlated
> - which values must NEVER be hard-coded
> - how multiple VUs should consume credentials/data
> - whether multiple valid accounts are required to avoid shared-user effects
>
> Do not expose credentials in committed files.
>
> ============================================================
> 7. CHECK / ASSERTION CONTRACT
> ============================================================
>
> Define meaningful checks for each step.
>
> Examples must be based on actual verified behavior:
>
> Login:
> - expected status
> - token exists
>
> Product search/list:
> - expected status
> - usable product exists
>
> Product detail:
> - expected status
> - returned product matches correlated productId
>
> Checkout:
> - expected status
> - new orderId exists
> - newly created order has the expected initial state
>
> Cancellation:
> - expected status
> - canceled order corresponds to the dynamically created orderId
> - resulting state is canceled
>
> Do not accept only "HTTP 200" when the business operation could still be
> invalid.
>
> ============================================================
> 8. METRICS TO CAPTURE LATER
> ============================================================
>
> Define metrics needed for later analysis, without generating performance
> results.
>
> Include appropriate k6/native/custom metrics for:
>
> - overall HTTP request duration
> - endpoint-specific latency
> - p90/p95/p99 where applicable
> - throughput/RPS
> - request failure rate
> - workflow iteration success/failure
> - login failures
> - checkout failures
> - cancellation failures
> - order lifecycle success
> - other metrics justified by this workflow
>
> Clearly distinguish:
>
> METRIC DEFINITION
> from
> FUTURE MEASURED VALUE
>
> There are no performance measurements yet.
>
> ============================================================
> 9. THINK-TIME POINTS
> ============================================================
>
> Identify where a real user would reasonably pause, such as between:
>
> Login → search
> Search → product detail
> Product detail → checkout
>
> Do not assign final think-time values yet.
>
> Only identify candidate think-time locations and rationale.
>
> ============================================================
> 10. WORKLOAD-INDEPENDENT DESIGN
> ============================================================
>
> The workflow implementation must later be reusable unchanged by:
>
> - Load
> - Stress
> - Spike
>
> Those scenarios must vary workload configuration rather than business flow.
>
> Document which components should be shared and which will differ later.
>
> ============================================================
> 11. CREATE / UPDATE FILES
> ============================================================
>
> Create:
>
> docs/selected-workflow-specification.md
>
> Update as appropriate:
>
> docs/selected-workflow.md
> docs/human-decisions.md
> ai-audit/audit.md
> MANUAL-TODO.md
>
> Create a new detailed interaction record under:
>
> ai-audit/interactions/
>
> Preserve this actual human approval/instruction and the relevant actual AI
> output.
>
> ============================================================
> 12. STOP CONDITION
> ============================================================
>
> At the end show:
>
> A. Final WF-03 specification
> B. Endpoint-group mapping
> C. Correlation chain
> D. Iteration contract
> E. Data-driven requirements
> F. State/repeatability risks
> G. Assertion/check contract
> H. Metrics planned
> I. Remaining human decisions
> J. Proposed next phase
>
> Then STOP.
>
> Do NOT:
> - generate final k6 scripts
> - choose Load concurrency
> - choose Stress maximum load
> - choose Spike peak
> - run k6
> - run performance tests
> - install k6

## Relevant actual AI output

Codex recorded the explicit human approvals in `docs/human-decisions.md` and
set H-029/H-030 to `DONE BY HUMAN`. It retained WF-03 and its exact sequence
without substitution.

Codex created a workload-independent formal contract covering all five business
steps plus two correlated order-state verification probes. The contract maps
login to auth-heavy, product search/detail to read-heavy, and checkout/cancel to
transactional. It defines headers, inputs, runtime-verified status/fields,
state effects, errors, and meaningful business assertions per step.

The specified chain is credentials → JWT, workflow row → search/product ID →
detail/validated price → checkout/new order ID → pending read → authenticated
cancel → canceled read. Missing JWT, product ID/detail/price, or order ID must
abort the iteration; static or prior-iteration fallback values are forbidden.

One iteration is successful only when the same newly created order is verified
pending and then canceled. The contract records order growth, potential pending
residue after partial failure, absent inventory behavior, potential unmeasured
SQLite contention, and explicit disposable-runtime reseeding requirements.

It proposes separate non-secret workflow and ignored/private credential CSV
schemas without generating data. It defines future native/custom metrics with
every value marked `NOT MEASURED`, identifies think-time locations without
durations, and separates shared workflow components from future scenario
workload configuration.

No k6 installation/script/run, workload level, threshold, measured result,
source/runtime mutation, commit, or push occurred.

## Files created

- `docs/selected-workflow-specification.md`
- `ai-audit/interactions/007-phase-a-selected-workflow-specification.md`

## Files modified

- `docs/selected-workflow.md`
- `docs/human-decisions.md`
- `ai-audit/audit.md`
- `MANUAL-TODO.md`

## Human-review status

`WAITING FOR HUMAN` — H-031 requires explicit review of the Phase A formal
contract before Phase B workload-model proposal. No correction had been
requested when this record was written.

## Subsequent HUMAN review and correction

- Received: 2026-09-01 13:26:24 +07
- Review outcome: Phase A approved with one required clarification.
- H-031: explicitly authorized as `DONE BY HUMAN`.
- Correction: the pre- and post-cancellation order-detail calls are real HTTP
  requests and therefore invariant executable validation substeps, not steps
  with no effect on the executable workflow.
- Corrected sequence for Load, Stress, and Spike:
  Login → Product Search/List → Product Detail → Checkout/Create Order → Verify
  pending → Cancel the same order → Verify canceled.
- Applied to `docs/selected-workflow-specification.md` and
  `docs/selected-workflow.md`. The original Phase A output above remains
  preserved as the pre-review AI record.
