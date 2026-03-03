# Vibe Coding Assets

> Templates, prompts, and guardrails for safe AI-assisted development.

This folder contains first-class assets that make vibe coding (AI-assisted rapid development)
practical and safe. Use them with GitHub Copilot, ChatGPT, Claude, or any LLM-based coding tool.

## Structure

| Folder | What's inside | Start here |
|---|---|---|
| [prompts/](prompts/) | Markdown prompt templates for common tasks | [add-feature.md](prompts/add-feature.md) |
| [guardrails/](guardrails/) | Checklists and review rubrics for AI-generated code | [ai-change-checklist.md](guardrails/ai-change-checklist.md) |
| [examples/](examples/) | Before/after walkthroughs showing guardrails in action | [lint-catch/](examples/lint-catch/) |

## Quick start

1. Pick a prompt from [prompts/](prompts/) that matches your task.
2. Paste it into your AI tool, replacing the placeholders.
3. Apply the output to the repo.
4. Run `npm run validate` to catch issues immediately.
5. Walk the checklist in [guardrails/ai-change-checklist.md](guardrails/ai-change-checklist.md) before committing.
6. Open a PR using the repo's [PR template](../.github/PULL_REQUEST_TEMPLATE.md) — tick the "AI-assisted changes" section.

## Philosophy

Vibe coding is not about blindly accepting AI output. It's about:

- **Speed with structure** — prompts give the AI the right constraints up front.
- **Fast feedback loops** — `npm run validate` catches 90% of issues in seconds.
- **Transparent review** — the PR template records what was AI-generated and what was human-verified.

See [docs/VIBE_CODING.md](../docs/VIBE_CODING.md) for the full golden-path workflow.
