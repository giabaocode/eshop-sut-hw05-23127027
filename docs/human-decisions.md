# Human Decisions

This file records decisions explicitly supplied by Phạm Ngọc Gia Bảo. Entries
must not be attributed to the AI or changed into a different choice.

## HD-001 — Final E2E workflow selection

| Field | Human decision |
|-------|----------------|
| Recorded | 2026-09-01 12:56:28 +07 (Asia/Ho_Chi_Minh) |
| Decision owner | Phạm Ngọc Gia Bảo — HUMAN |
| Selected workflow | **WF-03 — Purchase followed by customer cancellation** |
| Exact selected sequence | Login → Product Search/List → Product Detail → Checkout / Create Order → Cancel the newly created Order |
| Group context | Four students |
| Uniqueness confirmation | The student explicitly confirmed that they coordinated with the group and no other group member is using WF-03 for HW05 performance testing. |
| Reason supplied by human | No additional reason was supplied; the choice is recorded exactly as stated. |
| AI role | Recorded the decision only; did not select, reinterpret, or replace it. |

### Preserved human statement

> I select:
>
> WF-03 — Purchase followed by customer cancellation.
>
> Group uniqueness confirmation:
> I have coordinated with my group of 4 students and confirm that no other
> group member is using WF-03 as their HW05 performance-testing workflow.

## HD-002 — Phase 3 and WF-03 smoke approvals

| Field | Human decision |
|-------|----------------|
| Recorded | 2026-09-01 13:05:55 +07 (Asia/Ho_Chi_Minh) |
| Decision owner | Phạm Ngọc Gia Bảo — HUMAN |
| Phase 3 evidence | Reviewed and approved by the human |
| WF-03 functional smoke | Reviewed and approved by the human |
| Workflow reaffirmed | **WF-03 — Purchase followed by customer cancellation** |
| Exact flow reaffirmed | Login → Product Search/List → Product Detail → Checkout / Create Order → Cancel the newly created Order |
| Group uniqueness reaffirmed | The student had coordinated with the four-person group and confirmed no other member uses WF-03 |
| Manual status authorization | Human explicitly authorized `H-029` and `H-030` as `DONE BY HUMAN` |
| AI role | Recorded these approvals; did not infer or supply them |

### Preserved approval statement

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

## HD-003 — Phase A approval and executable-workflow correction

| Field | Human decision |
|-------|----------------|
| Recorded | 2026-09-01 13:26:24 +07 (Asia/Ho_Chi_Minh) |
| Decision owner | Phạm Ngọc Gia Bảo — HUMAN |
| Phase A review | Approved with one required clarification |
| H-031 authorization | Human explicitly authorized `DONE BY HUMAN` |
| Business journey | **WF-03 — Purchase followed by customer cancellation** |
| Corrected executable workflow | Login → Product Search/List → Product Detail → Checkout/Create Order → Verify newly created Order is pending → Cancel that exact Order → Verify that exact Order is canceled |
| Invariance rule | Load, Stress, and Spike must execute this identical sequence; only workload models may differ |
| Correction rationale | The pre- and post-cancellation order-detail probes are real HTTP requests when k6 executes them, so they affect the executable workflow and must not be described as having no effect on it. |
| AI role | Applied and preserved the human correction; did not reinterpret it |

### Preserved correction

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

## HD-004 — Phase B workload-model review

| Field | Human decision |
|-------|----------------|
| Recorded | 2026-09-01 13:37:42 +07 (Asia/Ho_Chi_Minh) |
| Decision owner | Phạm Ngọc Gia Bảo — HUMAN |
| Phase status | **Phase B — Workload Model Proposal reviewed by human** |
| Workload disposition | Phase B proposals accepted as the human-approved planning decisions summarized in `CODEX-RESUME-CHECKPOINT.md` |
| Measurement boundary | Values remain initial planning inputs, not empirically measured facts, production traffic, capacity, or final performance thresholds |
| Next intended phase | Phase C — Test-Data Strategy; not started in this turn |
| AI role | Recorded the explicit session-end human review state and values; did not execute or measure them |

## HD-005 — Phase B think-time and account-strategy corrections

