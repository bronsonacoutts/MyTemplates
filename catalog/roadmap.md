# Template Catalogue Roadmap

This roadmap maps catalogue IDs to the migration plan so maintainers can see what is present now, what is planned next, and which backlog issue owns the work.

## Current seed

| ID                                   | Status  | Why it matters now                                                    | Backlog                                        |
| ------------------------------------ | ------- | --------------------------------------------------------------------- | ---------------------------------------------- |
| `template.commitship-ado-governance` | Present | Existing in-repo template and the seed for later ALM governance work. | `13-template-power-platform-alm-governance.md` |

## Phase 1: foundation

| ID                             | Status  | Migration outcome                                                                              | Backlog                                                |
| ------------------------------ | ------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `pack.github-governance`       | Present | GitHub governance files are now grouped under a dedicated pack inventory for future sync work. | `02-shared-packs.md`, `10-governance-retrofit-pack.md` |
| `pack.azure-devops-governance` | Present | Azure DevOps governance assets are now grouped around the current commitship implementation.   | `02-shared-packs.md`, `10-governance-retrofit-pack.md` |
| `pack.ai-agent-instructions`   | Present | Shared AI governance now has a dedicated pack boundary and canonical ownership notes.          | `02-shared-packs.md`, `03-agent-instructions-sync.md`  |
| `pack.docs-as-code`            | Present | Shared documentation standards and templates are now inventoried as a pack.                    | `02-shared-packs.md`                                   |
| `pack.release-management`      | Present | Release notes, process docs, and validation helpers are now inventoried as a pack.             | `02-shared-packs.md`                                   |
| `pack.testing-guardrails`      | Present | Test harness, config, and testing docs are now inventoried as a reusable pack.                 | `02-shared-packs.md`                                   |

## Phase 2: first-wave dedicated templates

| ID                                 | Status  | Migration outcome                                                        | Backlog                                 |
| ---------------------------------- | ------- | ------------------------------------------------------------------------ | --------------------------------------- |
| `template.power-platform-pcf`      | Planned | Dedicated PCF control starter with packaging, testing, and ALM guidance. | `05-template-power-platform-pcf.md`     |
| `template.power-platform-code-app` | Present | Dedicated Code App starter with environment and deployment guidance.     | `06-template-power-platform-codeapp.md` |
| `template.vite-web-app`            | Planned | Dedicated starter for interactive SPA work.                              | `07-template-vite-web-app.md`           |
| `template.vite-site`               | Planned | Dedicated starter for content, documentation, and marketing sites.       | `08-template-vite-site.md`              |

## Phase 3: automation and drift control

| Scope                             | Outcome                                                                                | Backlog                                                                            |
| --------------------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Catalogue and manifest validation | Keep `catalog/templates.json` and template manifests trustworthy in local runs and CI. | `01-template-catalog-and-manifest.md`, `14-sync-automation-and-drift-detection.md` |
| Pack sync and drift detection     | Make pack consumption repeatable across dedicated template repos.                      | `14-sync-automation-and-drift-detection.md`                                        |

## Phase 4: second-wave expansion

| ID                                       | Status  | Migration outcome                                                                                           | Backlog                                        |
| ---------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `pack.tailwind-ui`                       | Planned | Keep Tailwind as a pack-first candidate unless the packaging decision proves a dedicated repo is warranted. | `09-tailwind-packaging-decision.md`            |
| `template.power-automate-knowledge-site` | Planned | Lightweight knowledge-site starter for educational Power Automate content.                                  | `11-template-power-automate-knowledge-site.md` |
| `template.operations-automation`         | Planned | Higher-control starter for automation-heavy operational repositories.                                       | `12-template-home-assistant-automation.md`     |
| `template.power-platform-alm-governance` | Planned | Dedicated ALM and governance template grown from the current commitship seed.                               | `13-template-power-platform-alm-governance.md` |
