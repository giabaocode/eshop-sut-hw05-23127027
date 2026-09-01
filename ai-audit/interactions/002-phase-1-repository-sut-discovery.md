# Interaction 002 — Phase 1 Repository / SUT Discovery

## Metadata

- AI tool: Codex CLI
- Date/time: 2026-09-01 10:24:31 +07 (Asia/Ho_Chi_Minh)
- Completed: 2026-09-01 10:30:43 +07 (Asia/Ho_Chi_Minh)
- Phase: PHASE 1 — Repository / SUT Discovery
- Human-review status: `WAITING FOR HUMAN`

## Human prompt (verbatim)

> Phase 0 reviewed and approved.
>
> Proceed to PHASE 1 — Repository / SUT Discovery.
>
> Additional instructions for Phase 1:
>
> 1. Do NOT install k6, npm dependencies, Homebrew packages, or any other
>    dependencies yet.
>
> 2. Do NOT start the SUT yet.
>
> 3. Do NOT execute database.js or any command that can drop, reset, reseed,
>    or mutate the existing database.
>
> 4. Do NOT run Load, Stress, Spike, endurance, or any performance execution.
>
> 5. Do NOT choose the final workflow for me.
>
> 6. Perform source-code-backed discovery only.
>
> 7. For every endpoint that could participate in a valid E2E performance
>    workflow, document:
>    - HTTP method
>    - exact route
>    - source file / handler
>    - authentication requirement
>    - headers
>    - request body / query parameters
>    - response structure
>    - expected success/error status codes
>    - values requiring correlation
>    - database/state mutation
>    - concurrency/repeatability risks
>    - relevant CSV/test-data needs
>
> 8. Investigate in particular:
>    - login/authentication
>    - JWT handling
>    - account lockout implementation
>    - account lockout recovery/reset
>    - product listing/search
>    - product detail
>    - cart
>    - checkout/order creation
>    - coupon behavior if relevant
>    - seeded users/products
>    - inventory/order side effects
>
> 9. Preserve the preliminary source discrepancies from Phase 0 as
>    hypotheses/source observations only. Do NOT classify them as confirmed bugs
>    until they are empirically reproduced.
>
> 10. Keep the k6 versus required .jtl/HTML deliverables explicitly UNRESOLVED.
>     Do not decide that a k6 equivalent automatically satisfies the assignment.
>     Record the exact assignment wording and prepare a question for the
>     lecturer/TA if necessary.
>
> 11. Also keep the demo-video relationship ambiguity unresolved.
>
> 12. Update the AI Audit for this interaction and Phase 1.
>     Preserve my actual prompt/instruction and the relevant actual AI output,
>     not merely a vague summary.
>
> 13. Create:
>     docs/sut-discovery.md
>
> 14. At the end of Phase 1:
>     - summarize verified endpoint discoveries,
>     - distinguish SOURCE-VERIFIED facts from things requiring runtime
>       verification,
>     - list candidate building blocks for possible workflows,
>     - identify anything that still requires dependency installation or actual
>       execution,
>     - STOP.
>
> Do NOT proceed to workflow selection or workflow candidate generation until I
> review Phase 1.

## Relevant AI output preserved

The full source-backed output is
[`docs/sut-discovery.md`](../../docs/sut-discovery.md). Its material findings are:

1. All 31 Express routes were enumerated, and every core or alternative
   workflow building block was documented with method/route, source handler,
   authentication/headers, input, response/status, correlation, mutation,
   concurrency/repeatability, and CSV/test-data implications.
2. `server.js` imports `database.js`, whose unconditional initializer drops and
   reseeds all application tables. The apparent startup command is therefore
   destructive to current state; it was not run.
3. JWT middleware extracts a Bearer token and verifies it, but no role-checking
   middleware exists. Login signs `{id,role}` without an explicit expiry option.
4. The implemented wrong-password path adds 2 attempts and sets a 180-second
   lock once the calculated value is at least 3. The specification requires +1,
   three failures, and 30 seconds. This remains a source observation.
