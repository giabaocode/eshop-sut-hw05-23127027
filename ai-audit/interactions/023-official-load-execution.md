# Interaction 023 — Official Load Execution

| Field | Actual record |
|---|---|
| AI tool | Codex CLI |
| Human prompt at gate | `READY` |
| Resume prompt after interruption | `continue` |
| Run | Official Load `20260902T092131+0700` |
| Official entry | `performance/scenarios/official/23127027_Load_20260901.js` |
| Result | k6 exit 0; 345/345 workflows; genuine artifacts preserved |

## Actual execution

After the human replied `READY`, Codex immediately invoked the reviewed official
runner against the same one-start disposable backend PID `42059`. The exact
command, child k6 PID `43262`, start/exit/flush timestamps, and 480-second
watchdog state were machine-recorded. The seven-minute workload completed in
422 seconds with exit 0 and no watchdog/interruption.

The human saved a genuine JPEG during five-VU traffic. Codex visually verified
that it shows Activity Monitor PID `42059` and the adjacent live Load/Codex
context. A real `sips` conversion created the prescribed PNG; the original JPEG
remains preserved.

## Measured facts

- 345 attempts, 345 successes, zero terminal failures;
- 2,415 HTTP requests, zero failed;
- 13,110/13,110 checks;
- 345 orders created and the same 345 canceled;
- 5.731666 requests/s native-summary rate;
- overall raw HTTP p95 4.1019 ms and p99 4.69974 ms;
- no unexpected authentication response;
- end-state SQLite: 345 canceled orders, five active users, integrity `ok`.

These are real official Load measurements, not final thresholds or capacity.

## Interruption and process truth

The user interrupted one wait call after k6 had already exited and flushed.
On resume, metadata proved the completed exit. A non-escalated `kill -0` probe
could not signal the outside-sandbox backend and was initially read as exited;
`lsof` corrected that diagnosis. Codex then sent `TERM` only to exact PID
`42059`, observed process-session exit 143, verified port 3000 free, and verified
the protected original DB hash/integrity unchanged. No result was rerun or
hidden.

## Automated analysis/output

Codex added a dependency-free native-JSON parser and generated Load analysis
JSON, Markdown, and a distinct aggregate HTML report from the real raw data.
Redacted setup history, backend log, postflight, visual metadata, and checksums
are preserved without credentials, passwords, or JWTs.
