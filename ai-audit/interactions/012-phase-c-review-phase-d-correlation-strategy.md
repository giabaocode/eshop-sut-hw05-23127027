# Interaction 012 — Phase C Human Review and Phase D Correlation Strategy

## AI tool

Codex CLI

## Date/time

- Session evidence recorded: 2026-09-01 16:15:12 +07
- Documentation/validation completed: 2026-09-01 16:19:22 +07
- Time zone: Asia/Ho_Chi_Minh
- Phase: Phase C correction/finalization followed by PHASE D — Authentication
  and Dynamic Correlation Strategy

## Human prompt/instruction — preserved verbatim

> Phase C — Test-Data Strategy has been reviewed by me.
>
> I approve the overall design with the HUMAN decisions and corrections below.
>
> Please preserve:
> - the original AI proposal,
> - my human review,
> - the final approved Phase C decisions.
>
> Mark H-033 DONE BY HUMAN only after applying these corrections.
>
> ============================================================
> 1. PUBLIC DATA SCHEMA — APPROVED WITH ONE VALIDATION
> ============================================================
>
> Approve the general committed non-secret schema:
>
> row_id
> account_key
> search_term
> expected_product_name
> shipping_address
>
> Regarding:
>
> quantity
>
> Do NOT keep this field merely because it is common in e-commerce tests.
>
> First verify against the already source/runtime-verified WF-03 request
> contract whether quantity is actually:
>
> - submitted to an API,
> - used to calculate the checkout total,
> - or otherwise used by the executable workflow.
>
> If quantity has no real effect on WF-03, remove it from the public CSV.
>
> If it is genuinely used, keep it and document exactly where.
>
> Do not introduce artificial test data that is ignored by the SUT.
>
> ============================================================
> 2. PUBLIC DATASET — HUMAN APPROVAL
> ============================================================
>
> Approve creation of 20 deterministic non-secret rows:
>
> wf03-customer-01
> through
> wf03-customer-20
>
> Each row may contain:
>
> - account_key
> - reviewed allowlisted search term
> - exact expected seeded-product name
> - deterministic synthetic shipping address
> - any other field proven necessary by WF-03
>
> Product/search rows may rotate across the five seeded products.
>
> Product IDs must NOT be stored as the authoritative test input.
>
> The real productId must continue to be extracted dynamically from the search
> response.
>
> ============================================================
> 3. PRIVATE CREDENTIAL SCHEMA — APPROVED
> ============================================================
>
> Approve the private runtime credential schema:
>
> account_key,email,password,expected_role
>
> Approve deterministic email identity:
>
> hw05-23127027-wf03-customer-NN@example.test
>
> Passwords:
>
> - must be generated at provisioning time from a secure local source,
> - must not be committed,
> - must not appear in AI Audit output,
> - must not appear in screenshots or reports,
> - must not be printed to terminal unless strictly required.
>
> The credential file must remain runtime-private.
>
> ============================================================
> 4. ACCOUNT PROVISIONING — APPROVED WITH IMPORTANT CORRECTION
> ============================================================
>
> Approve provisioning up to 20 dedicated customer test accounts using the real
> SUT registration behavior inside each fresh disposable runtime.
>
> However:
>
> ACCOUNT PROVISIONING MUST NOT CONTAMINATE OFFICIAL WF-03 PERFORMANCE METRICS.
>
> Therefore design provisioning as a distinct PRECONDITIONING operation that
> finishes BEFORE the official measured k6 scenario begins.
>
> Preferred architecture:
>
> Fresh disposable runtime
> → reset/seed verification
> → provision accounts
> → validate accounts
> → verify zero/comparable starting order state
> → finish setup
> → start official k6 measured execution
>
> Do not include registration traffic in the official WF-03 Load/Stress/Spike
> measurement stream.
>
> If a future implementation uses k6 for provisioning, its output/results must
> be completely separate from the official scenario result artifacts and must
> not contaminate the scenario metrics.
>
> A separate deterministic helper/preflight mechanism is preferable.
>
> Do NOT provision the accounts yet.
>
> ============================================================
> 5. ACCOUNT VALIDATION — APPROVED
> ============================================================
>
> Before an official run, require verification that:
>
> - exactly 20 required accounts exist for a 20-VU-capable run,
> - all have role=user,
> - all are unlocked,
> - all credentials successfully authenticate,
> - the account_key mapping is complete,
> - starting order state is comparable,
> - database integrity is valid.
>
> For Load with 5 VUs, only accounts 01..05 will actively participate.
>
> Stress/Spike must have the complete 20-account pool available before starting.
>
> If the pool is incomplete:
>
> FAIL PREFLIGHT.
>
> Do NOT:
> - silently share accounts,
> - modulo-wrap accounts,
> - lower workload automatically,
> - fabricate missing accounts.
>
> ============================================================
> 6. VU → ACCOUNT MAPPING — APPROVED
> ============================================================
>
> Approve deterministic dedicated mapping:
>
> VU 1  → wf03-customer-01
> ...
> VU 20 → wf03-customer-20
>
> No random account reassignment.
>
> No cross-VU account sharing during an official run.
>
> When implementing this later in k6, use an appropriate k6 execution/VU
> identifier that is reliable for the local single-instance execution model.
>
> Validate the identifier range before indexing test data.
>
> If a VU cannot obtain its dedicated account:
>
> fail safely rather than falling back to another account.
>
> ============================================================
> 7. DYNAMIC CORRELATION — APPROVED
> ============================================================
>
> The following MUST remain runtime-correlated and must never be authoritative
> CSV/static values:
>
> JWT
> authenticated user ID
> productId
> product price
> derived checkout total
> orderId
>
> The chain remains:
>
> credential
> → JWT
> → search response
> → productId
> → product detail
> → price
> → checkout
> → orderId
> → pending verification
> → cancellation
> → canceled verification
>
> Never use:
> - previous-iteration IDs
> - static fallback IDs
> - another VU's values
>
> ============================================================
> 8. SECRET HANDLING / .GITIGNORE — APPROVED
> ============================================================
>
> Approve narrow ignore rules for private performance-test material such as:
>
> /performance/data/credentials.local.csv
> /performance/data/credentials.local.json
> /performance/.env.local
> /performance/secrets/
>
> Do not use broad patterns that could accidentally hide required homework
> evidence.
>
> Public workflow CSV/template files must remain trackable.
>
> Raw results, reports, evidence, screenshots, and required homework artifacts
> must not be hidden merely for convenience.
>
> ============================================================
> 9. SCENARIO PRECONDITIONING — APPROVED
> ============================================================
>
> Approve the deterministic sequence:
>
> preserve previous evidence
> → fresh commit-pinned disposable clone
> → verified clone-local reset
> → verify original repository integrity
> → provision 20 dedicated accounts
> → validate account pool
> → validate public manifest
> → verify comparable initial application state
> → begin official measured scenario
> → preserve results/evidence
> → stop runtime
> → verify original repository integrity
>
> Load, Stress, and Spike must use equivalent preconditioning.
>
> ============================================================
> 10. SAFE ARTIFACT CREATION
> ============================================================
>
> You may now create:
>
> performance/data/workflow.csv
>
> with the reviewed 20 non-secret rows.
>
> You may create:
>
> performance/data/credentials.template.csv
>
> containing headers/example placeholders ONLY, never real passwords.
>
> You may apply the approved narrow .gitignore rules.
>
> Create/update:
>
> performance/data/README.md
> docs/test-data-strategy.md
> docs/human-decisions.md
> ai-audit/audit.md
> MANUAL-TODO.md
>
> Create the appropriate detailed AI Audit interaction.
>
> Do NOT create a real credential file yet.
>
> Do NOT provision accounts yet.
>
> ============================================================
> 11. PROCEED TO PHASE D
> ============================================================
>
> After applying Phase C human corrections, proceed to:
>
> PHASE D — Authentication and Dynamic Correlation Strategy
>
> Do NOT install k6.
> Do NOT run the SUT.
> Do NOT provision accounts.
> Do NOT execute performance tests.
> Do NOT generate the final Load/Stress/Spike scripts yet.
>
> For Phase D, formally design how the future shared WF-03 implementation will
> handle:
>
> 1. VU-specific credential lookup
> 2. login request
> 3. JWT extraction and validation
> 4. Authorization header construction
> 5. product search
> 6. product selection
> 7. productId correlation
> 8. product-detail validation
> 9. price extraction and validation
> 10. checkout payload creation
> 11. orderId extraction
> 12. pending-state verification
> 13. think time before cancellation
> 14. cancellation using the same orderId
> 15. canceled-state verification
> 16. fail-fast behavior at every correlation boundary
> 17. isolation of state between VUs and iterations
>
> For every dynamic value specify:
>
> SOURCE
> VALIDATION
> LIFETIME
> OWNER
> FAILURE BEHAVIOR
>
> For example:
>
> JWT:
> Source = login response
> Owner = current VU/current iteration
> No global fallback
> Failure = abort current iteration safely
>
> Do not use global mutable correlation state.
>
> Also design tagging/grouping so later metrics can distinguish:
>
> login
> search
> detail
> checkout
> pending probe
> cancellation
> final probe
>
> without changing the business workflow.
>
> Create:
>
> docs/correlation-strategy.md
>
> At the end show:
>
> A. Phase C correction result
> B. Final safe data artifacts
> C. Correlation chain
> D. Per-value ownership/lifetime
> E. Failure behavior
> F. VU isolation strategy
> G. Metric/tagging strategy
> H. Remaining human decisions
> I. Proposed Phase E
>
> Then print:
>
> ============================================================
> HUMAN CHECKPOINT REQUIRED — CORRELATION STRATEGY REVIEW
> ============================================================
>
> STOP.
>
> Do not install k6.
> Do not provision accounts.
> Do not generate final performance scripts.
> Do not execute performance testing.

