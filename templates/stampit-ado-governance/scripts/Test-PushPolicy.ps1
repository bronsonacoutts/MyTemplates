<#
.SYNOPSIS
Validates repository policy compliance before push.

.DESCRIPTION
Checks:
- Blocks direct pushes to protected branches by default.
- Runs PR readiness checks for the current branch.

.EXAMPLE
./scripts/Test-PushPolicy.ps1
#>

[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Get-CurrentBranch { return (git rev-parse --abbrev-ref HEAD).Trim() }

$branch      = Get-CurrentBranch
$isProtected = $branch -eq 'main' -or ($branch -match '^release/[a-z0-9][a-z0-9.\-]*$')

if ($isProtected -and [string]::IsNullOrWhiteSpace($env:REPO_ALLOW_PROTECTED_BRANCH_PUSH)) {
    throw "Direct push to protected branch '$branch' is blocked. Use PR flow. Set REPO_ALLOW_PROTECTED_BRANCH_PUSH=1 to override intentionally."
}

if ($isProtected) {
    Write-Host "[WARN] Protected branch override active for '$branch'. Skipping PR-readiness check." -ForegroundColor Yellow
    Write-Host '[PASS] Push policy checks passed.' -ForegroundColor Green
    return
}

& "$PSScriptRoot/Test-PullRequestReadiness.ps1" -SourceBranch $branch -RequireTrackedChanges:$false

Write-Host '[PASS] Push policy checks passed.' -ForegroundColor Green
