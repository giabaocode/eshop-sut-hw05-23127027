# HW05-AI Audit Log

## Interaction 001 — Assignment intake and repository baseline

| Field | Record |
|-------|--------|
| AI tool | Codex CLI |
| Date/time | 2026-09-01 10:04:33 +07 (Asia/Ho_Chi_Minh) |
| Phase | PHASE 0 — Assignment Intake and Repository Baseline |
| Human prompt/instruction | Read the entire assignment PDF first; create assignment traceability and AI-audit scaffolding; verify Git remotes/status/branch and safe push default; inspect enough repository/SUT source to establish startup, dependency, and k6 status; do not select a workflow, create final k6 scripts, execute tests, commit, or push. |
| AI response summary | Read all 9 PDF pages; created a requirement traceability matrix and manual-responsibility register; verified repository remotes and branch; configured local `remote.pushDefault=origin`; inspected documentation, manifests, backend source/database, API clients, and installed-tool state; identified unresolved k6 artifact/video ambiguities and preliminary startup/dependency findings. |
| Human-review status | `WAITING FOR HUMAN` — phase findings and files require student review. |
| Corrections requested by human | None yet. |

### Files created

- `docs/assignment-requirements.md`
- `ai-audit/README.md`
- `ai-audit/audit.md`
- `MANUAL-TODO.md`

### Files modified

- Repository-local Git configuration (`.git/config`): set
  `remote.pushDefault = origin`. No tracked SUT source file was modified.

### Commands executed

Read-only inspection and verification commands included:

- `git remote -v`
- `git status --short --branch`
- `git branch --show-current`
- `git config --get remote.pushDefault`
- `git log -5 --oneline --decorate`
- `find`/`rg --files` repository structure queries
- `sed` reads of the README, setup guide, API specification, manifests,
  `run_servers.sh`, `backend/server.js`, and `backend/database.js`
- `rg` route, authentication, environment, and frontend-client searches
- `file` and `ls -l` on the assignment PDF
- local Swift/PDFKit extraction of every PDF page (no package installed)
- `command -v` checks for PDF utilities, k6, and sqlite3
- `node --version` and `npm --version`
- `npm ls --depth=0` in all four JavaScript projects
- read-only SQLite table and row-count queries

Configuration command executed:

- `git config remote.pushDefault origin`

No server, Load, Stress, Spike, or endurance test was run. No database reset,
dependency installation, commit, push, upload, issue publication, or screenshot
creation occurred.

### Evidence-backed observations

- `origin` is the student's expected repository and `upstream` is the official
  lecturer repository. Both currently display the expected HTTPS URL for fetch
  and push; policy forbids any push to `upstream`.
- Branch is `main`, tracking `origin/main`; the starting status contained only
  the untracked assignment PDF.
- The backend is Node.js/Express with SQLite, binds to port 3000, and is launched
  directly with `node server.js` according to source/setup documentation.
- No Docker configuration or `.env` file was found, and the backend source does
  not read `process.env`; the port and JWT signing secret are hard-coded. The
  latter is an existing SUT security concern and must not be copied into new
  performance-test data.
- `run_servers.sh` is not portable to this checkout: it contains another user's
  absolute path and begins with the destructive broad command `killall node`.
- Node.js `v20.20.2`, npm `10.8.2`, and `/usr/bin/sqlite3` are present. k6 is
  absent. No project has a `node_modules` directory; `npm ls --depth=0` reports
  all declared dependencies unmet.
- A populated SQLite database exists. It was inspected read-only and not reset.
- Source contradicts the stated FR-02 behavior: failed logins add 2 attempts and
  lock for 180 seconds, while the requirement says add 1 and lock for 30 seconds.
  This is a preliminary source finding, not an empirically reproduced issue.
- Credential documentation is inconsistent: the root README/database seed use
  the capitalized admin password, while `setup_guide.md` shows a lowercase form.
  The actual seeded database state must be verified safely before test design.
- Transactional state needs deeper investigation: carts live in process memory,
  checkout trusts the submitted total, creates persistent order rows, and does
  not visibly clear the cart in the backend route. Concurrency/repeatability and
  cleanup implications have not yet been designed.

### Assumptions and limitations

- “Backend appears to run” is a source-based preliminary finding, not a verified
  startup result. Startup verification belongs to a later approved phase after
  dependencies are available.
- No workflow candidate has been evaluated or selected.
- The extracted PDF text was read for all pages. Formatting-aware page
  references use the PDF footer/page sequence reported by PDFKit.
- The `.jtl`/HTML requirement for k6 and the relationship between the two video
  descriptions remain unresolved; see `docs/assignment-requirements.md`.

## Interaction 002 — Repository / SUT discovery

| Field | Record |
|-------|--------|
| AI tool | Codex CLI |
| Date/time | 2026-09-01 10:24:31 +07 (Asia/Ho_Chi_Minh) |
| Completed | 2026-09-01 10:30:43 +07 (Asia/Ho_Chi_Minh) |
| Phase | PHASE 1 — Repository / SUT Discovery |
| Human prompt/instruction | Phase 0 was approved. Perform source-code-backed discovery only; do not install dependencies, start the SUT, mutate/reset/reseed the database, execute performance tests, select a workflow, or resolve the k6/video ambiguities. Fully document workflow-relevant endpoints, auth/JWT/lockout/recovery, products, cart, checkout/orders, coupons, seed state, side effects, correlation, concurrency, and CSV needs. Update the audit, create `docs/sut-discovery.md`, distinguish source facts from runtime verification needs, then stop for review. The exact prompt is preserved in [`interactions/002-phase-1-repository-sut-discovery.md`](interactions/002-phase-1-repository-sut-discovery.md). |
| AI output | Created a source-backed architecture, data-model, auth/lockout, route-contract, correlation, state-mutation, concurrency, CSV-data, ambiguity, and runtime-gap report covering all 31 backend routes. Found that server startup itself invokes the destructive database initializer, that UI carts do not call backend cart endpoints, and that checkout/order/coupon behavior has important state-isolation implications. All implementation discrepancies remain source observations rather than confirmed bugs. |
| Human-review status | `WAITING FOR HUMAN` — Phase 1 findings require student review before workflow candidates. |
| Corrections requested by human | None yet. |

### Phase 1 files created

- `docs/sut-discovery.md`
- `ai-audit/interactions/002-phase-1-repository-sut-discovery.md`

### Phase 1 files modified

- `ai-audit/audit.md`
- `MANUAL-TODO.md` (`H-001` set to `DONE BY HUMAN` from explicit approval;
  `H-026` added as the current review checkpoint)

### Phase 1 commands and actions

- Read line-numbered backend server and database source with `nl`/`sed`.
- Read line-numbered web authentication, cart, product, checkout, profile,
  registration, password-reset, and routing source.
- Read relevant mobile and admin API-client source.
- Enumerated all Express route registrations with `rg`.
- Compared backend routes with API specification, setup guide, and requirements.
- Used `sqlite3 -readonly` for sanitized user state, product/category/coupon
  fixtures, order/coupon counts, schema/index inventory, PRAGMAs, and integrity.
- Calculated a SHA-256 hash and metadata for the existing SQLite file.
- Searched for environment configuration, JWT expiry/role checks, frontend API
  calls, and backend-cart client usage.
- Rechecked Git status and local time.
- One read-only `rg` client-call search failed because of unmatched shell
  quoting; a simpler successful search was used instead. It caused no mutation.

No dependency installation, server start, direct database initializer, write
query, test execution, workflow selection, commit, push, or external action
occurred.

### Phase 1 verification

- An automated source/document comparison found 31 Express method/route
  registrations (24 distinct path strings) and zero undocumented paths.
- The SQLite SHA-256 remained
  `c63f00544180ba1fbb1427a9b9dd3f1784842698809972f33ce90482e7420ba6`,
  with unchanged modification time `2026-09-01 09:51:44 +0700`.
- No `node_modules` directory appeared and `k6` remained unavailable.
- Whitespace and high-confidence private-key/token-pattern scans returned no
  finding in the Phase 1 documentation. The documented SUT demo credentials are
  public fixtures already present in the official repository, not private data.

## Interaction 003 — Safe SUT startup strategy and runtime preparation

| Field | Record |
|-------|--------|
| AI tool | Codex CLI |
| Date/time | 2026-09-01 10:38:06 +07 (Asia/Ho_Chi_Minh) |
| Completed | 2026-09-01 10:41:46 +07 (Asia/Ho_Chi_Minh) |
| Phase | PHASE 2 — Safe SUT Startup Strategy and Runtime Preparation |
| Human prompt/instruction | Phase 1 was approved. Reconfirm the reset-on-start control flow, affected database, and every-start behavior; do not modify the SUT, install anything, start the backend, mutate/reset the database, generate workflow candidates, run k6, commit, or push. Propose and compare 2–3 source-supported startup strategies, prefer behavior preservation, inspect dependencies/tool status, prepare exact macOS commands, create the startup runbook, preserve the actual interaction, separate source facts/proposals/runtime gaps, and stop at a human strategy checkpoint. The full prompt is preserved in [`interactions/003-phase-2-safe-startup-strategy.md`](interactions/003-phase-2-safe-startup-strategy.md). |
| AI output | Revalidated that `server.js` imports `database.js`, whose top-level `initDatabase()` call drops/recreates/seeds `backend/database.sqlite` on every fresh process. Compared original-checkout-with-backup, disposable local Git clone, and disposable backend-copy strategies. Recommended an exact-commit local clone under `/private/tmp`, which preserves application behavior while isolating reset/test mutations. Documented backend dependencies, installed prerequisites, absent k6/node_modules, affected paths, proposed install/start/read/stop commands, and runtime verification requirements. No SUT patch was proposed for execution. |
| Human-review status | `WAITING FOR HUMAN` — strategy and proposed commands require explicit approval. |
| Corrections requested by human | None yet. |

### Phase 2 files created

- `runbooks/sut-startup-macos.md`
- `ai-audit/interactions/003-phase-2-safe-startup-strategy.md`

### Phase 2 files modified

- `ai-audit/audit.md`
- `MANUAL-TODO.md` (`H-026` set to `DONE BY HUMAN` from explicit approval;
  `H-027` added as the current checkpoint)

### Phase 2 inspections and commands

- Re-read line-numbered `backend/server.js`, `backend/database.js`,
  `setup_guide.md`, `run_servers.sh`, and backend manifests.
- Read direct dependency versions from `backend/package-lock.json` with a local
  Node one-liner; no module loading or installation occurred.
- Rechecked Node/npm/k6, Git, macOS utilities, Xcode/clang/make/Python, port
  3000 listener state, disk availability, and absence of `node_modules`.
- Inspected `sqlite3@6.0.1` engine/dependency metadata from the lockfile.
- Verified current Git commit, clean tracked/staged backend state, database Git
  blob identity, SHA-256, size, and modification time.
- Rechecked Git status, `remote.pushDefault`, and local timestamp.

