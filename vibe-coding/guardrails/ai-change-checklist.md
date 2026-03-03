# AI Change Checklist

> Walk this checklist before committing any AI-assisted change.
> Paste it into your PR description or use it locally as a gate.

## Before committing

- [ ] **I understand the change.** I can explain what every modified line does. If I can't, I haven't reviewed it properly.
- [ ] **No invented code.** The AI didn't fabricate imports, file paths, or APIs that don't exist in this repo.
- [ ] **No secrets.** No API keys, tokens, passwords, or credentials anywhere in the diff.
  CI runs gitleaks to catch this, but check first.
- [ ] **Types are correct.** No `any`, no `// @ts-ignore`, no `as unknown as T` hacks. TypeScript strict mode must stay clean.
- [ ] **Tests exist.** New behaviour has matching unit tests. Bug fixes include
  a regression test. Coverage thresholds (80/80/80/75) are maintained.
- [ ] **Tests pass locally.** `npm run validate` (lint + type-check + test) passes on my machine.
- [ ] **No network calls in unit tests.** All external dependencies are mocked. The `test/setup.ts` guard is not bypassed.
- [ ] **Lint is clean.** Zero ESLint warnings. No new `eslint-disable` without a comment explaining why.
- [ ] **Docs are updated.** JSDoc on new exports. README/USAGE/CHANGELOG updated if behaviour changed.
- [ ] **Commit message follows Conventional Commits.** `type(scope): lowercase subject`, max 100 chars.
- [ ] **PR template filled in.** Summary, type, testing, docs, security sections
  are complete. AI-Assisted Changes section is filled in.

## Red flags to watch for

| Red flag | What to do |
|---|---|
| AI added a dependency you didn't ask for | Remove it unless justified. Run `npm audit`. |
| AI created files in unexpected locations | Move them to the correct directory per the repo structure. |
| AI lowered coverage thresholds or disabled lint rules | Revert. These guardrails exist for a reason. |
| AI used `console.log` in production code | Replace with proper error handling or remove. |
| AI generated overly clever one-liners | Rewrite for readability. Explicit beats clever. |
| Tests only cover the happy path | Add error-path and edge-case tests. |
| Large diff that's hard to review | Break into smaller, focused commits. |

## Quick validation commands

```bash
# Full validation (lint + type-check + test)
npm run validate

# Just lint
npm run lint

# Just tests with coverage
npm run test:unit

# Markdown lint (for docs changes)
npm run lint:md

# Format check
npm run format:check
```
