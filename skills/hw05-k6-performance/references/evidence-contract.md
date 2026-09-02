# Evidence and Execution Contract

Read this reference before runtime execution or result interpretation.

## Before measured traffic

- Resolve the protected original root and fresh disposable root to different
  absolute paths and database inodes.
- Pin the source commit and tool version; require localhost target, free disk,
  clean/new output paths, and an owned backend PID that actually owns the port.
- Start the backend once when startup resets its database. Provision and validate
  accounts against that same process. Record comparable starting state.
- Keep credentials mode-restricted outside Git; redact passwords/tokens from all
  evidence. Fail preflight instead of repairing silently.

## During and after execution

- Use stable low-cardinality request/check/group tags and iteration-local
  response correlation.
- Record exact command, start/end, numeric exit, watchdog status, stdout/stderr,
  backend log, native raw output, summary, and runtime metadata.
- A successful process exit is not sufficient: validate business workflow
  success, correlation invariants, custom metrics, and raw output integrity.
- Stop only the exact owned backend PID. Verify the port and protected database
  after the run. Preserve real failures and distinguish harness, setup, SUT, and
  environment causes.

## Interpretation labels

Use **MEASURED FACT**, **INTERPRETATION**, and **UNCERTAINTY** explicitly. A
single run cannot establish repeatability, capacity, long-term stability, or a
universal threshold. A point-in-time screenshot is not continuous telemetry.