No command from the runbook's `PROPOSED` execution blocks was run. No temp
clone/backup, npm cache, `node_modules`, backend process, HTTP request, database
write, source patch, k6 action, commit, or push was created/performed.

### Phase 2 verification

- All seven proposed Bash command blocks passed `bash -n` syntax validation;
  this does not prove runtime success.
- Local Markdown-link validation found no broken file targets.
- The backend working tree remained clean and the original database hash/mtime
  remained unchanged.
- k6 and project `node_modules` remained absent, and port 3000 remained free.
- Whitespace and high-confidence secret-pattern scans found no issue in the
  created/updated Phase 2 documentation.

## Interaction 004 — Approved safe startup verification

| Field | Record |
|-------|--------|
| AI tool | Codex CLI |
| Date/time | 2026-09-01 10:54:03 +07 (Asia/Ho_Chi_Minh) |
| Completed | 2026-09-01 11:02:15 +07 (Asia/Ho_Chi_Minh) |
| Phase | PHASE 2B — Approved Safe Startup Verification |
| Human prompt/instruction | Strategy B approved: create a disposable `/private/tmp` Git clone pinned to the current commit; install npm dependencies only there; start only that clone; perform readiness and read-only product GETs; verify reset confinement and original integrity; stop the process; do not install k6, modify source, exercise mutations/auth failures, run performance tests, generate workflows, commit, or push. Preserve genuine failures and the exact interaction. The full prompt is in [`interactions/004-phase-2b-runtime-startup-verification.md`](interactions/004-phase-2b-runtime-startup-verification.md). |
| AI output | Created a temp clone at the expected commit, installed locked dependencies after preserving an initial DNS failure, started the unmodified backend with PID 9739, proved it listened on port 3000 from the clone, received actual HTTP 200 responses from product search/listing, proved only the clone database reset, stopped the process, and verified the original database/source remained unchanged. |
| Human-review status | `WAITING FOR HUMAN` — Phase 2B results and unexpected environmental behavior require review. |
| Corrections requested by human | None yet. |

### Phase 2B files created

- `docs/runtime-startup-verification.md`
- `ai-audit/interactions/004-phase-2b-runtime-startup-verification.md`

### Phase 2B files modified

- `runbooks/sut-startup-macos.md`
- `ai-audit/audit.md`
- `MANUAL-TODO.md` (`H-027` set to `DONE BY HUMAN` from the explicit Strategy B
  approval; `H-028` added as the current review checkpoint)

### Phase 2B commands and actions

- Recorded original repository identity, current commit, port state, backend
  working-tree state, file hashes, and absence of original `node_modules`.
- Created `/private/tmp/eshop-hw05-sut.jxn8Wd`, copied a verified original-DB
  backup into it, and made a `--no-hardlinks --local` clone at commit
  `85af3ba875c88283615e22cb108f13e2fccaf0e9`.
- Ran `npm ci` with a temp-local cache. The first sandboxed attempt failed with
  registry DNS `ENOTFOUND` and an incomplete dependency tree. Retrying the same
  command with approved network access succeeded; `npm ls --depth=0` and a
  native `sqlite3` load then succeeded.
- Started unmodified `node server.js`. Sandboxed launches were terminated by
  the execution environment; an approved localhost-listener execution remained
  active as PID 9739 from the clone and owned port 3000.
- Preserved sandbox curl HTTP 000/exit 7 results, then used approved localhost
  access for actual HTTP 200 product-search and product-list requests.
- Compared SQLite hashes/counts and confirmed startup removed the clone's prior
  three orders while leaving the original/backup byte-identical.
- Sent SIGTERM only to verified PID 9739, confirmed the listener disappeared,
  and ran read-only post-stop SQLite integrity/count checks.
- Rechecked original and clone Git state, backend hashes, original
  `node_modules` absence, and port state.

No system-wide package/Homebrew/sudo action, k6 installation/run, SUT patch,
original database initialization, auth failure, registration, password reset,
cart/coupon/order/admin mutation, performance execution, workflow generation,
commit, or push occurred.

### Phase 2B verification and unexpected results

- The original database SHA-256 remained
  `c63f00544180ba1fbb1427a9b9dd3f1784842698809972f33ce90482e7420ba6` before
  and after runtime execution; all original source/manifest hashes matched.
- The clone database hash changed to
  `e5783132d3952afb2bcc3410b33f2b05f0368f6542a6cb87f0e3fc98421ab992`,
  and its order count changed from 3 to 0, verifying clone-only reset/reseed.
- Both permitted API GETs returned HTTP 200 with genuine seeded-product JSON.
- npm reported four dependency vulnerabilities and one deprecated package; no
  automated remediation was performed.
- The first npm attempt and sandbox-local server/curl attempts failed because
  of environment restrictions. These observations are not classified as SUT
  bugs. The managed server session exited 1 after successful SIGTERM shutdown;
  the exact PID stopped, the port was free, and SQLite integrity was `ok`.

## Interaction 005 — Controlled runtime API verification and workflow discovery

| Field | Record |
|-------|--------|
| AI tool | Codex CLI |
| Date/time | 2026-09-01 12:37:51 +07 (Asia/Ho_Chi_Minh) |
| Runtime completed | 2026-09-01 12:42:32 +07 |
| Documentation completed | 2026-09-01 12:48:22 +07 |
| Phase | PHASE 3 — Controlled Runtime API Verification and Workflow Discovery |
| Human prompt/instruction | Phase 2B accepted. Reuse only the disposable runtime; minimally and sequentially verify valid login/JWT/Bearer, product search/list/detail, optional category, cart append/read, checkout/order readback, and useful coupon behavior; preserve state/correlation/discrepancies and original integrity; then propose 5–6 genuinely distinct group workflows with full risk/ranking information. Do not test lockout, install k6, run performance tests, select a workflow, commit, or push. The complete prompt is preserved in [`interactions/005-phase-3-runtime-api-workflow-discovery.md`](interactions/005-phase-3-runtime-api-workflow-discovery.md). |
| AI output | Used PID 10568 from the approved clone for a sequential happy path. Observed HTTP 200 for login, Bearer profile, product/category reads, cart append/read, fixed coupon apply, checkout, usage recording, and order readbacks; correlated user 2, product 1, coupon 2, final amount 29,950,000, and order 1. Verified one clone order and usage row, persistent post-checkout cart content, and unchanged original repository. Proposed six distinct workflows and recommended WF-03 technically without selecting it. |
| Human-review status | `WAITING FOR HUMAN` — Phase 3 evidence/candidates, group uniqueness, and final workflow choice require explicit student decisions. |
| Corrections requested by human | None yet. |

### Phase 3 files created

- `docs/runtime-api-verification.md`
- `docs/workflow-candidates.md`
- `ai-audit/interactions/005-phase-3-runtime-api-workflow-discovery.md`

### Phase 3 files modified

- `ai-audit/audit.md`
- `MANUAL-TODO.md` (`H-028` set to `DONE BY HUMAN` from explicit acceptance;
  `H-029`, `H-004`, and `H-005` are active human checkpoints)

### Phase 3 runtime actions and observations

- Reconfirmed original/temp commit identity, database hashes/counts, unlocked
  seed accounts, temp dependencies, clean original backend, and free port 3000.
- Restarted unmodified `node server.js` only in
  `/private/tmp/eshop-hw05-sut.jxn8Wd/repo/backend`; PID 10568 and its working
  directory/listener were verified with `lsof`.
- Sent a small sequential request set with `curl`; Node extracted JSON fields
  and redacted the transient JWT/password from stored evidence.
- Runtime-verified login and protected `/api/users/me`, product search/list/
  detail, categories, cart before/append/after, coupon list/application,
  checkout, usage insertion, history/detail, and post-checkout cart state.
- The fixed coupon response supplied `coupon_id=2` and
  `final_amount=29950000`; checkout supplied `orderId=1`. SQLite changed from
  zero to one order and zero to one coupon-usage row.
- Checkout retained the cart item and stored the submitted discounted amount.
  Coupon apply and order detail returned 200 without Authorization. These are
  source/runtime observations, not automatically classified defects.
- Sent SIGTERM only to PID 10568. The session exited 143, PID disappeared, port
  3000 became free, and disposable SQLite integrity remained `ok`.

### Phase 3 workflow output

Six business-process families were proposed for the four-person group:

1. WF-01 server-cart customer purchase;
2. WF-02 promotion redemption purchase;
3. WF-03 purchase and customer cancellation;
4. WF-04 new-customer onboarding and first order;
5. WF-05 administrative catalog import and verification;
6. WF-06 customer-to-admin fulfillment handoff.

WF-03 is the AI's best technical recommendation, conditional on a future
single cancellation smoke verification. WF-01 is easiest; WF-06 offers the
richest analysis. No workflow was selected.

### Phase 3 safety/integrity

- Original database SHA-256 stayed
  `c63f00544180ba1fbb1427a9b9dd3f1784842698809972f33ce90482e7420ba6`.
- Original backend status stayed clean, its source/manifest hashes remained
  unchanged, and original `node_modules` stayed absent.
- No failed login, lockout, registration, reset, cancellation, admin mutation,
  concurrent/high-volume request, SUT patch, system install, k6 action,
  performance run, commit, push, or external publication occurred.

## Interaction 006 — Human workflow selection and functional smoke

| Field | Record |
|-------|--------|
| AI tool | Codex CLI |
| Date/time | 2026-09-01 12:56:28 +07 (Asia/Ho_Chi_Minh) |
| Runtime completed | 2026-09-01 12:58:58 +07 |
| Documentation completed | 2026-09-01 13:00:58 +07 |
| Phase | PHASE 4 — Selected Workflow Decision and Functional Smoke Verification |
| Human prompt/instruction | The student selected WF-03 and explicitly confirmed uniqueness among four group members. Record that as a HUMAN decision without reinterpretation; then use the approved disposable runtime for exactly one sequential login → product search/list → detail → checkout/create → cancel flow. Dynamically correlate JWT, product ID, and checkout order ID; preserve exact redacted evidence, before/after state, repeatability implications, and original integrity. Do not install/run k6 or perform any performance test. The complete prompt is preserved in [`interactions/006-selected-workflow-functional-smoke.md`](interactions/006-selected-workflow-functional-smoke.md). |
| AI output | Recorded WF-03 verbatim as the human choice. Reused the approved clone, reseeded only its temp database, and ran one functional iteration. Every request returned 200; search supplied product ID 1, checkout supplied order ID 1 dynamically, and correlated reads/cancellation proved `pending → canceled`. Stopped PID 11253, preserved one canceled temp order, and verified the original database/source remained unchanged. |
| Human-review status | `WAITING FOR HUMAN` — selected-workflow smoke evidence requires explicit review before detailed design or k6 work. |
| Corrections requested by human | None yet. |

### Phase 4 files created

- `docs/human-decisions.md`
- `docs/selected-workflow.md`
- `ai-audit/interactions/006-selected-workflow-functional-smoke.md`

### Phase 4 files modified

