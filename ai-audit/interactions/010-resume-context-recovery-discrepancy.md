# Interaction 010 — Resume Context Recovery and Phase B Discrepancy

## AI tool

Codex CLI

## Date/time

- Session evidence recorded: 2026-09-01 15:51:08 +07
- Time zone: Asia/Ho_Chi_Minh
- Intended next phase: PHASE C — Test-Data Strategy
- Outcome: **STOPPED BEFORE PHASE C because repository evidence differs from the resume summary**

## Human prompt/instruction — preserved verbatim

> This is a NEW Codex CLI session continuing HCMUS HW05 Performance Testing.
>
> Do NOT rely on memory from any previous Codex context.
>
> Before doing any new homework work, reconstruct the current project state
> ONLY from repository evidence.
>
> ============================================================
> 1. RECOVER PROJECT CONTEXT
> ============================================================
>
> Read, in this order:
>
> 1. 2026.HW05.Performance Testing_En.pdf
> 2. docs/CODEX-RESUME-CHECKPOINT.md
> 3. docs/human-decisions.md
> 4. docs/selected-workflow.md
> 5. docs/selected-workflow-specification.md
> 6. docs/workload-model-proposal.md
> 7. MANUAL-TODO.md
> 8. ai-audit/audit.md
> 9. relevant recent files under ai-audit/interactions/
>
> Also inspect:
>
> git status
> git branch -vv
> git remote -v
> git config --get remote.pushDefault
>
> Do not modify anything while reconstructing context.
>
> ============================================================
> 2. VERIFY RESUME CHECKPOINT
> ============================================================
>
> Confirm that the repository records:
>
> Student:
> 23127027 — Phạm Ngọc Gia Bảo
>
> Tool:
> k6
>
> OS:
> macOS
>
> Selected workflow:
> WF-03 — Purchase followed by customer cancellation
>
> Executable workflow:
>
> Login
> → Product Search/List
> → Product Detail
> → Checkout/Create Order
> → Verify newly created order is pending
> → Cancel that exact order
> → Verify that exact order is canceled
>
> Group:
> 4 students
>
> Workflow uniqueness:
> Confirmed by the human student.
>
> Phase status:
>
> Phase 0 — complete
> Phase 1 — complete
> Phase 2 — complete
> Phase 2B — complete
> Phase 3 — complete and human-reviewed
> Phase A — complete and human-reviewed
> Phase B — complete and human-reviewed
> Phase C — NOT STARTED
>
> Do not repeat completed phases unless repository evidence shows a problem.
>
> ============================================================
> 3. RECOVER HUMAN-APPROVED PHASE B VALUES
> ============================================================
>
> Read the authoritative files rather than guessing.
>
> Confirm the approved planning values include the human corrections for:
>
> LOAD:
> - ramping-vus
> - 0 → 5 VUs over 1 minute
> - 5 VUs steady for 5 minutes
> - 5 → 0 over 1 minute
> - conservative 2-VU pilot retained
>
> STRESS:
> - initial stages based on:
>   2 → 5 → 10 → 15 → 20 VUs
> - 20 VUs is an initial bounded maximum, NOT measured capacity
> - use the corrected exact stage timeline recorded in repository evidence
>
> SPIKE:
> - baseline 3 VUs
> - baseline 2 minutes
> - 3 → 20 VUs in 10 seconds
> - 20 VUs for 45 seconds
> - 20 → 3 VUs in 10 seconds
> - recovery 3 VUs for 2 minutes
> - final ramp-down
>
> THINK TIME:
> - Login → Search: random 0.5–1.0 s
> - Search → Detail: random 1.0–2.0 s
> - Detail → Checkout: random 1.5–3.0 s
> - Pending verification → Cancellation: random 0.5–1.0 s
>
> ACCOUNT STRATEGY:
> - prefer dedicated valid test accounts
> - target up to 20 accounts
> - provisioning only inside disposable runtime
> - private credentials must not be committed
>
> SCENARIO ISOLATION:
> - fresh disposable comparable runtime per official scenario
> - preserve evidence before reset
>
> These remain planning parameters, NOT measured performance values or final
> performance thresholds.
>
> If repository evidence differs from this summary, STOP and show the difference
> rather than silently overwriting it.
>
> ============================================================
> 4. SAFETY RULES STILL APPLY
> ============================================================
>
> Never fabricate:
>
> - performance results
> - k6 output
> - raw logs
> - screenshots
> - resource usage
> - hardware evidence
> - video
> - GitHub Issues
> - human review
> - measured thresholds
>
> Never push to upstream.
>
> Do not modify the original HW05 database.
>
> Continue using disposable runtime environments for execution.
>
> Do not install k6 yet.
>
> Do not run Load, Stress, Spike, or endurance tests.
>
> Maintain the AI Audit.
>
> ============================================================
> 5. AUDIT THIS NEW SESSION
> ============================================================
>
> Create a new AI Audit interaction for this resume session.
>
> Record:
>
> - Codex CLI
> - actual date/time
> - this actual human resume prompt
> - context files read
> - recovered state
> - any discrepancy found
> - relevant actual AI output
>
> Do not invent details from the previous context window.
>
> ============================================================
> 6. CONTINUE WITH PHASE C ONLY
> ============================================================
>
> After context recovery succeeds, proceed to:
>
> PHASE C — Test-Data Strategy
>
> The goal is to design data for WF-03.
>
> Do NOT generate final k6 scripts yet.
>
> Design:
>
> A. committed non-secret workflow data
> B. private credential data
> C. reproducible disposable-runtime provisioning for up to 20 customer accounts
> D. VU-to-account allocation
> E. search/product-selection data
> F. shipping-address and quantity data
> G. dynamic correlation boundary
> H. secret handling
> I. deterministic scenario preconditioning
>
> Dynamic runtime values MUST NOT be placed in CSV:
>
> - JWT
> - productId when it should be extracted from the response
> - product price
> - orderId
>
> Define safe CSV/template schemas.
>
> Do not create or commit a real credential file.
>
> Propose appropriate .gitignore rules.
>
> Explain behavior for:
>
> - Load: 5 concurrent VUs
> - Stress: up to 20 VUs
> - Spike: up to 20 VUs
>
> Prefer one dedicated account per active VU where practical.
>
> Do not provision the accounts yet.
>
> ============================================================
> 7. OUTPUT
> ============================================================
>
> Create/update:
>
> docs/test-data-strategy.md
> ai-audit/audit.md
> MANUAL-TODO.md
>
> Create the new interaction record under:
>
> ai-audit/interactions/
>
> At the end show:
>
> A. Resume verification result
> B. Any discrepancy found
> C. Public/non-secret data schema
> D. Private credential schema
> E. Account provisioning design
> F. VU/account mapping
> G. Product/search strategy
> H. Dynamic-correlation boundary
> I. Secret handling
> J. Scenario preconditioning
> K. Remaining human decisions
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
> Do not generate final performance scripts.
> Do not run performance tests.

