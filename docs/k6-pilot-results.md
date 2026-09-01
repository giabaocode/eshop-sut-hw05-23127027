# k6 2-VU Pilot Results

Status: **FAILED PILOT PRESERVED; CORRECTED ATTEMPT BLOCKED BEFORE PROVISIONING — NOT OFFICIAL**

Pilot artifact ID: `20260901T212619+0700`

Pinned source: `41c6fecf826148e73a4ce3c651791d90650e595c`

Pinned tool: k6 `v2.2.0` darwin/arm64

## 1. Scope and interpretation boundary

This was the human-approved bounded 2-VU Pilot only. It is not Load, Stress,
Spike, endurance, capacity, acceptance-threshold, or official performance
evidence. The observed values below are real Pilot values, but the workflow did
not reach HTTP because of a script compatibility defect. They therefore cannot
be interpreted as SUT latency, RPS, throughput, or capacity.

## 2. Preflight result

Attempt 01 was preserved as a runtime-harness preflight failure. Its sandboxed
backend printed normal startup lines but did not remain alive; no account or k6
traffic followed. A new clean Attempt 02 clone was used rather than restarting
Attempt 01.

Attempt 02 passed all traffic gates:

- exact detached commit `41c6fec` in
  `/private/tmp/eshop-hw05-pilot.4B74ft/runtime`;
- clone database had a different inode from the original;
- one owned backend PID `20315`, command `node server.js`, cwd in that clone;
- PID 20315 owned localhost port 3000 and stayed the same through setup/Pilot;
- clone reset: SQLite integrity `ok`, two seeded users, five exact products,
  zero orders;
- original DB SHA-256 before traffic:
  `c63f00544180ba1fbb1427a9b9dd3f1784842698809972f33ce90482e7420ba6`;
- public rows 01/02 and their exact products/positive prices valid;
- more than 2 GiB free disk; new Pilot output directories;
- pinned `/opt/homebrew/bin/k6` v2.2.0.

The first sandboxed `npm ci` failed DNS with `ENOTFOUND`; the exact same
lockfile-pinned command succeeded in the disposable clone with network access.
npm reported a deprecated package and four audit vulnerabilities (one each
low/moderate/high/critical). No automatic fix or lockfile mutation occurred.

## 3. Provisioning result

**PASS.** The reviewed helper sequentially created exactly:

- `wf03-customer-01`;
- `wf03-customer-02`.

It used the real SUT registration API against the owned disposable backend,
generated private passwords at runtime, wrote a two-row credential file outside
Git with mode `0600`, and did not print passwords or tokens. Real setup logins
validated both accounts as `role=user`, `login_attempts=0`, unlocked, with zero
orders. Disposable SQLite integrity remained `ok`, with four total users and
exactly two Pilot users.

## 4. Exact command and execution result

The exact command, including output paths but no credential values, is preserved
in the Pilot evidence directory. It used:

- the 30s ramp to 2, 3m hold, and 30s ramp to zero;
- native JSON and CSV outputs;
- full/native summary export;
- web-dashboard HTML export;
- explicit `-e` localhost and private credential-file paths.

k6 reported the full 4m scheduled scenario complete with 0 interrupted
iterations and max 2 VUs. The orchestration session closed without returning its
numeric exit code; the subsequent poll reported `Unknown process id`. The exit
code is therefore **NOT CAPTURED** and is not invented. A separate one-iteration
diagnostic later showed that k6 v2.2.0 can return exit code 0 despite an uncaught
iteration script exception, so a numeric zero alone would not prove Pilot
success anyway.

The first metric timestamp was `21:33:56 +07`; the final summary/output mtime was
`21:38:43 +07`, approximately 5m19s. Although the k6 scenario itself ended at
4m00s, flushing the unexpectedly huge output exceeded the external five-minute
wall-clock target by roughly 19 seconds. This is a **runtime/output safety
failure**, not an accepted exception to the cap.

Backend PID 20315 was then stopped explicitly with Ctrl-C; the harness reported
backend exit code 1 from the interrupt. Port 3000 was confirmed free.

## 5. Runtime-validation result

