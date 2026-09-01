# Interaction 016 — Phase G Review and Controlled 2-VU Pilot

## Metadata

| Field | Actual record |
|---|---|
| AI tool | Codex CLI |
| Human | 23127027 — Phạm Ngọc Gia Bảo |
| Human approval received | 2026-09-01 (Asia/Ho_Chi_Minh) |
| Pilot artifact ID | `20260901T212619+0700` |
| Source commit | `41c6fecf826148e73a4ce3c651791d90650e595c` |
| Result | **FAILED RUNTIME VALIDATION BEFORE HTTP — NOT OFFICIAL** |

## Actual human prompt

> Phase G — Pinned k6 Toolchain and 2-VU Pilot Preparation has been reviewed.
>
> I approve the controlled 2-VU Pilot execution with the HUMAN decisions and
> constraints below.
>
> Preserve this approval in the AI Audit.
>
> The Pilot is NOT an official Load, Stress, Spike, or endurance result.
>
> ============================================================
> 1. ONE-START DISPOSABLE BACKEND — APPROVED
> ============================================================
>
> Approve the source-required ordering:
>
> Fresh disposable runtime
> → start the backend ONCE
> → backend performs its normal reset/reseed
> → keep that exact owned backend process running
> → provision Pilot accounts against that process
> → validate accounts
> → run the Pilot against the same process
> → preserve Pilot artifacts
> → stop that exact backend PID
>
> Do NOT restart the backend between provisioning and the Pilot because startup
> would reset the disposable database and erase the provisioned accounts.
>
> This behavior must remain confined to the disposable runtime.
>
> The original HW05 repository/database must remain unchanged.
>
> ============================================================
> 2. PILOT ACCOUNT PROVISIONING — APPROVED
> ============================================================
>
> You are authorized to execute the reviewed provisioning helper against the
> approved localhost disposable SUT.
>
> Provision EXACTLY TWO customer accounts for the Pilot:
>
> wf03-customer-01
> wf03-customer-02
>
> Requirements:
>
> - use the real SUT registration endpoint/behavior;
> - run sequentially;
> - use secure runtime-generated passwords;
> - create the private credential file outside Git;
> - file permissions must be restricted appropriately, preferably mode 0600;
> - do not print passwords;
> - do not expose passwords/JWTs in AI Audit;
> - do not expose them in committed artifacts;
> - verify account role=user;
> - verify accounts are unlocked;
> - verify successful login before Pilot execution.
>
> If provisioning or validation fails:
>
> STOP.
>
> Do not invent accounts.
> Do not reuse arbitrary seeded accounts as a silent fallback.
> Do not continue to the Pilot with an incomplete two-account pool.
>
> ============================================================
> 3. PILOT RUNTIME PRE-FLIGHT
> ============================================================
>
> Before k6 Pilot traffic, verify and record:
>
> - current source commit;
> - disposable runtime path;
> - backend PID;
> - backend belongs to the disposable clone;
> - localhost/127.0.0.1 target only;
> - port 3000 ownership;
> - original HW05 database SHA-256;
> - disposable database integrity;
> - Pilot credential pool contains exactly accounts 01 and 02;
> - public workflow rows 01 and 02 are valid;
> - both credentials successfully authenticate;
> - products required by rows 01 and 02 exist;
> - starting order state is recorded;
> - sufficient disk space;
> - output directories are new/clean;
> - k6 version is the pinned version already documented.
>
> Do not silently repair a failed preflight.
>
> ============================================================
> 4. EXECUTE ONLY THE 2-VU PILOT
> ============================================================
>
> You are authorized to execute:
>
> Pilot workload:
> - ramp 0 → 2 VUs over 30 seconds
> - hold 2 VUs for 3 minutes
> - ramp 2 → 0 over 30 seconds
> - five-minute wall-clock safety cap
>
> Use the exact shared WF-03 implementation:
>
> Login
> → think
> → Product Search
> → think
> → Product Detail
> → think
> → Checkout/Create Order
> → Pending-state verification
> → think 0.5–1.0 s
> → Cancel same Order
> → Final canceled-state verification
>
> Do NOT alter the workflow just to make the Pilot pass.
>
> ============================================================
> 5. PILOT IS NOT AN OFFICIAL PERFORMANCE RESULT
> ============================================================
>
> Clearly label every Pilot artifact:
>
> PILOT / RUNTIME VALIDATION — NOT OFFICIAL LOAD RESULT
>
> The Pilot exists to validate:
>
> - actual k6 runtime compatibility;
> - VU-to-account mapping;
> - credential loading;
> - JWT correlation;
> - product correlation;
> - price correlation;
> - orderId correlation;
> - business checks;
> - custom metrics;
> - failure handling;
> - think-time implementation;
> - result writing;
> - output/report mechanisms.
>
> Do NOT use Pilot numbers as:
>
> - official Load results;
> - Stress results;
> - Spike results;
> - endurance threshold;
> - maximum stable RPS;
> - final p95 threshold;
> - system capacity.
>
> ============================================================
> 6. PILOT OUTPUTS
> ============================================================
>
> Preserve genuine Pilot-only artifacts in a clearly separate location, e.g.:
>
> results/pilot/
>
> Use actual timestamped paths if the project design already specifies them.
>
> Preserve where technically applicable:
>
> - exact k6 command;
> - start/end timestamps;
> - exit code;
> - stdout/stderr;
> - native raw k6 JSON;
> - Pilot summary output;
> - relevant CSV/output if the Pilot runner uses it;
> - provisioning redacted evidence;
> - preflight evidence;
> - backend log;
> - disposable runtime metadata.
>
> Do not fabricate missing output.
>
> Do not rename Pilot artifacts as official Load/Stress/Spike evidence.
>
> ============================================================
> 7. PILOT SUCCESS CRITERIA
> ============================================================
>
> Evaluate runtime correctness separately from performance.
>
> For runtime validation, check whether:
>
> - both VUs received their correct dedicated account;
> - no VU/account modulo wrapping occurred;
> - login succeeded with real provisioned accounts;
> - JWT extraction worked;
> - exact product selection worked;
> - detail correlation worked;
> - checkout returned a new orderId;
> - pending probe referenced the same order;
> - cancellation referenced that same order;
> - final probe confirmed canceled state;
> - workflow outcome was emitted exactly once per attempt;
> - custom metrics were emitted;
> - raw result files were actually written;
> - no secrets leaked into result/commit/audit artifacts.
>
> Do not require a particular latency or RPS for Pilot success.
>
> ============================================================
> 8. FAILURE HANDLING
> ============================================================
>
> Do NOT weaken checks if the Pilot exposes a problem.
>
> If a failure occurs:
>
> - preserve the real error;
> - classify it using the approved failure taxonomy;
> - determine whether it is:
>   script bug,
>   data/setup problem,
>   k6 compatibility problem,
>   SUT behavior,
>   or runtime/environment problem;
> - propose a fix;
> - do not silently rerun and hide the first failure.
>
> If a correction is necessary, preserve both the failed Pilot attempt and the
> correction trail in the AI Audit.
>
> Do not call an observed behavior a confirmed SUT bug unless evidence supports
> that classification.
>
> ============================================================
> 9. DEFERRED SAFETY RULES REMAIN DEFERRED
> ============================================================
>
> Do NOT enable the previously deferred arbitrary numeric abort rules merely
> because the Pilot is now running.
>
> Continue using:
>
> - bounded 2-VU workload;
> - bounded duration;
> - localhost-only targeting;
> - backend/process safety;
> - confirmed lockout protection;
> - disk/output/runtime safety.
>
> Collect real Pilot observations that may later inform whether any numeric
> safety rule is warranted.
>
> ============================================================
> 10. AFTER PILOT EXECUTION
> ============================================================
>
> After k6 completes:
>
> 1. stop the exact owned backend process cleanly;
> 2. verify port 3000 is free;
> 3. verify original HW05 database SHA-256 remains unchanged;
> 4. verify original repository runtime files were not mutated unexpectedly;
> 5. preserve disposable/Pilot evidence before cleanup;
> 6. do not delete the Pilot evidence needed for review.
>
> Create:
>
> docs/k6-pilot-results.md
>
> Clearly separate:
>
> RUNTIME VERIFIED
> PILOT MEASUREMENT OBSERVED
> FAILURES / WARNINGS
> NOT YET VALIDATED
> NOT AN OFFICIAL RESULT
>
> ============================================================
> 11. REVIEW PILOT METRICS WITHOUT OVERINTERPRETING
> ============================================================
>
> Summarize real Pilot observations such as:
>
> - attempted workflow count;
> - successful workflow count/rate;
> - request failures;
> - business/lifecycle failures;
> - orders created;
> - orders successfully canceled;
> - any unexpected auth responses;
> - approximate endpoint latency statistics available from the real Pilot;
> - any k6/runtime warnings.
>
> These values may be reported as:
>
> MEASURED PILOT VALUES
>
> but never as final performance thresholds or official scenario conclusions.
>
> ============================================================
> 12. SCRIPT CHANGES AFTER PILOT
> ============================================================
>
> If the Pilot reveals a real implementation defect:
>
> Do NOT immediately rewrite everything and proceed to official testing.
>
> Instead:
>
> - preserve the failing evidence;
> - explain the defect;
> - propose the smallest correction;
> - show the diff;
> - update AI Audit;
> - stop for human review if the change affects workflow semantics,
>   assertions, correlation, workload, metrics, or evidence collection.
>
> Minor compatibility fixes that do not change approved semantics may be
> prepared but must be reported explicitly.
>
> ============================================================
> 13. GIT
> ============================================================
>
> After Pilot evidence/documentation is complete:
>
> Create a truthful local Git commit for the Pilot phase if appropriate.
>
> Do NOT commit:
>
> - real passwords;
> - private credential files;
> - JWTs;
> - temporary disposable runtime files containing secrets.
>
> Do NOT push yet.
>
> Record the real commit hash.
>
> ============================================================
> 14. STOP CONDITION
> ============================================================
>
> At the end show:
>
> A. Pilot preflight result
> B. Provisioning result
> C. Exact Pilot command
> D. k6 exit result
> E. Workflow runtime-validation result
> F. VU/account mapping result
> G. Correlation/check result
> H. Actual Pilot metrics summary
> I. Failures/warnings
> J. Output artifacts created
> K. Secret-leak verification
> L. Original repository/database integrity
> M. Any implementation correction required
> N. Local Git commit result
> O. Recommendation before official test-plan finalization
>
> Then print:
>
> ============================================================
> HUMAN CHECKPOINT REQUIRED — PILOT RESULTS REVIEW
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

