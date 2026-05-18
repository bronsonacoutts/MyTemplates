# Template Library Migration Tracker

This tracker is the maintainer view of the hub-and-spoke migration. It summarizes the phases from the strategy, records sequencing and dependencies, and shows the current disposition of every child issue exactly once.

## Status model

- `done`: finished and accepted in the hub repo
- `in progress`: active work underway now
- `blocked`: accepted, but waiting on another issue
- `future`: intentionally deferred to a later milestone
- `rejected`: closed by decision and not moving forward

## Phase summary

| Phase   | Intent                                             | Exit condition                                                                                                                 |
| ------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Phase 1 | Establish the hub foundation inside `MyTemplates`. | Catalogue, manifest contract, pack boundaries, governance tiers, and instruction-sharing rules are documented.                 |
| Phase 2 | Publish the first dedicated template families.     | The first-wave template definitions are clear enough to launch dedicated repos with shared governance dependencies identified. |
| Phase 3 | Automate reuse and drift control.                  | Pack sync and metadata validation are repeatable and documented for downstream repos.                                          |
| Phase 4 | Expand the library deliberately.                   | Second-wave families have either shipped, been folded into packs, or been explicitly deferred by a maintained decision.        |

## Authoritative boundaries

`MyTemplates` remains authoritative for:

- shared packs and the files they inventory
- template catalogue IDs, metadata, and manifest rules
- governance tiers, repo settings guidance, and sync workflows
- global AI-agent instruction policy and shared overrides model

Downstream template repos remain authoritative for:

- runtime-specific source code and scaffolding
- template-local README, setup, and deployment details
- small template-specific agent-instruction overrides
- release cadence and runtime-specific CI details that do not belong in shared packs

## Foundation

| Issue                                                                                | Status | Dependency notes                                                                          | Definition of done for this workstream                                                                           |
| ------------------------------------------------------------------------------------ | ------ | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| [01-template-catalog-and-manifest.md](01-template-catalog-and-manifest.md)           | `done` | Opens the metadata contract used by pack and sync work.                                   | Catalogue exists, manifest validation is runnable, and current versus planned entries are explicit.              |
| [02-shared-packs.md](02-shared-packs.md)                                             | `done` | Depends on issue 01 for stable IDs and authoritative metadata.                            | Each shared pack has a README, inventory, and source-of-truth ownership.                                         |
| [03-agent-instructions-sync.md](03-agent-instructions-sync.md)                       | `done` | Built on the extracted pack boundary and preserved the mirrored output workflow.          | Global instruction blocks, local override pattern, and downstream sync workflow are documented and maintainable. |
| [04-repo-settings-and-governance-tiers.md](04-repo-settings-and-governance-tiers.md) | `done` | Governance tier guidance is now published and available for downstream template planning. | Governance tiers, required controls, and solo-maintainer caveats are documented in the hub.                      |

## First-wave templates

<<<<<<< HEAD
| Issue | Status | Dependency notes | Definition of done for this workstream |
| ------------------------------------------------------------------------------ | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| [05-template-power-platform-pcf.md](05-template-power-platform-pcf.md) | `in progress` | Definition is documented in `docs/migration/templates/template-power-platform-pcf.md` and a scaffold exists in `bronsonacoutts/template-power-platform-pcf`, but hub metadata and downstream shared-pack alignment still need cleanup. | PCF template scope, docs, baseline CI, and shared-pack dependencies are publishable and aligned between the hub and the dedicated repo. |
| [06-template-power-platform-codeapp.md](06-template-power-platform-codeapp.md) | `future` | Can now build on completed catalogue, pack, and governance-tier foundations while staying distinct from issues 05 and 13. | Code App template scope, environment guidance, and governance dependencies are explicit. |
| [07-template-vite-web-app.md](07-template-vite-web-app.md) | `future` | Can now reference the shared baseline directly instead of waiting on foundation work. | Interactive app starter boundary and default stack are documented clearly. |
| [08-template-vite-site.md](08-template-vite-site.md) | `future` | Can now build on the completed foundation while staying clearly separate from issue 07. | Site-oriented starter boundary, publishing workflow, and shared dependencies are documented clearly. |
| [10-governance-retrofit-pack.md](10-governance-retrofit-pack.md) | `future` | Pack boundaries and governance tiers now exist; remaining work is adoption guidance and packaging polish. | GitHub and Azure DevOps retrofit adoption guidance is concise, versioned, and repeatable. |
=======
| Issue | Status | Dependency notes | Definition of done for this workstream |
| ------------------------------------------------------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [05-template-power-platform-pcf.md](05-template-power-platform-pcf.md) | `future` | Can now build on completed catalogue, pack, and governance-tier foundations. | PCF template scope, docs, baseline CI, and shared-pack dependencies are publishable. |
| [06-template-power-platform-codeapp.md](06-template-power-platform-codeapp.md) | `future` | Can now build on completed catalogue, pack, and governance-tier foundations while staying distinct from issues 05 and 13. | Code App template scope, environment guidance, and governance dependencies are explicit. |
| [07-template-vite-web-app.md](07-template-vite-web-app.md) | `future` | Can now reference the shared baseline directly instead of waiting on foundation work. | Interactive app starter boundary and default stack are documented clearly. |
| [08-template-vite-site.md](08-template-vite-site.md) | `done` | Can now build on the completed foundation while staying clearly separate from issue 07. | Site-oriented starter boundary, publishing workflow, and shared dependencies are documented clearly. |
| [10-governance-retrofit-pack.md](10-governance-retrofit-pack.md) | `future` | Pack boundaries and governance tiers now exist; remaining work is adoption guidance and packaging polish. | GitHub and Azure DevOps retrofit adoption guidance is concise, versioned, and repeatable. |

