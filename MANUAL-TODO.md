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
| H-009 | Review account-lockout handling and any reset procedure. | TODO | Explicit corrections/approval |
| H-010 | Approve exact Load/Stress/Spike plan filenames after PDF validation. | TODO | Explicit filename approval |
| H-011 | Approve each real Load, Stress, Spike, and endurance execution before it runs. | TODO | Per-run explicit approval |
| H-012 | Capture real performance-tool/resource-monitor screenshots for every run. | TODO | Actual screenshot files |
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
| H-038 | Review the failed Pilot evidence and approve/correct the proposed group-name, custom traffic-tag, runtime-exception abort, exit/wall-clock runner, rerun-output, and 21.6 GiB artifact-handling decisions. | WAITING FOR HUMAN | Explicit results review and separate authorization before applying evidence-affecting fixes or running a corrected Pilot |

## Current checkpoint

Phase B is complete and corrected. Phase C is human-approved after quantity was
removed and safe artifacts were validated. Phase D is human-approved with the
isolated-auth-failure correction recorded in HD-007, and H-034 is explicitly
`DONE BY HUMAN`. Phase E is human-approved with four numeric error-based aborts
deferred pending pilot evidence; H-035 is `DONE BY HUMAN`. The report proposal
is human-resolved under the PDF's explicit k6-equivalent-output rule; no TA
contact is required. Phase F is human-approved and H-036 is `DONE BY HUMAN`.
Phase G installed/pinned k6 2.2.0 and H-037 authorized one controlled Pilot.
Preflight/provisioning passed, but the Pilot failed before HTTP on invalid `::`
group names and generated approximately 21.6 GiB of local failure artifacts.
The backend is stopped, port 3000 is free, and the original DB is unchanged.
H-038 now blocks source corrections, a corrected Pilot, and official execution.
