# Reproducible PDF Generation

Status: **LOCAL CAPABILITY VERIFIED**

`tools/render_markdown_html.mjs` converts the tracked Markdown sources to
deterministic UTF-8 HTML using only Node.js built-ins. Local Google Chrome
headless prints that HTML to PDF. This preserves the factual Markdown source;
the generated PDFs are derived views, not independent evidence.

Sources and outputs:

| Source | HTML | PDF |
|---|---|---|
| `report/23127027_HW05_Performance_Report.md` | matching `.html` | matching `.pdf` |
| `ai-audit/audit.md` | `report/23127027_AI_Audit.html` | `report/23127027_AI_Audit.pdf` |
| `reviews/ai-critique-draft.md` | `report/23127027_AI_Critique_DRAFT.html` | matching `.pdf` |
| `reviews/ai-critique.md` | `report/23127027_AI_Critique.html` | `report/23127027_AI_Critique.pdf` |

The candidate files retain the pre-approval draft, while the final critique is
generated only from the unchanged human-approved substantive text. The report
and audit PDFs must be regenerated after later video/grade/audit metadata is
added. No PDF conversion changes measurements or fills missing evidence.
