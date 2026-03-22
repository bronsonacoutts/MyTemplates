# Issue 00: Template library tracker

## Goal

Track the full migration from a single broad template repo to a hub-and-spoke template library.

## Scope

This tracker coordinates all issue drafts in `docs/migration/issues/`.

## Deliverables

- master checklist linked to all child workstreams
- status notes for sequencing and dependencies
- clear definition of done for the migration

## Acceptance criteria

- every child issue is either completed, explicitly rejected, or moved to a future milestone
- the hub repo clearly documents which assets are authoritative here versus downstream

## Prompt for Codex

```text
You are working in the `MyTemplates` repository. Execute the tracker work for the template-library migration.

Context to read first:
- `docs/TEMPLATE_LIBRARY_STRATEGY.md`
- `docs/migration/issues/README.md`
- every child issue file in `docs/migration/issues/`

Objective:
Create or update the migration tracker so a maintainer can see the overall plan, dependencies, sequencing, and status in one place.

Required work:
1. Summarize the migration phases from the strategy document.
2. Link every child issue and group them by foundation, first-wave templates, second-wave templates, and automation.
3. Add dependency notes where one issue clearly blocks another.
4. Add a lightweight status model (for example: todo / in progress / blocked / done).
5. Keep the tracker concise, readable, and easy to maintain.

Constraints:
- Stay within documentation and tracking scope only.
- Do not invent new template families unless the strategy has changed in this repo.
- Preserve the hub-and-spoke direction unless the repository docs now explicitly say otherwise.

Deliverables:
- updated tracker markdown
- any cross-links needed from the issue backlog index

Validation:
- run markdown formatting/checking used by the repo
- ensure every issue in `docs/migration/issues/` is represented exactly once in the tracker

Final output expectation:
Provide a short summary of tracker changes, list the commands you ran, and note any follow-up items the maintainer should decide manually.
```
