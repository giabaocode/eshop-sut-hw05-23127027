# Interaction 014 — Phase E review and Phase F static k6 architecture

## Interaction metadata

| Field | Actual record |
|---|---|
| AI tool | Codex CLI |
| Human reviewer | 23127027 — Phạm Ngọc Gia Bảo |
| Date/time recorded | 2026-09-01 16:41:04 +07 (Asia/Ho_Chi_Minh) |
| Documentation/static review completed | 2026-09-01 16:54:05 +07 |
| Phase | Phase E human correction/finalization; Phase F draft/static implementation |
| Execution boundary | Documentation, draft source creation, and static checks only |

## Actual human prompt

The following is the actual human instruction for this interaction, preserved
verbatim rather than reconstructed from a prior context window.

```text
Phase E — Checks / Metrics / Safety / Report Proposal has been reviewed by me.

I approve the overall design with the following HUMAN decisions and
corrections.

Preserve:
- the original AI proposals,
- my human review,
- the resulting approved Phase E decisions.

Mark H-035 DONE BY HUMAN only after applying this review.

============================================================
1. CHECK SPECIFICATION — APPROVED
============================================================

Approve the existing checks for:

LOGIN
SEARCH
DETAIL
CHECKOUT
PENDING PROBE
CANCELLATION
FINAL PROBE

Keep the rule that HTTP 200 alone is insufficient.

The final workflow remains successful only when the exact order created by
the current iteration is verified in canceled state.

Do not weaken business-state checks merely to improve the measured success
rate.

============================================================
2. CUSTOM METRICS — APPROVED
============================================================

Approve:

wf03_workflow_attempted
    Counter

wf03_workflow_success
    Rate
    exactly ONE Boolean sample per attempted workflow iteration

wf03_failures
    Counter
    at most one first-terminal-failure sample per attempted iteration

wf03_unexpected_auth_response
    Counter

wf03_orders_created
    Counter

wf03_orders_canceled
    Counter

wf03_lifecycle_duration
    Trend

Approve reuse of native:

http_req_duration
http_req_failed
http_reqs
iterations
iteration_duration
checks
vus
dropped_iterations where relevant

Endpoint latency should be distinguished using stable request tags rather than
creating unnecessary duplicate custom Trends.

============================================================
3. ONE-OUTCOME-PER-ITERATION — APPROVED
============================================================

Approve guarded single-outcome semantics.

Every valid attempted workflow must produce exactly:

- one attempted count,
- one final workflow-success Rate sample.

Failure must not accidentally emit a second final outcome.

The outcome is true only after final canceled-state verification succeeds.

============================================================
4. FAILURE TAXONOMY — APPROVED
============================================================

Approve:

1. transport/protocol
2. authentication
3. correlation/data
4. business assertion
5. lifecycle
6. runtime/safety

Keep bounded, low-cardinality failure_class and step tags.

Do not include dynamic IDs or secrets in metric labels.

============================================================
5. IMMEDIATE SAFETY STOPS — APPROVED
============================================================

Approve test-level stop behavior for clearly invalid or unsafe execution
conditions such as:

- wrong/unauthorized target
- backend process confirmed dead
- port/service confirmed lost
- confirmed account lockout making the intended test invalid
- unusable/incomplete account pool detected before execution
- corrupted disposable runtime
- inability to preserve required output
- critical local runtime failure

These are operational safety protections.

They are NOT performance acceptance thresholds.

============================================================
6. DISK / WALL-CLOCK SAFETY — APPROVED
============================================================

Approve:

- at least 2 GiB free disk as a preflight safety requirement
- bounded scenario wall-clock duration
- bounded graceful-stop behavior
- bounded maximum workload from the previously human-approved model

These are safety controls only.

============================================================
7. NUMERIC ERROR-BASED ABORT RULES — HUMAN CORRECTION
============================================================

DO NOT finalize these AI-proposed rules yet:

- 5 consecutive connection failures
- 5 consecutive unexpected 401/403 responses across two accounts
- 10 consecutive checkout/cancellation 5xx responses
- http_req_failed >= 20% for two consecutive 15-second windows

Status:

DEFERRED — REQUIRES PILOT/RUNTIME EVIDENCE

Reason:

Load/Stress/Spike are intended to expose degradation and failures.

Especially during Stress and Spike, immediately stopping based on an
arbitrary pre-execution error-rate rule could hide useful empirical evidence
about how the SUT degrades.

Also avoid implementing unnecessarily complex cross-VU/window coordination
before real pilot behavior is understood.

For now:

- individual failures remain observable and classified,
- confirmed dangerous runtime conditions may still stop the test,
- numeric systemic-failure cutoffs will be reconsidered after controlled
  pilot execution.

Do NOT treat this deferral as permission for an unbounded run.
The approved VU and wall-clock caps remain mandatory.

============================================================
8. FINAL PERFORMANCE THRESHOLDS — NOT YET
============================================================

Do NOT establish final:

- p95 acceptance threshold
- RPS threshold
- allowed performance error rate
- maximum stable capacity

at this phase.

Those must be informed by real execution results and later AI analysis/human
review as required by HW05.

Any code-level placeholder threshold must be clearly marked NON-FINAL or
omitted until later review.

============================================================
9. REPORT / OUTPUT PROPOSAL — CONDITIONALLY APPROVED
============================================================

Approve the current mapping only as a TECHNICAL PROPOSAL:

Load:
Primary distinct view = end-of-test aggregate/custom summary

Stress:
Primary distinct view = native CSV time-series output

Spike:
Primary distinct view = k6 web-dashboard/time-series HTML

Real native k6 raw data should be preserved for every official scenario.

However:

FINAL HOMEWORK COMPLIANCE IS NOT YET APPROVED.

The assignment simultaneously discusses k6-equivalent outputs and later
requests literal .jtl logs / HTML report folders.

Therefore H-002 remains:

WAITING FOR LECTURER/TA CLARIFICATION

Do not:
- rename JSON/CSV to .jtl,
- fabricate JMeter logs,
- pretend native k6 JSON is JTL,
- claim final compliance until clarification exists.

============================================================
10. LECTURER / TA QUESTION
============================================================

Keep the existing clarification question.

Also create:

docs/ta-clarifications.md

Record:

Question ID: H-002
Status: WAITING
Date asked: TODO until I actually send it
Response: TODO

Do NOT mark the question as sent until I explicitly confirm that I sent it.

Do NOT invent a TA response.

============================================================
11. PROCEED TO PHASE F
============================================================

After applying this review, proceed to:

PHASE F — Shared k6 Architecture and Static Implementation Review

The purpose is to build and statically review the reusable implementation
architecture before installing/executing k6.

Do NOT install k6.
Do NOT start the SUT.
Do NOT provision real test accounts.
Do NOT perform performance testing.
Do NOT generate real performance results.

============================================================
12. SHARED K6 ARCHITECTURE
============================================================

Design the future project so Load, Stress, and Spike reuse the EXACT same
WF-03 business implementation.

Only workload/scenario configuration may differ.

A suitable structure may resemble:

performance/
    config/
    data/
    lib/
    scenarios/
    tools/

but adapt it to the repository rather than adding unnecessary complexity.

Separate concerns such as:

- configuration
- data loading
- authentication
- workflow execution
- correlation
- checks
- metrics
- safety/failure handling
- scenario configuration
- summary/output generation

============================================================
13. ONE SHARED WF-03 IMPLEMENTATION
============================================================

There must be ONE authoritative executable workflow implementation:

Login
→ Search
→ Detail
→ Checkout
→ Pending verification
→ wait 0.5–1.0 s
→ Cancellation
→ Final canceled verification

Load, Stress, and Spike must call this same shared implementation.

Do NOT copy/paste three slightly different business flows.

============================================================
14. DRAFT IMPLEMENTATION
============================================================

You MAY create DRAFT JavaScript source files for static review.

Clearly label them as:

DRAFT — NOT RUNTIME VERIFIED

Implement or scaffold:

- CSV loading
- private credential loading contract
- exec.vu.idInTest mapping
- input guards
- per-iteration correlation state
- tagged HTTP requests
- stable check names
- custom metrics
- emitOutcomeOnce behavior
- fail-fast transitions
- think-time helper
- WF-03 function
- scenario workload configs

Do not put real credentials in the repository.

============================================================
15. LOAD / STRESS / SPIKE CONFIG
============================================================

Represent the already human-reviewed planning workloads in separate scenario
configurations.

LOAD:
0 → 5 VUs / 1 min
5 VUs / 5 min
5 → 0 / 1 min

STRESS:
Use the exact human-approved 12m30s stage schedule from repository evidence.

SPIKE:
3 VUs baseline
3 → 20 / 10 s
20 / 45 s
20 → 3 / 10 s
3 VUs recovery / 2 min
final ramp-down as recorded

Do not alter these values silently.

Do not call them empirically validated.

============================================================
16. ACCOUNT / DATA CONTRACT
============================================================

The scripts may expect:

performance/data/workflow.csv

and a runtime-private credential file.

Do not generate real credentials.

The future runtime must fail preflight when required account rows are missing.

No:
- modulo wrapping
- account sharing fallback
- hard-coded JWT
- hard-coded productId
- hard-coded orderId

============================================================
17. OUTPUT ABSTRACTION
============================================================

Design output/report code so the final TA clarification can be incorporated
without rewriting the business workflow.

Preserve native raw k6 data as the canonical source.

Do not hard-wire a fake .jtl conversion.

The scenario-specific primary output proposal may be scaffolded, but mark
literal JTL/HTML compliance as unresolved.

============================================================
18. STATIC REVIEW
============================================================

Without running k6:

review the draft for:

- accidental mutable global correlation state
- secret leakage
- high-cardinality metric tags
- duplicate workflow outcome emission
- unsafe account fallback
- static dynamic IDs
- inconsistent business flow across scenarios
- missing failure paths
- accidental scenario-specific business logic
- unsupported assumptions

Do not claim syntax/runtime compatibility has been proven without the actual
pinned k6 runtime.

============================================================
19. FILES
============================================================

Create/update as appropriate:

performance/lib/
performance/config/
performance/scenarios/
docs/k6-architecture.md
docs/ta-clarifications.md
docs/human-decisions.md
ai-audit/audit.md
MANUAL-TODO.md

Create a detailed AI Audit interaction for this human review and Phase F.

============================================================
20. STOP CONDITION
============================================================

At the end show:

A. Phase E human-review result
B. Shared k6 architecture
C. Files created
D. Shared WF-03 implementation design
E. Load/Stress/Spike configuration design
F. Data/credential contract
G. Metric/check implementation
H. Failure/safety implementation
I. Static-review findings
J. Remaining unresolved TA/report issue
K. Things requiring human review before installation/runtime
L. Proposed next phase

Then print:

============================================================
HUMAN CHECKPOINT REQUIRED — STATIC K6 IMPLEMENTATION REVIEW
============================================================

STOP.

Do not install k6.
Do not start the SUT.
Do not provision accounts.
Do not execute k6.
Do not create performance results.
```

