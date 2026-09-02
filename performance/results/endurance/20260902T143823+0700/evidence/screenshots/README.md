# Endurance Screenshot Evidence

`endurance-k6-backend-resource.jpg` is the real human-captured source image. It
shows:

- endurance steady state at 5/5 VUs and 6m29.9s of 13m;
- 349 completed and zero interrupted iterations in the visible live output;
- Activity Monitor backend PID `53376`;
- point-in-time 1.3% CPU, 56.1 MB real memory, and 11 threads.

The adjacent terminal contains Codex's actual live observation and capture
instruction, including the k6 progress line read from this run's stdout.
`endurance-k6-backend-resource.png` is a genuine `sips` conversion. The visual
resource values are point-in-time evidence, not continuous CPU/memory telemetry.
