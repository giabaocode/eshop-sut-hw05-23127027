# HW05 — AI-First Performance Testing Report

Status: **CONTENT/EVIDENCE COMPLETE — SELF-ASSESSMENT AND PACKAGING PENDING**

Student: **23127027 — Phạm Ngọc Gia Bảo**

SUT: **EShop REST backend**

Tool: **k6 v2.2.0 (darwin/arm64)**

OS: **macOS 26.5.2, Apple M5, 16 GB RAM**

Repository: <https://github.com/giabaocode/eshop-sut-hw05-23127027>

## 1. General information

This report documents a source-backed, data-driven, AI-first performance test
of the official EShop SUT. AI generated proposals and automation incrementally;
the student reviewed workflow, workload, data, correlation, safety, metrics,
reporting, and interpretation. The audit preserves both mistakes and later
human corrections rather than rewriting history.

## 2. SUT and environment

The backend is Node.js/Express with a local SQLite database on
`http://127.0.0.1:3000`. k6 was installed through Homebrew and pinned at v2.2.0.
Each measured run used a fresh commit-pinned disposable clone. The protected
original database SHA-256 remained
`c63f00544180ba1fbb1427a9b9dd3f1784842698809972f33ce90482e7420ba6`.

Text hardware evidence is in [`../evidence/hardware/specs.md`](../evidence/hardware/specs.md).
The student confirmed that `Phams-MacBook-Pro.local` is the same
MacBook/hostname used for previous homework deployment. The first screenshot
candidate was genuine but exposed a device serial and was replaced before
commit. The genuine safe replacement
[`../evidence/hardware/hardware-specs-hostname.jpg`](../evidence/hardware/hardware-specs-hostname.jpg)
shows the hostname, MacBook Pro 14-inch, Apple M5, and 16 GB without a visible
serial number or hardware UUID.

## 3. Selected workflow: WF-03

The human-selected and group-unique workflow is “Purchase followed by customer
cancellation”:

```text
Login → think 0.5–1.0s → Search → think 1.0–2.0s → Detail
→ think 1.5–3.0s → Checkout/Create Order → Verify same order pending
→ think 0.5–1.0s → Cancel same order → Verify same order canceled
```

It covers authentication (`POST /api/login`), read-heavy product search/detail,
and transactional order creation/verification/cancellation. The executable
contract is detailed in
[`../docs/selected-workflow-specification.md`](../docs/selected-workflow-specification.md).

## 4. AI-first design process

The work progressed through repository/PDF discovery, safe runtime verification,
workflow selection, workload design, test-data design, dynamic correlation,
checks/metrics/safety, a shared k6 implementation, pinned-tool validation, a
two-VU Pilot, official scenarios, endurance, and raw-data analysis. Human
decisions are in [`../docs/human-decisions.md`](../docs/human-decisions.md), and
the chronological record is in [`../ai-audit/audit.md`](../ai-audit/audit.md).

The Pilot exposed real AI-generated harness defects: invalid `::` names, a
tight exception loop producing roughly 21.6 GiB without HTTP, incorrect Pilot
traffic tags, and a provisioning invocation boundary. A later endurance
preflight exposed a non-fail-closed wrong-listener orchestration. All failed
attempts and corrections remain auditable.

## 5. Data-driven strategy

`performance/data/workflow.csv` contains 20 deterministic non-secret rows.
Private credentials are generated during disposable setup, mode-restricted, and
never committed. Each VU maps deterministically to one account through
`exec.vu.idInTest`; there is no modulo/account-sharing fallback. JWT, user ID,
product ID, product price, checkout total, and order ID are extracted from the
current iteration's responses and never stored as authoritative CSV values.

All official preflights required 20 valid user accounts and zero comparable
starting orders. Load activated accounts 01..05; Stress and Spike could activate
01..20.

## 6. Load design, execution, and results

Workload: 0→5 VUs/1m, 5 VUs/5m, 5→0/1m; seven minutes scheduled, eight-minute
safety cap. Official entry:
`performance/scenarios/official/23127027_Load_20260901.js`.

