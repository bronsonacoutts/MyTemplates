# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Nothing yet.

### Changed
- Nothing yet.

### Deprecated
- Nothing yet.

### Removed
- Nothing yet.

### Fixed
- Nothing yet.

### Security
- Nothing yet.

---

## [0.2.0] - 2026-06-14 (Vibe coding portfolio refresh)

### Added
- [vibe-coding/](vibe-coding/) folder with prompt templates, guardrails, and example walkthroughs.
- Five prompt templates: add-feature, bugfix, repo-refactor, documentation, pr-description-changelog.
- AI change checklist ([vibe-coding/guardrails/ai-change-checklist.md](vibe-coding/guardrails/ai-change-checklist.md)) for pre-commit review of AI-generated code.
- AI code review rubric ([vibe-coding/guardrails/review-rubric.md](vibe-coding/guardrails/review-rubric.md)) with Pass/Flag/Fail scoring.
- [docs/VIBE_CODING.md](docs/VIBE_CODING.md) golden-path workflow for AI-assisted development.
- [.github/dependabot.yml](.github/dependabot.yml) for automated npm and GitHub Actions dependency updates.
- Two new end-to-end examples: [examples/vibe-safe-change-1/](examples/vibe-safe-change-1/) and [examples/vibe-safe-change-2/](examples/vibe-safe-change-2/).
- AI-Assisted Changes section in [PR template](.github/PULL_REQUEST_TEMPLATE.md).
- AI-assisted contribution policy in [CONTRIBUTING.md](CONTRIBUTING.md).
- AI-assisted edit policy in [docs/STYLE_GUIDE.md](docs/STYLE_GUIDE.md).
- Vibe coding quick start and AI tool guidance in [docs/USAGE.md](docs/USAGE.md).

### Changed
- README rewritten around vibe coding enablement with full catalogue, guardrails table, flagship packs, and quickstart.
- CONTRIBUTING.md updated with AI-assisted PR rules and recommended workflow.

### Fixed
- Removed duplicate content in CHANGELOG.md.

---

## [0.1.0] - 2026-03-02 (Portfolio refresh)

### Added
- Repository catalogue and safety guidance in [README](README.md).
- Usage path, style guide, and pattern index in [docs/USAGE.md](docs/USAGE.md), [docs/STYLE_GUIDE.md](docs/STYLE_GUIDE.md), and [docs/PATTERNS.md](docs/PATTERNS.md).
- Runnable examples in [examples/no-network-unit-tests.md](examples/no-network-unit-tests.md) and [examples/playwright-accessibility-smoke.md](examples/playwright-accessibility-smoke.md).
- Markdown linting config [.markdownlint.json](.markdownlint.json) and [.editorconfig](.editorconfig).
- CI enhancements: markdown lint and gitleaks secret scan in [.github/workflows/ci.yml](.github/workflows/ci.yml).

### Changed
- README tone and quickstart to emphasise portfolio-grade patterns and safety.
- Added `lint:md` script for local markdown hygiene in [package.json](package.json).

### Fixed
- Prevented accidental markdown drift by codifying line-length expectations.

---

## [1.0.0] - 2024-01-01

### Added
- Initial project template structure with TypeScript/Node.js scaffold.
- Comprehensive ESLint configuration with `@typescript-eslint` and Prettier integration.
- Vitest configuration with 80% coverage thresholds (lines, functions, statements) and 75% branch coverage.
- Playwright E2E testing setup with smoke test support.
- Husky git hooks: `pre-commit` (lint-staged), `commit-msg` (commitlint), `pre-push` (validate + type-check + test).
- Commitlint with Conventional Commits configuration.
- GitHub Actions workflows: CI, CodeQL, PR validation, release, and sync-instructions.
- Comprehensive GitHub issue templates: bug report, feature request, documentation issue.
- Pull request template with testing and documentation checklists.
- CODEOWNERS file.
- Branch name validation script (`scripts/validate-branch.js`).
- Release notes validation script (`scripts/validate-release-notes.js`).
- Instructions sync script (`scripts/sync-instructions.js`).
- `agent-instructions.md` and `.github/copilot-instructions.md` with comprehensive AI coding guidelines.
- `docs/` directory tree with templates for API, architecture, developer, user, troubleshooting, deployment, integration, migration, and reference documentation.
- `SECURITY.md` with vulnerability reporting process and severity SLAs.
- `CODE_OF_CONDUCT.md` based on Contributor Covenant 2.1.
- `MIT LICENSE`.
- `CHANGELOG.md` (this file).
- `RELEASE_NOTES.md`.
- `.github/branch-protection.md` with recommended branch protection settings.

[Unreleased]: https://github.com/bronsonacoutts/MyTemplates/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/bronsonacoutts/MyTemplates/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/bronsonacoutts/MyTemplates/releases/tag/v0.1.0
[1.0.0]: https://github.com/bronsonacoutts/MyTemplates/releases/tag/v1.0.0