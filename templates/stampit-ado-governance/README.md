# Stampit — ADO Governed Commit & Ship Template

A PowerShell-based commit governance toolkit for software projects using **Azure DevOps** for work item tracking and pull requests.

## What It Does

The `stampit` trigger (`Invoke-Stampit.ps1`) replaces raw `git commit` for all developer and AI-agent commits. It:

1. Detects all dirty/staged files in your workspace.
2. Groups them into logical commit bundles by topic (heuristic + user confirmation).
3. For each bundle — resolves or creates an ADO work item (`AB#<id>`).
4. Creates a strategy-compliant branch (`feature|bugfix|hotfix|chore/<id>-<slug>`).
5. Runs policy checks (`Test-CommitPolicy.ps1`) before committing.
6. Commits with `AB#<id>` embedded in the message.
7. Pushes the branch, runs PR readiness checks, opens a PR.
8. Links the work item to the commit and PR as artifact links.
9. Scans for follow-up tasks and offers to create backlog items.

The git hooks (`commit-msg`, `pre-push`) enforce that **all commits have a work item reference** and that **protected branches are never pushed to directly**.

---

## Installation

### 1. Copy the template into your project

Copy the contents of this directory into the root of your project:

```
.githooks/
  commit-msg
  pre-push
scripts/
  Install-GitHooks.ps1
  Invoke-Stampit.ps1
  Test-CommitMessage.ps1
  Test-CommitPolicy.ps1
  Test-PullRequestReadiness.ps1
  Test-PushPolicy.ps1
stampit.config.ps1
```

### 2. Fill in `stampit.config.ps1`

Edit `stampit.config.ps1` at the repo root and set your ADO org, project, area path, and iteration path.

### 3. Install git hooks (once per clone)

```powershell
./scripts/Install-GitHooks.ps1
```

This runs `git config core.hooksPath .githooks`, activating commit-msg and pre-push enforcement locally.

### 4. Set your ADO PAT

```powershell
$env:AZDO_PAT = '<your-pat>'
```

The PAT needs: **Work Items (Read & Write)**, **Code (Read & Write)**, **Pull Requests (Read & Write)**.

---

## Usage

### Trigger the full workflow

```powershell
./scripts/Invoke-Stampit.ps1
```

Or use the `stampit` phrase as a trigger in your AI coding agent session.

### Dry run (no mutations)

```powershell
./scripts/Invoke-Stampit.ps1 -WhatIfOnly
```

### Skip follow-up task scan

```powershell
./scripts/Invoke-Stampit.ps1 -SkipFollowUpScan
```

### Auto work items (skip per-bundle confirmation prompts)

```powershell
./scripts/Invoke-Stampit.ps1 -AutoWorkItems
```

---

## Customisation

### File grouping heuristic

Edit `Get-TopicForFile` in `Invoke-Stampit.ps1` to match your project's folder structure.

### Work item types and branch types

Adjust `Get-WorkItemTypeForTopic` and `Get-BranchTypeForTopic` for your conventions.

### Generated artifact restrictions

Edit the `$generatedPattern` in `Test-CommitPolicy.ps1` to match any auto-generated files you want to gate.

### Governed doc patterns

Edit the `$governedDocPattern` in `Test-CommitPolicy.ps1` to define which doc changes require instruction file updates.

---

## Enforcement Summary

| Gate | Script | Trigger |
|---|---|---|
| Commit message requires `AB#<id>` | `Test-CommitMessage.ps1` | `commit-msg` git hook |
| Branch naming + protected branch guard | `Test-CommitPolicy.ps1` | Called by `Invoke-Stampit.ps1` |
| No direct push to `main`/`release/*` | `Test-PushPolicy.ps1` | `pre-push` git hook |
| PR readiness before PR creation | `Test-PullRequestReadiness.ps1` | Called by `Invoke-Stampit.ps1` + `pre-push` |

---

## Forbidden Operations

- `git commit` without going through `Invoke-Stampit.ps1`.
- `git push --force` under any circumstances.
- Direct commits to `main` or `release/*`.
- Bypassing `Test-CommitPolicy.ps1` or `Test-PullRequestReadiness.ps1`.
- Creating commits without a linked ADO work item (`AB#<id>`).

---

## Environment Variables

| Variable | Purpose |
|---|---|
| `AZDO_PAT` | ADO Personal Access Token (required) |
| `REPO_ALLOW_PROTECTED_BRANCH_COMMIT` | Set to `1` to override protected-branch commit block (emergency only) |
| `REPO_ALLOW_PROTECTED_BRANCH_PUSH` | Set to `1` to override protected-branch push block (emergency only) |
| `REPO_ALLOW_GENERATED_ARTIFACTS` | Set to `1` to allow generated artifact files in commits |

---

## Requirements

- PowerShell 7+ (`pwsh`)
- Git 2.28+
- Azure DevOps account with a PAT
- `git config core.hooksPath .githooks` (handled by `Install-GitHooks.ps1`)