5. Web/mobile carts are client-local and never call the backend cart routes.
   Backend carts are process-memory arrays keyed by JWT user ID; checkout does
   not consume or clear them.
6. Checkout inserts only an order header using the client-provided total. There
   are no order-item or inventory tables, so source-defined inventory contention
   is absent; order-write and shared-state contention remain relevant.
7. Coupon application and usage recording are separate, non-atomic operations;
   source/specification differences were preserved as hypotheses.
8. The existing database was queried read-only, has valid integrity, includes
   five products and three pre-existing orders, and was not reset.
9. The `.jtl`/HTML and video relationship ambiguities remain explicitly
   unresolved, with precise lecturer/TA questions prepared.

No empirical performance result, runtime behavior, human decision, workflow
selection, dependency installation, or defect report is claimed.

## Commands executed

The material source-inspection commands were:

```text
nl -ba backend/server.js | sed -n '1,220p'
nl -ba backend/server.js | sed -n '221,460p'
nl -ba backend/server.js | sed -n '461,620p'
nl -ba backend/server.js | sed -n '490,590p'
nl -ba backend/database.js | sed -n '1,140p'
nl -ba frontend-web/src/context/AuthContext.jsx | sed -n '1,180p'
nl -ba frontend-web/src/context/CartContext.jsx | sed -n '1,220p'
nl -ba frontend-web/src/pages/Checkout.jsx | sed -n '1,240p'
nl -ba frontend-web/src/pages/ProductDetail.jsx | sed -n '1,180p'
nl -ba frontend-web/src/pages/Home.jsx | sed -n '1,180p'
nl -ba frontend-web/src/pages/Login.jsx | sed -n '1,140p'
nl -ba frontend-web/src/pages/Profile.jsx | sed -n '1,230p'
nl -ba frontend-web/src/pages/Cart.jsx | sed -n '1,220p'
nl -ba frontend-web/src/pages/Register.jsx | sed -n '1,150p'
nl -ba frontend-web/src/pages/ForgotPassword.jsx | sed -n '1,150p'
nl -ba frontend-web/src/App.jsx | sed -n '1,220p'
nl -ba frontend-mobile/App.js | sed -n '1,430p'
nl -ba frontend-admin/src/App.jsx | sed -n '1,190p'
nl -ba setup_guide.md | sed -n '1,130p'
nl -ba api_specification.md | sed -n '1,240p'
nl -ba README.md | sed -n '1,190p'
rg -n '^app\.(get|post|put|delete|patch)\(' backend/server.js
rg -n 'process\.env|dotenv|expiresIn|jwt\.sign|jwt\.verify|role' backend/server.js backend/package.json
rg -n 'clearCart|setCart\(\[\]\)|/api/cart|/cart' frontend-web/src frontend-mobile/App.js backend/server.js
rg -n 'http://localhost:3000/api|API_URL' frontend-web/src frontend-admin/src frontend-mobile/App.js
```

Read-only database commands used `sqlite3 -readonly database.sqlite` to run:

```text
SELECT sanitized user identity/lock-state fields (no password values)
SELECT product/category/coupon fixtures
SELECT order and coupon-usage counts/groupings
SELECT table/index definitions FROM sqlite_master
PRAGMA journal_mode
PRAGMA foreign_keys
PRAGMA busy_timeout
PRAGMA integrity_check
```

Integrity and non-mutation verification commands included:

```text
shasum -a 256 backend/database.sqlite
stat -f '%N size=%z modified=%Sm' -t '%Y-%m-%d %H:%M:%S %z' backend/database.sqlite
find backend frontend-web frontend-admin frontend-mobile -maxdepth 1 -type d -name node_modules -print
command -v k6
git status --short --branch
date '+%Y-%m-%d %H:%M:%S %Z (%z)'
```

Read-only Node one-liners compared registered route strings to the discovery
document and checked local Markdown link targets. `rg` scans checked trailing
whitespace and high-confidence secret patterns. One earlier `rg` command failed
before execution because of unmatched shell quoting; it made no changes.