## Quantity validation result

Quantity has no real effect on the selected executable WF-03 contract:

- `POST /api/checkout` reads only `total_amount` and `shipping_address`;
- the selected WF-03 functional smoke sent those two fields only;
- its `total_amount` was the product-detail price;
- the selected flow contains no cart request or another quantity consumer.

The AI-proposed quantity column was therefore removed rather than preserved as
artificial ignored data. The earlier proposal remains in Interaction 011 and
the historical Phase A section.

## Relevant actual AI output

Codex created and validated the human-authorized safe artifacts:

- `performance/data/workflow.csv`: exact five-column header and 20 deterministic
  public rows with unique row/account keys, five-product rotation, and synthetic
  addresses;
- `performance/data/credentials.template.csv`: exact private-schema header and
  one non-authenticatable placeholder row;
- `performance/data/README.md`: public/private/dynamic boundary;
- root `.gitignore`: only the four approved private paths.

Codex marked H-033 `DONE BY HUMAN` only after the corrections were applied and
the CSV count/schema/mapping, template placeholder, ignore rules, and public-file
trackability passed automated checks. The first attempt to check several public
paths with `git check-ignore --quiet` produced Git's genuine “--quiet is only
valid with a single pathname” error; each file was then checked individually
and passed. No failure was hidden.