| Field | Human decision |
|-------|----------------|
| Recorded | 2026-09-01 15:58:08 +07 (Asia/Ho_Chi_Minh) |
| Decision owner | Phạm Ngọc Gia Bảo — HUMAN |
| Discrepancy checkpoint | **RESOLVED BY HUMAN REVIEW** |
| Historical think-time value | Pending-order verification → cancellation was `0 s` immediate lifecycle completion |
| Corrected think-time value | Independent uniform random `0.5–1.0 s` |
| Think-time rationale | A short pause is more defensible as user behavior for purchase-followed-by-cancellation while remaining small enough to limit pending-order backlog |
| Historical account value | One seeded customer account was the approved initial constraint |
| Corrected account direction | Design reproducible provisioning for up to 20 dedicated valid customer accounts inside each disposable runtime and prefer one per active VU |
| Provisioning boundary | Accounts do not yet exist; do not provision in this correction/Phase C design turn; setup only, outside measured WF-03 traffic |
| Integrity/secret boundary | Never modify the original database; never commit credentials; stop for human review if later verification invalidates the strategy |
| Measurement boundary | Both corrections are planning values, not measured performance values or final thresholds |
| AI role | Preserved the old values, recorded the superseding human corrections, and used them as Phase C design inputs; did not provision or measure anything |

### Preserved human correction

> These are intentional NEW HUMAN CORRECTIONS and they supersede the older
> Phase B repository values.
>
> Previous value: Pending-order verification → Cancellation = 0 seconds.
>
> New human-approved planning value: random 0.5–1.0 seconds.
>
> Previous value: One seeded customer account is the approved initial
> constraint.
>
> New human-approved design direction: design the official data strategy so
> that up to 20 dedicated valid customer test accounts can be provisioned
> reproducibly inside each disposable runtime.
>
> Do not claim the accounts already exist, do not provision them yet, do not
> modify the original database, do not commit credentials, and treat
> provisioning as setup rather than measured WF-03 traffic.

The complete verbatim instruction is preserved in
[`../ai-audit/interactions/011-phase-b-corrections-phase-c-test-data-strategy.md`](../ai-audit/interactions/011-phase-b-corrections-phase-c-test-data-strategy.md).

## HD-006 — Phase C approval and quantity correction

| Field | Human decision |
|-------|----------------|
| Recorded | 2026-09-01 16:15:12 +07 (Asia/Ho_Chi_Minh) |
| Decision owner | Phạm Ngọc Gia Bảo — HUMAN |
| Phase C review | **APPROVED WITH CORRECTIONS** |
| Quantity validation | Keep only if the verified WF-03 request/calculation genuinely uses it; otherwise remove it |
| Verification result | Quantity is not submitted to checkout, not used by the selected smoke flow, and not needed to derive the total; checkout uses the normalized detail price and synthetic address |
| Final public schema | `row_id,account_key,search_term,expected_product_name,shipping_address` |
| Public dataset | Approved 20 deterministic rows for `wf03-customer-01` through `wf03-customer-20`, rotating through five reviewed seeded products |
| Private schema | Approved `account_key,email,password,expected_role`; deterministic `.test` email and runtime-generated secret password |
| Provisioning architecture | Approved as distinct preconditioning completed before official measured k6; separate deterministic helper preferred; any k6 setup output must be completely separate |
| Account validation | Complete 20-account role/unlocked/login/mapping/state/integrity validation; incomplete pool fails preflight |
| VU allocation | Dedicated one-based VU 1..20 → customer 01..20; no sharing, wrapping, random reassignment, or fallback |
| Dynamic boundary | JWT, authenticated user ID, product ID, price, derived total, and order ID remain iteration-correlated and absent from authoritative CSV |
| Secret/ignore decision | Four narrow private paths approved; public data and required evidence remain trackable |
| Scenario isolation | Equivalent evidence-first disposable preconditioning approved for Load, Stress, and Spike |
| Safe artifact authorization | Approved creation of `performance/data/workflow.csv`, placeholder-only credential template, data README, and narrow `.gitignore` |
| H-033 authorization | Mark `DONE BY HUMAN` only after corrections and validation; this condition was satisfied before status update |
| Next phase | Proceed to Phase D — Authentication and Dynamic Correlation Strategy, design only |
| AI role | Verified quantity against source/runtime evidence, removed the artificial field, created only authorized safe artifacts, preserved proposal/review/final states, and designed Phase D without execution |

### Preserved human review outcome

> Phase C — Test-Data Strategy has been reviewed by me.
>
> I approve the overall design with the HUMAN decisions and corrections below.
>
> Do NOT keep quantity merely because it is common in e-commerce tests. Verify
> whether it has a real effect; remove it if it does not.
>
> Account provisioning must finish as distinct preconditioning before official
> measured k6 execution and must not contaminate Load/Stress/Spike metrics.
>
> If the 20-account pool is incomplete, fail preflight without sharing,
> wrapping, lowering workload, or fabricating accounts.

The complete verbatim review and Phase D instruction is preserved in
[`../ai-audit/interactions/012-phase-c-review-phase-d-correlation-strategy.md`](../ai-audit/interactions/012-phase-c-review-phase-d-correlation-strategy.md).