## Repository evidence actually read

- `docs/checks-metrics-safety.md`
- `docs/report-output-mapping.md`
- `docs/workload-model-proposal.md`, including the exact 12m30s Stress table
- `docs/correlation-strategy.md`
- `docs/selected-workflow-specification.md`
- `docs/runtime-api-verification.md`
- `performance/data/workflow.csv`
- `performance/data/credentials.template.csv`
- `performance/data/README.md`
- `.gitignore`
- `docs/human-decisions.md`, `MANUAL-TODO.md`, the resume checkpoint, and the
  prior AI Audit

The official k6 documentation references already recorded during Phase E were
used for `SharedArray`, data parameterization, execution IDs, ramping VUs, and
native output design. No installed binary was used to claim compatibility.

## Preserved proposal → human correction → current decision

| Topic | Original AI proposal | Human review/correction | Current approved Phase E decision |
|---|---|---|---|
| Checks/metrics/outcome/taxonomy | Exact seven-step checks; native plus minimal custom metrics; one outcome; six classes | Approved | Authoritative Phase E implementation contract |
| Immediate safety | Stop clearly invalid/unsafe runtime | Approved | Wrong target, confirmed service loss/lockout, unusable data/runtime/output may stop |
| Disk/time/workload bounds | 2 GiB and bounded wall-clock/graceful/VUs | Approved | Safety controls only |
| Numeric error stops | 5 connection; 5 auth across two accounts; 10 transactional 5xx; 20% across two windows | Defer to avoid hiding degradation and premature coordination | **DEFERRED — REQUIRES PILOT/RUNTIME EVIDENCE**; not implemented in Phase F |
| Performance thresholds | None proposed as final | Approved | No final p95/RPS/error/capacity threshold |
| Report mapping | Load summary, Stress CSV, Spike HTML, native raw data | Conditionally approved technically | Final compliance waiting for lecturer/TA; H-002 not sent/answered |

