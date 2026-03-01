# AI Agent & Copilot Instructions

> **IMPORTANT:** This file (`agent-instructions.md`) and `.github/copilot-instructions.md` are mirrors.
> Run `npm run sync-instructions` (or `node scripts/sync-instructions.js`) to keep them in sync.
> Never edit one without updating the other.

---

## Project Overview

This repository is a **TypeScript/Node.js project template** providing comprehensive scaffolding with built-in quality guardrails. It is designed to be cloned as a starting point for production-grade applications, enforcing consistent standards across linting, testing, CI/CD, security, and documentation from day one.

**Goals:**
- Provide a battle-tested project structure with zero configuration drift.
- Enforce code quality automatically via pre-commit hooks, CI, and code review.
- Make doing the right thing the easy thing for every contributor.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript 5.x (strict mode) |
| Runtime | Node.js ≥ 18 (LTS) |
| Unit Testing | Vitest 1.x |
| E2E Testing | Playwright 1.x |
| Linting | ESLint 8.x with `@typescript-eslint` |
| Formatting | Prettier 3.x |
| Git Hooks | Husky 8.x + lint-staged |
| Commit Linting | Commitlint + Conventional Commits |
| Build | TypeScript compiler (`tsc`) + Vite |
| CI/CD | GitHub Actions |

---

## Branching Strategy

### Long-lived branches

| Branch | Purpose |
|---|---|
| `main` | Production-ready code. Protected. Requires PR + 1 approval + all checks. |
| `develop` | Integration branch. All feature work merges here first. |
| `staging` | Pre-production validation. Mirrors production environment. |

### Short-lived branch prefixes

All short-lived branches **must** follow the pattern `<prefix>/<short-description>` using lowercase kebab-case.

| Prefix | Use case | Example |
|---|---|---|
| `feature/` | New functionality | `feature/add-user-auth` |
| `fix/` | Bug fixes | `fix/login-redirect-loop` |
| `hotfix/` | Urgent production fixes | `hotfix/critical-null-deref` |
| `release/` | Release preparation | `release/v2.1.0` |
| `docs/` | Documentation only | `docs/update-api-reference` |
| `refactor/` | Code restructuring, no behavior change | `refactor/extract-auth-service` |
| `test/` | Test additions/fixes only | `test/add-payment-coverage` |
| `chore/` | Tooling, deps, config | `chore/bump-eslint` |
| `copilot/` | AI-generated branches (auto or manual) | `copilot/fix-typo-in-readme` |

**Rules:**
- Branch names are validated by `scripts/validate-branch.js` in the `pre-push` hook.
- Never commit directly to `main`, `develop`, or `staging`.
- Delete branches after merging.

---

## Commit Conventions

