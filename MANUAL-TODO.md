# HW05-AI Manual Responsibility Register

Only the student may complete the human responsibilities below. Codex must not
set `DONE BY HUMAN` without Phạm Ngọc Gia Bảo's explicit confirmation.

Allowed statuses: `TODO`, `WAITING FOR HUMAN`, `WAITING FOR LECTURER/TA
CLARIFICATION`, `RESOLVED BY HUMAN DECISION`, `DONE BY HUMAN`, `NOT APPLICABLE`.

| ID | Human responsibility | Status | Required evidence/confirmation |
|----|----------------------|--------|--------------------------------|
| H-001 | Review Phase 0 assignment traceability, Git safety status, and initial repository findings. | DONE BY HUMAN | Approved in chat on 2026-09-01 |
| H-002 | Resolve the k6 `.jtl`/HTML equivalence after technical options are proposed. | RESOLVED BY HUMAN DECISION | Use PDF-authorized distinct k6-equivalent outputs and genuine native JSON; do not contact TA, fabricate JTL, or mislabel k6 artifacts; HD-009 |
| H-003 | Decide whether the performance demo and Agent Skill demo may be one combined video. | DONE BY HUMAN | Human selected one combined video on 2026-09-02; HD-018 |
| H-004 | Select the final E2E workflow from source-backed candidates. | DONE BY HUMAN | WF-03 explicitly selected in chat on 2026-09-01 |
| H-005 | Check workflow candidates with group members and confirm the chosen workflow is not duplicated. | DONE BY HUMAN | Four-person-group coordination and WF-03 uniqueness explicitly confirmed in chat on 2026-09-01 |
| H-006 | Review AI-generated performance-test design. | DONE BY HUMAN | Human reviewed Phases B–F through explicit correction/approval prompts; HD-005 through HD-009 |
| H-007 | Review/correct load parameters, ramp-up, durations, VUs, and think time. | DONE BY HUMAN | Human approved the final workloads and corrected pending→cancel think time to 0.5–1.0 s; HD-005 |
| H-008 | Review/correct checks and business assertions. | DONE BY HUMAN | Human explicitly approved the exact Phase E checks and retained same-order canceled-state success semantics; HD-008 |
| H-009 | Review account-lockout handling and any reset procedure. | DONE BY HUMAN | Master automation instruction on 2026-09-02 explicitly approved valid credentials only, no intentional lockout, preservation of genuine behavior, no credential substitution, and fresh disposable reset/reprovisioning between official runs; HD-016 |
| H-010 | Approve exact Load/Stress/Spike plan filenames after PDF validation. | DONE BY HUMAN | Human created the three exact `23127027_{Load|Stress|Spike}_20260901.js` basenames; filename validation passed on 2026-09-01. The later human-approved path-depth correction passed pinned-k6 and semantic revalidation and is committed as `90fb1ae`; HD-014 and HD-015 |
| H-011 | Approve each real Load, Stress, Spike, and endurance execution before it runs. | DONE BY HUMAN | Master maximum-safe-automation instruction on 2026-09-02 explicitly authorizes technical execution of all four runs, subject to the real screenshot-readiness gates; HD-016 |
| H-012 | Capture real performance-tool/resource-monitor screenshots for every run. | DONE BY HUMAN | Human-captured and visually validated combined k6/backend-resource evidence exists for genuine Load, Stress, Spike, and endurance runs; each records the exact disposable backend PID |
| H-013 | Capture real macOS hardware/hostname screenshot evidence. | WAITING FOR HUMAN | First genuine JPEG showed correct hardware/hostname but exposed a device serial; replace/redact manually before commit; HD-018 |
| H-014 | Review AI performance analysis against raw results. | DONE BY HUMAN | Human supplied nine explicit evidence-based verdicts and explanations; `reviews/ai-analysis-review.md`; HD-017 |
| H-015 | Identify/approve actual AI metric misinterpretations and explain them. | DONE BY HUMAN | Claim 3 marked `MISLEADING`; Claim 8 marked `INSUFFICIENT EVIDENCE`, with direct human explanations; HD-017 |
| H-016 | Classify optimization recommendations with final human verdicts. | DONE BY HUMAN | Human supplied all seven final verdicts/explanations; `reviews/optimization-review.md`; HD-017 |
| H-017 | Decide whether genuine observed issues should be published to GitHub. | NOT APPLICABLE | Human agreed no genuine SUT issue was confirmed; no speculative Issue will be published; HD-018 |
| H-018 | Provide Vietnamese narration and record the real demo with tool and monitor in one frame. | TODO | Real recording |
| H-019 | Upload the real demo as unlisted YouTube content and supply its URL. | TODO | Real URL |
| H-020 | Demonstrate the Agent Skill in the required real video evidence. | TODO | Real demonstration/video evidence |
| H-021 | Review/edit/approve substantive claims in the 200–300 word AI critique. | DONE BY HUMAN | Human approved the 278-word draft without correction on 2026-09-02; HD-018 |
| H-022 | Confirm hardware hostname compatibility with previous homework deployments. | DONE BY HUMAN | Human confirmed the same MacBook/hostname was used for previous homework deployment; HD-018 |
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
| H-041 | Resolve the unowned port-3000 process and decide handling of 20 synthetic accounts accidentally provisioned into `/Users/phamngocgiabao/eshop-sut/backend/database.sqlite`. | DONE BY HUMAN | Human requested PID `52187` stop; read-only verification at 2026-09-02 14:31:38 +0700 found PID absent, port free, zero remaining WF-03 accounts, external DB integrity ok, and protected HW05 DB unchanged |

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

