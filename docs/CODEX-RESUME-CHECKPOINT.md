# Codex Resume Checkpoint

## Checkpoint identity

- Created: 2026-09-01 13:37:42 +07 (Asia/Ho_Chi_Minh)
- Repository: `/Users/phamngocgiabao/eshop-sut-hw05-23127027`
- Source commit: `85af3ba875c88283615e22cb108f13e2fccaf0e9`
- Current completed phase: **Phase G — Pinned k6 Toolchain and 2-VU Pilot Preparation**
- Phase B correction review: **RESOLVED BY HUMAN** on 2026-09-01 15:58:08 +07
- Phase C status: **COMPLETE AND HUMAN-REVIEWED**; H-033 `DONE BY HUMAN`
- Phase D status: **COMPLETE AND HUMAN-REVIEWED WITH AUTHENTICATION CORRECTION**; H-034 `DONE BY HUMAN`
- Phase E status: **COMPLETE AND HUMAN-REVIEWED WITH NUMERIC ABORT DEFERRAL**; H-035 `DONE BY HUMAN`
- Phase F status: **COMPLETE AND HUMAN-REVIEWED**; H-036 `DONE BY HUMAN`
- Phase G status: **PREPARATION COMPLETE; PINNED k6 INIT/OUTPUT VERIFIED; PILOT NOT EXECUTED**
- Phase G implementation commit: `d9291f7` (`test: pin k6 and prepare 2-VU pilot`)
- Current gate: **H-037 — 2-VU PILOT EXECUTION APPROVAL**

## Selected workflow

**WF-03 — Purchase followed by customer cancellation**

Human-selected and confirmed unique within the four-person group.

### Exact invariant executable workflow

```text
Login
  → Product Search/List
  → Product Detail
  → Checkout/Create Order
  → Verify newly created Order is pending
  → Cancel that exact Order
  → Verify that exact Order is canceled
```

Load, Stress, and Spike must execute this identical seven-request sequence.
Only their workload models may differ.

## Human-approved Phase B workload decisions

These are approved planning inputs and remain **NOT EMPIRICALLY VALIDATED**.
They are not measured values, production traffic, system capacity, or final
performance thresholds.

### Preserved correction history

| Parameter | OLD VALUE | HUMAN CORRECTION | CURRENT APPROVED PLANNING VALUE |
|-----------|-----------|------------------|---------------------------------|
| Pending verification → cancellation | `0 s`, immediate test-control completion | Add a short defensible user pause while keeping pending-order buildup bounded | Independent uniform random `0.5–1.0 s` |
| Account strategy | One seeded customer as the approved initial constraint | Design reproducible disposable-runtime provisioning for the approved 20-VU ceiling | Up to 20 dedicated valid customers; prefer one per active VU; none provisioned yet |
| Authentication safety | Abort the entire test on first unexpected login 401/403 | Preserve isolated Stress/Spike auth failures as real evidence while still stopping unsafe/systemic conditions | Isolated 401/403 fails only its iteration; confirmed lockout/systemic unsafe auth may abort; numeric repeated-auth cutoff unset |

The correction supersedes the old values without deleting them from this
checkpoint, the workload proposal, or the AI Audit.

### Load

- Executor: `ramping-vus`.
- Ramp 0 → 5 VUs over 1 minute.
- Hold 5 VUs for 5 minutes.
- Ramp 5 → 0 over 1 minute.
- `gracefulRampDown` and `gracefulStop`: 30 seconds.
- Wall-clock safety cap: 8 minutes.
- Approved conservative fallback: 0 → 2 VUs over 30 seconds, hold 2 for
  3 minutes, then 2 → 0 over 30 seconds; five-minute safety cap.

### Stress

- Executor: `ramping-vus`.
- Warm ramp 0 → 2 VUs over 30 seconds.
- Progressive one-minute ramps/holds at 2, 5, 10, 15, and 20 VUs.
- Bounded maximum: 20 VUs; this is not capacity.
- Recovery: 20 → 5 over 1 minute, hold 5 for 1 minute, then 5 → 0 over
  1 minute.
- Graceful settings: 30 seconds.
- Wall-clock safety cap: 14 minutes.

