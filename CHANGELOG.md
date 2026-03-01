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

[Unreleased]: https://github.com/bronsonacoutts/MyTemplates/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/bronsonacoutts/MyTemplates/releases/tag/v1.0.0
