# PILOT / RUNTIME VALIDATION — ARTIFACT INVENTORY

| Artifact | Bytes | Modified (+07) | SHA-256 | Producer | Git/cleanup disposition |
|---|---:|---|---|---|---|
| `raw/pilot-raw.json` | 13,045,547,159 | 2026-09-01 21:38:42 | `35a8835c07496704200e16270d7387bd5770b0acf94bf4bc70411064fe341736` | k6 native granular JSON output (`--out json=...`) | Never staged; human-authorized exact deletion pending after this record is committed |
| `raw/pilot-timeseries.csv` | 5,984,776,809 | 2026-09-01 21:37:56 | `c40a93c380f01ab73b4ce3e4043432838b9ab5306cc327ad8caf5fb425b6a5ce` | k6 native CSV output (`--out csv=...`) | Never staged; human-authorized exact deletion pending after this record is committed |
| `logs/k6.stderr.log` | 4,161,202,188 | 2026-09-01 21:37:55 | `59a75aaaa9b3368d310f2637998c56448afcb28f9b1feca4a772f6204310006e` | stderr redirection from the k6 process | Never staged; human-authorized exact deletion pending after this record is committed |

Small committed artifacts:

| Artifact | Bytes | Git disposition |
|---|---:|---|
| `logs/k6.stdout.log` | 36,534 | Safe candidate for Pilot evidence commit |
| `raw/pilot-dashboard.html` | 177,248 | Safe candidate for Pilot evidence commit |
| `raw/pilot-summary.json` | 1,224 | Safe candidate for Pilot evidence commit |
| `logs/backend.log` | 194 | Safe candidate for Pilot evidence commit |
| `evidence/provisioning-evidence.redacted.json` | 411 | Safe candidate for Pilot evidence commit |

`SHA256SUMS` contains hashes of all original files above. At the time this
pre-deletion preservation record was committed, all three remained at their
exact paths and had not been compressed, renamed, substituted, or committed.

The root error, independently reproduced without HTTP, was exactly:

```text
GoError: group and check names may not contain '::'
```

The bounded committed stderr excerpt in `k6-error-excerpt.txt` records the
sanitized repeated exception, source location, and first/last observation time;
`group-name-diagnostic.txt` preserves the exact k6 diagnostic. The committed
summary records 9,699,772 attempted/failed iterations, zero successes, and
`data_sent=0`, `data_received=0`. Therefore no SUT HTTP request occurred.

Human-approved cleanup reason: this failed non-official Pilot produced
pathological output volume because a test-harness exception tight-looped before
HTTP. Only these three exact untracked files may be removed after this evidence
record is committed.

Secret checks:

- full scan passed for small stdout/summary/dashboard/redacted evidence;
- first and last 100 MiB of each giant file had no known sensitive pattern;
- the attempted full 21.6 GiB scan was stopped after several match-free minutes,
  so a complete byte-for-byte scan is not claimed;
- zero HTTP bytes and static low-cardinality metric schemas independently limit
  the giant outputs to local metric/error evidence rather than request bodies.
