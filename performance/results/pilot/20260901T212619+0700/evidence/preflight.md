# PILOT / RUNTIME VALIDATION — NOT OFFICIAL LOAD RESULT

## Attempt 02 preflight

| Check | Actual result |
|---|---|
| Source commit | `41c6fecf826148e73a4ce3c651791d90650e595c` |
| Disposable runtime | `/private/tmp/eshop-hw05-pilot.4B74ft/runtime` |
| Private credential directory | `/private/tmp/eshop-hw05-pilot.4B74ft/private`, mode `0700`, outside Git |
| Backend PID | `20315` |
| Backend command/cwd | `node server.js`; `/private/tmp/eshop-hw05-pilot.4B74ft/runtime/backend` |
| Backend started | `2026-09-01 21:30:36 +0700` |
| Target/port | `http://127.0.0.1:3000`; PID 20315 owns TCP port 3000 |
| One-start rule | PASS; PID 20315 stayed unchanged through setup and the full Pilot, then was stopped once |
| Original DB before setup | SHA-256 `c63f00544180ba1fbb1427a9b9dd3f1784842698809972f33ce90482e7420ba6`; device/inode `16777234:6621788` |
| Clone DB before start | Same committed SHA-256 but distinct device/inode `16777234:6696039` |
| Clone reset integrity | `PRAGMA integrity_check=ok`; 2 seeded users, 5 products, 0 orders before provisioning |
| Public rows | Rows 01/02 each have exact five-field schema, expected sequential key, reviewed search/name/address |
| Required products | Exact `iPhone 15 Pro Max` and `Samsung Galaxy S24 Ultra` exist with positive prices; all five seed products verified |
| Provisioned account keys | Exactly `wf03-customer-01` and `wf03-customer-02` |
| Private credential file | Exactly 2 data rows plus header; mode `0600`; content not printed or copied into Git |
| Credential validation | Helper performed successful real login for both; role `user`, attempts 0, unlocked |
| Starting order state | 0 orders before provisioning and 0 after both account validations |
| Disposable DB after provisioning | `integrity_check=ok`; exactly 4 total users, exactly 2 Pilot users |
| Free disk | 764,739,156 KiB available at Attempt 02 preflight; exceeds 2 GiB gate |
| Output root | New `performance/results/pilot/20260901T212619+0700/{raw,evidence,logs}` directories |
| k6 | `/opt/homebrew/bin/k6`; `v2.2.0`, darwin/arm64 |
| Final performance thresholds | None; Pilot runtime validation only |

### Setup warnings retained

- npm 10.8.2 reported deprecated `prebuild-install@7.1.3`.
- npm audit reported four dependency vulnerabilities: one low, one moderate,
  one high, and one critical. No automatic fix or dependency/lockfile mutation
  was performed.
- A sandboxed localhost curl could not reach the externally permitted backend;
  an explicitly permitted read-only localhost curl succeeded and returned the
  five products while PID 20315 remained healthy.
