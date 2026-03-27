# Developer Setup Guide

> Get your local development environment up and running from scratch.

---

## Prerequisites

Ensure you have the following installed before proceeding:

| Tool                           | Minimum Version             | Install                                                                   |
| ------------------------------ | --------------------------- | ------------------------------------------------------------------------- |
| [Node.js](https://nodejs.org/) | 18.x LTS (20.x recommended) | [nodejs.org](https://nodejs.org/) or [nvm](https://github.com/nvm-sh/nvm) |
| [npm](https://www.npmjs.com/)  | 9.x                         | Comes with Node.js                                                        |
| [Git](https://git-scm.com/)    | 2.x                         | [git-scm.com](https://git-scm.com/)                                       |

Check your versions:

```bash
node --version    # Should be >= 18.0.0
npm --version     # Should be >= 9.0.0
git --version     # Should be >= 2.0.0
```

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/bronsonacoutts/MyTemplates.git
cd MyTemplates

# 2. Install dependencies (also installs Husky git hooks)
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your local values

# 4. Verify the setup
npm run validate:local
```

If `npm run validate:local` completes without errors, your environment is correctly configured.

---

## Detailed Setup

### 1. Repository Clone

```bash
git clone https://github.com/bronsonacoutts/MyTemplates.git
cd MyTemplates
```

### 2. Install Dependencies

```bash
npm install
```

This will also run `npm run prepare`, which:

- Installs Husky git hooks (pre-commit, commit-msg, pre-push).
- Syncs `agent-instructions.md` to `.github/copilot-instructions.md`.

### 3. Environment Variables

```bash
cp .env.example .env
```

Open `.env` in your editor and fill in the required values. See `docs/developer/ENV_SECRETS.md` for a complete reference of all variables.

### 4. Verify Installation

```bash
# Run linting
npm run lint

# Run type checking
npm run type-check

# Run tests
npm test

# Run everything together
npm run validate:local
```

---

## Git Hooks

Husky installs three git hooks automatically:

| Hook         | Trigger                      | Action                                                                           |
| ------------ | ---------------------------- | -------------------------------------------------------------------------------- |
| `pre-commit` | Before each commit           | Runs lint-staged, then `npm run validate:local`, then records a signal           |
| `commit-msg` | After writing commit message | Appends the local validation trailers and validates Conventional Commits         |
| `pre-push`   | Before pushing               | Validates branch name and only re-runs the full suite when the signal is missing |

If a hook fails, the commit or push is blocked. Fix the reported issues and try again.

Validated commits receive trailers that the cloud workflows can recognise:

```text
Local-Validation: passed
Local-Validation-Checks: lint, format:check, test, type-check, validate:catalog
Local-Validation-Source: husky-pre-commit
```

To **bypass hooks** in exceptional circumstances (not recommended):

```bash
git commit --no-verify -m "..."   # Skip pre-commit and commit-msg
git push --no-verify              # Skip pre-push
```

If hooks are bypassed, the draft-to-ready GitHub workflow chain becomes the fallback verification path.

---

## IDE Setup

### VS Code (Recommended)

Install the recommended extensions:

```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension vitest.explorer
code --install-extension ms-playwright.playwright
```

Add to your VS Code workspace settings (`.vscode/settings.json`):

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

---

## Common Commands

```bash
npm run lint              # Check for lint errors
npm run lint:fix          # Auto-fix lint errors
npm run format            # Format all files
npm run format:check      # Check formatting without writing
npm run type-check        # TypeScript type check
npm test                  # Run unit tests
npm run test:unit         # Unit tests with coverage
npm run test:watch        # Watch mode for TDD
npm run test:e2e          # E2E tests
npm run build             # Compile TypeScript and build
npm run validate          # full local validation suite
npm run validate:local    # preferred local-first validation path
npm run sendit            # Interactive commit + push helper
```

---

## Troubleshooting

### `npm install` fails

- Ensure Node.js and npm meet minimum version requirements.
- Try clearing the npm cache: `npm cache clean --force` then retry.

### Husky hooks not running

- Ensure you ran `npm install` (not just `npm ci`).
- Check that hook files are executable: `ls -la .husky/`
- Re-install hooks: `npm run prepare`
- If the validation trailers are missing from recent commits, re-run `npm run validate:local` and commit again without `--no-verify`.

### PR checks did not start

- The preferred automation profile only auto-starts when a PR moves from `draft` to `ready for review`.
- If you pushed more commits after the PR was already open, rerun the workflows manually or convert the PR back to draft and then to ready again.

### TypeScript errors after pulling

- Dependencies may have changed. Run `npm install` to update.
- Delete the TypeScript build cache: `rm -rf dist/ *.tsbuildinfo`

### Port already in use

- Find and kill the process: `lsof -ti:3000 | xargs kill -9`
- Or change the port in `.env`: `PORT=3001`

For more troubleshooting, see `docs/troubleshooting/`.
