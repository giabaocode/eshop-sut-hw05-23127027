# PILOT / RUNTIME VALIDATION — NOT OFFICIAL LOAD RESULT

This directory contains genuine artifacts from failed Pilot ID
`20260901T212619+0700`. See `docs/k6-pilot-results.md` for interpretation.

The Pilot failed before HTTP because k6 rejects `::` inside group names. The
resulting tight exception loop generated 9,699,772 failed iterations and three
multi-gigabyte files. Do not interpret their rates as SUT performance.

The native JSON, CSV, and full stderr were identified before authorized cleanup
by exact path, size, timestamp, producer, and SHA-256 in
`evidence/artifact-inventory.md`. The human authorized deletion of only those
three untracked pathological files after that evidence was committed. No
artifact is relabeled as an official result.
