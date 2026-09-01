# Checks, Metrics, and Operational Safety Proposal

Status: **PHASE E HUMAN-REVIEWED AND APPROVED WITH NUMERIC ABORT DEFERRAL**

Scope: WF-03, `Purchase followed by customer cancellation`

Tool: k6
Prepared: 2026-09-01 (Asia/Ho_Chi_Minh)

No SUT was started, no account was provisioned, no k6 script was generated, and no performance test was executed while preparing this proposal.

### Phase E review history

| Topic | ORIGINAL AI PROPOSAL | HUMAN REVIEW/CORRECTION | CURRENT APPROVED PHASE E DECISION |
|---|---|---|---|
| Checks | Exact seven-step status/body/correlation/business checks | Approved without weakening | HTTP 200 is insufficient; success requires final same-order canceled verification |
| Metrics | Native tagged request metrics plus seven minimal custom metrics | Approved | Retain the exact metric types and one-outcome rule in Sections 4–5 |
| Failure taxonomy | Six bounded failure classes | Approved | Final Phase E taxonomy and low-cardinality tag contract |
| Immediate safety stops | Stop clearly invalid or dangerous execution | Approved | Wrong target, confirmed service loss/lockout, unusable preflight, corrupt runtime, or evidence/runtime failure may stop the test |
| Disk, duration, workload bounds | 2 GiB preflight, wall-clock/graceful bounds, approved VU maxima | Approved | Operational protections only, never performance acceptance thresholds |
| Four numeric error-based aborts | 5 connection failures; 5 cross-account auth failures; 10 transactional 5xx; 20% failures across two 15 s windows | Corrected: arbitrary pre-execution cutoffs may hide Stress/Spike degradation and add premature coordination complexity | **DEFERRED — REQUIRES PILOT/RUNTIME EVIDENCE**; observe/classify individual failures while keeping hard VU/time bounds |
| Performance thresholds | Deliberately unset | Approved | No final p95, RPS, allowed error rate, or stable capacity before real evidence and later human review |

The original numeric proposals remain below as historical proposals. Their
presence is not implementation authorization.

## 1. Phase D human-review result

Phase D is human-reviewed and approved subject to the recorded authentication correction. H-034 may be marked `DONE BY HUMAN` only together with the documentation and audit updates that preserve this history:

| Decision stage | Authentication-failure policy |
|---|---|
| Original Phase D AI proposal | The first unexpected login `401`/`403` was proposed as a whole-test safety abort. |
| Human correction | One isolated unexpected `401`/`403` from a previously validated credential fails only that iteration and remains useful Stress/Spike evidence. |
| Current approved decision | Record the auth failure, stop that iteration before Search, do not try another credential, and continue the official run. A test-level abort is reserved for confirmed lockout or clear systemic/runtime danger. No repeated-auth numeric cutoff is approved yet. |

The other approved Phase D decisions remain: guarded `exec.vu.idInTest` mapping for separately executed local scenarios; exactly one expected product-name match; same-order correlation through the complete lifecycle; visible incomplete lifecycles after order creation; stable low-cardinality request tags; and iteration-owned response correlation state.

## 2. Check semantics

- Check names below are exact, stable, and contain no dynamic identifiers or secrets.
- Each HTTP request carries the approved static `workflow`, `step`, `endpoint_group`, `operation_role`, `traffic`, and `scenario` tags.
- A request must pass its status, body-shape, correlation, and business checks as applicable. HTTP `200` alone never makes a step successful.
- Parsing and field access are guarded. If JSON parsing fails, the body-shape check is false, dependent field checks are not evaluated against invented data, the step receives one terminal failure classification, and later workflow requests are skipped.
- Native k6 `checks` retains assertion-level detail. The custom workflow-outcome sample supplies one complete attempted-iteration denominator even when an iteration stops early.

## 3. Exact stable checks

The response contracts are those already verified for WF-03: login returns a successful object with `token` and authenticated `user`; search returns a product array; detail returns the selected product; checkout returns a success object with `orderId`; order probes return the order object; and cancellation returns its success acknowledgement.

