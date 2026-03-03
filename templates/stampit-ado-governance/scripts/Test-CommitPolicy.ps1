<#
.SYNOPSIS
Validates repository policy compliance for commits.

.DESCRIPTION
Checks:
- Branch naming strategy compliance.
- Protected branch direct-commit guardrails.
- Staged generated-artifact restrictions.
- Instruction file sync when governed documentation is changed.
- PowerShell syntax validation for staged .ps1 files.

.PARAMETER Scope
`Staged` (default) validates staged changes; `All` validates all tracked files.

.EXAMPLE
./scripts/Test-CommitPolicy.ps1

.EXAMPLE
./scripts/Test-CommitPolicy.ps1 -Scope All
#>

[CmdletBinding()]
param(
    [Parameter()]
    [ValidateSet('Staged', 'All')]
    [string]$Scope = 'Staged'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# ---------------------------------------------------------------------------
# CUSTOMISE: adjust these patterns to match your project structure.
# ---------------------------------------------------------------------------

# Pattern for auto-generated files that should not be committed without an
# explicit override (set REPO_ALLOW_GENERATED_ARTIFACTS=1 to bypass).
$generatedPattern = '(_latest\.(csv|json|xml)$|_\d{4}-\d{2}-\d{2}\.(csv|json|xml)$|reports/.+\.md$)'

# Governed documentation pattern: changes to these files must also update
# the AI agent instruction files in .github/ in the same commit.
# CUSTOMISE: update path segments to match your documentation structure.
$governedDocPattern = '^docs/(architecture|security|governance|operations|delivery)/.+\.md$'

# ---------------------------------------------------------------------------

function Write-Info { param([string]$Message) Write-Host "[INFO] $Message" -ForegroundColor Cyan }
function Write-Fail { param([string]$Message) Write-Host "[FAIL] $Message" -ForegroundColor Red }

function Get-CurrentBranch { return (git rev-parse --abbrev-ref HEAD).Trim() }

function Get-ChangedFiles {
    param([string]$Mode)
    if ($Mode -eq 'All') { $lines = git ls-files }
    else { $lines = git diff --cached --name-only --diff-filter=ACMR }
    if (-not $lines) { return @() }
    return @($lines -split "`n" | ForEach-Object { $_.Trim() } | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
}

$errors = New-Object 'System.Collections.Generic.List[string]'
$branch = Get-CurrentBranch
Write-Info "Validating commit policy on branch '$branch'"

$workBranchPattern = '^(feature|bugfix|hotfix|chore)/[0-9]+-[a-z0-9][a-z0-9-]*$'
$releasePattern    = '^release/[a-z0-9][a-z0-9.\-]*$'
$isMain            = $branch -eq 'main'
$isRelease         = $branch -match $releasePattern

if (-not ($branch -match $workBranchPattern -or $isMain -or $isRelease)) {
    $errors.Add("Branch '$branch' does not match the required naming strategy (feature|bugfix|hotfix|chore/<id>-<slug> or release/<version>).")
}

if (($isMain -or $isRelease) -and [string]::IsNullOrWhiteSpace($env:REPO_ALLOW_PROTECTED_BRANCH_COMMIT)) {
    $errors.Add('Direct commits to protected branches are blocked. Use a work branch and PR flow. Set REPO_ALLOW_PROTECTED_BRANCH_COMMIT=1 to override intentionally.')
}

$files = @(Get-ChangedFiles -Mode $Scope)
if ($Scope -eq 'Staged' -and $files.Count -eq 0) {
    $errors.Add('No staged files found for commit.')
}

$generated = @($files | Where-Object { $_ -match $generatedPattern })
if ($generated.Count -gt 0 -and [string]::IsNullOrWhiteSpace($env:REPO_ALLOW_GENERATED_ARTIFACTS)) {
    $errors.Add("Generated/report artifacts detected: $($generated -join ', '). Set REPO_ALLOW_GENERATED_ARTIFACTS=1 to override.")
}

$governedDocChanged = @($files | Where-Object { $_ -match $governedDocPattern })
if ($governedDocChanged.Count -gt 0) {
    $requiredFiles = @('.github/copilot-instructions.md', '.github/agent-instructions.md')
    foreach ($reqFile in $requiredFiles) {
        if ($reqFile -notin $files) {
            $errors.Add("Governed doc changed but '$reqFile' is not included in the same commit.")
        }
    }
}

$psFiles = @($files | Where-Object { $_.ToLowerInvariant().EndsWith('.ps1') })
foreach ($psFile in $psFiles) {
    if (-not (Test-Path -LiteralPath $psFile)) { continue }
    try {
        $content = Get-Content -LiteralPath $psFile -Raw
        [void][scriptblock]::Create($content)
    }
    catch {
        $errors.Add("PowerShell syntax error in '$psFile': $($_.Exception.Message)")
    }
}

if ($errors.Count -gt 0) {
    foreach ($errorText in $errors) { Write-Fail $errorText }
    throw "Commit policy validation failed with $($errors.Count) issue(s)."
}

Write-Host '[PASS] Commit policy checks passed.' -ForegroundColor Green
