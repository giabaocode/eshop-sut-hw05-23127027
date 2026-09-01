# Controlled Runtime API Verification

## Evidence boundary

- Phase: PHASE 3 — Controlled Runtime API Verification and Workflow Discovery
- Preflight: 2026-09-01 12:37:51 +07 (Asia/Ho_Chi_Minh)
- Freshly seeded runtime state check: 2026-09-01 12:40:28 +07
- Transaction timestamp recorded by SQLite: 2026-09-01 05:41:36 UTC
- Shutdown/integrity check: 2026-09-01 12:42:32 +07
- Original repository: `/Users/phamngocgiabao/eshop-sut-hw05-23127027`
- Disposable runtime root: `/private/tmp/eshop-hw05-sut.jxn8Wd`
- Disposable clone: `/private/tmp/eshop-hw05-sut.jxn8Wd/repo`
- Source commit in both locations:
  `85af3ba875c88283615e22cb108f13e2fccaf0e9`
- Backend PID: `10568`
- Base URL: `http://127.0.0.1:3000`
- Request model: sequential, one user, no concurrency or performance load

Terms in this document:

- **SOURCE-VERIFIED**: directly supported by the inspected implementation.
- **RUNTIME-VERIFIED**: observed through an actual Phase 3 HTTP response or
  read-only state check against the disposable clone.
- **NOT YET VERIFIED**: deliberately outside this minimal phase.

JWTs and password values were used only in the transient runtime process. They
are redacted from repository evidence. The account is a public repository
fixture, but its password is still not copied into the report output.

## 1. Preflight and isolation

### State before restart

| Item | Actual result |
|------|---------------|
| Port 3000 | Free |
| Original backend status | No tracked/staged/untracked item under `backend/` |
| Original `backend/node_modules` | Absent |
| Original database SHA-256 | `c63f00544180ba1fbb1427a9b9dd3f1784842698809972f33ce90482e7420ba6` |
| Temp-clone database SHA-256 before restart | `e5783132d3952afb2bcc3410b33f2b05f0368f6542a6cb87f0e3fc98421ab992` |
| Temp counts before restart | users 2; products 5; categories 3; orders 0; coupons 4; coupon usage 0 |
| Account state before restart | Both users had zero attempts and no lock timestamp |
| Temp dependencies | Present from approved Phase 2B installation |

The unmodified `node server.js` restart reseeded the clone. Immediately after
startup and before API activity, its database SHA-256 was
`f4bf2c952e8d9d60a4af8f3b392464bba5b4ad8a630be6bf0cc88b7cab9e9859`.
Counts remained 2 users, 5 products, 3 categories, 0 orders, 4 coupons, and 0
coupon-usage rows. SQLite integrity was `ok`.

`lsof` proved PID 10568 listened on `*:3000`, and its current directory was the
disposable clone's `backend` directory. No process from the homework checkout
served these requests.

## 2. Endpoint verification matrix

