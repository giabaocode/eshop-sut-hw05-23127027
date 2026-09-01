# CORRECTED PILOT ATTEMPT — BLOCKED BEFORE PROVISIONING

Label: **PILOT / RUNTIME VALIDATION — NOT OFFICIAL LOAD RESULT**

Artifact ID: `20260901T221331+0700`

Source commit: `c75b514dd75b7378d55117acbd1f9d095d759275`

The fresh disposable runtime passed source/tool/database/PID/port/seed gates,
but the first provisioning-helper command failed its own boundary check with
`runtime_is_original_repository`. The helper was invoked from the clone, so its
script-relative `originalRoot` resolved to that same clone. It stopped before
creating private output or sending a registration request.

Per the approved fail-preflight rule, the invocation was not silently changed
or retried. No account was provisioned, no k6 process started, and no SUT Pilot
workflow request occurred. The exact owned backend PID was stopped, port 3000
became free, and both database integrity checks passed.
