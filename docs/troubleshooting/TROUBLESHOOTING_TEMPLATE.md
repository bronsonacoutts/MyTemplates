# Troubleshooting Guide

> This guide covers common issues and their solutions.

---

## How to Use This Guide

1. Identify your symptom in the [Common Issues](#common-issues) section.
2. Follow the diagnostic steps listed.
3. If the issue persists, gather the information in [Reporting an Issue](#reporting-an-issue) and open a bug report.

---

## Diagnostic Checklist

Before diving into specific issues, check these common causes:

- [ ] Node.js version meets the minimum requirement (`node --version` → should be `>=18.0.0`)
- [ ] Dependencies are up to date (`npm install`)
- [ ] Environment variables are correctly set (compare `.env` against `.env.example`)
- [ ] No conflicting global packages (`npm list -g --depth=0`)

---

## Common Issues

### Issue: `npm install` fails with permission errors

**Symptom:**

```
EACCES: permission denied, mkdir '/usr/local/lib/node_modules/...'
```

**Cause:** npm is trying to write to a directory owned by root.

**Solution:**

1. Do NOT use `sudo npm install`. Instead, fix npm permissions:
   ```bash
   mkdir ~/.npm-global
   npm config set prefix '~/.npm-global'
   echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
   source ~/.bashrc
   ```
2. Alternatively, use [nvm](https://github.com/nvm-sh/nvm) to manage Node.js versions (recommended).

---

### Issue: TypeScript errors after pulling latest changes

**Symptom:**

```
error TS2307: Cannot find module '...' or its corresponding type declarations.
```

**Cause:** Dependencies or type definitions may have changed.

**Solution:**

```bash
npm install
rm -rf dist/ *.tsbuildinfo
npm run type-check
```

---

### Issue: Husky hooks not running

**Symptom:** Commits go through without lint or commitlint running.

**Cause:** Husky hooks were not installed, or hooks lack execute permission.

**Solution:**

```bash
# Re-install hooks
npm run prepare

# Verify hooks are executable
ls -la .husky/
# pre-commit, commit-msg, pre-push should show -rwxr-xr-x

# Manually fix permissions if needed
chmod +x .husky/pre-commit .husky/commit-msg .husky/pre-push
```

---

### Issue: Tests fail with "Cannot find module"

**Symptom:**

```
Error: Cannot find module '../../src/utils/myModule.js'
```

**Cause:** The module path in the import is incorrect, or the file doesn't exist.

**Solution:**

1. Verify the file path is correct (TypeScript uses `.js` extensions in ESM imports even for `.ts` source files).
2. Ensure `src/` is built if importing from `dist/`.
3. Check that `tsconfig.json` paths are configured correctly.

---

### Issue: Coverage below threshold — CI failing

**Symptom:**

```
ERROR: Coverage for lines (78.5%) does not meet global threshold (80%)
```

**Cause:** New code was added without corresponding tests.

**Solution:**

1. Run `npm run test:unit` locally to see the coverage report.
2. Open `coverage/index.html` in your browser for a visual breakdown.
3. Identify uncovered lines and add tests for them.
4. **Do not lower the thresholds** — maintain or improve coverage.

---

### Issue: ESLint reports errors in CI but not locally

**Symptom:** CI lint job fails, but `npm run lint` passes locally.

**Cause:** Different ESLint versions or different Node.js versions between local and CI.

**Solution:**

```bash
# Ensure local dependencies match CI
rm -rf node_modules package-lock.json
npm install

# Verify you're using the same Node version as CI (Node 20)
node --version
```

---

### Issue: `pre-push` hook fails with branch name validation error

**Symptom:**

```
❌ Branch name 'my-feature' does not match the required pattern.
```

**Cause:** The branch name doesn't include the required prefix.

**Solution:**

```bash
# Rename your branch with the correct prefix
git branch -m my-feature feature/my-feature

# Then push again
git push
```

Allowed prefixes: `feature/`, `fix/`, `hotfix/`, `release/`, `docs/`, `refactor/`, `test/`, `chore/`, `copilot/`

---

## Reporting an Issue

If none of the above solutions work, open a [bug report](../../issues/new?template=bug_report.md) and include:

1. **Operating system** and version
2. **Node.js version** (`node --version`)
3. **npm version** (`npm --version`)
4. **Full error message** — copy the complete output including stack trace
5. **Steps to reproduce** — exact commands you ran
6. **Expected behavior** — what you expected to happen
7. **Actual behavior** — what actually happened
8. **Contents of your `.env`** — with all secret values redacted

---

## Getting More Help

- Review the [Developer Setup Guide](../developer/SETUP.md).
- Check [existing issues](../../issues) — your problem may already have a solution.
- Ask in the project discussions or contact the maintainer.
