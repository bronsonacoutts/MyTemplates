# Template Library Strategy

## Purpose

This repository should evolve from a broad starter catalogue into the **control plane for a family of focused template repositories**.

The goal is to keep shared governance, documentation standards, and agent instructions in one place while publishing **dedicated template repos** for the delivery shapes you use repeatedly.

## What this recommendation is based on

### Patterns in this repository

`MyTemplates` already behaves more like a template platform than a single starter:

- shared governance docs and repo health files
- AI-agent and Copilot instruction files
- reusable prompts, guardrails, and examples
- GitHub workflows, branch-protection guidance, and release-process documentation
- an existing domain-specific template in `templates/commitship-ado-governance/`

### Patterns visible in your public repos

The public repos I could inspect point to a repeated working style:

- **`Power-Platform_Project-Template`**: docs-first Power Platform template with governance and delivery structure
- **`ha-git-sync`**: operationally safe template with strong runbooks and explicit security posture
- **`MSApprovalsMastery`**: focused knowledge artifact for a specific Power Automate topic
- **`PozzoleMeole`**: no public repositories were visible during review

The pattern is consistent: your strongest repos are **opinionated, well documented, and centered on one delivery shape at a time**.

## Recommendation

Use a **hub-and-spoke model**.

### Hub: `MyTemplates`

Keep this repo as the source of truth for:

- shared governance packs
- shared agent-instruction packs
- docs-as-code packs
- testing and release guardrails
- repo settings guidance, including [template repo governance tiers](admin/TEMPLATE_REPO_GOVERNANCE.md)
- template catalogue and manifest schema
- migration guidance for downstream template repos

### Spokes: dedicated template repos

Create separate repositories when the work has a different runtime, onboarding story, CI/CD flow, or governance surface.

## Recommended dedicated template repos

### First wave

1. **Power Platform PCF template**
   - PCF control development, packaging, docs, and ALM guidance
2. **Power Platform Code App template**
   - custom app delivery, environment guidance, and deployment flow
3. **Vite web app template**
   - interactive SPA starter with TypeScript, tests, and guardrails
4. **Vite site template**
   - documentation/marketing/content-site starter
5. **Governance retrofit pack**
   - GitHub/Azure DevOps governance assets for existing repos

### Second wave

1. **Tailwind UI variant or pack**
   - likely a Vite variant unless it grows into a distinct onboarding story
2. **Power Automate knowledge-site template**
   - for explainers and educational micro-sites like `MSApprovalsMastery`
3. **Home Assistant / operations automation template**
   - for secure automation-heavy repos like `ha-git-sync`
4. **Power Platform ALM governance template**
   - likely the natural expansion path for `commitship-ado-governance`

## Definitive target repo set beyond `MyTemplates`

The resulting repo estate beyond this hub should be the following **dedicated repositories**:

1. **`template-power-platform-pcf`**
   - dedicated repo for PCF controls, packaging, docs, and ALM guidance
2. **`template-power-platform-codeapp`**
   - dedicated repo for Power Platform code-app delivery and environment promotion guidance
3. **`template-vite-web-app`**
   - dedicated repo for interactive TypeScript SPA delivery
4. **`template-vite-site`**
   - dedicated repo for content, docs, and marketing-style sites
5. **`template-power-automate-knowledge-site`**
   - dedicated repo for focused Power Automate explainers and educational sites
6. **`template-home-assistant-automation`**
   - dedicated repo for Home Assistant and operations-heavy automation projects
7. **`template-power-platform-alm-governance`**
   - dedicated repo for ADO and Power Platform governance patterns built out from `commitship-ado-governance`

The following should **not** become separate repos at this stage:

- **Tailwind variant/pack**
  - keep this as a variant layered onto the Vite template family unless it later proves to have its own runtime, onboarding, and CI/CD surface
- **Governance retrofit pack**
  - keep this as shared packs inside `MyTemplates` so existing repos can adopt governance without pulling a full starter template

