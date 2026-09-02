# Final Human Review Packet

Status: **THREE HUMAN INPUTS REMAIN**

All technical executions and content reviews are complete. CPT proposal, Agent
Skill, AI Critique, no-issue disposition, combined-video format, and hostname
compatibility are human-approved. Supply only the three items below; do not
re-run official scenarios.

## 1. Replace the hardware screenshot

The genuine JPEG currently at
`evidence/hardware/hardware-specs-hostname.jpg` shows correct hardware and
hostname but also exposes a device serial. It is intentionally untracked.

- Retake it with the serial hidden, or redact only the serial manually using
  Preview markup without generating other content.
- Keep visible `Phams-MacBook-Pro.local` and genuine MacBook Pro/M5/16 GB/macOS
  values.
- Overwrite the same JPEG path and reply:

```text
HARDWARE_REPLACED
```

## 2. Record and upload the approved combined video

- Record it with the student's own Vietnamese narration.
- Show genuine k6/results and Activity Monitor evidence in the same frame as
  required; demonstrate the submitted Skill; do not expose secrets.
- Upload as unlisted YouTube and verify the real URL opens.

Use `video/demo-plan.md`, `video/vietnamese-narration-outline.md`, and
`video/recording-checklist.md`.

Human response fields:

```text
YOUTUBE_URL=https://...
```

## 3. Supply the self-assessed grade

After reviewing the report and evidence, provide a three-digit grade:

```text
SELF_ASSESSED_GRADE=000..100
```

After these three inputs, Codex will perform only metadata substitution, final
HTML/PDF regeneration, validator rerun, exact ZIP creation/checksum, truthful
commit, and push to `origin`. Moodle upload remains the student's action.
