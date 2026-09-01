# Git Discipline Recovery Plan

Status: **ACTIVE TRUTHFUL RECOVERY — LOCAL COMMITS ONLY**

Prepared: 2026-09-01 (Asia/Ho_Chi_Minh)

## 1. What happened

Phases 0–F were developed in the working tree before local procedural commits
were made. At recovery inspection, `main` was at `85af3ba`, the working artifacts
were untracked, both tracked diffs were empty, and the visible history contained
only `85af3ba first upload` and `2f9bf2b Initial commit`.

This gap is disclosed in the AI Audit. The repository will not create fake
historical snapshots, backdate commits, rewrite history, manufacture commit
count, or force-push. The commits below group the current real artifacts by
their actual content at recovery time; they do not claim to have been created
during the earlier phases.

## 2. Exclusions and safety

- The local assignment PDF is not a required submission artifact and is
  protected by the exact root ignore rule
  `/2026.HW05.Performance Testing_En.pdf`.
- Runtime credentials, local environment files, secrets, and disposable runtime
  material remain narrowly ignored.
- Required public data, documentation, audit records, future real raw results,
  reports, and evidence are not broadly ignored.
- No commit is pushed during recovery or Phase G.

Before every commit, the staged file list, staged diff/stat, secret scan, and
runtime/private-artifact exclusions must be checked. Actual staged files and
commit hashes are recorded below after creation.

## 3. Logical baseline commit plan and actual hashes

| Group | Actual content grouping | Commit hash | Commit message |
|---:|---|---|---|
| 1 | Assignment traceability, SUT discovery, safe startup/runtime verification, workflow candidates | `e488cf4` | `docs: record assignment and SUT discovery evidence` |
| 2 | Selected workflow, workload, test-data strategy, public data/templates, narrow ignore rules | `e0d2df5` | `docs: define WF-03 workload and test data strategy` |
| 3 | Correlation, checks, metrics, safety, and resolved k6-equivalent report strategy | `3f1e869` | `docs: specify WF-03 correlation checks and reporting` |
| 4 | Shared draft k6 architecture and static implementation | `1674905` | `test: add shared draft k6 WF-03 implementation` |
| 5 | Human decisions, resume/manual registers, complete AI Audit, and this recovery disclosure | `7ac1229` | `docs: add AI audit and human review records` |

## 4. Forward discipline

From Phase G onward, each meaningful procedural phase receives one or more
truthful local commits as appropriate after its actual work and validation.
Commit messages describe real present changes. The AI Audit records actual
hashes and any failures. Push remains separately authorized and must never target
`upstream`.

The five baseline commits above are complete. Phase G is the first phase using
the recovered forward discipline: its pinned-toolchain validation, pilot
preparation, and audit updates will be committed after actual validation. No
commit is backdated and no local commit has been pushed.

## 5. Phase G forward-discipline commit

| Phase | Actual content | Commit hash | Commit message |
|---|---|---|---|
| G | Pinned k6 2.2.0 capability record, compatibility adjustments, isolated 2-VU Pilot entry/runbook, and unexecuted guarded provisioning helper | `d9291f7` | `test: pin k6 and prepare 2-VU pilot` |

This hash was recorded only after the real commit existed. A separate audit/
checkpoint commit (`41c6fec`) records the validation narrative. Neither commit
was pushed.

## 6. Controlled Pilot evidence commit

| Phase activity | Actual content | Commit hash | Commit message |
|---|---|---|---|
| Human-approved controlled 2-VU Pilot | Small genuine failure evidence, results analysis, human/audit/checkpoint records, and H-038 correction gate; excludes credentials and the three multi-gigabyte raw files | `11c0a7f` | `test: record failed 2-VU pilot evidence` |

The hash above was recorded only after the truthful local commit existed. The
three large genuine raw files remain untracked and checksummed locally pending
human review; they were not hidden by `.gitignore`, deleted, renamed, or
misrepresented. No commit in this recovery sequence has been pushed.

## 7. Pilot correction commit

| Phase activity | Actual content | Commit hash | Commit message |
|---|---|---|---|
| Failed-Pilot human correction | Safe group names, context traffic tag, unexpected-exception abort, exact-PID bounded Pilot runner, human/audit review, and committed pre-deletion bulk metadata | `c75b514` | `fix: harden corrected 2-VU pilot harness` |

The three bulk files were deleted only after this commit existed. A subsequent
fresh corrected setup stopped before registration/k6 and is recorded truthfully
as a separate blocked attempt. Nothing was pushed.
