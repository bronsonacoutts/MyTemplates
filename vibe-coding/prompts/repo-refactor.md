# Prompt: Repo Refactor

> Use this prompt when asking an AI to restructure code without changing behaviour.

## Prompt

```text
You are working in the MyTemplates repository — a TypeScript/Node.js project template
with strict linting (ESLint zero-warnings), Vitest unit tests (80% coverage gates),
Playwright E2E tests, and Husky pre-commit hooks.

TASK: Refactor the following area of the codebase:
[describe what to refactor and why — e.g. "extract shared validation logic from
src/handlers/ into a new src/utils/validation.ts module"]

CONSTRAINTS:
- This is a refactor. Behaviour must not change. All existing tests must continue to
  pass without modification (unless a test is being moved alongside its source).
- TypeScript strict mode is enabled. Do not use `any`.
- Preserve all JSDoc comments. Update import paths if files move.
- Do not rename public API exports unless explicitly asked — downstream consumers
  may depend on them.
- Follow the project's import ordering: builtin → external → internal → relative
  (enforced by eslint-plugin-import).
- Do not add new dependencies.
- Do not add secrets, credentials, or API keys.

OUTPUT FORMAT:
1. Explain the refactoring strategy in 3–5 sentences.
2. List every file that will be created, moved, modified, or deleted.
3. For each file, provide the full new content or an exact diff.
4. Confirm that no test assertions changed (only import paths if files moved).
5. Confirm that running `npm run validate` would pass.

SAFETY:
- Run the full test suite after refactoring: `npm run validate`.
- If you discover dead code, flag it but do not remove it without confirmation.
- If a file is deleted, ensure no other file imports from it.
```

## When to use

- Extracting shared logic into utility modules.
- Reorganising folder structure.
- Simplifying complex functions without changing outputs.
- Removing duplication across modules.

## After running the prompt

1. Run `npm run validate` — all existing tests must pass unchanged.
2. Diff carefully: behaviour changes hidden in refactors are the most dangerous bugs.
3. Walk the [AI change checklist](../guardrails/ai-change-checklist.md).
4. Commit with `refactor(scope): description`.
