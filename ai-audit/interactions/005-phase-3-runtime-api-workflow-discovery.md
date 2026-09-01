# Interaction 005 — Phase 3 Runtime API Verification and Workflow Discovery

## AI tool

Codex CLI

## Date/time

- Started: 2026-09-01 12:37:51 +07 (Asia/Ho_Chi_Minh)
- Runtime stopped/integrity checked: 2026-09-01 12:42:32 +07
- Documentation completed: 2026-09-01 12:48:22 +07

## Human prompt/instruction — preserved verbatim

> Phase 2B reviewed and approved.
>
> The runtime verification evidence is accepted.
>
> Proceed to PHASE 3 — Controlled Runtime API Verification and Workflow Discovery.
>
> My group contains 4 students.
>
> The goal of this phase is to verify the minimum real API behavior needed to
> make an informed workflow choice, then propose enough genuinely distinct
> workflow candidates for the group.
>
> Do NOT install k6 yet.
> Do NOT perform Load, Stress, Spike, or endurance testing.
> Do NOT modify my original HW05 repository database.
> Do NOT push or commit yet unless explicitly instructed later.
>
> ============================================================
> PART A — CONTROLLED RUNTIME API VERIFICATION
> ============================================================
>
> Use ONLY the approved disposable runtime strategy under /private/tmp.
>
> You MAY restart/recreate the disposable clone if necessary.
>
> All mutations must remain confined to the disposable clone/database.
>
> Before execution:
>
> 1. Record:
>    - temporary clone path
>    - source commit
>    - temporary database hash/state
>    - original HW05 database hash
>    - port 3000 state
>
> 2. Ensure the original HW05 repository remains untouched.
>
> Perform a MINIMAL functional verification of the API building blocks needed
> for workflow selection.
>
> Verify, using actual HTTP requests and real responses:
>
> A. AUTH-HEAVY
>
> - successful login using a known valid seeded/test account
> - actual HTTP status
> - actual response structure
> - JWT/token field
> - Authorization: Bearer behavior on one protected endpoint
>
> Do NOT intentionally test failed-login lockout yet.
> Do NOT deliberately lock an account.
>
> B. READ-HEAVY
>
> Verify at least:
>
> - product list/search
> - product detail
>
> Capture:
>
> - exact request
> - actual status
> - actual response structure
> - how product ID is obtained/correlated
>
> Optionally verify category browsing if it could produce a genuinely distinct
> workflow.
>
> C. TRANSACTIONAL
>
> Perform only the minimum controlled transactions needed to determine whether
> candidate workflows are actually usable.
>
> Where supported, verify:
>
> - backend cart append/add
> - backend cart read
> - checkout/order creation
> - order history/detail
>
> Use the disposable database only.
>
> For each mutation record:
>
> - state before
> - exact request
> - exact response/status
> - state after
> - IDs created/correlated
> - repeatability implications
>
> Do not perform high-volume or concurrent requests.
>
> D. OPTIONAL COUPON PATH
>
> If coupons appear useful for a genuinely distinct workflow candidate, verify
> the minimum necessary behavior for:
>
> - coupon application
> - usage recording
>
> Keep these operations minimal.
>
> Do not force coupon use merely to create another workflow.
>
> ============================================================
> RUNTIME EVIDENCE RULE
> ============================================================
>
> For every endpoint tested, distinguish:
>
> SOURCE-VERIFIED
> RUNTIME-VERIFIED
> NOT YET VERIFIED
>
> Do not hide discrepancies between source expectations and runtime results.
>
> If runtime behavior differs from source expectations, preserve the raw
> observation.
>
> Do not automatically call it a bug.
>
> ============================================================
> PART B — WORKFLOW DISCOVERY
> ============================================================
>
> After the minimum runtime verification is complete, propose AT LEAST 5 and
> preferably 6 genuinely distinct E2E workflow candidates.
>
> These candidates are intended for a group of 4 students.
>
> Every candidate MUST:
>
> 1. cover AUTH-HEAVY,
> 2. cover READ-HEAVY,
> 3. cover TRANSACTIONAL,
> 4. be based on source-backed endpoints,
> 5. preferably use runtime-verified behavior,
> 6. be usable as the SAME workflow for:
>    - Load
>    - Stress
>    - Spike,
> 7. be compatible with data-driven k6 testing,
> 8. be sufficiently distinct from the other candidates.
>
> Do NOT create fake differences such as:
>
> Workflow A:
> Login → Search → Detail → Cart → Checkout
>
> Workflow B:
> Login → Search → Detail → Cart → Checkout with quantity=2
>
> Those should normally be considered the same workflow family.
>
> The differences must be meaningful at the workflow/business-process level.
>
> ============================================================
> FOR EACH WORKFLOW CANDIDATE
> ============================================================
>
> Provide:
>
> Workflow ID:
> Short name:
>
> Sequence:
> Step 1 → Step 2 → Step 3 → ...
>
> Exact endpoints:
> - method
> - route
>
> Coverage:
> - Auth-heavy:
> - Read-heavy:
> - Transactional:
>
> Runtime verification status:
> - which steps are runtime verified
> - which are source-only
>
> Correlation required:
> - JWT
> - product ID
> - cart data
> - order ID
> - coupon/etc.
>
> CSV/test data required:
>
> Database/state mutations:
>
> Repeatability:
>
> Concurrency risks:
>
> Account-lockout risk:
>
> Data exhaustion risk:
>
> Cleanup/reset needs:
>
> Suitability for k6:
>
> Load-test suitability:
>
> Stress-test suitability:
>
> Spike-test suitability:
>
> Expected implementation difficulty:
> EASY / MEDIUM / HARD
>
> Potential homework risk:
>
> Why this workflow is genuinely different from the other candidates:
>
> ============================================================
> RANKING
> ============================================================
>
> Create a comparison table:
>
> | Candidate | Workflow summary | Auth | Read | Transaction | k6 difficulty | Concurrency risk | Repeatability | Recommended? |
> |-----------|------------------|------|------|-------------|---------------|------------------|---------------|--------------|
>
> Then provide:
>
> 1. BEST TECHNICAL CHOICE
> 2. EASIEST TO IMPLEMENT
> 3. BEST FOR INTERESTING PERFORMANCE ANALYSIS
> 4. LOWEST-RISK CHOICE
> 5. WORKFLOWS TO AVOID AND WHY
>
> These are AI recommendations only.
>
> DO NOT choose the final workflow for me.
>
> ============================================================
> GROUP COORDINATION OUTPUT
> ============================================================
>
> Also create a short shareable table I can send to my 3 teammates:
>
> | Candidate | Short workflow | Difficulty | Key distinction | Taken by |
> |-----------|----------------|------------|-----------------|----------|
>
> Leave "Taken by" blank.
>
> The purpose is for our 4-person group to assign different workflows.
>
> ============================================================
> FILES
> ============================================================
>
> Create/update:
>
> docs/runtime-api-verification.md
> docs/workflow-candidates.md
> ai-audit/audit.md
> MANUAL-TODO.md
>
> Create an interaction record for this exact Phase 3 instruction under:
>
> ai-audit/interactions/
>
> Preserve the actual human instruction and relevant actual AI output according
> to the HW05 AI Audit requirements.
>
> ============================================================
> INTEGRITY CHECK
> ============================================================
>
> At the end:
>
> 1. stop the disposable backend cleanly,
> 2. verify port 3000 is free,
> 3. verify the original HW05 database hash is unchanged,
> 4. verify the original HW05 backend/source was not mutated,
> 5. preserve all important observations in repository-local documentation.
>
> ============================================================
> STOP CONDITION
> ============================================================
>
> At the end print:
>
> ============================================================
> HUMAN CHECKPOINT REQUIRED — WORKFLOW SELECTION
> ============================================================
>
> Show:
>
> A. Runtime API verification summary
> B. Any source-vs-runtime discrepancies
> C. 5–6 workflow candidates
> D. Comparison/ranking
> E. Group coordination table
> F. Your recommended candidate and reasoning
> G. Risks of each candidate
> H. Original repository integrity result
>
> Then STOP.
>
> Do NOT:
> - select the final workflow
> - install k6
> - create final Load/Stress/Spike scripts
> - perform performance testing
>
> I will review the candidates, coordinate with my three teammates, and select
> the final workflow myself.

