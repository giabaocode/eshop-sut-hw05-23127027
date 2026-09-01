# Shared k6 Architecture and Static Implementation Review

Status: **PHASE F HUMAN-APPROVED — PINNED INIT VERIFIED; PILOT FAILED BEFORE HTTP**

Prepared: 2026-09-01 (Asia/Ho_Chi_Minh)
Workflow: WF-03 — Purchase followed by customer cancellation

During Phase F, no k6 binary was installed or executed. Phase G subsequently
installed pinned k6 2.2.0 and validated init/import/options/output interfaces
without SUT HTTP. The SUT was not started, no account was provisioned, and no
performance result was generated. JavaScript files remain draft until the
separately approved pilot verifies the SUT workflow.

### Phase F human-review result

The human approved the single shared WF-03 workflow, thin scenario entry points,
checks/metrics/outcome/failure implementation, dedicated VU mapping, immutable
input versus iteration-local correlation boundary, and current immediate safety
model. The four numeric error-abort proposals remain deferred and final
performance thresholds remain undefined. H-036 is `DONE BY HUMAN` only after
these decisions were applied. Pinned-runtime initialization compatibility is
now proven as recorded in `k6-toolchain.md`; business HTTP compatibility remains
unproven until the pilot.

## 1. Design invariants

1. Load, Stress, and Spike import the same `executeWf03()` function.
2. Scenario entry points contain only scenario selection, runtime/data init, and
   the call to that shared function.
3. Dynamic JWT/user/product/price/order state is created inside one invocation
   of `executeWf03()` and is never module-global.
4. Public and private rows are init-context, read-only inputs. Private secrets
   are loaded only from the ignored runtime file.
5. All dynamic IDs come from current real responses. There is no static,
   previous-iteration, modulo, alternate-account, or alternate-order fallback.
6. Exactly one attempted Counter and one guarded final outcome Rate sample are
   emitted for each valid attempted workflow.
7. No final performance threshold or deferred numeric error-abort rule appears
   in the draft options.
8. JTL/HTML handling is isolated from business code. H-002 is resolved by the
   human choice to use genuine distinct k6 equivalents; fake JMeter artifacts
   remain prohibited.

## 2. Repository structure

```text
performance/
├── config/
│   ├── workloads.js       # exact approved stage plans and safety metadata
│   ├── runtime.js         # approved-local-target and private-file contract
│   └── output.js          # conditional output proposal, no conversion
├── data/
│   ├── workflow.csv       # committed 20-row non-secret data
│   ├── credentials.template.csv
│   └── README.md
├── lib/
│   ├── csv.js             # dependency-free draft CSV parser/schema helper
│   ├── data.js            # SharedArray loading, joins, guards, VU binding
│   ├── auth.js            # login request/validation, no retained JWT state
│   ├── checks.js          # exact stable Phase E checks
│   ├── metrics.js         # approved native/custom metric support
│   └── workflow.js        # the sole authoritative WF-03 implementation
├── scenarios/
│   ├── load.js            # thin Load entry point
│   ├── stress.js          # thin Stress entry point
│   ├── spike.js           # thin Spike entry point
│   └── pilot.js           # non-official 2-VU preparation entry
└── tools/
    ├── README.md          # future runner/output boundary
    └── provision-accounts.mjs # guarded setup helper; never measured traffic
```

This is deliberately small. Authentication is isolated because it handles
private values; other single-use business steps remain visible in the shared
orchestrator so extra layers do not obscure the state machine. Checks, metrics,
data, configuration, output metadata, and business orchestration have
materially different responsibilities and are separated.

## 3. Execution/context model

### Init context

Each entry point:

1. selects one static workload;
2. validates `WF03_BASE_URL` against only `http://127.0.0.1:3000` or
   `http://localhost:3000`;
3. loads public and private CSV text through init-context `open()` callbacks;
4. parses them into `SharedArray` inputs;
5. validates schemas, row identities, uniqueness, active account count,
   deterministic email, non-placeholder password, and role;
