---
name: hw05-k6-performance
description: Design, execute, analyze, and audit data-driven k6 performance tests for an HW05-style REST workflow, including disposable setup and submission validation. Use when authentic raw evidence and human-review boundaries must be preserved; do not use to fabricate screenshots, narration, grades, or results.
---

# HW05 k6 Performance Workflow

Produce a traceable performance-testing submission from repository evidence.
Treat assignment text and explicit human decisions as authority. Distinguish
planning inputs, Pilot validation, measured facts, interpretation, and final
human judgments.

## Route the work

1. **Discover/design:** read the assignment, inspect source and runtime
   contracts, map one E2E workflow, and document auth/read/transactional steps.
2. **Prepare:** build shared k6 code, public data plus private-credential
   contracts, workload-only scenario entries, checks/metrics, and disposable
   preconditioning. Require human review where the assignment attributes a
   decision or filename to the student.
3. **Execute:** use a fresh disposable runtime, one owned backend process, valid
   dedicated accounts, exact-PID/localhost guards, bounded duration, and genuine
   raw output. Setup traffic is outside measured traffic.
4. **Analyze/report:** derive values reproducibly from native raw data, preserve
   distinct report views, separate facts from interpretations, and retain failed
   attempts rather than hiding them.
5. **Finalize:** maintain the AI Audit and human-decision record, scan for
   secrets/large files, validate requirements, create truthful commits, and
   package only when human-only evidence exists.

For execution and evidence invariants, read
[`references/evidence-contract.md`](references/evidence-contract.md). For the
portable artifact layout and validation checklist, read
[`references/submission-contract.md`](references/submission-contract.md).

## Non-negotiable boundaries

- Never invent performance output, screenshots, hardware evidence, video,
  narration, issues, human review, grade, or submission.
- Never commit credentials, JWTs, private runtime data, or guessed correlation
  IDs. Extract response-owned values within the current VU/iteration.
- Do not weaken checks, silently share accounts, reuse dirty scenario state, or
  treat VU inputs as measured capacity.
- Stop an unexpected harness/runtime exception so it cannot tight-loop. Preserve
  the sanitized first failure and bounded artifacts.
- Confirm the exact Git remote before pushing; never push to an upstream SUT.
- Ask only for genuinely human-required evidence or judgment. Continue safe
  technical work while non-blocking reviews are pending.

## Prefer existing project automation

When present, inspect and reuse project-specific provisioning, runners,
analysis scripts, and validators rather than recreating them. Before executing,
validate their target/root/PID boundaries and current human-approved workload.
Use `scripts/check-result-tree.sh` for a read-only structural check of completed
scenario evidence.
