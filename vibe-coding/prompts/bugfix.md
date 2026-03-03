# Prompt: Bugfix

> Use this prompt when asking an AI to diagnose and fix a bug.

## Prompt

```text
You are working in the MyTemplates repository — a TypeScript/Node.js project template
with strict linting (ESLint zero-warnings), Vitest unit tests (80% coverage gates),
Playwright E2E tests, and Husky pre-commit hooks.

TASK: Fix the following bug:
[describe the bug — symptoms, affected file(s), steps to reproduce]

CONSTRAINTS:
- Read the affected file(s) first. Do not guess at code you haven't seen.
- The fix must not break existing tests. Run `npm test` to verify.
- Add or update at least one unit test that reproduces the bug (red)
  and then passes after the fix (green).
- TypeScript strict mode is on. Do not use `any` or `// @ts-ignore`.
- Unit tests must not make real network calls (test/setup.ts blocks them).
- Do not introduce new ESLint warnings — the repo enforces --max-warnings 0.
- Do not add secrets, credentials, or API keys.

OUTPUT FORMAT:
1. Root cause analysis: explain why the bug happens in 2–3 sentences.
2. List the files you will modify.
3. Show the exact diff for each file (before/after with context).
4. Provide the regression test that proves the fix.
5. Confirm that `npm run validate` passes.

SAFETY:
- Minimise the blast radius — change only what's needed.
- If the bug has security implications, note them explicitly.
- If you are not confident in the root cause, say so and suggest
  diagnostic steps rather than guessing.
```

## When to use

- Fixing a failing test or CI check.
- Resolving a runtime error reported in an issue.
- Patching logic errors discovered during review.

## After running the prompt

1. Run the regression test the AI provided: does it fail without the fix?
2. Apply the fix, re-run `npm run validate`.
3. Walk the [AI change checklist](../guardrails/ai-change-checklist.md).
4. Commit with `fix(scope): description` referencing the issue: `Closes #N`.