## Context files read in required order

1. `2026.HW05.Performance Testing_En.pdf` — all nine pages extracted locally
   with Swift/PDFKit after unavailable/unsuitable extractor attempts; no package
   was installed.
2. `docs/CODEX-RESUME-CHECKPOINT.md`
3. `docs/human-decisions.md`
4. `docs/selected-workflow.md`
5. `docs/selected-workflow-specification.md`
6. `docs/workload-model-proposal.md`
7. `MANUAL-TODO.md`
8. `ai-audit/audit.md`
9. Recent relevant interaction records 007, 008, and 009.

Additional read-only checks included `docs/assignment-requirements.md`,
`git status`, `git branch -vv`, `git remote -v`,
`git config --get remote.pushDefault`, `sw_vers`, the local timestamp, and the
absence of a `k6` executable.

## Recovered state

- Student: Phạm Ngọc Gia Bảo (`23127027`).
- Selected tool: k6; it is not installed.
- OS: macOS (runtime check reported macOS 26.5.2, build 25F84).
- Selected unique four-person-group workflow: WF-03 — Purchase followed by
  customer cancellation.
- Invariant executable flow: login → search/list → detail → checkout → verify
  the new order pending → cancel that exact order → verify it canceled.
- Phase 0, Phase 1, Phase 2, Phase 2B, Phase 3, Phase A, and Phase B are recorded
  complete; the required human-reviewed statuses are present. Phase C is
  recorded `NOT STARTED`.
- Load, Stress, Spike, their exact repository timelines, scenario isolation,
  safety bounds, and their status as unmeasured planning inputs were recovered.
- Git: `main` at `85af3ba`, tracking `origin/main`; expected `origin` and
  `upstream` URLs; `remote.pushDefault=origin`; documentation/PDF/runbook trees
  remain untracked. No push occurred.

## Discrepancy found

The human resume summary conflicts with the authoritative, human-approved Phase
B values in `docs/CODEX-RESUME-CHECKPOINT.md`, HD-004, Interaction 009, and the
accepted Phase B proposal:

1. **Pending verification → cancellation think time**
   - Resume prompt: random `0.5–1.0 s`.
   - Repository: `0 s`; immediate lifecycle completion, explicitly disclosed as
     test-control behavior.
2. **Account strategy**
   - Resume prompt: prefer dedicated valid accounts, target up to 20 accounts,
     with disposable-runtime provisioning.
   - Repository: the approved initial constraint is one valid seeded customer;
     multiple accounts are preferable but their provisioning/count/source/reset
     policy remains a future human decision. No target of 20 accounts is
     recorded as approved.

The Stress timeline itself is not discrepant: the repository records a 30-second
`0→2` warm ramp; one-minute hold/ramp pairs through `2, 5, 10, 15, 20`; a
one-minute `20→5` recovery ramp; one-minute hold at 5; and one-minute `5→0`
ramp-down, totaling 12 minutes 30 seconds of scheduled stages.

## Relevant actual AI output and stop decision

Codex reported the two conflicts and applied the prompt's explicit rule:
“If repository evidence differs from this summary, STOP.” Phase C was therefore
not started. No test-data strategy, CSV/template, credential file, provisioning
procedure, `.gitignore` change, account creation, SUT/database action, k6
installation/script/run, performance result, commit, or push was produced.

Only this interaction record and the corresponding audit-log entry were added
to meet the explicit requirement to audit the new session. `MANUAL-TODO.md` was
not changed because no Phase C checkpoint was reached.

## Subsequent human review

- Received: 2026-09-01 15:58:08 +07.
- Outcome: **DISCREPANCY CHECKPOINT RESOLVED BY HUMAN REVIEW**.
- The human explicitly identified both prompt values as new corrections that
  supersede the older Phase B values while requiring the old values to remain
  in history.
- Current pending→cancel planning value: independent random `0.5–1.0 s`.
- Current account direction: reproducible disposable-runtime setup for up to 20
  dedicated customers, preferably one per active VU; no accounts provisioned.
- The complete correction/Phase C instruction is preserved in Interaction 011.
