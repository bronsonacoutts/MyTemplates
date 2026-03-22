<#
.SYNOPSIS
Validates local branch and change-set readiness before opening a pull request.

.PARAMETER SourceBranch
Source branch to validate. Defaults to current branch.

.PARAMETER TargetBranch
Target branch for the PR. Defaults to main.

.PARAMETER AllowGeneratedArtifacts
Allows generated timestamped/latest files in the change-set.

.PARAMETER RequireTrackedChanges
Fails when there are no tracked or staged file changes. Default: true.

.EXAMPLE
./scripts/Test-PullRequestReadiness.ps1

.EXAMPLE
./scripts/Test-PullRequestReadiness.ps1 -TargetBranch release/1.0.0 -AllowGeneratedArtifacts
#>

[CmdletBinding()]
param(
    [Parameter()]
    [string]$SourceBranch,

    [Parameter()]
    [string]$TargetBranch = 'main',

    [Parameter()]
    [switch]$AllowGeneratedArtifacts,

    [Parameter()]
    [switch]$RequireTrackedChanges = $true
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Write-Info { param([string]$Message) Write-Host "[INFO] $Message" -ForegroundColor Cyan }
function Write-Fail { param([string]$Message) Write-Host "[FAIL] $Message" -ForegroundColor Red }

function Get-CurrentBranch {
    $branch = (git rev-parse --abbrev-ref HEAD).Trim()
    if ([string]::IsNullOrWhiteSpace($branch)) { throw 'Unable to resolve current branch.' }
    return $branch
}

function Test-BranchName {
    param([string]$Branch)
    $patterns = @(
        '^(feature|bugfix|hotfix|chore)/[0-9]+-[a-z0-9][a-z0-9-]*$',
        '^release/[a-z0-9][a-z0-9.\-]*$'
    )
    foreach ($pattern in $patterns) {
        if ($Branch -match $pattern) { return $true }
    }
    return $false
}

function Get-ChangedFiles {
    param([string]$TargetRef = 'main')
    $allLines = [System.Collections.Generic.List[string]]::new()
    $staged    = git diff --name-only --cached 2>$null
    if ($staged)    { foreach ($l in ($staged    -split "`n")) { $allLines.Add($l) } }
    $unstaged  = git diff --name-only 2>$null
    if ($unstaged)  { foreach ($l in ($unstaged  -split "`n")) { $allLines.Add($l) } }
    $committed = git diff --name-only "$TargetRef...HEAD" 2>$null
    if ($committed) { foreach ($l in ($committed -split "`n")) { $allLines.Add($l) } }
    $result = [string[]]($allLines |
        ForEach-Object { $_.Trim() } |
        Where-Object   { -not [string]::IsNullOrWhiteSpace($_) } |
        Sort-Object -Unique)
    if ($null -eq $result) { return [string[]]@() }
    return $result
}

if ([string]::IsNullOrWhiteSpace($SourceBranch)) { $SourceBranch = Get-CurrentBranch }

Write-Info "Validating PR readiness: $SourceBranch -> $TargetBranch"

$errors = New-Object System.Collections.Generic.List[string]

if (-not (Test-BranchName -Branch $SourceBranch)) {
    $errors.Add("Source branch '$SourceBranch' does not match repository naming rules (feature|bugfix|hotfix|chore/<id>-<slug>).")
}

$files = [string[]](Get-ChangedFiles -TargetRef $TargetBranch)
if ($null -eq $files) { $files = [string[]]@() }

if ($RequireTrackedChanges -and $files.Count -eq 0) {
    $errors.Add('No tracked or staged changes found for PR.')
}

if (-not $AllowGeneratedArtifacts) {
    $generatedPattern = '(_latest\.(csv|json|xml)$|_\d{4}-\d{2}-\d{2}\.(csv|json|xml)$|reports/.+\.md$)'
    $generatedFound   = [string[]]@($files | Where-Object { $_ -match $generatedPattern })
    if ($generatedFound.Count -gt 0) {
        $errors.Add("Generated artifacts detected in change-set: $($generatedFound -join ', '). Use -AllowGeneratedArtifacts to override.")
    }
}

if ($errors.Count -gt 0) {
    foreach ($errorText in $errors) { Write-Fail $errorText }
    throw "PR readiness failed with $($errors.Count) issue(s)."
}

Write-Host '[PASS] PR readiness checks passed.' -ForegroundColor Green