### 3.1 Login

| Exact check name | Pass condition |
|---|---|
| `login: status is 200` | HTTP status is exactly `200`. |
| `login: body is valid JSON object` | The body parses as JSON and is a non-null, non-array object. |
| `login: response indicates success` | The verified login success semantics are present and no error semantics are present. |
| `login: token is non-empty` | `token` exists after parsing, is a string, and is non-empty after trimming. |
| `login: identity matches dedicated credential` | Returned authenticated email/identity equals the current VU's private credential identity. |
| `login: role is user` | Returned role is exactly `user`. |
| `login: account is unlocked` | The returned/verified account state does not indicate lockout. |

An unexpected `401` or `403` increments the unexpected-auth metric, classifies the iteration as an authentication failure, and prevents all later requests in that iteration. It does not by itself abort the test.

### 3.2 Search

| Exact check name | Pass condition |
|---|---|
| `search: status is 200` | HTTP status is exactly `200`. |
| `search: body is valid product array` | Body parses to an array whose entries have the fields required for exact selection. |
| `search: exactly one expected product matches` | Exactly one entry has a product name equal to `expected_product_name`; partial or fallback matches do not count. |
| `search: selected product id is valid` | The single matching entry has a valid positive product identifier. |

Zero or multiple exact matches fail the current iteration before Detail.

### 3.3 Product detail

| Exact check name | Pass condition |
|---|---|
| `detail: status is 200` | HTTP status is exactly `200`. |
| `detail: body is valid product object` | Body parses as a non-null product object. |
| `detail: id matches correlated product id` | Returned ID equals the `productId` extracted from this iteration's search response. |
| `detail: name matches expected product` | Returned name exactly equals the public row's `expected_product_name`. |
| `detail: price is positive and finite` | The normalized price is numeric, finite, and greater than zero. |

The detail response, rather than CSV, is authoritative for the price used in checkout calculations.

### 3.4 Checkout

| Exact check name | Pass condition |
|---|---|
| `checkout: status is 200` | HTTP status is exactly `200`. |
| `checkout: body is valid JSON object` | Body parses as a non-null, non-array object. |
| `checkout: response indicates success` | The verified checkout success semantics are present and no error semantics are present. |
| `checkout: new order id is valid` | The response contains a valid positive newly created `orderId`. |

`wf03_orders_created` is incremented only after the order ID has passed these checks. No static or previous-iteration fallback is permitted.

### 3.5 Pending probe

| Exact check name | Pass condition |
|---|---|
| `pending_probe: status is 200` | HTTP status is exactly `200`. |
| `pending_probe: body is valid order object` | Body parses as the expected order object. |
| `pending_probe: id matches correlated order id` | Returned ID equals the order ID created in this iteration. |
| `pending_probe: owner matches authenticated user` | Returned owner/user ID equals this iteration's authenticated user where exposed by the response. |
| `pending_probe: amount matches checkout total` | Returned amount normalizes to the total derived from this iteration's detail price. |
| `pending_probe: address matches checkout address` | Returned address equals the selected public workflow row's shipping address. |
| `pending_probe: state is pending` | Returned state/status is exactly the verified pending value. |

Failure after order creation is recorded as an incomplete lifecycle. The correlated order is not replaced or hidden.

### 3.6 Cancellation

| Exact check name | Pass condition |
|---|---|
| `cancellation: request uses correlated order id` | The request path/payload is built from this iteration's validated order ID. |
| `cancellation: status is 200` | HTTP status is exactly `200`. |
| `cancellation: body is valid JSON object` | Body parses as the verified cancellation-response shape. |
| `cancellation: response indicates success` | The verified cancellation success semantics are present and no error semantics are present. |

The success acknowledgement is not sufficient to count the order as canceled; the Final Probe must confirm the state.

### 3.7 Final probe

