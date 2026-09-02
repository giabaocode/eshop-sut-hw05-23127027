# Interaction 041 — Hardware replacement validation

## Metadata

- AI tool: Codex CLI
- Human input received: 2026-09-02 (Asia/Ho_Chi_Minh)
- Validation completed: 2026-09-02 21:12:51 +0700
- Human student: 23127027 — Phạm Ngọc Gia Bảo

## Actual human prompt

```text
minhf thay the anh khac roi a
```

The message states that the student replaced the earlier hardware image.

## Validation performed

Codex inspected the replacement file without editing it:

- Path: `evidence/hardware/hardware-specs-hostname.jpg`
- Format: genuine JPEG
- Dimensions: 1778×690 pixels
- Size: 100,497 bytes
- File modification time: 2026-09-02 21:08:02 +0700
- SHA-256: `957b15382a36fe3a1627996d2bdc374ac9a7bfd0c2a1ea9d4f940ea4dc6f6877`

Visual inspection found the real Terminal hostname output
`Phams-MacBook-Pro.local` beside the macOS hardware view showing MacBook Pro
14-inch, Apple M5, and 16 GB. No serial number or hardware UUID is visible.
The replacement therefore satisfies the required safe hardware/hostname visual
evidence. No AI image generation, redaction, or other image editing occurred.

## History and decision

The prior candidate remains truthfully documented as rejected because it
exposed a device serial. It was never committed. The human-created safe
replacement supersedes it at the evidence path. H-013 is now `DONE BY HUMAN`;
hostname compatibility was already confirmed by the student under H-022.

## Files affected

- `evidence/hardware/hardware-specs-hostname.jpg`
- `evidence/hardware/specs.md`
- `evidence/hardware/SCREENSHOT-TODO.md`
- `reviews/HUMAN-REVIEW-PACKET.md`
- `reviews/FINAL-HUMAN-REVIEW.md`
- `report/23127027_HW05_Performance_Report.md`
- `docs/assignment-requirements.md`
- `docs/human-decisions.md`
- `MANUAL-TODO.md`
- `README.md`
- `tools/validate_submission.mjs`
- `ai-audit/audit.md`

No hardware fact, image, student action, YouTube URL, or grade was fabricated.

## Resulting validation and generated views

After the evidence/status updates, the deterministic submission validator
reported 30 `PASS`, 0 `FAIL`, 4 `MANUAL VERIFICATION REQUIRED`, and 1
`NOT APPLICABLE`. The remaining manual checks are the real YouTube URL,
self-assessed grade, final ZIP, and Moodle upload. Codex regenerated the main
report and AI Audit HTML/PDF views from their tracked Markdown sources. No
scenario was re-run and no measured result changed.

## Commit and publication

After staged-file, secret-pattern, whitespace, and file-size checks, Codex
created truthful local commit `7d8b5db` (`docs: add validated hardware
evidence`). It then pushed only `main` to the student remote `origin`; actual
push output was `36abc6b..7d8b5db main -> main`. The configured `upstream`
official SUT remote was not pushed or modified.
