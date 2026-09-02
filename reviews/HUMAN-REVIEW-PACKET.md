# HW05 Cumulative Human Review Packet

Status: **ACTIVE — PENDING HUMAN REVIEW ITEMS ACCUMULATE HERE**

This packet contains only AI-generated items whose final judgment or evidence
must remain human-owned. Technical automation continues unless a listed item is
needed to determine the next safe action.

| Artifact / gate | AI proposal | Actual evidence | Detected concern | Recommended human judgment/action | Status |
|---|---|---|---|---|---|
| Official Load visual evidence (H-012) | Capture real k6 execution and exact disposable backend resource usage together | COMPLETED: genuine JPEG plus genuine PNG conversion shows Activity Monitor PID `42059` and adjacent live 5/5-VU Load context for run `20260902T092131+0700` | It is a point-in-time visual, not continuous resource telemetry | Retain as real Load evidence; no further Load screenshot action needed | EVIDENCE PRESENT — FINAL PACKET REVIEW PENDING |
| Official Stress visual evidence (H-012) | Capture real Stress execution and exact disposable backend resource usage together | COMPLETED: genuine JPEG/PNG shows 20/20 VUs at 8m50s and Activity Monitor PID `45430` | Human initially saved it under Load; relocation/conversion trail is documented | Retain as genuine Stress evidence; no further Stress screenshot action needed | EVIDENCE PRESENT — FINAL PACKET REVIEW PENDING |
| Official Spike visual evidence (H-012) | Capture real Spike peak and exact disposable backend resource usage together | COMPLETED: genuine JPEG/PNG shows 20/20 VUs at 2m59s and Activity Monitor PID `48405` | It is a point-in-time visual, not continuous resource telemetry | Retain as real Spike evidence; no further Spike screenshot action needed | EVIDENCE PRESENT — FINAL PACKET REVIEW PENDING |
| Endurance visual evidence (H-012) | Capture genuine k6 execution and exact backend PID together | COMPLETED: genuine JPEG/PNG shows 5/5 VUs at 6m29.9s and Activity Monitor PID `53376` | It is a point-in-time visual, not continuous telemetry | Retain as real endurance evidence; no further execution screenshot action needed | EVIDENCE PRESENT — FINAL PACKET REVIEW PENDING |
| Endurance wrong-listener preflight | Use a fresh owned backend and provision only its disposable database | Human requested PID `52187` stop; subsequent read-only checks found PID absent, port free, zero remaining WF-03 accounts, and both databases integrity `ok` | The first preflight remains an AI orchestration defect and cannot be reused | Retain the failure history; use a new atomic fail-closed listener check in a completely fresh runtime | RESOLVED BY HUMAN ACTION / EVIDENCE |
| Hardware visual/hostname (H-013/H-022) | Preserve real textual specs and capture the required genuine macOS hardware screenshot | Text specs record hostname `Phams-MacBook-Pro.local`; screenshot and previous-homework compatibility evidence are absent | Text alone may not satisfy the PDF visual-evidence requirement | Capture real System Information/About view and confirm hostname compatibility | PENDING HUMAN REVIEW |
| AI analysis/misinterpretation (H-014/H-015) | Compare immutable AI claims with reproducible official raw metrics | Official raw results do not exist yet | Final “AI was wrong / correct interpretation / why” judgment belongs to the student | Complete verdict/explanation cells after automation produces the evidence packet | PENDING HUMAN REVIEW |
| Optimization verdict (H-016) | Classify source-backed recommendations provisionally | Official bottleneck evidence does not exist yet | Feasibility/hallucination verdict must be human | Confirm each final verdict after metric/source evidence is populated | PENDING HUMAN REVIEW |
| Demo/video (H-003/H-018/H-019/H-020) | Prepare runbook, Vietnamese outline, commands, and artifact walkthrough | No student-narrated recording or YouTube URL exists | AI cannot narrate as the student or invent/upload a URL | Student records Vietnamese demo, uploads unlisted, and supplies real URL; decide combined-video treatment | PENDING HUMAN REVIEW |
| AI critique (H-021) | Produce an evidence-grounded 200–300 word candidate | Final official execution history is incomplete | Final substantive critique requires student review/approval | Edit or explicitly approve the later draft | PENDING HUMAN REVIEW |
| Grade/submission (H-023/H-024/H-025) | Validate technical completeness and package only after inputs exist | No human grade or final approval exists | AI cannot invent grade or claim Moodle submission | Provide `SELF_ASSESSED_GRADE=000..100`, approve final package, then upload it personally | PENDING HUMAN REVIEW |

Additional rows must be appended as genuine official evidence and AI-generated
review artifacts are created. Historical approvals already recorded in
`docs/human-decisions.md` are not reopened here.
