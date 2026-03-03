<#
.SYNOPSIS
Installs the Stampit git hooks for local enforcement.

.DESCRIPTION
Configures git to use the .githooks/ directory as the active hooks path.
This enforces commit-msg and pre-push policies locally, requiring all
commits to be made via scripts/Invoke-Stampit.ps1.

Run once after cloning or re-cloning the repository.

.EXAMPLE
./scripts/Install-GitHooks.ps1
#>

[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$repoRoot  = (git rev-parse --show-toplevel).Trim()
$hooksPath = Join-Path $repoRoot '.githooks'

if (-not (Test-Path -LiteralPath $hooksPath)) {
    throw ".githooks/ directory not found at '$hooksPath'. Ensure this template has been copied to your repository root."
}

git config core.hooksPath .githooks

Write-Host '[PASS] Git hooks installed.' -ForegroundColor Green
Write-Host "       Hooks path : $hooksPath" -ForegroundColor Cyan
Write-Host '       Active hooks: commit-msg, pre-push' -ForegroundColor Cyan
Write-Host '       All commits must be made via: scripts/Invoke-Stampit.ps1' -ForegroundColor Yellow