## Actual AI actions and output

- Preserved an initial disposable Attempt 01 process-lifecycle failure; no
  provisioning/traffic occurred in it and it was not restarted.
- Created a fresh commit-pinned Attempt 02, installed locked dependencies only
  there, and started one backend PID 20315 with cwd/port ownership verified.
- Verified reset seed, products, public rows, disk, original DB hash, and
  disposable SQLite integrity.
- Provisioned exactly two private customers through real sequential SUT calls;
  helper validations passed and no secret was printed/copied into Git.
- Executed only the documented four-minute 2-VU Pilot with JSON, CSV, summary,
  dashboard, stdout, and stderr outputs.
- Stopped only PID 20315, verified port closure, zero disposable orders, and
  unchanged original DB hash.
- Preserved rather than hid the failed Pilot. No corrected rerun occurred.

## Real Pilot failure

- All 9,699,772 attempts failed before HTTP; data sent/received remained zero.
- A generic runtime/safety error repeated because invalid group names used the
  k6-reserved `::` separator. A separate one-iteration no-HTTP diagnostic
  confirmed `GoError: group and check names may not contain '::'`.
- The tight loop generated 13.0 GB JSON, 6.0 GB CSV, and 4.2 GB stderr. Files
  remain local and checksummed; they were not staged, deleted, or relabeled.
- Custom WF-03 tags incorrectly used `traffic=measured` while native scenario
  metrics used `traffic=pilot`.
- The orchestration wrapper did not expose the numeric Pilot exit code. It is
  recorded as not captured; the diagnostic demonstrated that iteration script
  exceptions may still result in k6 exit code 0.
- Scenario execution ended at 4m00s, but huge-output flushing brought observed
  command/output completion to about 5m19s, exceeding the wall cap by about 19s.

## Proposed correction boundary

No source fix was applied. Human review is required for group-name replacement,
custom traffic-tag correction, whole-test abort on unexpected script/runtime
exceptions, reliable exit/wall-clock runner behavior, corrected-Pilot output
scope, and eventual 21.6 GiB artifact handling.

No official scenario, threshold, push, publication, or performance conclusion
was created.
