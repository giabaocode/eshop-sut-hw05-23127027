# Safe EShop SUT Startup on macOS

## Status and safety boundary

- Phase: PHASE 2 — Safe SUT Startup Strategy and Runtime Preparation
- Prepared: 2026-09-01 (Asia/Ho_Chi_Minh)
- Strategy status: **STRATEGY B APPROVED AND VERIFIED ONCE**
- Installation status: **EXECUTED ONLY IN DISPOSABLE CLONE**
- Backend startup status: **VERIFIED, THEN STOPPED**
- Database reset/reseed status: **VERIFIED ONLY IN DISPOSABLE CLONE**
- SUT source modification: **NONE**

This runbook preserves the Phase 2 source-backed proposal and command plan.
The student approved Strategy B, and Phase 2B executed it once with the
adaptations and exact results recorded in
[`docs/runtime-startup-verification.md`](../docs/runtime-startup-verification.md).
The original homework checkout was not used as the runtime directory.

## 1. SOURCE-VERIFIED startup behavior

### Why `node server.js` resets the database

The reset is an unconditional CommonJS import side effect:

1. `server.js` executes `const db = require("./database")`
   ([`backend/server.js:4`](../backend/server.js#L4)).
2. Loading `database.js` resolves the database path as
   `path.resolve(__dirname, "database.sqlite")`
   ([`backend/database.js:4`](../backend/database.js#L4)).
3. The module opens that file with `new sqlite3.Database(dbPath, ...)`
   ([`backend/database.js:5`](../backend/database.js#L5)).
4. At module top level, it calls `initDatabase()` unconditionally
   ([`backend/database.js:117`](../backend/database.js#L117)).
5. `initDatabase()` schedules six `DROP TABLE IF EXISTS` statements, recreates
   all tables, and inserts categories, users, products, and coupons
   ([`backend/database.js:13-114`](../backend/database.js#L13)).
6. `server.js` then registers routes and listens on hard-coded port 3000
   ([`backend/server.js:570-572`](../backend/server.js#L570)).

This happens in a fresh Node process on **every startup** because the module is
loaded once per process and the top-level call has no condition. Requiring the
module twice inside one process would use the CommonJS cache, but each new
`node server.js` process starts with an empty module cache and executes it again.

### Exact affected file

When started in the homework checkout, `__dirname` is the repository's
`backend` directory, so the affected database is:

```text
/Users/phamngocgiabao/eshop-sut-hw05-23127027/backend/database.sqlite
```

SQLite may also create a transient journal beside it during writes. The current
database is tracked, matches the Git `HEAD` blob, and had this Phase 2 baseline:

```text
SHA-256: c63f00544180ba1fbb1427a9b9dd3f1784842698809972f33ce90482e7420ba6
Size:    36864 bytes
Mtime:   2026-09-01 09:51:44 +0700
Commit:  85af3ba875c88283615e22cb108f13e2fccaf0e9
```

No tracked backend change was present during Phase 2 inspection.

### Why the provided shell script is not used

`run_servers.sh` executes `killall node`, uses another person's absolute path,
and starts all applications without preserving individual PIDs. It is neither
safe nor portable for this homework checkout and will not be used.

## 2. Startup strategy comparison

| Strategy | SUT source changed? | Runtime behavior changed? | Existing database/evidence risk | Homework-validity risk | Reproducibility | Recommendation |
|----------|---------------------|---------------------------|---------------------------------|------------------------|-----------------|----------------|
| A. Original checkout after verified backup | No | No; runs exact source at original path and resets on every start | **High**: working database is dropped/reseeded and later tests mutate it; backup reduces but does not eliminate restoration/mix-up risk | Low behavior risk, but evidence provenance can become confusing | Medium: seed is repeatable, restoration is an extra mutable step | Valid only with explicit approval; not preferred |
| B. Disposable local Git clone pinned to current commit | No | No application behavior change; same code resets the clone-local database on every start | **Low**: original database remains untouched; only temp clone is reset/mutated | Low if commit, hashes, temp path, and command are recorded; absolute filesystem path differs | **High**: exact commit checkout plus locked dependencies | **Recommended** |
| C. Disposable `ditto` copy of the current `backend` directory | No | No application logic change; `__dirname` points to copied backend, so copied DB is reset | Low for original; copy provenance depends on pre-copy hashes | Low-to-medium: faithfully captures working tree but lacks a separate Git checkout | Medium-high with recorded hashes | Technically valid fallback if local Git clone is unsuitable |

### Recommended strategy: disposable local Git clone

Strategy B is preferred because it satisfies all of these at once:

- preserves the original reset-on-start behavior;
- does not patch `server.js` or `database.js`;
- protects the homework checkout's current database;
- pins the SUT to an identifiable Git commit;
- installs npm dependencies and npm cache only under a disposable temp root;
- separates generated server logs and runtime database mutations from submitted
  source/evidence;
- permits hashing the clone before and after execution.

The runtime location under `/private/tmp` differs from the checkout path. Both
are on the macOS data volume in this environment, but any performance analysis
must record the actual temp path and avoid claiming path placement has no effect.

### Strategy A details

Running in the original checkout would affect:

- `backend/database.sqlite`;
- possible `backend/database.sqlite-journal` while writing;
- `backend/node_modules/` after local installation;
- any explicitly redirected log file.

A byte-for-byte backup and hash comparison can make the old database
recoverable, but starting still destroys the working copy. Restoring the backup
later is another database mutation and must not be done silently. This strategy
preserves behavior but has unnecessary evidence risk.

### Strategy C details

Copying `backend/` with macOS `ditto` works because database resolution is based
on `__dirname`. The copy must include `package.json`, `package-lock.json`,
`server.js`, `database.js`, and `database.sqlite`; hashes must be recorded before
installation/start. It preserves current working-tree contents, whereas a Git
clone deliberately represents committed `HEAD`. Strategy C is a fallback, not
the primary choice.

### Rejected without explicit source-change approval

Changing `database.js` to call `initDatabase()` only when executed directly, or
adding an environment flag to skip initialization, would protect the working
database but change the SUT's current startup behavior. That may affect initial
state, reproducibility, and homework validity. No such patch is proposed for
execution and no SUT source file has been modified.

## 3. Project-local dependencies

Only backend dependencies are required to run direct API performance tests.
The React web/admin/mobile projects do not need to be installed merely to start
the backend or drive it with k6.

| Package | Declared | Lockfile version | Purpose |
|---------|----------|------------------|---------|
| `body-parser` | `^2.2.2` | `2.2.2` | JSON request parsing |
| `cors` | `^2.8.6` | `2.8.6` | CORS middleware |
| `express` | `^5.2.1` | `5.2.1` | HTTP server and routing |
| `jsonwebtoken` | `^9.0.3` | `9.0.3` | JWT signing/verification |
| `sqlite3` | `^6.0.1` | `6.0.1` | SQLite native Node binding |

`npm ci` is preferred over `npm install` because `backend/package-lock.json`
exists and pins the dependency graph. It creates `node_modules` and needs
registry access. Phase 2B redirected npm cache/log activity into the disposable
temp root and required no `sudo` or system-wide package installation.

`sqlite3@6.0.1` declares Node `>=20.17.0` and uses `prebuild-install`; if a
compatible prebuilt binary is unavailable it may require local compilation.
Phase 2B installed the locked dependency successfully and verified that
`require("sqlite3")` loads; no separate system dependency was installed.

## 4. Current macOS/runtime preparation status

| Tool/prerequisite | Inspection result |
|-------------------|-------------------|
| Node.js | `/opt/homebrew/bin/node`, `v20.20.2`; satisfies SUT and sqlite3 engine requirements |
| npm | `/opt/homebrew/bin/npm`, `10.8.2` |
| Original backend `node_modules` | Absent; dependencies exist only in the Phase 2B temp clone |
| k6 | Not installed (`command -v k6` returned no path) |
| Git | `/usr/bin/git`, Apple Git 2.50.1 |
| macOS utilities | `mktemp`, `ditto`, `curl`, `lsof`, and `shasum` available |
| Native build fallback | Xcode developer path, Apple clang, GNU Make, and Python 3 are available; actual sqlite3 compilation unverified |
| Port 3000 | Verified listening during Phase 2B, then verified free after shutdown; recheck before every future startup |
| Disk | Approximately 632 GiB available at inspection time |

k6 is a separate later prerequisite. It is not required to verify backend
startup, but it is required before functional k6 preflight/performance work.

## 5. Approved command plan for Strategy B

The student approved this plan for the single Phase 2B verification. These
blocks preserve the planned reproducible procedure; they are not authorization
for an additional run. The actual execution required environment-specific
permission for registry and localhost access, and its exact command/result
record is in the runtime verification document.

### 5.1 Establish source identity and verify port availability

```bash
HW05_SOURCE_REPO="/Users/phamngocgiabao/eshop-sut-hw05-23127027"
HW05_SOURCE_COMMIT="$(git -C "$HW05_SOURCE_REPO" rev-parse HEAD)"

git -C "$HW05_SOURCE_REPO" status --short --branch
if [ -n "$(git -C "$HW05_SOURCE_REPO" status --porcelain -- backend)" ]; then
  echo "Backend working tree is not clean; stop and review it."
  exit 1
fi
if ! git -C "$HW05_SOURCE_REPO" diff --quiet -- backend; then
  echo "Tracked backend changes exist; stop and review them."
  exit 1
fi
if ! git -C "$HW05_SOURCE_REPO" diff --cached --quiet -- backend; then
  echo "Staged backend changes exist; stop and review them."
  exit 1
fi
shasum -a 256 \
  "$HW05_SOURCE_REPO/backend/server.js" \
  "$HW05_SOURCE_REPO/backend/database.js" \
  "$HW05_SOURCE_REPO/backend/database.sqlite" \
  "$HW05_SOURCE_REPO/backend/package-lock.json"

if lsof -nP -iTCP:3000 -sTCP:LISTEN; then
  echo "Port 3000 is already occupied; stop and investigate the owning process."
  exit 1
fi
```

The commands stop if tracked, staged, or untracked backend differences exist or
if port 3000 is occupied. They do not kill an unknown process.

### 5.2 Create a disposable clone and verified original-database backup

```bash
HW05_SUT_RUN_DIR="$(mktemp -d /private/tmp/eshop-hw05-sut.XXXXXX)"

cp -p \
  "$HW05_SOURCE_REPO/backend/database.sqlite" \
  "$HW05_SUT_RUN_DIR/original-database.sqlite.prestart"

git clone --no-hardlinks --local \
  "$HW05_SOURCE_REPO" \
  "$HW05_SUT_RUN_DIR/repo"

if [ "$(git -C "$HW05_SUT_RUN_DIR/repo" rev-parse HEAD)" != "$HW05_SOURCE_COMMIT" ]; then
  echo "Clone commit does not match the approved source commit."
  exit 1
fi

if ! cmp -s \
  "$HW05_SOURCE_REPO/backend/database.sqlite" \
  "$HW05_SUT_RUN_DIR/original-database.sqlite.prestart"; then
  echo "Database backup verification failed."
  exit 1
fi

shasum -a 256 \
  "$HW05_SOURCE_REPO/backend/database.sqlite" \
  "$HW05_SUT_RUN_DIR/original-database.sqlite.prestart" \
  "$HW05_SUT_RUN_DIR/repo/backend/database.sqlite"
```

This backup is an extra verification safeguard; Strategy B does not need to
restore it because the original database is never used by the cloned server.

### 5.3 Install backend dependencies locally in the disposable clone

```bash
cd "$HW05_SUT_RUN_DIR/repo/backend"
npm ci --cache "$HW05_SUT_RUN_DIR/npm-cache"
npm ls --depth=0
git -C "$HW05_SUT_RUN_DIR/repo" diff --exit-code -- \
  backend/package.json backend/package-lock.json
```

Expected mutations are limited to the temp root: clone `node_modules/`, npm
cache/logs, and possibly package build artifacts. `npm ci` should not change the
locked manifest, which must be checked after installation.

### 5.4 Start the backend and retain its PID/log

```bash
cd "$HW05_SUT_RUN_DIR/repo/backend"
node server.js > "$HW05_SUT_RUN_DIR/backend.stdout-stderr.log" 2>&1 &
HW05_SUT_PID=$!

ps -p "$HW05_SUT_PID" -o pid=,ppid=,command=
```

At this point the cloned `backend/database.sqlite` will be dropped/reseeded by
the original source. The homework checkout database should remain unchanged.

### 5.5 Wait for readiness, verify port 3000, and make one read-only request

```bash
HW05_READY=0
for HW05_ATTEMPT in {1..20}; do
  if curl --fail --silent \
    "http://127.0.0.1:3000/api/products?search=iPhone%2015" > /dev/null; then
    HW05_READY=1
    break
  fi
  sleep 0.5
done

test "$HW05_READY" -eq 1
lsof -nP -a -p "$HW05_SUT_PID" -iTCP:3000 -sTCP:LISTEN

curl --fail --silent --show-error \
  --header "Accept: application/json" \
  "http://127.0.0.1:3000/api/products?search=iPhone%2015"

sed -n '1,80p' "$HW05_SUT_RUN_DIR/backend.stdout-stderr.log"
```

This is a minimal functional/readiness request, not a performance result. It
does not intentionally mutate application data.

### 5.6 Stop only the recorded backend process

```bash
ps -p "$HW05_SUT_PID" -o pid=,ppid=,command=
kill -TERM "$HW05_SUT_PID"
HW05_WAIT_STATUS=0
wait "$HW05_SUT_PID" || HW05_WAIT_STATUS=$?
echo "Backend wait status: $HW05_WAIT_STATUS"

if lsof -nP -iTCP:3000 -sTCP:LISTEN; then
  echo "Port 3000 is still occupied; investigate without using killall."
else
  echo "Port 3000 is no longer listening."
fi
```

The SUT has no custom shutdown handler. `SIGTERM` to the exact recorded PID is
the cleanest source-unmodified stop available; `killall node` and `kill -9` are
not part of this runbook.

### 5.7 Post-stop evidence checks

```bash
shasum -a 256 \
  "$HW05_SOURCE_REPO/backend/database.sqlite" \
  "$HW05_SUT_RUN_DIR/original-database.sqlite.prestart" \
  "$HW05_SUT_RUN_DIR/repo/backend/database.sqlite"

git -C "$HW05_SOURCE_REPO" status --short --branch
git -C "$HW05_SUT_RUN_DIR/repo" status --short --branch
```

The original and backup hashes should still match. The cloned database is
expected to differ after startup and later transactions. Preserve the temp root
until evidence has been reviewed; do not delete it automatically.

## 6. Files and state that would be affected

Under the recommended strategy:

| Path/state | Expected effect |
|------------|-----------------|
| Original `backend/database.sqlite` | Read/hash only; must remain byte-identical |
| `$HW05_SUT_RUN_DIR/original-database.sqlite.prestart` | New verified backup in temp space |
| `$HW05_SUT_RUN_DIR/repo/` | New local clone at the approved commit |
| Clone `backend/node_modules/` | Created by `npm ci` |
| `$HW05_SUT_RUN_DIR/npm-cache/` | Created by npm cache/log activity |
| Clone `backend/database.sqlite` | Dropped and reseeded on every server start; later mutated by tests |
| Clone `backend/database.sqlite-journal` | May appear transiently during SQLite writes |
| `$HW05_SUT_RUN_DIR/backend.stdout-stderr.log` | Real backend startup/runtime log |
| SUT source files | No modification required |

## 7. Runtime-verification disposition

Phase 2B resolved the original startup questions as follows:

- `npm ci` completed after an initial sandbox DNS failure and an approved
  network retry.
- `sqlite3` loaded successfully with the installed locked dependency.
- Starting the clone reseeded only its database; original hashes were stable.
- PID 9739 from the clone owned the port 3000 listener.
- Product search and listing returned JSON with HTTP 200.
- `SIGTERM` stopped that PID and released port 3000.
- The temp clone remained at the expected commit, with only its database and
  temp-local `node_modules` changed.

Still requiring later runtime verification in the context of performance-test
preflight are authentication/write workflows, account state, test data,
concurrent behavior, and k6 itself. The Phase 2B read-only requests do not
validate those areas.

## 8. Approval history and future boundary

On 2026-09-01, the student explicitly approved Strategy B and these Phase 2B
actions:

1. creation of the disposable temp clone/backup;
2. project-local `npm ci` with temp-local npm cache;
3. one backend startup, which will reset only the clone database;
4. one read-only product request;
5. clean shutdown of the recorded PID.

Those actions are complete and the backend is stopped. k6 was not installed or
run. Any future mutation testing or performance execution requires its own
applicable phase approval; this historical approval must not be reused as
blanket authorization.
