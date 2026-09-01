# PILOT / RUNTIME VALIDATION — NOT OFFICIAL LOAD RESULT

This directory contains genuine artifacts from failed Pilot ID
`20260901T212619+0700`. See `docs/k6-pilot-results.md` for interpretation.

The Pilot failed before HTTP because k6 rejects `::` inside group names. The
resulting tight exception loop generated 9,699,772 failed iterations and three
multi-gigabyte files. Do not interpret their rates as SUT performance.

The native JSON, CSV, and full stderr remain present locally and are identified
by exact size and SHA-256, but are intentionally not staged for Git due to their
combined 21.6 GiB size. No artifact has been relabeled as an official result.
