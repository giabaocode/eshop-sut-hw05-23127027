# E2E Workflow Candidates

## Decision boundary

- Phase: PHASE 3 — Controlled Runtime API Verification and Workflow Discovery
- Group size: four students
- Candidate count: six genuinely different business-process families
- Source baseline: commit
  `85af3ba875c88283615e22cb108f13e2fccaf0e9`
- Runtime evidence: [`runtime-api-verification.md`](runtime-api-verification.md)
- Status: **AI RECOMMENDATIONS ONLY — HUMAN SELECTION REQUIRED**

Every candidate can use one common workflow implementation for Load, Stress,
and Spike, with only the workload model changed. “Suitable” does not mean its
future VU count, duration, or thresholds are approved. Those parameters belong
to later human-reviewed design phases.

## WF-01 — Server-cart customer purchase

**Workflow ID:** WF-01
**Short name:** Server-cart purchase

**Sequence:** Login → confirm profile → search product → product detail → read
cart → append correlated product → read cart → checkout → order history →
correlated order detail.

**Exact endpoints:**

1. `POST /api/login`
2. `GET /api/users/me`
3. `GET /api/products?search=<term>`
4. `GET /api/products/:productId`
5. `GET /api/cart`
6. `POST /api/cart`
7. `GET /api/cart`
8. `POST /api/checkout`
9. `GET /api/orders/my-orders`
10. `GET /api/orders/:orderId`

**Coverage:**

- Auth-heavy: successful login, JWT extraction, authenticated profile/cart/
  checkout/history requests.
- Read-heavy: search and correlated detail, plus cart/order readbacks.
- Transactional: cart append and SQLite order creation.

**Runtime verification status:** Every endpoint and happy-path correlation was
runtime verified in Phase 3. Concurrent cart behavior was not verified. The
server-cart calls are real backend endpoints, but current web/mobile clients use
local cart state and do not call them.

**Correlation required:** JWT and user ID from login; product ID/name/price from
search; submitted product fields into cart; checkout `orderId` into history and
detail. There is no cart or cart-item ID.

**CSV/test data required:** Fixture/synthetic credentials, search term,
expected product name/category, quantity, shipping address. Product IDs should
not be primary CSV values; extract them from search.

**Database/state mutations:** In-memory cart append and one persistent order per
iteration. Checkout does not clear the cart.

**Repeatability:** Checkout is repeatable with a newly returned order ID, but
the same account's process-memory cart grows indefinitely. Restart resets carts
and all seeded SQLite state.

**Concurrency risks:** Shared credentials cause all VUs to append to the same
array. Cart length/content assertions become nondeterministic. SQLite orders
have multiple writers and no busy timeout configured by the app.

**Account-lockout risk:** Low if credentials are correct; a bad shared CSV row
could lock the shared account. No intentional failure is part of the workflow.

**Data exhaustion risk:** Low for reads/orders; medium for memory because carts
grow. Only two seed accounts exist.

**Cleanup/reset needs:** No cart-clear endpoint. A controlled disposable-server
restart is the only observed cart reset. Order rows remain until the approved
clone is reseeded.

**Suitability for k6:** Good modular fit and fully verified correlation, but
per-VU account allocation or weak cart-length assumptions are necessary.

**Load-test suitability:** Good at modest reviewed load.

**Stress-test suitability:** Medium; cart growth and SQLite writes can interact.

**Spike-test suitability:** Medium; shared-cart interleaving can obscure the
business signal.

**Expected implementation difficulty:** MEDIUM

**Potential homework risk:** The flow exercises a backend cart API that the
current user interfaces do not call; this must be disclosed rather than called
an exact browser journey.

**Why this workflow is genuinely different from the other candidates:** This is
the only candidate centered on the server-side cart lifecycle and its
in-process state.

## WF-02 — Promotion redemption purchase

**Workflow ID:** WF-02
**Short name:** Coupon redemption

**Sequence:** Login → confirm profile → list/search product → detail → list
coupons → apply eligible coupon → checkout at correlated final amount → record
coupon usage → order history → order detail.

**Exact endpoints:**

1. `POST /api/login`
2. `GET /api/users/me`
3. `GET /api/products` or `GET /api/products?search=<term>`
4. `GET /api/products/:productId`
5. `GET /api/coupons`
6. `POST /api/apply-coupon`
7. `POST /api/checkout`
8. `POST /api/coupon-usage`
9. `GET /api/orders/my-orders`
10. `GET /api/orders/:orderId`

