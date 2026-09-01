# k6 Report and Output Mapping Proposal

Status: **FINAL K6-EQUIVALENT STRATEGY — RESOLVED BY HUMAN DECISION; PINNED-VERSION VALIDATION PENDING**

Scope: WF-03 Load, Stress, and Spike official runs
Prepared: 2026-09-01 (Asia/Ho_Chi_Minh)

No k6 installation or reporting dependency was added, and no output or report was generated while preparing this proposal.

### Phase E human decision

The human conditionally approved the technical mapping—Load aggregate/custom
summary, Stress native CSV time series, Spike k6 web-dashboard HTML—with real
native k6 raw data preserved for every official scenario. This is not approval
of final homework compliance. H-002 remains `WAITING FOR LECTURER/TA
CLARIFICATION`; no JSON/CSV may be renamed or represented as JTL.

### Phase F human supersession

The human resolved H-002 without external clarification, using the official PDF
as the sole assignment authority. The PDF explicitly permits k6 and requires
equivalent distinct outputs for k6 users. The earlier AI ambiguity concern is
retained as history, but it is no longer a blocker. No JMeter artifact will be
fabricated.

## 1. The assignment requirements that must both remain visible

The repository's evidence-backed extraction in `docs/assignment-requirements.md` records both requirements from `2026.HW05.Performance Testing_En.pdf`:

1. `T1-07` / plan-design section: the three test plans must use three **distinct, non-repeated listener/report types**; for k6, use technically equivalent distinct outputs instead of JMeter listeners.
2. `T1-14` / submission section: submit the full raw **`.jtl` logs** generated from CLI runs and **three HTML report folders**, one for each test plan.

These clauses create a k6 compliance ambiguity. Native k6 artifacts are not native JMeter `.jtl` files, while producing the same k6 dashboard report for all three scenarios may not satisfy the distinct/non-repeated-view instruction. This document does not silently choose one clause over the other.

## 2. Current official k6 capabilities

The table is based on current official Grafana k6 documentation checked on 2026-09-01. The exact feature set must be rechecked after a k6 version is selected and pinned; k6 is not installed in this repository yet.

| Capability | Native k6 status | Planned meaning |
|---|---|---|
| End-of-test console summary | Native | Aggregate metrics and thresholds printed at test end; compact/full/disabled modes are documented. |
| Granular JSON output | Native via `--out json=<file>` | Line-oriented metric points with metric name, type, values, time, and tags; suitable as a canonical authentic raw k6 artifact. |
| Granular CSV output | Native via `--out csv=<file>` | Time-series metric samples in CSV; a useful distinct tabular/time-series view. |
| Multiple real-time outputs | Native | More than one `--out` destination can be active, subject to later resource-impact validation. |
| Self-contained web-dashboard HTML export | Native current feature | `K6_WEB_DASHBOARD=true` with `K6_WEB_DASHBOARD_EXPORT=<file>` can export a self-contained HTML dashboard when the process exits. |
| Custom end summary | Native `handleSummary()` API | Can write summary JSON/text or deliberately generated custom content; it is aggregate output, not a replacement for granular raw data. |
| Native JMeter `.jtl` output | Not documented as a native k6 output | Based on the official output list, k6 does not natively produce JMeter JTL. Renaming JSON/CSV to `.jtl` would misrepresent its format. |
| Arbitrary HTML layouts | Requires report code/tooling | A custom `handleSummary()` renderer or external reporting pipeline can create HTML, but it must be reviewed, pinned, and transparently disclosed. |

Official references:

- [k6 results output overview](https://grafana.com/docs/k6/latest/get-started/results-output/)
- [k6 JSON granular output](https://grafana.com/docs/k6/latest/results-output/real-time/json/)
- [k6 CSV granular output](https://grafana.com/docs/k6/latest/results-output/real-time/csv/)
- [k6 web dashboard and HTML export](https://grafana.com/docs/k6/latest/results-output/web-dashboard/)
- [k6 end-of-test summary](https://grafana.com/docs/k6/latest/results-output/end-of-test/)
- [k6 custom summary](https://grafana.com/docs/k6/latest/results-output/end-of-test/custom-summary/)

The statement about lack of native JTL is an inference from the official supported-output documentation, not a claim based on an executed k6 binary. It must be verified against the future pinned k6 version.

## 3. Final three-scenario distinct-output mapping

The candidate below prioritizes three genuinely different primary views while preserving authentic granular k6 data for every scenario.

| Scenario | Primary distinct view/output | Raw artifact | HTML/equivalent artifact | Tool/dependency | Compliance status |
|----------|------------------------------|--------------|--------------------------|-----------------|-------------------|
| Load | Native end-of-test aggregate/custom summary | Native granular `load-raw.json` | Aggregate HTML/summary generated transparently from real Load summary/raw data | Pinned k6 plus reviewed aggregate renderer | **HUMAN-APPROVED K6 EQUIVALENT**; renderer validation pending |
| Stress | Native CSV time-series analysis | Native granular `stress-raw.json` plus `stress-timeseries.csv` | Time-series HTML analysis generated transparently from real Stress CSV/raw data | Pinned k6 plus reviewed time-series renderer | **HUMAN-APPROVED K6 EQUIVALENT**; renderer validation pending |
| Spike | Native k6 web-dashboard time-series view | Native granular `spike-raw.json` | Real k6 web-dashboard HTML export | Pinned k6 web dashboard | **HUMAN-APPROVED K6 EQUIVALENT**; pinned-version validation pending |

The filenames above are schematic, not generated artifacts. Final names must use the reviewed submission convention and preserve scenario, student ID, and execution timestamp without secrets.

## 4. Historical alternatives and final decision

### Path A — distinct native k6 equivalents

- Load: aggregate end summary;
- Stress: CSV time-series output;
- Spike: web-dashboard HTML;
- all scenarios: canonical native raw k6 JSON plus an artifact manifest/checksum.

This best honors the instruction that the three outputs be distinct and
non-repeated. The human selected this k6-equivalent interpretation from the PDF;
lecturer/TA clarification is no longer required.

### Path B — literal HTML packaging as a supplement

- Keep the three distinct primary outputs from Path A.
- Also export the native k6 web dashboard for Load, Stress, and Spike into three scenario-specific report folders.
- Preserve native raw JSON, never relabel it as JTL.

This historical contingency approached the literal three-HTML-folder wording,
but repeating the same dashboard type is not the selected final strategy.

A later approved custom renderer could give Load and Stress genuinely different HTML layouts, but choosing a renderer solely to make filenames/layouts appear different would be artificial. Any report tool must consume authentic k6 data, disclose its transformation, preserve the original raw input, and be pinned and documented.

## 5. Real report-directory and raw-data strategy

No report directory is created before real execution. Each official run will
use a unique actual run ID below this conceptual layout:

```text
performance/results/
├── load/<actual-run-id>/{raw,report}/
├── stress/<actual-run-id>/{raw,report}/
└── spike/<actual-run-id>/{raw,report}/
```

Load `report/` holds a real aggregate HTML/equivalent, Stress `report/` a real
CSV/raw-derived time-series HTML/equivalent, and Spike `report/` the real k6
dashboard HTML. Required results remain trackable and are not broadly ignored.

1. The native granular k6 JSON is the proposed canonical raw artifact for every scenario.
2. CSV is also preserved when enabled; it does not replace JSON merely because the extension is familiar.
3. Do not rename JSON/CSV to `.jtl`.
4. Do not construct arbitrary converted data and claim it is native JMeter output.
5. If an approved converter is ever required, retain its original k6 input, exact command/version, transformation notes, output, and checksums; label the result as converted, never native.
6. Keep stdout/stderr, end summary, environment manifest, commit pin, scenario options, raw results, report input, report output, and SHA-256 manifest together.
7. Report generation must occur after or alongside the official run without injecting registration/preconditioning traffic into measured WF-03 metrics.
8. If real-time outputs impose material overhead, validate that overhead in the disposable pilot and use the same reviewed output set across comparable official executions.

## 6. Scenario-report content

Whatever compliance path is approved, the three primary views are intended to answer different questions:

| View | Intended question | Required evidence |
|---|---|---|
| Load aggregate summary | Did the bounded steady workload complete, and what were its aggregate request/check/workflow results? | Native metrics, custom outcome metrics, checks, scenario duration/VUs, no invented thresholds |
| Stress staged time series | How did response/error/workflow behavior evolve across `2 -> 5 -> 10 -> 15 -> 20` VU stages and recovery? | Timestamped native samples and static scenario/step tags; no claim that 20 VUs is measured capacity |
| Spike dashboard | What changed during baseline, rapid rise, hold, return, and recovery? | Time-aligned VUs, latency, request errors, business outcomes, created/canceled counts, and safety events |

No view may contain credentials, JWTs, user IDs, product IDs, order IDs, shipping addresses, or dynamic URL labels.

## 7. Historical lecturer/TA clarification question

> For the k6 option, may I submit native granular k6 JSON as the raw artifact instead of JMeter `.jtl`, and use three distinct primary k6 outputs—Load end summary, Stress CSV time series, and Spike web-dashboard HTML—as the required listener/report equivalents? If three literal HTML report folders are still mandatory, may I additionally export the native k6 dashboard for each scenario even though those supplemental HTML files share one report type, or which exact k6-compatible formats/tools do you require?

This question was prepared but never sent. `ta-clarifications.md` preserves the
human resolution.

## 8. Remaining implementation gate

Before reporting implementation or official execution, record:

- pinned k6 capability evidence;
- reviewed real-data aggregate and time-series HTML renderers;
- exact raw file format and compression policy;
- exact HTML/equivalent generator and pinned version;
- report-folder/naming convention;
- whether report generation is performed live or after the run;
- evidence-retention and checksum procedure.

H-002 itself is resolved. Implementation remains pending because no real result
or pinned-tool capability evidence exists yet. No file with a `.jtl` extension
may be created merely to appear compliant.