| Metric | Measured value |
|---|---:|
| Workflows | 345/345 successful |
| HTTP requests / failed | 2,415 / 0 |
| Checks | 13,110/13,110 |
| Throughput | 5.731666 requests/s |
| HTTP mean / p95 / p99 | 1.821239 / 4.1019 / 4.69974 ms |
| Lifecycle p95 | 989.8 ms |
| Orders created/canceled | 345/345 |

The genuine screenshot showed backend PID 42059 at a point-in-time 1.4% CPU,
55.6 MB memory, and 11 threads. Full analysis:
[`../analysis/load-analysis.md`](../analysis/load-analysis.md).

## 7. Stress design, execution, and results

The exact 12m30s schedule progressed through 2, 5, 10, 15, and 20 VUs,
recovered to 5, then zero; safety cap 14 minutes. Twenty VUs was an input, not
capacity.

| Metric | Measured value |
|---|---:|
| Workflows | 1,281/1,281 successful |
| HTTP requests / failed | 8,967 / 0 |
| Checks | 48,678/48,678 |
| Aggregate throughput | 11.877557 requests/s |
| HTTP mean / p95 / p99 | 1.700244 / 3.9147 / 4.45374 ms |
| Full 20-VU bucket RPS | 25.933333 and 26.533333 |
| Full 20-VU bucket p95 | 3.7523 and 3.71925 ms |

No degradation knee appeared in this bounded run. The resource screenshot
showed PID 45430 at one instant (4.0% CPU, 79.9 MB, 11 threads). Full analysis:
[`../analysis/stress-analysis.md`](../analysis/stress-analysis.md).

## 8. Spike design, execution, and results

Workload: 0→3/30s; 3 VUs/2m; 3→20/10s; 20 VUs/45s; 20→3/10s; 3 VUs/2m;
3→0/30s. Scheduled 6m5s; safety cap seven minutes.

| Metric | Measured value |
|---|---:|
| Workflows | 377/377 successful |
| HTTP requests / failed | 2,639 / 0 |
| HTTP p95 / p99 | 3.9654 / 4.91164 ms |
| Baseline / peak / recovery p95 | 4.324 / 3.5988 / 4.038 ms |
| Peak throughput | 26.377778 requests/s |
| Orders created/canceled | 377/377 |

The tested recovery window had no failure or visible backlog, but one run does
not prove repeatable recovery. The peak screenshot showed PID 48405 at 4.0%
CPU, 69.0 MB, and 11 threads. Full analysis:
[`../analysis/spike-analysis.md`](../analysis/spike-analysis.md).

## 9. Human review and corrections

The final test-plan history is in
[`../reviews/test-plan-review.md`](../reviews/test-plan-review.md). Major human
corrections included realistic cancellation think time, 20 dedicated accounts,
iteration-level handling of isolated auth failures, deferral of arbitrary
numeric aborts, k6-safe names, harness-exception test abort, bounded outputs,
and exact provisioning/process boundaries.

## 10. Resource and hardware evidence

Genuine combined k6/Activity Monitor images exist for Load, Stress, Spike, and
endurance under each timestamped `evidence/screenshots/` directory. They prove
point-in-time process observations only; no continuous CPU/memory telemetry was
collected. Hardware text evidence is genuine. A replacement screenshot without
the visible device serial is preserved at
[`../evidence/hardware/hardware-specs-hostname.jpg`](../evidence/hardware/hardware-specs-hostname.jpg).

## 11. Endurance result

Evidence from clean official runs justified a conservative five-VU sustained
input. The endurance workload ramped to 5 VUs over 30 seconds, held for 12
minutes, then ramped down over 30 seconds.

It completed 713/713 workflows, 4,991/4,991 successful HTTP requests,
27,094/27,094 checks, and 713/713 cancellations. Aggregate p95 was 4.377 ms,
p99 4.8056 ms, and throughput 6.372423 requests/s. First/second-half mean RPS
was 6.6/6.636111 with zero failures. The demonstrated local endurance point is
**5 VUs sustained for 12 minutes** for this exact machine/commit/data—not
maximum capacity or a longer-duration guarantee.

## 12. Original AI analysis

