# Template Or Pack Decision Tree

Use this decision tree when deciding whether a new deliverable belongs in a dedicated template repo or should stay as a shared pack inside `MyTemplates`.

## Quick rule

Choose a **template** when the consumer needs a new repo shape or a new delivery story.

Choose a **pack** when the consumer already has a repo and mainly needs reusable governance, docs, or automation assets layered on top.

## Decision path

1. Are you creating a new repository starter with its own README, setup path, CI/CD flow, and runtime guidance?
   - If yes, choose a **template**.
   - If no, continue.
2. Is the main goal to retrofit an existing repo with shared governance, docs, release, or testing assets?
   - If yes, choose a **pack**.
   - If no, continue.
3. Does the candidate differ from an existing template in at least three of these areas?
   - runtime or toolchain
   - CI/CD workflow
   - permissions or secrets model
   - onboarding path
   - directory structure
   - primary audience
   - governance surface
   - If yes, choose a **template**.
   - If no, continue.
4. Can the value be delivered by syncing a focused subset of assets into multiple downstream repos?
   - If yes, choose a **pack**.
   - If no, choose a **template**.

## Practical examples

| Need                                                                               | Choose   | Why                                                                        |
| ---------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------- |
| A starter for interactive Vite SPAs with tests and app-focused docs                | Template | It has a distinct runtime, onboarding path, and CI surface.                |
| GitHub governance files for an existing repo that keeps its current runtime        | Pack     | The repo already exists and only needs shared controls layered in.         |
| A Power Platform ALM/governance starter that grows out of `commitship-ado-governance` | Template | The delivery story centers on ALM docs, release gates, and repo structure. |
| AI instruction defaults reused across every downstream repo                        | Pack     | The same files should be synced broadly without creating a new starter.    |

## Default when unsure

Start with a **pack** if the work can be consumed without replacing the target repo's runtime or directory layout.

Promote it to a **template** later if the pack grows into a distinct onboarding story or crosses the strategy's three-difference separation rule.
