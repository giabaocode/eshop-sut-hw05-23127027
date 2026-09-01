# Draft output and runner boundary

Status: **DRAFT — PINNED k6 INIT-VERIFIED; NOT SUT/PILOT VERIFIED**

This directory intentionally contains no executable runner yet. A later
human-reviewed runner must perform target/PID/port/commit/database/account/disk
preflight, create unique evidence directories, invoke the selected scenario,
preserve exit codes/raw output, enforce the approved wall-clock cap, and stop
only exact owned processes.

The proposed native output mapping is:

- Load: native granular JSON plus captured end/custom summary.
- Stress: native granular JSON plus native CSV time series.
- Spike: native granular JSON plus k6 web-dashboard HTML export.

Illustrative k6 flags/environment variables belong to the later reviewed runner
and have **not** been executed here. Native JSON remains canonical. No code may
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

`provision-accounts.mjs` is a draft preconditioning helper, not measured k6
traffic. It uses only the real SUT registration/login/order-list behavior,
requires a marker-protected clone under `/private/tmp`, rejects the original
database inode, writes credentials with mode `0600` outside both Git worktrees,
and emits redacted evidence. It has not been executed and must not be executed
until the human approves H-037 and the runbook's PID/port/database gates pass.