| Validation target | Result | Evidence/meaning |
|---|---|---|
| k6 init and data loading | **VERIFIED** | Script initialized with real private file and approved public rows |
| 2-VU executor | **VERIFIED** | `vus_max=2`, scheduled ramp/hold/down completed |
| VU range guard | **PARTIAL** | Both VUs iterated without data/setup abort, but no login identity request occurred |
| Dedicated account mapping | **NOT RUNTIME VERIFIED** | Preflight join/pool valid; HTTP identity was never observed |
| Login/JWT | **NOT VALIDATED** | Zero HTTP bytes sent/received |
| Search/product/detail/price | **NOT VALIDATED** | First group failed before login callback |
| Checkout/order ID | **NOT VALIDATED** | No order created |
| Pending/cancel/final probe | **NOT VALIDATED** | Disposable DB ended with zero orders |
| Think time | **NOT VALIDATED** | Failure occurred before first think time |
| One outcome per attempt | **VERIFIED FOR FAILURE PATH** | attempted, failure, and one false Rate sample counts match exactly |
| Custom metric emission | **PARTIAL** | attempted/failure/success emitted; created/canceled/lifecycle/auth metrics never reached |
| Raw/output writing | **VERIFIED, UNSAFELY LARGE** | JSON, CSV, summary JSON, dashboard HTML, stdout/stderr were real files |

## 6. Root cause and failure classification

Every iteration reached `beginWorkflowAttempt()`, then failed at the first call:

```text
group('wf03::01_login', ...)
```

Pinned k6 reserves `::` as the group/check path separator. The shared catch
replaced the original exception with the sanitized generic message and returned
control to the executor, which immediately began the next iteration without any
think time or request.

An isolated no-HTTP one-iteration diagnostic confirmed the exact underlying
error:

```text
GoError: group and check names may not contain '::'
```

Classification:

- primary: **script bug / k6 runtime compatibility**;
- failure taxonomy: **runtime/safety** at `step=setup`;
- secondary: **output/runtime safety failure** from the tight exception loop;
- not a confirmed SUT bug;
- not a credential, account, product, or database failure.

The source's generic catch made the first cause invisible in normal Pilot
stderr. The diagnostic was required to expose it.

## 7. Measured Pilot values — invalid for performance conclusions

| Metric | Actual Pilot value |
|---|---:|
| `wf03_workflow_attempted` | 9,699,772 |
| `wf03_failures` | 9,699,772 |
| `wf03_workflow_success` | 0 / 9,699,772 = 0% |
| k6 `iterations` | 9,699,772 |
| Interrupted iterations | 0 |
| Max VUs | 2 |
| Average iteration duration | 23.97 µs |
| Median iteration duration | 17.79 µs |
| p95 iteration duration | 54.45 µs |
| HTTP data sent/received | 0 B / 0 B |
| HTTP requests/failures | No HTTP metrics emitted |
| Orders created/canceled | 0 / 0 |
| Unexpected auth responses | 0 observed; login was never attempted |
| Endpoint latency | Unavailable |

The rates and microsecond iteration timings measure only a local exception loop.
They must not appear as SUT performance observations or thresholds.

## 8. Output findings

Genuine output files were produced:

| Artifact | Exact size |
|---|---:|
| Native JSON | 13,045,547,159 bytes |
| Native CSV | 5,984,776,809 bytes |
| k6 stderr | 4,161,202,188 bytes |
| k6 stdout | 36,534 bytes |
| Dashboard HTML | 177,248 bytes |
| Native summary JSON | 1,224 bytes |

The three very large files totaled approximately 21.6 GiB. Their SHA-256 values
are preserved in `evidence/SHA256SUMS`; none was ever staged because committing
multi-gigabyte failure-loop files was not viable. After human review and commit
`c75b514` preserved exact metadata and bounded evidence, the three were deleted
as recorded in Section 13. They were never renamed as official evidence or
replaced by fabricated small files.

The output also exposed a tagging defect: native scenario metrics use
`traffic=pilot`, while custom WF-03 metrics use `traffic=measured` because
`metrics.js` hard-codes that value. `scenario=pilot` still distinguishes the
samples, but the inconsistent traffic tag is not acceptable for a corrected
run.

## 9. Secret-leak verification

- Private credentials remain mode 0600 outside Git and were never printed or
  copied into Pilot artifacts.