### Spike

- Executor: `ramping-vus`.
- Ramp 0 → 3 VUs over 30 seconds; baseline 3 VUs for 2 minutes.
- Spike 3 → 20 VUs in 10 seconds.
- Hold 20 VUs for 45 seconds.
- Return 20 → 3 VUs in 10 seconds.
- Recovery observation: 3 VUs for 2 minutes; final 30-second ramp-down.
- Graceful settings: 30 seconds.
- Wall-clock safety cap: 7 minutes.

### Think time

- Login → search: independent uniform random 0.5–1.0 seconds.
- Search → detail: independent uniform random 1.0–2.0 seconds.
- Detail → checkout: independent uniform random 1.5–3.0 seconds.
- Pending verification → cancellation: independent uniform random 0.5–1.0
  seconds.
- Total intentional think time: 3.5–7 seconds per iteration.

### Account strategy

- Design reproducible setup for up to 20 dedicated valid customer accounts
  inside every fresh disposable runtime; no such pool is claimed or provisioned
  yet.
- Prefer one dedicated account per active VU: five mappings for Load and up to
  20 for Stress/Spike.
- Provisioning is setup outside measured WF-03 traffic and must never touch the
  original homework database.
- Credentials must remain private and uncommitted.
- Never intentionally send invalid credentials or retry guessed passwords.
- If later verification invalidates the design, stop for human review rather
  than silently sharing accounts or reducing the workload.

### Scenario isolation

- Fresh commit-pinned disposable runtime for each scenario.
- Preserve all prior evidence before any reset/reseed.
- Unique timestamped runtime, raw-result, and report directories.
- Verify clean seed state, zero orders, account state, commit, PID/port, and
  original database hash before each run.
- Never reuse or rename previous raw results as a new scenario artifact.
- Original homework database must never be initialized/reset.

### Operational safety guardrails

- Authorized localhost disposable runtime only.
- Hard maximum: 20 VUs; no automatic escalation.
- Duration caps: Load 8 min, Stress 14 min, Spike 7 min.
- Isolated unexpected login 401/403 fails its current iteration and prevents its
  later requests; never retry guessed/alternate credentials.
- Test-level authentication abort is reserved for confirmed lockout, unusable
  account/runtime state, or confirmed systemic unsafe auth behavior; numeric
  repeated-auth cutoff is deferred pending pilot/runtime evidence and new review.
- The historical 5-connection, 5-cross-account-auth, 10-transactional-5xx, and
  20%-across-two-windows numeric abort proposals are deferred until controlled
  pilot/runtime evidence and a new human review; do not implement them.
- Stop only for confirmed dangerous/invalid conditions under current Phase E
  authority, including verified backend/port loss or confirmed invalidating
  lockout.
- Require at least 2 GiB free before execution.
- Record and control exact PIDs; never use `killall`, force push, or unbounded
  process commands.
- These are safety controls, not homework performance thresholds.

## Approved Phase C data artifacts

- Trackable 20-row public data: `../performance/data/workflow.csv`.
- Placeholder-only private schema template:
  `../performance/data/credentials.template.csv`.
- Data handling guide: `../performance/data/README.md`.
- Quantity is absent because the verified WF-03 flow neither submits nor uses
  it; checkout total is the normalized correlated product-detail price.
- Narrow root `.gitignore` rules protect only private performance credentials,
  local secret configuration, and `performance/secrets/`.
- No real credential or account has been created.

## Approved Phase D correlation decisions

- Each official scenario is a separate local k6 test with at most 20 VUs.
- `exec.vu.idInTest` maps directly to one approved public/private row only after
  validating `1 <= idInTest <= available approved rows`; no wrap, reuse,
  randomness, or fallback.
- Search must yield exactly one exact expected-name match; response-owned
  product ID, detail price, checkout total, and order ID remain dynamically
  correlated within the current iteration.
- JWT and authenticated user identity live for the current iteration only;
  product and order values live only for their current subchains.
- A post-checkout failure remains a visible incomplete lifecycle; no alternate
  order, direct database cleanup, or concealed residue.
