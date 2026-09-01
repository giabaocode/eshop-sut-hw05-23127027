# Runtime Startup Verification — Strategy B

## Execution boundary

- Phase: PHASE 2B — Approved Safe Startup Verification
- Student approval: Strategy B explicitly approved in chat
- Preflight timestamp: 2026-09-01 10:54:03 +07
- Shutdown/integrity verification: 2026-09-01 10:59:20 +07
- Original repository: `/Users/phamngocgiabao/eshop-sut-hw05-23127027`
- Source commit: `85af3ba875c88283615e22cb108f13e2fccaf0e9`
- Temporary runtime root: `/private/tmp/eshop-hw05-sut.jxn8Wd`
- Temporary clone: `/private/tmp/eshop-hw05-sut.jxn8Wd/repo`
- Backend PID that served verified requests: `9739`
- Target: `http://127.0.0.1:3000`
- Final process state: stopped; port 3000 not listening

Only dependency installation, startup/readiness checks, two read-only product
GETs, and shutdown were performed. No login failure, registration, password
reset, cart/coupon/order mutation, admin CRUD, k6, or performance execution was
performed.

## 1. Original repository baseline

### Pre-start facts

| Item | Actual value/result |
|------|---------------------|
| Repository path | `/Users/phamngocgiabao/eshop-sut-hw05-23127027` |
| Branch | `main`, tracking `origin/main` |
| Commit | `85af3ba875c88283615e22cb108f13e2fccaf0e9` |
| Tracked/staged backend differences | None |
| Original backend `node_modules` | Absent |
| Port 3000 listener | None (`lsof` returned no row, exit 1) |
| Database SHA-256 | `c63f00544180ba1fbb1427a9b9dd3f1784842698809972f33ce90482e7420ba6` |
| `server.js` SHA-256 | `47573ce5a6bf9a894748d2bb56cc8d1659ad7acd033fdd6db6b3e4d9473eb487` |
| `database.js` SHA-256 | `3366420632bb9c982905b22e3969f69515e39e7a37a4f84eba56ead7e94afed8` |
| `package.json` SHA-256 | `2e536b8fc5009439e9235cf5867ea7a35b8a6e867a94b6738db6938f8d3ebd88` |
| `package-lock.json` SHA-256 | `ec3f3b2dbf1622f1b1121b9d5916ab0eb74d06ed8c59b16082c52c452eebd814` |

The original status already contained the assignment PDF and Phase 0–2
documentation as untracked homework work. It contained no backend source or
database modification.

## 2. Disposable clone creation and identity

The runtime root was created with:

```bash
mktemp -d /private/tmp/eshop-hw05-sut.XXXXXX
```

Actual result:

```text
/private/tmp/eshop-hw05-sut.jxn8Wd
```

The original database was copied with metadata preservation, then the local
repository was cloned without hard-linked Git objects:

```bash
cp -p /Users/phamngocgiabao/eshop-sut-hw05-23127027/backend/database.sqlite \
  /private/tmp/eshop-hw05-sut.jxn8Wd/original-database.sqlite.prestart

git clone --no-hardlinks --local \
  /Users/phamngocgiabao/eshop-sut-hw05-23127027 \
  /private/tmp/eshop-hw05-sut.jxn8Wd/repo
```

Actual clone output:

```text
Cloning into '/private/tmp/eshop-hw05-sut.jxn8Wd/repo'...
done.
```

Verification results:

- Clone commit exactly matched the expected commit.
- Clone status was initially clean.
- `cmp -s` confirmed the backup was byte-identical to the original.
- Original, backup, and clone database SHA-256 values were identical before
  startup.
- Clone database pre-start counts were users 2, products 5, categories 3,
  orders 3, coupons 4, and coupon usage 0.

## 3. Dependency installation

### First attempt — failed and preserved

Actual command, confined to the temporary clone/cache:

```bash
cd /private/tmp/eshop-hw05-sut.jxn8Wd/repo/backend
npm ci --cache /private/tmp/eshop-hw05-sut.jxn8Wd/npm-cache
```

The sandboxed attempt produced no normal progress output for approximately one
minute. Its debug log recorded:

```text
http fetch GET https://registry.npmjs.org/npm attempt 1 failed with ENOTFOUND
request to https://registry.npmjs.org/-/npm/v1/security/audits/quick failed,
reason: getaddrinfo ENOTFOUND registry.npmjs.org
```

The terminal then printed:

