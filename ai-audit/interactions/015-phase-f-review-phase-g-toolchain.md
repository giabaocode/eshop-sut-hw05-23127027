# Interaction 015 — Phase F Human Review and Phase G Toolchain/Pilot Preparation

## Metadata

| Field | Actual record |
|---|---|
| AI tool | Codex CLI |
| Human | 23127027 — Phạm Ngọc Gia Bảo |
| Human review received | 2026-09-01 17:01:08 +07 (Asia/Ho_Chi_Minh) |
| Work resumed | 2026-09-01, after actual follow-ups `continue`, `codex resume`, `resume`, and `continue where you stopped` |
| Phase G implementation validated/committed | 2026-09-01 17:31:42 +07 |
| Phase G implementation commit | `d9291f7` — `test: pin k6 and prepare 2-VU pilot` |
| Phase | Phase F human correction/finalization; truthful Git recovery; Phase G pinned k6 and 2-VU Pilot preparation |
| Runtime authority | Install/inspect/no-HTTP capability probes only; no SUT startup, provisioning, or performance traffic |

## Actual human instruction

The following is the actual substantive human prompt. It is preserved verbatim;
the later short resume prompts only instructed Codex to continue this work.

> Phase F — Static k6 Implementation has been reviewed by me.
>
> I approve the shared k6 architecture and static implementation with the HUMAN
> decisions and corrections below.
>
> Mark H-036 DONE BY HUMAN only after applying this review.
>
> Preserve:
> - original AI proposals,
> - static-review findings,
> - this human review,
> - final decisions.
>
> ============================================================
> 1. SHARED WF-03 ARCHITECTURE — APPROVED
> ============================================================
>
> Approve ONE authoritative shared executable workflow:
>
> Login
> → think 0.5–1.0s
> → Product Search/List
> → think 1.0–2.0s
> → Product Detail
> → think 1.5–3.0s
> → Checkout/Create Order
> → Verify same Order pending
> → think 0.5–1.0s
> → Cancel that exact Order
> → Verify same Order canceled
>
> Load, Stress, and Spike must call the same shared implementation.
>
> Scenario files must contain workload configuration only.
>
> No scenario-specific:
> - endpoint logic
> - request payload changes
> - business branching
> - assertion weakening
> - correlation changes
>
> ============================================================
> 2. STATIC CHECK / METRIC IMPLEMENTATION — APPROVED
> ============================================================
>
> Approve the current:
>
> - stable checks
> - one workflow outcome per attempted iteration
> - first-terminal-failure behavior
> - low-cardinality metric tags
> - shared native http_req_duration usage
> - approved custom metrics
> - iteration-local correlation
> - no mutable module-global response state
>
> Do not weaken these during runtime debugging merely to make tests pass.
>
> ============================================================
> 3. DATA / VU MAPPING — APPROVED
> ============================================================
>
> Approve:
>
> exec.vu.idInTest
> → dedicated workflow row
> → dedicated customer credential
>
> No:
> - modulo wrapping
> - random fallback
> - shared account fallback
> - static JWT
> - static productId
> - static price
> - static orderId
>
> Load requires accounts 01..05.
>
> Stress and Spike require the complete 01..20 pool before official execution.
>
> ============================================================
> 4. FAILURE / SAFETY MODEL — APPROVED
> ============================================================
>
> Approve the current fail-fast per-iteration design and immediate safety stops
> for clearly invalid runtime conditions.
>
> The four numeric error-abort proposals remain:
>
> DEFERRED — REQUIRES PILOT/RUNTIME EVIDENCE
>
> Do not implement them as final rules yet.
>
> Final performance thresholds also remain undefined.
>
> ============================================================
> 5. H-002 — RESOLVED BY HUMAN DECISION
> ============================================================
>
> The previous proposal to require lecturer/TA clarification is superseded.
>
> Do NOT require me to contact the lecturer/TA.
>
> Use ONLY the official HW05 PDF as assignment authority.
>
> My human interpretation/decision is:
>
> The PDF explicitly permits k6 and explicitly states that k6 users provide
> equivalent distinct outputs for the required listener/report views.
>
> Therefore:
>
> H-002 status:
> RESOLVED BY HUMAN DECISION — USE K6 EQUIVALENT OUTPUTS
>
> Preserve the earlier AI concern about literal .jtl/HTML wording in the audit,
> but it is no longer a blocker.
>
> Do NOT fabricate JMeter artifacts.
>
> Never:
> - rename JSON to .jtl
> - rename CSV to .jtl
> - synthesize fake JMeter log structure
> - claim a k6 file is native JMeter output
>
> ============================================================
> 6. FINAL K6 OUTPUT STRATEGY
> ============================================================
>
> Preserve genuine native raw k6 results for ALL official scenarios.
>
> Canonical raw artifact for each scenario:
> native granular k6 JSON.
>
> Use THREE genuinely different primary report/output views:
>
> LOAD
> Primary view:
> End-of-test aggregate/custom summary
>
> STRESS
> Primary view:
> CSV time-series analysis/report
>
> SPIKE
> Primary view:
> k6 web-dashboard time-series report
>
> The three views must remain meaningfully different.
>
> ============================================================
> 7. HTML / REPORT DIRECTORY STRATEGY
> ============================================================
>
> The submission also expects report folders.
>
> Design a real report directory for each scenario using actual measured data.
>
> Target structure conceptually:
>
> results/
>     load/
>         raw/
>         report/
>     stress/
>         raw/
>         report/
>     spike/
>         raw/
>         report/
>
> Do NOT generate fake reports before execution.
>
> Planned HTML/equivalent artifacts:
>
> LOAD:
> an HTML aggregate/summary view generated from real Load summary/raw results
>
> STRESS:
> an HTML time-series analysis generated from real Stress CSV/raw results
>
> SPIKE:
> the real k6 web-dashboard HTML export
>
> These must be derived from REAL execution data.
>
> They must not merely be the same dashboard renamed three times.
>
> Document in the final report that these are the k6-equivalent distinct views
> per the assignment's k6 rule.
>
> ============================================================
> 8. docs/ta-clarifications.md
> ============================================================
>
> If docs/ta-clarifications.md already exists:
>
> do NOT delete its historical content.
>
> Update H-002 to show:
>
> Previous AI recommendation:
> Ask lecturer/TA due to wording ambiguity.
>
> Human decision:
> No external clarification required; follow the PDF's explicit k6-equivalent
> rule.
>
> Status:
> RESOLVED BY HUMAN DECISION
>
> Do not invent a lecturer/TA response.
>
> ============================================================
> 9. IMPORTANT GIT COMMIT CORRECTION
> ============================================================
>
> The official PDF requires Git commits for procedural steps.
>
> So far, completed AI-first design work has not been committed.
>
> Do NOT:
>
> - fake historical commits
> - backdate commits
> - rewrite Git history
> - create false historical snapshots
> - force-push
>
> Instead, truthfully recover Git discipline now.
>
> First inspect:
>
> git status
> git diff
> git diff --cached
> git log --oneline --decorate -10
>
> Create:
>
> docs/git-recovery-plan.md
>
> Explain transparently:
>
> - Phases 0–F were developed before local commits were made.
> - No fake/backdated history will be created.
> - Existing artifacts will now be committed in meaningful logical groups.
> - From Phase G onward, each meaningful procedural phase will receive its own
>   real commit as work occurs.
>
> Do not hide this fact from the AI Audit.
>
> ============================================================
> 10. CREATE LOCAL BASELINE COMMITS
> ============================================================
>
> You are authorized to create LOCAL Git commits now.
>
> Do NOT push yet.
>
> Do not commit:
> - assignment PDF unless it is explicitly required
> - credentials
> - secrets
> - private runtime files
> - temporary directories
>
> If the assignment PDF is currently untracked and not required as submission
> material, protect it from accidental commit using an exact narrow ignore rule
> if appropriate.
>
> Group the current real artifacts into meaningful commits based on their actual
> content.
>
> Do NOT manufacture commits merely to inflate count.
>
> Prefer logical groups such as:
>
> 1. assignment/SUT discovery and runtime documentation
> 2. workflow/workload/test-data design
> 3. correlation/checks/metrics design
> 4. shared k6 draft implementation
> 5. AI audit/human-review supporting records where appropriate
>
> Before EACH commit:
>
> - show staged files
> - check for credentials/secrets
> - ensure no disposable runtime artifacts are included
> - use a meaningful commit message
>
> Record the actual commit hashes in:
>
> docs/git-recovery-plan.md
>
> and update the AI Audit.
>
> From Phase G onward:
>
> ONE meaningful procedural phase
> → ONE or more truthful commits as appropriate.
>
> ============================================================
> 11. PHASE G — PINNED K6 TOOLCHAIN
> ============================================================
>
> After Phase F corrections and Git baseline recovery, proceed to:
>
> PHASE G — Pinned k6 Toolchain and 2-VU Pilot Preparation
>
> You MAY install k6 under the rules below.
>
> Do NOT execute the performance pilot yet.
>
> ============================================================
> 12. K6 INSTALLATION AUTHORIZATION
> ============================================================
>
> First inspect:
>
> - whether Homebrew exists
> - whether k6 unexpectedly already exists
> - architecture
> - current macOS version
>
> If Homebrew already exists:
>
> you are authorized to install k6 using the normal Homebrew mechanism WITHOUT
> sudo.
>
> Do NOT:
>
> - use sudo
> - install a second package manager
> - curl | sh unknown installers
> - modify unrelated system configuration
>
> After installation record:
>
> k6 version
> installation mechanism
> binary path
> architecture
> timestamp
>
> The exact installed k6 version becomes the PINNED VERSION for this homework
> unless later human-reviewed change is required.
>
> Create:
>
> docs/k6-toolchain.md
>
> Do not call compatibility verified until the draft scripts are checked with
> this actual k6 version.
>
> If Homebrew does not exist or normal installation fails:
>
> STOP.
>
> Do not invent another installation method.
>
> ============================================================
> 13. REAL K6 STATIC/INIT VALIDATION
> ============================================================
>
> Using the installed pinned k6 version, validate the draft implementation
> WITHOUT sending HTTP requests to the SUT.
>
> Verify as far as k6 allows:
>
> - module imports
> - SharedArray
> - open() path resolution
> - k6/execution API
> - exec.vu.idInTest usage
> - exec.test.abort availability
> - custom metric constructors
> - options/stages parsing
> - systemTags configuration
> - scenario entry points
> - summary/output hooks
>
> If initialization requires credential input:
>
> use only an ephemeral local/private synthetic file outside Git for syntax/init
> validation.
>
> Do not claim those credentials are real accounts.
>
> Do not start the backend.
>
> Do not perform HTTP traffic.
>
> ============================================================
> 14. OUTPUT VERSION COMPATIBILITY
> ============================================================
>
> Using the pinned k6 installation, verify availability/syntax for:
>
> - native JSON output
> - native CSV output
> - end-of-test/custom summary
> - web-dashboard HTML export
>
> Do not generate fake performance results.
>
> This step verifies tool capability only.
>
> Update:
>
> docs/report-output-mapping.md
> docs/k6-toolchain.md
>
> with PINNED-VERSION-VERIFIED capabilities.
>
> ============================================================
> 15. 2-VU PILOT PREPARATION
> ============================================================
>
> Prepare, but DO NOT EXECUTE, a conservative functional/performance pilot.
>
> Pilot target:
>
> 2 VUs
>
> Purpose:
>
> - validate real k6 runtime compatibility
> - validate account mapping
> - validate correlation
> - validate checks
> - validate metrics
> - validate result writing
> - identify runtime problems before official Load/Stress/Spike
>
> The pilot is NOT an official Load result.
>
> Do not reuse it as official scenario evidence.
>
> ============================================================
> 16. PILOT RUNTIME PLAN
> ============================================================
>
> Prepare a disposable-runtime pilot runbook.
>
> It should include:
>
> Fresh disposable clone
> → safe SUT reset
> → provision exactly the required pilot accounts
> → validate account credentials
> → verify products
> → verify zero/comparable starting order state
> → start backend
> → run 2-VU pilot
> → preserve real pilot output
> → stop backend
> → verify integrity
>
> But DO NOT execute these runtime steps yet.
>
> Create:
>
> runbooks/k6-pilot.md
>
> ============================================================
> 17. ACCOUNT PROVISIONING HELPER — DRAFT ONLY
> ============================================================
>
> You may create a reproducible provisioning helper for disposable runtimes.
>
> It must:
>
> - use the real supported SUT behavior
> - create only disposable-runtime test accounts
> - generate private credentials outside Git
> - avoid printing passwords
> - verify resulting accounts
> - produce redacted setup evidence
> - never modify the original HW05 database
>
> Clearly label it:
>
> DRAFT / NOT YET EXECUTED
>
> Do not provision accounts yet.
>
> ============================================================
> 18. ANTI-CHEAT FILENAME RULE
> ============================================================
>
> Do NOT finalize or automatically fabricate the official test-plan filenames.
>
> The assignment requires:
>
> {StudentID}_{ScenarioType}_{YYYYMMDD}
>
> and treats test-plan filenames as attributable evidence.
>
> Therefore:
>
> - keep internal draft files such as load.js/stress.js/spike.js for now,
> - prepare a manual filename checklist,
> - the student must explicitly approve/create the official execution filenames
>   using the actual date at the appropriate later phase.
>
> Do not invent an execution date now.
>
> ============================================================
> 19. PHASE G OUTPUT
> ============================================================
>
> Create/update:
>
> docs/k6-toolchain.md
> docs/report-output-mapping.md
> docs/git-recovery-plan.md
> runbooks/k6-pilot.md
> docs/human-decisions.md
> ai-audit/audit.md
> MANUAL-TODO.md
>
> Create the detailed AI Audit interaction.
>
> If installation and static compatibility validation succeed, create a real
> local Git commit for Phase G.
>
> Do NOT push yet.
>
> ============================================================
> 20. STOP CONDITION
> ============================================================
>
> At the end show:
>
> A. Phase F human-review result
> B. H-002 resolution
> C. Git recovery/baseline commit result
> D. Installed pinned k6 version
> E. k6 binary/install method
> F. Runtime/static compatibility findings
> G. Output/report capability verification
> H. Any draft changes required for actual k6 compatibility
> I. 2-VU pilot plan
> J. Account provisioning helper status
> K. Remaining risks
> L. Files/commits created
> M. Exact actions requiring human approval before pilot execution
>
> Then print:
>
> ============================================================
> HUMAN CHECKPOINT REQUIRED — 2-VU PILOT EXECUTION APPROVAL
> ============================================================
>
> STOP.
>
> Do NOT:
> - start the SUT for pilot
> - provision real disposable accounts
> - execute k6 pilot traffic
> - run Load
> - run Stress
> - run Spike
> - run endurance
> - push to GitHub

