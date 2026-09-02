# AI Critique Evidence

Status: **FACTUAL SOURCE PACKET FOR HUMAN-REVIEWED 200–300 WORD CRITIQUE**

| Event | What AI proposed/did | Actual evidence | Human correction / lesson |
|---|---|---|---|
| Phase B think time | Proposed zero seconds between pending verification and cancellation | The value modeled an instantaneous lifecycle transition rather than user behavior | Human changed it to random 0.5–1.0 seconds while keeping backlog bounded |
| Account strategy | Initially constrained execution to one seeded customer | Stress/Spike inputs could reach 20 concurrent VUs, coupling auth and state | Human required reproducible disposable provisioning of 20 dedicated accounts |
| Authentication abort | Proposed aborting the whole test on the first unexpected 401/403 | An isolated auth failure under Stress/Spike may be meaningful degradation evidence | Human separated iteration failure from dangerous/systemic test-level abort |
| Numeric aborts | Proposed four fixed pre-execution systemic-error cutoffs | No Pilot/runtime evidence supported the selected counts/windows | Human deferred all four pending evidence and retained only bounded operational safety |
| k6 names | Draft group/check names contained `::` | k6 v2.2.0 rejected them before HTTP | Pilot evidence forced k6-safe stable names |
| Exception policy | Generic catch returned to the scheduler after an unexpected exception | About 9.7 million tight-loop iterations produced roughly 21.6 GiB with zero HTTP bytes | Human required sanitized diagnostics plus test-level abort for harness exceptions and bounded Pilot outputs |
| Metric classification | Shared helpers hard-coded `traffic=measured` | Pilot metrics would be mislabeled as official traffic | Human required `context.traffic`, producing `traffic=pilot` or `traffic=measured` correctly |
| Provisioning boundary | Helper was invoked from inside a disposable clone | Its location-derived protected-root guard treated the clone as the original and stopped | Human retained the guard and corrected invocation from the real original worktree with explicit disposable root |
| Listener orchestration | AI combined a listener check and provisioning without fail-closed control | An unrelated PID 52187 owned port 3000 and received setup accounts; no k6 traffic ran | Human stopped the PID; AI added exact PID/cwd/port ownership guards and fresh-runtime recovery |
| Performance interpretation | Called checkout/cancellation first optimization candidates and proposed numeric guardrails | No failure/degradation knee; differences were only milliseconds; no repeat-run noise study | Human marked the bottleneck wording misleading and the numeric thresholds insufficiently evidenced |
| Generic optimization | Suggested normal search index and database connection pool possibilities | Search is `LIKE '%term%'` on five rows; SUT uses local SQLite object | Human classified both as hallucinated/not applicable |

## Collaboration principle supported by the evidence

AI was effective at exhaustive source discovery, repeatable scaffolding, raw
parsing, and artifact production, but its plausible defaults were not reliable
substitutes for runtime compatibility checks or human domain judgment. The safe
pattern was incremental evidence, explicit boundaries, small Pilot execution,
immutable failure history, and human review before semantic changes.
