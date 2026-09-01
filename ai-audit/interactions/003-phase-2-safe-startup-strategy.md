# Interaction 003 — Phase 2 Safe SUT Startup Strategy

## Metadata

- AI tool: Codex CLI
- Date/time: 2026-09-01 10:38:06 +07 (Asia/Ho_Chi_Minh)
- Completed: 2026-09-01 10:41:46 +07 (Asia/Ho_Chi_Minh)
- Phase: PHASE 2 — Safe SUT Startup Strategy and Runtime Preparation
- Human-review status: `WAITING FOR HUMAN`

## Human prompt (verbatim)

> Phase 1 reviewed and approved.
>
> Proceed to PHASE 2 — Safe SUT Startup Strategy and Runtime Preparation.
>
> IMPORTANT:
> Do NOT immediately install dependencies or start the backend.
>
> For this phase, first determine and document the safest way to run the SUT
> on my macOS machine without accidentally destroying evidence or silently
> changing the SUT behavior.
>
> Please do the following:
>
> 1. Re-check the startup path from actual source code.
>
> 2. Confirm exactly why `node server.js` causes database reset/reseed.
>    Identify:
>    - which import triggers it,
>    - which functions execute automatically,
>    - which database file is affected,
>    - whether the behavior happens on every startup.
>
> 3. Do NOT modify the SUT yet.
>
> 4. Propose 2–3 startup strategies, for example where technically valid:
>    - run the SUT exactly as designed after making a verified backup,
>    - use an isolated disposable copy of the database/worktree,
>    - use another non-destructive method supported by the existing source.
>
>    Do not invent options unsupported by the repository.
>
> 5. For every strategy explain:
>    - whether it changes SUT source code,
>    - whether it changes runtime behavior,
>    - risk to homework validity,
>    - risk to existing database/evidence,
>    - reproducibility,
>    - recommended choice.
>
> 6. Prefer a strategy that preserves the original SUT behavior.
>    Do NOT patch the application merely to make performance testing easier
>    unless I explicitly approve that change.
>
> 7. Inspect what project-local dependencies are required.
>
> 8. Check whether k6 is installed, but do NOT install it yet.
>
> 9. Prepare exact macOS commands that WOULD be used later for:
>    - installing local npm dependencies,
>    - starting the backend,
>    - verifying port 3000,
>    - performing a minimal health/read request,
>    - stopping the backend cleanly.
>
>    Do not execute installation/startup commands yet.
>
> 10. Create/update:
>     runbooks/sut-startup-macos.md
>
> 11. Update the AI Audit with this actual interaction.
>
> 12. At the end, clearly separate:
>     SOURCE-VERIFIED
>     PROPOSED
>     REQUIRES RUNTIME VERIFICATION
>
> 13. Then STOP and print:
>
> ============================================================
> HUMAN CHECKPOINT REQUIRED — STARTUP STRATEGY
> ============================================================
>
> Show me:
> - the recommended startup strategy,
> - exact files/database that may be affected,
> - dependencies that need installation,
> - exact commands you propose to run,
> - whether any SUT source modification is required.
>
> Do NOT install anything.
> Do NOT start the backend.
> Do NOT reset/reseed the database.
> Do NOT generate workflow candidates yet.
> Do NOT run k6.
> Do NOT commit or push yet.

## Relevant AI output preserved

The detailed output is
[`runbooks/sut-startup-macos.md`](../../runbooks/sut-startup-macos.md). Key
actual output from this interaction:

### SOURCE-VERIFIED

- `server.js:4` imports `./database`.
- `database.js` opens `database.sqlite` relative to its own directory and calls
  `initDatabase()` at top level.
- `initDatabase()` drops all six application tables, recreates them, and seeds
  fixtures. A fresh `node server.js` process repeats this behavior every time.
- Starting in the homework checkout would affect the tracked
  `backend/database.sqlite`; its Phase 2 SHA-256 remained
  `c63f00544180ba1fbb1427a9b9dd3f1784842698809972f33ce90482e7420ba6`.
- Backend dependencies are locked to body-parser 2.2.2, cors 2.8.6, Express
  5.2.1, jsonwebtoken 9.0.3, and sqlite3 6.0.1.
- Node 20.20.2/npm 10.8.2 and native build tools are present. Backend
  `node_modules` and k6 are absent. Port 3000 was free at inspection time.

### PROPOSED

- Preferred strategy: create a local Git clone pinned to commit
  `85af3ba875c88283615e22cb108f13e2fccaf0e9` under a `mktemp` directory in
  `/private/tmp`.
- Copy and hash the original database into that temp root as an extra safeguard.
- Run `npm ci` with a temp-local npm cache, then start the unmodified cloned
  backend and retain its exact PID/log.
- Verify readiness with `lsof` and one read-only product search; stop only that
  PID using `SIGTERM`; recheck original and clone hashes/state.

### REQUIRES RUNTIME VERIFICATION

- npm/native sqlite3 installation success, actual reset confinement to the
  clone, readiness/status/JSON response, startup initialization race, clean
  shutdown, and unchanged original database.

No proposed command was executed and no source modification was made.