## Context and repository evidence used

- Official HW05 PDF traceability already recorded in
  `docs/assignment-requirements.md` and the source PDF, including k6-equivalent
  output authority and Git procedural requirements.
- Phase F source/design: `docs/k6-architecture.md`, all files under
  `performance/config`, `performance/lib`, and `performance/scenarios`.
- Human/audit state: `docs/human-decisions.md`, `docs/ta-clarifications.md`,
  `docs/CODEX-RESUME-CHECKPOINT.md`, `MANUAL-TODO.md`, and prior interactions.
- Output strategy: `docs/report-output-mapping.md` and
  `performance/config/output.js`.
- Real provisioning contracts: `backend/server.js`, `backend/database.js`,
  `docs/test-data-strategy.md`, and `docs/runtime-api-verification.md`.
- Git evidence: status, tracked/staged diffs, last ten commits, branch/remotes,
  and `remote.pushDefault`.

## Actual AI actions and output

1. Applied the Phase F human decisions, set H-036 only after doing so, resolved
   H-002 by human decision, and retained the old AI concern/unsent question.
2. Disclosed the lack of earlier local procedural commits and created five
   truthful logical baseline commits without backdating, rewriting, or pushing.
3. Narrowly ignored only the local assignment PDF and already approved private
   credential paths; no secret/runtime artifact was committed.