- There was no HTTP request, so no Authorization header or JWT was sent.
- Full scans of the small summary/dashboard/stdout/redacted evidence found no
  email, password label, Authorization/Bearer value, JWT-shaped token, or
  synthetic address.
- 200 MiB boundary samples (first and last 100 MiB) of each giant JSON, CSV, and
  stderr artifact found none of those patterns.
- A proposed full scan of all giant files was stopped after several match-free
  minutes because of their 21.6 GiB size. Therefore no claim of a complete
  byte-for-byte secret scan is made. Source structure, zero network data, static
  metric tags, the sample scans, and private-file isolation provide strong but
  explicitly bounded evidence.

## 10. Integrity result

- Backend PID 20315 stopped; port 3000 is free.
- Disposable DB after Pilot: integrity `ok`, four users, two Pilot users, zero
  orders.
- Original DB post-run SHA-256 remains
  `c63f00544180ba1fbb1427a9b9dd3f1784842698809972f33ce90482e7420ba6`,
  with original device/inode `16777234:6621788`.
- Original runtime/database files show no tracked mutation; only the intended
  new Pilot evidence/documentation is untracked/modified before commit.
- No push occurred.

## 11. Original AI proposal → failure → human-approved correction

The original AI proposal was held for human review because it affected metric
labels, failure handling, and evidence collection:

1. Replace the seven invalid group names `wf03::NN_step` with stable names that
   do not contain `::`, for example `wf03_NN_step`. Business sequence, checks,
   requests, and think times remain unchanged.
2. Change `metrics.js` `baseTags()` from `traffic: 'measured'` to
   `traffic: context.traffic` so Pilot custom metrics remain Pilot-only.
3. Treat an unexpected JavaScript/runtime exception as a confirmed invalid test
   condition: record the first runtime/safety failure, preserve a sanitized
   cause classification, and abort the test rather than spin immediately for
   the remaining duration. This is an operational safety stop, not a numeric
   error-rate threshold.
4. Add a reviewed runner that always writes the actual shell exit code and
   enforces the wall-clock cap across result flushing, not only scenario stages.
5. Before rerun, decide whether the Pilot needs simultaneous JSON+CSV+dashboard
   or a smaller reviewed output set; official scenario output requirements are
   unchanged.
6. Decide how to archive/compress or clean the preserved 21.6 GiB failure
   artifacts after human review. Do not delete them silently.

The human reviewed the failed Pilot and confirmed it as a test-harness/k6
compatibility defect, not SUT performance and not a confirmed SUT bug. H-038
approved only these minimum corrections:

- safe `wf03_NN_step` group names, with all existing checks/requests/order and
  assertion strength unchanged;
- `context.traffic` for custom metric tags;
- one sanitized diagnostic plus `exec.test.abort()` for unexpected harness or
  runtime exceptions, while expected workflow failures retain one failed
  outcome and end only the current iteration;
- an exact-PID macOS runner that captures numeric exit/timestamps and enforces
  the five-minute cap;
- corrected-Pilot output limited to native JSON, summary, stdout/stderr, setup,
  backend, and runtime metadata—no Pilot CSV/dashboard;
- deletion of the three exact untracked 21.6-GiB files only after committed
  path/size/time/hash/producer/root-error/summary evidence preservation.

The executable change is intentionally limited to harness compatibility,
tagging, safety abort, and Pilot evidence collection. It does not change WF-03
business semantics, endpoint mapping, correlation, assertion strength, think
times, workflow order, or workload stages.

## 12. Recommendation

Do not finalize official test-plan filenames and do not run Load, Stress, Spike,
or endurance. Execute only the newly authorized fresh corrected 2-VU Pilot after
the minimum fix commit and static validation. Its results require a new human
checkpoint before official-plan finalization.

## 13. Human-approved cleanup result

After the complete preservation record was committed as `c75b514`, the three
exact untracked pathological files were removed at 2026-09-01 22:13:05 +07.
All three absence checks passed. Filesystem free space increased by 22,674,988
KiB (about 21.62 GiB). The exact historical hashes/sizes/timestamps/producers,
root diagnostic, bounded excerpts, summary, and zero-HTTP evidence remain
committed. The bulk raw files are no longer retained.

## 14. Fresh corrected attempt `20260901T221331+0700`