## HD-007 — Phase D approval and authentication-failure correction

| Field | Human decision |
|-------|----------------|
| Recorded | 2026-09-01 16:29:28 +07 (Asia/Ho_Chi_Minh) |
| Decision owner | Phạm Ngọc Gia Bảo — HUMAN |
| Phase D review | **APPROVED WITH AUTHENTICATION CORRECTION** |
| VU mapping | Approve `exec.vu.idInTest` for separately executed local Load/Stress/Spike tests up to 20 VUs, guarded by `1 <= idInTest <= available approved rows`; no wrap, reuse, randomness, or account-01 fallback |
| Product selection | Require exactly one exact expected product-name match; zero or multiple matches fail the current iteration |
| Post-checkout failure | Preserve an incomplete lifecycle and residual order as evidence; no alternate ID, different-order retry, direct-SQL cleanup, or concealment |
| Original AI authentication proposal | First unexpected login `401`/`403` invoked a whole-test authentication stop policy |
| Human authentication correction | One isolated unexpected `401`/`403` from a previously validated credential fails only the current iteration and remains useful Stress/Spike degradation evidence |
| Final authentication decision | Record the auth/iteration failure, stop later requests in that iteration, and never guess/swap credentials; reserve test-level abort for confirmed lockout or clear systemic/runtime danger |
| Numeric auth cutoff | Not approved in Phase D; Phase E may propose a value for a new mandatory human review |
| Tags/groups | Approve seven stable groups and the bounded workflow/step/endpoint/role/traffic/scenario tags; prohibit secrets and dynamic identifiers/URLs |
| Correlation lifetime | VU-stable input rows; JWT/user ID/product ID/price/order ID are iteration-local within their documented subchains; no mutable module-global response state |
| H-034 authorization | Mark `DONE BY HUMAN` only after applying these decisions; this condition was satisfied before status update |
| Next phase | Proceed to Phase E — Checks, Custom Metrics, Safety Stops, and Report/Output Proposal; design only |
| AI role | Preserved the original proposal, recorded the human correction and final policy, updated the authoritative Phase D design, and prepared Phase E without implementation or execution |

### Preserved human review outcome

> Phase D — Authentication and Dynamic Correlation Strategy has been reviewed.
>
> I approve the overall correlation design with the HUMAN decisions and
> corrections below.
>
> For a single unexpected authentication failure using a previously validated
> credential, mark the current iteration as failed and do not continue its
> workflow. Do not automatically abort the entire official test on the first
> isolated 401/403.
>
> A test-level safety abort remains appropriate for a confirmed lockout,
> backend/process/port loss, an unusable runtime, or repeated systemic
> authentication failure. Do not invent a final numeric cutoff yet.

The complete verbatim review and Phase E instruction is preserved in
[`../ai-audit/interactions/013-phase-d-review-phase-e-checks-metrics-reports.md`](../ai-audit/interactions/013-phase-d-review-phase-e-checks-metrics-reports.md).

## HD-008 — Phase E approval, numeric-abort deferral, and conditional report mapping

| Field | Human decision |
|-------|----------------|
| Recorded | 2026-09-01 16:41:04 +07 (Asia/Ho_Chi_Minh) |
| Decision owner | Phạm Ngọc Gia Bảo — HUMAN |
| Phase E review | **APPROVED WITH CORRECTIONS** |
| Checks | Approve the exact Login/Search/Detail/Checkout/Pending/Cancellation/Final checks; HTTP 200 alone is insufficient; success only after same-order canceled verification |
| Metrics | Approve `wf03_workflow_attempted` Counter, `wf03_workflow_success` Rate, `wf03_failures` Counter, unexpected-auth/created/canceled Counters, lifecycle Trend, and native tagged metrics |
| Outcome semantics | Exactly one attempted count and one guarded final Boolean Rate sample per valid attempted workflow; true only after Final Probe success |
| Failure taxonomy | Approve six classes and bounded `failure_class`/`step` tags; prohibit sensitive or dynamic identifiers |
| Immediate safety | Approve stop for wrong target, confirmed backend/port loss, confirmed invalidating lockout, unusable preflight, corrupted runtime, output-preservation failure, or critical local runtime failure |
| Bounded safety | Approve at least 2 GiB free disk, bounded VUs, bounded scenario wall-clock, and bounded graceful stop as safety controls only |
| Original AI numeric proposals | 5 connection failures; 5 unexpected auth failures across two accounts; 10 checkout/cancel 5xx; 20% request failures in two 15-second windows |
| Human correction | Do not finalize or implement those four cutoffs before controlled pilot/runtime evidence; avoid hiding degradation or introducing premature cross-VU/window coordination |
| Current numeric decision | **DEFERRED — REQUIRES PILOT/RUNTIME EVIDENCE**; individual failures remain observable/classified; dangerous confirmed runtime conditions may still stop a bounded run |
| Performance thresholds | No final p95, RPS, allowed error rate, or maximum stable capacity in Phase E; omit or label any future placeholder non-final |
| Report mapping | Conditionally approve Load summary, Stress CSV, Spike dashboard HTML as a technical proposal; preserve native raw data for all scenarios |
| Compliance | H-002 remains `WAITING FOR LECTURER/TA CLARIFICATION`; never fabricate/rename JTL or claim compliance early |
| H-035 authorization | Mark `DONE BY HUMAN` only after this review is applied; condition satisfied before status update |
| Next phase | Phase F — Shared k6 Architecture and Static Implementation Review; draft/static work only |

