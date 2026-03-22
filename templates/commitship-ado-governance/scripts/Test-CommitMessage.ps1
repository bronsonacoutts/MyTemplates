<#
.SYNOPSIS
Validates commit message traceability requirements.

.DESCRIPTION
Requires an Azure DevOps work item reference (AB#1234) in every commit
message. Only automated Merge and Revert commits are exempt.

.PARAMETER MessageFile
Path to commit message file passed by the commit-msg hook.

.EXAMPLE
./scripts/Test-CommitMessage.ps1 -MessageFile .git/COMMIT_EDITMSG
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$MessageFile
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $MessageFile)) {
    throw "Commit message file not found: $MessageFile"
}

$message = (Get-Content -LiteralPath $MessageFile -Raw).Trim()
if ([string]::IsNullOrWhiteSpace($message)) {
    throw 'Commit message is empty.'
}

# Allow automated merge and revert commits without work item reference.
if ($message -match '^(Merge|Revert)\b') {
    Write-Host '[PASS] Merge/Revert commit — traceability check skipped.' -ForegroundColor Green
    return
}

if ($message -notmatch 'AB#[0-9]+') {
    throw @"
Commit message must include an ADO work item reference (AB#1234).
All commits must be made via scripts/Invoke-Commitship.ps1 which ensures this automatically.
"@
}

Write-Host '[PASS] Commit message traceability check passed.' -ForegroundColor Green
