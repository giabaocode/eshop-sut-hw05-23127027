# WF-03 Test-Data Strategy

## Document control and boundary

| Field | Value |
|-------|-------|
| Phase | PHASE C — Test-Data Strategy |
| Prepared | 2026-09-01 (Asia/Ho_Chi_Minh) |
| Status | **PHASE C HUMAN-REVIEWED AND APPROVED WITH CORRECTIONS** |
| Student | Phạm Ngọc Gia Bảo (`23127027`) |
| Workflow | WF-03 — Purchase followed by customer cancellation |
| Source commit | `85af3ba875c88283615e22cb108f13e2fccaf0e9` |
| Execution | None |
| Account provisioning | Not performed |
| Safe data artifacts | `performance/data/workflow.csv`, credential template, README, narrow `.gitignore` rules |
| Credential data | No real credential file created; template placeholders only |
| Performance evidence | None; every value here is design or verified functional/source context, not a measurement |

This strategy applies the human corrections in
[`HD-005`](human-decisions.md#hd-005--phase-b-think-time-and-account-strategy-corrections):
pending verification → cancellation uses an independent random 0.5–1.0-second
pause, and the official data design supports up to 20 dedicated customers in a
disposable runtime. The prior `0 s` and single-seeded-account values remain
preserved as superseded history.

No k6 installation, final performance script, account provisioning, SUT start,
HTTP request, database mutation, or performance execution occurred in Phase C.

### Phase C review history

| Topic | ORIGINAL AI PROPOSAL | HUMAN REVIEW/CORRECTION | FINAL APPROVED PHASE C DECISION |
|-------|----------------------|-------------------------|---------------------------------|
| Quantity | Put `quantity=1` in every public row and multiply detail price by it | Verify that quantity has a real WF-03 request/calculation effect; remove it if not | Removed. WF-03 checkout accepts only `total_amount` and `shipping_address`; the verified smoke used detail price directly and never submitted quantity |
| Public dataset | Planned 20 deterministic rows after review | Approved creation now | `performance/data/workflow.csv` contains 20 trackable non-secret rows |
| Credential schema | Runtime-private `account_key,email,password,expected_role` | Approved with secure local password generation and non-disclosure | Schema approved; only a placeholder template is committed |
| Provisioning | Sequential registration and validation before measured capture | Reinforced as distinct preconditioning; any k6-based setup must have completely separate output | Setup finishes before official k6; a separate deterministic helper is preferred; no provisioning yet |
| VU mapping | Direct one-based VU slot → row/account slot | Approved with reliable k6 identifier and range validation | Dedicated `1..20` mapping; no sharing, wrapping, random reassignment, or fallback |
| Incomplete pool | Fail official preflight | Approved | 20-VU-capable runs require all 20; no automatic workload reduction or fabricated account |
| Ignore rules | Four narrow proposed paths | Approved and authorized for application | Applied at repository root without hiding public data or evidence |

The original AI proposal remains preserved in Interaction 011 and in the
historical Phase A proposal. The human review and final values are preserved in
HD-006 and Interaction 012.

## 1. Source-supported provisioning boundary

The unmodified SUT provides `POST /api/register` with JSON `name`, `email`, and
`password`; it inserts a user and returns a success message and ID
([`backend/server.js:20`](../backend/server.js#L20)). The database gives omitted
roles the default `user` value
([`backend/database.js:50`](../backend/database.js#L50)). This makes sequential
registration the preferred setup mechanism; direct SQL insertion is not the
official design.

Important source limitations shape the preflight:

- the users table does not declare email `UNIQUE`;
- registration performs no duplicate or input validation;
- passwords are stored and compared as plain text in this teaching SUT;
- every backend start drops, recreates, and seeds the clone-local tables;
- login updates account state even on success;
- the original homework database must never be started, reset, or provisioned.

Consequently, reproducibility means the same reviewed procedure, account keys,
public identities, count, and validation outcome. It does **not** require
reusing the same password across disposable runtimes.

## 2. Committed non-secret workflow data

### Planned committed path

`performance/data/workflow.csv`

This file now contains exactly 20 human-approved safe public rows.

```csv
row_id,account_key,search_term,expected_product_name,shipping_address
wf03-row-01,wf03-customer-01,iPhone 15,iPhone 15 Pro Max,HW05 WF03 Disposable Address 01
wf03-row-02,wf03-customer-02,Samsung Galaxy S24,Samsung Galaxy S24 Ultra,HW05 WF03 Disposable Address 02
```

These are synthetic examples, not evidence that either account exists.

### Schema contract

| Field | Secret? | Rule |
|-------|---------|------|
| `row_id` | No | Unique `wf03-row-01` through `wf03-row-20` |
| `account_key` | No | Unique join key `wf03-customer-01` through `wf03-customer-20`; never a password or database user ID |
| `search_term` | No | Reviewed trusted seed-catalog term; URL encoded at request time |
| `expected_product_name` | No | Exact expected name used to select from search results; not a product ID |
| `shipping_address` | No | Synthetic value `HW05 WF03 Disposable Address NN`; no personal data |

### Public-file validation

Before any later run, a validator must fail preflight unless:

1. the header is exact and UTF-8 parsing succeeds;
2. there are exactly 20 official rows, with no blank or duplicate row/account
   keys;
3. suffixes are the complete sequence `01..20`;
4. every address is nonempty, synthetic, and free of real personal information;
5. search terms and expected names belong to the reviewed catalog matrix;
6. no field named or shaped like quantity, JWT, product ID, price, order ID, or password
   appears.

The assignment-required CSV is therefore genuinely data-driven while keeping
response-owned values out of static data.

## 3. Private credential data

### Runtime-private path

The official design stores the generated file under the scenario's disposable
runtime, outside the Git checkout, for example:

`<disposable-runtime>/private/wf03-credentials.csv`

A future runner receives the exact path through a narrowly named configuration
input such as `WF03_CREDENTIALS_FILE`. A repo-local fallback
`performance/data/credentials.local.csv` may exist only after ignore protection
has been applied and verified.

### Private schema

```csv
account_key,email,password,expected_role
wf03-customer-01,hw05-23127027-wf03-customer-01@example.test,<generated-runtime-secret>,user
```

The placeholder above is documentation, not a valid password and not a real
credential row.

| Field | Rule |
|-------|------|
| `account_key` | Must join exactly one public row |
| `email` | Deterministic reserved-domain address derived from the account suffix |
| `password` | Unique runtime-generated secret; never committed, printed, tagged, or placed in evidence |
| `expected_role` | Must be `user`; registration must not attempt to provision admin roles |

The private file must contain exactly one row for every provisioned key, use
owner-only permissions (`0600`), and be created with a restrictive file-creation
mask. It must never be copied into raw results, reports, screenshots, the AI
Audit, the submission ZIP, or console output.

## 4. Account identity and password rules

For slot `NN` from `01` to `20`:

| Property | Deterministic format |
|----------|----------------------|
| Account key | `wf03-customer-NN` |
| Display name | `HW05 WF03 Customer NN` |
| Email | `hw05-23127027-wf03-customer-NN@example.test` |
| Expected role | `user` |

`example.test` is a reserved synthetic domain and does not identify a real
mailbox. Account keys and emails are stable across scenarios; passwords are not.

The recommended password procedure is to generate a distinct high-entropy,
URL-safe value for every account from the operating system's cryptographic
random source. A minimum of 32 random bytes encoded without whitespace avoids
shared-password blast radius and fragile CSV/shell characters. Reproducibility
comes from the generator contract and validation, not a hard-coded password or
committed deterministic secret. The setup process writes each secret directly
to the protected runtime file and request body without echoing it.

## 5. Reproducible disposable-runtime provisioning

Provisioning is a future setup operation, not an action authorized by this
document.

### Proposed setup sequence

1. Preserve the preceding scenario's genuine evidence before any teardown or
   reseed.
2. Create a fresh commit-pinned disposable clone and record its exact path,
   commit, backend PID, and port ownership.
3. Verify the original database SHA-256 before starting anything and ensure the
   original checkout is not the backend working directory.
4. Start only the unmodified disposable backend. Its normal initializer must
   affect only the clone-local database.
5. Before provisioning, verify SQLite integrity, exactly the expected two seed
   users, zero orders, expected seed products, and unlocked account state.
6. Validate the 20-row public manifest in memory before generating any secret.
7. Create the runtime-private credential file with owner-only permissions;
   generate one fresh password per slot.
8. Send 20 **sequential** `POST /api/register` setup requests. For each, require
   HTTP 200, `message="User registered successfully"`, and a positive returned
   ID. Do not run registration concurrently.
9. Because email uniqueness is not enforced by the schema, query only the
   disposable database read-only and require exactly one row per planned email,
   role `user`, `login_attempts=0`, and `locked_until IS NULL`; require 22 users
   total (two seed plus 20 test customers).
10. Perform one sequential valid setup login per generated customer, validate
    expected email/role, discard its JWT immediately, and redact response data.
    Any 401/403 or mismatch fails setup; never try another password.
11. Recheck that all 20 accounts are unlocked, order count is still zero,
    expected products remain present, and SQLite integrity is `ok`.
12. Record only a redacted provisioning manifest: runtime/commit, account keys,
    deterministic non-secret identities, returned IDs if needed, counts,
    statuses, timestamps, and validation outcome. Never record passwords or
    JWTs.
13. Start measured result collection only after setup and preflight have passed.
    Registration and validation requests must not enter the measured WF-03 raw
    data, summaries, or reports.

Do not restart the backend after provisioning: normal startup would erase the
new disposable accounts. A setup failure invalidates that runtime. The later
runbook should stop and rebuild a fresh disposable runtime rather than
registering duplicate emails into the same database.

## 6. Deterministic VU-to-account allocation

The future single-instance local k6 design maps the one-based VU slot directly
to the equally numbered account and workflow row:

```text
VU 1  → wf03-customer-01 → wf03-row-01
VU 2  → wf03-customer-02 → wf03-row-02
...
VU 20 → wf03-customer-20 → wf03-row-20
```

The later implementation may use k6's one-based VU identity, but must validate
the `1..20` boundary before indexing. A VU reuses its assigned account/public
row for all its iterations. JWT and order ID remain new and iteration-local.
Modulo reuse, random account selection, shared fallback credentials, and
cross-VU mutable account allocation are forbidden.

| Workload | Active mapping |
|----------|----------------|
| Conservative 2-VU pilot | Slots/accounts `01..02` |
| Load, 5 concurrent VUs | Slots/accounts `01..05`; accounts `06..20` stay provisioned but inactive |
| Stress, up to 20 VUs | VU `N` uses account `NN`; progressively activates through `01..20` |
| Spike, up to 20 VUs | Baseline begins with slots `01..03`; the rise can activate through slot `20`; during recovery, whichever VUs remain active keep their fixed slot—no account is reassigned |

Provisioning the same 20-account pool for every official scenario keeps the
pre-run user-table state comparable even though Load uses only five accounts.

### Insufficient-account behavior

- The official preflight requires all 20 validated accounts. If any row is
  missing, duplicated, locked, invalid, or unjoinable, **do not start** the
  official scenario.
- Never silently share an account, fall back to the seeded customer, reduce the
  Stress/Spike peak, or invent credentials.
- A separately human-approved diagnostic pilot could use two valid mappings,
  and a separately approved Load-only diagnostic could use five, but neither
  substitutes for the comparable official 20-account precondition.
- If provisioning or runtime verification shows the design is inappropriate,
  preserve the setup evidence and return to human review.

## 7. Product/search selection strategy

The disposable seed contains five reviewed product names. The 20 rows cycle
deterministically through this matrix four times:

| Account suffixes | Search term | Exact expected product name |
|------------------|-------------|-----------------------------|
| `01,06,11,16` | `iPhone 15` | `iPhone 15 Pro Max` |
| `02,07,12,17` | `Samsung Galaxy S24` | `Samsung Galaxy S24 Ultra` |
| `03,08,13,18` | `MacBook Pro` | `MacBook Pro M3` |
| `04,09,14,19` | `AirPods Pro` | `Tai nghe AirPods Pro 2` |
| `05,10,15,20` | `Keychron Q1` | `Bàn phím cơ Keychron Q1` |

At runtime the workflow must URL encode `search_term`, parse the returned array,
and select the first row whose `name` exactly equals
`expected_product_name`. It must then extract that response's `id` and use it
for product detail. Empty/ambiguous/no-exact-match results fail the iteration;
there is no fallback to array element zero or seed ID 1.

The current search handler interpolates the query into SQL rather than binding
it. Therefore committed search values are a reviewed allowlist, not fuzz data:
quotes, SQL metacharacters, `%`, `_`, control characters, and runtime-supplied
untrusted values are rejected by preflight. This strategy does not test SQL
injection.

## 8. Shipping address and checkout amount

- Shipping addresses are synthetic and deterministic:
  `HW05 WF03 Disposable Address NN`.
- No real name, phone number, street address, or other personal information is
  allowed.
- Quantity is deliberately absent. The WF-03 smoke performs no cart request,
  `POST /api/checkout` reads only `total_amount` and `shipping_address`, and its
  verified request used the normalized detail price directly. A quantity field
  would be ignored/artificial data.
- Checkout `total_amount` is the validated normalized product-detail price,
  checked as finite and positive. It is never read from CSV and never silently
  defaulted.

## 9. Dynamic-correlation boundary

| Value | Source | Lifetime | CSV status |
|-------|--------|----------|------------|
| Account key | Public workflow CSV | Stable VU mapping | Allowed |
| Email/password | Runtime-private credential file | Stable for one disposable runtime | Private only |
| Search term/expected name | Public workflow CSV | Stable VU mapping | Allowed |
| Shipping address | Public workflow CSV | Stable VU mapping | Allowed |
| JWT | Successful login response | Current iteration only | **Forbidden in CSV** |
| Authenticated user ID | Successful login response | Current iteration assertions | **Forbidden in CSV** |
| Product ID | Search response | Current iteration only | **Forbidden in CSV** |
| Product price | Validated product-detail response | Current iteration only | **Forbidden in CSV** |
| Checkout total | Validated normalized product-detail price | Current iteration only | **Forbidden in CSV** |
| Order ID | Checkout response | Current iteration only | **Forbidden in CSV** |

```text
public account_key ──join──> private email/password
        │                         │
        │                         └─ login ──> JWT + user ID
        └─ search term ──> search response ──> product ID
                                             └─ detail ──> validated price
public address + validated price + JWT ──> checkout ──> new order ID
new order ID ──> verify pending ──> wait 0.5–1.0 s ──> cancel
             └──────────────────────────────────────────> verify canceled
```

Every response-owned value is local to the iteration. Missing or invalid
correlation stops the iteration without a static, previous-iteration, global,
or cross-VU fallback.

## 10. Secret handling and proposed ignore rules

The approved repository `.gitignore` now contains only these narrow rules:

```gitignore
# HW05 runtime-local credentials and secret configuration only
/performance/data/credentials.local.csv
/performance/data/credentials.local.json
/performance/.env.local
/performance/secrets/
```

These applied rules deliberately do **not** ignore:

- `performance/data/workflow.csv`;
- safe `*.example.csv` templates;
- Load/Stress/Spike plans;
- required raw results or HTML reports;
- screenshots, hardware evidence, or other submission artifacts.

Before generating any secret, the later procedure must verify the chosen local
path is ignored and untracked. It must also scan staged changes for private
paths and high-confidence secret patterns. Passwords/JWTs must not appear in
request names, tags, check names, logs, errors, summaries, screenshots, shell
history, command arguments, or audit records. Error messages identify only the
non-secret `account_key`.

The preferred runtime-private path outside the repository reduces reliance on
ignore rules; the applied rules remain defense in depth for an explicitly
approved local fallback.

## 11. Deterministic scenario preconditioning

Every official Load, Stress, and Spike scenario begins from the same ordered
state contract:

1. prior evidence preserved under unique timestamps;
2. fresh clone at the approved commit in a unique disposable directory;
3. original database hash recorded and unchanged;
4. unmodified disposable backend started with exact PID/port ownership;
5. clone-local reset verified: two seed users, expected five products, zero
   orders, zero coupon usage, integrity `ok`;
6. the same 20 public workflow rows validated;
7. 20 runtime-private credentials generated and 20 customers registered
   sequentially as setup;
8. exactly 20 unique new `user` accounts and valid logins verified, with all
   accounts unlocked and zero orders;
9. VU/account/row mapping manifest recorded without secrets;
10. measured capture begins only after setup completes;
11. after execution, raw evidence is preserved before any reset and the
    original database hash/integrity is reverified.

The runtime is not reused between official scenarios. Account IDs returned by
registration may differ and are validation evidence, not CSV inputs. Public
keys and identities remain deterministic, while passwords and later JWT/order
IDs remain private/dynamic.

## 12. Phase C human-review result and remaining implementation approvals

The student approved the five-column public schema, 20-row dataset, private
schema, deterministic identities, secure runtime-only passwords, separate
preconditioning architecture, 20-account validation, VU mapping, product
rotation, dynamic-correlation boundary, ignore rules, and equivalent scenario
preconditioning. Quantity was removed after the required contract validation.
H-033 is therefore `DONE BY HUMAN`.

Still requiring later explicit approval:

1. the actual provisioning helper and its code review;
2. every real provisioning/preflight execution;
3. any future change to the five product rows, addresses, account count, or
   schemas;
4. k6 installation and all final script/performance executions.

Phase C does not authorize k6 installation, account provisioning, final script
generation, SUT execution, performance tests, or performance thresholds.
