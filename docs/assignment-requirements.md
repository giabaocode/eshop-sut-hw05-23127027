# HW05-AI Assignment Requirements and Traceability

## Document control

- Exercise: HW05 – Performance Testing (`HW05-AI`)
- Student: Phạm Ngọc Gia Bảo (`23127027`)
- Authoritative source: `2026.HW05.Performance Testing_En.pdf`
- Source reviewed in full: 2026-09-01; PDFKit reports 9 pages
- Testing tool selected by the student: k6 (permitted and awarded a bonus by §8, page 6)
- Status vocabulary: `TODO`, `IN PROGRESS`, `WAITING FOR HUMAN`, `DONE`, `NOT APPLICABLE`

This document records the requirements found in the assignment PDF. A `DONE`
status means that the deliverable has been verified, not merely drafted. Human
work is never marked complete without the student's explicit confirmation.

## Traceability table

| ID | Requirement | PDF section/page | Deliverable | Automated? | Human? | Status |
|----|-------------|------------------|-------------|------------|--------|--------|
| GEN-01 | Complete the work individually and submit through the Moodle submission link by its stated deadline. | §1, p.1 | Final Moodle submission | No | Yes | TODO |
| GEN-02 | Use an AI-first strategy step-by-step; do not delegate the whole technique to one generic prompt. | §2, p.1 | Main report process narrative; AI Audit | Partial | Yes | DONE |
| GEN-03 | Human-review every AI result, correct/refine it, and accept responsibility for correctness. | §2, pp.1–2 | Review records; human decisions; corrected artifacts | No | Yes | TODO |
| GEN-04 | Keep a complete log of AI use; explicitly declare if AI was not used. | §2, p.2; §9, pp.6–7 | AI Audit Report appendix | Partial | Yes | IN PROGRESS |
| GEN-05 | Document the whole working process in a text-based format such as Markdown. | §2, p.2 | Markdown documentation and report | Partial | Yes | DONE |
| GEN-06 | Prioritize the quantity and quality of plans, data, raw logs, report views, resource/hardware evidence, video, critique, and links. | §2, p.2 | Submission package | Partial | Yes | TODO |
| SCOPE-01 | Test the EShop REST backend from the official repository and discover exact endpoints and ports from the repository. | §4, pp.2–3 | SUT discovery and startup runbook | Yes | Yes | DONE |
| SCOPE-02 | Target an auth-heavy endpoint group, including login and account-lockout behavior. | §5, pp.3–4 | Selected E2E workflow and three plans | Partial | Yes | DONE |
| SCOPE-03 | Target a read-heavy endpoint group, such as product listing/search and detail. | §5, p.3 | Selected E2E workflow and three plans | Partial | Yes | DONE |
| SCOPE-04 | Target a transactional endpoint group, such as cart and checkout/order creation. | §5, p.4 | Selected E2E workflow and three plans | Partial | Yes | DONE |
| SCOPE-05 | Ensure the chosen workflow is not duplicated by another group member. | §5, p.4 | Human uniqueness confirmation; decision log | No | Yes | DONE |
| T1-01 | Use AI step-by-step to design and generate Load, Stress, and Spike test plans, then review and fix them. | §6 Task 1, p.4 | Original drafts; reviews; corrected plans | Partial | Yes | DONE |
| T1-02 | Exercise the same end-to-end workflow in all three plans. | §6 Task 1, p.4 | Shared workflow implementation and validator evidence | Yes | Yes | DONE |
| T1-03 | Cover auth-heavy, read-heavy, and transactional endpoint groups in that E2E workflow and briefly justify the coverage. | §6 Task 1, p.4 | Workflow specification and report | Partial | Yes | DONE |
| T1-04 | Have AI propose realistic think time, ramp-up, and thread/VU counts for each scenario. | §6 Task 1, p.4 | Workload proposal | Partial | Yes | DONE |
| T1-05 | Human-review/correct workload realism; do not treat AI proposals as validated measurements. | §6 Task 1, pp.4–5 | Test-plan review and correction record | No | Yes | DONE |
| T1-06 | Make the E2E workflow data-driven with one or more CSV inputs for suitable request parameters. | §6 Task 1, p.4 | CSV files/schema and k6 data loading | Yes | Yes | DONE |
| T1-07 | Across the three plans, use three distinct, non-repeated listener/report types; k6 users must provide equivalent distinct outputs. | §6 Task 1, p.4 | Report/output mapping and artifacts | Partial | Yes | DONE |
| T1-08 | Name each plan `{StudentID}_{ScenarioType}_{YYYYMMDD}`. | §6 Task 1, p.4; §11, p.7 | Three correctly named plans | Yes | Yes | DONE |
| T1-09 | Preserve human review of AI mistakes or omissions, including possible ramp-up, think time, VUs, assertions, and lockout handling, and explain why AI missed them. | §6 Task 1, pp.4–5 | Review matrix and main report | Partial | Yes | DONE |
| T1-10 | Execute all three scenarios as completely as possible and preserve real evidence. | §6 Task 1, p.5 | Actual Load/Stress/Spike results | Partial | Yes | DONE |
| T1-11 | For each run, capture the testing tool and backend resource usage monitor together in a screenshot. | §6 Task 1, p.5 | Three real resource-monitor screenshots | No | Yes | DONE |
| T1-12 | Supply a hardware report containing a screenshot and a specification table. | §6 Task 1, p.5 | Hardware screenshot and specs | Partial | Yes | DONE |
| T1-13 | Reset a three-failure login lockout between Stress/Spike runs when triggered and document the steps. | §6 Task 1, p.5 | Lockout procedure and run evidence | Partial | Yes | TODO |
| T1-14 | Produce full raw `.jtl` logs and HTML report folders. | §6 Task 1, p.5; §11, p.7; §14, p.8 | Raw results and three HTML report folders, subject to k6 ambiguity A-01 | Partial | Yes | DONE |
| T1-15 | Run an approximately 10–15 minute sustained endurance/soak test to empirically determine the local hardware threshold with concrete numbers. | §6 Task 1, p.5 | Endurance run and threshold analysis | Partial | Yes | DONE |
| T1-16 | Record an unlisted YouTube demo of at least six total minutes; separate scenario clips are allowed. | §6 Task 1, p.5 | Real video and URL | No | Yes | TODO |
| T1-17 | Show the testing tool and resource monitor in the same frame and use the student's own Vietnamese narration. | §6 Task 1, p.5 | Real video evidence | No | Yes | TODO |
| T1-18 | Report genuine bugs or performance issues on the GitHub Issues page with screenshots; performance issues are encouraged but absence is not penalized. | §6 Task 1, p.5 | Genuine issue links or documented absence | Partial | Yes | NOT APPLICABLE |
| T2-01 | After collecting real raw results, prompt AI to analyse the logs and suggest performance thresholds. | §6 Task 2, p.5 | Original AI analysis | Partial | Yes | DONE |
| T2-02 | Human-review the AI analysis and identify actual metric misreads/misinterpretations. | §6 Task 2, p.5 | AI-analysis review | Partial | Yes | DONE |
| T2-03 | For each actual misinterpretation, cite the correct value from the raw log and explain the error. | §6 Task 2, p.5 | Misinterpretation table | Partial | Yes | DONE |
| T2-04 | Have AI propose optimizations and classify each as feasible or hallucinated with reasoning. | §6 Task 2, pp.5–6 | Optimization review | Partial | Yes | DONE |
| T3-01 | Propose a continuous performance-testing model that observes SUT commits and decides whether tests are warranted. | §6 Task 3, p.6 | Continuous-testing proposal | Partial | Yes | DONE |
| T3-02 | The proposal must flag p95 regressions. | §6 Task 3, p.6 | Proposal rules and thresholds | Partial | Yes | DONE |
| T3-03 | Include a flowchart and discuss cost and false-alarm trade-offs. | §6 Task 3, p.6 | Mermaid flowchart and discussion | Partial | Yes | DONE |
| SKILL-01 | Build a reusable Agent Skill for performance testing and log analysis (encouraged and worth 10 rubric points). | §7, p.6; §15, p.9 | Reusable Agent Skill | Yes | Yes | DONE |
| SKILL-02 | Submit the skill with a demonstration video showing end-to-end use on a complete endpoint group. | §7, p.6 | Skill and real demo link, subject to ambiguity A-02 | Partial | Yes | TODO |
| TOOL-01 | Use JMeter by default or k6 for bonus; declare all tools in the AI Audit Report. | §8, p.6 | Tool declaration | Yes | Yes | DONE |
| TOOL-02 | Use an appropriate resource monitor, such as Activity Monitor on macOS. | §8, p.6 | Monitoring runbook and screenshots | Partial | Yes | DONE |
| AUDIT-01 | Attach the AI Audit Report as a mandatory appendix. | §9, p.6 | AI Audit in report appendix | Partial | Yes | TODO |
| AUDIT-02 | For every AI interaction, record AI tool name, date/time, human prompt, and AI output. | §9, pp.6–7 | AI Audit interaction entries | Partial | Yes | IN PROGRESS |
| CRIT-01 | Write a mandatory 200–300 word critique of AI. | §10, p.7 | AI critique | Partial | Yes | DONE |
| CRIT-02 | Address what AI got wrong/biased/incomplete, why it missed the issue, and the collaboration principle learned. | §10, p.7 | Evidence-based critique | Partial | Yes | DONE |
| AC-01 | Do not fabricate or AI-generate test-plan filenames, raw execution logs, demo video/voice, or hardware evidence. | §11, p.7 | Authentic evidence chain | Partial | Yes | IN PROGRESS |
| AC-02 | Attach full raw logs, not summaries alone. | §11, p.7 | Raw result artifacts | Yes | Yes | DONE |
| AC-03 | Hardware evidence hostname must match the student's previous homework deployments. | §11, p.7 | Hostname evidence and human verification | Partial | Yes | DONE |
| GIT-01 | Create a new meaningful Git commit for each procedural step. | §12, p.7 | Git history | Partial | Yes | DONE |
| GIT-02 | Export the Git commit log in a text file. | §12, p.7 | `git-commit-log.txt` | Yes | Yes | TODO |
| DEF-01 | Be prepared for a possible 5–7 minute oral defense; 30% of students may be selected. | §13, p.7 | Oral-defense preparation based on actual work | Partial | Yes | TODO |
| ZIP-01 | Name the package `<StudentID>_HW05_AI_Performance_<SelfAssessedGrade>.zip`. | §14, p.8 | Final ZIP | Yes | Yes | TODO |
| ZIP-02 | Use a three-digit self-assessed grade in `[000,100]`. | §14, p.8 | README and ZIP filename | Partial | Yes | TODO |
| ZIP-03 | Include the main report in Markdown and PDF, including performance testing and AI-analysis critique. | §14, p.8 | Main report `.md` and `.pdf` | Partial | Yes | TODO |
| ZIP-04 | Include the public GitHub repository link, test plans, and data files. | §14, p.8 | README/report links and repository artifacts | Partial | Yes | TODO |
| ZIP-05 | Include all three plans following the naming convention. | §14, p.8 | Load/Stress/Spike plans | Yes | Yes | TODO |
| ZIP-06 | Include all three full raw logs and three HTML report folders. | §14, p.8 | Execution artifacts, subject to ambiguity A-01 | Partial | Yes | TODO |
| ZIP-07 | Include resource-monitor and hardware-spec screenshots. | §14, p.8 | Real screenshots | No | Yes | TODO |
| ZIP-08 | Include the unlisted YouTube demo link. | §14, p.8 | Real URL | No | Yes | TODO |
| ZIP-09 | Include AI Critique and AI Audit Report in Markdown and PDF. | §14, p.8 | Audit/critique `.md` and `.pdf` | Partial | Yes | TODO |
| ZIP-10 | Include the text Git commit log. | §14, p.8 | `git-commit-log.txt` | Yes | Yes | TODO |
| ZIP-11 | Include a bug report with GitHub Issue screenshots if genuine issues exist. | §14, p.8 | Issue report or `NOT APPLICABLE` rationale | Partial | Yes | TODO |
| README-01 | README must contain the self-assessment table. | §14, p.8 | `README.md` | Partial | Yes | TODO |
| README-02 | README test summary must state scenarios run, endpoint groups, numeric endurance threshold, issue count, and demo link. | §14, p.8 | `README.md` | Partial | Yes | TODO |
| GRADE-01 | Rubric weights: Load 30, Stress 20, Spike 20, AI analysis/misinterpretation 10, continuous proposal 10, Agent Skill 10. | §15, pp.8–9 | Self-assessment table | Partial | Yes | TODO |
| REG-01 | Late submission is not permitted. | §17, p.9 | Timely submission | No | Yes | TODO |
| REG-02 | Missing any required document results in zero points. | §17, p.9 | Final validation checklist | Partial | Yes | TODO |
| REG-03 | Copying between students, including prompts, results in a grade of zero for both parties. | §17, p.9 | Original work and audit trail | No | Yes | IN PROGRESS |