- `docs/runtime-api-verification.md`
- `ai-audit/audit.md`
- `MANUAL-TODO.md` (`H-004` and `H-005` set to `DONE BY HUMAN` from explicit
  selection/uniqueness statements; `H-030` added for smoke review)

### Phase 4 runtime execution

- Preflight recorded original/temp commits, database hashes/counts, original
  backend status, free port 3000, temp dependencies, and absent k6.
- Starting unmodified `node server.js` in the temp clone reset its prior Phase 3
  state to zero orders and zero coupon usages; PID 11253 owned port 3000.
- One seeded-customer login returned 200 and a 133-character JWT, which was
  redacted from repository evidence.
- Product search returned 200 and supplied product ID 1. Its dynamically built
  detail request returned 200 with matching ID and price 30,000,000.
- Checkout with the correlated JWT returned 200 and `orderId=1`. The actual
  value was extracted, not embedded as test data.
- A correlated pre-cancel read returned status `pending`; authenticated
  `PUT /api/orders/:orderId/cancel` returned 200; the correlated post-read
  returned `canceled`. The helper asserted that exact transition and exited 0.
- Read-only SQLite evidence confirmed one canceled order for user 2, unlocked
  accounts, zero coupon usage, and integrity `ok`.
- `kill -TERM 11253` stopped the verified clone PID. Its TTY session returned
  exit 1 after SIGTERM; the PID disappeared and port 3000 became free.

### Phase 4 integrity and boundary

- Original database SHA-256 remained
  `c63f00544180ba1fbb1427a9b9dd3f1784842698809972f33ce90482e7420ba6`.
- Original backend/source/manifest hashes remained unchanged, backend status
  stayed clean, and original `node_modules` stayed absent.
- The temp database intentionally retains one canceled order with hash
  `dea4a462e07ba1ec61450ceace2ef50ba2d9c9608d507129df14b0d5c75fb2fc`.
- This was functional smoke evidence only. No latency, throughput, VU, or other
  performance claim was made.
- No failed login, lockout, k6 action, Load/Stress/Spike/endurance run, source
  patch, system install, commit, push, or publication occurred.

## Interaction 007 — Phase A selected workflow specification

| Field | Record |
|-------|--------|
| AI tool | Codex CLI |
| Date/time | 2026-09-01 13:05:55 +07 (Asia/Ho_Chi_Minh) |
| Documentation completed | 2026-09-01 13:12:08 +07 |
| Phase | PHASE A — Selected Workflow Specification |
| Human prompt/instruction | The student explicitly approved Phase 3 evidence and the WF-03 smoke, reaffirmed WF-03/its exact sequence/group uniqueness, and authorized H-029/H-030 as `DONE BY HUMAN`. Create a formal workload-independent contract for endpoints, group coverage, correlation/fail-fast behavior, iteration semantics, state/repeatability, lockout safety, data schemas, checks, future metric definitions, think-time locations, and shared-vs-scenario components. Do not install/run k6, create final scripts, choose workload levels, or perform testing. The full prompt is preserved in [`interactions/007-phase-a-selected-workflow-specification.md`](interactions/007-phase-a-selected-workflow-specification.md). |
| AI output | Recorded both approvals as human decisions and closed H-029/H-030. Created the WF-03 formal contract: five immutable business steps plus correlated pending/canceled probes; dynamic JWT/product/price/order chain; iteration-local fail-fast rules with no static fallback; verified state implications; secret-safe proposed CSV split; meaningful business assertions; future native/custom metrics all marked not measured; candidate think-time locations without values; and workload-independent architecture. |
| Human-review status | `WAITING FOR HUMAN` — H-031 requires explicit Phase A review before Phase B. |
| Corrections requested by human | None yet. |

### Phase A files created

- `docs/selected-workflow-specification.md`
- `ai-audit/interactions/007-phase-a-selected-workflow-specification.md`

### Phase A files modified

- `docs/selected-workflow.md`
- `docs/human-decisions.md`
- `ai-audit/audit.md`
- `MANUAL-TODO.md` (`H-029` and `H-030` set to `DONE BY HUMAN` exactly as
  authorized; `H-031` added for Phase A review)

### Phase A contract decisions

- Kept the human-selected sequence unchanged. Two `GET /api/orders/:orderId`
  probes validate pending/canceled state around the five business steps.
- Classified login as auth-heavy, product search/detail as read-heavy, and
  checkout/cancellation as transactional.
- Required iteration-local JWT, product ID, validated price, and new order ID.
  Missing correlation aborts the iteration; seed/static/prior-iteration
  fallbacks are forbidden.
- Defined success as all step and lifecycle checks passing for the same order.
  A checkout followed by failed cancellation can leave a pending row and must
  remain a visible workflow failure.
- Recorded one persistent canceled order per successful iteration, no inventory
  behavior, database growth, potential unmeasured SQLite contention, and an
  evidence-first disposable-reseed strategy for comparable later scenarios.
- Required valid credentials only, no guessing/retry/lockout experiment, clear
  unexpected 401/403 metrics, and no token/secret leakage.
- Proposed a committed non-secret workflow CSV plus ignored/private credential
  mapping. Multiple valid customer accounts are recommended but not yet
  available or approved.
- Defined native/custom metric meanings with every future value explicitly
  `NOT MEASURED`; no numeric threshold was selected.
- Identified four candidate think-time points without assigning durations.
- Required one shared workflow implementation for Load/Stress/Spike; only
  later workload/output configuration may differ.

### Phase A boundary and verification

No SUT process or HTTP request was executed. No data file, k6 script, workload,
think-time value, threshold, result, dependency installation, commit, push, or
publication was created/performed. The work was documentation-only and based on
human-approved source/runtime evidence.

### Subsequent Phase A human review

- Received: 2026-09-01 13:26:24 +07.
- Outcome: Phase A approved with one required clarification; H-031 explicitly
  authorized as `DONE BY HUMAN`.
- Human correction: the two order-detail HTTP calls are invariant executable
  validation substeps. They affect request count/latency/iteration duration and
  must not be described as having no effect on the executable workflow.
- Corrected invariant sequence: login → product search/list → product detail →
  checkout → verify pending → cancel exact order → verify canceled.
- Load, Stress, and Spike must all execute that same seven-request sequence;
  only workload models may differ.
- The correction is recorded in `docs/human-decisions.md` as HD-003 and appended
  to the detailed Interaction 007 record without erasing the original output.

## Interaction 008 — Phase B workload model proposal

| Field | Record |
|-------|--------|
| AI tool | Codex CLI |
| Date/time | 2026-09-01 13:26:24 +07 (Asia/Ho_Chi_Minh) |
| Documentation completed | 2026-09-01 13:31:51 +07 |
| Phase | PHASE B — Workload Model Proposal |
| Human prompt/instruction | Apply the Phase A human correction, close H-031, and propose concrete but unvalidated Load/Stress/Spike models using the identical seven-request WF-03 sequence. Include think times, bounded executors/stages/recovery, model-only iteration/order estimates, scenario isolation, account analysis, safety-vs-threshold distinction, executor comparison, and a blank human-review table. Do not install/run k6, start the SUT, generate final scripts, finalize thresholds, or call assumptions measured. The complete prompt is preserved in [`interactions/008-phase-b-workload-model-proposal.md`](interactions/008-phase-b-workload-model-proposal.md). |
| AI output | Created an assumption-labelled proposal: 5-VU sustained Load plus a 2-VU alternative; progressive Stress capped at 20 VUs; 3→20-VU rapid Spike with recovery; 3–6 seconds total intentional think time and immediate lifecycle cancellation; VU-second-based state estimates explicitly not measured; fresh disposable scenario isolation; one-account initial feasibility with multiple accounts deferred to humans; operational safety guardrails separated from unset performance thresholds; and executor rationale. All review decisions/final values remain blank. |
| Human-review status | `WAITING FOR HUMAN` — H-032 and the workload review table require explicit corrections/approval before Phase C. |
| Corrections requested by human | None yet for Phase B. |

### Phase B files created

- `docs/workload-model-proposal.md`
- `ai-audit/interactions/008-phase-b-workload-model-proposal.md`

### Phase B files modified

- `docs/selected-workflow-specification.md`
- `docs/selected-workflow.md`
- `docs/human-decisions.md`
- `ai-audit/interactions/007-phase-a-selected-workflow-specification.md`
- `ai-audit/audit.md`
- `MANUAL-TODO.md` (`H-031` set to `DONE BY HUMAN`; `H-032` added for workload
  review)

### Phase B AI proposals

- Shared think time: uniform 0.5–1.0 seconds after login, 1.0–2.0 after search,
  and 1.5–3.0 after detail; immediate cancellation after pending verification.
- Load primary: `ramping-vus`, 0→5 over one minute, five VUs for five minutes,
  5→0 over one minute; conservative two-VU alternative.
- Stress primary: `ramping-vus`, progressive 2/5/10/15/20-VU ramps/holds,
  bounded at 20, then five-VU recovery and ramp-down.
- Spike primary: `ramping-vus`, three-VU baseline, 3→20 in ten seconds,
  45-second spike, 20→3 in ten seconds, two-minute recovery.
- All use 30-second graceful ramp-down/stop proposals and the same seven-request
  workflow.
- Integrated VU-seconds were calculated mechanically: Load 1,800, conservative
  Load 420, Stress 6,810, Spike 1,940. Estimated iteration/order ranges use an
  explicitly unmeasured 4–10-second iteration assumption and are not throughput.
- Proposed a fresh commit-pinned disposable runtime and unique artifact path for
  each scenario, preserving evidence before any reseed.
- One valid customer is initially feasible but shares login/user-row state;
  provisioning multiple accounts remains a future human decision.
- Operational aborts/caps were labelled safety guardrails. No p90/p95/p99,
  error-rate, throughput, capacity, or regression performance threshold was set.

### Phase B boundary

No SUT/backend process, HTTP request, k6 installation/execution, final script,
data file, measured value, final workload, performance threshold, commit, push,
or publication was created/performed.

### Subsequent Phase B human review

- Received/recorded: 2026-09-01 13:37:42 +07.
- The human's session-end instruction explicitly identifies Phase B as reviewed
  and requests the Load/Stress/Spike/think-time/account/isolation/safety values
  as human-approved decisions in the resume checkpoint.
- H-032 was therefore set to `DONE BY HUMAN`; the exact approved planning values
  are recorded in `docs/CODEX-RESUME-CHECKPOINT.md` and HD-004.
- The values remain unmeasured planning inputs, not production traffic,
  capacity, actual throughput/state growth, or final performance thresholds.
- Phase C was explicitly not started.

## Interaction 009 — Session-end resume checkpoint