| Exact check name | Pass condition |
|---|---|
| `final_probe: status is 200` | HTTP status is exactly `200`. |
| `final_probe: body is valid order object` | Body parses as the expected order object. |
| `final_probe: id matches correlated order id` | Returned ID equals the order ID created and canceled in this iteration. |
| `final_probe: owner matches authenticated user` | Returned owner/user ID remains the same where exposed. |
| `final_probe: amount remains checkout total` | Returned amount remains the value derived from this iteration's product price. |
| `final_probe: address remains checkout address` | Returned address remains the selected shipping address. |
| `final_probe: state is canceled` | Returned state/status is exactly the verified canceled value. |

Only after all Final Probe invariants pass are `wf03_orders_canceled` incremented and the final workflow outcome marked successful.

## 4. Metric design

### 4.1 Native metrics retained

| Requirement | Metric/type | Design |
|---|---|---|
| Endpoint latency Trends for all seven steps | Native `http_req_duration` (`Trend`) | Query/group by the static `step=login|search|detail|checkout|pending_probe|cancellation|final_probe` tag. Seven redundant custom latency Trends are not created. |
| Request protocol failure | Native `http_req_failed` (`Rate`) | Use with stable step/scenario tags. It is not the workflow business-failure rate. |
| Assertion detail | Native `checks` (`Rate`) | Exact stable check names identify failed assertions. |
| Request volume and transfer | Native `http_reqs`, `data_sent`, `data_received` (`Counter`) | Preserve native samples. |
| VU and iteration execution | Native `vus`, `vus_max`, `iterations`, `iteration_duration` | Preserve native samples; custom attempted/outcome metrics define the business denominator. |

### 4.2 Minimal custom metrics

| Metric | Type | Emission rule | Covers |
|---|---|---|---|
| `wf03_workflow_attempted` | `Counter` | Add `1` exactly once at the start of every official iteration after the guarded row/credential lookup. | Workflow attempted. A lookup failure is a setup/data error and must be represented separately rather than pretending the workflow started. |
| `wf03_workflow_success` | `Rate` | Add exactly one Boolean sample in a single finalization path for every attempted iteration: `true` only after the canceled Final Probe passes; otherwise `false`. | Workflow succeeded, workflow failed, and lifecycle success. Successes are true samples; failures are false samples. No duplicate success/failure/lifecycle Rate is created. |
| `wf03_failures` | `Counter` | Add `1` at most once for the first terminal workflow failure, with low-cardinality `step` and `failure_class` tags. | Auth, search, detail, checkout, pending-verification, cancellation, and final-verification failure counts by tag. |
| `wf03_unexpected_auth_response` | `Counter` | Add `1` for an unexpected login `401` or `403`, with a bounded `status=401|403` tag. | The narrower unexpected-auth-response count; other auth validation failures remain visible in `wf03_failures`. |
| `wf03_orders_created` | `Counter` | Add `1` only after checkout returns and validates a new positive order ID. | Validated orders created. |
| `wf03_orders_canceled` | `Counter` | Add `1` only after the Final Probe confirms the same order is canceled. | Completed cancellations, not merely acknowledgements. |
| `wf03_lifecycle_duration` | `Trend` | Add one duration from checkout request start through successful or terminal post-checkout completion; emit only when checkout was attempted, tagged with bounded `outcome=success|incomplete`. | Non-redundant order-lifecycle duration; native request and iteration duration do not isolate this interval. |

The following requested concepts are deliberately represented without redundant custom metric names:

- `workflow succeeded` = true samples/count from `wf03_workflow_success`;
- `workflow failed` = false samples/count from `wf03_workflow_success`;
- `lifecycle success` = the same true outcome because WF-03 is successful only when its order lifecycle reaches verified canceled state;
- each named step failure = `wf03_failures` filtered by stable `step`;
- endpoint latency = native `http_req_duration` filtered by stable `step`.

Allowed custom failure tags are bounded values only:

- `step=login|search|detail|checkout|pending_probe|cancellation|final_probe|setup`
- `failure_class=transport_protocol|authentication|correlation_data|business_assertion|lifecycle|runtime_safety`

No email, token, user ID, product ID, order ID, address, response text, exception text, or dynamic URL is a metric/tag value.

## 5. Exactly one workflow outcome per attempt

