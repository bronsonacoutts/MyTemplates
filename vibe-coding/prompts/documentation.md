# Prompt: Documentation

> Use this prompt when asking an AI to write or improve documentation.

## Prompt

```text
You are working in the MyTemplates repository — a TypeScript/Node.js project template
with strict linting, Vitest unit tests, Playwright E2E tests, and Husky pre-commit hooks.

TASK: Write or update documentation for:
[describe what needs documenting — e.g. "add JSDoc to all exports in src/utils/",
"write a developer guide for the new caching module", "update docs/USAGE.md to cover
the new CLI flags"]

CONSTRAINTS:
- Use Australian English (colour, behaviour, organisation, licence for the noun).
- Follow the documentation standards in docs/DOC_STANDARDS.md:
  - ATX-style headings (## not underline).
  - Fenced code blocks with language identifiers.
  - Relative links to other docs in this repo.
  - Wrap lines at 120 characters.
- All exported functions, classes, and types must have JSDoc with @param, @returns,
  @throws, and @example where applicable.
- Do not invent features. Only document what actually exists in the codebase.
  Cite file paths to prove every claim.
- Place new docs in the correct directory:
  - API reference → docs/api/
  - Architecture decisions → docs/architecture/
  - Developer guides → docs/developer/
  - User guides → docs/user/
  - Troubleshooting → docs/troubleshooting/
- File naming: UPPER_SNAKE_CASE.md for guides, ADR-NNNN-short-title.md for ADRs.
- Do not add secrets, credentials, or API keys.

OUTPUT FORMAT:
1. List the files you will create or modify.
2. Provide the full content of each new file.
3. For modified files, show the exact diff.
4. Include a link check: list every relative link and confirm the target exists.

SAFETY:
- Do not fabricate APIs or features that don't exist.
- If you're unsure whether something exists, ask or mark it with [VERIFY].
- Run `npm run lint:md` after writing to catch formatting issues.
```

## When to use

- Adding JSDoc to undocumented exports.
- Writing developer onboarding guides.
- Creating ADRs for architectural decisions.
- Updating README or USAGE.md after feature changes.

## After running the prompt

1. Run `npm run lint:md` and `npm run format:check`.
2. Verify every link points to a real file.
3. Read the docs as if you're a new contributor — does it make sense?
4. Commit with `docs(scope): description`.