The attempt used a fresh clone pinned to fix commit `c75b514`, a distinct clone
database inode, a new mode-0700 private directory, new evidence paths, pinned k6
v2.2.0, and one owned backend PID 22146. Clone reset/seed, five products, zero
orders, public rows 01/02, disk, original hash, PID/cwd/port, and readiness gates
passed.

The provisioning helper was invoked from the disposable clone and returned
exit code 1 with the sanitized code `runtime_is_original_repository`. Because
the helper defines its protected `originalRoot` relative to its own script,
running the clone copy made the clone equal that protected root. The guard fired
before private output creation or any registration request. Counts remained two
seed users, zero Pilot users, and zero orders.

This failure was not silently retried from another path. Per the fail-preflight
rule, the exact backend PID was stopped and the corrected k6 Pilot did not run.
Consequently there is no corrected k6 command, PID, exit code, metric, JSON, VU
mapping, or correlation/check observation. This is a setup-helper invocation
defect, not a SUT performance result or confirmed SUT bug.

The smallest proposed next action is to use the reviewed helper from the actual
original worktree at the same approved commit while passing the new clone as
`WF03_DISPOSABLE_ROOT`, matching the guard's source-relative design and the
previously successful provisioning pattern. Because the current attempt hit a
preflight stop, that invocation and a new fresh runtime require human review
before another Pilot attempt.

The genuine cleanup/preflight/failure/postflight evidence and associated audit
updates were committed locally as `aebd717` (`test: record corrected Pilot
preflight failure`). No credential, disposable database, dependency tree, or
fabricated k6 artifact entered that commit, and it was not pushed.

## 15. Human-approved invocation correction

HD-012 confirms the blocked attempt as a provisioning-helper invocation/setup
defect—not SUT performance or a confirmed SUT bug—and preserves its evidence.
The unchanged helper must now execute from the actual original worktree while a
new commit-pinned `/private/tmp` clone is supplied as `WF03_DISPOSABLE_ROOT`.
Before registration, the protected/original and disposable paths, DB inodes,
marker, commit, original hash, backend PID/port, and exact localhost target must
all pass. No helper semantic change is approved. Exactly one new fresh corrected
Pilot may execute if and only if both dedicated accounts pass setup validation.

## 16. Fresh corrected Pilot `20260901T223944+0700`

**RUNTIME VALIDATION PASS — MEASURED PILOT VALUES, NOT OFFICIAL PERFORMANCE
RESULTS.** A new clone at `34bb80e` passed the HD-012 original/helper/runtime
boundary. The unchanged original-worktree helper exited 0 and provisioned
exactly customers 01/02; private mode-0600 credentials, authentication,
role/unlocked state, and zero starting orders passed. Backend PID 23201 remained
the same from reset through setup/Pilot.

The corrected JSON-only runner started k6 PID 23298 at 22:41:52 +07 and captured
numeric exit 0 at 22:45:58 +07. Full wall clock was 246 seconds; the 300-second
exact-PID watchdog did not fire. There was no stderr output.

Actual Pilot values: 81 attempts, 81 successes (100%), zero terminal-failure
samples, 567 HTTP requests, zero failed requests, 3,078/3,078 checks, 81 orders
created and 81 canceled, and zero unexpected-auth samples. Lifecycle duration
was avg 758.33 ms, median 761 ms, p95 963 ms. Overall HTTP duration was avg
1.783 ms, median 1.289 ms, p95 4.253 ms. These values validate runtime behavior
only and do not define any performance threshold or capacity.

All login/JWT/identity, exact search match, product ID/detail/price, checkout/new
order ID, same-order pending, same-order cancellation, and same-order final
canceled checks passed. Deterministic VU bindings used customer 01 and customer
02; final DB evidence showed both actively participated with 36 and 45 canceled
orders respectively. Exactly one successful workflow outcome was emitted per
attempt, and all custom samples were tagged `scenario=pilot,traffic=pilot`.

Postflight stopped exact backend PID 23201, freed port 3000, retained valid
disposable/original SQLite integrity, and reconfirmed the original DB hash.
Artifact scanning found no credential, password, JWT, Authorization header, or
private email. Raw JSON/summary/stdout/stderr and all setup/runtime evidence are
preserved under the new timestamped directory. H-040 human review is required
before official test-plan finalization.