The future shared implementation must follow this control rule:

1. Complete the guarded VU-to-row and VU-to-credential lookup. A mapping/preflight failure is a setup/data failure and stops safely.
2. Increment `wf03_workflow_attempted` once.
3. Initialize iteration-local `workflowSucceeded = false`, `terminalFailureRecorded = false`, `outcomeEmitted = false`, and empty iteration correlation fields.
4. At the first terminal failure, increment `wf03_failures` once, keep `workflowSucceeded = false`, and stop later business requests for that iteration.
5. Set `workflowSucceeded = true` only after the Final Probe validates the same order and canceled state.
6. Use one guarded `emitOutcomeOnce(value)` path. Normal returns call it from a `finally`-style finalizer; a reviewed test-level abort calls it before requesting abort. The `outcomeEmitted` guard prevents a second sample.

Thus a seven-step success still contributes one final outcome, and an early Login failure also contributes one final outcome. Checks and request failures may contain several diagnostic samples, but they do not double-count the final business result.

## 6. Failure taxonomy and effects

Only the first terminal failure is counted in `wf03_failures`; native request/check metrics retain the detailed evidence around it.

| Class | Examples | Current iteration | Metrics/evidence | Later requests | Possible test-level abort |
|---|---|---|---|---|---|
| 1. Transport/protocol | Connection error, timeout, unexpected HTTP status, unparseable required JSON | Fail | Native request/check metrics; one tagged `wf03_failures` sample | Stop at failed boundary | Only when a separately approved systemic safety rule is met, such as verified port loss or repeated connection failure |
| 2. Authentication | Unexpected `401`/`403`, missing token, wrong returned identity/role, confirmed lockout | Fail | Auth check; `wf03_failures{step:login}`; `wf03_unexpected_auth_response` for `401`/`403` | Do not Search or try another credential | Not for one isolated response; possible for confirmed lockout or approved repeated systemic condition |
| 3. Correlation/data | VU index outside data, row/key mismatch, zero/multiple exact products, invalid/mismatched product or order ID, absent required response value | Fail safely | Data/preflight evidence or one tagged workflow failure | Never use a fallback or prior value | Yes for invalid shared setup/account pool; response-local defects ordinarily fail only the iteration |
| 4. Business assertion | Wrong product identity, non-positive price, wrong success semantics, amount/address/owner mismatch | Fail | Exact check plus one tagged workflow failure | Stop at boundary; if an order already exists, preserve it as evidence | Normally no; only if a separately approved systemic/danger rule is met |
| 5. Lifecycle | New order not pending, cancellation fails, final state not canceled, post-checkout probe failure | Fail and mark incomplete lifecycle | Step check; failure metric; created-versus-canceled counters expose residuals | Do not substitute or mutate an order; preserve residual order | Possible only under an approved catastrophic repeated transactional rule |
| 6. Runtime/safety | Backend death, listener loss, confirmed lockout cascade, disk/output failure, corrupted/unusable runtime | Fail/stop | Runtime monitor, process/output evidence, safety-event record | Prevent unsafe/meaningless traffic | Yes; this class exists specifically for reviewed operational aborts |

An incomplete order lifecycle is not automatically cleaned through SQLite or hidden from reports. It is legitimate execution evidence and must be preserved before the disposable runtime is reset.

## 7. Operational safety-stop proposal

These are safety guardrails, not performance acceptance thresholds. They protect the disposable SUT, accounts, evidence, and host. They must not be reported as measured capacity or silently copied into final performance pass/fail thresholds.

