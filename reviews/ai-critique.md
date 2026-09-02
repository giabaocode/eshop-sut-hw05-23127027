# AI Critique — Human-Approved Final Text

Status: **APPROVED BY PHẠM NGỌC GIA BẢO — HUMAN**

Word count: **278 words** (whitespace count of the substantive body)

AI accelerated this assignment by tracing the source code, mapping the WF-03
API lifecycle, generating a shared k6 architecture, and parsing thousands of
real measurements reproducibly. However, several failures showed why its
output could not be accepted without human review. The first draft used `::`
inside k6 group/check names, which k6 v2.2.0 rejects. Its generic exception
handler then allowed a tight retry loop, creating about 9.7 million iterations
and roughly 21.6 GiB of non-HTTP output. It also initially mislabeled Pilot
custom metrics as measured traffic and invoked the provisioning helper from
the wrong trust boundary. Later, a non-fail-closed listener check allowed setup
accounts to reach an unrelated localhost SUT process. These were test-harness
defects, not SUT performance findings.

AI interpretation also required correction. Checkout and cancellation had the
highest relative latency, but their millisecond-scale values and zero failures
did not prove bottlenecks. Proposed p95, lifecycle, success-rate, and regression
margins lacked repeat-run noise evidence, so I classified them as insufficiently
supported rather than final thresholds. Generic recommendations for a normal
index on `LIKE '%term%'` search and a connection pool for a local SQLite object
were hallucinated or inapplicable.

Human review improved the work by introducing dedicated per-VU accounts,
realistic cancellation think time, iteration-level authentication failure,
exact process ownership guards, bounded output, and immutable failure evidence.
The main lesson is that AI is strongest as a fast investigator and automation
partner, while the student must own semantics, safety, and conclusions. Small
Pilots, raw-data verification, and explicit human checkpoints converted
plausible drafts into defensible performance evidence without hiding mistakes.
The collaboration also showed that auditability matters: preserving failed runs
made later safety improvements explainable, reproducible, and distinguishable
from genuine SUT behavior.
