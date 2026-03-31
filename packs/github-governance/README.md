# GitHub Governance Pack

## Purpose

Reusable GitHub-native governance assets for repositories that need pull-request controls, issue intake, repository policy files, and baseline CI enforcement without changing their runtime stack.

## Intended Consumers

- GitHub repositories adopting governance retrofits
- dedicated template repos that need a shared GitHub baseline
- maintainers standardizing repo policy across multiple codebases

## Source Of Truth

This pack is documentation-first in v1. The canonical files remain in their current repository locations and are inventoried below.

The authoritative files for this pack live in:

- `.github/`
- `CODE_OF_CONDUCT.md`
- `CONTRIBUTING.md`
- `SECURITY.md`
- `commitlint.config.cjs`
- `scripts/validate-branch.js`

Files in other packs should not be copied into this pack's sync scope unless their owning pack declares that dependency explicitly.

## Inventory

| Path                                        | Role                  | Notes                                                                  |
| ------------------------------------------- | --------------------- | ---------------------------------------------------------------------- |
| `.github/CODEOWNERS`                        | Review ownership      | Canonical review ownership baseline.                                   |
| `.github/PULL_REQUEST_TEMPLATE.md`          | PR governance         | Shared PR structure with AI-assisted change disclosure.                |
| `.github/ISSUE_TEMPLATE/bug_report.md`      | Issue intake          | Bug reporting template.                                                |
| `.github/ISSUE_TEMPLATE/documentation.md`   | Issue intake          | Docs issue template.                                                   |
| `.github/ISSUE_TEMPLATE/feature_request.md` | Issue intake          | Feature request template.                                              |
| `.github/ISSUE_TEMPLATE/config.yml`         | Issue intake          | Issue template chooser settings.                                       |
| `.github/branch-protection.md`              | Ruleset guidance      | Manual GitHub settings reference.                                      |
| `.github/workflows/ci.yml`                  | CI baseline           | Sequenced lint, format, catalogue validation, and type-check workflow. |
| `.github/workflows/tests.yml`               | Test automation       | Sequenced unit-test workflow that runs after CI checks.                |
| `.github/workflows/codeql.yml`              | Security automation   | CodeQL analysis workflow.                                              |
| `.github/workflows/pr-validation.yml`       | PR governance         | Ready-for-review PR title and branch enforcement.                      |
| `.github/workflows/copilot-setup-steps.yml` | Repo automation       | Shared Copilot environment bootstrap steps.                            |
| `CODE_OF_CONDUCT.md`                        | Repo policy           | Community conduct baseline.                                            |
| `CONTRIBUTING.md`                           | Contribution policy   | Contributor workflow and expectations.                                 |
| `SECURITY.md`                               | Security policy       | Vulnerability reporting and handling.                                  |
| `.github/dependabot.yml`                    | Dependency automation | Dependency update policy for npm and GitHub Actions.                   |
| `commitlint.config.cjs`                     | Commit policy         | Conventional commit lint rules.                                        |
| `scripts/validate-branch.js`                | Branch policy         | Branch naming enforcement used locally and in CI.                      |

## Sync Notes

- Prefer syncing this pack into `.github/`, repo-policy files, and governance scripts as a cohesive unit.
- Decide up front whether the downstream repo wants the preferred local-first automation profile or the standard always-run cloud profile documented in `docs/developer/AUTOMATION_PROFILES.md`.
- Release automation belongs to the release-management pack, even when consumed through GitHub Actions.
