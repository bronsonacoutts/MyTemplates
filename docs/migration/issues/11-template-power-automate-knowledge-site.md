# Issue 11: Publish the Power Automate knowledge-site template repo

## Goal

Create a static-site template for educational or explainer artifacts like `MSApprovalsMastery`.

## Deliverables

- lightweight site starter
- docs for content organization and visual assets
- governance baseline appropriate for knowledge/demo repos

## Acceptance criteria

- the template is clearly positioned as a knowledge artifact, not an app starter
- docs explain how to add process walkthroughs, diagrams, and references
- governance stays lightweight but consistent

## Prompt for Codex

```text
You are working in the `MyTemplates` repository. Prepare the knowledge-site template definition for Power Automate and similar explainer content.

Read first:
- `docs/TEMPLATE_LIBRARY_STRATEGY.md`
- docs standards in this repo
- any materials related to content or explainer-style assets

Objective:
Define a lightweight template repo for educational or process-explainer sites, modeled on the kind of work represented by `MSApprovalsMastery`.

Required work:
1. Document the target audience, use cases, and non-goals.
2. Specify the expected docs/content structure, asset handling, and governance level.
3. Add any roadmap/catalogue entries needed in the hub repo.
4. Make it explicit that this is a knowledge artifact template rather than a product-app starter.

Constraints:
- Keep the governance lighter than for operational templates, while still consistent.
- Favor clarity for content authors over technical complexity.

Validation:
- run formatting/lint checks relevant to changed files
- ensure the template positioning remains distinct from the Vite site and Vite app families

Final output expectation:
Summarize the knowledge-site template definition, note its governance tier, and list any remaining decisions for the maintainer.
```