4. Found existing Homebrew and absent k6 on arm64 macOS 26.5.2, then installed
   k6 normally without sudo. Pinned `k6 v2.2.0` at `/opt/homebrew/bin/k6`.
5. Used an ephemeral synthetic private CSV outside Git to inspect all official
   entries. Imports, SharedArray/open, execution API, metric constructors,
   stages/tags/options, and entry points initialized without SUT traffic.
6. A no-HTTP execution probe verified `exec.vu.idInTest`, `exec.test.abort`,
   metrics, and summary-hook availability. It was not a workflow/performance
   run.
7. Output probes verified real JSON/CSV/dashboard HTML/custom-summary
   capability only under `/private/tmp`. No file is a homework result.
8. Added a non-official two-VU Pilot config and entry that reuse the exact
   shared workflow, with `scenario=pilot,traffic=pilot` isolation.
9. Added an unexecuted registration/login/order-list provisioning helper with
   disposable-root, marker, database-inode, local-target, private-output, and
   redaction guards.
10. Source inspection identified that every backend start resets the database.
    The runbook therefore requires one disposable backend start, setup-only
    provisioning, and then the pilot against that same owned process.
11. After validation, the exact 220 KiB temporary probe directory was removed;
    it contained only the synthetic credential/probe inputs and capability
    outputs. No repository file was removed.