**Coverage:**

- Auth-heavy: login, profile, coupon-list, checkout, usage, and history Bearer
  calls.
- Read-heavy: product catalog/detail and coupon catalog.
- Transactional: order creation plus explicit coupon-usage insertion.

**Runtime verification status:** The exact fixed `BIGBUY` happy path was
runtime verified end to end. Percentage, expiry, boundary, usage-limit, and
concurrent cases remain source-only/unverified.

**Correlation required:** JWT/user ID; product ID/price; coupon code from test
data or coupon list; apply response `coupon_id` and `final_amount`; checkout
`orderId`.

**CSV/test data required:** Credentials/account allocation, product search,
coupon code/type, quantity/total policy, shipping address, expected maximum
uses. Coupon IDs should be extracted, not hard-coded.

**Database/state mutations:** One order and one coupon-usage row per iteration.
Coupon apply itself is read-only and unauthenticated in the implementation.

**Repeatability:** Technically repeatable, but a correct usage-limited scenario
will exhaust a coupon/account allocation quickly. Application and usage writes
are separate and non-atomic.

**Concurrency risks:** Multiple VUs can pass the usage check before separate
usage inserts. Shared users consume each other's allowance. SQLite writes can
contend.

**Account-lockout risk:** Low with correct credentials; shared-account failure
has wide impact.

**Data exhaustion risk:** **High** with seed coupons: per-user maximum is one or
two uses. A meaningful run needs approved disposable synthetic accounts and/or
coupon allocation.

**Cleanup/reset needs:** Recreate/reseed the disposable runtime or provision a
bounded set of dedicated accounts/coupons. Never silently delete usage rows.

**Suitability for k6:** Strong correlation exercise, but data provisioning is
substantial and usage-limit assertions must reflect iteration/account ownership.

**Load-test suitability:** Medium after test-data design.

**Stress-test suitability:** Medium-to-high analytical value, high setup risk.

**Spike-test suitability:** Interesting for non-atomic eligibility/usage, but
failure interpretation is difficult.

**Expected implementation difficulty:** HARD

**Potential homework risk:** Percentage logic and auth/usage separation contain
source/runtime concerns; using the wrong expectation could invalidate checks.

**Why this workflow is genuinely different from the other candidates:** It
models promotion eligibility, discount correlation, redemption, and
consumption—not merely a purchase with a different quantity.

## WF-03 — Purchase and customer cancellation

**Workflow ID:** WF-03
**Short name:** Order cancellation lifecycle

**Sequence:** Login → profile → search product → detail → checkout → history →
cancel the newly created order → read order detail and confirm canceled state.

**Exact endpoints:**

1. `POST /api/login`
2. `GET /api/users/me`
3. `GET /api/products?search=<term>`
4. `GET /api/products/:productId`
5. `POST /api/checkout`
6. `GET /api/orders/my-orders`
7. `PUT /api/orders/:orderId/cancel`
8. `GET /api/orders/:orderId`

**Coverage:**

- Auth-heavy: login/profile plus authenticated checkout/history/cancellation.
- Read-heavy: search, product detail, order history/detail.
- Transactional: order insertion followed by a correlated status transition.

**Runtime verification status:** Login/read/checkout/history/detail steps are
runtime verified. Cancellation is SOURCE-VERIFIED but was deliberately not
executed in Phase 3.

**Correlation required:** JWT/user ID; product ID/price; checkout `orderId` to
history, cancel, and detail; expected transition `pending → canceled`.

**CSV/test data required:** Credentials, search/expected product, shipping
address, optional quantity/total rules. No static order IDs.

**Database/state mutations:** Creates one order and updates that same row once.

**Repeatability:** Self-contained per iteration because every checkout returns a
new order ID; each ID is canceled once. Table growth remains unbounded.

**Concurrency risks:** Much lower logical collision than shared cart/coupon
flows because each VU owns a returned order ID. SQLite still sees two writes per
iteration. A correlation bug could cancel another order.

**Account-lockout risk:** Low with correct credentials.

**Data exhaustion risk:** Low; order IDs are generated. Database size grows.