6. exports the workload's `options` and `runWf03Scenario()` function.

Failure here prevents measured traffic. No credential value is included in
errors.

### VU/iteration context

At iteration start, `exec.vu.idInTest` is guarded against the scenario's
approved joined rows. The VU receives the same dedicated row on every
iteration. The workflow then creates a fresh local context holding:

```text
JWT, authenticated user ID,
product ID, normalized price,
order ID, outcome/failure guards,
lifecycle timestamps
```

That context disappears when the function returns. The only module-global k6
objects are metric definitions and immutable input/configuration. Metric
objects aggregate samples but never hold response correlation values.

The draft uses `SharedArray`, `open()`, and `exec.vu.idInTest` according to the
current official [data parameterization](https://grafana.com/docs/k6/latest/examples/data-parameterization/),
[`SharedArray`](https://grafana.com/docs/k6/latest/javascript-api/k6-data/sharedarray/),
and [`k6/execution`](https://grafana.com/docs/k6/latest/javascript-api/k6-execution/)
documentation. Compatibility remains unproven until a version is pinned and
the files are checked with that actual binary.

## 4. One authoritative WF-03 implementation

[`performance/lib/workflow.js`](../performance/lib/workflow.js) alone owns the
business sequence:

```text
Login
  → random 0.5–1.0 s
Search and require exactly one exact expected product
  → random 1.0–2.0 s
Detail and correlate ID/positive price
  → random 1.5–3.0 s
Checkout and extract new order ID
Pending probe for the same ID/user/amount/address and pending state
  → random 0.5–1.0 s
Cancel using the same JWT and order ID
Final probe for the same ID/user/amount/address and canceled state
```

Each stage is inside its approved stable `group()`. A failure records the first
terminal classification and returns without issuing later business requests.
Post-checkout residue remains untouched evidence. The `finally` path invokes
`emitOutcomeOnce()`; its local guard prevents duplicate final samples.

The three official scenario files contain no endpoint URL, check, think time, payload,
correlation rule, or lifecycle branch.

## 5. Workload configuration

All three use current planned `ramping-vus`, `gracefulRampDown=30s`, and
`gracefulStop=30s`. These are human-approved planning/safety inputs, not measured
capacity or performance thresholds. Current official executor semantics are
documented by [ramping VUs](https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/ramping-vus/).

### Load — scheduled 7 minutes; safety cap 8 minutes

| Duration | Target |
|---|---:|
| 1m | 5 |
| 5m | 5 |
| 1m | 0 |

Active dedicated mappings are accounts 01..05.

### Stress — exact scheduled 12m30s; safety cap 14 minutes

| Stage | Duration | Target |
|---:|---|---:|
| 1 | 30s | 2 |
| 2 | 1m | 2 |
| 3 | 1m | 5 |
| 4 | 1m | 5 |
| 5 | 1m | 10 |
| 6 | 1m | 10 |
| 7 | 1m | 15 |
| 8 | 1m | 15 |
| 9 | 1m | 20 |
| 10 | 1m | 20 |
| 11 | 1m | 5 |
| 12 | 1m | 5 |
| 13 | 1m | 0 |

All 20 dedicated accounts are required before execution. The 20-VU maximum is
a bounded planning input, not measured capacity.

### Spike — scheduled 6m5s; safety cap 7 minutes

| Stage | Duration | Target |
|---:|---|---:|
| Baseline ramp | 30s | 3 |
| Baseline | 2m | 3 |
| Sudden rise | 10s | 20 |
| Spike hold | 45s | 20 |
| Sudden fall | 10s | 3 |
| Recovery | 2m | 3 |
| Final ramp-down | 30s | 0 |

All 20 dedicated accounts are required before execution.

The wall-clock cap is retained as runner/preflight metadata because it is an
external operational limit, not silently represented as an unsupported
`ramping-vus` option.

## 6. Data and credential contract

| Input | Contract |
|---|---|
| Public CSV | Exact approved five-column schema and exactly 20 sequential rows |
| Private CSV | `account_key,email,password,expected_role`; runtime-private and ignored |
| Load join | Required keys 01..05 must each have exactly one valid credential |
| Stress/Spike join | Keys 01..20 must each have exactly one valid credential |
| VU binding | One-based direct array slot after `1 <= idInTest <= approvedRows.length` |
| Dynamic values | JWT/user ID/product ID/price/order ID only from the current response chain |

The draft rejects the credential template placeholder and never prints row
values. The future disposable preconditioning process still provisions and
validates accounts before measured execution; the draft scenario does not send
registration/preflight authentication traffic.

## 7. Checks and metrics

`checks.js` implements the exact Phase E names. It validates status, JSON shape,
business messages, auth identity/role/unlocked state, exact product selection,
correlated IDs, positive price, order owner/amount/address, and pending/canceled
states. HTTP 200 alone cannot pass a step.

`metrics.js` implements:

- Counters: `wf03_workflow_attempted`, `wf03_failures`,
  `wf03_unexpected_auth_response`, `wf03_orders_created`,
  `wf03_orders_canceled`;
- Rate: `wf03_workflow_success`;
- Trend: `wf03_lifecycle_duration`.

Native `http_req_duration`, `http_req_failed`, `http_reqs`, `iterations`,
`iteration_duration`, `checks`, `vus`, and `dropped_iterations` remain available
where k6 emits them. Endpoint latency is separated by the stable `name`/`step`
tags. The `url` system tag is explicitly excluded from options so dynamic order
paths cannot create high-cardinality series.

No email, password, JWT, user/product/order ID, address, response body, or
dynamic URL is a metric tag.

## 8. Failure and safety implementation

The first terminal failure receives one bounded `step` and `failure_class`
sample. Response/request diagnostics remain available through native metrics and
checks. An isolated unexpected login 401/403 fails only that iteration.

Implemented init/VU safety behavior in the draft:

- reject an unauthorized/non-local target;
- reject malformed/incomplete public or required credential data;
- reject placeholders, duplicate/mismatched mappings, and unsupported roles;
- abort safely if a VU identifier is outside approved rows;
- never retry or select fallback data.

External runtime safeguards—2 GiB disk, commit/database/PID/port checks,
confirmed lockout, evidence-write health, wall-clock cap, and exact process
ownership—belong to a later reviewed runner/preflight tool because k6 business
code cannot independently prove all of them.

The following are deliberately **not implemented**:

- five consecutive connection failures;
- five unexpected auth responses across two accounts;
- ten checkout/cancel 5xx responses;
- 20% failures across two 15-second windows;
- p95, RPS, allowed-error, or capacity thresholds.

The first four require controlled pilot/runtime evidence and new human review.

## 9. Output abstraction

`config/output.js` contains only scenario-to-output strategy metadata. It has no
JTL converter and is not imported by the business workflow. `tools/README.md`
defines the future runner boundary.

Current k6 documentation supports native [JSON output](https://grafana.com/docs/k6/latest/results-output/real-time/json/),
[CSV output](https://grafana.com/docs/k6/latest/results-output/real-time/csv/),
and [web-dashboard HTML export](https://grafana.com/docs/k6/latest/results-output/web-dashboard/).
H-002 is resolved by human interpretation of the PDF's k6-equivalent rule.
Final flags, packaging, and real-data report renderers can be implemented
without touching `executeWf03()`.

## 10. Static review findings

| Review target | Finding | Status / follow-up |
|---|---|---|
| Mutable global correlation | None found; response values exist only in local iteration context | Static pass |
| Secret leakage | No real credential file/value; errors are sanitized; private path remains ignored | Static pass; runtime logs still require observation |
| High-cardinality tags | Stable `name`/`step`; native `url` tag excluded; no dynamic IDs/addresses/accounts | Static pass; verify with pinned k6 output |
| Duplicate outcome | `outcomeEmitted` guard plus one `finally` call | Static pass; unit/runtime behavior unproven |
| Unsafe account fallback | No modulo/random/shared/default fallback; out-of-range aborts | Static pass |
| Static dynamic IDs | No JWT/product ID/price/order ID literal in source | Static pass |
| Scenario workflow consistency | All entries call the same exported function and contain no business endpoint; all endpoints remain in shared `lib/` code | Static pass |
| Missing failure paths | Every step returns after failed checks; an unexpected exception records one sanitized runtime/safety failure then rethrows; post-checkout residue is preserved | Static pass; real exception behavior needs pinned-runtime/pilot verification |
| Scenario-specific business logic | None; only config/runtime/data initialization differs | Static pass |
| CSV behavior | Parser handles quoted delimiters/newlines and escaped quotes in draft | Syntax/static only; validate with pinned k6 |
| `open()` path/API assumptions | Init callback and environment path are designed from current docs | **Runtime verification required** |
| `SharedArray`, `exec.test.abort`, JS feature support | Current documented APIs/design assumptions | **Pinned-version verification required** |
| External safety runner | Not implemented, preventing false claims about PID/port/disk/wall-clock enforcement | Required after static approval |
| Native/report outputs | Metadata only; no fake JTL; distinct real-data k6 equivalents selected | k6 2.2.0 JSON/CSV/summary/dashboard capability verified; real-data renderers pending |

### Phase G pinned-version addendum

k6 v2.2.0 successfully inspected all four entry files with synthetic private
input outside Git. The Load/Stress/Spike options retained exact approved stages;
the Pilot adds only a `0→2 / 30s`, `2 / 3m`, `2→0 / 30s` workload and calls the
same shared function. `k6 deps` resolved only built-in k6 modules and local
files; no custom build is required. A no-HTTP capability probe verified the
execution API, metric constructors, summary hook, JSON, CSV, and dashboard HTML.

The first Pilot inspection also showed that explicit k6 `-e` values are the
reliable reviewed invocation form for this setup. The first dashboard probe was
blocked from binding a sandbox-local port and was too short; a two-second
no-HTTP retry on an ephemeral local port succeeded. These are tool findings,
not SUT or performance evidence.

Pilot traffic uses `scenario=pilot,traffic=pilot`; official entries retain
`traffic=measured`. At the Phase G preparation checkpoint the provisioning
helper had not run; it later ran once under H-037 and passed setup validation.

### Pilot execution finding

H-037 later authorized one controlled Pilot. Provisioning passed, but k6 failed
before HTTP because all seven group labels contain the reserved `::` separator.
The generic catch then tight-looped runtime exceptions. No source fix or rerun
has occurred. The Pilot also proved custom metrics currently hard-code
`traffic=measured` rather than using `context.traffic`. Both fixes, deterministic
runtime-exception abort behavior, reliable exit/wall-clock capture, and output
scope require H-038 review. See `k6-pilot-results.md`.

Static findings plus pinned init probes now prove imports, option parsing, and
the listed local APIs/outputs. They do not verify HTTP contracts, credential
mapping against real accounts, output overhead under WF-03, or SUT behavior.

## 11. Human checkpoint and proposed next phase

H-036 is `DONE BY HUMAN`. The approval covers target restriction, active account
counts, exact checks, failure classification, system-tag selection, stage arrays,
and the unimplemented external runner boundary without claiming runtime proof.

After H-036, propose **Phase G — Pinned k6 Toolchain and Disposable 2-VU Pilot
Preparation**. Installation, account provisioning, SUT startup, and the actual
pilot must each remain separately authorized; no official Load/Stress/Spike run
should occur in that phase without a later explicit execution checkpoint.