For Phase D, Codex read official Grafana k6 documentation and selected future
`exec.vu.idInTest` as the proposed one-based mapping identifier because it is
test-wide unique. No k6 installation or execution occurred. The correlation
strategy defines all seven requests, four approved think times, dynamic value
source/validation/lifetime/owner/failure behavior, strict state transitions,
no global mutable correlation, stable low-cardinality groups/tags, and
secret-safe diagnostics.

## Files created

- `.gitignore`
- `performance/data/workflow.csv`
- `performance/data/credentials.template.csv`
- `performance/data/README.md`
- `docs/correlation-strategy.md`
- `ai-audit/interactions/012-phase-c-review-phase-d-correlation-strategy.md`

## Files modified

- `docs/test-data-strategy.md`
- `docs/selected-workflow-specification.md`
- `docs/CODEX-RESUME-CHECKPOINT.md`
- `docs/human-decisions.md`
- `ai-audit/audit.md`
- `MANUAL-TODO.md`

## Human-review status

- Phase C: **DONE BY HUMAN** after corrections and validation; H-033 complete.
- Phase D: `WAITING FOR HUMAN`; H-034 must remain open until explicit review.

## Prohibited-action boundary

No real credential file/password/JWT, account provisioning, SUT process, HTTP
request, database mutation, k6 installation/run, final performance script,
performance result, screenshot, report, commit, push, or publication was
created/performed.
