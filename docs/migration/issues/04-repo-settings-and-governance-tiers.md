# Issue 04: Publish repo settings and governance tiers

## Goal

Define repository settings and governance expectations once, then reuse them across template repos.

## Deliverables

- repo settings checklist doc
- governance tier matrix for knowledge, template, and automation repos
- branch protection / ruleset guidance
- security baseline by repo type

## Acceptance criteria

- the docs clearly distinguish lightweight demo repos from higher-control operational repos
- required versus optional controls are explicit
- default GitHub settings are documented for every dedicated template repo

## Prompt for Codex

```text
You are working in the `MyTemplates` repository. Document repository settings and governance tiers for the template ecosystem.

Read first:
- `.github/branch-protection.md`
- `SECURITY.md`
- `CONTRIBUTING.md`
- `docs/TEMPLATE_LIBRARY_STRATEGY.md`

Objective:
Create clear documentation that tells maintainers which GitHub settings and governance controls apply to each class of template repo.

Required work:
1. Define governance tiers for lightweight knowledge repos, standard template repos, and higher-control automation repos.
2. Publish required versus optional settings for each tier.
3. Cover branch protection/rulesets, reviews, security scanning, dependency automation, and workflow permissions.
4. Keep the guidance realistic for solo-maintainer operation.
5. Link the new guidance from the appropriate hub docs.

Constraints:
- Align with the repository's existing governance posture.
- Avoid recommending settings that would deadlock a solo maintainer unless you document the caveat.

Validation:
- run formatting/lint checks relevant to docs changes
- verify the recommendations do not contradict existing branch-protection guidance without explanation

Final output expectation:
Summarize the tier model, note any differences from current docs, and highlight any manual GitHub settings the maintainer must apply outside the repo.
```
