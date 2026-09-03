# Interaction 044 — Human grade and split-package finalization

## Metadata

- AI tool: Codex CLI
- Interaction date/time: 2026-09-03 16:08:46 +0700
- Time zone: Asia/Ho_Chi_Minh
- Student: 23127027 — Phạm Ngọc Gia Bảo

## Actual human inputs

```text
SELF_ASSESSED_GRADE=096
```

The student then added:

```text
à có một quy định là file zip nó chỉ được 20mb thôi nếu file lonứ quá laf phải split ra á nha
```

and clarified:

```text
nộp nhiều file
```

## AI interpretation and action

- `096` is recorded as the student's own SelfAssessedGrade. It is no longer
  merely an AI proposal and is not represented as a lecturer-assigned grade.
- The 20 MB limit is treated as a human-supplied Moodle upload constraint.
- The required PDF basename remains
  `23127027_HW05_AI_Performance_096.zip`.
- The actual compressed package is below 20,000,000 bytes, so the conditional
  split is not required for this build. If a future regeneration exceeds the
  limit, standard `.zNN` companions will use 18 MiB segments and every part
  must be uploaded together.
- Codex may create, validate, checksum, commit, and push the artifacts to the
  student `origin`; it must not upload to Moodle or claim that submission
  occurred.

## Safety and authenticity boundaries

Packaging uses the tracked submission tree and excludes `.git`, the ignored
local assignment PDF, private credential files, disposable runtimes, and the
archive output itself. No performance result, screenshot, video, grade, or
submission event is fabricated.

## Files created/updated

- `README.md`
- `MANUAL-TODO.md`
- `docs/human-decisions.md`
- `docs/assignment-requirements.md`
- `report/23127027_HW05_Performance_Report.md`
- `reviews/self-assessment-recommendation.md`
- `reviews/FINAL-HUMAN-REVIEW.md`
- `reviews/HUMAN-REVIEW-PACKET.md`
- `submission/README-SPLIT-ARCHIVE.md`
- `tools/validate_submission.mjs`
- `git-commit-log.txt`
- `validation/submission-validation.md`
- `validation/submission-validation.json`
- `ai-audit/audit.md`
- this detailed interaction record

Generated HTML/PDF views and the final archive/checksum manifest are also
updated or created from the genuine tracked evidence. Validation completed
with 33 PASS, 0 FAIL, 1 manual Moodle action, and 1 NOT APPLICABLE. Exact file
size, SHA-256, commits, and push result are reported in the final Codex output;
Moodle remains pending.