| Field | Record |
|-------|--------|
| AI tool | Codex CLI |
| Date/time | 2026-09-01 13:37:42 +07 (Asia/Ho_Chi_Minh) |
| Documentation completed | 2026-09-01 13:39:27 +07 |
| Phase context | Phase B complete; Phase C not started |
| Human prompt/instruction | Create `docs/CODEX-RESUME-CHECKPOINT.md` for the next session with human-reviewed Phase B status, WF-03 and its exact sequence, approved workload/think-time/account/isolation/safety values, unresolved items, authoritative files, completed decisions, next intended Phase C, and critical safety/audit rules. Do not start Phase C; update the AI Audit and stop. The complete prompt is preserved in [`interactions/009-session-end-resume-checkpoint.md`](interactions/009-session-end-resume-checkpoint.md). |
| AI output | Created an authoritative resume checkpoint at commit `85af3ba8...`, recorded exact Phase B planning decisions while retaining their unmeasured status, listed unresolved work and continuation files, preserved Git/database/disposable-runtime/k6/human-checkpoint rules, recorded HD-004/H-032, and explicitly left Phase C not started. |
| Human-review status | Checkpoint explicitly requested by human; Phase B recorded reviewed. Future Phase C requires a new explicit instruction. |
| Corrections requested by human | None for the checkpoint at creation time. |

### Session-end files created

- `docs/CODEX-RESUME-CHECKPOINT.md`
- `ai-audit/interactions/009-session-end-resume-checkpoint.md`

### Session-end files modified

- `docs/human-decisions.md`
- `MANUAL-TODO.md` (`H-032` set to `DONE BY HUMAN`)
- `ai-audit/audit.md`

### Session-end verified state

- Commit remained `85af3ba875c88283615e22cb108f13e2fccaf0e9`.
- `origin` and `upstream` retained expected URLs; `remote.pushDefault=origin`;
  pushing upstream remains forbidden.
- Port 3000 was free and k6 remained uninstalled.
- Original database SHA-256 remained
  `c63f00544180ba1fbb1427a9b9dd3f1784842698809972f33ce90482e7420ba6`.
- No runtime, database mutation, Phase C artifact, dependency installation,
  commit, or push occurred.

## Interaction 010 — Resume context recovery and Phase B discrepancy

| Field | Record |
|-------|--------|
| AI tool | Codex CLI |
| Date/time | 2026-09-01 15:51:08 +07 (Asia/Ho_Chi_Minh) |
| Phase context | Resume reconstruction before Phase C |
| Human prompt/instruction | Reconstruct the project only from ordered repository evidence; verify identity, workflow, completed phases, and approved Phase B values; audit the new session; proceed to Phase C only if recovery succeeds; stop and show any repository/resume-summary difference. The complete prompt is preserved in [`interactions/010-resume-context-recovery-discrepancy.md`](interactions/010-resume-context-recovery-discrepancy.md). |
| AI output | Read all nine assignment-PDF pages and every requested context source in order, plus recent Interactions 007–009 and required Git/OS/tool checks. Most checkpoint facts matched, but the prompt conflicted with the human-approved repository on pending-to-cancel think time and the approved account strategy. Applied the explicit stop rule and did not begin Phase C. |
| Human-review status | **RESOLVED BY HUMAN REVIEW** on 2026-09-01 15:58:08 +07; both conflicting values were explicitly declared new corrections. |
| Corrections requested by human | Preserve the old values, then supersede them with pending→cancel random 0.5–1.0 s and a design for up to 20 disposable-runtime dedicated accounts. |

### Resume verification result

- Confirmed student Phạm Ngọc Gia Bảo (`23127027`), tool k6, macOS, WF-03,
  its seven-request executable sequence, four-person-group uniqueness, and the
  recorded completion/review status through Phase B. Phase C remains not
  started.
- Recovered the repository's exact Load, Stress, and Spike planning timelines.
  They remain unmeasured planning inputs, not capacity or final thresholds.
- Confirmed fresh comparable disposable runtime isolation per official
  scenario and evidence preservation before reset.
- Git remained on `main` at `85af3ba`, tracking `origin/main`, with expected
  remotes and `remote.pushDefault=origin`. k6 remained absent.

### Discrepancy and boundary

1. The prompt states random `0.5–1.0 s` from pending verification to
   cancellation; the authoritative checkpoint records `0 s` immediate
   lifecycle completion.
2. The prompt states a dedicated-account strategy targeting up to 20 accounts;
   the authoritative checkpoint approves one seeded customer initially and
   leaves multi-account provisioning as a future human decision.

Because the prompt explicitly required stopping on any difference, no
`docs/test-data-strategy.md`, Phase C design, private credential file,
provisioning, `.gitignore` rule, or `MANUAL-TODO.md` change was made. No SUT,
database, k6, performance-test, commit, push, or external action occurred.

### Subsequent resolution

The human explicitly resolved both discrepancies as new Phase B corrections.
The historical values remain in Interaction 010 and earlier records; HD-005 and
Interaction 011 contain the superseding decision. This later resolution does
not rewrite the fact that Codex correctly stopped before receiving it.

## Interaction 011 — Phase B corrections and Phase C test-data strategy

| Field | Record |
|-------|--------|
| AI tool | Codex CLI |
| Date/time | 2026-09-01 15:58:08 +07 (Asia/Ho_Chi_Minh) |
| Documentation completed | 2026-09-01 16:06:13 +07 |
| Phase | Phase B correction resolution; PHASE C — Test-Data Strategy |
| Human prompt/instruction | Declare the two differences intentional new human corrections, preserve prior values, update authoritative Phase B records, resolve the discrepancy checkpoint, and design Phase C public/private data, disposable provisioning for up to 20 customers, deterministic VU mapping, product/address/quantity inputs, correlation boundaries, secret handling, and comparable preconditioning. Do not provision accounts, create real credentials, install k6, generate final scripts, or execute tests. The complete prompt is preserved in [`interactions/011-phase-b-corrections-phase-c-test-data-strategy.md`](interactions/011-phase-b-corrections-phase-c-test-data-strategy.md). |
| AI output | Preserved the old `0 s` and one-seeded-account values, recorded HD-005, and made random 0.5–1.0 s plus an up-to-20 dedicated disposable-account design current. Source-backed Phase C uses sequential registration outside measurement, deterministic VU/account rows, response-owned dynamic correlation, runtime-only credentials, strict pool validation, safe product/address/quantity data, narrow proposed ignore rules, and identical fresh preconditioning for all scenarios. |
| Human-review status | **APPROVED WITH CORRECTIONS** on 2026-09-01; H-033 set `DONE BY HUMAN` only after correction/artifact validation. |
| Corrections requested by human | Verify quantity against real WF-03 and remove it if unused; create approved safe artifacts; reinforce provisioning as separate preconditioning before measured k6. |

### Source evidence used

- `backend/server.js`: registration, login, product search/detail, checkout,
  cancellation, and order-detail behavior.
- `backend/database.js`: reset-on-start, users schema/default role, seed users,
  products, orders, and absence of email uniqueness.
- Read-only original SQLite schema/seed inspection; no mutation.
- Existing Phase A/B workflow, correlation, isolation, human decision, resume,
  and audit records.
- Current repository ignore state: `.gitignore` is absent.

### Files created

- `docs/test-data-strategy.md`
- `ai-audit/interactions/011-phase-b-corrections-phase-c-test-data-strategy.md`

### Files modified

- `docs/workload-model-proposal.md`
- `docs/CODEX-RESUME-CHECKPOINT.md`
- `docs/human-decisions.md`
- `docs/selected-workflow-specification.md` (Phase C supersession note; original
  Phase A data proposal retained)
- `ai-audit/interactions/010-resume-context-recovery-discrepancy.md`
- `ai-audit/audit.md`
- `MANUAL-TODO.md`

### Phase C outcome and boundary

- Planned public schema:
  `row_id,account_key,search_term,expected_product_name,quantity,shipping_address`.
- Private runtime schema:
  `account_key,email,password,expected_role`.
- Account keys map directly from VU 1..20 to slots 01..20; Load activates the
  first five, Stress/Spike can activate all 20, and the pilot uses the first two.
- Public rows use exact reviewed seed-product matching, quantity one, and
  synthetic per-slot addresses.
- JWT, user ID, product ID, price, checkout total, and order ID are runtime
  values; response-owned values are forbidden in CSV.
- Official scenarios fail preflight if the complete 20-account pool is not
  validated. No shared/seeded fallback or silent peak reduction is allowed.
- Registration and account-validation traffic are setup and excluded from
  measured WF-03 artifacts.

No account, credential file, password, JWT, public CSV, `.gitignore` change,
provisioning helper, SUT process, HTTP request, database mutation, k6 action,
final scenario script, performance result, commit, push, or publication was
created/performed.

### Subsequent Phase C human review

- The human approved the overall design and explicitly authorized H-033 after
  corrections were applied.
- Quantity was verified against source and the selected smoke: checkout accepts
  only amount/address, the smoke used detail price directly, and the flow has no
  quantity consumer. It was removed from the final public schema.
- The human approved 20 public rows, private schema/template, separate
  preconditioning, complete pool validation, dedicated VU mapping, dynamic
  correlation, narrow ignore rules, and equivalent scenario setup.
- The original AI proposal, human review, and final decision are preserved in
  `docs/test-data-strategy.md`, HD-006, Interaction 011, and Interaction 012.

## Interaction 012 — Phase C review and Phase D correlation strategy

| Field | Record |
|-------|--------|
| AI tool | Codex CLI |
| Date/time | 2026-09-01 16:15:12 +07 (Asia/Ho_Chi_Minh) |
| Documentation completed | 2026-09-01 16:19:22 +07 |
| Phase | Phase C correction/finalization; PHASE D — Authentication and Dynamic Correlation Strategy |
| Human prompt/instruction | Approve Phase C with a mandatory quantity-use validation, safe creation of the 20-row public CSV/template/README/narrow ignore rules, strict separation of account setup from official metrics, complete pool validation and dedicated VU mapping; mark H-033 done only after corrections; then design Phase D dynamic correlation, ownership/lifetime/failure behavior, VU isolation, and stable request grouping/tagging without implementation or execution. The complete prompt is preserved in [`interactions/012-phase-c-review-phase-d-correlation-strategy.md`](interactions/012-phase-c-review-phase-d-correlation-strategy.md). |
| AI output | Proved quantity unused and removed it; created/validated the authorized safe artifacts; recorded HD-006 and H-033 complete; verified official k6 execution-ID documentation; created a seven-step correlation/fail-fast/isolation/tagging strategy and opened H-034 for human review. |
| Human-review status | Phase C `DONE BY HUMAN`; Phase D `WAITING FOR HUMAN`. |
| Corrections requested by human | None yet for Phase D. |

### Evidence and verification

- Source checkout reads only `total_amount` and `shipping_address`; selected
  WF-03 smoke submitted only those fields and used normalized detail price.
- `workflow.csv` passed exact header, 20-row, sequential key, five-product
  rotation, synthetic address, and uniqueness validation.
- `credentials.template.csv` passed exact private header and placeholder-only
  validation. No local/private credential file exists.
- All four approved private paths are ignored; each public CSV/template/README
  was checked individually and remains trackable.
- The first multi-path `git check-ignore --quiet` validation emitted the genuine
  error that quiet mode accepts one pathname. The corrected per-file checks all
  passed; the failed command is preserved rather than concealed.
