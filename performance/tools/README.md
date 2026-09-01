# Performance Setup and Runner Boundary

Status: **2-VU PILOT RUNTIME-VALIDATED; OFFICIAL EXECUTION NOT PERFORMED**

`run-pilot.sh` and the original-worktree invocation of
`provision-accounts.mjs` were runtime-validated by the successful bounded Pilot.
`run-official.sh` is now prepared for human/static review but has never executed
an official scenario. It validates the human-created attributable filename,
disposable/private boundaries, 20-row credential contract, disk minimum, and a
new output root; it preserves exit/raw/output metadata and enforces each
approved exact-PID wall cap. PID/cwd/port/commit/database/account-state checks
still occur in the official preconditioning runbook before this runner starts.

The proposed native output mapping is:

- Load: native granular JSON plus captured end/custom summary.
- Stress: native granular JSON plus native CSV time series.
- Spike: native granular JSON plus k6 web-dashboard HTML export.

The prepared official flags/environment values have passed shell/static review
but have **not** been executed. Native JSON remains canonical. No code may
rename or convert JSON/CSV to `.jtl` or claim a k6 artifact is native JMeter
output. H-002 is resolved by the human decision to use the PDF's explicit
k6-equivalent-output rule; the earlier wording concern remains in the audit.

The scenario entry points require:

- `WF03_BASE_URL`, restricted by the draft to the approved localhost port 3000;
- optional `WF03_CREDENTIALS_FILE`, defaulting to the ignored
  `performance/data/credentials.local.csv` path as resolved by the entry script;
- the reviewed public `performance/data/workflow.csv`;
- a complete private credential pool for the scenario's active VUs.

The runner must not embed credentials in command arguments or print environment
contents. It must not implement the four deferred error-count/window aborts
until controlled pilot evidence and a new human decision exist.

`provision-accounts.mjs` is a preconditioning helper, not measured k6 traffic.
Its two-account path used the real SUT registration/login/order-list behavior
successfully in the Pilot. It
requires a marker-protected clone under `/private/tmp`, rejects the original
database inode, writes credentials with mode `0600` outside both Git worktrees,
and emits redacted evidence. Its 20-account path and all official scenario
preconditioning remain unexecuted and require the official-run human gate.
