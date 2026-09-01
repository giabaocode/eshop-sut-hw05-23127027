# Interaction 013 — Phase D review and Phase E checks, metrics, safety, and reports

## Interaction metadata

| Field | Actual record |
|-------|---------------|
| AI tool | Codex CLI |
| Date/time recorded | 2026-09-01 16:29:28 +07 (Asia/Ho_Chi_Minh) |
| Student / human reviewer | 23127027 — Phạm Ngọc Gia Bảo |
| Phase | Phase D human correction/finalization; Phase E design |
| Execution boundary | Documentation and safe read-only verification only |
| Documentation completed | 2026-09-01 16:33:23 +07 |

## Actual human prompt

The following is the actual instruction supplied for this interaction. It is preserved verbatim rather than reconstructed from a previous context window.

```text
Phase D — Authentication and Dynamic Correlation Strategy has been reviewed.

I approve the overall correlation design with the HUMAN decisions and
corrections below.

Please preserve:
- the original AI proposal,
- my human review,
- the resulting final Phase D decision.

Mark H-034 DONE BY HUMAN only after these decisions are applied.

============================================================
1. exec.vu.idInTest — APPROVED WITH GUARD
============================================================

Approve exec.vu.idInTest for deterministic VU-to-account mapping for the
current design, where each official Load/Stress/Spike run is executed as a
separate local k6 test and supports at most 20 concurrent VUs.

Mapping:

VU 1  → wf03-customer-01
...
VU 20 → wf03-customer-20

Required guard:

Before indexing the workflow/credential data, validate that:

1 <= exec.vu.idInTest <= number of available approved rows

If the VU identifier is outside the available data range:

- fail safely,
- produce a clear setup/data error,
- do NOT modulo-wrap,
- do NOT randomly reuse another account,
- do NOT fall back to account 01.

Document the assumption that official scenarios are run separately.

If future execution structure changes, this mapping must be re-reviewed.

============================================================
2. EXACT PRODUCT MATCH — APPROVED
============================================================

Require exactly one expected product-name match in the search response.

Do not silently select:

- the first arbitrary product,
- a partial ambiguous match,
- a fallback seeded product.

The sequence remains:

search_term from public data
→ search response
→ exact expected_product_name match
→ extract that productId
→ GET product detail
→ verify same productId
→ extract/validate price

If zero or multiple exact expected matches exist:

fail the current iteration safely.

============================================================
3. POST-CHECKOUT FAIL-FAST — APPROVED
============================================================

After checkout succeeds and an orderId has been created, any failure in:

- pending verification,
- cancellation,
- canceled verification

must remain visible as an incomplete lifecycle.

Do NOT:

- replace the order ID,
- retry cancellation against a different order,
- directly modify SQLite to clean it,
- hide the resulting pending/unknown order.

Record the relevant business/lifecycle failure metric.

The residual order is legitimate execution evidence.

============================================================
4. AUTHENTICATION FAILURE POLICY — HUMAN CORRECTION
============================================================

Correct the previous AI proposal that the first unexpected login 401/403
should automatically abort the entire test.

New approved policy:

For a single unexpected authentication failure using a previously validated
credential:

- mark the current iteration as failed,
- record the authentication failure,
- do not continue Search/Detail/Checkout/Cancel for that iteration,
- do not retry with guessed or alternative credentials.

Do NOT automatically abort the entire official test on the first isolated
401/403.

Reason:
During Stress/Spike, an unexpected authentication failure may itself be an
important observed degradation/error. Immediately terminating the entire test
could hide useful real execution evidence.

A TEST-LEVEL SAFETY ABORT remains appropriate when there is clear evidence of
a dangerous or invalid execution condition, for example:

- confirmed account-lockout behavior,
- backend process death,
- port loss,
- unusable runtime environment,
- repeated systemic authentication failure indicating the test can no longer
  execute the intended workflow safely.

Do not invent a final numeric repeated-auth-failure cutoff yet.

That safety cutoff may be proposed in Phase E and reviewed again before
execution.

Distinguish:

ITERATION FAILURE
from
TEST-LEVEL SAFETY ABORT.

============================================================
5. TAGGING / GROUPING — APPROVED
============================================================

Approve stable step groups:

login
search
detail
checkout
pending_probe
cancellation
final_probe

Approve low-cardinality tags:

workflow=wf03
step=<stable step>
endpoint_group=auth|read|transactional
operation_role=business|verification
traffic=measured
scenario=<static scenario>

Do NOT put high-cardinality or sensitive values in tags, including:

email
password
JWT
userId
productId
orderId
shipping address
dynamic URL containing IDs

For dynamic endpoint paths, use stable endpoint names/tags rather than unique
order IDs in metric labels.

============================================================
6. CORRELATION LIFETIME — APPROVED
============================================================

Approve:

Credential/public row:
lifetime = dedicated input for current VU during the run

JWT:
lifetime = current iteration only

Authenticated user ID:
lifetime = current iteration only

Product ID/price:
lifetime = current iteration product-selection chain only

Order ID:
lifetime = current iteration order lifecycle only

No mutable response-derived correlation state may be module-global.

No value may leak from:
- another VU,
- previous iteration,
- failed lifecycle.

============================================================
7. PROCEED TO PHASE E
============================================================

After applying the Phase D human review, proceed to:

PHASE E — Checks, Custom Metrics, Safety Stops, and Report/Output Proposal

Do NOT install k6.
Do NOT execute the SUT.
Do NOT provision accounts.
Do NOT generate final scenario scripts.
Do NOT run performance tests.

============================================================
PHASE E — CHECK DESIGN
============================================================

Define exact stable checks for every executable step.

At minimum:

LOGIN
- HTTP status expected
- valid response body
- token exists and is non-empty
- authenticated identity is expected
- role is expected user

SEARCH
- expected HTTP status
- valid product array
- exactly one expected product-name match

DETAIL
- expected HTTP status
- returned ID equals correlated productId
- valid positive price
- expected product identity

CHECKOUT
- expected HTTP status
- success semantics
- valid newly created orderId

PENDING PROBE
- same correlated orderId
- correct authenticated owner where available
- expected amount/address where appropriate
- state = pending

CANCELLATION
- expected HTTP status
- successful cancellation semantics
- same orderId

FINAL PROBE
- same orderId
- state = canceled
- lifecycle invariants remain consistent

Do not rely on HTTP 200 alone.

============================================================
CUSTOM METRICS
============================================================

Design low-cardinality metrics covering:

Endpoint latency Trends:
- login
- search
- detail
- checkout
- pending probe
- cancellation
- final probe

Business/lifecycle metrics:
- workflow attempted
- workflow succeeded
- workflow failed
- auth failure
- search failure
- detail failure
- checkout failure
- pending verification failure
- cancellation failure
- final verification failure
- lifecycle success
- orders created
- orders canceled
- unexpected auth response

Define whether each should be:

Trend
Rate
Counter

Avoid redundant metrics where native k6 metrics already provide the same
information sufficiently.

Design exactly ONE final workflow outcome sample per attempted iteration so
success/failure rates are not accidentally double-counted.

============================================================
FAILURE TAXONOMY
============================================================

Separate failures into:

1. transport/protocol failure
2. authentication failure
3. correlation/data failure
4. business assertion failure
5. lifecycle failure
6. runtime/safety failure

Document how each affects:

- current iteration
- metrics
- later requests in that iteration
- possible test-level abort

============================================================
SAFETY STOP DESIGN
============================================================

Propose test-level operational safety-stop rules for review.

Important:

These are SAFETY GUARDRAILS, not final performance acceptance thresholds.

Include:

- backend process/port loss
- confirmed lockout
- unusable account pool
- catastrophic repeated transactional failures
- disk/runtime failure

Do NOT silently turn p95/RPS/error-rate goals into final homework performance
thresholds.

Do NOT reintroduce "abort entire test on first 401/403".

Any numeric abort condition proposed here remains HUMAN REVIEW REQUIRED.

============================================================
K6 OUTPUT / REPORT REQUIREMENT
============================================================

The homework contains an important k6/reporting issue that must remain
explicitly traceable.

The assignment says k6 users should provide equivalent distinct outputs for
the three distinct listener/report views.

However, the submission section also explicitly requests raw .jtl logs and
three HTML report folders.

Do NOT silently resolve this inconsistency.

For Phase E:

1. Quote/reference both requirements in local documentation.
2. Propose technically realistic k6 equivalents.
3. Identify what k6 can natively generate versus what requires report tooling.
4. Propose a defensible three-scenario distinct-output mapping.
5. Keep the final compliance decision marked UNRESOLVED if lecturer/TA
   clarification is still required.
6. Prepare a concise lecturer/TA clarification question.
7. Do not fabricate .jtl files by converting arbitrary data and pretending they
   are native JMeter output.

The final approach must preserve real raw k6 data.

============================================================
REPORT MAPPING PROPOSAL
============================================================

Create a candidate table:

| Scenario | Primary distinct view/output | Raw artifact | HTML/equivalent artifact | Tool/dependency | Compliance status |
|----------|------------------------------|--------------|--------------------------|-----------------|-------------------|

The three scenarios must not merely rename identical views.

Do not install new reporting dependencies yet.

============================================================
FILES
============================================================

Create:

docs/checks-metrics-safety.md
docs/report-output-mapping.md

Update:

docs/correlation-strategy.md
docs/human-decisions.md
ai-audit/audit.md
MANUAL-TODO.md

Create the detailed AI Audit interaction.

============================================================
STOP
============================================================

At the end show:

A. Phase D human-review result
B. Exact check specification
C. Custom-metric design
D. One-outcome-per-iteration design
E. Failure taxonomy
F. Safety-stop proposal
G. Three-report/output proposal
H. k6 versus .jtl/HTML compliance issue
I. Exact lecturer/TA clarification question
J. Remaining human decisions
K. Proposed next phase

Then print:

============================================================
HUMAN CHECKPOINT REQUIRED — CHECKS / METRICS / REPORT REVIEW
============================================================

STOP.

Do not install k6.
Do not generate final scripts.
Do not execute performance testing.
```

