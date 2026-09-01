# Interaction 017 — Failed-Pilot Human Review and Corrected-Pilot Authorization

| Field | Actual record |
|---|---|
| AI tool | Codex CLI |
| Recorded | 2026-09-01 22:07:02 +0700 (Asia/Ho_Chi_Minh) |
| Human gate | H-038 reviewed; minimum fixes, bulk-evidence cleanup, and one fresh corrected 2-VU Pilot authorized |
| Official-result boundary | Pilot only; no Load, Stress, Spike, endurance, threshold, or push authorization |

## Actual human instruction

> The failed 2-VU Pilot has been reviewed by me.
>
> I confirm that the failure is a TEST HARNESS / k6 compatibility defect,
> not evidence of SUT performance or a confirmed SUT bug.
>
> Preserve the failed Pilot history and this HUMAN review in the AI Audit.
>
> Apply only the minimum corrections below, then execute ONE fresh corrected
> 2-VU Pilot.
>
> Do NOT run official Load, Stress, Spike, or endurance.
>
> ============================================================
> 1. RESERVED `::` NAMES — HUMAN CORRECTION
> ============================================================
>
> The Pilot proved that k6 v2.2.0 rejects `::` in group/check names.
>
> Search ALL executable k6 code for group AND check names containing `::`.
>
> Replace them with stable k6-safe names.
>
> For example, prefer bounded names such as:
>
> wf03_01_login
> wf03_02_search
> wf03_03_detail
> wf03_04_checkout
> wf03_05_pending_probe
> wf03_06_cancellation
> wf03_07_final_probe
>
> For checks, use stable readable names without `::`.
>
> Do NOT change:
> - business semantics,
> - endpoint mapping,
> - correlation,
> - assertion strength,
> - workflow order.
>
> Document:
>
> OLD AI/DRAFT DESIGN
> → PILOT FAILURE
> → HUMAN-APPROVED CORRECTION
>
> ============================================================
> 2. PILOT TRAFFIC TAG — HUMAN CORRECTION
> ============================================================
>
> Correct custom metric tagging so the shared workflow uses the execution
> context's traffic classification.
>
> Official future runs:
> traffic=measured
>
> Pilot:
> traffic=pilot
>
> Do not hard-code traffic=measured inside shared metric helpers.
>
> Verify every Pilot custom metric is tagged as Pilot where applicable.
>
> ============================================================
> 3. UNEXPECTED EXCEPTION POLICY — HUMAN CORRECTION
> ============================================================
>
> The generic catch allowed an unexpected script/runtime exception to create
> approximately 9.7 million tight-loop iterations.
>
> This must never happen again.
>
> Distinguish:
>
> EXPECTED WORKFLOW FAILURE
> from
> UNEXPECTED TEST-HARNESS / RUNTIME EXCEPTION.
>
> Expected business/correlation failures:
> - record the current iteration failure once,
> - emit the workflow outcome once,
> - end that iteration safely.
>
> Unexpected script/runtime exceptions such as:
> - unsupported k6 API behavior,
> - illegal group/check name,
> - programming error,
> - unexpected invariant violation in the test harness
>
> must:
> 1. preserve a sanitized diagnostic,
> 2. emit failure information if safely possible,
> 3. abort the test using the approved k6 test-level abort mechanism.
>
> Do NOT repeatedly start new iterations after a test-harness defect.
>
> Do not leak passwords, JWTs, or private credential data in exception output.
>
> ============================================================
> 4. PROCESS EXIT + WALL-CLOCK ENFORCEMENT
> ============================================================
>
> Correct the runner so it reliably records:
>
> - actual k6 PID,
> - actual numeric k6 exit code,
> - start time,
> - process exit time,
> - artifact-flush completion time.
>
> The corrected Pilot still has:
>
> scheduled workload = 4 minutes
> human-approved safety cap = 5 minutes
>
> Implement a real external exact-PID watchdog appropriate for macOS without:
>
> - sudo,
> - broad killall/pkill patterns,
> - killing unrelated k6/node processes.
>
> If the process exceeds the approved hard cap, terminate only the owned k6 PID
> and record that the safety watchdog fired.
>
> Do not report an unknown exit code when the corrected runner can capture it.
>
> ============================================================
> 5. BOUNDED OUTPUT SET FOR CORRECTED PILOT
> ============================================================
>
> The failed Pilot generated ~21.6 GiB because the tight exception loop produced
> millions of iterations and simultaneous verbose outputs.
>
> For the CORRECTED Pilot, use a smaller validation-oriented output set.
>
> Required Pilot outputs:
>
> - native granular k6 JSON
> - summary JSON/custom summary
> - stdout
> - stderr
> - preflight evidence
> - provisioning redacted evidence
> - backend log
> - runtime metadata
>
> Do NOT enable Pilot CSV time-series output.
>
> Do NOT require Pilot web-dashboard HTML.
>
> Those output capabilities were already verified separately with the pinned
> k6 version and are not necessary for validating WF-03 runtime behavior.
>
> Official scenario output/report requirements remain unchanged.
>
> The corrected Pilot raw JSON remains genuine Pilot data, not official
> Load/Stress/Spike evidence.
>
> ============================================================
> 6. FAILED-PILOT 21.6 GiB EVIDENCE CLEANUP
> ============================================================
>
> The failed Pilot is not an official homework scenario.
>
> I authorize cleanup of the three huge UNTRACKED failed-Pilot files after
> preserving sufficient truthful failure evidence.
>
> Before deletion, preserve in the committed Pilot evidence:
>
> - exact original file paths
> - exact byte sizes
> - SHA-256 values already obtained
> - timestamps
> - which tool/output created each file
> - the actual root-error text:
>   `GoError: group and check names may not contain '::'`
> - relevant bounded exact stderr excerpt sufficient to demonstrate the defect
> - failed Pilot summary metrics already documented
> - confirmation that HTTP bytes were 0 / 0
> - confirmation that no SUT HTTP request occurred
> - reason for cleanup:
>   failed non-official Pilot produced pathological output volume due to a
>   tight test-harness exception loop
>
> Do NOT claim the large raw files are still retained after deletion.
>
> Update the audit truthfully:
>
> FAILED PILOT BULK RAW ARTIFACTS REMOVED AFTER HUMAN-APPROVED EVIDENCE
> PRESERVATION.
>
> Do NOT commit the huge files.
>
> After cleanup, verify the three files are gone and report reclaimed disk
> space.
>
> ============================================================
> 7. STATIC VALIDATION BEFORE RERUN
> ============================================================
>
> Before executing the corrected Pilot:
>
> - search source for remaining `::` group/check names;
> - run available syntax/static checks;
> - inspect diff;
> - verify no workflow semantic change;
> - verify no credential leakage;
> - verify Pilot traffic tagging;
> - verify unexpected exception path causes test-level abort;
> - verify corrected runner captures exit status;
> - verify output set is bounded.
>
> Create a truthful local Git commit for the Pilot fixes before rerun.
>
> Do NOT push.
>
> ============================================================
> 8. FRESH CORRECTED PILOT
> ============================================================
>
> Do NOT reuse the previous disposable runtime.
>
> Create a fresh commit-pinned disposable runtime.
>
> Use the approved one-start ordering:
>
> fresh clone
> → start backend once
> → normal clone-local reset/reseed
> → provision exactly two new disposable accounts
> → validate them
> → run corrected 2-VU Pilot on the same backend process
> → preserve outputs
> → stop exact backend PID
> → integrity checks
>
> Use:
>
> 0 → 2 VUs over 30s
> 2 VUs for 3m
> 2 → 0 over 30s
>
> Same exact WF-03 workflow:
>
> Login
> → think
> → Search
> → think
> → Detail
> → think
> → Checkout
> → pending verification
> → think 0.5–1.0s
> → cancellation
> → final canceled verification
>
> Do not weaken assertions or remove workflow steps to achieve success.
>
> ============================================================
> 9. CORRECTED PILOT REVIEW DATA
> ============================================================
>
> After execution report ACTUAL values for:
>
> - k6 numeric exit code
> - workflow attempts
> - workflow successes
> - workflow success Rate
> - first-terminal failures by bounded class/step
> - HTTP request count
> - http_req_failed
> - orders created
> - orders canceled
> - unexpected authentication responses
> - both VUs/account mappings
> - JWT correlation result
> - product correlation result
> - price correlation result
> - orderId correlation result
> - pending-state checks
> - cancellation checks
> - final canceled-state checks
> - Pilot raw JSON size
> - stdout/stderr size
> - process wall-clock time
> - any warnings/errors
>
> These are:
>
> MEASURED CORRECTED PILOT VALUES
>
> They are NOT:
> - official Load results,
> - capacity,
> - endurance threshold,
> - final p95/RPS acceptance thresholds.
>
> ============================================================
> 10. OUTPUT / DOCUMENTATION
> ============================================================
>
> Preserve the failed attempt separately from the corrected attempt.
>
> Create/update:
>
> docs/k6-pilot-results.md
> docs/human-decisions.md
> runbooks/k6-pilot.md
> ai-audit/audit.md
> MANUAL-TODO.md
>
> Use a new timestamped directory for the corrected Pilot.
>
> Never overwrite failed-Pilot evidence documentation.
>
> After review artifacts are complete, create a truthful local Git commit for
> the corrected Pilot results.
>
> Do NOT push yet.
>
> ============================================================
> 11. STOP
> ============================================================
>
> At the end show:
>
> A. Failed-Pilot correction summary
> B. 21.6-GiB cleanup result
> C. Fix commit hash
> D. Corrected Pilot preflight
> E. Provisioning result
> F. Exact corrected k6 command
> G. Numeric k6 exit code
> H. Runtime workflow validation
> I. VU/account validation
> J. Correlation/check validation
> K. Actual corrected Pilot metrics
> L. Output sizes
> M. Safety-watchdog result
> N. Failures/warnings
> O. Original repository/database integrity
> P. Corrected-Pilot Git commit
> Q. Recommendation before official test-plan finalization
>
> Then print:
>
> ============================================================
> HUMAN CHECKPOINT REQUIRED — CORRECTED PILOT REVIEW
> ============================================================
>
> STOP.
>
> Do NOT:
> - run official Load
> - run Stress
> - run Spike
> - run endurance
> - finalize performance thresholds
> - push to GitHub