### Preserved human correction

> DO NOT finalize these AI-proposed rules yet: 5 consecutive connection
> failures; 5 consecutive unexpected 401/403 responses across two accounts; 10
> consecutive checkout/cancellation 5xx responses; or `http_req_failed >= 20%`
> for two consecutive 15-second windows.
>
> Status: DEFERRED — REQUIRES PILOT/RUNTIME EVIDENCE.
>
> Individual failures remain observable and classified, confirmed dangerous
> runtime conditions may still stop the test, and approved VU/wall-clock caps
> remain mandatory.

The complete verbatim review and Phase F instruction is preserved in
[`../ai-audit/interactions/014-phase-e-review-phase-f-static-k6.md`](../ai-audit/interactions/014-phase-e-review-phase-f-static-k6.md).

## HD-009 — Phase F approval and human resolution of H-002

| Field | Human decision |
|---|---|
| Recorded | 2026-09-01 17:01:08 +07 (Asia/Ho_Chi_Minh) |
| Decision owner | Phạm Ngọc Gia Bảo — HUMAN |
| Phase F | **APPROVED**; one shared WF-03 workflow and workload-only scenario entries remain mandatory |
| Checks/metrics/state | Approve stable checks, one outcome, first terminal failure, low-cardinality tags, native latency reuse, approved custom metrics, and iteration-local response state |
| Data mapping | Approve `exec.vu.idInTest` dedicated mapping; Load requires 01..05 and Stress/Spike require 01..20; no wrapping/sharing/static dynamic values |
| Failure/safety | Approve fail-fast/immediate safety design; four numeric abort proposals remain deferred; final performance thresholds remain undefined |
| Previous H-002 state | AI recommended lecturer/TA clarification because literal `.jtl`/HTML wording appeared ambiguous |
| Human H-002 decision | No external clarification required; use the official PDF and its explicit k6-equivalent-output permission |
| Current H-002 state | **RESOLVED BY HUMAN DECISION — USE K6 EQUIVALENT OUTPUTS** |
| Canonical raw output | Native granular k6 JSON for every official scenario |
| Distinct primary views | Load aggregate/custom summary; Stress CSV time-series analysis; Spike real k6 web-dashboard HTML |
| Report directories | Real per-scenario `raw/` and `report/` directories created only from actual data; Load/Stress views must be substantively different |
| Prohibitions | Never rename JSON/CSV to `.jtl`, synthesize JMeter structure, call k6 output native JMeter, or generate reports before data exists |
| H-036 authorization | Mark `DONE BY HUMAN` only after applying this review; condition satisfied before status update |
| Git recovery | Truthfully commit existing artifacts in current-content groups; no fake/backdated history, rewrite, or push |
| Next phase | Phase G installation/static-init verification and 2-VU pilot preparation; pilot execution remains blocked |

The full verbatim human review and Phase G instruction is preserved in
[`../ai-audit/interactions/015-phase-f-review-phase-g-toolchain.md`](../ai-audit/interactions/015-phase-f-review-phase-g-toolchain.md).

### Phase G application result (AI execution evidence, not a new human decision)

The authorized normal Homebrew installation pinned k6 v2.2.0 darwin/arm64 at
`/opt/homebrew/bin/k6`. Real no-HTTP init/output capability probes verified the
draft imports/options/execution APIs and native JSON/CSV/custom-summary/dashboard
interfaces. The SUT remained stopped and no account was provisioned.

Source inspection exposed an ordering constraint for the future pilot:
starting this backend resets/seeds its database, so the disposable backend must
start once, finish registration preconditioning, then remain the same owned
process for the pilot. Restarting it after registration would erase the test
accounts. This implementation detail is recorded for H-037 review; it does not
change or pre-approve the human's isolation/preconditioning policy.
