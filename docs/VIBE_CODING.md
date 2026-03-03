# Vibe Coding Guide

Golden-path workflow for AI-assisted development in this repo. Follow these steps and the guardrails will do the heavy lifting.

---

## What is vibe coding?

Vibe coding is AI-assisted rapid development — you describe what you want,
an AI tool generates the code, and you verify it meets quality standards
before merging. The risk is obvious: AI output can look correct but
introduce type holes, skip tests, leak secrets, or break accessibility.
This repo's templates and automations exist to catch those problems early.

---

## The golden path

### 1. Choose a prompt template

Browse [vibe-coding/prompts/](../vibe-coding/prompts/) and pick the one that matches your task:

| Task | Prompt |
|---|---|
| New module or feature | [add-feature.md](../vibe-coding/prompts/add-feature.md) |
| Bug diagnosis and fix | [bugfix.md](../vibe-coding/prompts/bugfix.md) |
| Safe restructuring | [repo-refactor.md](../vibe-coding/prompts/repo-refactor.md) |
| Documentation | [documentation.md](../vibe-coding/prompts/documentation.md) |
| PR description + changelog | [pr-description-changelog.md](../vibe-coding/prompts/pr-description-changelog.md) |

Each prompt already embeds the repo's constraints (strict TypeScript,
no `any`, mock all network calls, JSDoc required, Australian English
for docs). Replace the placeholders with your specific task and paste
into your AI tool.

### 2. Apply the output

Copy the AI-generated code into your editor. **Do not commit yet.**

### 3. Run the validation suite

```bash
npm run validate
```

This single command runs:

- ESLint with zero-warning policy
- TypeScript strict-mode type-check
- Vitest unit tests with coverage gates

If it passes, the code meets the repo's baseline quality bar.
If it fails, read the errors — they tell you exactly what the AI
got wrong.

### 4. Walk the checklist

Open the [AI change checklist](../vibe-coding/guardrails/ai-change-checklist.md)
and tick each item. The checklist catches things automation cannot:
hallucinated imports, logic that compiles but does the wrong thing,
missing edge cases.

### 5. Commit and push

```bash
npm run sendit
```

The interactive helper enforces conventional commits. Husky hooks run lint-staged on pre-commit and the full validation suite on pre-push.

### 6. Open a PR

The [PR template](../.github/PULL_REQUEST_TEMPLATE.md) has an
**AI-Assisted Changes** section. Fill it in honestly — reviewers
use this to calibrate how carefully they read the diff.

---

## How the guardrails catch common AI failures

### Failure: AI generates `any` types

**What catches it:** ESLint rule `@typescript-eslint/no-explicit-any` + `tsconfig.json` strict mode.

**What you see:**

```text
error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
```

**What to do:** Replace `any` with a proper type or `unknown` with a type guard.

### Failure: AI writes a test that calls a real API

**What catches it:** [test/setup.ts](../test/setup.ts) replaces `fetch` and `XMLHttpRequest` globally.

**What you see:**

```text
Error: Network requests are not allowed in unit tests.
```

**What to do:** Mock the HTTP client with `vi.mock()` or inject a stub. See [examples/no-network-unit-tests.md](../examples/no-network-unit-tests.md).

### Failure: AI leaves `console.log` in production code

**What catches it:** ESLint `no-console` rule.

**What you see:**

```text
warning  Unexpected console statement  no-console
```

**What to do:** Remove the log or replace with a proper logging utility.

### Failure: AI commits a hardcoded API key

**What catches it:** Gitleaks in CI.

**What you see:** CI fails with a gitleaks finding showing the file and line.

**What to do:** Remove the key, rotate it immediately, and use environment variables instead.

### Failure: AI uses a non-conventional commit message

**What catches it:** Commitlint in the `commit-msg` hook.

**What you see:**

```text
⧗   input: added new feature
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]
```

**What to do:** Use the format `type(scope): summary` — see [CONTRIBUTING.md](../CONTRIBUTING.md) for the full list of types.

### Failure: AI generates a Playwright test with CSS selectors

**What catches it:** Code review (not automated, but the [review rubric](../vibe-coding/guardrails/review-rubric.md) flags it).

**What to do:** Replace CSS selectors with ARIA locators (`getByRole`, `getByLabel`). See [test/e2e/ui-components.spec.ts](../test/e2e/ui-components.spec.ts).

---

## Tools that work well with this repo

| Tool | How to use it |
|---|---|
| **GitHub Copilot** | Enable in VS Code. The repo's agent-instructions.md is loaded automatically. |
| **Copilot Chat** | Paste prompt templates into the chat panel. Reference specific files with `@workspace`. |
| **ChatGPT / Claude** | Copy the prompt, paste your task, include relevant file contents. |
| **Copilot CLI** | Use `gh copilot suggest` for one-off commands that follow the repo's conventions. |

---

## When not to vibe code

AI-assisted coding works well for:

- Boilerplate modules with clear patterns
- Test generation from existing interfaces
- Documentation and JSDoc
- Bug fixes with well-defined reproduction steps
- Refactoring with existing test coverage

Consider writing manually when:

- Security-critical logic (crypto, auth flows, input sanitisation)
- Complex state machines with subtle edge cases
- Performance-critical hot paths
- Novel algorithms without established patterns

Even in these cases, use the prompt templates to generate a *starting point*, then review and rewrite carefully.

---

## Further reading

- [Style Guide](STYLE_GUIDE.md) — coding conventions including AI-assisted edit policy
- [Testing Guide](developer/TESTING.md) — full testing reference
- [Pattern Index](PATTERNS.md) — key patterns used in this repo
- [Guardrails README](../vibe-coding/README.md) — index of all vibe-coding assets
