# Issue 10: Publish the governance retrofit pack

## Goal

Provide a reusable governance pack for existing repos that do not need a full starter template.

## Deliverables

- GitHub governance pack
- Azure DevOps governance pack
- docs for applying the pack to an existing repo
- sync/update guidance

## Acceptance criteria

- maintainers can adopt governance without replacing their runtime stack
- pack contents are clearly versioned and documented
- adoption steps are short and repeatable

## Prompt for Codex

```text
You are working in the `MyTemplates` repository. Define and package a governance retrofit offering for existing repositories.

Read first:
- `docs/TEMPLATE_LIBRARY_STRATEGY.md`
- existing governance assets under `.github/`, `CONTRIBUTING.md`, `SECURITY.md`, and `agent-instructions.md`

Objective:
Make it possible for a maintainer to adopt the governance and documentation guardrails from this repo without changing their runtime stack or app architecture.

Required work:
1. Define the scope of the governance retrofit pack(s).
2. Inventory which assets belong in GitHub-oriented versus Azure DevOps-oriented variants.
3. Add docs that explain how to apply the pack to an existing repo.
4. Document how the pack should be updated over time and how consumers should resync.

Constraints:
- Keep adoption practical for an existing repo with minimal disruption.
- Avoid coupling the governance pack to a specific application framework.

Validation:
- run formatting/lint checks relevant to changed files
- make sure adoption guidance is concise and ordered

Final output expectation:
Summarize what the retrofit pack contains, who it is for, and what a maintainer would do to adopt it.
```
