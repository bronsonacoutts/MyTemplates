# Issue 07: Publish the Vite web app template repo

## Goal

Create a dedicated repository for interactive Vite application work.

## Deliverables

- Vite + TypeScript starter
- lint, format, unit test, and E2E setup
- docs for local setup and release process
- governance baseline from shared packs

## Acceptance criteria

- the starter is positioned for SPA work
- runtime validation and API mocking extension points are documented
- the repo is listed in the catalogue with audience and maturity metadata

## Prompt for Codex

```text
You are working in the `MyTemplates` repository. Prepare the Vite web-app template definition and the hub-side assets needed to support it.

Read first:
- `docs/TEMPLATE_LIBRARY_STRATEGY.md`
- current TypeScript/Vite/test/guardrail patterns in this repo
- `README.md` and developer/test docs

Objective:
Define a dedicated Vite application template that is clearly distinct from the Vite site template and aligned with this repo's existing guardrails.

Required work:
1. Document the intended audience and use cases for the Vite web-app template.
2. Specify baseline tooling: TypeScript, linting, formatting, unit tests, and E2E tests.
3. Document extension points such as routing, runtime validation, and API mocking.
4. Add any catalogue, roadmap, or pack references needed in the hub repo.

Constraints:
- Keep it focused on interactive application work, not content-heavy sites.
- Reuse this repo's proven guardrails where appropriate instead of inventing a new standard.

Validation:
- run formatting/lint/tests relevant to changed files
- ensure the Vite app and Vite site definitions are not redundant or contradictory

Final output expectation:
Explain the template boundary, its default stack, and what future work is still needed before publishing a dedicated repo.
```
