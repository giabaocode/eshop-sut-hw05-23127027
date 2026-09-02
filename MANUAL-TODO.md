# HW05-AI Manual Responsibility Register

Only the student may complete the human responsibilities below. Codex must not
set `DONE BY HUMAN` without Phạm Ngọc Gia Bảo's explicit confirmation.

Allowed statuses: `TODO`, `WAITING FOR HUMAN`, `WAITING FOR LECTURER/TA
CLARIFICATION`, `RESOLVED BY HUMAN DECISION`, `DONE BY HUMAN`, `NOT APPLICABLE`.

| ID | Human responsibility | Status | Required evidence/confirmation |
|----|----------------------|--------|--------------------------------|
| H-001 | Review Phase 0 assignment traceability, Git safety status, and initial repository findings. | DONE BY HUMAN | Approved in chat on 2026-09-01 |
| H-002 | Resolve the k6 `.jtl`/HTML equivalence after technical options are proposed. | RESOLVED BY HUMAN DECISION | Use PDF-authorized distinct k6-equivalent outputs and genuine native JSON; do not contact TA, fabricate JTL, or mislabel k6 artifacts; HD-009 |
| H-003 | Decide whether the performance demo and Agent Skill demo may be one combined video. | TODO | Explicit decision or instructor clarification |
| H-004 | Select the final E2E workflow from source-backed candidates. | DONE BY HUMAN | WF-03 explicitly selected in chat on 2026-09-01 |
| H-005 | Check workflow candidates with group members and confirm the chosen workflow is not duplicated. | DONE BY HUMAN | Four-person-group coordination and WF-03 uniqueness explicitly confirmed in chat on 2026-09-01 |
| H-006 | Review AI-generated performance-test design. | TODO | Review matrix decision |
| H-007 | Review/correct load parameters, ramp-up, durations, VUs, and think time. | TODO | Explicit corrections/approval |
| H-008 | Review/correct checks and business assertions. | TODO | Explicit corrections/approval |
| H-009 | Review account-lockout handling and any reset procedure. | DONE BY HUMAN | Master automation instruction on 2026-09-02 explicitly approved valid credentials only, no intentional lockout, preservation of genuine behavior, no credential substitution, and fresh disposable reset/reprovisioning between official runs; HD-016 |
| H-010 | Approve exact Load/Stress/Spike plan filenames after PDF validation. | DONE BY HUMAN | Human created the three exact `23127027_{Load|Stress|Spike}_20260901.js` basenames; filename validation passed on 2026-09-01. The later human-approved path-depth correction passed pinned-k6 and semantic revalidation and is committed as `90fb1ae`; HD-014 and HD-015 |
| H-011 | Approve each real Load, Stress, Spike, and endurance execution before it runs. | DONE BY HUMAN | Master maximum-safe-automation instruction on 2026-09-02 explicitly authorizes technical execution of all four runs, subject to the real screenshot-readiness gates; HD-016 |
| H-012 | Capture real performance-tool/resource-monitor screenshots for every run. | WAITING FOR HUMAN | Genuine Load, Stress, and Spike screenshots exist and were visually validated; only the later endurance screenshot remains |
| H-013 | Capture real macOS hardware/hostname screenshot evidence. | TODO | Actual screenshot file and hostname match check |
| H-014 | Review AI performance analysis against raw results. | TODO | Completed human review |
| H-015 | Identify/approve actual AI metric misinterpretations and explain them. | TODO | Human explanations in review table |
| H-016 | Classify optimization recommendations with final human verdicts. | TODO | FEASIBLE / NOT FEASIBLE / HALLUCINATED / INSUFFICIENT EVIDENCE decisions |
| H-017 | Decide whether genuine observed issues should be published to GitHub. | TODO | Explicit publication approval or NOT APPLICABLE decision |
| H-018 | Provide Vietnamese narration and record the real demo with tool and monitor in one frame. | TODO | Real recording |
| H-019 | Upload the real demo as unlisted YouTube content and supply its URL. | TODO | Real URL |
| H-020 | Demonstrate the Agent Skill in the required real video evidence. | TODO | Real demonstration/video evidence |
| H-021 | Review/edit/approve substantive claims in the 200–300 word AI critique. | TODO | Explicit approval/corrections |
| H-022 | Confirm hardware hostname compatibility with previous homework deployments. | TODO | Explicit confirmation |
| H-023 | Choose the three-digit self-assessed grade in `[000,100]`. | TODO | Explicit grade |
| H-024 | Perform final completeness and submission review. | TODO | Explicit submission approval |
| H-025 | Approve final ZIP creation and Moodle submission. | TODO | Explicit packaging/submission approval |
| H-026 | Review Phase 1 source-backed SUT discovery and endpoint contracts. | DONE BY HUMAN | Approved in chat on 2026-09-01 |
| H-027 | Review and choose the safe macOS SUT startup strategy and proposed commands. | DONE BY HUMAN | Strategy B explicitly approved in chat on 2026-09-01 |
| H-028 | Review Phase 2B disposable-clone startup verification, actual failures, and original-repository integrity evidence. | DONE BY HUMAN | Runtime verification evidence accepted in chat on 2026-09-01 |
| H-029 | Review Phase 3 controlled runtime evidence, discrepancies, candidate ranking, and risks. | DONE BY HUMAN | Explicitly reviewed and approved in chat on 2026-09-01 |
| H-030 | Review the selected WF-03 functional smoke, dynamic correlations, state transition, and repeatability implications. | DONE BY HUMAN | Explicitly reviewed and approved in chat on 2026-09-01 |
| H-031 | Review the Phase A formal WF-03 endpoint, correlation, iteration, data, assertion, metric, state, and think-time-location contract. | DONE BY HUMAN | Approved with executable-probe clarification in chat on 2026-09-01 |
| H-032 | Review/correct the Phase B initial Load/Stress/Spike workload, think-time, state-growth, account, isolation, and safety proposals. | DONE BY HUMAN | Initial review plus explicit later corrections: pending→cancel 0.5–1.0 s and disposable provisioning design for up to 20 dedicated accounts, recorded in HD-005 on 2026-09-01 |
| H-033 | Review/correct the Phase C public/private schemas, 20-account setup design, VU mapping, product/address rules, correlation boundary, secret handling, ignore rules, and deterministic preconditioning. | DONE BY HUMAN | Approved with quantity removal and preconditioning separation in HD-006; safe artifacts validated before this status was set on 2026-09-01 |
| H-034 | Review/correct the Phase D credential binding, authentication/correlation chain, value ownership/lifetime, fail-fast rules, VU/iteration isolation, and stable metric grouping/tagging. | DONE BY HUMAN | Approved with isolated-auth-failure correction in HD-007; authoritative Phase D and audit records updated before this status was set on 2026-09-01 |
| H-035 | Review/correct the Phase E exact checks, custom metrics, one-outcome rule, failure taxonomy, operational safety stops, and three-report/output proposal. | DONE BY HUMAN | Approved with four error-based numeric aborts deferred pending pilot evidence and report mapping conditionally approved; recorded in HD-008 on 2026-09-01 |
| H-036 | Review the Phase F shared draft k6 architecture, one authoritative WF-03 implementation, static guards, configs, metrics/checks, output abstraction, and static-review findings. | DONE BY HUMAN | Approved explicitly with H-002 resolution and numeric-abort deferral retained; HD-009 |
| H-037 | Approve execution of the prepared disposable-runtime 2-VU pilot, including the source-required one-start backend ordering and provisioning exactly two pilot accounts. | DONE BY HUMAN | Explicit approval in HD-010; one Pilot executed and failed before HTTP; no official result |
| H-038 | Review the failed Pilot evidence and approve/correct the proposed group-name, custom traffic-tag, runtime-exception abort, exit/wall-clock runner, rerun-output, and 21.6 GiB artifact-handling decisions. | DONE BY HUMAN | HD-011: test-harness classification and minimum corrections, exact bulk cleanup, and one fresh corrected Pilot explicitly approved on 2026-09-01 |
| H-039 | Review the corrected-Pilot preflight failure and approve/reject invoking the unchanged helper from the actual original worktree against a new disposable clone. | DONE BY HUMAN | HD-012 explicitly approved the original-worktree invocation boundary and one new fresh corrected Pilot on 2026-09-01 |
| H-040 | Review the fresh corrected 2-VU Pilot evidence and decide whether official test-plan finalization may begin. | DONE BY HUMAN | Human explicitly approved the 81/81 corrected Pilot as shared-workflow runtime validation only and authorized Phase I planning on 2026-09-01; HD-013 |

