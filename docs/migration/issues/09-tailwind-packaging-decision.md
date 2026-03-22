# Issue 09: Decide the Tailwind packaging strategy

## Goal

Decide whether Tailwind should be a separate dedicated template repo or a variant/pack layered onto Vite templates.

## Deliverables

- decision record
- chosen implementation path
- update to catalogue and roadmap

## Acceptance criteria

- the decision uses the three-or-more separation rule from the strategy
- if separate, a new repo scope is defined
- if shared, the pack/variant integration path is documented

## Prompt for Codex

```text
You are working in the `MyTemplates` repository. Make and document the Tailwind packaging decision for the template ecosystem.

Read first:
- `docs/TEMPLATE_LIBRARY_STRATEGY.md`
- any existing UI/style guidance in this repo
- the Vite template definitions if they exist

Objective:
Decide whether Tailwind should become its own dedicated template repo or remain a variant/pack layered onto the Vite families.

Required work:
1. Evaluate the decision using the strategy's separation rule.
2. Document the rationale, tradeoffs, and chosen path.
3. Update roadmap/catalogue/backlog docs as needed to reflect the decision.
4. If the answer is "variant/pack", explain exactly where it will live and how it will be consumed.
5. If the answer is "dedicated repo", define the scope and why it is sufficiently distinct.

Constraints:
- Prefer the simpler structure unless the repository evidence strongly supports separation.
- Keep the decision easy for future contributors to understand.

Validation:
- run formatting/lint checks relevant to changed files
- ensure any dependent docs now reflect the chosen path consistently

Final output expectation:
State the decision, summarize the reasoning, and note any follow-up implementation work that should happen next.
```