**Cleanup/reset needs:** No per-iteration deletion. Recreate the disposable
runtime between approved scenarios to restore a comparable seed state.

**Suitability for k6:** Very good after one low-load cancellation validation;
clear dynamic ID and business-state assertions.

**Load-test suitability:** Good.

**Stress-test suitability:** Good for SQLite insert/update contention.

**Spike-test suitability:** Good; unique order IDs reduce cross-VU ambiguity.

**Expected implementation difficulty:** MEDIUM

**Potential homework risk:** The cancellation handler's permissible states and
error handling need runtime verification before final assertions.

**Why this workflow is genuinely different from the other candidates:** It
measures a reverse/post-purchase business process and validates an order state
transition, rather than stopping at sale.

## WF-04 — New-customer onboarding and first order

**Workflow ID:** WF-04
**Short name:** Signup-to-first-purchase

**Sequence:** Register a unique customer → login as that customer → confirm
profile → browse categories/products → product detail → first checkout → order
history/detail.

**Exact endpoints:**

1. `POST /api/register`
2. `POST /api/login`
3. `GET /api/users/me`
4. `GET /api/categories`
5. `GET /api/products` or `GET /api/products?search=<term>`
6. `GET /api/products/:productId`
7. `POST /api/checkout`
8. `GET /api/orders/my-orders`
9. `GET /api/orders/:orderId`

**Coverage:**

- Auth-heavy: account creation, first login, JWT/profile.
- Read-heavy: categories, catalog, correlated detail.
- Transactional: user insertion and first-order insertion.

**Runtime verification status:** Registration was not executed. Login was
runtime verified only for the seed customer; the read/checkout/order steps were
runtime verified. Registration is SOURCE-VERIFIED only.

**Correlation required:** Registration identity/credentials into login; JWT and
new user ID; product ID; checkout `orderId`.

**CSV/test data required:** Unique synthetic name/email/password for every
logical iteration/account, search term, shipping address, expected role. No real
personal information.

**Database/state mutations:** One persistent user and one order per iteration.
Email has no database unique constraint.

**Repeatability:** Requires never-reused unique email rows and correct mapping
of credentials to iterations. Reusing email can create duplicates and make
login selection ambiguous.

**Concurrency risks:** Concurrent unique registrations are independent, but
SQLite writes and CSV row reuse can collide. The endpoint does not enforce
email uniqueness.

**Account-lockout risk:** Medium: a registration/login data mismatch creates
failed logins; repeated failure can trigger the source-defined lockout behavior.

**Data exhaustion risk:** **High**; Load/Stress/Spike need enough unique rows or
a safe generation strategy, and the database grows rapidly.

**Cleanup/reset needs:** Disposable clone reseed between scenarios; preserve
results first. Do not delete users manually without approval.

**Suitability for k6:** Feasible with atomic unique-data allocation, but more
fragile than seed-user flows.

**Load-test suitability:** Medium.

**Stress-test suitability:** Risky due data volume and two writes.

**Spike-test suitability:** Risky; CSV exhaustion can masquerade as SUT failure.

**Expected implementation difficulty:** HARD

**Potential homework risk:** Data-generation mistakes can cause lockout or
duplicate-email ambiguity, invalidating measured errors.

**Why this workflow is genuinely different from the other candidates:**
Customer acquisition/provisioning and first-use behavior are the central
business process, not an existing-user purchase.

## WF-05 — Administrative catalog import and verification

**Workflow ID:** WF-05
**Short name:** Catalog import

**Sequence:** Admin login → profile confirmation → read categories/current
catalog → import a unique product row/batch → search for the imported product →
read its correlated detail.

**Exact endpoints:**

1. `POST /api/login`
2. `GET /api/users/me`
3. `GET /api/categories`
4. `GET /api/products`
5. `POST /api/admin/import-products`
6. `GET /api/products?search=<uniqueImportedName>`
7. `GET /api/products/:productId`

**Coverage:**

- Auth-heavy: admin login/JWT and protected import.
- Read-heavy: categories, catalog, search, detail.
- Transactional: one or more persistent product inserts.

**Runtime verification status:** Generic login/profile and all read endpoints
were runtime verified with a customer token. The admin credential, role, and
import mutation are SOURCE-VERIFIED only and intentionally unexecuted.