- Official Grafana k6 documentation for `k6/execution` and data parameterization
  was read to verify `exec.vu.idInTest` as globally unique/test-wide and suitable
  for per-VU data binding. No tool installation occurred.

### Files created

- `.gitignore`
- `performance/data/workflow.csv`
- `performance/data/credentials.template.csv`
- `performance/data/README.md`
- `docs/correlation-strategy.md`
- `ai-audit/interactions/012-phase-c-review-phase-d-correlation-strategy.md`

### Files modified

- `docs/test-data-strategy.md`
- `docs/selected-workflow-specification.md`
- `docs/CODEX-RESUME-CHECKPOINT.md`
- `docs/human-decisions.md`
- `ai-audit/audit.md`
- `MANUAL-TODO.md`

### Phase D outcome and boundary

- Proposed VU source: `exec.vu.idInTest`, validated in `1..20`, with direct
  public/private row binding and no fallback.
- Per-step design covers login/JWT, search/product ID, detail/price, checkout/
  order ID, pending check, corrected cancellation pause, same-order cancel, and
  final canceled check.
- Every dynamic value has explicit source, validation, lifetime, owner, and
  failure behavior; mutable correlation state is iteration-local only.
- Stable groups/tags distinguish all seven measured requests without dynamic
  IDs, secrets, or added API calls.
- Proposed next phase: Phase E — Checks, Custom Metrics, and Safety-Stop
  Specification, subject to H-034 review.

No account, real credential/password/JWT, provisioning helper/run, SUT process,
HTTP request, database mutation, k6 action, final scenario script, performance
result, commit, push, or publication was created/performed.

### Subsequent Phase D human review

- The human approved the mapping guard, exact product match, post-checkout
  evidence policy, groups/tags, and response-correlation lifetimes.
- The human corrected the original AI proposal that the first unexpected login
  `401`/`403` should stop the whole test. The current decision fails only that
  isolated iteration; a test-level abort is reserved for confirmed lockout or
  clear systemic/runtime danger.
- The original proposal, human review, and final decision remain visible in
  `docs/correlation-strategy.md`, HD-007, Interaction 012, and Interaction 013.
- H-034 was set to `DONE BY HUMAN` only after these records were applied.

## Interaction 013 — Phase D review and Phase E checks, metrics, safety, and reports

| Field | Record |
|-------|--------|
| AI tool | Codex CLI |
| Date/time | 2026-09-01 16:29:28 +07 (Asia/Ho_Chi_Minh) |
| Documentation completed | 2026-09-01 16:33:23 +07 |
| Phase | Phase D correction/finalization; PHASE E — Checks, Custom Metrics, Safety Stops, and Report/Output Proposal |
| Human prompt/instruction | Approve Phase D with guarded separate-run `exec.vu.idInTest` mapping, exactly one exact product match, visible post-checkout residual lifecycle evidence, stable tags/lifetimes, and a correction making an isolated unexpected login `401`/`403` an iteration failure rather than an automatic whole-test abort; then design Phase E exact checks, low-cardinality metrics, one outcome per iteration, failure taxonomy, review-required operational safety stops, and an explicitly unresolved three-output/JTL/HTML proposal. The complete actual prompt is preserved in [`interactions/013-phase-d-review-phase-e-checks-metrics-reports.md`](interactions/013-phase-d-review-phase-e-checks-metrics-reports.md). |
| AI output | Preserved the old auth proposal, human correction, and final decision; recorded HD-007 and H-034 completion; created exact seven-step checks, a minimal custom-metric/one-outcome design, failure taxonomy and operational guardrail proposal; documented both assignment output clauses, current official k6 output capabilities, three distinct primary outputs, authentic raw-data rules, two unresolved compliance paths, and an exact lecturer/TA question. |
| Human-review status | Phase D `DONE BY HUMAN`; Phase E H-035 `WAITING FOR HUMAN`; k6 `.jtl`/HTML H-002 `UNRESOLVED`. |
| Corrections requested by human | Replace “abort whole test on first unexpected login 401/403” with isolated iteration failure; retain test-level safety abort only for confirmed lockout/systemic unsafe execution. |

### Evidence and documentation research

- Read the existing authoritative correlation, human-decision, workload,
  resume, assignment-requirement, manual, and AI-audit records.
- The local attempt to use `pdftotext` failed because that command is absent;
  no package was installed. Existing PDF traceability in
  `docs/assignment-requirements.md` was used to reference T1-07 and T1-14.
- Current official Grafana k6 documentation was checked for native granular
  JSON/CSV, multiple outputs, end/custom summaries, and web-dashboard HTML
  export. No k6 binary was installed or executed.
- The official supported-output list does not document native JMeter JTL; this
  is recorded as a documentation-based inference that must be rechecked against
  the future pinned version, not as fabricated execution evidence.
- Final read-only validation found branch `main` at `85af3ba`, tracking
  `origin/main`; remotes `origin` and `upstream` unchanged; and
  `remote.pushDefault=origin`.
- Original `backend/database.sqlite` remained SHA-256
  `c63f00544180ba1fbb1427a9b9dd3f1784842698809972f33ce90482e7420ba6`;
  port 3000 had no listener; k6 remained absent.
- Public workflow data retained its approved header and 20 rows; the credential
  template retained only its header and one placeholder example. No local
  credential file exists. The four private paths are ignored and public
  artifacts remain trackable.

### Files created

- `docs/checks-metrics-safety.md`
- `docs/report-output-mapping.md`
- `ai-audit/interactions/013-phase-d-review-phase-e-checks-metrics-reports.md`

### Files modified

- `docs/correlation-strategy.md`
- `docs/workload-model-proposal.md`
- `docs/CODEX-RESUME-CHECKPOINT.md`
- `docs/human-decisions.md`
- `ai-audit/audit.md`
- `MANUAL-TODO.md`

### Phase E proposed outcome and boundary

- Native tagged `http_req_duration` provides the seven endpoint Trends; custom
  duplicates are deliberately avoided.
- A custom attempted Counter plus exactly one final Boolean workflow Rate sample
  provides the business denominator; a single tagged failure Counter records at
  most the first terminal workflow failure.
- Created/canceled Counters expose incomplete lifecycle residue; cancellation
  counts only after the final same-order canceled probe.
- Six failure classes distinguish transport/protocol, authentication,
  correlation/data, business assertion, lifecycle, and runtime/safety effects.
- Every numeric operational abort candidate is explicitly marked for human
  review and is not a performance threshold. A first isolated auth response is
  explicitly excluded from test-level abort behavior.
- Candidate primary outputs are Load end summary, Stress native CSV time
  series, and Spike native web-dashboard HTML, with native granular JSON as the
  canonical raw artifact for each scenario.
- Literal `.jtl` and three-HTML-folder compliance remains unresolved; no data
  may be renamed or converted and presented as native JMeter JTL.

No account, real credential/password/JWT, provisioning helper/run, SUT process,
HTTP request, database mutation, k6 action, final scenario script, performance
result, JTL/HTML result, report dependency, commit, push, or publication was
created/performed.

### Subsequent Phase E human review

- The human approved the exact checks, minimal custom/native metric model,
  guarded one-outcome semantics, six-class taxonomy, immediate unsafe-runtime
  stops, 2 GiB disk minimum, and bounded workload/wall-clock/graceful controls.
- The human explicitly deferred four numeric AI abort proposals—5 connection
  failures, 5 cross-account auth failures, 10 transactional 5xx responses, and
  20% failures across two 15-second windows—until controlled pilot/runtime
  evidence. They remain history and are not implemented.
- The Load-summary/Stress-CSV/Spike-dashboard mapping was conditionally approved
  as a technical proposal only. H-002 remains waiting for lecturer/TA; the
  question has not been sent and no response exists.
- H-035 was set to `DONE BY HUMAN` only after HD-008 and authoritative records
  were updated.

## Interaction 014 — Phase E review and Phase F static k6 architecture

| Field | Record |
|---|---|
| AI tool | Codex CLI |
| Date/time | 2026-09-01 16:41:04 +07 (Asia/Ho_Chi_Minh) |
| Documentation/static review completed | 2026-09-01 16:54:05 +07 |
| Phase | Phase E correction/finalization; PHASE F — Shared k6 Architecture and Static Implementation Review |
| Human prompt/instruction | Approve Phase E checks/metrics/outcome/taxonomy/immediate safety and bounded disk/time/VUs; defer four numeric error-abort rules pending pilot evidence; conditionally approve the output mapping while H-002 waits unsent for lecturer/TA; then create a clearly draft, shared, static-only k6 architecture with one WF-03 implementation and exact workloads, without installing/running k6 or the SUT, provisioning accounts, or creating results. The complete actual prompt is preserved in [`interactions/014-phase-e-review-phase-f-static-k6.md`](interactions/014-phase-e-review-phase-f-static-k6.md). |
| AI output | Recorded HD-008/H-035 and H-002 waiting state; created the TA register; created a compact config/data/check/metric/workflow/scenario/output architecture with one business implementation and three thin entry points; represented exact Load/12m30s Stress/Spike plans; statically checked grammar, shared-flow structure, tags, guards, secrets, thresholds, and correlation; opened H-036. |
| Human-review status | Phase E `DONE BY HUMAN`; Phase F H-036 `WAITING FOR HUMAN`; H-002 `WAITING FOR LECTURER/TA CLARIFICATION`. |
| Runtime verification | **NONE — draft source is not k6/runtime verified** |

### Files created

- `performance/config/workloads.js`
- `performance/config/runtime.js`
- `performance/config/output.js`
- `performance/lib/csv.js`
- `performance/lib/data.js`
- `performance/lib/auth.js`
- `performance/lib/checks.js`
- `performance/lib/metrics.js`
- `performance/lib/workflow.js`
- `performance/scenarios/load.js`
- `performance/scenarios/stress.js`
- `performance/scenarios/spike.js`
- `performance/tools/README.md`
- `docs/k6-architecture.md`
- `docs/ta-clarifications.md`
- `ai-audit/interactions/014-phase-e-review-phase-f-static-k6.md`

### Files modified

- `docs/checks-metrics-safety.md`
- `docs/report-output-mapping.md`
- `docs/correlation-strategy.md`
- `docs/workload-model-proposal.md`
- `docs/CODEX-RESUME-CHECKPOINT.md`
- `docs/human-decisions.md`
- `performance/data/README.md`
- `MANUAL-TODO.md`
- `ai-audit/audit.md`

### Static findings and genuine validation output

- Two initial combined validation commands failed before their checks with the
  genuine zsh message `unmatched "` due command quoting. The commands were
  corrected; the failure is preserved here rather than hidden.
- General JavaScript grammar passed `node --check` for all 12 draft `.js` files.
  This is not a k6 compatibility or execution claim.
- Static extraction counted 38 unique approved stable check names and found all
  seven approved custom metric names.
