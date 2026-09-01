# Interaction 020 — Human Official Filenames and Wrapper Validation

| Field | Actual record |
|---|---|
| AI tool | Codex CLI |
| Recorded | 2026-09-01 23:31:14 +0700 (Asia/Ho_Chi_Minh) |
| Human action | Manually created three official filename artifacts with date `20260901` |
| Authorized continuation | Load-only preparation if and only if all filename/content gates passed |
| Prohibitions | No wrapper correction by AI; no backend, provisioning, Load/Stress/Spike/endurance, or push |

## Human-provided filenames

- `performance/scenarios/official/23127027_Load_20260901.js`
- `performance/scenarios/official/23127027_Stress_20260901.js`
- `performance/scenarios/official/23127027_Spike_20260901.js`

The human explicitly instructed Codex to treat filename creation as a human
action, validate the PDF pattern and wrapper semantics, mark H-010 only when the
names pass, and stop with an exact diff rather than silently correcting any
semantic difference. Only after all three content gates passed could Codex
prepare official Load; no Stress/Spike preparation or execution was authorized.

## Actual validation

Filename validation passed for student `23127027`, exact scenario types
`Load|Stress|Spike`, date `20260901`, and `.js` extension. H-010 is therefore
recorded `DONE BY HUMAN` for the filename action.

All three official files are byte-for-byte copies of their reviewed internal
entry points, so the ordinary text diff is empty and no business logic, secret,
dynamic ID, assertion, or scenario selection was added. Their different parent
directory nevertheless changes relative-module/data resolution:

```text
internal ../config → performance/config                         (exists)
official ../config → performance/scenarios/config               (missing)
internal ../lib    → performance/lib                            (exists)
official ../lib    → performance/scenarios/lib                  (missing)
internal ../data   → performance/data                           (exists)
official ../data   → performance/scenarios/data                 (missing)
```

Pinned k6 `inspect` failed all three at `../config/workloads.js` before HTTP.
No temporary credential was created because module loading failed first. Port
3000 stayed free. This is an official-wrapper location/setup defect, not SUT or
performance evidence.

## Stop result

Codex preserved the exact filenames, SHA-256 values, empty text diffs, and
module-resolution errors. It did not edit or stage the wrappers and did not
perform the conditional Load preparation. The smallest proposed human change,
if the `official/` directory is retained, is `../config|lib|data` →
`../../config|lib|data` in each wrapper. Human correction and a fresh static
validation are required before official Load preparation can resume.
