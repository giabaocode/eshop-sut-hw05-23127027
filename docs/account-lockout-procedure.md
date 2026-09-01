# Official Account-Lockout Procedure

Status: **PREPARED — NO OFFICIAL LOCKOUT EVENT OBSERVED**

The official scenarios use only preflight-validated credentials. They must not
deliberately submit bad passwords to manufacture a three-failure lockout.

## Before a run

- Require the complete 20-account pool, even though Load activates only 01..05.
- Verify every account authenticates, has `role=user`, `login_attempts=0`, and
  `locked_until=null` before measured traffic.
- Finish this authentication setup before the official k6 process begins.
- If any account is locked or unusable, fail preflight. Do not share an account,
  guess another password, reduce VUs, or modify SQLite directly.

## During a run

- Record each unexpected 401/403 as an authentication failure and end that
  iteration without Search/Detail/Checkout/Cancel.
- Do not abort the whole run for the first isolated unexpected 401/403.
- Preserve the account key, scenario step, bounded status classification, and
  timestamps without logging email, password, JWT, or dynamic IDs.
- If evidence confirms lockout and the intended test is invalid, stop under the
  approved operational safety policy and preserve raw/runtime evidence.
- The deferred numeric repeated-auth/error abort rules remain disabled.

## Between official runs

Never unlock a measured-run account by editing SQLite. Preserve the completed
scenario evidence, stop its exact backend PID, and discard that scenario's
disposable state only after preservation. The next scenario must use a fresh
commit-pinned clone, one normal backend reset/reseed, and a newly provisioned,
validated 20-account pool. Record the fresh DB, account validation, backend PID,
and original-repository integrity checks.

If Stress or Spike genuinely triggers lockout, document what was observed and
the fresh-runtime reset/reseed steps. If no lockout occurs, say so; never
fabricate a lockout event.