**Correlation required:** Admin JWT; CSV category ID/name; unique imported name
into search; search result ID into detail. Import does not return inserted IDs.

**CSV/test data required:** Admin fixture credentials, globally unique product
name per row/iteration, price, description, image URL, category mapping,
expected valid/invalid-row outcome.

**Database/state mutations:** Product-table growth; import may partially succeed
and reports row errors inside HTTP 200.

**Repeatability:** Only with unique product names and a selection rule that
identifies the just-imported row. There is no automatic cleanup or transaction
rollback.

**Concurrency risks:** Searches can see growing/duplicate data; import callbacks
may interleave; partial insert results complicate checks. SQLite write pressure
can dominate.

**Account-lockout risk:** Low with correct admin credentials; one shared admin
account makes credential mistakes high-impact.

**Data exhaustion risk:** High for unique product rows and storage growth.

**Cleanup/reset needs:** Reseed the disposable clone between scenarios. Product
deletion is destructive and should not be hidden inside cleanup.

**Suitability for k6:** Technically feasible and CSV-aligned, but requires
careful unique-row allocation and response-level partial-failure checks.

**Load-test suitability:** Medium for controlled import batches.

**Stress-test suitability:** High database pressure but high evidence risk.

**Spike-test suitability:** Risky because rapid catalog growth affects later
search response size and selection.

**Expected implementation difficulty:** HARD

**Potential homework risk:** “Transactional” may be interpreted by the grader
as commerce/order transactions; lecturer confirmation would strengthen this
candidate. The backend does not enforce admin role in middleware.

**Why this workflow is genuinely different from the other candidates:** This is
a back-office catalog-ingestion process, not a customer order or promotion
flow.

## WF-06 — Customer-to-admin fulfillment handoff

**Workflow ID:** WF-06
**Short name:** Order fulfillment handoff

**Sequence:** Customer login → search/detail → checkout → admin login → admin
order list → correlate the new order → transition it from pending to confirmed →
read final order detail.

**Exact endpoints:**

1. `POST /api/login` (customer)
2. `GET /api/products?search=<term>`
3. `GET /api/products/:productId`
4. `POST /api/checkout` (customer token)
5. `POST /api/login` (admin)
6. `GET /api/admin/orders` (admin token)
7. `PUT /api/admin/orders/:orderId/status` with `{"status":"confirmed"}`
8. `GET /api/orders/:orderId`

**Coverage:**

- Auth-heavy: two role-context logins and two independently correlated JWTs.
- Read-heavy: product search/detail, admin order list, order detail.
- Transactional: order insert and fulfillment-state update.

**Runtime verification status:** Customer login, product read, checkout, and
order detail are runtime verified. Admin login fixture, admin order list, and
status transition are SOURCE-VERIFIED only.

**Correlation required:** Customer JWT/user; product ID/price; checkout
`orderId`; separate admin JWT; order ID match in admin list; expected state
`pending → confirmed`.

**CSV/test data required:** Customer/admin credential pair, search/product
expectation, shipping address, target status. Admin credentials must never be
printed in results.

**Database/state mutations:** One order insert and one update per iteration.

**Repeatability:** Each iteration has a unique returned order ID, so the state
transition is self-contained. Two login contexts must remain separate.

**Concurrency risks:** Admin order-list size grows and scanning it is costly;
mis-correlated IDs can update another VU's order. Two writes per iteration add
SQLite pressure. Role middleware does not actually enforce admin role.

**Account-lockout risk:** Medium because two shared fixture accounts are used;
either bad CSV credential can affect many VUs.

**Data exhaustion risk:** Low for generated order IDs; database/list size grows.

**Cleanup/reset needs:** Reseed disposable state between scenarios after
preserving evidence. No row deletion is required per iteration.

**Suitability for k6:** Feasible but needs two token contexts and exact order-ID
matching; strong checks are essential.

**Load-test suitability:** Medium.

**Stress-test suitability:** High analytical value for mixed insert/list/update.

**Spike-test suitability:** Interesting but order-list expansion and correlation
errors may distort results.

**Expected implementation difficulty:** HARD

**Potential homework risk:** Several critical steps are not runtime verified,
and the missing role enforcement must not be mistaken for valid authorization.

