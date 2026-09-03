# Interaction 042 — Final video recording runbook

## Metadata

- AI tool: Codex CLI
- Date/time completed: 2026-09-03 10:51:15 +0700
- Human student: 23127027 — Phạm Ngọc Gia Bảo
- Execution effect: documentation and read-only validation only; no SUT start,
  account provisioning, k6 execution, evidence mutation, video, or URL creation

## Actual human prompt

````text
I need you to create the FINAL step-by-step video recording runbook for my
HCMUS HW05 Performance Testing submission.

The runbook must be so explicit that I can keep it open while recording and
simply follow it line by line.

============================================================
AUTHORITATIVE CONTEXT
============================================================

Student:
23127027 — Phạm Ngọc Gia Bảo

Repository:
eshop-sut-hw05-23127027

OS:
macOS

Performance tool:
k6 v2.2.0

Selected workflow:
WF-03 — Purchase followed by customer cancellation

The official Load, Stress, Spike, and Endurance executions have already been
completed.

DO NOT rerun official performance tests for the video unless the PDF
explicitly requires a live rerun.

The video should primarily PRESENT and EXPLAIN genuine existing evidence.

Required language:
Vietnamese narration by the HUMAN student.

Target duration:
approximately 8–10 minutes.

Hard requirement:
at least 6 minutes.

Video decision:
ONE COMBINED VIDEO covering both Performance Testing and Agent Skill.

============================================================
CRITICAL RULE — USE REAL REPOSITORY STATE
============================================================

Before writing the runbook:

1. Read the official HW05 PDF.
2. Inspect the current repository.
3. Verify every file/path/command that will appear in the video.
4. Verify current actual result directories for:
   - Load
   - Stress
   - Spike
   - Endurance
5. Verify report filenames.
6. Verify screenshots exist.
7. Verify Agent Skill files and supported invocation/demo mechanism.
8. Verify report PDF exists or use Markdown if PDF is unavailable.

DO NOT invent:

- a command that does not work,
- a path that does not exist,
- an Agent Skill invocation syntax that Codex CLI does not support,
- performance numbers,
- screenshots,
- result files,
- GitHub Issues,
- YouTube URLs.

If an earlier planned command/path is stale, replace it with the ACTUAL
verified command/path.

============================================================
SAFETY
============================================================

The video must NEVER display:

- passwords
- credentials.local.csv
- JWTs
- Authorization headers
- secrets
- Serial Number
- hardware UUID
- private credential directories
- sensitive environment variables

Review every planned terminal command for possible secret leakage.

Do NOT use commands such as:

cat credentials.local.csv

or any command that may print passwords/tokens.

Do not modify or delete evidence while preparing the video.

============================================================
OUTPUT FILES
============================================================

Create:

video/FINAL-VIDEO-RUNBOOK.md
video/FINAL-VIDEO-CHEATSHEET.md

The RUNBOOK is detailed.

The CHEATSHEET is extremely concise and should fit on roughly 1–3 screens so
I can glance at it while recording.

============================================================
RUNBOOK FORMAT
============================================================

For EVERY video segment use EXACTLY this structure:

## [TIMESTAMP] Section name

### Goal
What I am demonstrating.

### Before speaking
Exact UI preparation.

### Terminal command
```bash
EXACT COMMAND I TYPE
````

The prompt ended at the open code block above as received by Codex CLI.

## Repository/PDF verification performed

- Read all nine pages of `2026.HW05.Performance Testing_En.pdf` using local
  macOS PDFKit text extraction. The PDF requires at least six minutes, an
  unlisted YouTube video, the tool and resource monitor in the same frame, and
  the student's own Vietnamese narration. It also requests a Skill demo video.
- Verified k6 reports `v2.2.0` on `darwin/arm64`; hostname is
  `Phams-MacBook-Pro.local`.
- Verified official result roots:
  - Load `20260902T092131+0700`
  - Stress `20260902T101857+0700`
  - Spike `20260902T104549+0700`
  - Endurance `20260902T143823+0700`
- Verified the Load aggregate HTML, Stress time-series HTML, Spike k6 dashboard
  HTML, Endurance time-series HTML, all native raw JSON files, and the main
  report PDF.
- Visually inspected the four genuine same-frame k6/Activity Monitor PNGs and
  the already approved safe hardware JPEG.
- Verified the three thin official wrappers call one shared `executeWf03()`.
- Verified the public CSV has exactly 20 rows and planned commands never open
  the private credential file or raw response bodies.
- Executed the packaged read-only Skill checker successfully; it returned
  `CHECKED` for the current Load, Stress, and Spike result roots.
- Official OpenAI documentation did not establish that this repository-local
  Skill is installed/discoverable by the current Codex CLI session. Therefore
  the video does not invent a `$hw05-k6-performance` invocation; it demonstrates
  the checked-in Skill and its verified packaged checker.

## AI output and files

Codex created a 9-minute-30-second line-by-line Vietnamese recording runbook
with identical per-segment headings, exact safe commands, evidence targets,
spoken narration, transition conditions, and a post-recording privacy check.
It also created a compact cheatsheet with the four measured result rows and
explicit prohibited overclaims.

- `video/FINAL-VIDEO-RUNBOOK.md`
- `video/FINAL-VIDEO-CHEATSHEET.md`
- `video/recording-checklist.md`
- `MANUAL-TODO.md`
- `ai-audit/audit.md`

H-018/H-019/H-020 remain human-only and `TODO`. No recording, narration,
YouTube URL, or completion was fabricated.
