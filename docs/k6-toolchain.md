# Pinned k6 Toolchain and Compatibility Record

Status: **PINNED VERSION INIT/OUTPUT-CAPABILITY VERIFIED — PILOT FAILED BEFORE HTTP**

Recorded: 2026-09-01 (Asia/Ho_Chi_Minh)

## 1. Installation gate and pinned version

The authorized Phase G gate was checked before installation:

| Item | Actual observation |
|---|---|
| Homebrew | Existing `/opt/homebrew/bin/brew`, Homebrew `6.0.20` |
| k6 before installation | Not found |
| Host architecture | `arm64` |
| macOS | `26.5.2`, build `25F84` |
| Pre-install timestamp | `2026-09-01 17:13:49 +0700` |
| SUT port 3000 | No listener |

The normal non-`sudo` command `brew install k6` installed the Homebrew bottle.
No second package manager, installer script, elevated command, or unrelated
system configuration was used.

| Pinned property | Actual value |
|---|---|
| Homework k6 version | **k6 v2.2.0** |
| Version output | `k6 v2.2.0 (commit/devel, go1.26.5, darwin/arm64)` |
| Install mechanism | Homebrew formula/bottle `k6` |
| Binary | `/opt/homebrew/bin/k6` |
| Cellar | `/opt/homebrew/Cellar/k6/2.2.0` |
| Binary architecture | Mach-O 64-bit executable arm64 |
| Binary SHA-256 | `621ce55919a8067249cfbcc3da4e5ad5316a5706542a9a68667a40a2ec9dbd45` |
| Post-install timestamp | `2026-09-01 17:14:18 +0700` |

This exact version is pinned for HW05 unless a later human-reviewed change is
necessary. A later `brew info k6` displayed the installed 2.2.0 formula but
also attempted an online formula refresh that failed DNS resolution; this did
not alter or invalidate the already installed binary.

## 2. Init/static validation against the real binary

An ephemeral 20-row synthetic credential CSV was placed under
`/private/tmp/eshop-hw05-k6-init.a5sx7d/`. Its password strings were explicitly
fake init-only placeholders, not SUT accounts or homework credentials. It is
outside Git and no value from it is recorded here.

`k6 inspect --execution-requirements` succeeded for `load.js`, `stress.js`,
`spike.js`, and the new `pilot.js` when the target and credential path were
passed using explicit k6 `-e` flags. `k6 deps` resolved the shared dependency
graph without a custom build.

Verified at k6 init/inspection level:

- all local module imports;
- `open()` path resolution and the private-file override;
- `SharedArray` construction and public/private CSV validation;
- `k6/execution` import and scenario entry points;
- custom `Counter`, `Rate`, and `Trend` constructors;
- `ramping-vus`, stages, graceful settings, tags, and `systemTags` parsing;
- no coded thresholds;
- exact workload requirements shown below.

| Entry | Scheduled stages | k6 maximum | k6 total including 30 s graceful stop |
|---|---:|---:|---:|
| Pilot | 4m | 2 VUs | 4m30s |
| Load | 7m | 5 VUs | 7m30s |
| Stress | 12m30s | 20 VUs | 13m |
| Spike | 6m5s | 20 VUs | 6m35s |

The initial Pilot inspection using shell-prefix variables failed safely at the
approved-target guard because those values were not visible to that `inspect`
invocation. Repeating it with `k6 inspect -e NAME=value ...` succeeded. The
future runner must use explicit `-e` values or otherwise prove its environment
handling; it must never print credential contents.

## 3. Runtime API capability probe without HTTP

An ephemeral script under the same `/private/tmp` directory performed only
local JavaScript/metric operations. It made **zero HTTP requests**, did not
start the backend, did not bind/contact port 3000, and is not a performance
result. With one no-HTTP iteration it verified actual runtime availability of:

- `exec.vu.idInTest` with the expected one-based value;
- `exec.test.abort` as a function;
- `SharedArray` and `open()`;
- Counter/Rate/Trend sample emission;
- configured system tags and scenario function dispatch;
- `handleSummary()` compatibility.

Port 3000 remained without a listener before and after the probes.

## 4. Output capability verification

Installed help and the output registry expose `json`, `csv`, and
`web-dashboard`; run help exposes end summary, `--summary-export`,
`--summary-mode`, and machine-readable-summary support. These were then checked
with a two-second, one-VU, no-HTTP tool probe under `/private/tmp`:

| Capability | k6 2.2.0 finding |
|---|---|
| Native granular JSON | **VERIFIED**; actual JSON capability-probe file created privately |
| Native CSV | **VERIFIED**; actual CSV capability-probe file created privately |
| Web-dashboard HTML export | **VERIFIED** with `K6_WEB_DASHBOARD=true`, `K6_WEB_DASHBOARD_EXPORT=<private path>`, and a temporary localhost port; actual HTML created privately |
| Custom end summary | **VERIFIED**; `handleSummary()` wrote actual JSON privately when summary mode was enabled |
| Multiple outputs | **VERIFIED**; JSON and CSV operated together with dashboard export |
| Native JMeter JTL | **NOT AVAILABLE in the installed output registry**; no JTL was created or inferred |

Two genuine negative findings are retained:

1. the first dashboard attempt could not bind port 5665 inside the filesystem
   sandbox and was too short to emit a dashboard report;
2. on k6 2.2.0, `--summary-mode=disabled` prevented the custom summary output
   used by the probe. The final runner must leave summary mode enabled when it
   depends on `handleSummary()`.

The successful dashboard check used an ephemeral localhost port outside that
sandbox. All generated files are capability-probe artifacts under
`/private/tmp`; they were not committed or called homework reports. After
validation, the exact 220 KiB probe directory—including the synthetic
credential file—was removed. No repository file was targeted. The probes must
never be represented as measured SUT data.

## 5. Compatibility boundary

The shared scripts are now **pinned-k6 init verified**, not end-to-end runtime
verified. The failed Pilot did not exercise login, search, detail, checkout,
order probe, cancellation, or response-owned correlation. Those checks now
require a separately human-approved corrected disposable 2-VU Pilot.

The subsequently approved Pilot confirmed that init/data provisioning worked
but exposed a runtime-only incompatibility not exercised by `inspect`: k6 2.2.0
rejects `::` in group/check names. The Pilot therefore sent zero HTTP bytes and
does not satisfy the end-to-end verification gate. See `k6-pilot-results.md`.

No final p95/RPS/error/capacity threshold or any of the four deferred numeric
abort proposals was introduced. No official Load/Stress/Spike filename or
execution date was created.