| Condition | Proposed action | Numeric status | Implementation/evidence note |
|---|---|---|---|
| Original-repository integrity check fails or target is not the approved disposable runtime | Do not start / abort setup | No numeric rule | Verify resolved paths, commit pin, database isolation, and original DB hash. |
| Required account pool, mappings, role/unlocked state, authentication preflight, or comparable starting order state is invalid | Fail preflight; do not start measured traffic | Exactly 20 required for 20-VU Stress/Spike; 01..05 active for Load | This is a data-validity gate, not an observed performance result. |
| Backend process dies or the verified listener/port is lost | Abort official run and preserve partial evidence | Immediate after confirmation | Confirm monitor signal so a transient request error alone does not masquerade as process death. |
| Repeated transport inability | Candidate abort after **5 consecutive connection failures** | **DEFERRED — REQUIRES PILOT/RUNTIME EVIDENCE** | Historical AI proposal only; do not implement before later review. Individual failures remain observable. |
| Confirmed account lockout behavior | Abort official run and preserve evidence | Immediate after confirmation; isolated `401`/`403` is insufficient | Confirmation requires an explicit lockout semantic or independent runtime/account-state evidence. |
| Repeated systemic authentication failure without confirmed lockout | Candidate abort after **5 consecutive unexpected `401`/`403` responses spanning at least 2 previously validated account slots** | **DEFERRED — REQUIRES PILOT/RUNTIME EVIDENCE** | Historical AI proposal only; no first-response or numeric auth abort is implemented. |
| Catastrophic repeated transactional failure | Candidate abort after **10 consecutive checkout or cancellation HTTP `5xx` responses** | **DEFERRED — REQUIRES PILOT/RUNTIME EVIDENCE** | Historical AI proposal only; preserve created orders and individual failure evidence. |
| Broad systemic request failure | Candidate abort if `http_req_failed >= 20%` in **two consecutive 15-second windows after startup** | **DEFERRED — REQUIRES PILOT/RUNTIME EVIDENCE** | Historical AI proposal only; do not build cross-VU/window coordination before controlled pilot evidence. |
| Insufficient free disk before execution | Do not start if free space is below **2 GiB** on the runtime/result volume | **APPROVED SAFETY CONTROL** | Recheck the actual result volume; value is a safety reserve, not a performance threshold. |
| Result/evidence write failure, filesystem read-only/full, database integrity failure, or unusable runtime | Abort and preserve recoverable partial evidence | Immediate after confirmation | Do not continue a run whose raw evidence cannot be trusted or stored. |
| Approved scenario wall-clock cap reached unexpectedly | Stop according to the reviewed scenario cap and preserve evidence | **APPROVED SAFETY CONTROL** | Bounded VUs, duration, and graceful stop prevent runaway execution; they are not SLAs. |

### 7.1 Aggregation constraint

The workflow must not introduce module-global response-derived state to count
safety events. The four numeric error-based abort rules are deferred and must
not be approximated with native thresholds, module-global counters, or an
external watchdog in Phase F. Controlled pilot/runtime evidence must come
first, followed by a new human decision.

### 7.2 Explicitly excluded from safety policy

- first isolated login `401`/`403`;
- a single ordinary workflow assertion failure;
- failure to meet an unmeasured p95, RPS, or error-rate goal;
- observed performance degradation that does not meet a reviewed operational-danger condition.

## 8. Phase E human decision and remaining review

1. Exact stable checks, the minimal metric design, and the one-terminal-failure/
   one-final-outcome rules are **APPROVED**.
2. Immediate invalid/unsafe-runtime stops, 2 GiB disk, and bounded VU/time/
   graceful behavior are **APPROVED SAFETY CONTROLS**.
3. Reconsider the four deferred numeric error-based abort candidates only after
   controlled pilot/runtime evidence exists.
4. Resolve the report/output compliance question in
   `docs/report-output-mapping.md` with lecturer/TA guidance.

The 2 GiB disk minimum and previously approved VU/wall-clock/graceful bounds are
authoritative safety controls. The four error-based numeric candidates are not.

## 9. Proposed next phase

After H-035 approval, while H-002 may remain externally pending, proceed to
**Phase F — Shared k6 Architecture and Static Implementation Review**. Its bounded scope is to
translate only the approved data, correlation, checks, metrics, safety, and
output contracts into reviewable shared modules and scenario configuration,
with static validation. k6 installation, account provisioning, SUT startup, and
any pilot/official execution remain separate human-authorized actions. The
Phase F draft is documented in `k6-architecture.md` and awaits H-036 review.
