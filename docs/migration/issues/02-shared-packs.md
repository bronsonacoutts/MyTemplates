# Issue 02: Extract shared governance and docs packs

## Goal

Turn reusable repo assets into packs that can be synced into downstream template repos.

## Deliverables

- `packs/github-governance/`
- `packs/azure-devops-governance/`
- `packs/ai-agent-instructions/`
- `packs/docs-as-code/`
- `packs/release-management/`
- `packs/testing-guardrails/`

## Acceptance criteria

- each pack has a README and inventory of included files
- each pack declares source-of-truth ownership
- shared files are removed from ad hoc duplication paths where practical

## Prompt for Codex

```text
You are working in the `MyTemplates` repository. Extract reusable governance and documentation assets into shared packs.

Read first:
- `docs/TEMPLATE_LIBRARY_STRATEGY.md`
- `agent-instructions.md`
- `.github/` assets
- `docs/` standards and developer docs

Objective:
Create a `packs/` structure that groups reusable assets by concern so downstream template repos can sync them predictably.

Required work:
1. Create the pack directories defined by the strategy, or a justified subset if some are better deferred.
2. For each pack, add a README that states purpose, intended consumers, included assets, and source-of-truth rules.
3. Inventory which existing files in this repo belong to each pack.
4. Avoid destructive moves unless the new structure remains easy to navigate and the docs stay accurate.
5. Update any hub documentation needed to explain how packs will be used.

Constraints:
- Prefer additive, low-risk structure over large file relocations unless clearly worthwhile.
- Keep naming consistent with the strategy.
- Make it obvious which files are canonical versus mirrored or synced.

Validation:
- run formatting/lint checks for changed files
- verify every new pack has a README and inventory

Final output expectation:
List the packs created, what each contains, and any future extraction work left for follow-up issues.
```
