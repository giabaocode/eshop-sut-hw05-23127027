# WF-03 Performance-Testing Contract

## Document control

| Field | Value |
|-------|-------|
| Phase | PHASE A — Selected Workflow Specification |
| Prepared | 2026-09-01 (Asia/Ho_Chi_Minh) |
| Decision owner | **Phạm Ngọc Gia Bảo — HUMAN** |
| Selected workflow | **WF-03 — Purchase followed by customer cancellation** |
| Exact business flow | Login → Product Search/List → Product Detail → Checkout / Create Order → Cancel the newly created Order |
| Selection/uniqueness status | Human-approved; unique within the four-person group |
| Functional evidence | Human-approved one-iteration smoke with `pending → canceled` |
| Source commit | `85af3ba875c88283615e22cb108f13e2fccaf0e9` |
| Current boundary | Workload-independent contract only; no final k6 scripts, workload levels, thresholds, or measured performance values |

Authoritative supporting records:

- Human decisions: [`human-decisions.md`](human-decisions.md)
- Selected workflow and smoke summary: [`selected-workflow.md`](selected-workflow.md)
- Exact HTTP evidence:
  [`runtime-api-verification.md`](runtime-api-verification.md#11-selected-wf-03-functional-smoke-verification)
- Source endpoint inventory: [`sut-discovery.md`](sut-discovery.md)

## 1. Formal workflow contract

WF-03 retains five business actions, but its executable performance workflow
contains seven real HTTP requests. The two order-detail requests are invariant
validation substeps: one immediately after checkout and one immediately after
cancellation. Because they are executed by the test, they affect request count,
latency, iteration duration, and load. Load, Stress, and Spike must all execute
the same seven-request sequence. The business journey remains WF-03 — Purchase
followed by customer cancellation.

### Step 1 — Login

| Property | Contract |
|----------|----------|
| Endpoint category | **AUTH-HEAVY** |
| Method/route | `POST /api/login` |
| Authentication | Public; no prior token |
| Headers | `Accept: application/json`; `Content-Type: application/json` |
| Body | `{"email":"<valid private test email>","password":"<valid private test password>"}` |
| Runtime-verified expected status | `200` |
| Relevant response fields | `message="Login successful"`; nonempty string `token`; `user.id`; `user.email`; `user.role`; `user.login_attempts`; `user.locked_until` |
| Extract for later steps | JWT `token`; authenticated `user.id`; expected role for validation |
| State mutation | Successful source/runtime path schedules reset of `login_attempts=0` and `locked_until=NULL` for that user |
| Failure conditions | Network/parse failure; non-200; error payload; missing/empty token; missing user ID; unexpected email/role; observed 401 or 403; locked account |

Runtime evidence used the valid seeded customer and returned HTTP 200 with a
133-character JWT. The raw JWT and password are not stored in submission
documentation.

### Step 2 — Product search/list and selection

| Property | Contract |
|----------|----------|
| Endpoint category | **READ-HEAVY** |
| Method/route | `GET /api/products?search=<URL-encoded-search-term>`; an empty-search/list variation may use `GET /api/products` only when the same documented selection rule applies |
| Authentication | Public |
| Headers | `Accept: application/json` |
| Query | `search` comes from non-secret workflow data and must be URL encoded |
| Runtime-verified expected status | `200` |
| Relevant response fields | JSON array; candidate `id`, `name`, `price`, `description`, `imageUrl`, `category_id` |
| Extract for later steps | Selected `productId`; selected expected name; provisional price/category for validation |
| State mutation | None |
| Failure conditions | Network/parse failure; non-200; non-array body; empty array; no product matching the selection rule; missing/invalid ID/name/price |

The deterministic selection rule must be documented before implementation. The
initial proposed rule is “select the first row whose name matches the row's
expected product name.” It must not silently select an unrelated first result.

### Step 3 — Product detail

| Property | Contract |
|----------|----------|
| Endpoint category | **READ-HEAVY** |
| Method/route | `GET /api/products/:productId` |
| Authentication | Public |
| Headers | `Accept: application/json` |
| Path input | `productId` extracted from step 2; no static fallback |
| Runtime-verified expected status | `200` |
| Relevant response fields | `id`, `name`, `price`, `description`, `imageUrl`, `category_id` |
| Extract for later steps | Validated/normalized positive product price; validated product ID/name |
| State mutation | None |
| Failure conditions | Network/parse failure; non-200; empty `{}` despite HTTP 200; response ID differs from correlated ID; expected name mismatch; missing, nonnumeric, or nonpositive price |

The smoke product returned numeric price `30000000`. Source can stringify price
for even IDs, so future parsing may accept a finite positive number or a strictly
numeric string and normalize it. Invalid conversion must fail the iteration;
it must not produce a default amount.

### Step 4 — Checkout / create order

| Property | Contract |
|----------|----------|
| Endpoint category | **TRANSACTIONAL** |
| Method/route | `POST /api/checkout` |
| Authentication | Required: `Authorization: Bearer <correlated JWT>` |
| Headers | `Accept: application/json`; `Content-Type: application/json`; Bearer header |
| Body | `{"total_amount":<derived amount>,"shipping_address":"<test-data address>"}` |
| Runtime-verified expected status | `200` |
| Relevant response fields | `message="Checkout successful"`; positive integer `orderId` |
| Extract for later steps | Newly created `orderId` |
| State mutation | Inserts one `orders` row for the authenticated user with submitted amount/address and initial status `pending` |
| Failure conditions | Missing JWT; network/parse failure; 401/403; non-200; error payload; unexpected message; missing/invalid order ID |

Quantity has no input or calculation role in the verified WF-03 flow. Checkout
accepts only `total_amount` and `shipping_address`, and the smoke used the
normalized product-detail price directly as `total_amount`. The approved public
CSV therefore omits quantity. Checkout data remains derived from the correlated
product rather than a silent constant.

#### Required initial-state probe

Immediately after checkout:

```http
GET /api/orders/:orderId
Accept: application/json
```

Runtime-verified expected result is HTTP 200 with the same `id`, authenticated
`user_id`, submitted `total_amount`, submitted `shipping_address`, and
`status="pending"`. This route is public in current source/runtime, but the test
uses it only as a correlated business-state probe. Missing/mismatched fields
fail the lifecycle; HTTP 200 alone is insufficient.

### Step 5 — Cancel the newly created order

| Property | Contract |
|----------|----------|
| Endpoint category | **TRANSACTIONAL** |
| Method/route | `PUT /api/orders/:orderId/cancel` |
| Authentication | Required: `Authorization: Bearer <same iteration JWT>` |
| Headers | `Accept: application/json`; `Content-Type: application/json`; Bearer header |
| Path/body | `orderId` from step 4; JSON body `{}` |
| Runtime-verified expected status | `200` |
| Relevant response fields | `message="Order canceled successfully"` |
| Extract for later steps | No new ID; retain original order ID and expected lifecycle values for final probe |
| State mutation | Updates that correlated order row from `pending` to `canceled` |
| Failure conditions | Missing JWT/order ID; 401/403; 404 wrong ID/ownership; 400 already delivered/canceled; non-200; error payload; unexpected message; final state mismatch |

#### Required final-state probe

`GET /api/orders/:orderId` must return HTTP 200 and the same ID/user/amount/
address with `status="canceled"`. The smoke empirically verified the transition
`pending → canceled` for the checkout-created order.

## 2. Endpoint-group mapping

| HW05 endpoint group | WF-03 coverage | Why it satisfies the group |
|----------------------|----------------|----------------------------|
| **AUTH-HEAVY** | `POST /api/login` followed by JWT use on checkout/cancel | Every iteration authenticates, extracts a real JWT, validates user identity, and uses the token for protected business operations. Authentication failure prevents the iteration from proceeding. |
| **READ-HEAVY** | `GET /api/products?search=...`; `GET /api/products/:productId`; correlated order-state probes | The workflow searches/lists products, selects one from a JSON collection, loads its detail, validates correlated fields, and reads lifecycle state without mutation. |
| **TRANSACTIONAL** | `POST /api/checkout`; `PUT /api/orders/:orderId/cancel` | Checkout inserts a persistent order; cancellation updates the exact newly created row. Together they form a verified order lifecycle. |

The same mapping applies to Load, Stress, and Spike. A scenario must not drop a
group or replace the business sequence merely to obtain a different workload.

The invariant executable sequence for all three scenarios is:

```text
Login
  → Product Search/List
  → Product Detail
  → Checkout/Create Order
  → Verify newly created Order is pending
  → Cancel that exact Order
  → Verify that exact Order is canceled
```

## 3. Dynamic correlation and fail-fast contract

```text
CSV/private credential source
  └─ valid email/password
       └─ POST login
            ├─ JWT ───────────────────────────────┐
            └─ user.id ───────────── assertions  │
CSV workflow row                                 │
  └─ search_term + expected_product_name        │
       └─ GET product search/list               │
            └─ selected productId               │
                 └─ GET product detail          │
                      ├─ validate same productId│
                      └─ normalize price        │
                           └─ POST checkout <────┘
                                └─ new orderId
                                     ├─ GET pending state
                                     ├─ PUT cancel with same JWT
                                     └─ GET canceled state
```

### Mandatory fail-fast behavior

| Missing/invalid value | Required behavior | Forbidden behavior |
|-----------------------|-------------------|--------------------|
| JWT | Record login failure; fail/abort current iteration before product transaction calls | No guessed token, no stale global token, no retry with another password |
| Product ID | Record search/selection failure; stop before detail/checkout | No fallback to seed ID 1 or arbitrary first row that fails the selection rule |
| Product detail/price | Record detail failure; stop before checkout | No default price, NaN-to-zero conversion, or reuse of an unvalidated search price |
| Order ID | Record checkout/lifecycle failure; stop before state read/cancel | No static order ID, previous-iteration ID, shared global ID, or cancellation attempt without ownership correlation |

Correlated values are iteration-local. They must not live in mutable module-
global variables shared by VUs. Failure must be visible in checks/custom metrics
without generating a misleading follow-on request.

## 4. One-iteration semantics

One VU iteration means:

```text
iteration begins
  → obtain one approved data row/account mapping
  → successfully authenticate
  → search/select one usable product
  → retrieve and validate that product's detail/price
  → create one order with the correlated JWT/data
  → verify that exact order is pending
  → cancel that exact order with the same JWT
  → verify that exact order is canceled
  → mark lifecycle/iteration successful
iteration ends
```

A successful iteration requires every mandatory check, not merely an HTTP 200
summary. In particular:

- login identity/token are valid;
- search yields the expected usable product;
- detail matches the selected ID and supplies a valid price;
- checkout creates a new valid order ID;
- the new order is initially pending and belongs to the logged-in user;
- cancellation acknowledges success;
- the same order finishes canceled.

If any pre-checkout step fails, no order should be created. If checkout succeeds
but a later probe/cancellation fails, the iteration is failed and may leave a
pending order. That side effect must not be concealed or “fixed” by canceling a
different/static order.

No VU count, executor, arrival rate, stage, duration, or scenario mix is decided
in this phase.

## 5. State, repeatability, and scenario isolation

### Verified state semantics

- One successful iteration creates exactly one order row.
- The same correlated row changes from `pending` to `canceled`.
- Canceled orders remain persisted; no deletion/cleanup endpoint is used.
- No inventory is consumed. The SUT has no inventory column/order-item table,
  and checkout does not correlate product/cart state in the database.
- Order count and SQLite database size therefore grow over a run.
- Failed post-checkout iterations may leave pending orders.
- SQLite write contention may become relevant because each successful iteration
  performs an insert and update. **This has not been performance-measured.**

### Implications by future scenario

| Scenario | State implication; not a workload choice |
|----------|------------------------------------------|
| Load | Persistent canceled-order growth changes database size over the steady period; lifecycle success must be tracked separately from request success. |
| Stress | More simultaneous insert/update operations may expose SQLite locking or application errors, but no breakpoint or maximum is claimed yet. |
| Spike | A rapid burst may create many pending orders before corresponding cancellation calls finish; recovery should include lifecycle completion/backlog evidence. |

### Comparable reruns

Load, Stress, and Spike should begin from an explicitly verified comparable
disposable seed state. The current SUT reseeds its clone-local database on every
server startup. A later preflight/runbook must therefore:

1. preserve prior raw results, reports, logs, and required screenshots;
2. stop the exact disposable process;
3. restart/recreate only the approved commit-pinned disposable runtime;
4. verify zero seed orders, account state, hashes/commit, and port ownership;
5. state explicitly that clone-local reseeding occurred;
6. never reset or initialize the original homework database.

No direct SQL deletion or invented per-iteration cleanup is part of WF-03.

## 6. Authentication and lockout safety

1. Use only prevalidated, explicitly approved test credentials.
2. Never intentionally send a wrong password, mutate a password, or probe the
   lockout path during a performance scenario.
3. Missing/private credential data is a preflight failure, not a reason to try a
   guessed/default password.
4. Login failure immediately fails the iteration. Do not retry with alternate
   credentials inside the same iteration.
5. Count and distinguish unexpected HTTP 401 and 403 responses. A 403 lockout-
   style payload must be surfaced clearly and should trigger the future safety
   stop policy rather than continuing aggressive authentication traffic.
6. Never silently unlock via direct SQL or restart/reseed solely to hide an
   unexpected account incident. Record it and follow the approved run procedure.
7. Prevent secret/token values from appearing in console output, raw result
   tags, report labels, check names, or committed CSV files.

The source-observed lockout implementation increments attempts by two and uses a
180-second lock time, while the requirement text differs. WF-03 does not test
that behavior. It remains an observed SUT characteristic and a safety risk, not
a workload objective.

## 7. Data-driven contract

> **PHASE C SUPERSESSION NOTE:** The schemas and single-account discussion below
> are preserved as the original Phase A proposal. The current human-directed
> design is [`test-data-strategy.md`](test-data-strategy.md): it uses the same
> non-secret field boundary, adds reproducible setup for up to 20 dedicated
> disposable-runtime customers, and prefers one account per active VU. No
> account has been provisioned. The final public artifact is the five-column
> `performance/data/workflow.csv`; the historical quantity proposal below was
> reviewed and removed because WF-03 does not use it.

### Historical Phase A proposed schemas — no dataset generated

Committed non-secret workflow file, proposed path
`performance/data/wf03-workflow.csv`:

```csv
row_id,account_key,search_term,expected_product_name,quantity,shipping_address
wf03-001,customer-a,iPhone 15,iPhone 15 Pro Max,1,Performance Test Address A
```

This is a schema/example proposal, not a generated final data file or approved
real address.

Private ignored credential file, proposed path
`performance/data/credentials.local.csv`:

```csv
account_key,email,password,expected_role
customer-a,<valid-test-email>,<valid-test-password>,user
```

An environment/secret-store mapping may replace the private credential CSV if
it provides equivalent `account_key → credentials/expected role` behavior. The
non-secret workflow CSV still supplies assignment-required data-driven inputs.
Before any private file is created, its exact path must be covered by
`.gitignore` and verified absent from Git staging/tracking.

### Value ownership

| Value | Source | Rule |
|-------|--------|------|
| `account_key` | Committed workflow CSV | Non-secret join key only |
| Email/password | Ignored private CSV or runtime secret environment | Never commit, log, tag, or embed in script source |
| Search term/expected product | Committed workflow CSV | URL encode search; require selection match |
| Quantity | Committed workflow CSV | Positive integer; initial contract proposes 1; final arithmetic review deferred |
| Shipping address | Synthetic non-secret workflow data | Must not contain real personal information |
| JWT | Login response | Dynamic, iteration-local; never CSV/static fallback |
| Product ID | Search/list response | Dynamic, validated by detail; never CSV/static fallback |
| Product price | Detail response | Dynamic, validated/normalized; never silently defaulted |
| Order ID | Checkout response | Dynamic, iteration-local; never CSV/static fallback |

### Multi-VU allocation

The bullets in this subsection describe the original Phase A uncertainty. They
remain historical context and must not override the Phase C direct VU-to-slot
mapping or HD-005.

- Workflow rows should be selected deterministically from a `SharedArray`-style
  loader later, with documented row reuse behavior when VUs/iterations exceed
  row count.
- Credential assignment must be explicit. Prefer multiple valid customer
  accounts mapped across VUs to reduce shared-account authentication effects.
- The current seed has only one normal customer account. Multiple accounts are
  **recommended but not yet available or approved**; whether to provision them
  is a later human decision.
- If the single valid customer account is shared, every VU still has distinct
  iteration-local JWT/order IDs, but authentication/account-state coupling must
  be disclosed. A credential error can affect every VU.
- CSV exhaustion/reuse must not cause out-of-range data, undefined credentials,
  or guessed fallbacks. Preflight must validate all referenced `account_key`s.

## 8. Check and assertion contract

| Step | Mandatory transport/shape checks | Mandatory business checks | On failure |
|------|----------------------------------|---------------------------|------------|
| Login | Status 200; valid JSON object | Exact success message; nonempty JWT; expected email/role; positive user ID; no error field | Mark login/workflow failure and abort iteration |
| Product search/list | Status 200; valid JSON array | At least one usable row; expected product match; valid positive ID; required name/price fields | Mark search/workflow failure and abort before detail |
| Product detail | Status 200; nonempty object | Returned ID equals correlated product ID; expected name; finite positive normalized price | Mark detail/workflow failure and abort before checkout |
| Checkout | Status 200; valid JSON object | Exact success message; positive integer new order ID; no error field | Mark checkout/workflow failure and abort cancellation |
| Initial order probe | Status 200; valid order object | ID equals new order ID; user ID and amount/address match; status is `pending` | Mark lifecycle failure; do not substitute another order |
| Cancellation | Status 200; valid JSON object | Exact cancellation message; no error field | Mark cancellation/lifecycle failure |
| Final order probe | Status 200; valid order object | Same ID/user/amount/address; status is `canceled` | Mark lifecycle/workflow failure |

Checks must use stable names without dynamic IDs, emails, or tokens to avoid
high-cardinality/sensitive metrics. Request tags may identify step names such as
`login`, `product_search`, `product_detail`, `checkout`, `order_precheck`,
`cancel_order`, and `order_postcheck`.

Numeric performance thresholds and assertion implementation syntax are deferred
to later reviewed phases. This table defines correctness semantics only.

## 9. Planned metrics — definitions, not results

**There are no measured performance values in Phase A.** All names below are
proposed definitions for later implementation/review.

### Native k6 metrics to retain

| Metric | Definition/use later | Future measured value |
|--------|----------------------|-----------------------|
| `http_req_duration` | Overall and tagged endpoint latency; later summarize min/mean/median/p90/p95/p99 as supported | **NOT MEASURED** |
| `http_req_failed` | Transport/request failure rate; interpret alongside business checks | **NOT MEASURED** |
| `http_reqs` | Request count and request throughput/RPS over elapsed time | **NOT MEASURED** |
| `iteration_duration` | End-to-end time for one WF-03 iteration, including approved think time | **NOT MEASURED** |
| `iterations` | Completed iteration count and derived workflow throughput | **NOT MEASURED** |
| `vus`, `vus_max` | Active/configured VU context for later results | **NOT MEASURED** |
| `dropped_iterations` | Arrival-rate scheduling shortfall, if a later approved executor exposes it | **NOT MEASURED** |
| `checks` | Aggregate check pass rate; not sufficient alone for lifecycle truth | **NOT MEASURED** |

### Proposed endpoint trends

Each proposed `Trend` captures duration for its named request so later reports
can calculate endpoint p90/p95/p99 without filtering ambiguous URLs:

- `wf03_login_duration`
- `wf03_product_search_duration`
- `wf03_product_detail_duration`
- `wf03_checkout_duration`
- `wf03_order_precheck_duration`
- `wf03_cancel_duration`
- `wf03_order_postcheck_duration`
- `wf03_lifecycle_duration` for checkout through confirmed cancellation

All future values: **NOT MEASURED**.

### Proposed business Rates/Counters

| Metric | Type | Definition | Future measured value |
|--------|------|------------|-----------------------|
| `wf03_iteration_success` | Rate | One sample per iteration; true only when every required step/check succeeds | **NOT MEASURED** |
| `wf03_login_failure` | Rate | True when login transport/status/token/identity contract fails | **NOT MEASURED** |
| `wf03_product_search_failure` | Rate | True when no valid expected product can be selected | **NOT MEASURED** |
| `wf03_product_detail_failure` | Rate | True when detail correlation/price validation fails | **NOT MEASURED** |
| `wf03_checkout_failure` | Rate | True when checkout fails or yields no valid new order ID | **NOT MEASURED** |
| `wf03_cancellation_failure` | Rate | True when cancel response or final canceled state fails | **NOT MEASURED** |
| `wf03_lifecycle_success` | Rate | True only for verified `pending → canceled` on the same new order | **NOT MEASURED** |
| `wf03_orders_created` | Counter | Count of checkout responses with a validated new order ID | **NOT MEASURED** |
| `wf03_orders_canceled` | Counter | Count of same-order final probes verified as canceled | **NOT MEASURED** |
| `wf03_unexpected_401` | Counter | Unexpected authentication 401 responses | **NOT MEASURED** |
| `wf03_unexpected_403` | Counter | Unexpected forbidden/possible-lockout 403 responses | **NOT MEASURED** |

Later throughput analysis should distinguish request RPS (`http_reqs/time`) from
business workflow throughput (`successful WF-03 lifecycles/time`). Neither is
defined by a measured number yet.

## 10. Candidate think-time locations

No durations are proposed or approved in Phase A.

| Location | Human-behavior rationale | Current status |
|----------|--------------------------|----------------|
| After login, before search | User arrives at the catalog and decides what to seek | Candidate only; value deferred |
| After search/list, before detail | User scans results and selects a product | Candidate only; value deferred |
| After product detail, before checkout | User reads product information and decides to order | Candidate only; value deferred |
| After checkout/pre-state, before cancellation | User reviews the newly created order and decides to cancel | Candidate only; value deferred |

Think time must be outside measured individual HTTP duration but remains part of
the end-to-end iteration duration. It must model user pacing, not beautify charts
or artificially suppress load.

## 11. Workload-independent architecture

### Components shared unchanged by Load, Stress, and Spike

- base URL/authorized-target configuration;
- CSV schema validation and private credential mapping;
- deterministic data/account allocation;
- authentication request and fail-fast token extraction;
- product search/selection and detail correlation;
- checkout, initial-state probe, cancellation, and final-state probe;
- check/assertion helpers;
- stable request names/tags and custom metric definitions;
- think-time hook locations and, once human-approved, the same values across all
  three scenarios;
- redaction/error-handling rules;
- one WF-03 iteration implementation.

### Components that differ later

- scenario executor and VU/arrival model;
- ramp-up, steady/peak/recovery stages and durations;
- graceful stop and scenario-specific safety bounds;
- numeric thresholds and scenario-specific termination criteria;
- scenario tags, required names, output/report type, and artifact paths.

Changing workload configuration must not remove steps, replace cancellation
with another transaction, omit either order-detail validation substep, use
static IDs, or change the selected workflow.

## 12. Historical Phase A deferred decisions

At Phase A creation, the following were intentionally deferred. Later Phase B
and Phase C records supersede resolved items without deleting this history:

- whether/how additional valid customer accounts will be provisioned;
- exact committed/private CSV filenames and final rows;
- quantity/amount arithmetic (historical proposal; Phase C later removed
  quantity after verifying WF-03 does not use it);
- final checks/implementation details and numeric thresholds;
- think-time durations;
- Load executor/VUs/ramp/steady duration;
- Stress starting load/stages/maximum/safety stop;
- Spike baseline/peak/duration/recovery;
- scenario filenames/date;
- three distinct k6 outputs and unresolved `.jtl`/HTML compliance;
- k6 installation or any real execution.

These decisions proceed through later AI-first phases and explicit human
checkpoints.
