# Endurance Preflight — Run `20260902T143823+0700`

Status: **PRESERVED PREFLIGHT PASS — ENDURANCE RUN LATER COMPLETED**

This file preserves the state before measured traffic. The later genuine
endurance outcome is recorded in `analysis/endurance-analysis.md` and the
timestamped result tree; the preflight facts below are not current process
state.

Fresh no-hardlink runtime `/private/tmp/eshop-hw05-endurance.fFN6ej/runtime`
is pinned to `4bc3b682cf11830d41e78e83366fc09bc9645d88`. Exact foreground
backend PID `53376` owns port 3000 with cwd in that clone. Twenty fresh
dedicated accounts, roles/unlocked/login/zero orders, products, public/private
contracts, endurance entry, pinned k6, disk, DB boundary/integrity, and original
hash passed.

The scheduled test is 0→5/30s, 5 VUs/12m, 5→0/30s (13 minutes) with a
14-minute exact-PID safety cap. Five VUs is an evidence-informed conservative
input, not a threshold or capacity claim. At this preflight checkpoint, result
root `performance/results/endurance/20260902T143823+0700/` was still absent.

## Preserved preflight attempts

- `/private/tmp/eshop-hw05-endurance.E1yKbJ/runtime`: blocked after wrong local
  listener provisioning; no k6 traffic; preserved in Interaction 029.
- `/private/tmp/eshop-hw05-endurance.K3YD2z/runtime`: launcher PID died when its
  Codex command ended; the new verifier failed closed before provisioning; no
  k6 traffic.
- `/private/tmp/eshop-hw05-endurance.fFN6ej/runtime`: current fresh runtime;
  foreground session retained; exact PID/cwd guard passed before and after all
  20-account setup.