## Relevant actual AI output

Codex reused the approved disposable clone at
`/private/tmp/eshop-hw05-sut.jxn8Wd/repo`, verified its commit and pre-state,
then ran the unmodified backend as PID 10568. The clone was reseeded; the
original checkout was never the server working directory.

The minimal sequential API run used a seeded customer and observed actual HTTP
200 responses for login, Bearer-authenticated profile, product search/list,
correlated product detail, categories, empty cart, cart append/read, coupon
list, fixed coupon application, checkout, coupon-usage recording, order history,
and order detail. Dynamic correlations were user ID 2, product ID 1, coupon ID
2, final amount 29,950,000, and order ID 1. JWT and password values were
redacted from stored output.

State changed only in the disposable runtime: orders `0 → 1`, coupon usages
`0 → 1`, and the in-memory cart `[] → [one item]`. A post-checkout cart read
showed that the item remained. The order persisted the submitted discounted
amount although the retained cart item had the original price. Coupon apply
and order detail both succeeded without Authorization, matching middleware
placement in source. These are observations, not automatic defect labels.

PID 10568 was stopped with SIGTERM; its execution session exited 143, the port
became free, and clone SQLite integrity was `ok`. The original database hash
remained
`c63f00544180ba1fbb1427a9b9dd3f1784842698809972f33ce90482e7420ba6`,
the original backend stayed clean, original `node_modules` remained absent,
and k6 remained uninstalled.

Codex proposed six distinct families: server-cart purchase, coupon redemption,
purchase/cancellation, signup-to-first-purchase, catalog import, and
customer-to-admin fulfillment. It recommends WF-03 technically, subject to a
future single cancellation smoke verification, but does not select it.

## Files created

- `docs/runtime-api-verification.md`
- `docs/workflow-candidates.md`
- `ai-audit/interactions/005-phase-3-runtime-api-workflow-discovery.md`

## Files modified

- `ai-audit/audit.md`
- `MANUAL-TODO.md`

## Commands/actions and safety record

- Read source and earlier discovery/startup evidence.
- Rechecked original/temp commits, hashes, counts, account state, dependencies,
  backend status, and port availability.
- Started unmodified `node server.js` only in the temp clone.
- Used sequential `curl` requests with Node solely for JSON extraction/redaction.
- Used `sqlite3 -readonly` before/after for counts, rows, and integrity.
- Used `lsof` for exact PID, working directory, and listener evidence.
- Sent SIGTERM only to PID 10568 and verified shutdown/integrity.

No failed-login experiment, account lock, source patch, original-database
initialization, concurrent/high-volume request, k6 action, Load/Stress/Spike/
endurance execution, system-wide install, commit, push, issue publication, or
workflow selection occurred.

## Human-review status

`WAITING FOR HUMAN` — the student must review the Phase 3 evidence, coordinate
with three teammates, confirm uniqueness, and explicitly select a candidate.
No corrections had been requested when this record was written.