## Applied decision boundary

The human explicitly classified the first Pilot failure as a test-harness/k6
compatibility defect, approved the six minimum correction areas, approved exact
deletion of only the three untracked pathological files after committed evidence
preservation, and authorized exactly one fresh corrected Pilot. No official
scenario, performance threshold, or push was authorized.

## Actual AI outcome

- Applied and statically validated the approved minimum harness corrections;
  committed them locally as `c75b514`.
- After that preservation commit, removed only the three authorized untracked
  failed-Pilot files. Exact absence checks passed; about 21.62 GiB was reclaimed.
- Created fresh corrected Attempt `20260901T221331+0700` at `c75b514`. Source,
  database separation, marker, disk, pinned k6, backend PID/cwd/port, reset/seed,
  public rows, and product readiness gates passed.
- A clone-local helper invocation failed before registration with exit code 1
  and sanitized code `runtime_is_original_repository`, because the helper's
  script-relative protected root became the clone itself.
- Did not silently retry the helper from a different location. Created no Pilot
  account or credential, ran no k6 process, and produced no corrected metric.
  Stopped exact backend PID 22146; verified zero disposable Pilot users/orders,
  free port, valid databases, and unchanged original DB hash.

The proposed same-commit original-worktree helper invocation and a new fresh
attempt require H-039 human review. No official scenario or push occurred.