## Genuine failures/corrections preserved

- The first Pilot inspection did not see shell-prefix variables and the target
  guard correctly failed. Explicit k6 `-e` variables succeeded.
- The first web-dashboard probe could not bind its sandbox-local port and was
  too short to export HTML. A two-second no-HTTP probe with an ephemeral
  localhost port outside that sandbox produced real private HTML.
- The first custom-summary output was absent because `--summary-mode=disabled`
  suppresses the relevant hook in pinned k6 2.2.0. Repeating with summary mode
  enabled created real private summary JSON. The future runner must retain this
  compatibility correction.
- A later `brew info k6` attempted an online formula refresh and reported DNS
  failure while still showing installed k6 2.2.0. The installed binary and its
  checksum remained valid.
- The first staged secret-scan command hit a genuine zsh `bad pattern` quoting
  error before it scanned. A simpler rerun checked forbidden paths, common
  secret signatures, and every staged password/token/Authorization reference;
  only intended source/schema references were present.
- The exact temporary directory `/private/tmp/eshop-hw05-k6-init.a5sx7d` was
  removed after the findings were recorded. Its synthetic credential and
  capability outputs are no longer present.

## Boundary at checkpoint

No SUT process, port-3000 listener, account, real credential, registration,
login, workflow HTTP request, database mutation, Pilot/Load/Stress/Spike/
endurance execution, performance result, official report, screenshot, official
filename/date, JTL, push, or external publication was created. H-037 remains
`WAITING FOR HUMAN`.