- Normalizing only scenario names made the three thin entry files produce the
  same SHA-256; no `/api/` endpoint occurs in them. All seven endpoint references
  are in shared `performance/lib/` code, and all business sequencing remains in
  the one shared `workflow.js` orchestrator.
- No final threshold/deferred numeric abort code, static JWT/product ID/order ID,
  scenario-specific business flow, modulo/account fallback, or real credential
  artifact was found.
- The Stress array contains 13 stages totaling 750 seconds, matching 12m30s.
- Stable request names/steps are used and native `url` system tags are excluded
  to prevent correlated order paths becoming metric labels.
- Expected private paths remain ignored. Public data/templates/docs remain
  trackable.
- Original `backend/database.sqlite` SHA-256 remained
  `c63f00544180ba1fbb1427a9b9dd3f1784842698809972f33ce90482e7420ba6`;
  k6 remained absent; port 3000 had no listener.

### Phase F boundary

- The source uses current documented k6 interfaces but is explicitly **DRAFT —
  NOT RUNTIME VERIFIED**. `node --check` cannot validate k6 imports, executor
  behavior, `open()` path semantics, `SharedArray`, `exec.test.abort`, HTTP
  behavior, output overhead, or SUT contracts.
- No final p95/RPS/error/capacity thresholds or four deferred numeric abort
  conditions are coded.
- External commit/database/account/disk/PID/port/evidence/wall-clock preflight
  and runner logic is intentionally not claimed or implemented yet.
- Output mapping is metadata isolated from the workflow; no JTL conversion or
  compliance claim exists.

No k6 install/run, SUT process, HTTP request, account, credential, provisioning,
database mutation, performance result, raw output, report, screenshot, commit,
push, or publication was created/performed.

### Subsequent Phase F human review and Git recovery authorization

- The human approved the one shared workflow, workload-only scenario entries,
  static checks/metrics/outcome/failure implementation, dedicated account
  mapping, and immediate safety model without claiming runtime compatibility.
- The four numeric error-abort proposals and all final performance thresholds
  remain deferred/undefined.
- The human resolved H-002 by selecting genuine distinct k6-equivalent outputs
  under the PDF. The earlier AI concern and unsent question remain preserved;
  no lecturer/TA response is invented and no JMeter artifact is fabricated.
- Git inspection showed all Phase 0–F artifacts had been developed before local
  procedural commits. The human authorized truthful logical baseline commits,
  prohibited fake/backdated history, and prohibited push.
- Local baseline commits created so far:
  `e488cf4` discovery/runtime evidence; `e0d2df5` workflow/workload/data;
  `3f1e869` correlation/checks/reporting; `1674905` shared draft k6 source.
- Each commit's staged names/stat/check, forbidden path check, and secret scan
  were performed. Group 3 had real trailing-whitespace findings corrected before
  commit. Group 4's broad scan flagged the safe source reference
  `credential.password`; review confirmed no credential literal.
- Baseline group 5 was then committed as `7ac1229` for the human/audit/manual
  records. No baseline commit was pushed.

## Interaction 015 — Phase F review, Git recovery, and Phase G toolchain/pilot preparation

| Field | Record |
|---|---|
| AI tool | Codex CLI |
| Human instruction received | 2026-09-01 17:01:08 +07 (Asia/Ho_Chi_Minh) |
| Phase G record updated | 2026-09-01 17:28:20 +07 |
| Human prompt | Approve Phase F and shared WF-03 invariants; resolve H-002 by human k6-equivalent interpretation; truthfully recover local Git commits; install/pin k6 through existing Homebrew; validate init/output capabilities without SUT HTTP; prepare but do not execute the 2-VU Pilot/helper/runbook. Full actual prompt: [`interactions/015-phase-f-review-phase-g-toolchain.md`](interactions/015-phase-f-review-phase-g-toolchain.md). |
| Human-review status | Phase F/H-036 `DONE BY HUMAN`; H-002 `RESOLVED BY HUMAN DECISION`; Pilot H-037 `WAITING FOR HUMAN` |
| Performance execution | **NONE** |
| Phase G implementation commit | `d9291f7` — `test: pin k6 and prepare 2-VU pilot` |

### Actual Git recovery

- Before recovery, Phase 0–F artifacts existed without local procedural
  commits. No fake/backdated commit, history rewrite, or push was made.
- Five actual baseline commits were created after staged-file, staged-stat,
  secret/reference, and forbidden-artifact checks:
  `e488cf4`, `e0d2df5`, `3f1e869`, `1674905`, and `7ac1229`.
- The assignment PDF is protected by an exact root ignore rule. No credential,
  secret, disposable runtime, or temporary capability file entered Git.
- Branch `main` became five commits ahead of `origin/main`; remotes and
  `remote.pushDefault=origin` remained unchanged. Nothing was pushed.

### Actual installation record

- Preflight found Homebrew 6.0.20 at `/opt/homebrew/bin/brew`, no existing k6,
  arm64, macOS 26.5.2 build 25F84, and no port-3000 listener.
- Authorized `brew install k6` without sudo installed the 2.2.0 bottle.
- Pinned binary: `/opt/homebrew/bin/k6`; version
  `k6 v2.2.0 (commit/devel, go1.26.5, darwin/arm64)`; binary SHA-256
  `621ce55919a8067249cfbcc3da4e5ad5316a5706542a9a68667a40a2ec9dbd45`.
- A later `brew info k6` attempted an online formula refresh and failed DNS, but
  still showed installed/linked k6 2.2.0. This failure did not alter the binary.

### Genuine no-HTTP compatibility evidence

- A 20-row synthetic credential file and probe scripts existed only under
  `/private/tmp/eshop-hw05-k6-init.a5sx7d`; no value is treated as a real account.
- All official scenario entries passed `k6 inspect --execution-requirements`:
  Load max 5 and 7m30s including graceful stop; Stress exact 13 stages/max 20
  and 13m including graceful stop; Spike exact stages/max 20 and 6m35s
  including graceful stop. Thresholds were absent.
- The prepared Pilot passed after using explicit `-e` variables: 30s to 2,
  three-minute hold, 30s to zero, max 2, 4m30s including graceful stop.
- `k6 deps` resolved local modules plus built-in `k6`, `k6/http`, `k6/data`,
  `k6/execution`, and `k6/metrics`; no custom build was required.
- A no-HTTP runtime probe verified SharedArray/open, one-based VU identity,
  `exec.test.abort`, metric constructors/samples, scenario dispatch, system tags,
  and summary-hook compatibility. The backend remained stopped.

### Genuine output-capability evidence and corrections

- An invalid output-name probe failed before traffic and listed installed output
  types including JSON, CSV, and web dashboard; no file was produced.
- A first one-iteration JSON/CSV probe wrote those private formats, while the
  dashboard bind was sandbox-blocked/too short and no summary file appeared
  because summary mode was disabled. These failures are retained.
- A corrected two-second no-HTTP probe on an ephemeral local dashboard port
  wrote actual private JSON, CSV, and HTML. A further summary-mode-enabled
  no-HTTP probe wrote actual private custom-summary JSON.
- These files prove tool syntax/capability only. They are outside Git, are not
  SUT/performance results, and are not homework reports. No JTL was produced;
  the installed output registry contains no native JTL option.
- The exact 220 KiB probe directory was removed after documentation, including
  its synthetic credential and capability outputs; no repository file was
  removed.
- The first staged secret-scan command failed before scanning with a genuine
  zsh `bad pattern` quoting error. The corrected simpler scan found only
  intended source/schema password/token references and no credential literal,
  private key, common access-token signature, or forbidden staged path.

### Phase G draft changes and execution boundary

- Created `docs/k6-toolchain.md`, `runbooks/k6-pilot.md`, internal
  `performance/scenarios/pilot.js`, and unexecuted
  `performance/tools/provision-accounts.mjs`; updated architecture/output/
  resume/manual/human-decision records.
- Pilot samples are isolated as `scenario=pilot,traffic=pilot`; official
  scenarios remain `traffic=measured` and call the same business function.
- The helper uses real registration/login/my-orders contracts, secure random
  passwords, private mode-0600 output outside Git, redacted evidence, and
  disposable path/marker/database-inode guards. It has not been executed.
- Source revealed that starting this backend resets/seeds its database.
  Therefore the proposed pilot starts the disposable backend once, completes
  setup-only provisioning, then runs against that same owned process; restarting
  after setup would erase accounts. H-037 must approve this exact ordering.

No SUT start, port-3000 listener, registration, account, real credential,
workflow HTTP, database mutation, Pilot/Load/Stress/Spike/endurance run,
measured result, official report, official filename/date, screenshot, JTL,
push, or publication occurred.

## Interaction 016 — Phase G review and controlled 2-VU Pilot

| Field | Actual record |
|---|---|
| AI tool | Codex CLI |
| Human approval | One controlled 2-VU disposable Pilot with one-start backend, exactly two accounts, bounded output/evidence, no official interpretation |
| Actual prompt | Preserved verbatim in [`interactions/016-phase-g-review-2vu-pilot-execution.md`](interactions/016-phase-g-review-2vu-pilot-execution.md) |
| Artifact ID | `20260901T212619+0700` |
| Source/tool | Commit `41c6fecf826148e73a4ce3c651791d90650e595c`; k6 v2.2.0 darwin/arm64 |
| Result | **FAILED RUNTIME VALIDATION BEFORE HTTP — NOT OFFICIAL** |
| Local evidence commit | `11c0a7f` — `test: record failed 2-VU pilot evidence` |
| Current human gate | H-038 Pilot results/correction review |

### Preflight and setup evidence

- Attempt 01 preserved a sandbox process-lifecycle failure. The sandboxed
  backend printed startup lines but did not remain alive; no provisioning or k6
  traffic occurred. It was not restarted.
- Attempt 02 used a new clone pinned to `41c6fec`, distinct DB inode, exact
  disposable marker, new evidence paths, >2 GiB free, and locked dependencies.
- The first sandboxed `npm ci` in Attempt 01 failed registry DNS and reported an
  npm exit-handler error. A network-permitted identical lockfile install
  succeeded. npm reported deprecated `prebuild-install` and four audit
  vulnerabilities; no automatic fix occurred.
- One externally permitted backend PID 20315 started at 21:30:36 +07, owned
  port 3000, had cwd in Attempt 02, reset/reseeded the clone DB, and remained the
  same process through setup/Pilot.
- Reset checks: SQLite integrity `ok`, two seed users, five exact products, zero
  orders, valid public rows 01/02, original DB hash unchanged.
- The reviewed helper sequentially provisioned exactly customer keys 01/02 via
  real SUT registration, wrote mode-0600 credentials outside Git, and validated
  both real logins/role/unlocked/zero-orders. No password/JWT was printed.

### Exact Pilot execution and real failure

- The exact four-minute ramping-vus command is preserved with native JSON, CSV,
  summary JSON, dashboard HTML, stdout, and stderr paths.
- k6 reported max 2 VUs, full 4m schedule, 0 interrupted iterations, and
  9,699,772 iterations/attempted/failure samples at 0% workflow success.
