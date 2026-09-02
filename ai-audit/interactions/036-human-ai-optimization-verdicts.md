# Interaction 036 — Human AI-Analysis and Optimization Verdicts

| Field | Actual record |
|---|---|
| AI tool | Codex CLI |
| Recorded at | 2026-09-02 15:25:02 +0700 |
| Human actor | 23127027 — Phạm Ngọc Gia Bảo |
| Human action | Supplied final verdicts and explanations directly |
| Original AI source | `analysis/ai-analysis-original.md`, unchanged at commit `5e4b00f` |
| Automation authority | Resume maximum safe automation after recording the decisions |

## Actual human decisions — AI performance analysis

1. **CORRECT** — “The raw data matches the AI claim: all four measured runs
   completed the reported workflow/request/order counts with no numeric
   discrepancy.”
2. **CORRECT WITH LIMITATION** — “The reported overall p95 values are correct,
   but they belong to different workload profiles. They must not be compared as
   if Load, Stress, Spike, and Endurance were identical experimental
   conditions.”
3. **MISLEADING** — “Checkout and cancellation are the relatively slowest
   WF-03 steps, but the observed millisecond differences and zero-failure
   behavior are not sufficient evidence to call them confirmed performance
   bottlenecks. They are only candidate areas for further investigation.”
4. **CORRECT WITH LIMITATION** — “No degradation was observed within the
   Stress schedule that was actually executed up to 20 VUs. This does not prove
   that 20 VUs is system capacity or a maximum stable load.”
5. **CORRECT WITH LIMITATION** — “The single measured Spike run recovered
   without visible failure/backlog, but one run is insufficient to prove
   repeatable recovery behavior under repeated spikes or other conditions.”
6. **CORRECT WITH LIMITATION** — “Five VUs for the measured 12-minute endurance
   run is a demonstrated local endurance point only for this machine, commit,
   data state, and duration. It is not a proven maximum endurance capacity or a
   guarantee for longer runs.”
7. **CORRECT** — “A single midpoint resource screenshot is only point-in-time
   evidence and cannot establish average CPU usage or memory stability across
   the whole run.”
8. **INSUFFICIENT EVIDENCE** — “The proposed numeric
   success/error/p95/lifecycle thresholds contain reasonable headroom but are
   still judgment-based values. There is no repeat-run/noise evidence yet to
   justify them as validated acceptance thresholds.”
9. **CORRECT WITH LIMITATION** — “No genuine SUT performance bug was confirmed
   within the workloads, data, and environment that were tested. This must not
   be generalized into a claim that the system has no bugs or performance
   problems outside the tested scope.”

## Actual human decisions — optimization recommendations

1. **INSUFFICIENT EVIDENCE** — “The code does perform a write after every
   successful login, but login latency was low and no login bottleneck was
   observed. The optimization may be valid, but the measured benefit is not
   established by the current tests.”
2. **FEASIBLE WITH SEMANTIC TESTS** — “Combining the SELECT and UPDATE may
   reduce one database round trip and a race window, but it must preserve the
   current ownership/state rules and 404/400 behavior exactly. It should only
   be accepted after semantic regression tests.”
3. **INSUFFICIENT EVIDENCE** — “The current tests did not observe SQLITE_BUSY,
   failure growth, or a clear contention knee through the measured loads.
   WAL/busy-timeout may be worth an experiment, but current evidence does not
   justify calling it a necessary fix.”
4. **INSUFFICIENT EVIDENCE** — “Login performs email lookup without an index,
   but the measured user table was small and login latency remained low. There
   is no demonstrated lookup degradation at the current tested scale.”
5. **NOT APPLICABLE TO WF-03** — “The measured WF-03 workflow probes orders by
   primary-key order ID rather than using the user order-list query this index
   targets. Therefore the proposed index does not address a measured WF-03
   symptom.”
6. **HALLUCINATED / NOT APPLICABLE** — “The current search uses a
   leading-wildcard pattern like LIKE '%term%', for which a normal B-tree prefix
   index is not a justified performance fix. The dataset is also tiny and no
   search degradation was observed.”
7. **HALLUCINATED / NOT APPLICABLE** — “The SUT uses a local SQLite database
   object rather than a client/server database connection model. Generic
   connection-pool advice does not directly apply to this architecture and is
   unsupported by the measured evidence.”

## Resulting AI action

Codex copied the human text into the final columns of both review matrices,
marked H-014/H-015/H-016 `DONE BY HUMAN`, and left the immutable original AI
analysis untouched. No optimization, post-optimization measurement, or issue
was invented. Technical automation continues under HD-016.
