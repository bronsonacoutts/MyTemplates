# Issue 05: Publish the Power Platform PCF template repo

## Goal

Create a dedicated template repository for PCF controls.

## Deliverables

- repo scaffold
- setup and release docs
- PAC CLI and packaging guidance
- testing baseline
- governance baseline from shared packs

## Acceptance criteria

- the repo supports a clean PCF onboarding story
- packaging and ALM guidance are documented
- repo metadata and CI match the shared standards

## Prompt for Codex

```text
You are working in the `MyTemplates` repository. Prepare the PCF template-repo definition and any assets this hub repo should provide to support it.

Read first:
- `docs/TEMPLATE_LIBRARY_STRATEGY.md`
- any existing Power Platform materials in this repo, including `templates/commitship-ado-governance/`
- relevant README and docs standards files

Objective:
Define what the dedicated Power Platform PCF template repo must contain and add any hub-side assets, scaffolding docs, manifests, or pack references needed to make that repo launchable.

Required work:
1. Document the PCF template scope, audience, and non-goals.
2. Specify the expected repo structure, core docs, CI expectations, and shared-pack dependencies.
3. Cover setup, packaging, ALM, and testing guidance relevant to PCF work.
4. Add any catalogue or roadmap entries needed in this hub repo.
5. Prefer templates and docs that Codex could later use to scaffold the actual dedicated repo.

Constraints:
- Stay focused on PCF controls, not all Power Platform work.
- Do not assume frameworks or libraries unless documented as defaults or options.
- Keep hub-side deliverables useful even before the dedicated repo exists.

Validation:
- run formatting/lint checks relevant to changed files
- verify references are consistent with the strategy and existing terminology

Final output expectation:
Summarize the resulting PCF template definition, list any open decisions for the maintainer, and point to the files future repo creation work should use.
```
