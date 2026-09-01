# Selected E2E Workflow — WF-03

## Decision provenance

| Field | Record |
|-------|--------|
| Decision owner | **Phạm Ngọc Gia Bảo — HUMAN** |
| Selected workflow | **WF-03 — Purchase followed by customer cancellation** |
| Group uniqueness | Human confirmed coordination with all four group members and that no other member is using WF-03 |
| Decision record | [`human-decisions.md`](human-decisions.md#hd-001--final-e2e-workflow-selection) |
| Phase 3/smoke review | **DONE BY HUMAN** on 2026-09-01; see [`HD-002`](human-decisions.md#hd-002--phase-3-and-wf-03-smoke-approvals) |
| Formal performance contract | [`selected-workflow-specification.md`](selected-workflow-specification.md) |
| AI role | Recorded and verified the chosen flow; did not select or replace it |

## Selected sequence

```text
Login
  → Product Search/List
  → Product Detail
  → Checkout / Create Order
  → Cancel the newly created Order
```

The pre-cancellation and post-cancellation order-detail requests are invariant
validation substeps of the executable workflow. They are real HTTP requests and
must run identically in Load, Stress, and Spike. The business journey remains
WF-03 — Purchase followed by customer cancellation.

### Invariant executable sequence

```text
Login
  → Product Search/List
  → Product Detail
  → Checkout/Create Order
  → Verify newly created Order is pending
  → Cancel that exact Order
  → Verify that exact Order is canceled
```

## Endpoint specification

| Step | Group | Method and route | Auth | Request/correlation | Required success evidence |
|------|-------|------------------|------|---------------------|---------------------------|
| 1 | Auth-heavy | `POST /api/login` | Public | JSON credentials from approved test data; extract JWT and user ID | 200; login message; nonempty `token`; expected user/role |
| 2 | Read-heavy | `GET /api/products?search=<term>` | Public | Search term from test data; select product and extract `productId` | 200; nonempty array; selected ID/name/price |
| 3 | Read-heavy | `GET /api/products/:productId` | Public | Path ID from step 2, never a separate static ID | 200; returned ID matches extracted ID; required product fields |
| 4 | Transactional | `POST /api/checkout` | Bearer JWT | Body `{total_amount,shipping_address}`; amount derived from selected product policy | 200; checkout message; extract `orderId` |
| 4a | Verification read | `GET /api/orders/:orderId` | Public in current source | Path ID from checkout | 200; same order/user/amount; status `pending` |
| 5 | Transactional | `PUT /api/orders/:orderId/cancel` | Bearer JWT | Path ID from checkout; body `{}` | 200; cancellation message |
| 5a | Verification read | `GET /api/orders/:orderId` | Public in current source | Same correlated ID | 200; same order; status `canceled` |

Source handlers are in
[`backend/server.js:32`](../backend/server.js#L32),
[`server.js:141`](../backend/server.js#L141),
[`server.js:159`](../backend/server.js#L159),
[`server.js:297`](../backend/server.js#L297),
[`server.js:321`](../backend/server.js#L321), and
[`server.js:344`](../backend/server.js#L344).

## Functional smoke verification

- Date/time: 2026-09-01 12:58:17 +07 request execution context
- Runtime: approved disposable clone under `/private/tmp`
- Commit: `85af3ba875c88283615e22cb108f13e2fccaf0e9`
- Iterations: exactly one sequential functional iteration
- Result: **PASS — FUNCTIONAL ONLY, NOT A PERFORMANCE RESULT**
- All workflow and state-read requests returned HTTP 200.
- Dynamic values observed: user ID 2, product ID 1, order ID 1.
- Order ID 1 was the actual runtime value, but it was extracted from checkout;
  it was not hard-coded into the request procedure.
- State transition: `pending → canceled`.
- Exact request/response evidence:
  [`runtime-api-verification.md`](runtime-api-verification.md#11-selected-wf-03-functional-smoke-verification).

## Correlation contract

```text
POST login
  └─ token ───────────────────────────────────────────────┐
  └─ user.id ──────────────────────────────── assertions  │
GET product search                                       │
  └─ selected product.id ──> GET product detail          │
GET product detail                                       │
  └─ matching id/price ────> checkout body               │
POST checkout + Bearer token                             │
  └─ orderId ──────────────> pre-state GET               │
                           └─> authenticated cancel <─────┘
                           └─> post-state GET
```

Final k6 design must fail an iteration safely when a required extraction is
missing. It must not fall back to seed ID 1 or another static order ID.

## Data and state behavior

Potential CSV fields are credentials/account key, search term, expected product
name, quantity/total policy, and shipping address. JWT, product ID, and order ID
are runtime correlations, not CSV fields.

Each successful iteration:

1. performs a successful login that resets that user's failed-attempt state;
2. reads product data without database mutation;
3. inserts one `pending` order;
4. updates the same correlated order to `canceled`.

There is no order deletion. The orders table grows by one row per successful
iteration, even though the final state is canceled. No inventory/order-items
table is modified because the SUT has neither relationship in this path.

## Repeatability and concurrency risks

- Repeatability is strong at the logical level because each checkout supplies a
  new ID that the same iteration cancels once.
- Reusing an already canceled ID would return 400; correct correlation prevents
  intentional reuse.
- Multiple VUs may share the seed account while retaining distinct order IDs,
  but shared credentials amplify any bad-password/lockout mistake.
- SQLite receives an insert and update per iteration. With default delete
  journaling and no app-configured busy timeout, write contention needs later
  controlled performance observation rather than assumption.
- Database/list growth changes later run state. Comparable scenarios require an
  explicit disposable-runtime reset/reseed procedure and separate evidence.
- `GET /api/orders/:id` is unauthenticated in the current source/runtime. This
  is documented behavior, not treated as proof of acceptable authorization.

## Current boundary

No Load, Stress, Spike, endurance, workload-model, threshold, think-time, final
assertion, data-generation, report-output, or k6 implementation decision is
made in this document. Those require later AI-first phases and human review.

The formal workload-independent endpoint, correlation, iteration, data,
assertion, metric, state, and think-time-location contract is maintained in
[`selected-workflow-specification.md`](selected-workflow-specification.md).
