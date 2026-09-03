# AI Self-Assessment Recommendation

Status: **AI RECOMMENDATION — HUMAN DECISION REQUIRED**

The PDF assigns 30/20/20/10/10/10 points. This is a conservative evidence-based
recommendation, not the student's final `SelfAssessedGrade` and not a prediction
of the lecturer's mark.

| Rubric area | Maximum | AI recommendation | Evidence and caution |
|---|---:|---:|---|
| Task 1 — Load testing | 30 | 29 | Complete shared/data-driven plan, genuine raw JSON, aggregate report, checks, screenshot, and analysis; retain a small compliance risk because the submission wording says `.jtl` while the selected tool is k6 and uses the documented native-equivalent interpretation. |
| Task 1 — Stress testing | 20 | 19 | Genuine staged run through 20 VUs, full JSON/CSV, time-series report, resource evidence, and zero failures; the bounded schedule did not expose a failure knee and must not be presented as capacity. |
| Task 1 — Spike testing | 20 | 19 | Genuine baseline/20-VU peak/recovery run, native JSON, real dashboard, screenshot, and phase analysis; only one spike observation exists, so repeatability is not established. |
| Task 2 — AI analysis and misinterpretation hunt | 10 | 10 | Immutable original AI analysis, raw-value comparison, nine direct human verdicts, seven optimization judgments, and preserved corrections. |
| Task 3 — Continuous Performance Testing | 10 | 10 | Human-approved path/risk proposal, Mermaid flowchart, baseline/noise/cost discussion, and clearly labelled CI prototype. |
| Agent Skill | 10 | 9 | Valid reusable Skill, safety/evidence contracts, passing deterministic result-tree checker, and human-supplied combined video; the recorded repository demo emphasizes the checker rather than independently replaying a new live end-to-end Codex Skill application. |
| **Total** | **100** | **96** | Recommended filename value: `096`, only if explicitly accepted by the student. |

## Why this is defensible

- All four real measured runs completed 2,716/2,716 workflows and 19,012 HTTP
  requests with zero failure, with raw evidence and distinct views preserved.
- Human review materially corrected AI mistakes and interpretations instead of
  rubber-stamping them.
- The missing GitHub Issue is not a deduction: the PDF says genuine issues
  should be logged, while performance-issue absence is not penalized. No genuine
  SUT issue was confirmed.
- The recommendation leaves four points of caution for assignment-format
  ambiguity, bounded/single-run inference, and Skill-demo depth. k6's stated
  bonus is not added because the PDF gives no numeric bonus formula.

To adopt the recommendation, the student must explicitly provide:

```text
SELF_ASSESSED_GRADE=096
```

The student may choose a different three-digit value in `[000,100]` after
reviewing the evidence.
