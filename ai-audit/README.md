# AI Audit Report

This directory is the contemporaneous record of AI-assisted work for HW05-AI.
It supports the mandatory audit described in assignment §9 (PDF pages 6–7).

## Declared AI use

> I use AI tools for the following tasks: assignment traceability, repository
> and SUT discovery, performance-test design assistance, reproducible test
> scaffolding, result analysis, documentation, and submission validation.

- AI tool: Codex CLI
- Human owner and final reviewer: Phạm Ngọc Gia Bảo (`23127027`)
- Performance tool: k6 (not installed as of the initial audit on 2026-09-01)

## Files

- `audit.md`: chronological phase/interaction index and operational record.
- `interactions/`: per-interaction records preserving significant prompts and
  relevant AI output. The first separate record was created for Phase 1.

## Recording rules

For every significant interaction, record the tool, local date/time, phase,
human instruction, AI output summary, files created/modified, commands run,
assumptions, human-review status, and human-requested corrections. Entries are
written during the work rather than reconstructed at the end.

AI output and proposed parameters must be labelled as proposals. Only output
from an actual execution against the authorized local SUT may be labelled
empirically measured. Human approval, screenshots, video, narration, issue
publication, and submission approval are never inferred or fabricated.

Raw evidence must remain unchanged. Corrections to AI work are recorded as new
review/correction artifacts rather than silently rewriting original evidence.
