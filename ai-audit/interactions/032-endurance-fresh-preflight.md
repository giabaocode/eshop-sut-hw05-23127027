# Interaction 032 — Fresh Endurance Preflight

| Field | Actual record |
|---|---|
| AI tool | Codex CLI |
| Authority | Maximum safe automation instruction |
| Recorded | 2026-09-02 14:38:23 +0700 |
| Source commit | `4bc3b682cf11830d41e78e83366fc09bc9645d88` |
| Run ID | `20260902T143823+0700` |
| Status | Preflight PASS; no endurance k6 traffic |

After H-041 was resolved, Codex discarded the blocked runtime. An intermediate
fresh runtime tested the detached launcher; the process was reclaimed when the
Codex command ended. The atomic verifier returned `expected process is not
alive` and correctly prevented provisioning. No account or k6 traffic occurred
there; the runtime was not reused.

Codex then created the current fresh clone and installed locked dependencies
with network permission, waiting for `sqlite3` to load and `npm ls` to pass.
The backend runs in foreground session ownership. Exact PID `53376`, cwd,
port, marker, and different DB inode passed before provisioning. The verifier
and helper were joined by `&&`; exactly 20 accounts were registered and
validated only after the guard passed.

Post-setup gates found 20 approved role/unlocked users, 20 public/private rows,
five products, zero orders, SQLite integrity `ok`, pinned k6 v2.2.0, 13-minute
options with no thresholds, >2 GiB free, and unchanged protected DB SHA-256.
The result root is absent. Work stopped only at the endurance screenshot
readiness gate; the backend remains the same owned PID.
