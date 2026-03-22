# Azure DevOps Governance Pack

## Purpose

Reusable Azure DevOps governance assets for repositories that enforce work-item-linked commits, protected branch push rules, and PR readiness checks.

## Intended Consumers

- Azure DevOps repositories that need governed commit and ship workflows
- downstream Power Platform or operations templates using Azure DevOps work items
- teams adopting the current `commitship` governance model without taking the full repo

## Source Of Truth

This pack is currently anchored in the existing `templates/commitship-ado-governance/` implementation. Until issue `13` spins that work into a dedicated template, the canonical files remain in that directory.

The authoritative files for this pack live in:

- `templates/commitship-ado-governance/`

## Inventory

| Path                                                                     | Role               | Notes                                                                               |
| ------------------------------------------------------------------------ | ------------------ | ----------------------------------------------------------------------------------- |
| `templates/commitship-ado-governance/README.md`                          | Pack guide         | Usage and installation flow for the current Azure DevOps governance implementation. |
| `templates/commitship-ado-governance/commitship.config.ps1`              | Repo configuration | Azure DevOps org, project, area path, and iteration defaults.                       |
| `templates/commitship-ado-governance/.githooks/commit-msg`               | Local enforcement  | Requires work-item references in commit messages.                                   |
| `templates/commitship-ado-governance/.githooks/pre-push`                 | Local enforcement  | Blocks protected branch pushes and runs readiness checks.                           |
| `templates/commitship-ado-governance/scripts/Install-GitHooks.ps1`       | Setup automation   | Installs the pack's local Git hooks.                                                |
| `templates/commitship-ado-governance/scripts/Invoke-Commitship.ps1`      | Primary workflow   | Commit, branch, work-item, and PR orchestration.                                    |
| `templates/commitship-ado-governance/scripts/Test-CommitMessage.ps1`     | Policy check       | Validates `AB#<id>` commit references.                                              |
| `templates/commitship-ado-governance/scripts/Test-CommitPolicy.ps1`      | Policy check       | Validates governed file and branch conventions.                                     |
| `templates/commitship-ado-governance/scripts/Test-PullRequestReadiness.ps1` | Policy check    | Ensures PR readiness before push or PR creation.                                    |
| `templates/commitship-ado-governance/scripts/Test-PushPolicy.ps1`        | Policy check       | Prevents protected branch pushes.                                                   |
| `templates/commitship-ado-governance/template.manifest.json`             | Metadata           | Current manifest for the in-repo implementation that seeds future extraction.       |

## Sync Notes

- Treat this pack as a governed bundle: hooks, scripts, config, and README should move together.
- GitHub policy files are owned by the github-governance pack, not this pack.