All commits **must** follow the [Conventional Commits](https://www.conventionalcommits.org/) specification and are enforced by `commitlint` in the `commit-msg` hook.

### Format

```
<type>(<optional scope>): <short summary>

[optional body]

[optional footer(s)]
```

### Allowed types

| Type | When to use |
|---|---|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation changes only |
| `style` | Formatting, whitespace (no logic change) |
| `refactor` | Code restructuring without behavior change |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `build` | Build system or external dependency changes |
| `ci` | CI/CD configuration changes |
| `chore` | Miscellaneous tasks, tooling |
| `revert` | Reverts a previous commit |

### Rules
- Summary line ≤ 72 characters, imperative mood ("add" not "adds" / "added").
- Scope is lowercase, single word or hyphenated (e.g., `auth`, `user-profile`).
- Breaking changes: add `!` after type/scope **and** include `BREAKING CHANGE:` footer.
- Reference issues in footer: `Closes #123`, `Fixes #456`.

### Examples

```
feat(auth): add OAuth2 JWT refresh token rotation

fix(api): handle null response from downstream service

docs: update branching strategy in agent-instructions

chore(deps): bump vitest from 1.0.4 to 1.1.0

feat!: remove legacy v1 API endpoints

BREAKING CHANGE: The /api/v1/* routes have been removed.
Migrate to /api/v2/* endpoints documented in docs/api/.
```

---

## Code Quality Standards

### ESLint
- **Zero warnings policy.** The `--max-warnings 0` flag is set in all lint scripts.
- All `.ts`, `.tsx`, `.js`, `.jsx` files are linted.
- The ESLint config extends `@typescript-eslint/recommended` and `prettier` (no conflicts).
- Fix auto-fixable issues with `npm run lint:fix`. Non-auto-fixable issues must be resolved manually.
- Never use `// eslint-disable` without a documented justification comment immediately above it.

### Prettier
- Prettier is the single source of truth for formatting. ESLint defers to Prettier for style rules.
- Run `npm run format` to auto-format all files.
- Run `npm run format:check` in CI to fail on unformatted files.
- Prettier config lives in `.prettierrc.json`. Do not override per-file.

### TypeScript
- **Strict mode is enabled** (`"strict": true` in `tsconfig.json`). This includes:
  - `strictNullChecks`
  - `noImplicitAny`
  - `strictFunctionTypes`
  - `noUncheckedIndexedAccess` (where enabled)
- Never use `any` — use `unknown` and narrow with type guards.
- Never use `// @ts-ignore` — fix the underlying type issue or use `// @ts-expect-error` with a comment.
- Export types explicitly. Avoid `export default` for better refactoring support.
- Use `interface` for object shapes, `type` for unions/intersections/utilities.

### General
- Functions should be small and do one thing.
- Prefer `const` over `let`; never use `var`.
- No unused variables or imports (enforced by ESLint).
- Avoid magic numbers — define named constants.
- All public APIs must have JSDoc comments.

---

## Testing Requirements

### Coverage Thresholds (enforced in CI)

| Metric | Threshold |
|---|---|
| Lines | 80% |
| Functions | 80% |
| Statements | 80% |
| Branches | 75% |

Coverage is measured by `@vitest/coverage-v8`. CI fails if any threshold is not met.

### Unit Tests (Vitest)

- Co-locate test files with source **or** place in `test/` mirroring `src/` structure.
- Test file naming: `*.test.ts` or `*.spec.ts`.
- **No real network calls in unit tests.** Mock all HTTP clients, database connections, and external services using `vi.mock()` or dependency injection.
- **No real filesystem access** in unit tests unless the module under test is explicitly a filesystem utility (use `tmp` directories and clean up).
- Each test should be independent and idempotent — no shared mutable state between tests.
- Use `describe` blocks to group related tests; use descriptive `it`/`test` names (behavior-driven: "should return 404 when user is not found").
- Use `beforeEach`/`afterEach` for setup/teardown, not `beforeAll`/`afterAll` unless truly necessary.
- Assert on outcomes, not implementation details. Avoid testing private methods directly.

### E2E Tests (Playwright)

- E2E tests live in `test/e2e/` and are named `*.spec.ts`.
- E2E tests run against a real (or fully integrated) environment.
- Tag smoke tests with `@smoke` for fast subset runs: `npm run test:e2e:smoke`.
- Use Playwright's accessibility locators (`getByRole`, `getByLabel`) over CSS selectors.
- Each E2E test must clean up its own test data.

### Running Tests

```bash
npm test                  # Unit tests (no coverage)
npm run test:unit         # Unit tests with coverage report
npm run test:watch        # Watch mode during development
npm run test:e2e          # Full E2E suite
npm run test:e2e:smoke    # Smoke tests only
```

---

## Documentation Standards

### JSDoc
- All exported functions, classes, interfaces, and types **must** have JSDoc comments.
- Include `@param`, `@returns`, and `@throws` tags where applicable.
- Include `@example` for non-obvious APIs.

```typescript
/**
 * Fetches a user by their unique identifier.
 *
 * @param id - The UUID of the user to retrieve.
 * @returns The user object if found.
 * @throws {NotFoundError} When no user exists with the given id.
 * @example
 * const user = await getUserById('550e8400-e29b-41d4-a716-446655440000');
 */
export async function getUserById(id: string): Promise<User> { ... }
```

### README Updates
- When adding a feature, update `README.md` if it affects setup, usage, or configuration.
- Keep the "Getting Started" section accurate and tested.

### Architecture Decision Records (ADRs)
- Use `docs/architecture/ADR_TEMPLATE.md` for any significant architectural decision.
- ADR files are named `ADR-NNNN-short-title.md` (e.g., `ADR-0001-use-vitest.md`).
- Once accepted, ADRs are immutable — supersede them with a new ADR instead of editing.

### docs/ Structure

```
docs/
├── api/            # API reference documentation
├── architecture/   # ADRs and architectural diagrams
├── developer/      # Developer guides (setup, testing, release)
├── user/           # End-user guides
├── troubleshooting/ # Common issues and solutions
├── deployment/     # Deployment and infrastructure docs
├── integration/    # Third-party integration guides
├── migration/      # Migration guides
└── reference/      # Quick reference material
```

---

## Security Rules

- **Never commit secrets, credentials, API keys, tokens, or passwords** to the repository.
- Use environment variables for all sensitive configuration. Document required variables in `docs/developer/ENV_SECRETS.md`.
- Use `.env.example` (committed) as a template; `.env` is always in `.gitignore`.
- Dependencies: run `npm audit` before merging PRs that add or update dependencies.
- Use `npm audit --audit-level=high` in CI to fail on high/critical vulnerabilities.
- Keep dependencies up to date. Use Dependabot (configured in `.github/dependabot.yml`).
- Validate and sanitize all external inputs — never trust user-supplied data.
- Use parameterized queries for all database operations. Never concatenate SQL.
- Apply the principle of least privilege to all service accounts and API tokens.
- Report vulnerabilities via `SECURITY.md` process, never via public issues.

---

## AI Code Generation Guidelines

### General Principles
- **Copilot is a first-class contributor.** Use GitHub Copilot for code generation, but treat all generated code as code you own and are responsible for.
- Review all AI-generated code before committing. Understand what the code does — don't commit code you can't explain.
- AI-generated branches should use the `copilot/` prefix.

### When generating code with AI assistance:
1. **Generate tests alongside code.** Never accept a code suggestion without also generating the corresponding unit tests.
2. **Validate types.** Ensure generated code uses proper TypeScript types — no `any`, no implicit types.
3. **Check for security issues.** Prompt the AI to review for common vulnerabilities (injection, XSS, insecure defaults).
4. **Run the full quality suite** before committing: `npm run validate` (lint + type-check + test).
5. **Don't blindly accept large diffs.** Break large AI-generated changes into reviewable chunks.
6. **Prefer explicit over clever.** AI-generated code can be overly clever. Prefer readable, explicit code.

### Copilot Instructions
- The `.github/copilot-instructions.md` file (this file's mirror) is read by GitHub Copilot to understand project conventions.
- Keep it updated whenever project conventions change.
- Run `npm run sync-instructions` after editing `agent-instructions.md` to sync both files.

---

## PR Process

### Opening a PR
- PR title **must** follow Conventional Commits format (validated by `pr-validation` workflow).
- Fill out the PR template completely. Empty sections signal an incomplete PR.
- Link to the issue being addressed in the PR description.
- Keep PRs focused — one logical change per PR. Large PRs will be requested to split.

### Requirements before merge
- [ ] All CI checks pass (lint, type-check, test with coverage, build).
- [ ] At least **1 approving review** from a codeowner.
- [ ] No unresolved review comments.
- [ ] Branch is up to date with the target branch.
- [ ] Coverage thresholds maintained (no regressions).
- [ ] Documentation updated if behavior changed.
- [ ] `CHANGELOG.md` updated for user-facing changes.

### Review Guidelines (for reviewers)
- Focus on correctness, security, and maintainability — not personal style preferences.
- Use "Request changes" only for blocking issues; use comments for suggestions.
- Approve when you would be comfortable shipping this code.
- Check that tests actually cover the changed behavior, not just increase coverage numbers.

---

## Scripts Reference

| Script | Description |
|---|---|
| `npm run lint` | Run ESLint (zero warnings) |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run format` | Format all files with Prettier |
| `npm run format:check` | Check formatting without writing |
| `npm test` | Run unit tests |
| `npm run test:unit` | Unit tests with coverage |
| `npm run test:e2e` | Run E2E tests |
| `npm run type-check` | TypeScript type check |
| `npm run build` | Compile and build |
| `npm run validate` | lint + type-check + test |
| `npm run validate:branch` | Validate current branch name |
| `npm run validate:release-notes` | Validate RELEASE_NOTES.md |
| `npm run sync-instructions` | Sync agent-instructions.md ↔ copilot-instructions.md |
| `npm run sendit` | Interactive commit + push helper |
