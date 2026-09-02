# Interaction 028 — Evidence-Informed Endurance Design

| Field | Actual record |
|---|---|
| AI tool | Codex CLI |
| Authority | Maximum safe automation instruction |
| Basis | Genuine official Load, Stress, and Spike raw results |
| Status | Prepared for static validation and fresh preflight; no endurance traffic yet |

Codex selected five sustained VUs after observing zero failures at five VUs in
official Load and zero failures through the bounded 20-VU Stress input. It did
not call 20 VUs capacity or infer a final threshold. The test ramps to five for
30 seconds, holds five for 12 minutes, and ramps down for 30 seconds: 13 minutes
scheduled with a 14-minute exact-PID cap.

The new entry uses the same shared `executeWf03()` code, checks, correlation,
metrics, think times, and per-VU account binding. The runner extension accepts
only `endurance.js`, preserves native JSON and CSV, requires the same private
20-row pool, and does not affect the three human-created official filenames.
No SUT, account, k6 traffic, output, screenshot, or performance conclusion was
created during design.

The first pinned-k6 no-HTTP inspection used an AI-created ephemeral synthetic
fixture with `synthetic-NN@example.test` identities. The approved data guard
rejected it with `private credential identity does not match its approved
slot` (exit 107). This was a fixture-generation mistake and useful guard
evidence; no network request occurred. Codex retained the source unchanged and
reran with the required deterministic synthetic identity shape.
