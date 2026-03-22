# Issue 06: Publish the Power Platform Code App template repo

## Goal

Create a dedicated template repository for Power Platform Code App projects.

## Deliverables

- repo scaffold
- environment and deployment guidance
- release/process docs
- governance baseline from shared packs

## Acceptance criteria

- the repo has a clear setup path for Code App work
- environment promotion and deployment responsibilities are documented
- template metadata is added to the hub catalogue

## Prompt for Codex

```text
You are working in the `MyTemplates` repository. Prepare the dedicated Power Platform Code App template definition and hub-side support assets.

Read first:
- `docs/TEMPLATE_LIBRARY_STRATEGY.md`
- current governance/docs standards in this repo
- any Power Platform-related templates or docs already present

Objective:
Define the future Code App template repo clearly enough that it can be created with minimal ambiguity.

Required work:
1. Document the Code App template scope, audience, and main use cases.
2. Specify required docs, repo structure, governance packs, and deployment/environment guidance.
3. Add catalogue/roadmap metadata or supporting docs in this hub repo.
4. Distinguish the Code App template from the PCF and ALM governance templates.

Constraints:
- Keep the scope focused on Code App delivery.
- Avoid drifting into generic web-app guidance that belongs to the Vite templates.

Validation:
- run formatting/lint checks relevant to changed files
- ensure naming and positioning remain consistent across strategy, catalogue, and issue docs

Final output expectation:
State what the dedicated Code App repo will include, how it differs from adjacent templates, and what remaining maintainer decisions exist.
```
