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

## HD-010 — Controlled 2-VU Pilot execution approval

| Field | Human decision |
|---|---|
| Recorded | 2026-09-01 (Asia/Ho_Chi_Minh) |
| Decision owner | Phạm Ngọc Gia Bảo — HUMAN |
| Phase G review | **APPROVED FOR CONTROLLED 2-VU PILOT ONLY** |
| One-start ordering | Fresh disposable backend starts once, resets/seeds, remains the same owned process through provisioning and Pilot, then exact PID stops |
| Provisioning | Exactly accounts 01/02 via real registration, sequential secure private passwords, mode-0600 file outside Git, role/unlocked/login validation |
| Workload | 30s ramp to 2, 3m hold, 30s ramp down, five-minute wall cap |
| Business semantics | Use unchanged shared WF-03; never weaken checks to pass |
| Evidence | Genuine Pilot-only command/timestamps/output/log/setup/preflight evidence; never relabel as official |
| Failure policy | Preserve first failure, classify it, propose smallest fix, and require review for semantic/metric/evidence changes |
| Deferred rules | Four numeric abort proposals and final performance thresholds remain deferred |
| Git | Truthful local Pilot commit allowed; secrets/temp private files prohibited; no push |
| H-037 authorization | Mark `DONE BY HUMAN` for this single Pilot execution approval |

The actual human prompt is preserved verbatim in
[`../ai-audit/interactions/016-phase-g-review-2vu-pilot-execution.md`](../ai-audit/interactions/016-phase-g-review-2vu-pilot-execution.md).

### Execution outcome (AI evidence, not a new human decision)

Preflight and two-account provisioning passed, but the Pilot failed before its
first HTTP request because k6 rejects `::` in group names. The resulting tight
runtime-exception loop produced 9,699,772 failed attempts and approximately
21.6 GiB of local JSON/CSV/stderr. No corrected rerun occurred. Human review is
now required for the proposed group/tag/safety/runner changes and artifact
handling before any fresh Pilot.

## HD-011 — Failed-Pilot review and corrected-Pilot authorization

| Field | Human decision |
|---|---|
| Recorded | 2026-09-01 22:07:02 +07 (Asia/Ho_Chi_Minh) |
| Decision owner | Phạm Ngọc Gia Bảo — HUMAN |
| Failure classification | Test-harness/k6 compatibility defect; not SUT performance and not a confirmed SUT bug |
| Group/check correction | Replace every executable `::` group/check name with stable k6-safe names; preserve workflow semantics and assertions |
| Traffic correction | Shared custom metrics use execution-context traffic: Pilot `pilot`, official future scenarios `measured` |
| Exception correction | Expected workflow failures end one iteration with one outcome; unexpected sanitized harness/runtime exceptions invoke test-level abort |
| Runner correction | Capture exact k6 PID/numeric exit/start/exit/flush times and enforce a five-minute exact-PID watchdog |
| Corrected-Pilot outputs | JSON, summary, stdout/stderr, preflight, provisioning, backend log, runtime metadata only; no Pilot CSV/dashboard |
| Failed bulk evidence | Preserve exact metadata/root error/bounded excerpt/summary in Git, then delete only the three named untracked pathological files |
| Rerun authorization | Exactly one fresh commit-pinned corrected 2-VU Pilot with the unchanged workload and WF-03 semantics |
| H-038 | `DONE BY HUMAN` after this decision is applied and committed |
| Prohibitions | No official scenario, endurance, threshold finalization, or push |

The actual human review is preserved verbatim in
[`../ai-audit/interactions/017-failed-pilot-review-corrected-pilot.md`](../ai-audit/interactions/017-failed-pilot-review-corrected-pilot.md).

### HD-011 application outcome

The minimum fix commit is `c75b514`. The authorized exact cleanup completed and
reclaimed about 21.62 GiB. Fresh corrected Attempt `20260901T221331+0700`
stopped before provisioning when the clone-local helper invocation triggered
`runtime_is_original_repository`; it created no account/credential and sent no
k6 traffic. This is AI execution evidence, not a new human decision. A changed
helper invocation/new fresh attempt awaits human review.

## HD-012 — Original-worktree helper invocation and fresh corrected Pilot

| Field | Human decision |
|---|---|
| Recorded | 2026-09-01 22:35:38 +07 (Asia/Ho_Chi_Minh) |
| Decision owner | Phạm Ngọc Gia Bảo — HUMAN |
| Blocked attempt | Confirmed helper-invocation/setup defect; no account/k6 traffic; not SUT performance or confirmed SUT bug |
| Approved invocation | Run unchanged helper from `/Users/phamngocgiabao/eshop-sut-hw05-23127027`, passing a new `/private/tmp/...` clone as `WF03_DISPOSABLE_ROOT` |
| Mandatory boundary | Different absolute roots and DB inodes, correct marker/commit/hash/PID/port/localhost target before registration |
| Helper semantics | Must remain unchanged; stop for review if original-worktree invocation cannot support the boundary safely |
| Fresh setup | New clone only; one backend start; exactly customers 01/02; validate credentials/role/unlocked/zero orders |
| Pilot | Execute the unchanged bounded 2-VU Pilot only if all setup gates pass; preserve bounded authentic outputs |
| H-039 | `DONE BY HUMAN` after this invocation decision is committed |
| Next gate | H-040 fresh corrected-Pilot evidence review; no official scenario implied |

The actual human review is preserved in detail in
[`../ai-audit/interactions/018-invocation-boundary-review-fresh-corrected-pilot.md`](../ai-audit/interactions/018-invocation-boundary-review-fresh-corrected-pilot.md).

