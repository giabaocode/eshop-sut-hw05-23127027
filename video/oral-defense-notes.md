# Oral Defense Preparation (5–7 Minutes)

Status: **PREPARATION — HUMAN DELIVERY REQUIRED**

Be ready to answer from real artifacts:

1. Why WF-03? It uniquely covers auth, read, and transactional behavior with a
   verifiable order-state lifecycle.
2. Why 20 accounts? Dedicated VU ownership avoids shared auth/state coupling;
   20 matches the bounded Stress/Spike input, not capacity.
3. Which values are correlated? JWT/user, product ID/price, and order ID are
   response-derived and iteration-local.
4. How is success defined? Only after the exact newly created order is observed
   pending, canceled using that same ID, then observed canceled.
5. What does Stress prove? No degradation was observed through the executed
   20-VU schedule; it does not establish maximum capacity.
6. What is the endurance result? Five VUs sustained for 12 minutes on this
   machine/commit/data, with 713/713 workflows; not a longer or maximum claim.
7. What did AI get wrong? Explain `::`, tight exception loop/21.6 GiB, Pilot tag,
   provisioning/listener boundaries, bottleneck wording, and unsupported numeric
   thresholds.
8. Why no GitHub issue? No genuine SUT failure or reproducible performance defect
   was confirmed; harness defects were audited separately.
9. Why three report views? Native JSON is canonical; Load aggregate, Stress
   CSV-derived time series, and Spike k6 dashboard are genuine distinct k6
   equivalents under the human PDF interpretation.
10. What remains uncertain? Repeat-run noise, capacity ceiling, longer endurance,
    continuous CPU/memory, larger data, and other machines.