## Actual AI work/output

- Recorded HD-008 and marked H-035 `DONE BY HUMAN` only after applying the
  review; opened H-036 for static implementation review.
- Preserved the four numeric proposals as historical records and explicitly
  superseded their current implementation status to deferred.
- Created the H-002 TA question register with `Status: WAITING`, `Date asked:
  TODO`, and `Response: TODO`.
- Created one draft shared workflow, input/schema guards, exact checks, approved
  metrics, local outcome/failure state, stage configs, local-target guard,
  output metadata, three thin scenario entry points, and future-runner boundary.
- Created `docs/k6-architecture.md` with structure, contracts, exact stages,
  safety/output boundaries, static findings, and unsupported assumptions.

## Genuine static validation outcomes

- The first two combined validation commands failed before performing checks
  with the genuine zsh error `unmatched "` because of command quoting. They were
  corrected rather than concealed.
- `node --check` passed all 12 draft JavaScript files. This proves only general
  JavaScript grammar, not k6 compatibility.
- Static extraction found 38 unique approved stable check names and all seven
  approved custom metric names.
- Normalized Load/Stress/Spike entry files had the same SHA-256, confirming only
  the static scenario name differs in their thin structure.
- No `/api/` endpoint appeared in the scenario files; all seven endpoint
  references occur in shared `lib/` code (`auth.js` plus the one workflow
  orchestrator).
- No final/deferred numeric threshold code, static JWT/product ID/order ID, or
  real credential artifact was found.
- Stress configuration contains 13 stages totaling 750 seconds (12m30s).
- Approved private paths remain ignored; public artifacts remain trackable.
- Original `backend/database.sqlite` remained SHA-256
  `c63f00544180ba1fbb1427a9b9dd3f1784842698809972f33ce90482e7420ba6`.
- k6 remained absent and port 3000 had no listener.

## Non-actions and review state

- No SUT, k6, provisioning helper, account, credential, HTTP request,
  performance test, output/report, measurement, screenshot, commit, or push was
  created/executed.
- Draft source is explicitly not runtime verified.
- H-035: **DONE BY HUMAN**.
- H-036: **WAITING FOR HUMAN**.
- H-002: **WAITING FOR LECTURER/TA CLARIFICATION**; not sent, no response.