This gives the platform a definitive shape of **1 hub repo + 7 dedicated template repos**.

## Curation rule

Give something its own repo only when at least **three** of the following are true:

- it has a distinct runtime or toolchain
- it needs its own CI/CD workflow
- it needs different permissions or secrets handling
- it needs a different README and onboarding path
- it needs a different directory structure
- it targets a different audience
- combining it with another starter would create confusion

Otherwise, keep it as a **shared pack** in this repo.

## Proposed hub structure

```text
MyTemplates/
├── catalog/
│   ├── templates.json
│   ├── decision-tree.md
│   └── roadmap.md
├── packs/
│   ├── github-governance/
│   ├── azure-devops-governance/
│   ├── ai-agent-instructions/
│   ├── docs-as-code/
│   ├── release-management/
│   └── testing-guardrails/
├── templates/
│   └── commitship-ado-governance/
├── docs/
│   ├── migration/
│   ├── governance/
│   └── repo-settings/
└── scripts/
    ├── sync-pack.js
    ├── scaffold-template-manifest.js
    └── validate-template-metadata.js
```

## Required baseline for every dedicated template repo

Each dedicated template repo should ship with:

- `README.md`
- `agent-instructions.md`
- machine-readable template manifest
- `CONTRIBUTING.md`
- `SECURITY.md`
- `CHANGELOG.md`
- `RELEASE_NOTES.md`
- `docs/developer/SETUP.md`
- `docs/developer/RELEASE_PROCESS.md`
- ADR or decisions folder
- GitHub workflows, CODEOWNERS, and Dependabot config

## Agent-instructions approach

Keep these **shared** and sync them outward:

- instruction priority and prompt-injection defense
- branching and commit conventions
- baseline testing requirements
- baseline documentation requirements
- security handling expectations

Allow each template repo to add a **small override section** for:

- toolchain commands
- approved dependencies
- file placement rules
- deployment caveats
- template-specific anti-patterns

## Governance and repo settings to standardize

The authoritative tier model and settings checklist for dedicated template repos now live in [docs/admin/TEMPLATE_REPO_GOVERNANCE.md](admin/TEMPLATE_REPO_GOVERNANCE.md).

Apply the same baseline defaults across dedicated template repos:

- `main` as the default branch
- PR-required branch protection or rulesets
- required status checks
- conversation resolution before merge
- force-push and deletion protections
- Dependabot alerts and security updates enabled
- secret scanning / push protection where available
- least-privilege GitHub Actions permissions
- consistent topics and repository descriptions

Use governance tiers so smaller knowledge/demo repos stay lightweight while automation/infrastructure templates carry stronger controls.

## Library recommendations by template family

- **PCF**: TypeScript, packaging scripts, PAC CLI guidance, ALM docs
- **Code App**: TypeScript, deployment guidance, environment promotion strategy
- **Vite app**: TypeScript, ESLint, Prettier, Vitest, Playwright, optional `zod`/`msw`
- **Vite site**: markdown/content flow, link checking, accessibility checks, SEO defaults
- **Tailwind**: Tailwind CSS, design tokens, optional component primitives
- **Operations template**: shell/yaml linting, examples, secrets docs, runbooks

## Execution roadmap

### Phase 1: turn `MyTemplates` into the hub

- add a template catalogue
- add a template manifest schema
- extract shared packs
- document repo settings and governance tiers

### Phase 2: launch the first dedicated template repos

- Power Platform PCF template
- Vite web app template
- Vite site template
- Power Platform Code App template
- governance retrofit pack

### Phase 3: automate reuse

- sync shared docs and instructions outward
- validate manifests
- detect drift in synced assets
- generate catalogue pages from manifests

### Phase 4: expand the library

- Tailwind variant/pack
- Power Automate knowledge-site template
- Home Assistant / operations template
- Power Platform ALM governance template

## Issue backlog

All proposed changes from this strategy have been broken out into issue-ready markdown files under `docs/migration/issues/` so the work can be tracked and executed incrementally.