## Current checkpoint

Phases B–F are human-reviewed. The failed Pilot and blocked-helper histories
remain preserved. Fresh corrected Pilot `20260901T223944+0700` completed 81/81
full WF-03 lifecycles, and H-040 is `DONE BY HUMAN` under HD-013. This promotes
the shared code to 2-VU Pilot runtime-validated status only; it creates no
official result, threshold, or capacity claim.

Phase I prepared the final review and execution materials. The human-created
official basenames pass and H-010 is `DONE BY HUMAN`. The initial deeper-path
failure remains preserved in HD-014. The human then approved only the exact
`../`→`../../` module/data correction. All three wrappers passed pinned-k6 init
and normalized semantic comparison, then were committed as `90fb1ae`.

Maximum safe automation was authorized on 2026-09-02. H-009 and H-011 are now
`DONE BY HUMAN`; technical execution of official Load/Stress/Spike/endurance may
continue without artificial phase stops. The next unavoidable gate is H-012:
real Load k6/backend-resource screenshot readiness immediately before measured
traffic. H-013/H-022 hardware visual/hostname work remains human-only. No
official result, screenshot, threshold, or capacity claim existed when this
authorization was recorded.

Official Load preflight `20260902T092131+0700` now passes on the one-start
disposable backend PID `42059` with exactly 20 validated accounts and zero
orders. The result root and measured traffic do not exist yet. Automation is
paused only at H-012 for real macOS screenshot readiness; reply `READY` after
Activity Monitor is filtered to PID `42059` and arranged beside the terminal.

Official Load subsequently completed: k6 exit 0, 345/345 workflows, zero of
2,415 failed requests, 13,110/13,110 checks, and 345/345 created orders
canceled. Genuine visual evidence and raw/report artifacts are present; the
backend was stopped and original integrity passed. H-012 remains open only for
the later Stress/Spike/endurance visuals. No final threshold or capacity claim
has been set.

Fresh official Stress preflight now passes with exactly 20 validated accounts,
zero orders, and one-start backend PID `45430`. Its result root and measured
traffic do not exist. Automation is paused only for the Stress H-012 screenshot
readiness gate.

Official Stress subsequently completed with k6 exit 0, 1,281/1,281 workflows,
zero of 8,967 failed requests, and genuine 20/20-VU resource evidence. Native
JSON/CSV and distinct CSV-derived report are present; backend/original integrity
postflight passed. No capacity or final threshold was claimed.

Official Spike subsequently completed with k6 exit 0, 377/377 workflows, zero
of 2,639 failed requests, and genuine 20/20-VU resource evidence. Native JSON,
summary, and the distinct real k6 dashboard are present; backend/original
integrity postflight passed. H-012 now remains open only for endurance.