Endurance is now evidence-informed and prepared at five sustained VUs: 30s
ramp-up, 12m hold, 30s ramp-down, 13m scheduled and 14m safety cap. This choice
uses genuine Load/Stress observations without treating the Stress maximum as
capacity. Fresh runtime preflight and the final endurance visual remain next.

The first endurance preflight is BLOCKED with no k6 traffic: an unowned local
PID `52187` from `/Users/phamngocgiabao/eshop-sut/backend` held port 3000, and a
non-fail-closed AI command provisioned 20 synthetic accounts there. The
disposable DB has none and protected HW05 integrity is unchanged. Human must
stop/retain the unowned process and choose cleanup/retention of those accounts.

H-041 is now resolved by the human stop action and read-only verification: PID
`52187` is absent, port 3000 is free, the external DB contains zero matching
WF-03 accounts, and protected HW05 integrity remains unchanged. A completely
fresh endurance runtime is required; the blocked runtime will not be reused.

Fresh endurance preflight `20260902T143823+0700` now passes with exact
foreground backend PID `53376`, 20 validated disposable accounts, zero orders,
and unchanged original integrity. Automation is paused only for the final H-012
real endurance k6/backend-resource screenshot readiness gate.

Endurance completed with genuine evidence: 713/713 workflows, zero of 4,991
failed HTTP requests, p95 4.377 ms, and 5 VUs sustained for 12 minutes. The
midpoint PID/resource screenshot exists and postflight integrity passed. H-012
has visual evidence for Load, Stress, Spike, and endurance; final packet review
remains human-owned.

Reproducible cross-scenario analysis now covers 2,716/2,716 successful
workflows and 19,012 requests with zero failures. The original AI analysis is
immutably preserved at commit `5e4b00f`; factual review and source-backed
optimization tables are ready. Automation is paused at the unavoidable
combined H-014/H-015/H-016 gate for the student's final interpretation and
optimization verdicts. The student subsequently supplied every verdict and
explanation directly; those three gates are now complete under HD-017 and
maximum safe automation resumes.

The remaining technical deliverables now include an evidence-based issue
determination, Continuous Performance Testing proposal/Mermaid/CI prototype,
validated repository Agent Skill, demo runbook, 278-word critique candidate,
main report/README drafts, PDF views, and a submission validator. These do not
complete H-003/H-013/H-017/H-018–H-025; the next combined human packet will
request only those attributable decisions/evidence.

The submission validator now reports 26 technical PASS, 0 FAIL, and 9 manual
checks. `reviews/FINAL-HUMAN-REVIEW.md` is the authoritative combined next
action packet. No final ZIP can be truthfully named until the student supplies
the hardware/hostname evidence, real video URL/decision, critique and issue
disposition, grade, and final approval.

The student then approved CPT, Agent Skill, AI Critique, no-issue disposition,
one combined video, and hostname compatibility. The validator now reports 29
PASS, 0 FAIL, 1 NOT APPLICABLE, and 5 manual checks. The first genuine hardware
JPEG is not acceptable for Git because it exposes a serial number. After a safe
replacement, only real YouTube URL and grade metadata remain before ZIP; Moodle
upload always remains human-only.
