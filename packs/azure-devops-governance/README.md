# Azure DevOps Governance Pack

## Purpose

Reusable Azure DevOps governance assets for repositories that enforce work-item-linked commits, protected branch push rules, and PR readiness checks.

## Intended Consumers

- Azure DevOps repositories that need governed commit and ship workflows
- downstream Power Platform or operations templates using Azure DevOps work items
- teams adopting the current `stampit` governance model without taking the full repo

## Source Of Truth

This pack is currently anchored in the existing `templates/stampit-ado-governance/` implementation. Until issue `13` spins that work into a dedicated template, the canonical files remain in that directory.

The authoritative files for this pack live in:

- `templates/stampit-ado-governance/`

## Inventory

| Path                                                                     | Role               | Notes                                                                               |
| ------------------------------------------------------------------------ | ------------------ | ----------------------------------------------------------------------------------- |
| `templates/stampit-ado-governance/README.md`                             | Pack guide         | Usage and installation flow for the current Azure DevOps governance implementation. |
| `templates/stampit-ado-governance/stampit.config.ps1`                    | Repo configuration | Azure DevOps org, project, area path, and iteration defaults.                       |
| `templates/stampit-ado-governance/.githooks/commit-msg`                  | Local enforcement  | Requires work-item references in commit messages.                                   |
| `templates/stampit-ado-governance/.githooks/pre-push`                    | Local enforcement  | Blocks protected branch pushes and runs readiness checks.                           |
| `templates/stampit-ado-governance/scripts/Install-GitHooks.ps1`          | Setup automation   | Installs the pack's local Git hooks.                                                |
| `templates/stampit-ado-governance/scripts/Invoke-Stampit.ps1`            | Primary workflow   | Commit, branch, work-item, and PR orchestration.                                    |
| `templates/stampit-ado-governance/scripts/Test-CommitMessage.ps1`        | Policy check       | Validates `AB#<id>` commit references.                                              |
| `templates/stampit-ado-governance/scripts/Test-CommitPolicy.ps1`         | Policy check       | Validates governed file and branch conventions.                                     |
| `templates/stampit-ado-governance/scripts/Test-PullRequestReadiness.ps1` | Policy check       | Ensures PR readiness before push or PR creation.                                    |
| `templates/stampit-ado-governance/scripts/Test-PushPolicy.ps1`           | Policy check       | Prevents protected branch pushes.                                                   |
| `templates/stampit-ado-governance/template.manifest.json`                | Metadata           | Current manifest for the in-repo implementation that seeds future extraction.       |

## Sync Notes

- Treat this pack as a governed bundle: hooks, scripts, config, and README should move together.
- GitHub policy files are owned by the github-governance pack, not this pack.