### HD-012 application outcome

Fresh attempt `20260901T223944+0700` passed the approved boundary and unchanged
helper invocation. Exactly two accounts passed setup. The bounded corrected
Pilot completed 81/81 exact WF-03 lifecycles with 3,078/3,078 checks, 0/567
failed HTTP requests, and 81/81 created orders canceled. k6 exited 0 after 246
seconds; watchdog did not fire. Original DB integrity/hash remained unchanged.
These are AI execution observations, not a new human decision or official
performance conclusion. HD-013 below records the later H-040 human review.

## HD-013 — Successful corrected-Pilot approval and Phase I boundary

| Field | Human decision |
|---|---|
| Recorded | 2026-09-01 23:03:50 +07 (Asia/Ho_Chi_Minh) |
| Decision owner | Phạm Ngọc Gia Bảo — HUMAN |
| Pilot verdict | Successful corrected 2-VU Pilot validates the shared WF-03 implementation; it is not an official Load/Stress/Spike result |
| H-040 | `DONE BY HUMAN` after this decision and Phase I records are applied |
| Measurement boundary | Pilot latency/RPS/error values cannot become final thresholds, capacity, endurance, or official scenario conclusions |
| Historical defects | Preserve invalid `::` names, tight exception loop/21.6-GiB output, human harness corrections, clone-local helper invocation failure, human invocation correction, and final 81/81 pass |
| Shared workflow | Preserve all four approved think-time ranges and the exact login/search/detail/checkout/pending/cancel/final flow for every official scenario |
| Official workloads | Preserve exact approved Load, 12m30s Stress, and 6m5s Spike configs; do not set final performance thresholds |
| Filename boundary | AI must create only a blank checklist; the human creates/renames the three attributable filenames and selects the actual appropriate date |
| Setup boundary | Fresh one-start disposable runtime and 20 validated accounts for each scenario; Load activates 01..05, Stress/Spike 01..20 |
| Output decision | Native JSON for all; Load aggregate, Stress CSV analysis, Spike dashboard; real per-scenario report dirs only from real data; no JTL fabrication |
| Human evidence | Real resource/hardware screenshots and hostname compatibility remain human tasks |
| Authorization limit | Phase I documentation/static preparation only; no official execution, endurance, push, or official filename creation |

The human's actual Phase I instruction and the resulting artifacts are recorded
in [`../ai-audit/interactions/019-successful-pilot-review-phase-i.md`](../ai-audit/interactions/019-successful-pilot-review-phase-i.md).

## HD-014 — Human official-filename creation and blocked wrapper validation

| Field | Human action / validation result |
|---|---|
| Recorded | 2026-09-01 23:31:14 +07 (Asia/Ho_Chi_Minh) |
| Human actor | Phạm Ngọc Gia Bảo |
| Human-created Load file | `performance/scenarios/official/23127027_Load_20260901.js` |
| Human-created Stress file | `performance/scenarios/official/23127027_Stress_20260901.js` |
| Human-created Spike file | `performance/scenarios/official/23127027_Spike_20260901.js` |
| Filename result | All three basenames pass the PDF pattern, student ID, scenario type/case, date `20260901`, and `.js` extension |
| H-010 | `DONE BY HUMAN` for official filename creation/approval |
| Content result | **BLOCKED**: byte-identical content moved under `official/` resolves `../config`, `../lib`, and `../data` beneath `performance/scenarios/`, where those paths do not exist |
| k6 evidence | Pinned `k6 inspect` rejected all three on missing `../config/workloads.js`; no SUT HTTP occurred |
| Correction authority | Codex must not edit the human-created wrappers; human correction and revalidation are required |
| Execution boundary | No Load preparation/execution, Stress/Spike preparation, backend, provisioning, result, threshold, or push |

The exact validation interaction is recorded in
[`../ai-audit/interactions/020-human-official-filenames-validation.md`](../ai-audit/interactions/020-human-official-filenames-validation.md).

## HD-015 — Official-wrapper path correction and Load-only preparation

| Field | Human decision / result |
|---|---|
| Human approval received | 2026-09-01 (Asia/Ho_Chi_Minh); continued record completed 2026-09-02 09:05 +07 |
| Approved correction | In all three human-named wrappers, change only four module prefixes and one public-data prefix from `../` to `../../` |
| Immutable fields | Filenames, scenario names/workloads, workflow, think time, checks, correlation, metrics, tags, safety, and data schema unchanged |
| Validation | Pinned k6 initialized Load/Stress/Spike; normalized wrapper diffs empty; exact workloads and `traffic=measured`; `thresholds=null` |
| Wrapper commit | `90fb1ae` — `test: add human-named official k6 wrappers` |
| Load plan | Preserve 0→5/1m, 5/5m, 5→0/1m, 30s graceful settings, 7m scheduled, 8m cap |
| Accounts | Provision/validate exactly 20 before Load; only customers 01..05 active; no sharing/wrapping |
| Execution boundary | Prepare Load only; no backend, provisioning, Load/Stress/Spike/endurance traffic, threshold, screenshot fabrication, or push |
| Next human gates | H-009 lockout-procedure confirmation, H-011 Load execution approval, screenshot/resource readiness, and hardware evidence tasks |

The human instruction, correction, revalidation, commit, and Load-only
preparation are recorded in
[`../ai-audit/interactions/021-wrapper-correction-load-preparation.md`](../ai-audit/interactions/021-wrapper-correction-load-preparation.md).