- One isolated unexpected login `401`/`403` fails only its current iteration.
  Confirmed lockout/systemic unsafe execution may trigger a reviewed test-level
  abort; no final repeated-auth numeric cutoff is approved.
- Seven stable groups and bounded tags distinguish measured workflow steps
  without sensitive/high-cardinality values.

## Approved Phase E decisions

- Exact seven-step checks are approved; HTTP 200 alone is insufficient and only
  final same-order canceled verification succeeds.
- Approved custom metrics are attempted/failure/auth/created/canceled Counters,
  one final workflow-success Rate, and lifecycle-duration Trend; native tagged
  metrics supply endpoint latency and protocol/iteration evidence.
- Exactly one attempted count and one guarded final Boolean outcome sample are
  required for each valid attempted workflow.
- Six bounded failure classes and stable step tags are approved; dynamic IDs and
  secrets are prohibited from labels.
- Immediate stops cover wrong target, confirmed service loss/lockout, unusable
  preflight, corrupted runtime, evidence-preservation failure, and critical
  local failure.
- The 2 GiB disk minimum and prior VU/wall-clock/graceful bounds are approved
  safety controls, not performance thresholds.
- Four error-based numeric abort rules are deferred pending pilot/runtime
  evidence. No final p95, RPS, allowed-error, or capacity threshold exists.
- Load summary, Stress CSV, and Spike dashboard HTML are the human-approved
  distinct k6-equivalent outputs. H-002 is resolved without external contact;
  genuine native JSON remains canonical and fake/mislabeled JTL is prohibited.

## Important unresolved items

- Phase F architecture/source is human-approved and k6 2.2.0 init-verified, but
  the real SUT workflow remains pilot-unverified.
- Pinned k6 is v2.2.0 at `/opt/homebrew/bin/k6`; no version change is authorized
  without later review.
- The provisioning helper is a draft that has never run; every provisioning
  execution remains separately unauthorized.
- The source-derived one-start backend ordering in `runbooks/k6-pilot.md` needs
  H-037 review because restarting this SUT would reset and erase provisioned
  accounts.
- No final official Load/Stress/Spike execution script/filename exists.
- Final numeric performance thresholds remain unset until real-result analysis.
- Exact Load/Stress/Spike plan filenames/dates require human approval.
- Load/Stress HTML renderer implementation remains pending real data and review;
  H-002 assignment interpretation itself is resolved by the human.
- Relationship between performance demo and Agent Skill demo remains unresolved.
- The distinct report/output interpretation is human-final; real Load/Stress
  renderers and all measured artifacts remain unimplemented.
- Preflight, account-lockout procedure review, real execution approvals,
  screenshots/resource monitoring, hardware evidence, endurance run, result
  analysis, AI misinterpretation review, optimization review, issues, video,
  critique, report, README, validator, self-assessed grade, and ZIP remain later
  work.
- Five truthful local baseline commits exist and Phase G local commits are to be
  finalized; no push has occurred.

## Authoritative continuation files

Read these before continuing beyond the Phase F review checkpoint:

1. [`2026.HW05.Performance Testing_En.pdf`](../2026.HW05.Performance%20Testing_En.pdf) — highest authority.
2. [`assignment-requirements.md`](assignment-requirements.md) — PDF traceability and unresolved assignment wording.
3. [`human-decisions.md`](human-decisions.md) — human selection, approvals, correction, and Phase B review.
4. [`selected-workflow-specification.md`](selected-workflow-specification.md) — exact endpoint/correlation/iteration/check contract.
5. [`workload-model-proposal.md`](workload-model-proposal.md) — approved Phase B planning values and original review matrix.
6. [`test-data-strategy.md`](test-data-strategy.md) — human-approved Phase C decisions and preserved proposal history.
7. [`correlation-strategy.md`](correlation-strategy.md) — human-approved Phase D design and auth correction.
8. [`checks-metrics-safety.md`](checks-metrics-safety.md) — human-approved Phase E decisions and preserved deferred proposals.
9. [`report-output-mapping.md`](report-output-mapping.md) — human-resolved distinct k6 output strategy; pinned capability pending.
10. [`ta-clarifications.md`](ta-clarifications.md) — preserved unsent question and human resolution.
11. [`k6-architecture.md`](k6-architecture.md) — human-approved Phase F draft/static review record.
12. [`k6-toolchain.md`](k6-toolchain.md) — pinned install and genuine no-HTTP capability findings.
13. [`git-recovery-plan.md`](git-recovery-plan.md) — truthful local baseline recovery and hashes.
14. [`../runbooks/k6-pilot.md`](../runbooks/k6-pilot.md) — unexecuted H-037 pilot plan.
15. [`../performance/data/README.md`](../performance/data/README.md) — safe data artifact contract.
16. [`runtime-api-verification.md`](runtime-api-verification.md) — genuine functional HTTP/state evidence.
17. [`sut-discovery.md`](sut-discovery.md) — source-backed endpoint/database/auth findings.
18. [`../runbooks/sut-startup-macos.md`](../runbooks/sut-startup-macos.md) — approved disposable startup strategy.
19. [`../MANUAL-TODO.md`](../MANUAL-TODO.md) — human responsibilities and statuses.
20. [`../ai-audit/audit.md`](../ai-audit/audit.md) and
    [`../ai-audit/interactions/`](../ai-audit/interactions/) — AI-first evidence history.

## Human decisions already completed

- Phase 0, Phase 1, Phase 2 strategy, Phase 2B startup evidence, Phase 3 evidence,
  WF-03 smoke, Phase A contract, and Phase B workload review.
- Strategy B disposable runtime approved.
- WF-03 selected by the human and confirmed unique in the group.
- Seven-request executable correction approved.
- Phase B workload/think-time/account/isolation/safety planning values approved
  without converting them into measurements or final thresholds.
- The later Phase B think-time/account corrections were explicitly approved by
  the human and the earlier values remain preserved as superseded history.
- Phase C was approved with quantity removed after source/runtime contract
  validation; 20 safe public rows, a placeholder credential template, README,
  and narrow ignore rules were authorized and validated.
- Phase D was approved with guarded VU mapping, exact product selection,
  iteration-owned correlation, visible incomplete lifecycles, stable tags, and
  the correction that one isolated unexpected auth response fails only its
  iteration.
- Phase E was approved with exact checks/metrics/outcome/taxonomy and immediate
  safety controls; the four error-based numeric abort proposals were explicitly
  deferred pending pilot evidence, and the report mapping was only
  conditionally approved.
- Phase F was approved without weakening the shared workflow/check/metric/data/
  safety contracts. H-002 was resolved by human interpretation of the PDF's
  explicit k6-equivalent-output rule; the prepared TA question was never sent.

See `MANUAL-TODO.md` for exact IDs and remaining responsibilities.

## Critical rules for the next session

1. If context is lost, read the entire assignment PDF before continuing.
2. Never fabricate measurements, logs, screenshots, videos, issues, human
   review, approvals, URLs, or execution evidence.
3. Never push to `upstream`; `remote.pushDefault` must remain `origin`.
4. Keep the original HW05 database untouched and verify its SHA-256 around
   runtime work. Current known hash:
   `c63f00544180ba1fbb1427a9b9dd3f1784842698809972f33ce90482e7420ba6`.
5. Use commit-pinned disposable runtimes under `/private/tmp`; preserve evidence
   before reset/reseed.
6. k6 2.2.0 is installed and pinned. Do not run SUT/pilot/official k6 traffic
   without the applicable explicit approval.
7. Maintain the AI Audit and preserve actual prompts, outputs, corrections, and
   human-review state during every phase.
8. Human checkpoints remain mandatory. Never mark `DONE BY HUMAN` without an
   explicit human statement.
9. Do not start a real Load, Stress, Spike, or endurance run without its
   dedicated execution-approval checkpoint.
10. Do not reinterpret WF-03 or omit either invariant order-state HTTP probe.

## Resume instruction

Do not redo completed discovery or Phases C–G. Await H-037 review of the pinned
toolchain evidence, pilot runbook, and draft helper. Do not start the SUT,
provision accounts, execute pilot or
official traffic, implement deferred numeric aborts/final performance
thresholds, create official execution filenames, or push without explicit
approval.
