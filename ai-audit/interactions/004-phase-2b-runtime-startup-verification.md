# Interaction 004 — Phase 2B Approved Safe Startup Verification

## AI tool

Codex CLI

## Date/time

- Started: 2026-09-01 10:54:03 +07 (Asia/Ho_Chi_Minh)
- Documentation completed: 2026-09-01 11:02:15 +07

## Human prompt/instruction — preserved verbatim

> Phase 2 startup strategy reviewed and approved.
>
> I approve Strategy B:
> Use a disposable local Git clone under /private/tmp, pinned to the current
> HW05 source commit, without modifying the SUT source.
>
> Proceed to PHASE 2B — Approved Safe Startup Verification.
>
> Additional constraints:
>
> 1. You MAY execute the previously proposed Strategy B commands.
>
> 2. npm dependencies may be installed ONLY inside the temporary clone.
>    Do not install any system-wide packages.
>    Do not use sudo.
>    Do not install Homebrew packages.
>
> 3. Do NOT install k6 yet.
>
> 4. Do NOT modify the SUT source code.
>
> 5. Do NOT execute database initialization in my original HW05 working
>    repository.
>
> 6. Before starting:
>    - record the original HW05 repository path,
>    - record the current source commit,
>    - record the original database SHA-256,
>    - verify port 3000 is free.
>
> 7. Create the disposable clone and run npm ci there.
>
> 8. Verify that:
>    - dependency installation succeeds,
>    - the temporary clone is pinned to the expected commit,
>    - starting the backend resets only the temporary clone database,
>    - the original HW05 database SHA-256 remains unchanged,
>    - the backend actually listens on port 3000.
>
> 9. Perform ONLY low-risk runtime verification in this phase.
>
>    Allowed:
>    - readiness checks
>    - GET product listing/search
>    - other clearly read-only requests needed to verify startup
>
>    Not allowed yet:
>    - failed-login lockout experiments
>    - checkout
>    - order creation
>    - cart mutation
>    - coupon usage mutation
>    - registration
>    - password reset
>    - admin CRUD
>    - Load testing
>    - Stress testing
>    - Spike testing
>    - endurance testing
>
> 10. Shut down the temporary backend cleanly after verification.
>
> 11. Verify again after shutdown:
>     - original HW05 database hash is unchanged,
>     - original HW05 source working tree was not modified by runtime execution.
>
> 12. Create:
>     docs/runtime-startup-verification.md
>
>     Record:
>     - timestamp
>     - source commit
>     - temporary runtime path
>     - commands actually executed
>     - npm installation result
>     - process PID
>     - port verification
>     - actual HTTP request
>     - actual status/result
>     - shutdown result
>     - original database hash before/after
>     - anything unexpected
>
> 13. Do not fabricate or normalize failed output.
>     If something fails, preserve the actual failure and diagnose it.
>
> 14. Update the AI Audit with this actual interaction and its relevant output.
>
> 15. Because the temporary directory may later disappear, preserve all important
>     verification facts in repository-local Markdown/audit files before ending
>     the phase.
>
> 16. Group context for later workflow selection:
>     My group contains 4 students.
>
>     Do NOT generate workflow candidates in Phase 2B yet.
>
>     When the later workflow-discovery phase is reached, propose at least
>     5–6 genuinely distinct source/runtime-supported workflow candidates so
>     four group members have enough choices without duplication.
>
> 17. At the end, clearly report:
>
>     SOURCE/RUNTIME VERIFIED
>     FAILED OR UNEXPECTED
>     ORIGINAL REPOSITORY INTEGRITY
>     FILES CREATED/MODIFIED
>     HUMAN ACTION REQUIRED
>     NEXT PHASE
>
> Then STOP.
>
> Do not proceed automatically to endpoint mutation testing or workflow
> generation.

## Relevant actual AI output and execution record

Codex recorded the original repository, commit, backend hashes, absence of an
original `node_modules`, and a free port 3000. It created
`/private/tmp/eshop-hw05-sut.jxn8Wd/repo` as a no-hardlinks local clone pinned to
commit `85af3ba875c88283615e22cb108f13e2fccaf0e9` and copied the original database
to `/private/tmp/eshop-hw05-sut.jxn8Wd/original-database.sqlite.prestart`.

The first sandboxed `npm ci` attempt was unsuccessful: the npm debug log showed
`ENOTFOUND registry.npmjs.org`, npm printed `Exit handler never called!`, and
`npm ls --depth=0` exited 1 with an invalid/incomplete tree. The same temp-local
command was retried with approved network permission and succeeded: 135
packages were added, 136 audited, and npm reported four vulnerabilities (one
low, one moderate, one high, one critical) plus a deprecated
`prebuild-install@7.1.3`. No audit fix was run. `npm ls --depth=0` then exited 0,
and loading `sqlite3` succeeded.

Sandboxed server attempts printed normal startup messages but were terminated
by the execution environment and left no listener. The unchanged `node
server.js` command was therefore run with approved localhost-listener access.
PID 9739, whose working directory was the temp clone's `backend`, listened on
TCP port 3000. Sandboxed curl could not cross the listener namespace and
returned HTTP 000/exit 7; the permitted localhost retry returned HTTP 200 for
both `/api/products?search=iPhone%2015` and `/api/products`. The search returned
the seeded iPhone product; the listing returned five seeded products.

The clone database changed from three orders to zero and acquired a new hash,
demonstrating its reset/reseed. The original and its temp backup retained
SHA-256
`c63f00544180ba1fbb1427a9b9dd3f1784842698809972f33ce90482e7420ba6`.
`kill -TERM 9739` stopped the verified process and released port 3000. The
managed server session returned exit 1 after SIGTERM; this was preserved rather
than normalized. Clone `PRAGMA integrity_check` returned `ok`.

No login, registration, password reset, cart/coupon/order/admin mutation, k6
action, performance run, SUT source modification, system-wide installation,
commit, or push occurred. Full commands and output evidence are preserved in
[`../../docs/runtime-startup-verification.md`](../../docs/runtime-startup-verification.md).

## Files created

- `docs/runtime-startup-verification.md`
- `ai-audit/interactions/004-phase-2b-runtime-startup-verification.md`

## Files modified

- `runbooks/sut-startup-macos.md`
- `ai-audit/audit.md`
- `MANUAL-TODO.md`

## Assumptions and human-review status

- Sandbox process/network behavior is recorded as an environment/tooling
  observation, not a confirmed SUT defect.
- The successful read-only requests verify startup and product retrieval only;
  they do not verify authentication or mutation behavior.
- The disposable temp root is retained for review and may later disappear as
  normal temporary storage; repository-local evidence does not depend on its
  continued existence.
- Human-review status: `WAITING FOR HUMAN` for Phase 2B findings.
- Corrections requested by human: none at the time of this record.
