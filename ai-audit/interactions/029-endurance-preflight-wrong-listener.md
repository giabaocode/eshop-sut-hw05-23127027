# Interaction 029 — Endurance Preflight Wrong-Listener Failure

| Field | Actual record |
|---|---|
| AI tool | Codex CLI |
| Recorded | 2026-09-02 14:23:22 +0700 |
| Source commit | `54848d2b110d2d3a59b4eaf0dd6014a5e6e518df` |
| k6 traffic | None |
| Classification | AI orchestration/preflight defect; not SUT performance evidence |
| Status | Blocked for human ownership/cleanup decision |

Codex created a fresh no-hardlink runtime. A sandboxed `npm ci` returned before
the sqlite3 native binding became visible; the immediate server attempt failed
with `Could not locate the bindings file`. Moments later the binding loaded and
`npm ls` passed. A second launch initialized the disposable DB but did not
remain attached as a listener.

Codex then made a material orchestration error: it put `lsof` listener/cwd
inspection and the provisioning helper in one non-fail-closed shell command.
The inspection output identified port owner PID `52187` at cwd
`/Users/phamngocgiabao/eshop-sut/backend`, but the next command still ran. The
helper created and validated 20 accounts through the real localhost API; its
filesystem boundary checks could not prove which process owned the URL.

Read-only database inspection proved the disposable DB contained zero WF-03
accounts while the unexpected listener DB contained exactly 20. The protected
HW05 DB hash remained unchanged. No k6 process or endurance artifact was
created. Codex did not kill PID `52187`, mutate/reset the other repository, or
delete the private credentials. It stopped and requested the minimum human
decision about the unowned process and polluted external DB.