The immutable original analysis is
[`../analysis/ai-analysis-original.md`](../analysis/ai-analysis-original.md),
committed as `5e4b00f` before human verdicts. It reported no observed failure
knee, highlighted relatively slower writes, and proposed candidate regression
guardrails while attempting to retain uncertainty.

## 13. Misinterpretation hunt

The student completed
[`../reviews/ai-analysis-review.md`](../reviews/ai-analysis-review.md). Claim 3
was judged **MISLEADING** because checkout/cancellation were only relatively
slower, not confirmed bottlenecks. Claim 8 was **INSUFFICIENT EVIDENCE** because
the numeric guardrails lacked repeat-run/noise validation. Other claims were
accepted with explicit workload, repeatability, duration, and scope limits.

## 14. Optimization recommendations

The final human matrix is
[`../reviews/optimization-review.md`](../reviews/optimization-review.md).
Atomic owner/state-scoped cancellation was considered feasible only with
semantic tests. Login-write, WAL/busy timeout, and email-index benefits lacked
evidence. The normal leading-wildcard search index and generic SQLite connection
pool were classified hallucinated/not applicable. No optimization or fake
post-optimization benchmark was applied.

## 15. Genuine issues

No SUT performance issue was confirmed within tested scope, so no speculative
GitHub Issue was created. The student approved `NOT APPLICABLE`; harness/setup
failures are not SUT bugs. Evidence and H-017 disposition are in
[`../analysis/genuine-issue-determination.md`](../analysis/genuine-issue-determination.md).

## 16. Continuous Performance Testing

The human-approved
[`../proposal/continuous-performance-testing.md`](../proposal/continuous-performance-testing.md)
defines path-based suite selection, controlled baselines, p95 regression
detection, warning-first gating, repeat/noise handling, cost, false alarms,
false negatives, and artifact retention. It includes a Mermaid flowchart and an
undeployed CI prototype. Numeric regression tolerances remain configurable and
human-reviewed rather than falsely validated.

## 17. Agent Skill

The human-approved reusable Skill is under [`../skills/hw05-k6-performance/`](../skills/hw05-k6-performance/).
It covers requirement/source discovery, workflow/data design, disposable
execution, authentic evidence, analysis, audit, and submission validation. It
explicitly refuses to fabricate screenshots, narration, reviews, grades, or
results. Skill validation evidence is recorded in the final validator output.
The student supplied the combined unlisted demonstration video:
<https://youtu.be/jPngjTuvT1Q>. YouTube metadata was verified accessible,
unlisted, approximately 16 minutes 15 seconds long, and carrying a Vietnamese
automatic-caption track. The student's narration/content responsibility remains
a human attestation rather than an AI-generated claim.

## 18. AI critique

The student's human-approved 278-word critique and its source matrix are in
[`../reviews/ai-critique.md`](../reviews/ai-critique.md) and
[`../reviews/ai-critique-evidence.md`](../reviews/ai-critique-evidence.md).

## 19. Conclusion

All measured workflows completed successfully within the tested inputs, and no
SUT performance defect or capacity ceiling was established. The strongest
result is not a universal speed claim but a reproducible evidence chain: one
shared workflow, fresh data, strict correlation/checks, authentic raw output,
distinct k6 reports, explicit uncertainty, and preserved AI/human corrections.

## 20. References

- Official assignment: `2026.HW05.Performance Testing_En.pdf` (kept local and
  excluded from submission Git history).
- Official SUT: <https://github.com/ttbhanh/eshop-sut>
- Student repository: <https://github.com/giabaocode/eshop-sut-hw05-23127027>
- k6 toolchain record: [`../docs/k6-toolchain.md`](../docs/k6-toolchain.md)
- Cross-scenario analysis: [`../analysis/scenario-comparison.md`](../analysis/scenario-comparison.md)

## 21. AI Audit appendix

The full mandatory Markdown audit is
[`../ai-audit/audit.md`](../ai-audit/audit.md), with detailed records under
`ai-audit/interactions/`. It identifies Codex CLI, real prompts/actions,
execution evidence, corrections, commits, and unresolved human-only items.

## Remaining attributable fields

- Self-assessed grade: **[HUMAN REQUIRED]**
- Final package/Moodle approval and upload: **[HUMAN REQUIRED]**