**Why this workflow is genuinely different from the other candidates:** It
spans two actors and the fulfillment state machine, unlike single-user
shopping, promotion, cancellation, onboarding, or catalog administration.

## Comparison and ranking

| Candidate | Workflow summary | Auth | Read | Transaction | k6 difficulty | Concurrency risk | Repeatability | Recommended? |
|-----------|------------------|------|------|-------------|---------------|------------------|---------------|--------------|
| WF-01 | Existing customer uses backend cart and checks out | One user JWT | Search/detail/cart/order | Cart append + order insert | MEDIUM | High shared-cart risk | Medium | Good low-design-risk fallback |
| WF-02 | Customer redeems and records a coupon purchase | One user JWT | Product/coupon/order | Order + usage insert | HARD | High usage race/exhaustion | Low without provisioning | Only with strong data strategy |
| WF-03 | Customer creates then cancels own order | One user JWT | Product/order | Insert + state update | MEDIUM | Medium SQLite; low ID collision | High | **Best technical choice** |
| WF-04 | Unique new customer registers and makes first order | New user JWT | Category/product/order | User + order inserts | HARD | High CSV/DB risk | Low-to-medium | Avoid unless onboarding is desired |
| WF-05 | Admin imports unique catalog rows and verifies them | Admin JWT | Category/catalog/search/detail | Product inserts | HARD | High growth/partial-result risk | Medium with large CSV | Avoid for lowest-risk homework path |
| WF-06 | Customer order handed to admin for confirmation | Customer + admin JWTs | Product/admin order/detail | Insert + status update | HARD | Medium-high correlation/list risk | High per order ID | Best analytical depth, not easiest |

### 1. BEST TECHNICAL CHOICE

**WF-03 — Purchase and customer cancellation.** It provides a genuine
multi-step business lifecycle, has a unique order ID per iteration, avoids the
cart's unbounded in-memory accumulation and coupon-use exhaustion, and produces
clear pending/canceled assertions. One controlled cancellation verification is
still required before script design is finalized.

### 2. EASIEST TO IMPLEMENT

**WF-01 — Server-cart customer purchase.** Every step was runtime verified and
the correlations are straightforward. Its shared-cart growth must be designed
around and disclosed.

### 3. BEST FOR INTERESTING PERFORMANCE ANALYSIS

**WF-06 — Customer-to-admin fulfillment handoff.** It mixes two authentication
contexts, SQLite insert/read/update behavior, a growing admin list, and a state
transition. That depth comes with the highest correlation and assertion burden.

### 4. LOWEST-RISK CHOICE

**WF-03 after one cancellation smoke verification; otherwise WF-01.** WF-03's
generated order IDs make iterations independent. WF-01 is the safest choice
based solely on already verified endpoints, though its in-memory cart is shared
per reused account.

### 5. WORKFLOWS TO AVOID AND WHY

- Avoid **WF-04** unless the team explicitly wants onboarding: unique credential
  exhaustion and duplicate-email ambiguity can create false failures.
- Avoid **WF-05** for a conservative submission: persistent catalog growth,
  partial success in HTTP 200 responses, and rubric ambiguity add risk.
- Avoid **WF-06** if implementation time is limited: it needs two tokens and
  unverified admin state-transition behavior.
- Avoid **WF-02** without an approved account/coupon provisioning plan: seed
  usage limits are exhausted almost immediately.

## Group coordination table

This table is intentionally short and leaves assignment ownership blank.

| Candidate | Short workflow | Difficulty | Key distinction | Taken by |
|-----------|----------------|------------|-----------------|----------|
| WF-01 | Server-cart customer purchase | MEDIUM | In-memory backend cart lifecycle | |
| WF-02 | Coupon redemption purchase | HARD | Promotion eligibility and usage consumption | |
| WF-03 | Purchase then cancel order | MEDIUM | Customer reverse-order lifecycle | |
| WF-04 | Signup to first purchase | HARD | New-account acquisition and first order | |
| WF-05 | Admin catalog import | HARD | Back-office product ingestion | |
| WF-06 | Customer-to-admin fulfillment | HARD | Two actors and order state transition | |

## Human checkpoint

The student must:

1. share/check this table with the other three group members;
2. confirm the intended candidate is not duplicated;
3. select exactly one workflow candidate;
4. explicitly state the selected ID and uniqueness confirmation.

No final workflow is selected by this document.