```text
npm error Exit handler never called!
npm error This is an error with npm itself. Please report this error at:
npm error   <https://github.com/npm/cli/issues>
```

The command session reported exit 0 despite that npm error, but follow-up
`npm ls --depth=0` exited 1 and marked the partially created dependency tree
invalid/extraneous. This first attempt is classified **FAILED**; its session
exit value is not treated as installation success.

### Approved network retry — succeeded

The same `npm ci` command was retried with network permission. Actual output:

```text
npm warn deprecated prebuild-install@7.1.3: No longer maintained.

added 135 packages, and audited 136 packages in 3s

36 packages are looking for funding
4 vulnerabilities (1 low, 1 moderate, 1 high, 1 critical)
```

Exit code: `0`.

Post-install `npm ls --depth=0` exited 0 and reported:

```text
backend@1.0.0
├── body-parser@2.2.2
├── cors@2.8.6
├── express@5.2.1
├── jsonwebtoken@9.0.3
└── sqlite3@6.0.1
```

`require("sqlite3")` succeeded and reported `Database=function`. The clone's
`package.json` and `package-lock.json` hashes/diffs remained unchanged. No
`npm audit fix` was run because it could modify the dependency graph.

## 4. Startup attempts and environment diagnosis

### Sandboxed launches

The first direct command was:

```bash
node server.js
```

It printed:

```text
Database initialized and seeded (Phase 2).
Server is running on http://localhost:3000
Connected to database
```

The execution wrapper then reported exit 0 immediately, and `lsof` found no
listener. A second background/wait launch reported PID 9674 plus
`nice(5) failed: operation not permitted`, printed the same backend log, exited
0, and left no process/listener.

Read-only diagnostic wrappers loaded the same unmodified `server.js` and showed
active `TCP` handles with `REF=true`, yet the sandbox still ended the process.
This isolated the issue to the execution sandbox lifecycle rather than an
observed application exception. Each diagnostic load reseeded only the clone,
which was already disposable and approved for startup.

### Runtime launch outside the sandbox restriction

The original command was run unchanged with localhost-listener permission:

```bash
cd /private/tmp/eshop-hw05-sut.jxn8Wd/repo/backend
node server.js
```

It printed the same three startup messages and remained active. `lsof` proved:

```text
COMMAND  PID   USER              FD  TYPE  NAME
node     9739  phamngocgiabao   17u IPv6  TCP *:3000 (LISTEN)
```

`lsof -a -p 9739 -d cwd` proved its working directory was:

```text
/private/tmp/eshop-hw05-sut.jxn8Wd/repo/backend
```

Therefore the listener was the temporary clone process, not a process from the
original homework repository.

## 5. Read-only HTTP verification

Sandbox-local curl could not cross into the listener's network namespace. Both
initial curl attempts returned exit 7 and `HTTP_STATUS=000`; this was preserved
and then retried with the same localhost permission as the server.

### Product search

Actual request:

```bash
curl --fail --silent --show-error \
  --header "Accept: application/json" \
  --write-out "\nHTTP_STATUS=%{http_code}\n" \
  "http://127.0.0.1:3000/api/products?search=iPhone%2015"
```

Actual response:

```json
[{"id":1,"name":"iPhone 15 Pro Max","price":30000000,"description":"Điện thoại cao cấp của Apple","imageUrl":"https://placehold.co/300x300/png?text=iPhone+15","category_id":1}]
```

HTTP status: `200`; curl exit: `0`.

### Full product listing

Actual request:

```bash
curl --fail --silent --show-error \
  --header "Accept: application/json" \
  --write-out "\nHTTP_STATUS=%{http_code}\n" \
  "http://127.0.0.1:3000/api/products"
```

HTTP status: `200`; curl exit: `0`. The JSON array contained five products with
IDs 1–5 and names/prices matching the source fixtures. No write endpoint was
called.

## 6. Reset confinement evidence

| State | Before clone startup | After clone startup |
|-------|----------------------|---------------------|
| Original DB SHA-256 | `c63f00544180ba1fbb1427a9b9dd3f1784842698809972f33ce90482e7420ba6` | Same |
| Backup DB SHA-256 | `c63f00544180ba1fbb1427a9b9dd3f1784842698809972f33ce90482e7420ba6` | Same |
| Clone DB SHA-256 | `c63f00544180ba1fbb1427a9b9dd3f1784842698809972f33ce90482e7420ba6` | `e5783132d3952afb2bcc3410b33f2b05f0368f6542a6cb87f0e3fc98421ab992` |
| Clone orders | 3 | 0 |
| Clone users/products/categories/coupons | 2 / 5 / 3 / 4 | 2 / 5 / 3 / 4 |
| Clone coupon usage | 0 | 0 |

