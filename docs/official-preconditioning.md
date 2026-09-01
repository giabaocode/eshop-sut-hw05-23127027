# Official Scenario Preconditioning

Status: **PREPARED — NOT EXECUTED**

This procedure applies independently to Load, Stress, and Spike. Provisioning
and validation are setup traffic and must finish before measured k6 starts.

## Required sequence for each scenario

1. Preserve the preceding scenario's evidence and checksums.
2. Record the approved original source commit and original DB SHA-256/inode.
3. Confirm port 3000 is free and at least 2 GiB disk space is available.
4. Create a new no-hardlink clone under `/private/tmp`, pinned to the approved
   commit, with the exact disposable marker.
5. Verify original and disposable roots differ and their databases have
   different inodes.
6. Create a new scenario-specific setup-evidence root outside the disposable
   runtime, then start the disposable backend once with stdout/stderr captured
   at `<SETUP_EVIDENCE_ROOT>/backend.log`. Its normal startup reset/reseed occurs
   once; keep that exact PID alive through setup and measured execution.
7. Prove PID, cwd, command, and localhost port 3000 ownership; verify SQLite
   integrity, two seed users, five reviewed products, and zero initial orders.
8. From the protected original worktree, invoke the unchanged helper with the
   fresh clone supplied as `WF03_DISPOSABLE_ROOT` and `WF03_ACCOUNT_COUNT=20`.
9. Validate exactly customers 01..20: deterministic key/email mapping,
   private mode-0600 credentials, role=user, unlocked state, successful login,
   zero starting orders, and complete public/private joins.
10. Validate all 20 public workflow rows, exact expected products, positive
    detail prices, comparable order state, database integrity, output health,
    pinned k6 version, official plan filename, scenario options, and a still
    nonexistent/new official `<OUTPUT_ROOT>` for the runner.
11. Record the setup-finished/measured-traffic-start boundary. Do not restart
    the backend.
12. Start the one approved official measured scenario. Load activates only
    accounts 01..05; Stress and Spike may activate 01..20. Never wrap/share.
13. Preserve raw data, distinct primary view, stdout/stderr, backend log,
    resource evidence, timestamps, commands, PIDs, exit/watchdog data, option
    snapshot, hashes, and real report output before reset.
14. Stop only the exact owned backend PID; prove port 3000 is free.
15. Recheck both databases, original DB SHA-256/inode, original Git status, and
    absence of credentials/secrets/runtime dependencies in the original tree.

Any failed gate stops before official traffic. Do not silently repair a pool,
reuse an older runtime/result, lower the workload, or restart the backend after
provisioning.

## Setup invocation contract

The helper invocation shape, run from the original worktree, is:

```sh
WF03_BASE_URL=http://127.0.0.1:3000 \
WF03_ACCOUNT_COUNT=20 \
WF03_DISPOSABLE_ROOT="<FRESH_DISPOSABLE_RUNTIME_ROOT>" \
WF03_PRIVATE_DIR="<MODE_0700_PRIVATE_DIRECTORY>" \
node /Users/phamngocgiabao/eshop-sut-hw05-23127027/performance/tools/provision-accounts.mjs
```

The two placeholder paths must resolve outside the protected original
repository. The command is prepared only; it has not provisioned an official
20-account pool.