## Repository/context evidence actually read

- `docs/correlation-strategy.md`
- `docs/human-decisions.md`
- `docs/workload-model-proposal.md`
- `docs/CODEX-RESUME-CHECKPOINT.md`
- `docs/assignment-requirements.md`, especially T1-07, T1-14, and A-01
- `MANUAL-TODO.md`
- `ai-audit/audit.md`
- recent detailed Interaction 012
- current Git working-tree status

The assignment PDF had already been extracted and traced in
`docs/assignment-requirements.md`. An attempted read with local `pdftotext`
failed truthfully because `pdftotext` is not installed; no package was
installed to work around this.

Current official Grafana k6 documentation was read for real-time JSON/CSV
outputs, multiple outputs, the end-of-test/custom summary, and web-dashboard
HTML export. This was documentation research only; no k6 binary was installed
or run.

## Preserved proposal → review → final decision

| Topic | Original AI proposal | Human review | Resulting final Phase D decision |
|-------|----------------------|--------------|----------------------------------|
| VU mapping | Use one-based `exec.vu.idInTest` for slots 1..20 | Approved with actual-approved-row guard and separate-test assumption | Validate bounds before indexing; direct one-account mapping; fail with setup/data error; re-review if execution topology changes |
| Product selection | Exactly one exact expected-name match | Approved | Zero/multiple matches stop the iteration; no arbitrary/partial/fallback selection |
| Post-checkout failure | Stop and preserve residual state | Approved with explicit prohibitions | Record incomplete lifecycle and preserve residual order; no ID replacement, other-order cancel, SQL cleanup, or concealment |
| First unexpected login `401`/`403` | Whole-test authentication safety stop | Corrected by human | Fail and record only the current isolated iteration; whole-test abort only for confirmed lockout/systemic/runtime danger |
| Groups/tags/lifetimes | Seven stable groups, bounded tags, iteration-owned dynamic state | Approved | Becomes final Phase D design contract |