| Group | Method and route | Source | Runtime result | Evidence status |
|-------|------------------|--------|----------------|-----------------|
| Auth | `POST /api/login` | [`server.js:32`](../backend/server.js#L32) | 200; `{message,token,user}` | SOURCE-VERIFIED and RUNTIME-VERIFIED |
| Auth | `GET /api/users/me` | [`server.js:112`](../backend/server.js#L112) | 200 with Bearer JWT; full user row | SOURCE-VERIFIED and RUNTIME-VERIFIED |
| Read | `GET /api/products?search=iPhone%2015` | [`server.js:141`](../backend/server.js#L141) | 200; one-product array | SOURCE-VERIFIED and RUNTIME-VERIFIED |
| Read | `GET /api/products` | [`server.js:141`](../backend/server.js#L141) | 200; five-product array | SOURCE-VERIFIED and RUNTIME-VERIFIED |
| Read | `GET /api/products/1` | [`server.js:159`](../backend/server.js#L159) | 200; correlated product object | SOURCE-VERIFIED and RUNTIME-VERIFIED |
| Read | `GET /api/categories` | [`server.js:243`](../backend/server.js#L243) | 200; three-category array | SOURCE-VERIFIED and RUNTIME-VERIFIED |
| Transaction | `GET /api/cart` | [`server.js:284`](../backend/server.js#L284) | 200; `[]`, then appended item | SOURCE-VERIFIED and RUNTIME-VERIFIED |
| Transaction | `POST /api/cart` | [`server.js:290`](../backend/server.js#L290) | 200; `{message:"Added to cart"}` | SOURCE-VERIFIED and RUNTIME-VERIFIED |
| Coupon read | `GET /api/coupons` | [`server.js:356`](../backend/server.js#L356) | 200; four-coupon array with Bearer JWT | SOURCE-VERIFIED and RUNTIME-VERIFIED |
| Coupon | `POST /api/apply-coupon` | [`server.js:363`](../backend/server.js#L363) | 200 without auth; fixed discount response | SOURCE-VERIFIED and RUNTIME-VERIFIED |
| Transaction | `POST /api/checkout` | [`server.js:297`](../backend/server.js#L297) | 200; new `orderId:1` | SOURCE-VERIFIED and RUNTIME-VERIFIED |
| Coupon mutation | `POST /api/coupon-usage` | [`server.js:444`](../backend/server.js#L444) | 200; usage row inserted | SOURCE-VERIFIED and RUNTIME-VERIFIED |
| Transaction readback | `GET /api/orders/my-orders` | [`server.js:311`](../backend/server.js#L311) | 200; authenticated array containing order 1 | SOURCE-VERIFIED and RUNTIME-VERIFIED |
| Transaction readback | `GET /api/orders/1` | [`server.js:344`](../backend/server.js#L344) | 200 without auth; order object | SOURCE-VERIFIED and RUNTIME-VERIFIED |

No endpoint in this table was called concurrently or in a loop.

## 3. Auth-heavy verification

### Successful seeded-user login

Request:

```http
POST /api/login HTTP/1.1
Host: 127.0.0.1:3000
Accept: application/json
Content-Type: application/json

{"email":"test@eshop.com","password":"[REDACTED PUBLIC FIXTURE PASSWORD]"}
```

Actual status: `200`.

Actual response with sensitive values redacted:

```json
{
  "message": "Login successful",
  "token": "[REDACTED JWT length=133]",
  "user": {
    "id": 2,
    "name": "Test User",
    "email": "test@eshop.com",
    "password": "[REDACTED PUBLIC FIXTURE PASSWORD]",
    "role": "user",
    "login_attempts": 0,
    "locked_until": null,
    "reset_token": null,
    "shipping_address": null,
    "phone": null
  }
}
```

Decoded non-secret JWT structure:

```json
{
  "header": {"alg":"HS256","typ":"JWT"},
  "payload": {"id":2,"role":"user","iat":1788241296}
}
```

The runtime token had no `exp` claim. Login left `login_attempts=0` and
`locked_until=NULL`. A second successful login was used only to retrieve the
post-checkout cart; it also returned 200 and user ID 2. No failed login was
sent.

### Bearer behavior

Request:

```http
GET /api/users/me HTTP/1.1
Host: 127.0.0.1:3000
Accept: application/json
Authorization: Bearer [CORRELATED JWT]
```

Actual status: `200`. The returned row matched user ID 2 and contained keys
`id`, `name`, `email`, `password`, `role`, `login_attempts`, `locked_until`,
`reset_token`, `shipping_address`, and `phone`. The password value is redacted
here. This proves successful token extraction and Bearer correlation; missing,
malformed, forged, expired, or revoked-token behavior was not tested.

## 4. Read-heavy verification

### Search and product-ID correlation

Request:

```http
GET /api/products?search=iPhone%2015 HTTP/1.1
Host: 127.0.0.1:3000
Accept: application/json
```

Actual status: `200`.

Actual response:

```json
[{"id":1,"name":"iPhone 15 Pro Max","price":30000000,"description":"Điện thoại cao cấp của Apple","imageUrl":"https://placehold.co/300x300/png?text=iPhone+15","category_id":1}]
```

The client extracted product ID `1`, name `iPhone 15 Pro Max`, and price
`30000000` from this response. The extracted ID, rather than a separate
hard-coded detail ID, was used in subsequent requests.

### Listing

`GET /api/products` returned HTTP 200 and a JSON array of five product objects.
Every object contained `id`, `name`, `price`, `description`, `imageUrl`, and
`category_id`. IDs were 1–5.

### Correlated detail

Request: `GET /api/products/1` with `Accept: application/json`.

Actual status: `200`.

Actual response:

```json
{"id":1,"name":"iPhone 15 Pro Max","price":30000000,"description":"Điện thoại cao cấp của Apple","imageUrl":"https://placehold.co/300x300/png?text=iPhone+15","category_id":1}
```

### Categories

`GET /api/categories` returned HTTP 200:

```json
[{"id":1,"name":"Điện thoại"},{"id":2,"name":"Laptop"},{"id":3,"name":"Phụ kiện"}]
```

There is no category-filter query in the backend product route. A
category-guided client would need to correlate `category_id` and filter the
product result itself; category browsing alone is not treated as a distinct
workflow family.

## 5. Transactional verification

### Backend cart append/read

State before: the authenticated `GET /api/cart` returned HTTP 200 and `[]`.

Mutation request:

```http
POST /api/cart HTTP/1.1
Host: 127.0.0.1:3000
Accept: application/json
Content-Type: application/json
Authorization: Bearer [CORRELATED JWT]

{"id":1,"name":"iPhone 15 Pro Max","price":30000000,"quantity":1}
```

Actual status/response:

```text
200
{"message":"Added to cart"}
```

State after: authenticated `GET /api/cart` returned HTTP 200:

```json
[{"id":1,"name":"iPhone 15 Pro Max","price":30000000,"quantity":1}]
```

Correlation was search response → product fields → cart body. No cart ID or
cart-item ID exists. This mutation was process-memory-only, shared by user ID,
and not represented in SQLite.

### Checkout/order creation

Orders before: `0`. The submitted value came from the coupon response described
below.

```http
POST /api/checkout HTTP/1.1
Host: 127.0.0.1:3000
Accept: application/json
Content-Type: application/json
Authorization: Bearer [CORRELATED JWT]

{"total_amount":29950000,"shipping_address":"Phase 3 Disposable Test Address"}
```

Actual status/response:

```text
200
{"message":"Checkout successful","orderId":1}
```

Orders after: one row:

```text
id=1; user_id=2; total_amount=29950000; status=pending;
shipping_address=Phase 3 Disposable Test Address;
created_at=2026-09-01 05:41:36
```

The returned `orderId` was correlated into both readbacks:

- Authenticated `GET /api/orders/my-orders`: HTTP 200, array containing order 1.
- Unauthenticated `GET /api/orders/1`: HTTP 200, the same order object.

After checkout, a new authenticated `GET /api/cart` still returned the original
full-price item. Therefore checkout did not clear or alter the backend cart in
this run. The stored order amount was the submitted discounted value, not the
cart item's price.

Repeatability consequence: every checkout appends an SQLite order; the cart
keeps growing for a reused account/process because no backend clear/remove
endpoint exists. The cart disappears only when the server process restarts.

## 6. Coupon-path verification

Authenticated `GET /api/coupons` returned HTTP 200 and the four seeded coupon
objects. The test selected the fixed-amount `BIGBUY` code.

Coupon usage before application: `0` rows.

```http
POST /api/apply-coupon HTTP/1.1
Host: 127.0.0.1:3000
Accept: application/json
Content-Type: application/json

{"code":"BIGBUY","total_amount":30000000,"user_id":2}
```

No Authorization header was sent. Actual status/response:

```text
200
{"success":true,"coupon_id":2,"discount_amount":50000,"final_amount":29950000,"message":"Áp dụng thành công! Giảm 50,000 ₫"}
```

Application itself made no usage write. The response's `coupon_id=2` and
`final_amount=29950000` were correlated into checkout and the separate usage
request:

```http
POST /api/coupon-usage HTTP/1.1
Host: 127.0.0.1:3000
Accept: application/json
Content-Type: application/json
Authorization: Bearer [CORRELATED JWT]

{"coupon_id":2}
```

Actual result: HTTP 200, `{"message":"Usage recorded"}`. State afterward was
one row: `id=1`, `coupon_id=2`, `user_id=2`, timestamp
`2026-09-01 05:41:36` UTC.

This verifies the fixed-discount happy path only. Percentage calculation,
minimum equality, expiry errors, usage-limit rejection, atomicity, and
concurrent coupon behavior remain unverified.

## 7. Correlation chain observed

```text
login response token ────────────────┐
login response user.id = 2 ───────┐ │
search response product.id = 1 ─┐ │ │
search product fields ──────────┴─┼─┼─> cart append/read
coupon response coupon_id = 2 ─────┼─┼─> coupon usage record
coupon response final_amount ──────┼─┼─> checkout
checkout response orderId = 1 ─────┴─┴─> history/detail assertions
```

No dynamic identifier required for this verified chain was supplied only as a
static fixture. Search term, coupon code, quantity, shipping address, and
credentials remain appropriate CSV inputs; response values supply the IDs.

## 8. Source/runtime agreement and discrepancies

These are observations, not automatically classified bugs.

| Topic | Source expectation | Runtime observation | Status |
|-------|--------------------|---------------------|--------|
| Login shape | Returns token and full user row | 200 with JWT and full row, including password field | RUNTIME-VERIFIED; sensitive value redacted |
| JWT lifetime | No signing expiry option | Decoded payload had `id`, `role`, `iat`; no `exp` | RUNTIME-VERIFIED |
| Bearer auth | Middleware accepts second Authorization segment | Correlated Bearer token obtained 200 from `/api/users/me` | RUNTIME-VERIFIED happy path |
| Cart storage | Per-user in-memory array | Empty → one appended object for user 2 | RUNTIME-VERIFIED sequentially |
| Checkout/cart coupling | Checkout reads submitted amount/address only | Stored `29950000` although retained cart item price was `30000000` | RUNTIME-VERIFIED |
| Cart clearing | No checkout clear operation | Cart still held its item after checkout | RUNTIME-VERIFIED |
| Order detail auth | No middleware on detail route | Request without Authorization returned order 1 with 200 | RUNTIME-VERIFIED |
| Coupon apply auth | No middleware on apply route | Request without Authorization returned 200 | RUNTIME-VERIFIED |
| Coupon usage coupling | Separate endpoint, not part of checkout | Usage stayed separate and required its own POST | RUNTIME-VERIFIED |
| Fixed coupon math | Subtract fixed value | 30,000,000 − 50,000 = 29,950,000 | RUNTIME-VERIFIED |
| Product correlation | Search/list supplies ID for detail | Search ID 1 returned matching detail ID 1 | RUNTIME-VERIFIED |

## 9. Deliberately not verified

- Failed login, attempt increments, lock duration, and unlock/recovery.
- Invalid/missing/expired JWT behavior and token revocation.
- Registration, forgot/reset password, or profile mutation.
- Missing product detail and even-ID price type conversion.
- Search injection/error behavior.
- Cart isolation or races across accounts/VUs/processes.
- Order cancellation and admin order transitions.
- Percentage coupon formula, exact-minimum boundary, expiry/limit failures, or
  coupon concurrency.
- Admin role enforcement, product/category/coupon CRUD, import, or user delete.
- SQLite contention, throughput, latency, or any performance metric.
- k6 installation or execution.

## 10. Post-run state and integrity

| Item | Final result |
|------|--------------|
| Temp database counts | users 2; products 5; categories 3; orders 1; coupons 4; coupon usage 1 |
| Temp database SHA-256 | `c845a2d2629fc598e19198b0e1eec26b4b9521e24c6d9cc5a623801d47e84667` |
| Temp SQLite integrity | `ok` |
| Backend stop | `kill -TERM 10568`; execution session exit 143 (SIGTERM) |
| PID after stop | Not present |
| Port 3000 after stop | Free |
| Original database SHA-256 after stop | `c63f00544180ba1fbb1427a9b9dd3f1784842698809972f33ce90482e7420ba6` |
| Original backend status after stop | Clean |
| Original source/manifest hashes | Unchanged from preflight |
| Original `node_modules` | Absent |
| k6 | Not installed |

The disposable database intentionally retains the one order and coupon-usage
row for review. Nothing was deleted or reset after the run.

## 11. Selected WF-03 functional smoke verification

### Scope and boundary

After the student selected WF-03, one additional sequential smoke iteration
verified the previously source-only cancellation step. This was functional
verification, not a performance run.

- Execution: 2026-09-01 12:58:17 +07 context
- Preflight: 2026-09-01 12:56:55 +07
- Shutdown/integrity verification: 2026-09-01 12:58:58 +07
- Disposable backend PID: 11253
- Commit: `85af3ba875c88283615e22cb108f13e2fccaf0e9`
- Iterations: one
- Concurrency: none
- k6: not installed or used

Before restart, the retained Phase 3 clone contained one pending order and one
coupon-usage row. Starting the unmodified temp-clone server reseeded only that
clone. Immediately before WF-03, its database had two users, five products,
zero orders, zero coupon usages, unlocked accounts, integrity `ok`, and SHA-256
`5e29cb8c0d5fbabf41b3d4fa51340087d0664a70447f2b3f78217525449276b0`.

### Step 1 — Login

```http
POST /api/login HTTP/1.1
Accept: application/json
Content-Type: application/json

{"email":"test@eshop.com","password":"[REDACTED PUBLIC FIXTURE PASSWORD]"}
```

Actual status: `200`.

Relevant redacted response:

```json
{"message":"Login successful","token":"[REDACTED JWT length=133]","user":{"id":2,"name":"Test User","email":"test@eshop.com","password":"[REDACTED]","role":"user","login_attempts":0,"locked_until":null,"reset_token":null,"shipping_address":null,"phone":null}}
```

The JWT was extracted into memory and supplied as `Authorization: Bearer
[CORRELATED JWT]` for checkout and cancellation. No failed login was sent.

### Step 2 — Product search and ID correlation

```http
GET /api/products?search=iPhone%2015 HTTP/1.1
Accept: application/json
```

Actual status/response:

```text
200
[{"id":1,"name":"iPhone 15 Pro Max","price":30000000,"description":"Điện thoại cao cấp của Apple","imageUrl":"https://placehold.co/300x300/png?text=iPhone+15","category_id":1}]
```

The procedure extracted `productId=1` from this actual response.

### Step 3 — Correlated product detail

```http
GET /api/products/1 HTTP/1.1
Accept: application/json
```

The `/1` was constructed from the extracted search value, not an independent
hard-coded fixture. Actual status/response:

```text
200
{"id":1,"name":"iPhone 15 Pro Max","price":30000000,"description":"Điện thoại cao cấp của Apple","imageUrl":"https://placehold.co/300x300/png?text=iPhone+15","category_id":1}
```

The response ID matched the correlated ID; price `30000000` supplied the smoke
checkout total.

### Step 4 — Checkout and dynamic order correlation

```http
POST /api/checkout HTTP/1.1
Accept: application/json
Content-Type: application/json
Authorization: Bearer [CORRELATED JWT]

{"total_amount":30000000,"shipping_address":"Phase 4 WF-03 Disposable Smoke Address"}
```

Actual status/response:

```text
200
{"message":"Checkout successful","orderId":1}
```

The procedure extracted actual `orderId=1`. No order ID was supplied in test
data or embedded in the later commands.

### State before cancellation

The correlated request `GET /api/orders/1` returned HTTP 200:

```json
{"id":1,"user_id":2,"total_amount":30000000,"status":"pending","shipping_address":"Phase 4 WF-03 Disposable Smoke Address","created_at":"2026-09-01 05:58:17"}
```

### Step 5 — Cancel newly created order

```http
PUT /api/orders/1/cancel HTTP/1.1
Accept: application/json
Content-Type: application/json
Authorization: Bearer [CORRELATED JWT]

{}
```

Again, `/1` came from checkout's `orderId`. Actual status/response:

```text
200
{"message":"Order canceled successfully"}
```

### State after cancellation

The same correlated `GET /api/orders/1` returned HTTP 200:

```json
{"id":1,"user_id":2,"total_amount":30000000,"status":"canceled","shipping_address":"Phase 4 WF-03 Disposable Smoke Address","created_at":"2026-09-01 05:58:17"}
```

Read-only SQLite confirmation found exactly one order with ID 1, user 2, amount
30,000,000, and status `canceled`. Both users remained at zero login attempts
with no lock timestamp. Final temp database SHA-256 was
`dea4a462e07ba1ec61450ceace2ef50ba2d9c9608d507129df14b0d5c75fb2fc`;
integrity was `ok`.

### Result and repeatability

**RUNTIME-VERIFIED PASS:** `pending → canceled` using the checkout-correlated
order ID. All requests in the selected flow and both state reads returned 200.

The logical workflow can repeat because each checkout creates a new ID and the
same iteration cancels only that ID. It is not state-neutral: every iteration
leaves one canceled order row, so database size grows. Reusing an old canceled
ID would fail. Future scenario isolation must use an explicitly documented
disposable-runtime reseed and must preserve each run's evidence first.

### Shutdown and original integrity

`kill -TERM 11253` stopped the exact clone process. Its managed TTY session
reported exit 1 after SIGTERM; PID 11253 disappeared and port 3000 became free.
The original database remained
`c63f00544180ba1fbb1427a9b9dd3f1784842698809972f33ce90482e7420ba6`,
all original source/manifest hashes were unchanged, original backend status was
clean, and original `node_modules` remained absent.