- HTTP bytes sent/received were both zero; no login, correlation, check,
  checkout, order, cancellation, or endpoint latency occurred.
- Every iteration failed at the first group boundary. A no-HTTP diagnostic
  confirmed pinned k6's exact cause: `group and check names may not contain
  '::'`. This is a script/k6 compatibility and runtime/safety failure, not a
  confirmed SUT bug.
- The generic catch hid the underlying error and allowed an immediate exception
  loop. It generated exact sizes: 13,045,547,159-byte JSON,
  5,984,776,809-byte CSV, and 4,161,202,188-byte stderr.
- Custom metrics also used hard-coded `traffic=measured`, while native scenario
  metrics correctly used `traffic=pilot`. `scenario=pilot` still distinguishes
  them, but the evidence tag is defective.
- The orchestration wrapper closed without returning the numeric Pilot exit
  code; it is recorded as not captured. A diagnostic demonstrated k6 may return
  code 0 despite per-iteration script exceptions.
- Scenario execution ended at 4m00s; output completion was about 5m19s from the
  documented command start, roughly 19s beyond the external cap due giant
  output flushing. This is recorded as an output/runtime safety failure.

### Shutdown, evidence, and integrity

- Exact backend PID 20315 received Ctrl-C; harness exit code 1 from interrupt;
  port 3000 then had no listener.
- Disposable DB ended integrity `ok`, four users, two Pilot users, zero orders.
- Original DB SHA-256 remained
  `c63f00544180ba1fbb1427a9b9dd3f1784842698809972f33ce90482e7420ba6`
  on original device/inode; no original tracked runtime mutation occurred.
- Large files remain local/checksummed and are not staged because they total
  about 21.6 GiB. They were not deleted, renamed, replaced, or called official.
- Small artifacts passed full known-pattern scans. First/last 100 MiB of each
  giant file passed. A complete giant-file scan was stopped after several
  match-free minutes; complete byte-for-byte secret-scan coverage is not
  claimed. Zero network data and static metric schemas provide additional
  bounded evidence.

### Correction/review boundary

No source fix and no rerun occurred. H-038 must review: seven safe group-name
replacements; custom `context.traffic`; deterministic abort on unexpected
runtime/script exception; reliable exit and full wall-clock enforcement;
corrected-Pilot output scope; and archival/cleanup of 21.6 GiB local failure
evidence. Four deferred numeric abort rules and all final performance thresholds
remain deferred. The small evidence/documentation set was truthfully committed
locally as `11c0a7f`; credentials and the three giant raw files were excluded.
No official scenario or push occurred.

## Interaction 017 — Failed-Pilot review and corrected-Pilot authorization

| Field | Actual record |
|---|---|
| AI tool | Codex CLI |
| Recorded | 2026-09-01 22:07:02 +0700 |
| Human review | Failed Pilot confirmed as test-harness/k6 compatibility defect, not SUT performance or a confirmed SUT bug |
| Full prompt | [`interactions/017-failed-pilot-review-corrected-pilot.md`](interactions/017-failed-pilot-review-corrected-pilot.md) |
| H-038 | **DONE BY HUMAN** after application/commit of the approved corrections |
| New gate | H-039 corrected-Pilot results review; official execution remains prohibited |

### Preserved historical transition

- **Old AI/draft:** group names used `wf03::NN_step`, custom metrics hard-coded
  `traffic=measured`, unexpected exceptions were rethrown generically, and no
  exact-PID runner existed.
- **Observed Pilot failure:** pinned k6 rejected `::`; the generic exception
  path tight-looped 9,699,772 iterations before HTTP, generated about 21.6 GiB,
  and failed to return a captured numeric process exit.
- **Human-approved correction:** k6-safe group names, context-derived traffic,
  sanitized test-level abort for unexpected harness/runtime exceptions, a
  five-minute exact-PID runner, bounded Pilot output, and exact deletion of the
  three untracked bulk files after committed evidence preservation.

Before deletion, the committed artifact inventory preserves all three original
paths, exact byte sizes, timestamps, SHA-256 values, producer/output type, exact
root error, bounded stderr/diagnostic evidence, failed summary counts, HTTP bytes
0/0, and the no-SUT-request conclusion. The deletion is authorized only after
this record and the inventory are committed. One fresh corrected 2-VU Pilot is
authorized; no official scenario, threshold, or push is authorized.

### Actual correction, cleanup, and blocked corrected attempt

- Static validation found no remaining `::` in executable k6 code. Node/shell
  syntax checks and pinned-k6 init inspection passed with unchanged Pilot stages
  and tags. A no-HTTP abort probe demonstrated `exec.test.abort()` returns k6
  exit code 108 rather than continuing iterations.
- Fix commit `c75b514` contains only the approved names, context traffic tag,
  unexpected-exception abort, exact-PID runner, human/audit records, and
  pre-deletion evidence. No workflow request/assertion/order/stage changed.
- At 2026-09-01 22:13:05 +07, the three exact authorized untracked files were
  deleted. **FAILED PILOT BULK RAW ARTIFACTS REMOVED AFTER HUMAN-APPROVED
  EVIDENCE PRESERVATION.** Absence checks passed and filesystem free space
  increased by 22,674,988 KiB (about 21.62 GiB).
- Corrected Attempt `20260901T221331+0700` used a new clone pinned to `c75b514`,
  new private/output paths, distinct DB inode, clone-only locked dependencies,
  and one backend PID 22146. PID/cwd/port, reset/seed/product/zero-order/disk,
  public rows, pinned k6, original hash, and readiness checks passed.
- The first setup-helper invocation was made from the clone and failed safely
  with exit code 1 / `runtime_is_original_repository`. Script-relative
  `originalRoot` equaled the clone, so the guard stopped before private output,
  registration, or account creation. Disposable state remained two seed users,
  zero Pilot users, and zero orders.
- The failure was not silently retried with a different invocation. Owned PID
  22146 was stopped, port 3000 became free, both databases passed integrity,
  and the original hash remained unchanged. No k6 process, corrected Pilot
  traffic/result, official scenario, threshold, or push occurred.

Smallest proposal: on a new human-authorized fresh attempt, invoke the
same-commit helper from the actual original worktree while passing the clone as
`WF03_DISPOSABLE_ROOT`, which matches the helper's protection design. H-039 must
review this invocation correction; it is not silently assumed.

The genuine small blocked-attempt evidence and documentation were committed
locally as `aebd717` (`test: record corrected Pilot preflight failure`). No
credential, disposable DB/runtime, dependency tree, or nonexistent k6 result
was included. No push occurred.

## Interaction 018 — Invocation-boundary review and fresh corrected Pilot

| Field | Actual record |
|---|---|
| AI tool | Codex CLI |
| Recorded | 2026-09-01 22:35:38 +0700 |
| Human review | Blocked attempt confirmed as provisioning-helper invocation/setup defect; no account/k6 traffic; not SUT performance or confirmed SUT bug |
| Detailed prompt record | [`interactions/018-invocation-boundary-review-fresh-corrected-pilot.md`](interactions/018-invocation-boundary-review-fresh-corrected-pilot.md) |
| Invocation correction | Unchanged helper from actual original worktree; new clone passed explicitly as `WF03_DISPOSABLE_ROOT` |
| H-039 | **DONE BY HUMAN** after this record is committed |
| Next gate | H-040 fresh corrected-Pilot review; official execution remains prohibited |

The human prohibited helper/SUT/workflow/check/correlation/workload/metric
changes. Before registration, the original/helper root and new disposable root,
different DB inodes, marker, approved commit relationship, original hash,
backend PID/cwd/port, and exact localhost target must be recorded. A failed
boundary or two-account setup stops the attempt. Only one fresh bounded 2-VU
Pilot is authorized after every setup gate passes.

### Fresh result

- Documentation-only approval commit `34bb80e` preceded the new clone. The
  original and fresh runtime resolved to different absolute paths and DB
  inodes, both worktrees were at `34bb80e`, helper hashes matched, the marker was
  exact, and the original DB hash was unchanged.
- New clone `/private/tmp/eshop-hw05-fresh-corrected-pilot.wyN9jR/runtime`
  started backend PID 23201 once. PID/cwd/port/reset/seed/readiness gates passed.
- The unchanged helper ran from the actual original worktree with the clone as
  `WF03_DISPOSABLE_ROOT`; exit 0. Exactly customers 01/02 were created through
  real registration and passed private credential, authentication, role,
  unlocked, and zero-order validation. No helper semantic change occurred.
- Exact-PID runner started k6 PID 23298 and preserved native JSON, summary,
  stdout/stderr, command, metadata, and setup/backend evidence. Numeric k6 exit
  was 0; runner wall clock 246 seconds; watchdog did not fire; stderr was empty.
- Actual Pilot metrics: 81 attempts/successes; 0 terminal failures; 567 HTTP
  requests with 0 failures; 3,078 checks with 0 failures; 81 orders created and
  canceled; 0 unexpected-auth samples; lifecycle avg/median/p95
  758.33/761/963 ms. All custom samples had `scenario=pilot,traffic=pilot`.
- Runtime checks validated current credential/JWT/identity, exact product match,
  correlated product ID/detail/price, new order ID, same-order pending,
  cancellation, and final canceled state. Account 01 ended with 36 canceled
  orders and account 02 with 45, proving both dedicated slots participated.
- Exact backend PID stopped; port free; disposable DB `ok` with all 81 orders
  canceled; original DB `ok` and hash unchanged. Original worktree had no
  runtime node_modules, credentials, `.env.local`, DB mutation, or temporary
  secret. Full artifact scan found no password/JWT/Authorization/private email.

These are measured Pilot/runtime-validation observations, not official
performance results, thresholds, capacity, or Load conclusions. At that point,
H-040 review was required before official-plan finalization. No push occurred.

The genuine fresh Pilot artifact/evidence/documentation set was committed
locally as `e23caf4` (`test: record successful corrected 2-VU pilot`). Private
credentials, disposable database/dependencies, and secrets were excluded. No
push occurred.

## Interaction 019 — Successful Pilot approval and Phase I preparation

| Field | Actual record |
|---|---|
| AI tool | Codex CLI |
| Recorded | 2026-09-01 23:03:50 +0700 |
| Human review | Corrected 81/81 Pilot approved as shared-workflow runtime validation only; H-040 `DONE BY HUMAN` |
| Detailed interaction | [`interactions/019-successful-pilot-review-phase-i.md`](interactions/019-successful-pilot-review-phase-i.md) |
| Authorized work | Phase I final test-plan review and static official-execution preparation |
| Prohibited work | No official filenames, Load/Stress/Spike/endurance traffic, final thresholds, screenshots, fake JTL/reports, or push |
| Current gate | H-010 human creation/approval of the three official attributable filenames |

### Preserved Pilot correction history

1. The original AI draft used invalid `::` k6 group names.
2. The first Pilot exposed a tight unexpected-exception loop and pathological
   approximately 21.6-GiB output; it sent no HTTP and was not SUT evidence.
3. Human review corrected naming, context traffic tagging, unexpected-exception
   test abort, exact-PID wall-clock/exit capture, and bounded Pilot outputs.
4. The next fresh attempt exposed a clone-local provisioning-helper invocation
   boundary and stopped before account creation or k6.
5. Human review retained the guard and corrected invocation to the unchanged
   original-worktree helper targeting a new disposable clone.
6. Fresh corrected Pilot `20260901T223944+0700` passed 81/81 exact WF-03
   workflows. The human approved that runtime result without converting it into
   official performance evidence.

### Actual Phase I actions and boundaries

- Promoted only Pilot-exercised shared code/data/helper paths to accurate
  runtime-validated status; official entries remain explicitly unexecuted.
- Reverified the exact Load, Stress, and Spike stage arrays and 30-second
  graceful settings against repository evidence. No stage or threshold changed.
- Created the final historical human-review table, blank official filename
  checklist, deterministic 20-account preconditioning and lockout procedures,
  three official runbooks, macOS evidence-capture instructions, and genuine
  text hardware table. No screenshot or filename was generated.
- Prepared one scenario-neutral exact-PID official runner. It accepts only a
  human-created attributable plan, keeps `traffic=measured`, preserves native
  JSON for every scenario, adds Stress CSV and Spike dashboard, captures numeric
  exit/watchdog evidence, and contains no business workflow logic.
- Created only trackable scenario result placeholders saying no official result
  exists. No report content, JTL, raw result, credential, disposable runtime,
  account, backend process, or k6 traffic was generated.
- The first no-HTTP `k6 inspect` loop omitted k6's explicit `-e` flags; the
  existing localhost guard rejected all three entries. The corrected explicit
  `-e` invocation passed exact configs with `thresholds=null`. The temporary
  mode-0600 synthetic 20-row file was removed and port 3000 remained free.
- After staged path/secret/disposable/raw/official-filename checks, the truthful
  local Phase I preparation commit was created as `b914c3c`
  (`test: prepare reviewed official performance plans`). It was not pushed.

## Interaction 020 — Human official filenames and blocked wrapper validation

| Field | Actual record |
|---|---|
| AI tool | Codex CLI |
| Recorded | 2026-09-01 23:31:14 +0700 |
| Human action | Created the three official Load/Stress/Spike files under `performance/scenarios/official/` with date `20260901` |
| Detailed interaction | [`interactions/020-human-official-filenames-validation.md`](interactions/020-human-official-filenames-validation.md) |
| Filename outcome | PASS; H-010 `DONE BY HUMAN` |
| Executable-content outcome | BLOCKED on relocated relative paths; no Load preparation followed |

All basenames satisfy `^23127027_(Load|Stress|Spike)_20260901\.js$`. SHA-256
comparison showed each official file is byte-for-byte identical to its internal
counterpart:

- Load: `6acb45e2f490e0239582f718feafa2ed3e43268cc34a5dab24d9537be9a1dc5b`;
- Stress: `54f5d7329cdecdb45de8c894211019a1c2eeae6250e695bceea809a08ff743a8`;
- Spike: `c3e0049824b7f4b450880fc44c56c2d86e5c0409cbd0d8d3a18701dd77897401`.

The text diff is empty, but the new parent directory changes runtime semantics.
`../config/workloads.js` now resolves to the nonexistent
`performance/scenarios/config/workloads.js`; equivalent problems affect
`../config/runtime.js`, all `../lib/` imports, and
`open('../data/workflow.csv')`. Pinned k6 v2.2.0 `inspect` emitted the actual
missing-module error for all three wrappers before loading credentials or
sending HTTP. Port 3000 remained free.

Codex did not modify, rename, stage, or commit the human-created wrappers. The
proposed human-only correction, if retaining the `official/` directory, is to
change config/lib/data prefixes from `../` to `../../`. Load workload/output/
account/runtime preparation was deliberately not continued. No official
traffic, result, report, screenshot, threshold, account, backend process, or
push was created.

## Interaction 021 — Human path approval, wrapper validation, and Load preparation

| Field | Actual record |
|---|---|
| AI tool | Codex CLI |
| Human approval | Exact relative-depth correction approved on 2026-09-01 |
| Continued/application record | 2026-09-02 09:05:14 +0700 |
| Detailed interaction | [`interactions/021-wrapper-correction-load-preparation.md`](interactions/021-wrapper-correction-load-preparation.md) |
| Wrapper commit | `90fb1ae` (`test: add human-named official k6 wrappers`) |
| Scope after validation | Official Load preparation only; no execution |

Codex applied exactly five string-path changes per official wrapper:
`../config/workloads.js`, `../config/runtime.js`, `../lib/data.js`,
`../lib/workflow.js`, and `../data/workflow.csv` became their `../../`
equivalents. No filename or other line changed.

An ephemeral synthetic 20-row credential file was created mode 0600 under
`/private/tmp` only for no-HTTP initialization. Pinned k6 v2.2.0 successfully
inspected all three human-named entries. Load showed 0→5/1m, 5/5m, 5→0/1m;
Stress and Spike retained their exact approved schedules. Every entry used
`traffic=measured`, 30-second graceful settings, the same `runWf03Scenario`, and
`thresholds=null`. Normalizing `../../` to `../` produced empty diffs against
all internal wrappers. The temporary file was removed and port 3000 remained
free.

Only the three official wrappers were staged for the dedicated commit. Staged
file and secret scans passed. Commit `90fb1ae` truthfully preserves the human
filenames and approved path correction; no push occurred.

Afterward, Load-only preparation pinned the human-named Load entry, exact
approved workload/account requirements, one-start fresh-runtime sequence,
setup/measured boundary, exact runner invocation, actual-run-ID path contract,
native JSON/summary/log/metadata/report/checksum plan, and human Activity
Monitor capture instructions. No actual run ID, result artifact, screenshot,
backend, account, or traffic was generated. Stress/Spike execution preparation
did not proceed.

## Interaction 022 — Maximum safe automation authorization

| Field | Actual record |
|---|---|
| AI tool | Codex CLI |
| Recorded | 2026-09-02 09:15:49 +0700 |
| Human instruction | Switch HW05 to maximum safe automation; execute every legitimate automatable task, stop only at explicitly defined human gates, preserve real evidence, never fabricate, and never push upstream |
| Lockout decision | H-009 human-approved: validated credentials only, no intentional lockout, preserve genuine behavior, no credential substitution, fresh reset/reprovisioning between runs |
| Execution decision | Human authorized official Load/Stress/Spike/endurance technical execution without further phase approval; real screenshot readiness remains an immediate pre-traffic gate |
| Git decision | Truthful commits and eventual push to student `origin` authorized after safety/artifact scans |
| Detailed interaction | [`interactions/022-maximum-safe-automation.md`](interactions/022-maximum-safe-automation.md) |

At receipt, `HEAD` was `70c5429fe82e56e3f48f1c1682f04396e4bc39e1`,
`origin` was the student repository, `upstream` was the official SUT, and
`remote.pushDefault` was `origin`. No runtime had yet been started. Codex began
the authorized official Load preflight and retained the requirement to stop
immediately before measured traffic if genuine combined k6/backend-resource
visual evidence required human readiness.

The authorization was committed as `e28da7b`. Load preflight then used a fresh
clone pinned to that commit. A first sandboxed backend did not persist and sent
no account/k6 traffic. Fresh runtime
`/private/tmp/eshop-hw05-load.24cMIo/runtime` retained exact backend PID `42059`.
One sandbox-networked helper call failed with `sut_request_failed` and created
no account/order/credential state; its redacted evidence was preserved. The
unchanged helper then succeeded outside the network restriction for exactly 20
validated, unlocked `user` accounts with zero orders. Runtime/database/product/
public/private/k6/disk/wrapper/original-integrity gates passed. Actual Load run
ID `20260902T092131+0700` was reserved, but its result root, measured traffic,
and screenshot do not yet exist. Work stopped only at Human Gate 1 for real
macOS screenshot readiness.

## Interaction 023 — Official Load execution

| Field | Actual record |
|---|---|
| Human gate input | `READY` |
| Resume input | `continue` after an interrupted wait |
| Actual run | Official Load `20260902T092131+0700` |
| Detailed record | [`interactions/023-official-load-execution.md`](interactions/023-official-load-execution.md) |
| Result | Exit 0, watchdog no, 345/345 WF-03 successes |

The genuine seven-minute Load produced native JSON/summary/stdout/stderr,
command/metadata, redacted setup/backend/postflight evidence, a real human
screenshot and real PNG conversion, and a generated aggregate report. Raw-data
analysis found 2,415 HTTP requests with zero failures, 13,110/13,110 checks,
345/345 created/canceled orders, 5.731666 requests/s, overall HTTP p95 4.1019 ms
and raw p99 4.69974 ms. No threshold or capacity claim was inferred.

After k6 flush, Codex stopped exact backend PID 42059, verified port 3000 free,
and verified the protected original DB SHA-256/integrity unchanged. The audit
preserves the interrupted wait and corrected post-run process diagnosis rather
than rewriting them away.

## Interaction 024 — Official Stress preflight

| Field | Actual record |
|---|---|
| Authority | Interaction 022 maximum safe automation |
| Actual run ID | `20260902T101857+0700` |
| Detailed record | [`interactions/024-official-stress-preflight.md`](interactions/024-official-stress-preflight.md) |
| Preflight | PASS; measured traffic not started |

Fresh clone `/private/tmp/eshop-hw05-stress.X7FeN0/runtime` is pinned to
`0c17457`; exact one-start backend PID `45430` owns the clone listener. Twenty
fresh accounts, roles/unlocked/authentication/zero orders, five products,
public/private contracts, official wrapper, k6, disk, database boundary, and
protected original integrity passed. The new result root remains absent. Work
stopped only for the genuine Stress Activity Monitor/k6 screenshot-readiness
gate.

## Interaction 025 — Official Stress execution and screenshot recovery

| Field | Actual record |
|---|---|
| Human inputs | `READY`; later asked Codex to recheck the screenshot folder |
| Run | Official Stress `20260902T101857+0700` |
| Detailed record | [`interactions/025-official-stress-execution.md`](interactions/025-official-stress-execution.md) |
| Result | Exit 0, watchdog no, 1,281/1,281 workflows |

The genuine run produced native JSON and CSV plus summary/log/command/metadata.
Analysis measured 8,967 HTTP requests with zero failures, 48,678/48,678 checks,
1,281/1,281 orders created/canceled, p95 3.9147 ms, p99 4.45374 ms, and
11.877557 requests/s. The distinct Stress primary view is a 30-second native-
CSV time-series HTML.

The human screenshot was initially in the Load screenshot directory. Codex
found and visually verified genuine 20/20-VU Stress/PID `45430` content, moved
the unchanged JPEG to the correct run, and generated a real PNG conversion.
After flush Codex stopped only PID 45430 and verified port/original integrity.
No capacity or threshold was inferred.
