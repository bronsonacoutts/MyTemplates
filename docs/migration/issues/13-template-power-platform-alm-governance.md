# Issue 13: Publish the Power Platform ALM governance template repo

## Goal

Turn the current governance-oriented Power Platform work into a dedicated ALM/governance template.

## Deliverables

- repo scope and README
- environment strategy docs
- pipeline quality-gate guidance
- release governance assets

## Acceptance criteria

- the template is clearly distinct from the PCF and Code App templates
- ALM, release, and environment guidance are first-class docs
- it is listed in the hub catalogue with the right audience and maturity

## Prompt for Codex

```text
You are working in the `MyTemplates` repository. Prepare the dedicated Power Platform ALM/governance template definition and hub support assets.

Read first:
- `docs/TEMPLATE_LIBRARY_STRATEGY.md`
- `templates/commitship-ado-governance/`
- governance and release-process docs in this repo

Objective:
Define a dedicated Power Platform ALM/governance template that grows out of the current governance-focused work without overlapping too much with PCF or Code App templates.

Required work:
1. Document the template scope, audience, and differentiation from PCF and Code App templates.
2. Specify expected environment-strategy docs, pipeline quality gates, and release governance assets.
3. Add catalogue/roadmap references and any reusable pack dependencies.
4. Make the relationship to `commitship-ado-governance` explicit.

Constraints:
- Keep the focus on ALM/governance rather than application scaffolding.
- Preserve terminology already used in existing governance materials where practical.

Validation:
- run formatting/lint checks relevant to changed files
- verify the template definition is clearly distinct from adjacent Power Platform templates

Final output expectation:
Summarize the ALM/governance template definition, its differentiators, and the next implementation step for turning it into a dedicated repo.
```
