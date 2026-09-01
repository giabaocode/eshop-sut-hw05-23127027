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

## Per-scenario human captures

| Scenario | Capture timing | Required visible evidence | Destination placeholder |
|---|---|---|---|
| Load | During the 5-VU steady hold | Official Load identity; running k6/tool output; exact backend PID in Activity Monitor or native resource view; timestamp/context | Human chooses real screenshot path after execution |
| Stress | During a high planned stage, preferably the 20-VU hold if the run remains valid | Official Stress identity/stage; running k6 output; exact backend CPU/memory evidence; timestamp/context | Human chooses real screenshot path after execution |
| Spike | During the 20-VU spike hold; prepare framing before the 10-second rise | Official Spike identity/phase; running k6/dashboard or terminal; exact backend resource usage; timestamp/context | Human chooses real screenshot path after execution |

If a scenario stops early, capture the genuine stopped state and preserve why;
do not stage a replacement image. Record each screenshot's actual timestamp,
scenario/run ID, backend PID, source commit, and SHA-256 after capture.