The changed clone hash and removal of its three prior orders empirically verify
reset/reseed behavior. The byte-identical original and backup hashes verify
that startup did not reset the homework repository database.

## 7. Shutdown result

After confirming PID and working directory, the exact process was stopped:

```bash
kill -TERM 9739
```

- `kill` exit: 0.
- Managed execution session exit after SIGTERM: 1.
- `kill -0 9739` afterward: no such process.
- `lsof -nP -iTCP:3000 -sTCP:LISTEN` afterward: no listener.
- Clone SQLite `PRAGMA integrity_check`: `ok`.

The session's nonzero terminal status is preserved. Because SIGTERM was sent to
the verified PID, the process disappeared, the port was released, and SQLite
integrity remained valid, shutdown is operationally verified as complete.

## 8. Original repository integrity after shutdown

All original backend hashes matched the pre-start values. `git status
--porcelain -- backend` remained empty, proving no tracked, staged, or untracked
backend path was changed by runtime work. The original backend still had no
`node_modules` directory.

The temporary clone correctly showed only:

```text
 M backend/database.sqlite
?? backend/node_modules/
```

No SUT source or manifest file changed in either location.

## 9. Commands actually executed

Material commands, in execution order:

```text
pwd -P
git rev-parse HEAD
git status --short --branch
git status --porcelain -- backend
shasum -a 256 backend/database.sqlite backend/server.js backend/database.js backend/package.json backend/package-lock.json
lsof -nP -iTCP:3000 -sTCP:LISTEN
find backend -maxdepth 1 -type d -name node_modules -print
mktemp -d /private/tmp/eshop-hw05-sut.XXXXXX
cp -p <original-database> <temp-backup>
git clone --no-hardlinks --local <original-repository> <temporary-clone>
git rev-parse HEAD
cmp -s <original-database> <temp-backup>
shasum -a 256 <original-database> <temp-backup> <clone-database>
sqlite3 -readonly database.sqlite <table-count query>
npm ci --cache /private/tmp/eshop-hw05-sut.jxn8Wd/npm-cache
npm ls --depth=0
node -e <sqlite3 module-load verification>
git diff --exit-code -- backend/package.json backend/package-lock.json
node server.js
node server.js > <temp-log> 2>&1 & wait <pid>
node -e <active-handle diagnostics loading unmodified server.js>
node server.js  # approved local-listener execution
lsof -nP -iTCP:3000 -sTCP:LISTEN
lsof -a -p 9739 -d cwd
curl <read-only product search>
curl <read-only product listing>
kill -TERM 9739
kill -0 9739
sqlite3 -readonly database.sqlite <counts and integrity query>
shasum -a 256 <original/backup/clone database paths>
git status --short --branch  # original and clone
git diff --exit-code -- backend/server.js backend/database.js backend/package.json backend/package-lock.json
```

Angle-bracket descriptions abbreviate the explicit paths/queries already shown
above; they are not claims that different commands were run.

## 10. SOURCE/RUNTIME VERIFIED

- The clone was pinned to the expected commit.
- Dependencies installed successfully only in the temp clone after network
  permission was granted.
- Direct dependencies and native SQLite loading were verified.
- The backend reset only the clone database.
- The original database hash and backend working tree remained unchanged.
- PID 9739 from the clone listened on port 3000.
- Product search and product listing returned actual JSON with HTTP 200.
- Exact-PID SIGTERM stopped the backend and released port 3000.

## 11. FAILED OR UNEXPECTED

- First `npm ci`: DNS `ENOTFOUND`, npm exit-handler error, incomplete tree.
- npm retry: succeeded but reported a deprecated package and four dependency
  vulnerabilities. No automatic remediation was attempted.
- Sandboxed server launches were terminated despite referenced TCP handles.
- Sandboxed curl could not reach the outside-sandbox listener (`HTTP 000`).
- Managed server session reported exit 1 after the successful SIGTERM shutdown.

These results are environmental/tooling observations and are not classified as
SUT bugs.

## 12. Deferred workflow context

The student's group contains four members. When the separately approved
workflow-discovery phase begins, at least 5–6 genuinely distinct candidates
must be derived from verified source/runtime building blocks so the group can
avoid duplicate selections. No workflow candidate was generated in Phase 2B.
