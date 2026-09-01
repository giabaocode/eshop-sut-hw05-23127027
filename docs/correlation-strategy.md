# WF-03 Authentication and Dynamic Correlation Strategy

## Document control and boundary

| Field | Value |
|-------|-------|
| Phase | PHASE D — Authentication and Dynamic Correlation Strategy |
| Prepared | 2026-09-01 (Asia/Ho_Chi_Minh) |
| Status | **PHASE D HUMAN-REVIEWED AND APPROVED WITH AUTH CORRECTION** |
| Phase C prerequisite | Human-approved; H-033 `DONE BY HUMAN` after quantity removal and safe artifact validation |
| Workflow | WF-03 — Purchase followed by customer cancellation |
| Source commit | `85af3ba875c88283615e22cb108f13e2fccaf0e9` |
| k6/SUT execution | None |
| Final scripts | Not generated |

This is a formal design for a future shared implementation. It does not install
k6, start the SUT, provision accounts, send HTTP requests, or create measured
results.

### Phase D review history

| Topic | ORIGINAL AI PROPOSAL | HUMAN REVIEW/CORRECTION | FINAL APPROVED PHASE D DECISION |
|-------|----------------------|-------------------------|---------------------------------|
| VU identifier | Use `exec.vu.idInTest` in range `1..20` | Approve for separate local scenario runs; guard against actual approved row count and re-review if execution structure changes | Require `1 <= idInTest <= available approved rows`; direct `NN` mapping; no wrap/reuse/fallback |
| Product selection | Require exactly one exact expected-name match | Approved | Zero or multiple exact matches fail the iteration |
| Post-checkout failure | Stop the lifecycle and preserve possible residue | Approved | Pending/cancel/final failure remains visible; no ID substitution, alternate cancel, direct-SQL cleanup, or concealment |
| Isolated login 401/403 | Invoke test-level authentication stop policy | Corrected: isolated unexpected 401/403 from a validated credential is useful evidence and fails only its iteration | Record auth/iteration failure and stop later requests; test-level abort only for confirmed lockout or systemic/unsafe execution conditions |
| Tags/groups | Seven stable groups and low-cardinality tags | Approved | Final Phase D instrumentation contract |
| Correlation lifetime | VU-stable input; iteration-local response values | Approved | No module-global mutable response state or cross-VU/iteration leakage |

The old authentication proposal remains historical evidence here and in
Interaction 012. HD-007 and Interaction 013 preserve the human correction and
final decision.

Authoritative inputs:

- [`selected-workflow-specification.md`](selected-workflow-specification.md)
- [`test-data-strategy.md`](test-data-strategy.md)
- [`performance/data/workflow.csv`](../performance/data/workflow.csv)
- source/runtime evidence in
  [`runtime-api-verification.md`](runtime-api-verification.md)

## 1. Invariant measured workflow

Every Load, Stress, and Spike iteration executes this same ordered sequence:

```text
bind current VU to its dedicated public/private row
  → POST login
  → wait 0.5–1.0 s
  → GET product search/list
  → wait 1.0–2.0 s
  → GET correlated product detail
  → wait 1.5–3.0 s
  → POST checkout/create order
  → GET that order; verify pending
  → wait 0.5–1.0 s
  → PUT cancel that exact order
  → GET that same order; verify canceled
```

Only scenario workload configuration differs. Setup registration and account
validation finish before this sequence and use completely separate artifacts.

## 2. VU-specific data and credential lookup

### Identifier choice

