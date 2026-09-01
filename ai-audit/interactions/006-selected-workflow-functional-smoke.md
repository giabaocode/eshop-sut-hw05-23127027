# Interaction 006 — Human Workflow Selection and Functional Smoke

## AI tool

Codex CLI

## Date/time

- Human decision recorded/preflight: 2026-09-01 12:56:28–12:56:55 +07
- Runtime execution: 2026-09-01 12:58:17 +07 context
- Shutdown/integrity verification: 2026-09-01 12:58:58 +07
- Documentation completed: 2026-09-01 13:00:58 +07

## Human prompt/instruction — preserved verbatim

> I select:
>
> WF-03 — Purchase followed by customer cancellation.
>
> Group uniqueness confirmation:
> I have coordinated with my group of 4 students and confirm that no other
> group member is using WF-03 as their HW05 performance-testing workflow.
>
> Please record this as my HUMAN workflow decision in:
> docs/human-decisions.md
>
> Do not reinterpret or replace my choice.
>
> Before beginning Load/Stress/Spike design, perform one controlled,
> low-load functional verification of the complete selected workflow using
> the approved disposable runtime environment.
>
> Selected E2E workflow:
>
> Login
> → Product Search/List
> → Product Detail
> → Checkout / Create Order
> → Cancel the newly created Order
>
> Requirements:
>
> 1. Verify the cancellation step at runtime because it was previously only
>    source-verified.
>
> 2. Use a real valid seeded/test account.
>
> 3. Correlate dynamically:
>    - JWT
>    - productId
>    - orderId
>
> 4. Do NOT hard-code an order ID.
>
> 5. Perform only ONE or the minimum number of sequential functional
>    iterations required for verification.
>
> 6. This is a functional smoke verification, NOT a performance test.
>
> 7. Do NOT install or run k6 yet.
>
> 8. Do NOT perform Load, Stress, Spike, or endurance testing.
>
> 9. Keep all database mutation confined to the approved disposable clone.
>
> 10. Record:
>     - exact requests
>     - actual HTTP statuses
>     - relevant redacted responses
>     - created orderId
>     - cancellation request
>     - order state before cancellation
>     - order state after cancellation
>     - whether the workflow can be repeated
>     - any cleanup/state implications
>
> 11. Verify the workflow covers:
>
>     Auth-heavy:
>     Login
>
>     Read-heavy:
>     Product Search/List and Product Detail
>
>     Transactional:
>     Checkout/Create Order and Cancel Order
>
> 12. After the runtime smoke verification, create/update:
>
>     docs/selected-workflow.md
>     docs/runtime-api-verification.md
>     docs/human-decisions.md
>     ai-audit/audit.md
>     MANUAL-TODO.md
>
> 13. Create an AI Audit interaction record containing this actual human
>     instruction and the relevant actual AI output.
>
> 14. Preserve my workflow-selection decision as HUMAN, not AI-generated.
>
> 15. At the end STOP and show:
>
>     SELECTED WORKFLOW
>     RUNTIME VERIFICATION RESULT
>     CORRELATION REQUIREMENTS
>     DATA/STATE SIDE EFFECTS
>     REPEATABILITY RISKS
>     ORIGINAL REPOSITORY INTEGRITY
>     HUMAN ACTION REQUIRED
>     PROPOSED NEXT PHASE
>
> Do not begin final k6 script generation until I review this verification.

## Relevant actual AI output

Codex recorded WF-03 exactly as the student's human choice and recorded the
explicit four-member-group uniqueness confirmation. It did not substitute the
prior AI recommendation for the human decision.

Using the existing approved clone at
`/private/tmp/eshop-hw05-sut.jxn8Wd/repo`, Codex rechecked the original and temp
commits/hashes/state, verified port 3000 was free, then started unmodified
`node server.js`. PID 11253 ran from the temp clone and reseeded only its
database to zero orders.

One sequential functional iteration used the seeded customer account. Actual
results were:

- login: 200, token present and redacted;
- search: 200, extracted product ID 1;
- correlated detail: 200, matching ID and price 30,000,000;
- checkout: 200, extracted order ID 1;
- correlated pre-cancel detail: 200, status `pending`;
- authenticated correlated cancel: 200;
- correlated post-cancel detail: 200, status `canceled`.

The runtime order ID happened to be 1 after the fresh seed, but the helper
extracted it from checkout and constructed every later path dynamically. The
procedure asserted `pending → canceled` and exited 0 with
`FUNCTIONAL_SMOKE_RESULT=PASS`. JWT/password values were not preserved.

Read-only SQLite evidence confirmed one canceled order for user 2, zero coupon
usage, unlocked accounts, and integrity `ok`. The exact PID was stopped with
SIGTERM; the managed TTY session returned exit 1 after termination, the PID
disappeared, and port 3000 became free. The original database/source remained
unchanged and k6 remained uninstalled.

## Files created

- `docs/human-decisions.md`
- `docs/selected-workflow.md`
- `ai-audit/interactions/006-selected-workflow-functional-smoke.md`

## Files modified

- `docs/runtime-api-verification.md`
- `ai-audit/audit.md`
- `MANUAL-TODO.md`

## Commands/actions and boundaries

- Read selected route handlers and earlier runtime/candidate evidence.
- Used read-only Git/hash/SQLite/port checks before and after runtime.
- Created a temporary shell helper outside the submission checkout; it used
  `curl` for one iteration and Node only to parse/redact JSON correlations.
- Started and stopped only the approved temp-clone backend.
- No failed login, lockout, cart/coupon/registration/reset/admin operation,
  concurrency, performance metric, k6 action, Load/Stress/Spike/endurance run,
  source patch, system install, commit, push, or publication occurred.

## Human-review status

`WAITING FOR HUMAN` — the selected-workflow functional smoke and documented
state/repeatability implications require review before detailed performance-test
design or k6 work. No correction had been requested when this record was made.
