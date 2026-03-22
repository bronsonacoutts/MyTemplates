# Issue 03: Standardize agent instructions and sync workflow

## Goal

Separate global AI governance from template-specific overrides and make reuse automatic.

## Deliverables

- shared agent-instructions pack
- template-level override pattern
- manifest fields for AI policy metadata
- sync workflow or script for downstream repos

## Acceptance criteria

- global instruction blocks are centralized
- downstream repos can add stack-specific sections without forking the whole file
- prompt-injection defenses remain mandatory across all templates

## Prompt for Codex

```text
You are working in the `MyTemplates` repository. Standardize how agent instructions are shared across template repos.

Read first:
- `agent-instructions.md`
- `.github/copilot-instructions.md`
- `scripts/sync-instructions.js`
- `docs/TEMPLATE_LIBRARY_STRATEGY.md`

Objective:
Define a shared/global instruction layer plus a template-specific override model, and document or automate how downstream repos should consume it.

Required work:
1. Identify the instruction blocks that should remain global across all templates.
2. Define the shape of template-specific overrides.
3. Update docs and, if appropriate, scripts/workflows to support syncing or generating these instruction files.
4. Preserve the current mirror relationship between agent instructions and Copilot instructions unless there is a better documented replacement.
5. Add any manifest metadata fields needed to describe AI policy requirements.

Constraints:
- Do not weaken prompt-injection protections.
- Keep the workflow maintainable for a solo maintainer.
- Prefer explicit documentation over hidden magic.

Validation:
- run formatting/lint/tests relevant to changed files
- verify mirrored instruction files still stay in sync if you modified the sync path

Final output expectation:
Explain the shared-versus-local instruction split, summarize any automation changes, and document how downstream template repos should consume the pattern.
```
