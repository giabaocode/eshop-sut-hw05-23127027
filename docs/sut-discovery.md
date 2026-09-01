# EShop SUT Discovery

## Document control and evidence boundary

- Phase: PHASE 1 — Repository / SUT Discovery
- Date: 2026-09-01 (Asia/Ho_Chi_Minh)
- Method: source inspection and read-only SQLite queries only
- SUT execution: **not performed**
- Dependency installation: **not performed**
- Database initialization/reset/reseed: **not performed**
- Workflow selection: **not performed**

Terms used below:

- **SOURCE-VERIFIED** means directly supported by repository source, tracked
  documentation, manifests, or read-only inspection of the existing database.
- **RUNTIME VERIFICATION REQUIRED** means execution is still needed before the
  behavior, response, or operational safety can be treated as empirical.
- A source/specification discrepancy is a hypothesis or source observation,
  not a confirmed bug, until it is reproduced against the running SUT.

## 1. Architecture and apparent startup

| Item | Source-verified finding | Evidence |
|------|-------------------------|----------|
| Backend | Node.js CommonJS application using Express, `body-parser`, CORS, `jsonwebtoken`, and `sqlite3`. | [`backend/package.json`](../backend/package.json); [`server.js:1`](../backend/server.js#L1) |
| Database | One local SQLite file resolved as `backend/database.sqlite`. | [`database.js:1-5`](../backend/database.js#L1) |
| Host/port | The server listens on all default interfaces on hard-coded port `3000`; the documented base URL is `http://localhost:3000`. | [`server.js:7-8`](../backend/server.js#L7), [`server.js:570-572`](../backend/server.js#L570), [`api_specification.md:5`](../api_specification.md#L5) |
| Middleware | Permissive default CORS and JSON request parsing are installed globally. | [`server.js:11-12`](../backend/server.js#L11) |
| Environment | No `.env` file, Docker configuration, `dotenv`, or `process.env` use was found. Port and JWT signing key are hard-coded. | Repository file search; [`server.js:8-9`](../backend/server.js#L8) |
| Intended command | The setup guide says install backend packages, optionally initialize the database, then run `node server.js`. | [`setup_guide.md:12-34`](../setup_guide.md#L12) |
| Frontends | Web and admin clients use `http://localhost:3000/api`; mobile has a developer-specific LAN URL. Frontends are not necessary for direct API tests. | [`AuthContext.jsx:14`](../frontend-web/src/context/AuthContext.jsx#L14), [`frontend-admin/src/App.jsx:4`](../frontend-admin/src/App.jsx#L4), [`frontend-mobile/App.js:16`](../frontend-mobile/App.js#L16) |

### Critical startup side effect

The documented startup command is not safe for preserving the current database:

1. `server.js` imports `./database` at module load
   ([`server.js:4`](../backend/server.js#L4)).
2. `database.js` calls `initDatabase()` unconditionally
   ([`database.js:117`](../backend/database.js#L117)).
3. `initDatabase()` drops `coupon_usage`, `coupons`, `users`, `products`,
   `categories`, and `orders`, recreates them, and inserts seed data
   ([`database.js:13-20`](../backend/database.js#L13),
   [`database.js:22-113`](../backend/database.js#L22)).

Therefore, **SOURCE-VERIFIED**: both `node database.js` and `node server.js`
invoke the destructive initializer. No SUT process was started in this phase.
A safe startup method must be designed and human-reviewed before Phase 2 can
run the backend without unexpectedly erasing current evidence/state.

`run_servers.sh` is also unsuitable: it begins with `killall node` and uses a
different person's absolute checkout path. It was inspected but not executed.

## 2. Database model and current read-only state

### Schema properties

| Table | Relevant columns | Constraints/relationships found |
|-------|------------------|---------------------------------|
| `users` | `id`, `name`, `email`, `password`, `role`, `login_attempts`, `locked_until`, `reset_token`, `shipping_address`, `phone` | Primary key only; no unique constraint on email; no password hashing visible in source. |
| `products` | `id`, `name`, `price`, `description`, `imageUrl`, `category_id` | Primary key only; `category_id` has no declared foreign key. No inventory/stock column exists. |
| `categories` | `id`, `name` | Primary key only. |
| `orders` | `id`, `user_id`, `total_amount`, `status`, `shipping_address`, `created_at` | Primary key only; no foreign key, order-item table, coupon reference, or inventory relationship. |
| `coupons` | `id`, `code`, `type`, `discount_value`, `min_order_amount`, `expired_at`, `is_active`, `max_uses_per_user` | `code` is unique; no other validation constraints. |
| `coupon_usage` | `id`, `coupon_id`, `user_id`, `used_at` | No foreign keys or uniqueness constraint. |

Read-only PRAGMA inspection returned journal mode `delete` and
`integrity_check=ok`; its inspection connection reported foreign-key
enforcement `0` and busy timeout `0`. The application source does not configure
alternative values. These are configuration/schema observations, not measured
performance. Only the automatic unique index on `coupons.code` was present.

### Existing state (not a clean seed assumption)

The database hash during Phase 1 was
`c63f00544180ba1fbb1427a9b9dd3f1784842698809972f33ce90482e7420ba6`.
Its modification time was `2026-09-01 09:51:44 +0700` before this document was
created.

- Users: IDs 1 and 2; both had `login_attempts=0`, no active `locked_until`, and
  no reset token. User 2 had a phone value but no shipping address.
- Products: five rows, IDs 1–5, matching the seed source.
- Categories: three rows, IDs 1–3, matching the seed source.
- Coupons: four rows, IDs 1–4, matching the seed source.
- Orders: three existing rows for user 2 (two `pending`, one `delivered`).
- Coupon usage: zero rows.

These counts prove the file is already mutable application state. They must not
be silently replaced with a newly seeded database.

### Repository-defined demo accounts

The public SUT fixture defines these demo-only credentials in
[`README.md:21-24`](../README.md#L21) and seed source
[`database.js:90-94`](../backend/database.js#L90):

| Role | Email | Repository fixture password | Current user ID |
|------|-------|-----------------------------|-----------------|
| Admin | `admin@eshop.com` | `Admin123!` | 1 |
| User | `test@eshop.com` | `Test1234!` | 2 |

The setup guide instead prints lowercase `admin123`
([`setup_guide.md:103-105`](../setup_guide.md#L103)). The seeded value above is
source-backed, but credential success still requires runtime verification.
These public demo fixtures must never be confused with private credentials.

### Seed products and useful data correlations

| ID | Name | Price | Category ID |
|----|------|------:|-------------|
| 1 | iPhone 15 Pro Max | 30,000,000 | 1 |
| 2 | Samsung Galaxy S24 Ultra | 28,000,000 | 1 |
| 3 | MacBook Pro M3 | 45,000,000 | 2 |
| 4 | Tai nghe AirPods Pro 2 | 6,000,000 | 3 |
| 5 | Bàn phím cơ Keychron Q1 | 4,000,000 | 3 |

Product IDs should still be discovered from `GET /api/products` rather than
blindly hard-coded in final tests. Search terms/product expectations can be CSV
inputs, but the response should supply the actual product ID for the detail and
transactional steps.

### Seed coupon data

| ID | Code | Type/value | Minimum | Expiry | Active | Max uses/user |
|----|------|------------|--------:|--------|--------|---------------|
| 1 | `SAVE10` | percent / 10 | 300,000 | 2099-12-31 | 1 | 1 |
| 2 | `BIGBUY` | fixed / 50,000 | 500,000 | 2099-12-31 | 1 | 1 |
| 3 | `VIP100` | fixed / 100,000 | 300,000 | 2099-12-31 | 1 | 2 |
| 4 | `EXPIRED` | percent / 20 | 100,000 | 2020-01-01 | 1 | 1 |

These are fixture facts, not proof that application-time coupon calculations
or usage limits work correctly.

## 3. Authentication, JWT, and account lockout

### JWT lifecycle

- `POST /api/login` looks up the row by email and compares the submitted
  password directly to the stored value
  ([`server.js:32-46`](../backend/server.js#L32)).
- On success it starts an asynchronous update setting `login_attempts=0` and
  `locked_until=NULL`, then signs `{id, role}` and returns
  `{message, token, user}` ([`server.js:46-52`](../backend/server.js#L46)).
- The signing call supplies no explicit expiry option. Token expiry behavior and
  concrete claims must be checked at runtime; the source contains no token
  refresh, revocation, or server-side session store.
- Protected routes parse `Authorization`, take the second space-delimited token,
  call `jwt.verify`, and place the decoded payload in `req.user`
  ([`server.js:100-110`](../backend/server.js#L100)).
- Missing token returns 401 `{"error":"Unauthorized"}`; failed verification
  returns 403 `{"error":"Forbidden"}`.
- Web logout only removes the token client-side. No logout/revocation endpoint
  exists ([`AuthContext.jsx:37-41`](../frontend-web/src/context/AuthContext.jsx#L37)).
- The customer web client initializes its token from browser `localStorage`,
  installs it as Axios's default Authorization header, and calls
  `GET /api/users/me` to restore the user
  ([`AuthContext.jsx:6-24`](../frontend-web/src/context/AuthContext.jsx#L6)).
  The admin client similarly uses `localStorage` key `adminToken`; the mobile
  client keeps token/user only in component memory. Direct k6 tests must perform
  their own per-VU token extraction and header construction rather than relying
  on any frontend session store.
- The backend has authentication middleware but no role-checking middleware.
  Routes labelled admin generally require a valid token but do not verify
  `req.user.role`. The admin frontend performs its own role check after login
  ([`frontend-admin/src/App.jsx:61-70`](../frontend-admin/src/App.jsx#L61)).
- Forgot-password generates a value from 1000 through 9999 and returns it in
  `resetToken`, so the implementation is four digits. FR-03 requires a random
  six-digit OTP. This remains a source observation pending runtime verification.

### Implemented lockout path

```text
Existing email
  ├─ locked_until is still in the future → 403; no counter update
  ├─ correct password → async reset attempts to 0/unlock; return token/user
  └─ wrong password → newAttempts = stored attempts + 2
       ├─ newAttempts < 3 → store attempts and NULL lock; return 401
       └─ newAttempts >= 3 → store lock until now + 180 seconds; return 401
```

This is **SOURCE-VERIFIED implementation behavior**, not yet an empirical bug
result. It differs from FR-02, which requires an increment of exactly 1 and a
30-second lock after at least three consecutive failures
([`README.md:38-43`](../README.md#L38)). With an initial counter of zero, the
source would calculate 2 after the first wrong password and 4 plus a lock after
the second. Because the database update is not awaited before the response,
concurrent logins may also race; the result requires runtime verification.

### Recovery/reset options found in source

- Automatic recovery path: after `locked_until` is no longer in the future, a
  correct login proceeds and resets the fields to zero/NULL.
- Password reset does **not** modify `login_attempts` or `locked_until`.
- No user or admin unlock endpoint exists.
- Direct SQLite updates could clear the fields but would mutate evidence and are
  not an application-provided procedure; none was performed.
- Running the initializer would reset accounts but also drop all application
  tables and is forbidden without explicit destructive-action approval.

For later runs, nominal tests should use correct credentials and distinct
accounts where possible. Deliberate failed-login tests, direct unlocks, or
database reset strategies require an explicit human-reviewed procedure.

## 4. API-wide conventions

- Base URL: `http://localhost:3000`.
- JSON requests should use `Content-Type: application/json`.
- Protected requests require `Authorization: Bearer <token>`.
- Route successes use Express's default 200 status; no route returns 201/204.
- Many handlers do not check SQLite callback errors. Tables below list only
  statuses explicitly produced by the handler/middleware; additional framework
  behavior must be verified at runtime.
- Dynamic data should be correlated from earlier responses. Seed IDs are useful
  test-data expectations, not a substitute for extraction.

### Common row/array response shapes

| Resource | Source-defined row shape |
|----------|--------------------------|
| User | `id`, `name`, `email`, `password`, `role`, `login_attempts`, `locked_until`, `reset_token`, `shipping_address`, `phone` |
| Product | `id`, `name`, `price`, `description`, `imageUrl`, `category_id` |
| Category | `id`, `name` |
| Cart item | Whatever JSON object was previously appended; no server-defined schema or item ID |
| Order | `id`, `user_id`, `total_amount`, `status`, `shipping_address`, `created_at` |
| Coupon | `id`, `code`, `type`, `discount_value`, `min_order_amount`, `expired_at`, `is_active`, `max_uses_per_user` |
| Coupon usage | `id`, `coupon_id`, `user_id`, `used_at` (not returned by a read endpoint) |
| Admin order | Order row plus joined `user_name` |

`GET /api/users/me` and login's `user` property use the full user row in the
source, including fields that assertions should not copy into logs. Performance
artifacts should avoid emitting passwords, reset tokens, or JWTs.

## 5. Core user-facing endpoint contracts

### 5.1 Request, response, authentication, and status

| Category | Method and route | Source handler | Authentication / headers | Request body or query | Source-defined success response | Explicit error statuses |
|----------|------------------|----------------|--------------------------|-----------------------|---------------------------------|-------------------------|
| Auth | `POST /api/register` | [`server.js:20-30`](../backend/server.js#L20) | Public; JSON content type | JSON `{name,email,password}` | 200 `{message:"User registered successfully", id}` | 500 `{error}` on insert error |
| Auth | `POST /api/login` | [`server.js:32-66`](../backend/server.js#L32) | Public; JSON content type | JSON `{email,password}` | 200 `{message:"Login successful", token, user}` | 401 unknown email/wrong password; 403 active lock; 500 lookup error |
| Auth | `POST /api/forgot-password` | [`server.js:68-85`](../backend/server.js#L68) | Public; JSON content type | JSON `{email}` | 200 `{message, resetToken}` | 404 user absent; 500 token update error |
| Auth | `POST /api/reset-password` | [`server.js:87-98`](../backend/server.js#L87) | Public; JSON content type | JSON `{email,resetToken,newPassword}` | 200 `{message:"Password reset successfully"}` | 400 invalid token/email; DB error is not explicitly handled |
| Auth/profile | `GET /api/users/me` | [`server.js:112-116`](../backend/server.js#L112) | Bearer token | None | 200 full selected user row | 401/403 middleware; DB/not-found cases not explicitly handled |
| Auth/profile | `PUT /api/users/me` | [`server.js:118-135`](../backend/server.js#L118) | Bearer token; JSON content type | `{name,shipping_address,phone,role?}` | 200 `{message:"Profile updated"}` | 401/403 middleware; 500 update error |
| Read | `GET /api/products` | [`server.js:141-157`](../backend/server.js#L141) | Public | Optional query `search=<keyword>` | 200 array of product rows | Search SQL error: 500 HTML; non-search DB error not explicitly handled |
| Read | `GET /api/products/:id` | [`server.js:159-165`](../backend/server.js#L159) | Public | Path `id` | 200 product object; missing row is 200 `{}` | No explicit DB error status |
| Read | `GET /api/categories` | [`server.js:243-247`](../backend/server.js#L243) | Public | None | 200 category array | No explicit DB error status |
| Transactional | `GET /api/cart` | [`server.js:284-288`](../backend/server.js#L284) | Bearer token | None | 200 per-user in-memory array | 401/403 middleware |
| Transactional | `POST /api/cart` | [`server.js:290-295`](../backend/server.js#L290) | Bearer token; JSON content type | Arbitrary JSON; API spec shows `{id,name,price,quantity}` | 200 `{message:"Added to cart"}` | 401/403 middleware; no body validation |
| Transactional | `POST /api/checkout` | [`server.js:297-309`](../backend/server.js#L297) | Bearer token; JSON content type | Handler reads `{total_amount,shipping_address}`; web/mobile also send ignored `items` and `coupon_id` | 200 `{message:"Checkout successful", orderId}` | 401/403 middleware; 500 insert error |
| Transactional/readback | `GET /api/orders/my-orders` | [`server.js:311-319`](../backend/server.js#L311) | Bearer token | None | 200 order array, descending ID | 401/403 middleware; DB error not explicitly handled |
| Transactional/readback | `GET /api/orders/:id` | [`server.js:344-349`](../backend/server.js#L344) | Public in actual source | Path `id` | 200 order object | 404 `{error:"Order not found"}` |
| Transactional/cleanup | `PUT /api/orders/:id/cancel` | [`server.js:321-342`](../backend/server.js#L321) | Bearer token; JSON content type if `{}` sent | Path `id`; body unused | 200 `{message:"Order canceled successfully"}` | 401/403 middleware; 404 not owned/found; 400 delivered/canceled |
| Coupon/read | `GET /api/coupons` | [`server.js:356-360`](../backend/server.js#L356) | Bearer token | None | 200 coupon array | 401/403 middleware; DB error not explicitly handled |
| Coupon | `POST /api/apply-coupon` | [`server.js:363-441`](../backend/server.js#L363) | Public in actual source; JSON content type | `{code,total_amount,user_id?}` | 200 `{success,coupon_id,discount_amount,final_amount,message}` | 400 missing code, insufficient threshold, expired, or usage limit; 404 missing/inactive code |
| Coupon mutation | `POST /api/coupon-usage` | [`server.js:444-454`](../backend/server.js#L444) | Bearer token; JSON content type | `{coupon_id}` | 200 `{message:"Usage recorded"}` | 401/403 middleware; 500 insert error |

### 5.2 Correlation, mutation, repeatability, and CSV needs

| Endpoint | Values requiring correlation | Database/process mutation | Concurrency and repeatability risk | Relevant CSV/test-data needs |
|----------|------------------------------|---------------------------|------------------------------------|------------------------------|
| `POST /api/register` | Returned `id`; submitted email/password for later login | Inserts a user | No email uniqueness constraint; repeated rows create duplicates; permanent growth | Unique synthetic names/emails/passwords; never real credentials |
| `POST /api/login` | Extract `token` and `user.id`; optionally validate `user.role` | Success asynchronously resets lock state; failure updates attempts/lock | Shared accounts couple VUs through counter/reset; failures can lock all VUs; update is not awaited | Demo/synthetic account rows; credential sensitivity controls; expected role |
| `POST /api/forgot-password` | Extract `resetToken` for reset step | Replaces user's reset token | Concurrent requests overwrite one token; changes reusable credential state | Dedicated disposable email/account only |
| `POST /api/reset-password` | Use email and prior `resetToken` | Changes password and nulls reset token | Competing resets invalidate tokens/password assumptions; not idempotent | Dedicated account and planned new passwords |
| `GET /api/users/me` | Validate returned `id` against login `user.id`; profile fields can feed checkout data | None | Same token/user is readable concurrently; full row shape may vary with state | Usually credential row plus expected user ID/role |
| `PUT /api/users/me` | Login token/user ID | Updates profile and optionally role | Shared-user last-write-wins; mutates reusable fixture | Unique per-user profile data; avoid in nominal flow unless approved |
| `GET /api/products` | Extract product `id`, `name`, `price`, `category_id` for detail/cart/total | None | Search interpolates raw input into SQL; product set can change if admin tests run | Search term, expected product name/category; optional desired quantity |
| `GET /api/products/:id` | Use ID from list/search; validate returned ID | None; even IDs have price converted to a string in response | Missing product is 200 `{}`; concurrent admin deletion/update can invalidate correlation | Search expectation and product-selection rule, not only fixed ID |
| `GET /api/categories` | Category IDs may validate selected product | None | Concurrent category deletion can make product references stale | Optional category name/ID expectation |
| `GET /api/cart` | No cart/cart-item ID exists; array content correlates only by submitted fields | Initializes an empty in-memory array for a new user key | Shared account shares one array; state disappears on restart and grows without cleanup endpoint | Expected initial-state policy and per-user credentials |
| `POST /api/cart` | Use product fields from read response; response exposes no item ID | Appends arbitrary body to process-memory array | Shared user/VUs accumulate/interleave entries; repeat is not idempotent; no remove/clear API | Quantity and product selection; preferably distinct accounts |
| `POST /api/checkout` | Use login token/user ID; extract `orderId`; optional total derived from product/coupon response | Inserts one order row | Every iteration grows SQLite; shared writers may contend; no idempotency key, inventory update, cart validation, cart clear, or order-item persistence | Shipping address and quantity/total policy; unique data only where needed |
| `GET /api/orders/my-orders` | Correlate `orderId` to a row owned by current user | None | Result grows throughout tests; assertions must not assume fixed length/order beyond descending ID | Expected user/account; created-order ID from same iteration |
| `GET /api/orders/:id` | `orderId` from checkout/history | None | Route is public in source; stale/nonexistent ID gives 404 | No static ID required if correlated |
| `PUT /api/orders/:id/cancel` | `orderId` from same user | Updates status to `canceled` | One successful cancellation makes repeats fail 400; competing VUs race; shipping is allowed by actual handler | Cleanup policy and expected pre-state |
| `GET /api/coupons` | Coupon IDs/codes can feed coupon requests | None | Exposes mutable coupon state; any valid JWT is accepted by middleware | Coupon code/type expectations if this read is used |
| `POST /api/apply-coupon` | Use login `user.id`; extract `coupon_id`, `discount_amount`, `final_amount` | Read-only by itself | Usage check and later usage insert are not atomic; exact threshold uses `>`; percentage arithmetic in source differs from FR-09 | Code, total, expected type/minimum; per-user usage budget |
| `POST /api/coupon-usage` | `coupon_id` from apply response; authenticated user comes from token | Inserts a usage row | Repeat consumes/unboundedly records uses; no unique constraint; race with usage check | Coupon/account allocation and maximum-use plan |

## 6. Administrative and alternative endpoint inventory

These routes are included so later workflow analysis does not silently assume a
user purchase flow. They are high-risk building blocks because they mutate
shared fixtures. None was selected or executed.

| Method and route | Source | Actual auth/headers | Input | Success / explicit errors | Correlation and mutation | Concurrency/repeatability and CSV needs |
|------------------|--------|---------------------|-------|---------------------------|--------------------------|-----------------------------------------|
| `POST /api/products` | [`server.js:167-177`](../backend/server.js#L167) | Public in source; JSON | `{name,price,description,imageUrl,category_id}` | 200 `{message,id}`; 500 `{error}` | Correlate returned product ID; inserts row | Permanent shared-data growth/collisions; unique CSV product rows required |
| `PUT /api/products/:id` | [`server.js:179-189`](../backend/server.js#L179) | Public in source; JSON | Path ID plus full product fields | 200 `{message}`; 500 `{error}` | ID from product list/create; updates row | Last-write-wins and reader inconsistency; dedicated product IDs/data required |
| `DELETE /api/products/:id` | [`server.js:191-196`](../backend/server.js#L191) | Public in source | Path ID | 200 `{message}`; 500 `{error}` | ID from create/list; deletes row | Destructive, breaks readers, repeat may still report 200; only disposable IDs |
| `POST /api/admin/import-products` | [`server.js:199-241`](../backend/server.js#L199) | Any valid Bearer token; JSON | `{products:[{name,price,description,imageUrl,category_id},...]}` | 200 `{message,inserted,errors}`; 400 missing/empty array; 401/403 auth | Inserts multiple products; individual IDs not returned | No transaction/rollback; partial inserts embedded in 200; CSV source must use unique disposable products |
| `POST /api/categories` | [`server.js:249-255`](../backend/server.js#L249) | Any valid Bearer token; JSON | `{name}` | 200 `{message,id}`; 500; 401/403 | Correlate category ID; inserts row | Permanent shared-state growth; unique category CSV value |
| `PUT /api/categories/:id` | [`server.js:257-267`](../backend/server.js#L257) | Any valid Bearer token; JSON | Path ID, `{name}` | 200 `{message}`; 500; 401/403 | Updates category | Last-write-wins; can change product context; disposable category only |
| `DELETE /api/categories/:id` | [`server.js:269-278`](../backend/server.js#L269) | Any valid Bearer token | Path ID | 200 `{message}`; 500; 401/403 | Deletes category | No foreign-key enforcement; can orphan products; destructive |
| `POST /api/admin/coupons` | [`server.js:457-481`](../backend/server.js#L457) | Any valid Bearer token; JSON | `{code,type,discount_value,min_order_amount,expired_at,max_uses_per_user}` | 200 `{message,id}`; 500; 401/403 | Correlate coupon ID; inserts row | Unique-code collision; persistent growth; unique coupon CSV rows required |
| `DELETE /api/admin/coupons/:id` | [`server.js:483-488`](../backend/server.js#L483) | Any valid Bearer token | Path ID | 200 `{message}`; 500; 401/403 | Deletes coupon | Destructive and races apply requests; disposable created ID only |
| `GET /api/admin/users` | [`server.js:494-502`](../backend/server.js#L494) | Any valid Bearer token | None | 200 user summary array; 401/403; DB error not handled | User IDs may correlate to delete/admin observations; no mutation | Result grows with registration; no CSV beyond account/token |
| `DELETE /api/admin/users/:id` | [`server.js:504-508`](../backend/server.js#L504) | Any valid Bearer token | Path ID | 200 `{message}`; 401/403; DB error ignored | Deletes user | Highly destructive; no self-delete guard/foreign keys; disposable registered IDs only |
| `GET /api/admin/orders` | [`server.js:510-523`](../backend/server.js#L510) | Any valid Bearer token | None | 200 joined order array; 401/403; DB error not handled | Order IDs/statuses feed status update; no mutation | Result grows during checkout tests; token/account data only |
| `PUT /api/admin/orders/:id/status` | [`server.js:525-568`](../backend/server.js#L525) | Any valid Bearer token; JSON | Path ID; `{status}` | 200 `{message}`; 400 invalid transition; 404 absent; 401/403 | Updates correlated order status | Non-idempotent state machine; concurrent transitions race; state-specific CSV data |

The API specification says admin routes require an admin role
([`api_specification.md:171-182`](../api_specification.md#L171)), while the
actual middleware only verifies a token. Product write routes have no
middleware at all. These remain source observations pending execution.

## 7. Client/API relationship and transactional side effects

### Web and mobile carts do not use the backend cart API

- Web cart state is a React array in `CartContext`; `addToCart`, removal, and
  clear operations are local state only
  ([`CartContext.jsx:5-25`](../frontend-web/src/context/CartContext.jsx#L5)).
- Web product/detail actions call that local context, not `POST /api/cart`
  ([`Home.jsx:97-99`](../frontend-web/src/pages/Home.jsx#L97),
  [`ProductDetail.jsx:21-30`](../frontend-web/src/pages/ProductDetail.jsx#L21)).
- The mobile client likewise manages a local array
  ([`frontend-mobile/App.js:61-77`](../frontend-mobile/App.js#L61),
  [`frontend-mobile/App.js:134-150`](../frontend-mobile/App.js#L134)).
- Repository-wide client search found no web/mobile call to `/api/cart`.

Thus a direct API workflow that includes `POST /api/cart` exercises a real
backend route but is not an exact replay of the current web/mobile network path.
This distinction must be considered during later workflow-candidate review.

### Checkout behavior

- The backend reads only `total_amount` and `shipping_address`, then inserts an
  order with status `pending` and returns its new ID. It does not query product,
  cart, coupon, or inventory state.
- Web/mobile send `items`, `total_amount`, and `coupon_id`; those extra fields are
  ignored by the backend. Neither client sends `shipping_address` in its current
  checkout request ([`Checkout.jsx:40-51`](../frontend-web/src/pages/Checkout.jsx#L40),
  [`frontend-mobile/App.js:380-395`](../frontend-mobile/App.js#L380)).
- Web declares `clearCart` but does not call it after successful checkout.
  Mobile explicitly clears its local cart after success.
- No inventory field/table exists and checkout performs no stock decrement.
  Therefore there is no source-defined inventory contention to measure; the
  primary shared write side effect is growth/contention in the `orders` table.

### Coupon behavior

- `POST /api/apply-coupon` is public in source and trusts body `user_id`; it does
  not derive the user from a JWT.
- Eligibility uses `total_amount > min_order_amount`, whereas FR-09 specifies
  greater-than-or-equal.
- The percentage branch calculates `total_amount * (1 - discount_value)` rather
  than `total_amount * discount_value / 100`.
- Usage checking and `POST /api/coupon-usage` are separate operations; checkout
  does not itself record coupon usage.

All four points are source-level hypotheses/observations only. A coupon-bearing
performance path would also consume persistent usage rows and needs dedicated
accounts/coupons or an approved cleanup strategy.

## 8. Source specification discrepancies to preserve as hypotheses

| Topic | Requirement/document statement | Actual source observation | Evidence status |
|-------|--------------------------------|---------------------------|-----------------|
| Login attempts | Increment exactly 1; lock after 3 failures for 30 seconds. | Adds 2 and uses 180 seconds. | SOURCE-VERIFIED difference; runtime reproduction required before bug classification |
| Password-reset OTP | FR-03 requires a random six-digit OTP. | Handler generates and returns a four-digit value. | SOURCE-VERIFIED implementation difference; runtime reproduction required |
| Admin fixture | Setup guide shows lowercase password. | README and seed source use capitalized fixture. | SOURCE-VERIFIED documentation conflict; login unverified |
| Startup | Guide presents database initialization as a separate optional/first-time step. | Server import unconditionally runs the drop-and-seed initializer. | SOURCE-VERIFIED control-flow conflict; startup deliberately not attempted |
| Web/backend cart | Requirements/API describe backend cart operations and clearing after checkout. | Web/mobile use local cart; backend checkout does not inspect/clear backend cart. | SOURCE-VERIFIED architecture difference; runtime behavior unverified |
| Checkout amount | Backend should recompute the total from cart. | Handler trusts submitted `total_amount`; schema has no order items/inventory. | SOURCE-VERIFIED implementation difference; runtime reproduction required |
| Coupon auth/math | JWT required, threshold `>=`, percent formula `/100`. | Apply route is public, threshold is `>`, and percent calculation uses `1-value`. | SOURCE-VERIFIED implementation difference; runtime reproduction required |
| Product detail | Not-found should be meaningfully handled. | Missing ID returns 200 `{}`; even-ID price is converted to string. | SOURCE-VERIFIED handler behavior; response unverified at runtime |
| Authorization | Admin/data-changing APIs require valid admin role. | No role middleware; product writes are public and other admin writes accept any verified token. | SOURCE-VERIFIED middleware placement; runtime reproduction required |

No row above is recorded as a confirmed defect or GitHub Issue.

## 9. Candidate building blocks for later workflow analysis

These are independent building blocks, **not workflow candidates and not a
selection**:

| Endpoint group | Available building blocks | Principal correlation |
|----------------|---------------------------|-----------------------|
| Auth-heavy | Login; optional authenticated profile confirmation; separate high-risk registration/password-reset paths | `token`, `user.id`, expected role/account state |
| Read-heavy | Product list, product search, product detail, optional category list | Search response → `product.id`; product fields → assertions/transaction data |
| Transactional | Backend cart append/read; checkout/order creation; order history/detail; optional cancellation | Product response → cart payload; checkout → `orderId`; order ID → readback/cancel |
| Coupon extension | Coupon list, coupon application, usage recording | Login `user.id`; apply response → `coupon_id` and `final_amount` |
| Admin alternative | Authenticated dashboard reads and CRUD/state transitions | Login token; create/list response IDs → update/delete/status operations |

Later candidate design must explicitly decide whether to model the documented
backend cart API or the actual web/mobile network path, how to isolate accounts,
and how to bound persistent order/coupon side effects. Phase 1 does not make
those choices.

## 10. Items requiring installation or runtime verification

The following cannot be verified from source alone:

- Install project-local npm dependencies, then confirm module/native SQLite
  compatibility with the installed Node version.
- Design a safe server startup that prevents the unconditional reset, then
  confirm port 3000 health and shutdown behavior.
- Verify actual response headers, JSON bodies, status codes, and error behavior
  for candidate endpoints.
- Verify seeded credential success without changing account lock state.
- Verify JWT concrete claims, lifetime behavior, malformed/expired token handling,
  and concurrent-login behavior.
- Reproduce lockout timing/counter/recovery only under an approved safe plan.
- Verify product search/detail behavior, including missing/even IDs and errors.
- Verify backend cart isolation and shared-account concurrency behavior.
- Verify order creation/readback, SQLite write locking, database growth, and any
  recovery/cleanup strategy.
- Verify coupon calculations and usage races only if coupons enter a candidate.
- Install/check k6 and technically achievable output/report tooling in a later
  approved phase.

No item above has been empirically measured in Phase 1.

## 11. Assignment ambiguities kept unresolved

### k6 versus mandatory `.jtl` and HTML artifacts

The assignment says:

- “k6 users provide the equivalent distinct outputs” for the three distinct
  listener/report types (§6 Task 1, PDF p.4).
- “Produce the raw .jtl logs and the HTML report folders” (§6 Task 1, PDF p.5).
- The ZIP must contain “the three raw .jtl logs and the three HTML report
  folders” (§14, PDF p.8).
- k6 is explicitly allowed as a bonus tool (§8, PDF p.6).

Status: **UNRESOLVED**. No k6 equivalent is presumed compliant.

Prepared lecturer/TA question:

> For a k6 submission, which exact native raw-result format and HTML-report
> artifact are accepted in place of each mandatory `.jtl` file and JMeter HTML
> report folder, and which three distinct k6 output/report types satisfy the
> non-repetition requirement?

### Performance demo versus Agent Skill demo

Task 1 requires an unlisted video of at least six total minutes showing the tool
and resource monitor in the same frame with the student's Vietnamese narration
(§6 Task 1, PDF p.5). The Agent Skill section says to submit the skill with a
demonstration video showing end-to-end use on a complete endpoint group (§7,
PDF p.6).

Status: **UNRESOLVED**.

Prepared lecturer/TA question:

> May one combined unlisted video satisfy both the six-minute performance-run
> demonstration and the Agent Skill end-to-end demonstration, provided every
> stated element is shown, or are two separate videos/links required?

## 12. Phase 1 conclusion

All 31 backend routes were inventoried. Core auth/read/cart/checkout/order/coupon
contracts were traced through backend handlers and client usage, while current
SQLite state was inspected read-only. The source provides sufficient building
blocks for later workflow-candidate generation, but startup safety, endpoint
behavior, lockout, concurrency, and output tooling remain runtime work. No
workflow has been generated or selected.
