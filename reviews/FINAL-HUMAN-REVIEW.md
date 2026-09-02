# Final Human Review Packet

Status: **HUMAN ACTION REQUIRED**

All authorized technical executions and automatable draft deliverables are
complete. Supply only the attributable items below; do not re-run official
scenarios.

## 1. Hardware evidence and hostname

- Open **System Settings → General → About** or **System Information → Hardware**.
- Place a Terminal window beside it showing `hostname` output.
- Ensure the visible hostname is `Phams-MacBook-Pro.local` and hide serial/UUID
  if present.
- Save the genuine screenshot as:
  `evidence/hardware/hardware-specs-hostname.png`.
- Confirm whether this hostname matches/is compatible with the hostname used in
  the student's previous homework deployments.

Human response fields:

```text
HARDWARE_SCREENSHOT_SAVED=yes
HOSTNAME_COMPATIBLE=yes|no + explanation
```

## 2. Human reviews and decisions

Review these AI-generated artifacts:

- `proposal/continuous-performance-testing.md`
- `skills/hw05-k6-performance/SKILL.md`
- `reviews/ai-critique-draft.md` (278 words)
- `analysis/genuine-issue-determination.md`
- `report/23127027_HW05_Performance_Report.md`

Provide:

```text
CPT_PROPOSAL=approved|corrections
AGENT_SKILL=approved|corrections
AI_CRITIQUE=approved|replacement text/corrections
ISSUE_DISPOSITION=NOT_APPLICABLE if you agree no genuine SUT issue was confirmed
```

## 3. Real demonstration video

- Decide whether one combined video will demonstrate performance testing and the
  Agent Skill; the prepared plan recommends one combined 8–10 minute video.
- Record it with the student's own Vietnamese narration.
- Show genuine k6/results and Activity Monitor evidence in the same frame as
  required; demonstrate the submitted Skill; do not expose secrets.
- Upload as unlisted YouTube and verify the real URL opens.

Use `video/demo-plan.md`, `video/vietnamese-narration-outline.md`, and
`video/recording-checklist.md`.

Human response fields:

```text
VIDEO_DECISION=one combined video|separate videos
YOUTUBE_URL=https://...
```

## 4. Self-assessment

After reviewing the report and evidence, provide a three-digit grade:

```text
SELF_ASSESSED_GRADE=000..100
```

Codex will insert only the value supplied by the student, regenerate the final
Markdown/HTML/PDF artifacts, run validation, create the correctly named ZIP,
scan/commit/push to `origin` only, and then return the real checksum. Moodle
upload remains a final student action.
