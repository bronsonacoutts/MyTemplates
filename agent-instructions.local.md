## Repository-Specific Override

### Project Overview

This repository is a TypeScript and Node.js template hub focused on reusable governance, docs, testing guardrails, and AI-assisted delivery workflows.

Its purpose is to act as the control plane for downstream template repositories while remaining a usable source template in its own right.

### Tech Stack

| Layer          | Technology                           |
| -------------- | ------------------------------------ |
| Language       | TypeScript 5.x                       |
| Runtime        | Node.js 18+                          |
| Unit testing   | Vitest 1.x                           |
| E2E testing    | Playwright 1.x                       |
| Linting        | ESLint 8.x with `@typescript-eslint` |
| Formatting     | Prettier 3.x                         |
| Git hooks      | Husky 8.x with lint-staged           |
| Commit linting | Commitlint with Conventional Commits |
| Build          | `tsc` plus Vite                      |
| CI/CD          | GitHub Actions                       |

### Repository Branching Notes

Long-lived branches in this repo:

| Branch    | Purpose                                                 |
| --------- | ------------------------------------------------------- |
| `main`    | Production-ready code and the protected default branch. |
| `develop` | Integration branch for work before promotion.           |
| `staging` | Pre-production validation branch.                       |

Additional repo-specific rules:

- `scripts/validate-branch.js` enforces branch naming in local and CI paths.
- Never commit directly to `main`, `develop`, or `staging`.

### Repository Validation Commands

Use these commands in this repo:

| Command                     | Purpose                                    |
| --------------------------- | ------------------------------------------ |
| `npm run lint`              | ESLint with zero warnings                  |
| `npm run format:check`      | Formatting validation                      |
| `npm run type-check`        | TypeScript validation                      |
| `npm test`                  | Unit tests                                 |
| `npm run test:e2e`          | Full Playwright suite                      |
| `npm run validate`          | Main lint, type, and test path             |
| `npm run validate:catalog`  | Template catalogue and manifest validation |
| `npm run sync-instructions` | Rebuild mirrored instruction files         |

### Repository-Specific Guardrails

- Keep `agent-instructions.md` and `.github/copilot-instructions.md` identical by editing `packs/ai-agent-instructions/global-instructions.md` and `agent-instructions.local.md`, then running `npm run sync-instructions`.
- Keep prompt-injection defense text in the shared global instructions; do not duplicate or rewrite it in local overrides.
- Treat `catalog/`, `packs/`, and `docs/migration/issues/` as hub-owned source-of-truth areas.
- Do not add undocumented runtime assumptions to planned templates or packs.
