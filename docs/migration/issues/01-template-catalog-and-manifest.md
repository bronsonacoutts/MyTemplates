# Issue 01: Create the template catalogue and manifest schema

## Goal

Add a machine-readable catalogue so the library can describe what exists, who it is for, and when to use it.

## Deliverables

- `catalog/templates.json`
- manifest schema or validation rules
- `catalog/decision-tree.md`
- `catalog/roadmap.md`

## Acceptance criteria

- each template or pack has an ID, type, audience, maturity, and stack
- there is a documented decision tree for choosing a template versus a pack
- manifests can be validated in CI or via script

## Prompt for Codex

```text
You are working in the `MyTemplates` repository. Implement the template catalogue and manifest foundation described in the strategy docs.

Model workflow:
- First pass: run this prompt with `GPT-5.1-Codex-Max`.
- Review pass: after the first pass is complete, run `GPT-5.3-Codex` either on this issue individually or as part of an overall cross-issue review.

First-pass operating rules:
1. Start with a short implementation plan listing target files, intended edits, and any open decisions.
2. Keep scope tight to files directly needed for this issue. Do not do unrelated cleanup or repo-wide polish.
3. If the repo evidence is not strong enough to support a default, leave an explicit maintainer decision instead of inventing one.

Review-pass focus for `GPT-5.3-Codex`:
- check for overlap, contradictions, or weak differentiation against adjacent templates/issues
- check consistency with `docs/TEMPLATE_LIBRARY_STRATEGY.md`, governance docs, catalogue/roadmap entries, and existing terminology
- apply minimal corrective edits or produce a precise file-by-file change list if a broader review is being run separately

Read first:
- `docs/TEMPLATE_LIBRARY_STRATEGY.md`
- `README.md`
- existing docs under `docs/` that describe templates, examples, and governance

Objective:
Create a machine-readable catalogue and supporting docs so this repo can act as the source of truth for template and pack metadata.

Required work:
1. Add a `catalog/` directory if it does not already exist.
2. Create a catalogue file that lists current templates/packs with stable IDs and metadata fields such as type, audience, maturity, stack, and status.
3. Add a documented manifest schema or validation contract.
4. Add a decision-tree doc explaining when to use a template repo versus a shared pack.
5. Add a roadmap doc that maps catalogue entries to the migration plan.
6. If appropriate, add or update a validation script reference for the manifest format.

Constraints:
- Keep the first implementation intentionally small and maintainable.
- Prefer JSON plus human-readable markdown documentation.
- Do not claim a template exists unless it is either present in the repo or explicitly marked planned.

Deliverables:
- catalogue files and docs
- optional validation script or script stub if it materially improves correctness
- README or docs links if discoverability would otherwise be poor

Validation:
- run the repo formatting/linting checks relevant to changed files
- verify catalogue entries match the current repository contents and strategy terminology

Final output expectation:
Summarize the new catalogue shape, list validation commands, and call out any fields that may need maintainer refinement later. Also list changed files and any open maintainer decisions left unresolved after the first pass.
```
