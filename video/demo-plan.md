# Combined Performance and Agent-Skill Demo Plan

Status: **HUMAN RECORDING REQUIRED — NO VIDEO OR URL EXISTS**

Recommended duration: 8–10 minutes, satisfying the at-least-six-minute
performance demo while also demonstrating the Agent Skill. Whether one combined
video satisfies both PDF references remains H-003, a final human decision.

| Time | Screen content | Demonstration goal |
|---|---|---|
| 0:00–0:45 | Student ID, repository, pinned k6 version, hostname | Establish identity/environment |
| 0:45–2:00 | Official thin wrappers and shared `executeWf03()` | Prove one E2E auth/read/transactional flow and dynamic correlation |
| 2:00–3:15 | Public CSV, private credential contract, disposable preconditioning | Explain data-driven dedicated-account safety without exposing secrets |
| 3:15–5:00 | Genuine Load/Stress/Spike raw trees and three distinct reports | Demonstrate actual output, checks, latency, failures, and k6 equivalents |
| 5:00–6:00 | Genuine k6 + Activity Monitor screenshots | Show exact backend PID/resource evidence and explain point-in-time limitation |
| 6:00–7:00 | Endurance raw analysis | Explain 5 VUs/12m local endurance point and uncertainty |
| 7:00–8:15 | Invoke/read `$hw05-k6-performance`; run its result-tree checker | Demonstrate reusable Skill on a complete workflow evidence set |
| 8:15–9:15 | Human review matrices and AI Audit failures | Demonstrate AI-first corrections and misinterpretation hunt |
| 9:15–10:00 | CPT Mermaid proposal, conclusion, repository URL | Close with continuous-testing model and limitations |

## Exact safe walkthrough commands

Run from the repository root while recording:

```sh
k6 version
hostname
git log --oneline --decorate -12
sed -n '1,220p' performance/lib/workflow.js
sed -n '1,25p' performance/data/workflow.csv
skills/hw05-k6-performance/scripts/check-result-tree.sh
sed -n '1,220p' analysis/scenario-comparison.md
sed -n '1,220p' reviews/ai-analysis-review.md
```

Open the genuine HTML reports and screenshots from their existing timestamped
directories. Do not display private runtime credential files. If a live k6
demonstration is required, use a newly prepared disposable 2-VU validation run;
never replay or relabel an official result, and keep Activity Monitor filtered
to the exact owned backend PID in the same frame.
