# Evidence-Informed Endurance Plan

Status: **PREPARED — NOT YET EXECUTED**

## Input selection

The official Load completed 345/345 workflows at five VUs with zero failed
HTTP requests. The official Stress completed 1,281/1,281 workflows while
stepping as high as 20 VUs, also with zero failures and no observed rising-p95
pattern. Twenty VUs remains an input rather than proven capacity.

The endurance test therefore uses **five sustained VUs**. This is the known
Load level, one quarter of the bounded Stress peak, and a conservative choice
for studying time-dependent stability without guessing an extreme load.

| Parameter | Planned value |
|---|---|
| Executor | `ramping-vus` |
| Ramp | 0→5 VUs over 30 seconds |
| Sustained interval | 5 VUs for 12 minutes |
| Ramp-down | 5→0 VUs over 30 seconds |
| Scheduled total | 13 minutes |
| Exact-PID safety cap | 14 minutes |
| Active accounts | dedicated customers 01..05 |
| Setup pool | 20 validated disposable accounts, consistent with official preconditioning |
| Workflow | the same shared `executeWf03()` implementation |
| Outputs | genuine native JSON, native CSV time series, summary, logs, setup/postflight, visual evidence |

The planned input is not a final p95/RPS/error threshold. The empirical local
endurance observation and any cautious threshold interpretation will be made
only after the real run.
