# PILOT / RUNTIME VALIDATION — ARTIFACT INVENTORY

| Artifact | Bytes | Git disposition |
|---|---:|---|
| `raw/pilot-raw.json` | 13,045,547,159 | Preserved locally; not staged because multi-gigabyte |
| `raw/pilot-timeseries.csv` | 5,984,776,809 | Preserved locally; not staged because multi-gigabyte |
| `logs/k6.stderr.log` | 4,161,202,188 | Preserved locally; not staged because multi-gigabyte |
| `logs/k6.stdout.log` | 36,534 | Safe candidate for Pilot evidence commit |
| `raw/pilot-dashboard.html` | 177,248 | Safe candidate for Pilot evidence commit |
| `raw/pilot-summary.json` | 1,224 | Safe candidate for Pilot evidence commit |
| `logs/backend.log` | 194 | Safe candidate for Pilot evidence commit |
| `evidence/provisioning-evidence.redacted.json` | 411 | Safe candidate for Pilot evidence commit |

`SHA256SUMS` contains hashes of the original files above. Large files remain at
their recorded paths and were not deleted, compressed, renamed, or substituted.

Secret checks:

- full scan passed for small stdout/summary/dashboard/redacted evidence;
- first and last 100 MiB of each giant file had no known sensitive pattern;
- the attempted full 21.6 GiB scan was stopped after several match-free minutes,
  so a complete byte-for-byte scan is not claimed;
- zero HTTP bytes and static low-cardinality metric schemas independently limit
  the giant outputs to local metric/error evidence rather than request bodies.
