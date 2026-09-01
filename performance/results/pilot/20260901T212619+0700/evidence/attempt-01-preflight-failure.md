# PILOT / RUNTIME VALIDATION — NOT OFFICIAL LOAD RESULT

Attempt: 01 — preflight/runtime harness failure; no provisioning and no k6 traffic

- Disposable root: `/private/tmp/eshop-hw05-pilot.OF8MJc`
- Commit: `41c6fecf826148e73a4ce3c651791d90650e595c`
- First sandboxed `npm ci` result: failed because `registry.npmjs.org` DNS lookup returned `ENOTFOUND`; npm also emitted `Exit handler never called!`.
- Corrected dependency command: the same lockfile-pinned `npm ci` with network permission; succeeded with 135 packages.
- Backend start output:

```text
Database initialized and seeded (Phase 2).
Server is running on http://localhost:3000
Connected to database
```

- Failure: the sandbox-launched process did not remain alive and no port-3000 PID existed immediately afterward.
- Classification: runtime/environment process-lifecycle boundary, not k6, workflow, data, or confirmed SUT failure.
- Disposition: this runtime was not restarted. No account, credential, HTTP Pilot traffic, or result was created. Attempt 02 uses a new fresh clone and one approved externally permitted backend start.
