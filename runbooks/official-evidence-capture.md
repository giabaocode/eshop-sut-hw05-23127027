# Official Execution Evidence Capture

Status: **HUMAN CAPTURE REQUIRED — NO SCREENSHOTS CREATED**

The PDF requires each scenario's performance tool and backend resource monitor
together in real execution evidence. The student must capture the screenshots;
AI must not generate, stage, or mark them complete.

## macOS preparation

1. Open Activity Monitor and select the CPU tab. Use its search field to locate
   the disposable backend's exact `node` PID recorded by preflight.
2. Keep a Terminal window visible with the official k6 command/output and a
   second view showing the exact backend PID. `ps -p <BACKEND_PID> -o
   pid,ppid,%cpu,%mem,rss,vsz,etime,command` is a safe text supplement.
3. Arrange the k6 view and Activity Monitor/resource view in the same frame.
   Show the macOS menu-bar clock or a terminal timestamp, the scenario identity,
   and enough command/output context to attribute the run.
4. Do not display credential files, environment dumps, passwords, JWTs,
   Authorization headers, private emails, or dynamic order IDs.

For official Load, the watched process must be the exact one-start
`node server.js` whose cwd is
`<FRESH_DISPOSABLE_RUNTIME_ROOT>/backend` and whose PID owns
`127.0.0.1:3000` according to preflight `lsof` evidence. In Activity Monitor,
search the numeric PID and make these fields visible where available: Process
Name, PID, `% CPU`, CPU Time, Threads, and Memory. A Terminal supplement may
show `pid,ppid,%cpu,%mem,rss,etime,command`; it must name the same PID.

Arrange the official Load k6 terminal on one side and Activity Monitor on the
other before starting k6. Keep the scenario filename/Load identity, current
stage/progress, and an actual timestamp visible. Capture during the five-VU
steady hold—preferably after the ramp has completed and around 2–4 minutes into
the five-minute hold, while the backend remains healthy. If the run stops
earlier, capture the genuine failure state instead.

## Per-scenario human captures

| Scenario | Capture timing | Required visible evidence | Destination placeholder |
|---|---|---|---|
| Load | During the 5-VU steady hold, preferably 2–4 minutes after the ramp | Official filename/Load identity; running k6 progress; exact backend PID with CPU/memory context; real timestamp | `performance/results/load/<ACTUAL_RUN_ID>/evidence/screenshots/load-k6-backend-resource.png` |
| Stress | During a high planned stage, preferably the 20-VU hold if the run remains valid | Official Stress identity/stage; running k6 output; exact backend CPU/memory evidence; timestamp/context | Human chooses real screenshot path after execution |
| Spike | During the 20-VU spike hold; prepare framing before the 10-second rise | Official Spike identity/phase; running k6/dashboard or terminal; exact backend resource usage; timestamp/context | Human chooses real screenshot path after execution |

If a scenario stops early, capture the genuine stopped state and preserve why;
do not stage a replacement image. Record each screenshot's actual timestamp,
scenario/run ID, backend PID, source commit, and SHA-256 after capture.
