# Prompt: PR Description and Changelog

> Use this prompt when asking an AI to draft a pull request description and changelog entry.

## Prompt

```text
You are working in the MyTemplates repository — a TypeScript/Node.js project template
with strict linting, Vitest unit tests, Playwright E2E tests, and Husky pre-commit hooks.

TASK: Given the following changes, write a PR description and CHANGELOG.md entry:
[paste the git diff, or describe the changes and list affected files]

CONSTRAINTS:
- PR title must follow Conventional Commits: type(scope): description
  (e.g. feat(auth): add JWT refresh rotation).
- The PR description must follow the repo's PR template in
  .github/PULL_REQUEST_TEMPLATE.md. Fill in every section:
  - Summary (what and why, linking to the issue)
  - Type of Change (tick the correct box)
  - Description of Changes (approach, trade-offs)
  - Testing (which tests were added/updated)
  - Documentation (what docs changed)
  - Security (any new env vars, deps audited?)
  - Pre-Merge Checklist
  - AI-Assisted Changes (if applicable — note the prompt used and areas touched)
- The CHANGELOG entry must follow Keep a Changelog format (keepachangelog.com):
  group under Added / Changed / Deprecated / Removed / Fixed / Security.
- Use Australian English.
- Do not invent changes. Only describe what's in the diff.
- Do not include secrets or credentials.

OUTPUT FORMAT:
1. PR title (one line, Conventional Commits format).
2. Full PR description (Markdown, following the template).
3. CHANGELOG.md entry (Markdown, ready to paste under ## [Unreleased]).

SAFETY:
- Double-check that every file mentioned in the PR actually exists in the diff.
- If the change includes security-relevant modifications, flag them in the
  Security section.
- If this was an AI-assisted change, fill in the AI-Assisted Changes section
  honestly — note the prompt used and which parts were human-verified.
```

## When to use

- After completing a feature, bugfix, or refactor and before opening a PR.
- When you want a well-structured PR description quickly.
- To generate a CHANGELOG entry alongside the PR.

## After running the prompt

1. Compare the AI's description against the actual diff — remove anything invented.
2. Ensure the PR title passes the `pr-validation.yml` workflow (conventional format,
   lowercase subject).
3. Paste the CHANGELOG entry under `## [Unreleased]` in CHANGELOG.md.
4. Tick checkboxes honestly — the AI may tick items you haven't actually done.