## Automated versus human responsibility

Automation may inspect source, scaffold reproducible k6 assets, validate naming
and CSV schemas, execute explicitly approved local tests, preserve raw output,
derive metrics from real results, maintain audit records, and flag missing
deliverables. It cannot validate group uniqueness, approve AI designs, provide
human critique, capture required screenshots or narration, upload a video,
publish an issue, choose a self-assessed grade, or approve submission.

The student's explicit confirmation is required for all items listed in
`MANUAL-TODO.md`. Automated validation must use `MANUAL VERIFICATION REQUIRED`
where repository evidence cannot establish a requirement.

## Ambiguities requiring a later human decision

### A-01 — k6 raw log and HTML artifact equivalence

- Assignment wording: Task 1 requires “raw .jtl logs and the HTML report
  folders” (§6, p.5), and the ZIP list repeats three `.jtl` files and three HTML
  folders (§14, p.8).
- Related wording: k6 is explicitly permitted (§8, p.6), and k6 users may supply
  equivalent distinct outputs for the three report/listener types (§6, p.4).
- Ambiguity: the PDF does not explicitly define whether a native k6 raw format
  may replace `.jtl`, or which reproducible HTML format is acceptable.
- Safe handling: do not fabricate JMeter-shaped artifacts. Investigate locally
  achievable k6 outputs and obtain human approval of a defensible mapping before
  finalizing plans.

### A-02 — one demo video or two

- Assignment wording: Task 1 requires an unlisted performance-test demo of at
  least six minutes (§6, p.5). The Agent Skill section also says to submit the
  skill with a demonstration video showing end-to-end use (§7, p.6).
- Ambiguity: the PDF does not say whether one combined video can satisfy both or
  whether a separate skill video is expected.
- Safe handling: retain both evidence obligations in the plan and ask for a
  human decision before recording/upload planning is finalized.

## Current phase boundary

This phase does not select a workflow, create final k6 scripts, execute any
performance scenario, reset the database, fabricate evidence, commit, or push.
