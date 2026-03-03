## Summary

<!-- Provide a concise description of WHAT this PR does and WHY. Link to the issue it addresses. -->

Closes #<!-- issue number -->

---

## Type of Change

<!-- Check all that apply. -->

- [ ] `feat` – New feature (non-breaking change that adds functionality)
- [ ] `fix` – Bug fix (non-breaking change that resolves an issue)
- [ ] `docs` – Documentation only changes
- [ ] `style` – Formatting changes; no logic change
- [ ] `refactor` – Code restructuring; no behavior change, no new feature
- [ ] `perf` – Performance improvement
- [ ] `test` – Adding or updating tests
- [ ] `build` – Build system or dependency changes
- [ ] `ci` – CI/CD configuration changes
- [ ] `chore` – Miscellaneous (tooling, config, etc.)
- [ ] `revert` – Reverts a previous commit
- [ ] **BREAKING CHANGE** – Existing functionality is changed in a non-backward-compatible way

---

## Description of Changes

<!-- Describe the changes in detail. Include the motivation, approach taken, and any trade-offs made. -->

---

## Testing

<!-- Describe how this change was tested. -->

- [ ] Unit tests added/updated for new/changed behavior
- [ ] All existing tests pass (`npm test`)
- [ ] Coverage thresholds maintained (80% lines/functions/statements, 75% branches)
- [ ] E2E tests added/updated if applicable (`npm run test:e2e`)
- [ ] Manually tested in the following environments:
  - [ ] Local development
  - [ ] <!-- other environments if applicable -->

---

## Documentation

- [ ] `README.md` updated (if setup/usage/config changed)
- [ ] JSDoc comments added/updated for all new/changed public APIs
- [ ] `CHANGELOG.md` updated for user-facing changes
- [ ] `docs/` updated if architectural or behavioral changes
- [ ] ADR created if a significant architectural decision was made

---

## Security

- [ ] No secrets, credentials, or API keys committed
- [ ] All new environment variables documented in `docs/developer/ENV_SECRETS.md`
- [ ] Dependencies audited (`npm audit`) if new packages added
- [ ] Input validation applied to any new external data entry points

---

## Pre-Merge Checklist

- [ ] PR title follows Conventional Commits format
- [ ] Branch name follows naming conventions
- [ ] All CI checks pass
- [ ] Requested review from a codeowner
- [ ] All review comments resolved

---

## AI-Assisted Changes

<!-- If any part of this PR was generated or assisted by an AI tool, fill in this section. Reviewers use this to calibrate review depth. -->

- [ ] **Were any changes AI-assisted?**
- **Tool used:** <!-- e.g. GitHub Copilot, ChatGPT, Claude -->
- **Prompt template used:** <!-- e.g. vibe-coding/prompts/add-feature.md, or "custom" -->
- **Areas touched by AI:** <!-- e.g. src/utils/slugify.ts, test/utils/slugify.test.ts -->
- [ ] AI-generated code reviewed line-by-line — I can explain every change
- [ ] [AI change checklist](../vibe-coding/guardrails/ai-change-checklist.md) completed
- [ ] No hallucinated imports, packages, or API calls

---

## Screenshots / Additional Notes

<!-- Optional: include screenshots, before/after comparisons, or any other context helpful for reviewers. -->
