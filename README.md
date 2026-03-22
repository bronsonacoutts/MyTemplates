# MyTemplates

**Templates + automations that let you vibe-code confidently** —
fast feedback, consistent structure, safe merges, fewer regressions.

[![CI](https://github.com/bronsonacoutts/MyTemplates/actions/workflows/ci.yml/badge.svg)](https://github.com/bronsonacoutts/MyTemplates/actions/workflows/ci.yml)
[![CodeQL](https://github.com/bronsonacoutts/MyTemplates/actions/workflows/codeql.yml/badge.svg)](https://github.com/bronsonacoutts/MyTemplates/actions/workflows/codeql.yml)

---

## What this repo is

This is a **portfolio-grade project template** built around
_vibe coding_ — AI-assisted rapid development where templates,
guardrails, and automations reduce errors, enforce standards,
and speed up shipping.

Every file in this repo exists to answer one question:
**"How do I use AI coding tools (Copilot, ChatGPT, Claude)
without shipping broken code?"**

What you get:

- **Strict TypeScript** with zero-warning ESLint, Prettier formatting, and coverage gates.
- **No-network unit tests** that stop AI-generated code from calling real APIs.
- **Accessibility-first Playwright E2E tests** using ARIA locators, not brittle selectors.
- **CI that runs in minutes** — lint, type-check, test, markdown lint, secret scan, CodeQL.
- **Prompt templates** you can paste directly into Copilot or ChatGPT.
- **Guardrail checklists** for reviewing AI-generated code.
- **PR and issue templates** with an explicit "AI-assisted changes" section.

---

## How to use this with Copilot / ChatGPT

### Recommended workflow

1. **Pick a prompt.** Browse [vibe-coding/prompts/](vibe-coding/prompts/)
   and copy the one that matches your task.
2. **Paste into your AI tool.** Replace the placeholders with your
   specific task. The prompt already includes the repo's constraints
   (strict TS, no `any`, mock network calls, JSDoc required).
3. **Apply the output.** Copy the AI's response into your editor.
4. **Run `npm run validate`.** This single command runs lint +
   type-check + tests. If it passes, you're 90% safe.
5. **Walk the checklist.** Use the
   [AI change checklist](vibe-coding/guardrails/ai-change-checklist.md)
   to catch what automation can't.
6. **Open a PR.** The [PR template](.github/PULL_REQUEST_TEMPLATE.md)
   has an "AI-Assisted Changes" section — fill it in honestly.

### Example prompts to try

| Task             | Prompt file                                                                    | What it does                                            |
| ---------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------- |
| Add a new module | [add-feature.md](vibe-coding/prompts/add-feature.md)                           | Source + tests + JSDoc following repo conventions       |
| Fix a bug        | [bugfix.md](vibe-coding/prompts/bugfix.md)                                     | Root-cause analysis + fix + regression test             |
| Refactor safely  | [repo-refactor.md](vibe-coding/prompts/repo-refactor.md)                       | Restructure without changing behaviour; tests must pass |
| Write docs       | [documentation.md](vibe-coding/prompts/documentation.md)                       | JSDoc, guides, ADRs in the correct directory            |
| Draft a PR       | [pr-description-changelog.md](vibe-coding/prompts/pr-description-changelog.md) | PR description + CHANGELOG entry from a diff            |

### How to keep changes safe

- **The guardrails are always on.** Husky pre-commit hooks run
  lint-staged; pre-push runs the full validation suite. CI re-checks
  everything.
- **Tests block network calls by default.** test/setup.ts replaces
  `fetch` and `XMLHttpRequest` with stubs that throw. AI-generated
  tests that forget to mock will fail immediately.
- **Secret scanning is automatic.** Gitleaks runs in CI on every push. No credentials slip through.
- **Branch and PR naming is enforced.** [scripts/validate-branch.js](scripts/validate-branch.js) and the [PR validation workflow](.github/workflows/pr-validation.yml) block non-conforming names.

---

## Guardrails

Automations that make vibe coding safe without slowing you down.

| Guardrail                    | Where                                                                                                   | What it prevents                                           |
| ---------------------------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| ESLint zero-warnings         | CI + pre-commit hook                                                                                    | `any` types, unused imports, console.log, formatting drift |
| TypeScript strict mode       | [tsconfig.json](tsconfig.json)                                                                          | Implicit any, unchecked index access, missing returns      |
| No-network test harness      | [test/setup.ts](test/setup.ts)                                                                          | AI-generated tests calling real APIs                       |
| Coverage gates (80/80/80/75) | [vitest.config.ts](vitest.config.ts)                                                                    | Shipping untested code                                     |
| Gitleaks secret scan         | [CI workflow](.github/workflows/ci.yml)                                                                 | Committed credentials                                      |
| CodeQL analysis              | [CodeQL workflow](.github/workflows/codeql.yml)                                                         | Security vulnerabilities in JS/TS                          |
| Branch name validation       | [validate-branch.js](scripts/validate-branch.js) + [PR validation](.github/workflows/pr-validation.yml) | Non-standard branch names                                  |
| PR title validation          | [PR validation](.github/workflows/pr-validation.yml)                                                    | Non-conventional commit titles                             |
| Markdown lint                | [.markdownlint.json](.markdownlint.json) + CI                                                           | Documentation formatting drift                             |
| Commitlint                   | [commitlint.config.js](commitlint.config.js) + commit-msg hook                                          | Non-conventional commit messages                           |

---

## Catalogue

Every template and automation in this repo, indexed by area.

Machine-readable template metadata now lives in [catalog/templates.json](catalog/templates.json), with the manifest contract in [catalog/template-manifest.schema.json](catalog/template-manifest.schema.json), the selection guide in [catalog/decision-tree.md](catalog/decision-tree.md), and migration mapping in [catalog/roadmap.md](catalog/roadmap.md).

Authoritative shared-pack inventories now live under [packs/](packs/README.md).

### Templates and docs

| Area       | Name                | Purpose for vibe coding                               | Link                                                                           |
| ---------- | ------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------ |
| Prompts    | Add Feature         | Prompt template for generating new modules with tests | [add-feature.md](vibe-coding/prompts/add-feature.md)                           |
| Prompts    | Bugfix              | Prompt for root-cause + fix + regression test         | [bugfix.md](vibe-coding/prompts/bugfix.md)                                     |
| Prompts    | Repo Refactor       | Prompt for safe restructuring                         | [repo-refactor.md](vibe-coding/prompts/repo-refactor.md)                       |
| Prompts    | Documentation       | Prompt for writing docs and JSDoc                     | [documentation.md](vibe-coding/prompts/documentation.md)                       |
| Prompts    | PR Description      | Prompt for drafting PRs and changelogs                | [pr-description-changelog.md](vibe-coding/prompts/pr-description-changelog.md) |
| Guardrails | AI Change Checklist | Pre-commit checklist for AI-generated code            | [ai-change-checklist.md](vibe-coding/guardrails/ai-change-checklist.md)        |
| Guardrails | Review Rubric       | Scoring rubric for reviewing AI PRs                   | [review-rubric.md](vibe-coding/guardrails/review-rubric.md)                    |
| Docs       | Vibe Coding Guide   | Golden-path workflow for AI-assisted development      | [VIBE_CODING.md](docs/VIBE_CODING.md)                                          |
| Docs       | Style Guide         | Conventions including AI-assisted edit policy         | [STYLE_GUIDE.md](docs/STYLE_GUIDE.md)                                          |
| Docs       | Usage Guide         | How to use and customise these templates              | [USAGE.md](docs/USAGE.md)                                                      |
| Docs       | Pattern Index       | Key patterns with when-to-use guidance                | [PATTERNS.md](docs/PATTERNS.md)                                                |
| Docs       | Testing Guide       | Full testing practices and tools reference            | [TESTING.md](docs/developer/TESTING.md)                                        |
| Docs       | Doc Standards       | Documentation formatting and structure rules          | [DOC_STANDARDS.md](docs/DOC_STANDARDS.md)                                      |
| Docs       | ADR Template        | Architecture Decision Record template                 | [ADR_TEMPLATE.md](docs/architecture/ADR_TEMPLATE.md)                           |

### Automations (CI / GitHub)

| Area   | Name              | Purpose for vibe coding                                        | Link                                                             |
| ------ | ----------------- | -------------------------------------------------------------- | ---------------------------------------------------------------- |
| CI     | Main CI           | Lint, test, build, markdown lint, gitleaks                     | [ci.yml](.github/workflows/ci.yml)                               |
| CI     | CodeQL            | Weekly + PR security analysis                                  | [codeql.yml](.github/workflows/codeql.yml)                       |
| CI     | PR Validation     | Enforce conventional PR titles and branch names                | [pr-validation.yml](.github/workflows/pr-validation.yml)         |
| CI     | Release           | Tag-triggered release with notes validation                    | [release.yml](.github/workflows/release.yml)                     |
| CI     | Sync Instructions | Keep agent-instructions.md and copilot-instructions.md in sync | [sync-instructions.yml](.github/workflows/sync-instructions.yml) |
| GitHub | PR Template       | Structured PR description with AI-assisted changes section     | [PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md)     |
| GitHub | Bug Report        | Issue template for bugs                                        | [bug_report.md](.github/ISSUE_TEMPLATE/bug_report.md)            |
| GitHub | Feature Request   | Issue template for features                                    | [feature_request.md](.github/ISSUE_TEMPLATE/feature_request.md)  |
| GitHub | Docs Issue        | Issue template for documentation                               | [documentation.md](.github/ISSUE_TEMPLATE/documentation.md)      |
| GitHub | CODEOWNERS        | Auto-request reviews                                           | [CODEOWNERS](.github/CODEOWNERS)                                 |
| GitHub | Dependabot        | Automated dependency updates                                   | [dependabot.yml](.github/dependabot.yml)                         |

### Code templates

| Area    | Name                    | Purpose for vibe coding                     | Link                                                                   |
| ------- | ----------------------- | ------------------------------------------- | ---------------------------------------------------------------------- |
| Testing | No-network harness      | Blocks real API calls in AI-generated tests | [test/setup.ts](test/setup.ts)                                         |
| Testing | Sample unit test        | Shows the expected test structure           | [test/sample.test.ts](test/sample.test.ts)                             |
| Testing | A11y E2E suite          | Accessibility-first Playwright tests        | [test/e2e/accessibility.spec.ts](test/e2e/accessibility.spec.ts)       |
| Testing | UI component E2E        | ARIA-locator-based component tests          | [test/e2e/ui-components.spec.ts](test/e2e/ui-components.spec.ts)       |
| Scripts | Branch validator        | Enforces branch naming conventions          | [scripts/validate-branch.js](scripts/validate-branch.js)               |
| Scripts | Release notes validator | Ensures release notes structure             | [scripts/validate-release-notes.js](scripts/validate-release-notes.js) |
| Scripts | Sendit                  | Interactive commit + push helper            | [scripts/sendit.js](scripts/sendit.js)                                 |
| Config  | Copilot instructions    | AI agent instructions for this repo         | [agent-instructions.md](agent-instructions.md)                         |

---

## Shared Packs

Reusable pack boundaries are now documented under [packs/](packs/README.md):

- [GitHub Governance Pack](packs/github-governance/README.md)
- [Azure DevOps Governance Pack](packs/azure-devops-governance/README.md)
- [AI Agent Instructions Pack](packs/ai-agent-instructions/README.md)
- [Docs-As-Code Pack](packs/docs-as-code/README.md)
- [Release Management Pack](packs/release-management/README.md)
- [Testing Guardrails Pack](packs/testing-guardrails/README.md)

---

## Quickstart (under 2 minutes)

```bash
# 1. Clone and install
git clone https://github.com/bronsonacoutts/MyTemplates.git
cd MyTemplates
npm install

# 2. Run the full validation suite
npm run validate

# 3. Explore the vibe coding assets
ls vibe-coding/prompts/
ls vibe-coding/guardrails/
```

## Examples

Concrete walkthroughs showing the guardrails in action:

- [ESLint catches unsafe AI output](vibe-coding/examples/lint-catch/) —
  AI generates code with `any` types and `console.log`;
  lint blocks the commit.
- [Test harness blocks network call](vibe-coding/examples/test-network-catch/) —
  AI writes a test that calls a real API;
  `test/setup.ts` catches it instantly.
- [No-network unit testing pattern](examples/no-network-unit-tests.md) — How to write isolated tests that never touch the network.
- [Accessibility smoke suite](examples/playwright-accessibility-smoke.md) — ARIA-first Playwright tests without a dev server.

---

## Development scripts

| Script                           | Description                                         |
| -------------------------------- | --------------------------------------------------- |
| `npm run validate`               | Lint + type-check + test (the one command you need) |
| `npm run validate:catalog`       | Validate template catalogue and manifest metadata   |
| `npm run lint`                   | ESLint with zero warnings                           |
| `npm run lint:fix`               | Auto-fix lint issues                                |
| `npm run lint:md`                | Markdown lint                                       |
| `npm run format`                 | Prettier format all files                           |
| `npm run format:check`           | Check formatting without writing                    |
| `npm test`                       | Unit tests                                          |
| `npm run test:unit`              | Unit tests with coverage                            |
| `npm run test:watch`             | Watch mode for TDD                                  |
| `npm run test:e2e`               | Full Playwright E2E suite                           |
| `npm run test:e2e:smoke`         | Smoke tests only (`@smoke` tag)                     |
| `npm run type-check`             | TypeScript strict type check                        |
| `npm run build`                  | Compile and build                                   |
| `npm run validate:branch`        | Check branch name                                   |
| `npm run validate:release-notes` | Check release notes format                          |
| `npm run sendit`                 | Interactive commit + push helper                    |

---

## Documentation

- [Vibe Coding Guide](docs/VIBE_CODING.md) — golden-path workflow for AI-assisted development
- [Usage Guide](docs/USAGE.md) — how to use and customise these templates
- [Style Guide](docs/STYLE_GUIDE.md) — coding conventions and AI-assisted edit policy
- [Template Repo Governance](docs/admin/TEMPLATE_REPO_GOVERNANCE.md) — governance tiers, repo settings, and manual GitHub controls for dedicated template repos
- [Pattern Index](docs/PATTERNS.md) — key patterns with when-to-use guidance
- [Testing Guide](docs/developer/TESTING.md) — full testing reference
- [Developer Setup](docs/developer/SETUP.md) — local environment setup
- [Release Process](docs/developer/RELEASE_PROCESS.md) — how releases work
- [Doc Standards](docs/DOC_STANDARDS.md) — documentation formatting rules

---

## Contributing

Contributions welcome — including AI-assisted ones. See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide, including our AI-assisted contribution policy.

Security reports: follow [SECURITY.md](SECURITY.md).
No secrets in code — gitleaks will fail CI if it finds any.

## Licence

MIT — see [LICENSE](LICENSE).
