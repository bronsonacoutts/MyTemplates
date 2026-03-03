## How to use these templates

This repo is a catalogue, not a one-click starter. Pick the bits you need, copy deliberately, and keep the guardrails intact.

### Recommended path (first 15 minutes)
- Read the [README](../README.md) for the quickstart and catalogue.
- Install deps and run the fast checks:
```bash
npm install
npm run lint
npm test
```
- Skim the testing patterns in [test/sample.test.ts](../test/sample.test.ts) and [test/e2e/accessibility.spec.ts](../test/e2e/accessibility.spec.ts) to see how isolation and accessibility are enforced.
- Keep branch and release hygiene by reusing [scripts/validate-branch.js](../scripts/validate-branch.js) and [scripts/validate-release-notes.js](../scripts/validate-release-notes.js) in your own repos.

### Choosing what to copy
- **Need a disciplined test harness?** Lift [test/setup.ts](../test/setup.ts) and the sample specs in [test/e2e](../test/e2e).
- **Documenting decisions?** Start from [docs/architecture/ADR_TEMPLATE.md](architecture/ADR_TEMPLATE.md).
- **Developer onboarding?** Reuse [docs/developer/SETUP.md](developer/SETUP.md) and [docs/developer/TESTING.md](developer/TESTING.md) as baseline runbooks.
- **Governance and safety?** Keep [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md), [SECURITY.md](../SECURITY.md), and [CONTRIBUTING.md](../CONTRIBUTING.md) intact — they already reference the guardrails here.

### Customising safely
- Update badges and CODEOWNERS to match your org before publishing.
- If you adjust coverage thresholds in [vitest.config.ts](../vitest.config.ts), document the rationale in your README to avoid silent quality creep.
- When copying GitHub Actions from [.github/workflows](../.github/workflows), review secrets usage — this repo avoids secrets entirely; do the same where possible.

### Extending the templates
- Add your own feature modules under [src](../src) and mirror the testing patterns in [test](../test).
- Add new docs under [docs](../docs) using the same tone and structure as [docs/DOC_STANDARDS.md](DOC_STANDARDS.md).
- Keep new examples small and runnable like those in [examples](../examples).

### Using with AI coding tools (vibe coding)

This repo is designed for AI-assisted development. The guardrails catch common AI mistakes automatically.

**Quick start:**

1. Browse [vibe-coding/prompts/](../vibe-coding/prompts/) and pick a prompt template for your task.
2. Paste it into Copilot, ChatGPT, or Claude with your specific details filled in.
3. Apply the output, then run `npm run validate`.
4. Walk the [AI change checklist](../vibe-coding/guardrails/ai-change-checklist.md) before committing.

**What the guardrails catch:**

- `any` types and implicit any (ESLint + TypeScript strict mode)
- Real network calls in tests ([test/setup.ts](../test/setup.ts))
- Missing test coverage (Vitest coverage gates)
- Committed secrets (Gitleaks in CI)
- Non-conventional commits and branch names (Husky hooks + CI)

**Full workflow guide:** [docs/VIBE_CODING.md](VIBE_CODING.md)

**Concrete examples:**

- [AI adds a utility safely](../examples/vibe-safe-change-1/) — full walkthrough from prompt to merged PR
- [Test harness catches unsafe AI test](../examples/vibe-safe-change-2/) — how the no-network guard stops real API calls