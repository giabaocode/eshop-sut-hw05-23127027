# Interaction 031 — Fail-Closed Disposable Listener Guard

| Field | Actual record |
|---|---|
| AI tool | Codex CLI |
| Trigger | Interaction 029 wrong-listener orchestration defect |
| Helper semantics | Existing provisioning helper unchanged |
| Network/runtime action | None during implementation |

Codex added a narrowly scoped launcher that refuses an occupied port, starts a
single detached backend, and validates that its exact PID owns port 3000 with
cwd equal to the disposable clone backend. A separate atomic verifier repeats
the exact PID/cwd/port invariant immediately before provisioning and measured
traffic. Any mismatch exits nonzero, so the caller must chain verification and
the protected action with `&&`.

This corrects orchestration outside the reviewed provisioning helper and does
not change the SUT, workflow, workload, checks, correlations, metrics, or
credentials. Static shell validation and controlled fail-path checks are
required before the scripts are used in another fresh runtime.
