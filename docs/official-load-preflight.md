# Official Load Preflight — Run `20260902T092131+0700`

Status: **PRESERVED PREFLIGHT PASS — OFFICIAL LOAD LATER COMPLETED**

This file preserves the state before measured traffic. The later genuine Load
outcome is recorded in `docs/official-load-results.md` and the timestamped
result tree; the preflight facts below are not current process state.

The maximum-safe-automation instruction authorized technical execution. Codex
created a no-hardlink disposable clone pinned to
`e28da7b813d69c1eadfd799d309fb396170a71e0`, installed the backend lockfile
dependencies, started the successful runtime backend once, and retained exact
PID `42059` for setup and the future Load run.

## Verified boundary and data state

- protected original: `/Users/phamngocgiabao/eshop-sut-hw05-23127027`;
- disposable runtime: `/private/tmp/eshop-hw05-load.24cMIo/runtime`;
- backend cwd: `/private/tmp/eshop-hw05-load.24cMIo/runtime/backend`;
- original/runtime DB inodes differ;
- original DB SHA-256 remains
  `c63f00544180ba1fbb1427a9b9dd3f1784842698809972f33ce90482e7420ba6`;
- runtime SQLite integrity `ok`, five exact seeded products, positive prices;
- provisioning helper created and validated exactly customers 01..20 through
  the real SUT API; all are `user`, unlocked, authenticate, and have zero
  starting orders;
- credential file has exactly 20 rows, approved schema, and mode 0600 outside
  both worktrees; no secret value is recorded here;
- public manifest has 20 rows; Load will activate only accounts 01..05;
- pinned k6 v2.2.0 and official wrapper hash passed;
- planned new result root is
  `performance/results/load/20260902T092131+0700/` and does not yet exist.

## Truthful setup history

The first fresh sandboxed backend attempt did not remain alive; no registration
or k6 traffic occurred, so it was preserved and not reused. In the successful
fresh runtime, an initial helper call from the restricted networking sandbox
failed with `sut_request_failed`; checks proved no partial account/order/private
credential state. The unchanged helper then succeeded outside that networking
restriction using a new private output root. These are execution-environment
setup observations, not SUT performance results.

## Immediate gate

No trustworthy combined macOS GUI screenshot can be guaranteed from the
headless command runner. Before starting measured Load traffic, the human must
arrange the real k6 terminal and Activity Monitor view for exact backend PID
`42059`. Once the human replies `READY`, Codex can immediately run the prepared
official command against this same process and actual result root.
