## Style guide

Opinionated rules that match the existing linting and docs in this repo. Keep changes tight, readable, and testable.

### Naming

- Branches: enforce `prefix/short-description` via [scripts/validate-branch.js](../scripts/validate-branch.js) (e.g. `feature/add-api`).
- Files and folders: kebab-case for config/docs, PascalCase for React components, camelCase for variables/functions.
- Tests: co-locate or place in [test](../test) with suffix `.test.ts` or `.spec.ts`.

### Formatting

- Prettier is the source of truth: two-space indent, single quotes in TypeScript, trailing commas where valid. Run `npm run format`.
- ESLint runs with zero-warnings: see [eslintrc](../.eslintrc.cjs) for import ordering, no-console rules, and strict type checks.
- Keep Markdown to 120-char lines; headings start with `#` and avoid inline HTML unless necessary.

### TypeScript and imports

- `noImplicitAny` is on; prefer `unknown` + narrowing rather than `any`.
- Use type-only imports — enforced by eslint rule `@typescript-eslint/consistent-type-imports`.
- Order imports by builtin → external → internal → relatives, enforced via `import/order`.

### Comments and docs

- Add JSDoc to exported functions/types; keep comments short and informative, not restating the obvious.
- When disabling a lint rule, explain why in the line above and prefer the smallest scope possible.
- Link to source of truth instead of duplicating prose (e.g. point to [docs/developer/TESTING.md](developer/TESTING.md)).

### Error handling

- Fail fast: throw typed errors, or surface them to callers; do not swallow exceptions silently.
- Avoid `console.log` in production paths; use `console.error`/`console.warn` sparingly — lint warns otherwise.
- Validate inputs at boundaries; tests should cover failure paths (mock external calls per [test/setup.ts](../test/setup.ts)).

### Testing

- Unit tests must not hit the network — enforced globally in [test/setup.ts](../test/setup.ts).
- Prefer Playwright ARIA locators (`getByRole`, `getByLabel`) as shown in [test/e2e/ui-components.spec.ts](../test/e2e/ui-components.spec.ts).
- Maintain coverage thresholds set in [vitest.config.ts](../vitest.config.ts); if you relax them, document why.

### AI-assisted edits policy

AI-generated code is welcome but must meet the same standards as hand-written code. No exceptions.

- **Run `npm run validate` before committing.** This catches the most common
  AI mistakes: `any` types, missing imports, untested paths, and formatting
  drift.
- **Generate tests alongside code.** Never accept a feature suggestion without also generating the corresponding unit tests.
- **No `any`, no `@ts-ignore`.** If the AI cannot type something correctly,
  rewrite the signature or use `unknown` with a type guard.
- **Mock all network calls in tests.** The test/setup.ts harness will reject
  tests that forget. See examples/vibe-safe-change-2/ for a walkthrough.
- **Add JSDoc to every exported symbol.** Include `@param`, `@returns`, and
  `@throws` at minimum. Add `@example` for non-obvious APIs.
- **Use Australian English** in documentation and user-facing strings (e.g. "colour", "behaviour", "organisation").
- **Walk the AI change checklist** before pushing. It catches things
  automation cannot. See `vibe-coding/guardrails/ai-change-checklist.md`.
- **Fill in the PR template's AI-Assisted Changes section** honestly. Reviewers use it to calibrate review depth.
- **Prefer explicit over clever.** AI output can be terse or overly abstract. Readable, straightforward code is always preferred.
- **Use the prompt templates** in `vibe-coding/prompts/` — they already
  embed the repo's constraints so the AI starts from the right baseline.
