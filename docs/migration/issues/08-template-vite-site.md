# Issue 08: Publish the Vite site template repo

## Goal

Create a dedicated repository for content-heavy Vite sites.

## Deliverables

- Vite site starter
- docs/content guidance
- link checking and accessibility checks
- SEO defaults and deployment docs

## Acceptance criteria

- the template clearly targets documentation, marketing, or explainer sites
- the README distinguishes it from the Vite web app template
- content and publishing workflows are documented

## Prompt for Codex

```text
You are working in the `MyTemplates` repository. Prepare the Vite site template definition and any supporting hub assets.

Read first:
- `docs/TEMPLATE_LIBRARY_STRATEGY.md`
- docs standards and any content-focused materials in this repo
- the Vite web-app issue/definition if present

Objective:
Define a Vite-based site template for documentation, marketing, and explainer-style sites that is clearly separate from the interactive app template.

Required work:
1. Document target use cases and non-goals for the site template.
2. Specify recommended content workflow, accessibility checks, link validation, and SEO defaults.
3. Add any catalogue entries, roadmap notes, or pack references needed in the hub repo.
4. Make the distinction from the Vite web-app template explicit.

Constraints:
- Keep the template site-oriented rather than SPA-oriented.
- Favor documentation and publishing clarity over framework complexity.

Validation:
- run formatting/lint checks relevant to changed files
- ensure the scope is consistent with the strategy and backlog docs

Final output expectation:
Summarize the site template definition, call out the boundary with the Vite web-app template, and list any unresolved maintainer decisions.
```
