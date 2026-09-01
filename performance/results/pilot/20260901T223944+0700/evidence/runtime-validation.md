# Fresh Corrected Pilot Runtime Validation

Label: **MEASURED PILOT VALUES — NOT OFFICIAL PERFORMANCE RESULTS**

## Process and workload

| Field | Actual value |
|---|---|
| k6 PID | `23298` |
| k6 exit code | `0` |
| Start | 2026-09-01 22:41:52 +0700 |
| Process exit / artifact flush | 2026-09-01 22:45:58 +0700 |
| Runner wall clock | 246 seconds |
| Watchdog | Not fired |
| Workload | 0→2 VUs/30s; 2 VUs/3m; 2→0/30s |
| Completed/interrupted iterations | 81 / 0 |

## Dedicated account mapping

- `exec.vu.idInTest=1` deterministically binds workflow/credential row
  `wf03-customer-01`; the account owned 36 final canceled orders.
- `exec.vu.idInTest=2` deterministically binds workflow/credential row
  `wf03-customer-02`; the account owned 45 final canceled orders.
- Login identity checks matched each current dedicated credential 81/81; role
  and unlocked checks passed 81/81. No range abort, modulo wrap, fallback,
  random reassignment, or shared-account fallback occurred.

## Correlation and checks

| Boundary/assertion | Pass | Fail | Meaning |
|---|---:|---:|---|
| Login group checks | 567 | 0 | HTTP 200, JSON/success, non-empty JWT, expected identity, role=user, unlocked |
| Search group checks | 324 | 0 | valid array and exactly one expected product with valid ID |
| Detail group checks | 405 | 0 | same product ID/name and positive finite price |
| Checkout group checks | 324 | 0 | success and valid new order ID |
| Pending-probe checks | 567 | 0 | same order/owner/amount/address and pending state |
| Cancellation checks | 324 | 0 | correlated order ID and successful cancellation |
| Final-probe checks | 567 | 0 | same lifecycle invariants and canceled state |
| **All checks** | **3,078** | **0** | complete WF-03 assertion chain |

Every iteration created an order ID, used that same order for pending probe,
cancellation, and final probe, then emitted exactly one successful workflow
outcome. The disposable DB ended with 81 orders, all canceled, owned only by the
two Pilot accounts. Runtime-derived JWT/product ID/price/order ID values were
not persisted in public input or metric tags.

## Metrics

| Metric | Actual value |
|---|---:|
| `wf03_workflow_attempted` | 81 |
| `wf03_workflow_success` | 81/81 = 100% |
| `wf03_failures` | 0 samples |
| `wf03_orders_created` | 81 |
| `wf03_orders_canceled` | 81 |
| `wf03_unexpected_auth_response` | 0 samples |
| `http_reqs` | 567 |
| `http_req_failed` | 0/567 = 0% |
| checks | 3,078/3,078 = 100% |
| lifecycle duration | avg 758.33 ms; med 761 ms; p95 963 ms; min 510 ms; max 1,006 ms |
| overall HTTP duration | avg 1.783 ms; med 1.289 ms; p95 4.253 ms; min 0.318 ms; max 6.515 ms |

Endpoint HTTP duration statistics:

| Step | Count | Average | Median | p95 |
|---|---:|---:|---:|---:|
| login | 81 | 0.911 ms | 0.816 ms | 1.50 ms |
| search | 81 | 1.59 ms | 1.86 ms | 2.19 ms |
| detail | 81 | 1.63 ms | 1.75 ms | 2.18 ms |
| checkout | 81 | 3.41 ms | 3.67 ms | 4.43 ms |
| pending probe | 81 | 0.679 ms | 0.642 ms | 1.02 ms |
| cancellation | 81 | 3.59 ms | 3.88 ms | 5.10 ms |
| final probe | 81 | 0.644 ms | 0.599 ms | 0.950 ms |

All custom WF-03 samples were tagged `scenario=pilot,traffic=pilot`; no custom
sample had `traffic=measured`. The `::` strings visible in k6-rendered group
paths are k6's own hierarchy separators; executable source names are the safe
`wf03_NN_step` names.
