# Interaction 011 — Phase B Human Corrections and Phase C Test-Data Strategy

## AI tool

Codex CLI

## Date/time

- Human correction/instruction recorded: 2026-09-01 15:58:08 +07
- Documentation/validation completed: 2026-09-01 16:06:13 +07
- Time zone: Asia/Ho_Chi_Minh
- Phase: Phase B correction resolution followed by PHASE C — Test-Data Strategy

## Human prompt/instruction — preserved verbatim

> I have reviewed the two Phase B discrepancies.
>
> These are intentional NEW HUMAN CORRECTIONS and they supersede the older
> Phase B repository values.
>
> Please preserve both the previous AI/original values and these new human
> corrections in the audit trail. Do not erase the historical values.
>
> ============================================================
> HUMAN CORRECTION 1 — THINK TIME
> ============================================================
>
> Previous value:
> Pending-order verification → Cancellation = 0 seconds
>
> New human-approved planning value:
> Pending-order verification → Cancellation =
> random 0.5–1.0 seconds
>
> Reason:
> WF-03 represents a purchase-followed-by-cancellation lifecycle. A short pause
> is more defensible as user behavior than an instantaneous cancellation while
> remaining small enough to avoid creating a large pending-order backlog.
>
> This remains a planning value, not an empirically measured value.
>
> ============================================================
> HUMAN CORRECTION 2 — ACCOUNT STRATEGY
> ============================================================
>
> Previous value:
> One seeded customer account is the approved initial constraint.
>
> New human-approved design direction:
>
> Design the official data strategy so that up to 20 dedicated valid customer
> test accounts CAN be provisioned reproducibly inside each disposable runtime.
>
> Reason:
> The approved Stress and Spike models may reach 20 concurrent VUs. Using one
> shared account for all VUs would unnecessarily couple authentication/account
> state and increase lockout/shared-state risk.
>
> Important constraints:
>
> - Do NOT claim the 20 accounts already exist.
> - Do NOT provision them in this correction step.
> - Provisioning must occur only in the disposable runtime/database.
> - The original HW05 database must remain unchanged.
> - Credentials must never be committed to Git.
> - Account provisioning is test SETUP, not part of measured WF-03 traffic.
> - Prefer one dedicated account per active VU where practical.
> - If later runtime verification shows this strategy is inappropriate, stop for
>   human review rather than silently changing it.
>
> ============================================================
> UPDATE PHASE B RECORDS
> ============================================================
>
> Update the authoritative Phase B documentation so it clearly shows:
>
> OLD VALUE
> → HUMAN CORRECTION
> → CURRENT APPROVED PLANNING VALUE
>
> Do not rewrite history as if the old value never existed.
>
> Update:
>
> docs/workload-model-proposal.md
> docs/CODEX-RESUME-CHECKPOINT.md
> docs/human-decisions.md
> ai-audit/audit.md
> MANUAL-TODO.md
>
> Update/create the relevant detailed interaction record preserving this actual
> human instruction.
>
> Mark the discrepancy checkpoint resolved by human review.
>
> ============================================================
> THEN CONTINUE TO PHASE C — TEST-DATA STRATEGY
> ============================================================
>
> After applying the corrections, proceed to Phase C.
>
> Do NOT install k6.
> Do NOT run performance tests.
> Do NOT generate final Load/Stress/Spike scripts yet.
> Do NOT provision the accounts yet.
>
> For Phase C, design:
>
> A. COMMITTED NON-SECRET workflow data
> B. PRIVATE credential data
> C. reproducible provisioning for up to 20 customer test accounts
> D. deterministic VU-to-account mapping
> E. product/search data
> F. shipping address and quantity data
> G. dynamic-correlation boundary
> H. secret handling
> I. deterministic scenario preconditioning
>
> ============================================================
> DATA RULES
> ============================================================
>
> Dynamic runtime values MUST NOT be placed in CSV when they should be obtained
> from real responses:
>
> - JWT
> - productId
> - product price
> - orderId
>
> Credentials must be private and gitignored.
>
> Do not create a real committed credential file.
>
> For the 20-account design, determine:
>
> - account key format
> - deterministic email/username format
> - safe password-generation/handling strategy
> - provisioning API/setup mechanism supported by the real SUT
> - how provisioning avoids polluting measured performance traffic
> - one-account-per-VU mapping
> - behavior at Load 5 VUs
> - behavior at Stress 20 VUs
> - behavior at Spike 20 VUs
> - what happens if fewer than 20 valid accounts are available
>
> Do not fabricate accounts.
>
> ============================================================
> OUTPUT
> ============================================================
>
> Create:
>
> docs/test-data-strategy.md
>
> Create only safe templates/example schemas where appropriate.
>
> Propose .gitignore changes but ensure they do not hide required submission
> artifacts.
>
> Update the AI Audit.
>
> At the end show:
>
> A. Phase B correction result
> B. Public/non-secret data schema
> C. Private credential schema
> D. Account provisioning design
> E. VU/account mapping
> F. Product/search strategy
> G. Dynamic-correlation boundary
> H. Secret-handling strategy
> I. Scenario preconditioning
> J. Remaining human decisions
>
> Then print:
>
> ============================================================
> HUMAN CHECKPOINT REQUIRED — TEST DATA REVIEW
> ============================================================
>
> STOP.
>
> Do not install k6.
> Do not provision accounts yet.
> Do not generate final performance scripts.
> Do not execute performance tests.

