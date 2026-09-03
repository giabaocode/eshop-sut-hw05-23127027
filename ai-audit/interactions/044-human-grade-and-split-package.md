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
- If the archive is larger than the limit, standard split-ZIP companions use
  `.z01`, `.z02`, and so on. An 18 MiB split size keeps each file below
  20,000,000 bytes.
- Every split part must be uploaded together. The final `.zip` segment cannot
  be extracted alone.
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

Generated HTML/PDF views and the final split archive/checksum manifest are also
updated or created from the genuine tracked evidence. Exact part names, sizes,
hashes, validation counts, commits, and push result are reported after the
operations complete; Moodle remains pending.