## Actual AI work/output

- Applied the human correction to `docs/correlation-strategy.md`, the Phase B
  guardrail history, and the resume checkpoint without erasing the original
  proposal.
- Recorded HD-007 and changed H-034 to `DONE BY HUMAN` only after the decisions
  were applied.
- Created `docs/checks-metrics-safety.md` with exact stable checks, native and
  minimal custom metrics, one-outcome finalization, six-class failure taxonomy,
  and explicitly review-required safety candidates.
- Created `docs/report-output-mapping.md` with both assignment clauses, current
  native k6 capabilities, a distinct three-scenario output proposal, authentic
  raw-data rules, two compliance paths, and the exact lecturer/TA question.
- Opened H-035 as the Phase E human checkpoint and left H-002 unresolved.
- Updated the resume checkpoint and summary audit to identify Phase D as
  complete/human-reviewed and Phase E as AI-designed/waiting.

## Safety and non-actions

- No SUT process was started and no HTTP request was sent.
- No account was provisioned and no credential/password/JWT was created or
  printed.
- No original or disposable database was modified.
- k6 and report dependencies were not installed or run.
- No final performance script, raw result, JTL, HTML result, screenshot,
  measurement, threshold result, issue, video, commit, or push was produced.
- No upstream operation occurred.

## Final read-only validation

- Git: `main` at `85af3ba`, tracking `origin/main`; `origin` and `upstream`
  URLs unchanged; `remote.pushDefault=origin`; no commit or push.
- Original database: SHA-256 remained
  `c63f00544180ba1fbb1427a9b9dd3f1784842698809972f33ce90482e7420ba6`.
- Runtime/tool: port 3000 had no listener and k6 was not installed.
- Public data: exact approved workflow header and 20 data rows.
- Private template: exact approved header and one placeholder-only example;
  no runtime credential file was found.
- Ignore rules: all four approved private paths are ignored; public workflow,
  credential-template, and README artifacts remain trackable.
- `git diff --check` reported no tracked diff error. The working tree's homework
  documentation/artifacts remain untracked at this repository baseline; this
  interaction did not commit them.

## Review state

- Phase D / H-034: **DONE BY HUMAN** after the correction was applied.
- Phase E / H-035: **WAITING FOR HUMAN**.
- k6 `.jtl`/HTML equivalence / H-002: **UNRESOLVED** pending lecturer/TA and
  human decision.
