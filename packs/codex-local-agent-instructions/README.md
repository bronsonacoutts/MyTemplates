# Codex Local Agent Instructions Pack

## Purpose

Reusable instruction templates for repositories that are used with Codex locally and need a clean `AGENTS.md`-first setup.

## Intended Consumers

- downstream template repositories that run Codex locally
- maintainers who want a copyable `AGENTS.md` baseline plus a repo-local override pattern
- repos that want local-first agent guidance without duplicating broader Copilot policy

## Source Of Truth

The canonical templates for this pack live in:

- `packs/codex-local-agent-instructions/AGENTS.md.template.md`
- `packs/codex-local-agent-instructions/AGENTS.local.template.md`

These templates are intended to be copied into downstream repositories as:

- `AGENTS.md`
- `AGENTS.local.md`

## Inventory

| Path                                                            | Role            | Notes                                                      |
| --------------------------------------------------------------- | --------------- | ---------------------------------------------------------- |
| `packs/codex-local-agent-instructions/AGENTS.md.template.md`    | Shared baseline | Universal Codex-local agent guidance for downstream repos. |
| `packs/codex-local-agent-instructions/AGENTS.local.template.md` | Local override  | Repo-specific section for stack, commands, and guardrails. |
| `packs/codex-local-agent-instructions/README.md`                | Pack guide      | Explains how to copy and adapt the templates.              |

## Copy Notes

- Copy `AGENTS.md.template.md` to `AGENTS.md` in the downstream repo root.
- Copy `AGENTS.local.template.md` to `AGENTS.local.md` in the downstream repo root.
- Keep shared policy in `AGENTS.md` and local-only details in `AGENTS.local.md`.
- If the downstream repo also uses a Copilot mirror, keep its mirror workflow separate unless the repo explicitly documents a shared sync path.

## Usage

Use this pack when you want Codex local installations to see repository instructions immediately without depending on a larger governance pack.