## Relevant actual AI output

Codex recorded HD-005 and resolved the prior discrepancy checkpoint without
deleting the original `0 s`/single-account values. The workload proposal and
resume checkpoint now show OLD VALUE → HUMAN CORRECTION → CURRENT APPROVED
PLANNING VALUE. The corrected total intentional think time is 3.5–7 seconds;
derived Phase B model estimates were recalculated and remain explicitly
unmeasured, while the historical calculation remains in Interaction 008.

Codex inspected the actual registration route and disposable database schema.
It found that `POST /api/register` inserts `name`, `email`, and `password` and
that the database defaults role to `user`. It also preserved relevant risks:
email is not unique, registration lacks validation, passwords are stored plain
text in this teaching SUT, and backend startup resets its database.

Codex created `docs/test-data-strategy.md` with:

- a planned committed 20-row non-secret workflow CSV schema;
- a runtime-private credential schema and narrow proposed ignore rules;
- deterministic keys/names/reserved-domain emails plus fresh random passwords;
- sequential disposable-runtime registration as excluded setup traffic;
- exact validation for 20 unique unlocked users and zero orders;
- direct VU 1..20 → account/row 01..20 mapping;
- five safe seed-product search rotations, synthetic addresses, quantity one;
- an explicit runtime-correlation boundary excluding JWT/product ID/price/order
  ID from CSV;
- strict failure when the required pool is incomplete; and
- the same evidence-first preconditioning sequence for each official scenario.

No public CSV, private credential file, password, account, provisioning helper,
`.gitignore` rule, SUT process, HTTP request, database mutation, k6 action,
final script, performance evidence, commit, or push was created/performed.

## Files created

- `docs/test-data-strategy.md`
- `ai-audit/interactions/011-phase-b-corrections-phase-c-test-data-strategy.md`

## Files modified

- `docs/workload-model-proposal.md`
- `docs/CODEX-RESUME-CHECKPOINT.md`
- `docs/human-decisions.md`
- `docs/selected-workflow-specification.md` (added a Phase C supersession note;
  retained the original Phase A proposal as history)
- `ai-audit/interactions/010-resume-context-recovery-discrepancy.md`
- `ai-audit/audit.md`
- `MANUAL-TODO.md`

## Human-review status

The Phase B discrepancy is **RESOLVED BY HUMAN REVIEW**. Phase C is
`WAITING FOR HUMAN`; H-033 must not be marked `DONE BY HUMAN` until the student
explicitly approves or corrects the test-data strategy.

## Subsequent Phase C human review

- Recorded: 2026-09-01 16:15:12 +07.
- Outcome: **APPROVED WITH CORRECTIONS**; H-033 was authorized after applying
  and validating them.
- Quantity was removed because source/runtime evidence proved the selected
  WF-03 flow neither submits nor uses it.
- The authorized 20-row public CSV, placeholder credential template, README,
  and narrow ignore rules were created and validated.
- Separate account preconditioning, complete-pool validation, dedicated VU
  mapping, dynamic correlation, and scenario isolation were approved.
- The complete human review and final decisions are preserved in HD-006 and
  Interaction 012. The original AI proposal above remains unchanged history.
