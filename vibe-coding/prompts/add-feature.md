# Prompt: Add Feature

> Use this prompt when asking an AI to implement a new feature in this repository.

## Prompt

```text
You are working in the MyTemplates repository — a TypeScript/Node.js project template
with strict linting (ESLint zero-warnings), Vitest unit tests (80% coverage gates),
Playwright E2E tests, and Husky pre-commit hooks.

TASK: Implement the following feature:
[describe the feature here]

CONSTRAINTS:
- TypeScript strict mode is enabled. Do not use `any`; use `unknown` and narrow with
  type guards.
- All exported functions, classes, and types must have JSDoc comments with @param,
  @returns, and @throws tags.
- Do not invent file paths. Check the repo structure before creating files:
  - Source code goes in src/
  - Unit tests go in test/ (mirroring src/ structure) with suffix .test.ts
  - E2E tests go in test/e2e/ with suffix .spec.ts
- Unit tests must not make real network calls. The global setup in test/setup.ts
  blocks fetch and XMLHttpRequest. Mock all external dependencies with vi.mock().
- Use `const` over `let`; never use `var`. No magic numbers — define named constants.
- Follow Conventional Commits for any commit messages: feat(scope): description
- Do not add secrets, credentials, or API keys.

OUTPUT FORMAT:
1. List the files you will create or modify.
2. Provide the full content of each new file.
3. For modified files, show the exact diff (before/after).
4. Provide matching unit tests that cover the happy path and at least one error path.
5. Confirm that running `npm run validate` (lint + type-check + test) would pass.

SAFETY:
- Do not commit secrets or tokens.
- Do not disable ESLint rules without a documented justification.
- Do not lower coverage thresholds in vitest.config.ts.
- If you are unsure about a decision, flag it as a TODO for human review.
```

## When to use

- Adding a new module, utility, or service to `src/`.
- Extending an existing feature with new behaviour.
- Creating new E2E test scenarios.

## After running the prompt

1. Review every file the AI created or modified.
2. Run `npm run validate` to confirm lint, types, and tests pass.
3. Walk the [AI change checklist](../guardrails/ai-change-checklist.md).
4. Commit with `feat(scope): description` and open a PR.
