# AI Agent Instructions Pack

## Purpose

Shared AI governance files that define instruction priority, prompt-injection defense, repo conventions, and the mirror workflow between agent and Copilot instruction files.

## Intended Consumers

- downstream template repos using GitHub Copilot or Codex-style agents
- maintainers who want one global instruction baseline plus local overrides
- repos that need synchronized human-readable and Copilot-readable policy files

## Source Of Truth

The shared global policy is authored in `packs/ai-agent-instructions/global-instructions.md`.

Each consuming repo adds its own `agent-instructions.local.md` file for repo-specific overrides.

`agent-instructions.md` and `.github/copilot-instructions.md` are generated mirror outputs and must remain identical.

The authoritative files for this pack live in:

- `packs/ai-agent-instructions/global-instructions.md`
- `packs/ai-agent-instructions/agent-instructions.local.template.md`
- `agent-instructions.local.md`
- `agent-instructions.md`
- `.github/copilot-instructions.md`
- `scripts/sync-instructions.js`
- `.github/workflows/sync-instructions.yml`
- `docs/developer/COPILOT_FIREWALL.md`

## Inventory

| Path                                                               | Role                    | Notes                                                                       |
| ------------------------------------------------------------------ | ----------------------- | --------------------------------------------------------------------------- |
| `packs/ai-agent-instructions/global-instructions.md`               | Global source           | Shared AI governance blocks that every template must inherit.               |
| `packs/ai-agent-instructions/agent-instructions.local.template.md` | Override template       | Example local override shape for downstream template repos.                 |
| `agent-instructions.local.md`                                      | Repo-local override     | Current repo's local additions layered onto the shared global instructions. |
| `agent-instructions.md`                                            | Generated output        | Human-facing generated instruction file.                                    |
| `.github/copilot-instructions.md`                                  | Generated mirror        | GitHub Copilot-facing generated instruction file.                           |
| `scripts/sync-instructions.js`                                     | Sync utility            | Builds both generated files from the global source plus local override.     |
| `.github/workflows/sync-instructions.yml`                          | Drift prevention        | Verifies or restores generated instruction parity in CI.                    |
| `docs/developer/COPILOT_FIREWALL.md`                               | Network policy guidance | Documents approved external endpoints for Copilot coding sessions.          |

## Sync Notes

- Edit `packs/ai-agent-instructions/global-instructions.md` for shared policy changes.
- Edit `agent-instructions.local.md` for repo-specific details only.
- Run `npm run sync-instructions` to regenerate both mirrored output files.
- Downstream repos should copy the template at `packs/ai-agent-instructions/agent-instructions.local.template.md` instead of forking the whole generated file.