> > > > > > > 40f9932fc592cf4166876774ee419519c6774416

## Second-wave templates

| Issue                                                                                        | Status    | Dependency notes                                                                                                       | Definition of done for this workstream                                                                 |
| -------------------------------------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [09-tailwind-packaging-decision.md](09-tailwind-packaging-decision.md)                       | `blocked` | Wait for issues 07 and 08 so the Tailwind decision is made against clear Vite template boundaries.                     | Tailwind is explicitly assigned to a pack/variant path or a dedicated repo path.                       |
| [11-template-power-automate-knowledge-site.md](11-template-power-automate-knowledge-site.md) | `future`  | Can now build on the completed foundation; still benefits from the content-site boundary clarified in issue 08.        | Knowledge-site template scope, governance tier, and content workflow are documented clearly.           |
| [12-template-home-assistant-automation.md](12-template-home-assistant-automation.md)         | `future`  | Can now use the published higher-control governance tier as its baseline.                                              | Operations template scope, runbooks, secrets guidance, and stronger controls are explicit.             |
| [13-template-power-platform-alm-governance.md](13-template-power-platform-alm-governance.md) | `future`  | Can now build on the completed foundation and should reuse lessons from the existing `commitship-ado-governance` seed. | ALM governance template boundary, differentiators, and seed-to-template migration path are documented. |

## Deliberate expansion

| Issue                                                              | Status   | Dependency notes                                                                                                                                            | Definition of done for this workstream                                                                                               |
| ------------------------------------------------------------------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| [15-template-monorepo-version.md](15-template-monorepo-version.md) | `future` | Should follow the Vite app/site boundary work in issues 07 and 08 so the monorepo decision boundary stays clear and does not blur the single-repo starters. | Monorepo audience, workspace conventions, CI strategy, and decision boundary versus single-purpose templates are documented clearly. |

## Automation

| Issue                                                                                  | Status    | Dependency notes                                                                                                                             | Definition of done for this workstream                                               |
| -------------------------------------------------------------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [14-sync-automation-and-drift-detection.md](14-sync-automation-and-drift-detection.md) | `blocked` | Depends on issues 01, 02, and 03 because sync automation now has stable metadata, defined packs, and an instruction-sharing model to extend. | Maintainers can sync packs predictably and detect drift without hidden manual steps. |

## Maintainer sequencing notes

1. Finish issue 01 first so IDs, statuses, and manifest rules stop being implicit.
2. Reuse the published issue 04 governance tiers when defining each downstream repo scaffold.
3. Reuse the issue 03 instruction model when defining downstream repo scaffolds and sync automation.
4. Close the remaining issue 05 follow-up by aligning hub metadata and the published PCF repo with the shared instruction and manifest model.
5. Treat issues 06 through 08 and 10 as the next definition and publication milestone once issue 05 is stable.
6. Keep issue 09 as a decision gate before expanding frontend variants further.
7. Delay issue 15 until the single-purpose Vite template boundaries are documented clearly enough to compare against a monorepo starter.
8. Delay issue 14 until at least one downstream repo consumes the shared pack and instruction model cleanly enough to automate without hidden manual steps.

## Migration done when

- Every child issue in `docs/migration/issues/` is `done`, `rejected`, or intentionally held in a named future milestone with an updated status here.
- The hub repo states which catalogue metadata, packs, governance docs, and sync workflows are authoritative in `MyTemplates`.
- Every dedicated template family has a clear destination: published as a repo, retained as a pack, or rejected with rationale.
- Downstream template repos can tell which assets sync from the hub versus which assets they own locally.