Each official Load, Stress, and Spike scenario is assumed to run as a separate
local k6 test with at most 20 concurrent VUs. Under that reviewed structure, the
later implementation should use
`exec.vu.idInTest` from `k6/execution`. Official k6 documentation defines it as
the globally unique, one-based VU identifier for the whole test and documents
per-VU data parameterization as a use case
([k6 execution API](https://grafana.com/docs/k6/latest/javascript-api/k6-execution/),
[data parameterization](https://grafana.com/docs/k6/latest/examples/data-parameterization/)).
This is preferable to the legacy `__VU`, whose scope is per load-generator
instance. The exact installed k6 version must support the execution API before
implementation.

### Binding contract

```text
slot = exec.vu.idInTest          # one based
required range = 1..number of available approved rows (maximum 20)
public row = workflowRows[slot - 1]
expected account key = wf03-customer-NN
private row = credentialByAccountKey[expected account key]
```

Before any request, require:

- integer VU ID satisfying `1 <= idInTest <= available approved row count`;
- public row count exactly 20 and suffix/order matching the VU slot;
- exactly one private credential row for that `account_key`;
- deterministic expected email and role `user`;
- nonempty runtime password without logging it.

Failure is a configuration/data-allocation failure. The VU sends no HTTP
request, records a stable sanitized failure, and requests a safe test stop. It
must not modulo-wrap, use the seed customer, select a random row, or borrow
another VU's account.

If official scenarios are later combined, distributed, segmented, or otherwise
change execution structure, the identifier/mapping contract must return to
human review before use.

## 3. Request-by-request correlation design

### Step 1 — Login

```http
POST /api/login
Accept: application/json
Content-Type: application/json

{"email":"<private row email>","password":"<private row password>"}
```

Validate transport success, HTTP 200, a JSON object, exact message
`Login successful`, no error field, a nonempty string `token`, positive integer
`user.id`, `user.email` equal to the dedicated credential, role `user`, and no
active lock. Do not print the response because the current SUT returns sensitive
user fields.

Extract a fresh JWT and authenticated user ID. Construct
`Authorization: Bearer <JWT>` only in iteration-local memory. Never retry login
with another or guessed password. One isolated unexpected login 401/403 from a
previously validated credential records authentication and iteration failure,
then stops Search/Detail/Checkout/Cancel for that iteration. It does not by
itself abort the official test. Confirmed lockout or repeated systemic auth
failure indicating unsafe/unusable execution may trigger a separately reviewed
test-level safety abort; Phase D sets no numeric repetition cutoff.

After successful validation, independently wait a uniform random 0.5–1.0
seconds before search.

### Step 2 — Product search and selection

```http
GET /api/products?search=<URL-encoded public search_term>
Accept: application/json
```

Require HTTP 200 and a valid JSON array. Find rows whose `name` exactly equals
the public `expected_product_name`; require exactly one exact match. Extract its
positive integer `id` as the iteration's product ID. Do not use the CSV position,
search result position alone, or a seed/static ID.

After successful selection, independently wait 1.0–2.0 seconds before detail.

### Step 3 — Product detail and price

```http
GET /api/products/:productId
Accept: application/json
```

The path ID comes only from this iteration's search response. Require HTTP 200,
a nonempty JSON object, returned ID equal to the correlated product ID, and name
equal to the expected seeded-product name.

Price validation accepts either a finite positive JSON number or a strictly
numeric string because the verified SUT stringifies prices for some product
IDs. Normalize it to a finite positive numeric value. Reject missing values,
empty strings, signs/decimals outside the reviewed contract, `NaN`, infinity,
zero, or negative values. There is no default price.

After successful validation, independently wait 1.5–3.0 seconds before
checkout.

### Step 4 — Checkout and order ID

```http
POST /api/checkout
Accept: application/json
Content-Type: application/json
Authorization: Bearer <current iteration JWT>

{"total_amount":<validated detail price>,"shipping_address":"<public row address>"}
```

Quantity is absent: the verified WF-03 request does not submit or use it.
Validate the address as the current VU's nonempty synthetic value and the total
as the normalized correlated detail price.

Require HTTP 200, valid JSON, exact message `Checkout successful`, no error
field, and a positive integer `orderId`. This new ID belongs only to the current
VU/current iteration. Missing or invalid order ID prevents every later order
request.

### Step 5 — Pending-state probe

```http
GET /api/orders/:orderId
Accept: application/json
```

The route is public in the verified SUT, so no Authorization header is required.
Require HTTP 200 and validate:

- `id` equals the checkout-correlated order ID;
- `user_id` equals the login-correlated user ID;
- `total_amount` equals the submitted normalized price;
- `shipping_address` equals the current public row;
- `status` is exactly `pending`.

Only after every pending check passes, independently wait a uniform random
0.5–1.0 seconds before cancellation.

### Step 6 — Cancel the same order

```http
PUT /api/orders/:orderId/cancel
Accept: application/json
Content-Type: application/json
Authorization: Bearer <same current iteration JWT>

{}
```

Use the unchanged checkout-correlated order ID and same iteration JWT. Require
HTTP 200, valid JSON, no error field, and exact message
`Order canceled successfully`. Never substitute an earlier or another VU's ID.

### Step 7 — Canceled-state probe

```http
GET /api/orders/:orderId
Accept: application/json
```

Require HTTP 200 and the same ID, user ID, total, and shipping address as the
pending probe, with `status` exactly `canceled`. Only then is the lifecycle and
iteration successful.

## 4. Dynamic-value ownership contract

| Value | SOURCE | VALIDATION | LIFETIME | OWNER | FAILURE BEHAVIOR |
|-------|--------|------------|----------|-------|------------------|
| VU slot | `exec.vu.idInTest` | Integer `1..20` | VU lifetime | Current VU | No requests; sanitized allocation failure; safe test stop |
| Public row | `workflow.csv[slot-1]` | Exact suffix/key/schema; reviewed search/address | VU lifetime, read-only | Current VU | No requests; never select another row |
| Credential row | Runtime-private map by account key | Exactly one match; expected email/role; nonempty password | Disposable run/VU, read-only | Current VU | No requests; never reveal or fall back |
| JWT | Login response `token` | HTTP/JSON/message valid; nonempty string | Current iteration only | Current VU/current iteration | Mark login/iteration failure and stop later requests; isolated 401/403 does not automatically abort test |
| Authenticated user ID | Login response `user.id` | Positive integer; email/role identity matches | Current iteration only | Current VU/current iteration | Abort before search/transaction calls |
| Product candidate | Search array exact-name match | Exactly one match with positive integer ID | Current iteration only | Current VU/current iteration | Mark search failure; abort before detail |
| Product ID | Selected candidate `id` | Positive integer; later detail ID must match | Current iteration only | Current VU/current iteration | No static/seed/prior-ID fallback; abort |
| Product price | Product-detail `price` | Numeric or strictly numeric string; normalized finite positive value | Current iteration only | Current VU/current iteration | Mark detail failure; abort before checkout |
| Checkout total | Normalized detail price | Same validated positive value; no CSV constant | Current iteration only | Current VU/current iteration | Abort before checkout if invalid |
| Shipping address | Public row | Nonempty approved synthetic pattern for current slot | VU lifetime, read-only | Current VU | Abort before checkout; do not default |
| Order ID | Checkout response `orderId` | HTTP/JSON/message valid; positive integer | Current iteration only | Current VU/current iteration | Mark checkout failure; no order probes/cancel |
| Pending order snapshot | Pending probe response | Same order/user/total/address; status `pending` | Current iteration only | Current VU/current iteration | Mark lifecycle failure; stop; possible pending residue remains visible |
| Cancellation acknowledgment | Cancel response | HTTP 200; exact message; no error | Current iteration only | Current VU/current iteration | Mark cancellation failure; stop before final probe |
| Canceled order snapshot | Final probe response | Same order/user/total/address; status `canceled` | Current iteration only | Current VU/current iteration | Mark lifecycle/iteration failure |

No response-owned value is written back to shared data or retained for the next
iteration.

## 5. Fail-fast state machine

```text
DATA_BOUND
  └─ login valid ──> AUTHENTICATED
       └─ search exact match ──> PRODUCT_SELECTED
            └─ detail/price valid ──> PRODUCT_VALIDATED
                 └─ checkout/orderId valid ──> ORDER_CREATED
                      └─ same order pending ──> PENDING_VERIFIED
                           └─ cancel acknowledged ──> CANCEL_ACKNOWLEDGED
                                └─ same order canceled ──> SUCCESS

any failed transition ──> FAILED (no later workflow request)
```

### Common failure rules

1. Each request checks transport/status before JSON/business-field access.
2. JSON parsing failures are caught and recorded without printing response
   bodies, tokens, credentials, email, or dynamic IDs.
3. A failed transition emits the step-specific failure and one false workflow
   outcome, then returns from the current iteration.
4. No retry with guessed credentials, no retry against another account, and no
   automatic business-request retry that would change request volume.
5. Pre-checkout failures create no order. A post-checkout failure may leave a
   pending or unknown-state order; this remains visible evidence and is never
   hidden by canceling a different order.
6. One isolated unexpected login 401/403 fails only the current iteration and
   prevents its later requests. Confirmed lockout, an unusable account pool, or
   repeated systemic authentication failure may justify test-level safety abort;
   Phase E deferred every numeric auth cutoff until controlled pilot/runtime
   evidence and a new human review.
7. Exactly one final iteration-success sample is recorded per attempted
   iteration, true only after the canceled-state probe passes.

The later implementation must distinguish a normal iteration-level return from
a reviewed test-level safety abort. Exact k6 syntax belongs to a later phase.

## 6. VU and iteration isolation

- Public and credential collections may be loaded once as read-only input, but
  must never hold mutable JWT/product/order state.
- At iteration start, create fresh local variables initialized to no value for
  JWT, user ID, product ID, price, total, order ID, and snapshots.
- Each iteration performs a new login and receives a fresh token.
- Stable VU data are its one public row and one private credential row only.
- Dynamic values exist in the current iteration's call frame and are discarded
  when it returns.
- Functions receive correlation values explicitly or through a newly created
  iteration context object; they do not read/write module-level mutable state.
- Request helpers return validated values or an explicit failure result. They
  never return a seed/default value.
- No account key, email, JWT, product ID, order ID, or address becomes a metric
  tag. This prevents secrets and high-cardinality series.

This preserves isolation even though many VUs execute the same shared workflow
module concurrently.

## 7. Stable grouping and metric tags

Instrumentation must distinguish all seven requests without changing their
order or adding API traffic.

| Step | Stable group | Request `name`/`step` tag | Endpoint category |
|------|--------------|---------------------------|-------------------|
| Login | `wf03::01_login` | `login` | `auth` |
| Search | `wf03::02_search` | `search` | `read` |
| Detail | `wf03::03_detail` | `detail` | `read` |
| Checkout | `wf03::04_checkout` | `checkout` | `transactional` |
| Pending probe | `wf03::05_pending_probe` | `pending_probe` | `read` (verification role) |
| Cancellation | `wf03::06_cancellation` | `cancellation` | `transactional` |
| Final probe | `wf03::07_final_probe` | `final_probe` | `read` (verification role) |

Every measured request uses stable low-cardinality tags:

- `workflow=wf03`;
- `step=<one of the seven values above>`;
- `endpoint_group=auth|read|transactional`;
- `operation_role=business|verification` (only the two order probes use
  `verification`);
- `traffic=measured`;
- a static scenario identifier supplied by Load, Stress, or Spike configuration.

Do not tag URLs with dynamic IDs. Stable request names prevent
`/api/orders/1`, `/api/orders/2`, and so on from becoming separate time series.
Groups and tags are instrumentation only; they add no HTTP request and do not
alter the business workflow.

The later implementation should feed the already planned endpoint Trends and
business Rates/Counters in `selected-workflow-specification.md`, including
separate durations for login, search, detail, checkout, pending probe,
cancellation, final probe, and the checkout-through-canceled lifecycle. No
numeric threshold is defined here.

## 8. Secret-safe diagnostics

Allowed diagnostic dimensions are stable step/check names, HTTP status,
failure class, scenario, and the non-secret account key only in a redacted
setup log when genuinely needed. Official metric tags omit account keys.

Forbidden diagnostic content includes password, JWT, Authorization header,
full login response, email, dynamic product/order IDs, request body containing
credentials, and raw response bodies that may contain sensitive user fields.
Errors must describe the violated contract, for example “login token missing”
or “pending order identity mismatch,” without printing actual values.

## 9. Phase D human-review result

The student approved guarded `exec.vu.idInTest` mapping for separate local
scenario runs, exact-one product selection, visible post-checkout residue,
stable groups/tags, and iteration/VU correlation lifetimes. The student
corrected isolated unexpected 401/403 handling from automatic test abort to
iteration failure. H-034 is `DONE BY HUMAN` after applying these decisions.

Phase E human review approved the correlation-dependent checks/metrics but
deferred the four numeric error-based abort proposals until controlled
pilot/runtime evidence. Phase F must not implement those cutoffs.

## 10. Proposed Phase E

**PHASE E — Checks, Custom Metrics, Safety Stops, and Report/Output Proposal**

Proposed scope:

- exact stable check names and one-sample-per-iteration semantics;
- endpoint Trends and business Rates/Counters;
- separation of transport, business, lifecycle, and safety failures;
- implementation design for authentication/backend/transactional abort guards;
- mapping of three distinct k6-equivalent output/report artifacts;
- explicit unresolved `.jtl`/HTML compliance analysis and lecturer/TA question;
- no final performance thresholds until genuine results exist.

Phase E must remain design-only unless the human separately authorizes tooling
installation, implementation, or execution.
