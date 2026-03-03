<#
.SYNOPSIS
Stamps pending workspace changes into one or more governed commits, branches, work items, and PRs.

.DESCRIPTION
"Stampit" is the single-phrase trigger for the full governed commit-and-ship workflow.

When invoked, this script:
  1. Inspects all dirty (unstaged, staged, and untracked) files in the workspace.
  2. Groups them into logical commit bundles based on topic area (heuristic + user confirmation).
  3. For each bundle:
     a. Determines or creates an ADO work item (Task / Bug / Feature / User Story) with enriched
        title, description, area path, iteration path, and tags.
     b. If a work item is created, sets its state to Active.
     c. Creates a strategy-compliant branch (feature|bugfix|hotfix|chore/<id>-<slug>).
     d. Stages the files belonging to that bundle.
     e. Runs Test-CommitPolicy.ps1 to validate before committing.
     f. Commits with AB#<id> embedded in the message.
     g. Pushes the branch to origin (no force).
     h. Runs Test-PullRequestReadiness.ps1.
     i. Opens a PR against the target branch via ADO REST API.
     j. Links the work item to the commit (Fixed in Commit) and to the PR.
     k. Advances work item state appropriately.
  4. Identifies potential follow-up tasks and offers to create backlog work items.

Permissions respected: no force push, no bypass of policy checks, no direct commits to main/release/*.

When in doubt at any step, the script pauses and asks the user explicitly before proceeding.

.PARAMETER Organization
Azure DevOps organisation name. Overrides stampit.config.ps1.

.PARAMETER Project
Azure DevOps project name. Overrides stampit.config.ps1.

.PARAMETER RepositoryName
ADO repository name. Overrides stampit.config.ps1. Defaults to auto-detection from git remote.

.PARAMETER TeamName
ADO team name used for active-sprint iteration lookup. Overrides stampit.config.ps1.

.PARAMETER TargetBranch
Branch that PRs will target. Defaults to 'main'.

.PARAMETER AreaPath
Default area path for new work items. Overrides stampit.config.ps1.

.PARAMETER IterationPath
Default iteration path for new work items. Overrides stampit.config.ps1.

.PARAMETER Pat
Azure DevOps PAT. Optional if AZDO_PAT environment variable is set.

.PARAMETER WhatIfOnly
Dry-run: describes all intended actions without executing any git or ADO mutations.

.PARAMETER SkipFollowUpScan
Suppresses the follow-up task detection pass at the end.

.PARAMETER AutoWorkItems
When set, work items are created automatically without individual field-level prompts.
Does NOT suppress the pre-execution grouping confirmation.

.EXAMPLE
# Triggered by the 'stampit' phrase — interactive, confirms everything
./scripts/Invoke-Stampit.ps1

.EXAMPLE
# Dry run — see what would happen without touching anything
./scripts/Invoke-Stampit.ps1 -WhatIfOnly

.EXAMPLE
# Override org/project from command line (e.g. first run in a new environment)
./scripts/Invoke-Stampit.ps1 -Organization 'myorg' -Project 'MyProject'
#>

[CmdletBinding(SupportsShouldProcess)]
param(
    [Parameter()] [string]$Organization,
    [Parameter()] [string]$Project,
    [Parameter()] [string]$RepositoryName,
    [Parameter()] [string]$TeamName,
    [Parameter()] [string]$TargetBranch,
    [Parameter()] [string]$AreaPath,
    [Parameter()] [string]$IterationPath,
    [Parameter()] [string]$Pat,
    [Parameter()] [switch]$WhatIfOnly,
    [Parameter()] [switch]$SkipFollowUpScan,
    [Parameter()] [switch]$AutoWorkItems
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSCommandPath

# ---------------------------------------------------------------------------
# Load stampit.config.ps1 (next to script, or at repo root)
# ---------------------------------------------------------------------------
function Import-StampitConfig {
    $candidates = @(
        (Join-Path $root 'stampit.config.ps1'),
        (Join-Path (git rev-parse --show-toplevel 2>$null).Trim() 'stampit.config.ps1')
    )
    foreach ($c in $candidates) {
        if (Test-Path -LiteralPath $c) {
            Write-Info "Loading config from: $c"
            return (& $c)
        }
    }
    return $null
}

function Apply-Config {
    param($cfg)
    if ($null -eq $cfg) { return }
    # Only apply where the caller has not provided an explicit override
    if ([string]::IsNullOrWhiteSpace($script:Organization))   { $script:Organization   = $cfg.Organization }
    if ([string]::IsNullOrWhiteSpace($script:Project))        { $script:Project        = $cfg.Project }
    if ([string]::IsNullOrWhiteSpace($script:RepositoryName)) { $script:RepositoryName = $cfg.RepositoryName }
    if ([string]::IsNullOrWhiteSpace($script:TeamName))       { $script:TeamName       = $cfg.TeamName }
    if ([string]::IsNullOrWhiteSpace($script:TargetBranch))   { $script:TargetBranch   = $cfg.TargetBranch }
    if ([string]::IsNullOrWhiteSpace($script:AreaPath))       { $script:AreaPath       = $cfg.AreaPath }
    if ([string]::IsNullOrWhiteSpace($script:IterationPath))  { $script:IterationPath  = $cfg.IterationPath }
}

# ---------------------------------------------------------------------------
# Output helpers
# ---------------------------------------------------------------------------
function Write-Info  { param([string]$M) Write-Host "[INFO]  $M" -ForegroundColor Cyan }
function Write-Ok    { param([string]$M) Write-Host "[OK]    $M" -ForegroundColor Green }
function Write-Warn  { param([string]$M) Write-Host "[WARN]  $M" -ForegroundColor Yellow }
function Write-Fail  { param([string]$M) Write-Host "[FAIL]  $M" -ForegroundColor Red }
function Write-Step  { param([string]$M) Write-Host "`n>>> $M" -ForegroundColor Magenta }
function Write-Dry   { param([string]$M) Write-Host "[DRY]   $M" -ForegroundColor DarkGray }

# ---------------------------------------------------------------------------
# PAT / auth
# ---------------------------------------------------------------------------
function Get-PatValue {
    if (-not [string]::IsNullOrWhiteSpace($Pat)) { return $Pat }
    $fromEnv = [Environment]::GetEnvironmentVariable('AZDO_PAT')
    if (-not [string]::IsNullOrWhiteSpace($fromEnv)) { return $fromEnv }
    throw "No PAT found. Pass -Pat or set `$env:AZDO_PAT."
}

function New-AuthHeader {
    param([string]$Token)
    $bytes = [Text.Encoding]::ASCII.GetBytes(":$Token")
    return @{ Authorization = "Basic $([Convert]::ToBase64String($bytes))"; 'Content-Type' = 'application/json' }
}

# ---------------------------------------------------------------------------
# ADO REST helpers
# ---------------------------------------------------------------------------
function Invoke-AdoGet   { param([string]$Uri, [hashtable]$Headers) Invoke-RestMethod -Uri $Uri -Headers $Headers -Method Get -ErrorAction Stop }
function Invoke-AdoPost  { param([string]$Uri, [hashtable]$Headers, [string]$Body) Invoke-RestMethod -Uri $Uri -Headers $Headers -Method Post -Body $Body -ErrorAction Stop }
function Invoke-AdoPatch {
    param([string]$Uri, [hashtable]$Headers, [string]$Body, [string]$ContentType = 'application/json-patch+json')
    $h = $Headers.Clone()
    $h['Content-Type'] = $ContentType
    Invoke-RestMethod -Uri $Uri -Headers $h -Method Patch -Body $Body -ErrorAction Stop
}

function Get-RepoId {
    param([hashtable]$Headers)

    # Auto-detect from git remote if RepositoryName not set
    if ([string]::IsNullOrWhiteSpace($script:RepositoryName)) {
        $remoteUrl = (git remote get-url origin 2>$null).Trim()
        if ($remoteUrl -match '/([^/]+?)(?:\.git)?$') {
            $script:RepositoryName = $Matches[1]
            Write-Info "Auto-detected repository name from remote: $($script:RepositoryName)"
        }
    }

    if ([string]::IsNullOrWhiteSpace($script:RepositoryName)) {
        throw "Unable to determine repository name. Set RepositoryName in stampit.config.ps1 or pass -RepositoryName."
    }

    $uri    = "https://dev.azure.com/$script:Organization/$script:Project/_apis/git/repositories?api-version=7.1"
    $result = Invoke-AdoGet -Uri $uri -Headers $Headers
    $repo   = $result.value | Where-Object { $_.name -eq $script:RepositoryName } | Select-Object -First 1
    if (-not $repo) { throw "Repository '$($script:RepositoryName)' not found in project '$script:Project'." }
    return $repo.id
}

function Get-CurrentIterationPath {
    param([hashtable]$Headers)
    if ([string]::IsNullOrWhiteSpace($script:TeamName)) { return $script:IterationPath }
    try {
        $uri    = "https://dev.azure.com/$script:Organization/$script:Project/$($script:TeamName)/_apis/work/teamsettings/iterations?`$timeframe=current&api-version=7.1"
        $result = Invoke-AdoGet -Uri $uri -Headers $Headers
        if ($result.value -and $result.value.Count -gt 0) { return $result.value[0].path }
    }
    catch { <# fall through to default #> }
    return $script:IterationPath
}

function New-AdoWorkItemObject {
    param(
        [hashtable]$Headers,
        [string]$WorkItemType,
        [string]$Title,
        [string]$Description,
        [string]$AcceptanceCriteria,
        [string]$Tags,
        [int]$Priority = 2,
        [string]$ResolvedIterationPath
    )
    $ops = [System.Collections.Generic.List[object]]::new()
    function Add-Op { param([string]$f, $v) if (-not [string]::IsNullOrWhiteSpace("$v")) { $ops.Add(@{ op='add'; path="/fields/$f"; value=$v }) } }

    Add-Op 'System.Title'                             $Title
    Add-Op 'System.Description'                       $Description
    Add-Op 'Microsoft.VSTS.Common.AcceptanceCriteria' $AcceptanceCriteria
    Add-Op 'System.AreaPath'                          $script:AreaPath
    Add-Op 'System.IterationPath'                     ($ResolvedIterationPath ?? $script:IterationPath)
    Add-Op 'System.Tags'                              $Tags
    Add-Op 'Microsoft.VSTS.Common.Priority'           $Priority

    $typeSeg = [Uri]::EscapeDataString($WorkItemType)
    $uri     = "https://dev.azure.com/$script:Organization/$script:Project/_apis/wit/workitems/`$$typeSeg`?api-version=7.1"
    $body    = $ops | ConvertTo-Json -Depth 5

    if ($WhatIfOnly) {
        Write-Dry "Would create ${WorkItemType}: '${Title}'"
        return [pscustomobject]@{ id = 0; url = '' }
    }
    Invoke-AdoPatch -Uri $uri -Headers $Headers -Body $body
}

function Set-AdoWorkItemState {
    param([hashtable]$Headers, [int]$Id, [string]$State)
    if ($WhatIfOnly) { Write-Dry "Would set WI $Id state -> $State"; return }
    $ops = @(@{ op='add'; path='/fields/System.State'; value=$State })
    $uri = "https://dev.azure.com/$script:Organization/$script:Project/_apis/wit/workItems/$Id`?api-version=7.1"
    Invoke-AdoPatch -Uri $uri -Headers $Headers -Body ($ops | ConvertTo-Json) | Out-Null
}

function Add-CommitArtifactLink {
    param([hashtable]$Headers, [int]$WorkItemId, [string]$CommitSha, [string]$RepoId, [string]$ProjectId)
    $artifactUri = "vstfs:///Git/Commit/$ProjectId%2F$RepoId%2F$CommitSha"
    $ops = @(@{
        op    = 'add'
        path  = '/relations/-'
        value = @{ rel = 'ArtifactLink'; url = $artifactUri; attributes = @{ name = 'Fixed in Commit' } }
    })
    if ($WhatIfOnly) { Write-Dry "Would add Fixed-in-Commit link on WI $WorkItemId for $CommitSha"; return }
    $uri = "https://dev.azure.com/$script:Organization/$script:Project/_apis/wit/workItems/$WorkItemId`?api-version=7.1"
    Invoke-AdoPatch -Uri $uri -Headers $Headers -Body ($ops | ConvertTo-Json -Depth 6) | Out-Null
}

function Add-PrArtifactLink {
    param([hashtable]$Headers, [int]$WorkItemId, [int]$PrId, [string]$RepoId, [string]$ProjectId)
    $artifactUri = "vstfs:///Git/PullRequestId/$ProjectId%2F$RepoId%2F$PrId"
    $ops = @(@{
        op    = 'add'
        path  = '/relations/-'
        value = @{ rel = 'ArtifactLink'; url = $artifactUri; attributes = @{ name = 'Pull Request' } }
    })
    if ($WhatIfOnly) { Write-Dry "Would add PR artifact link on WI $WorkItemId for PR $PrId"; return }
    $uri = "https://dev.azure.com/$script:Organization/$script:Project/_apis/wit/workItems/$WorkItemId`?api-version=7.1"
    Invoke-AdoPatch -Uri $uri -Headers $Headers -Body ($ops | ConvertTo-Json -Depth 6) | Out-Null
}

function New-AdoPullRequest {
    param(
        [hashtable]$Headers,
        [string]$RepoId,
        [string]$SourceBranch,
        [string]$Title,
        [string]$Description,
        [int]$WorkItemId
    )
    $body = @{
        title         = $Title
        description   = $Description
        sourceRefName = "refs/heads/$SourceBranch"
        targetRefName = "refs/heads/$script:TargetBranch"
        isDraft       = $false
        workItemRefs  = if ($WorkItemId -gt 0) { @(@{ id = "$WorkItemId" }) } else { @() }
    } | ConvertTo-Json -Depth 5

    $uri = "https://dev.azure.com/$script:Organization/$script:Project/_apis/git/repositories/$RepoId/pullrequests?api-version=7.1"

    if ($WhatIfOnly) {
        Write-Dry "Would create PR: '$Title' ($SourceBranch -> $($script:TargetBranch))"
        return [pscustomobject]@{ pullRequestId = 0; _links = @{ web = @{ href = '' } } }
    }
    Invoke-AdoPost -Uri $uri -Headers $Headers -Body $body
}

# ---------------------------------------------------------------------------
# Git helpers
# ---------------------------------------------------------------------------
function Get-CurrentBranch { (git rev-parse --abbrev-ref HEAD 2>$null).Trim() }

function Get-DirtyFiles {
    $result = [System.Collections.Generic.List[pscustomobject]]::new()
    $lines  = git status --porcelain 2>$null
    if (-not $lines) { return $result }
    foreach ($line in ($lines -split "`n")) {
        $line = $line.TrimEnd()
        if ([string]::IsNullOrWhiteSpace($line)) { continue }
        $xy   = $line.Substring(0, 2)
        $path = $line.Substring(3).Trim().Trim('"')
        if ($path -match ' -> (.+)$') { $path = $Matches[1] }
        $result.Add([pscustomobject]@{ Status = $xy; Path = $path })
    }
    return $result
}

function Convert-ToSlug {
    param([string]$Text)
    $s = $Text.ToLowerInvariant() -replace '[^a-z0-9]+', '-'
    return $s.Trim('-').Substring(0, [Math]::Min($s.Trim('-').Length, 50))
}

# ---------------------------------------------------------------------------
# Logical grouping heuristic
# CUSTOMISE: adjust Get-TopicForFile to match your project folder structure.
# ---------------------------------------------------------------------------
function Get-TopicForFile {
    param([string]$FilePath)
    switch -Regex ($FilePath) {
        '^\.github/'                { return 'governance-instructions' }
        '^scripts/.*\.ps1$'        { return 'tooling-scripts'         }
        '^scripts/.*\.(csv|json)$' { return 'project-artifacts'       }
        '^docs/architecture/'      { return 'architecture-docs'        }
        '^docs/security/'          { return 'security-docs'            }
        '^docs/governance/'        { return 'governance-docs'          }
        '^docs/delivery/'          { return 'delivery-docs'            }
        '^docs/operations/'        { return 'operations-docs'          }
        '^docs/'                   { return 'general-docs'             }
        '^(azure-pipelines|\.github/workflows)' { return 'pipeline-config' }
        '^(package\.json|README|\.editorconfig|tsconfig)' { return 'project-root-config' }
        '^src/'                    { return 'application-code'         }
        '^test/'                   { return 'test-code'                }
        default                    { return 'misc'                     }
    }
}

function Get-WorkItemTypeForTopic {
    param([string]$Topic, [string]$BranchType)
    if ($BranchType -eq 'bugfix') { return 'Bug' }
    switch ($Topic) {
        'application-code' { return 'Feature'    }
        'test-code'        { return 'Task'        }
        default            { return 'Task'        }
    }
}

function Get-BranchTypeForTopic {
    param([string]$Topic)
    switch ($Topic) {
        'tooling-scripts'         { return 'feature' }
        'application-code'        { return 'feature' }
        'pipeline-config'         { return 'feature' }
        'project-artifacts'       { return 'chore'   }
        'governance-instructions' { return 'chore'   }
        default                   { return 'chore'   }
    }
}

function Get-SuggestedTitle {
    param([string]$Topic, [pscustomobject[]]$Files)
    $count = $Files.Count
    $pl    = if ($count -ne 1) { 's' } else { '' }
    switch ($Topic) {
        'governance-instructions' { return "Update governance instruction files ($count file$pl)"     }
        'tooling-scripts'         { return "Update tooling scripts ($count file$pl)"                  }
        'project-artifacts'       { return "Update project artifacts ($count file$pl)"                }
        'architecture-docs'       { return "Update architecture documentation ($count file$pl)"       }
        'security-docs'           { return "Update security documentation ($count file$pl)"           }
        'governance-docs'         { return "Update governance documentation ($count file$pl)"         }
        'delivery-docs'           { return "Update delivery documentation ($count file$pl)"           }
        'operations-docs'         { return "Update operations documentation ($count file$pl)"         }
        'general-docs'            { return "Update project documentation ($count file$pl)"            }
        'pipeline-config'         { return "Update pipeline configuration ($count file$pl)"           }
        'application-code'        { return "Update application source code ($count file$pl)"          }
        'test-code'               { return "Update test code ($count file$pl)"                        }
        'project-root-config'     { return "Update project root configuration ($count file$pl)"       }
        default                   { return "Miscellaneous workspace changes ($count file$pl)"         }
    }
}

function Get-SuggestedDescription {
    param([string]$Topic, [pscustomobject[]]$Files)
    $fileList = ($Files | ForEach-Object { "  - $($_.Path)  [$($_.Status.Trim())]" }) -join "`n"
    return "Changes in topic area: $Topic.`n`nAffected files:`n$fileList`n`nGenerated by Invoke-Stampit.ps1 on $(Get-Date -Format 'yyyy-MM-dd HH:mm')."
}

# ---------------------------------------------------------------------------
# User confirmation helpers
# ---------------------------------------------------------------------------
function Read-UserInput {
    param([string]$Prompt, [string]$Default = '')
    $display = if ([string]::IsNullOrWhiteSpace($Default)) { $Prompt } else { "$Prompt [$Default]" }
    $val = Read-Host $display
    if ([string]::IsNullOrWhiteSpace($val)) { return $Default }
    return $val
}

function Confirm-Yn {
    param([string]$Question)
    $ans = Read-Host "$Question (y/n)"
    return $ans -match '^[yY]'
}

# ---------------------------------------------------------------------------
# Follow-up task detection
# ---------------------------------------------------------------------------
function Get-FollowUpSuggestions {
    param([pscustomobject[]]$AllFiles)
    $suggestions = [System.Collections.Generic.List[pscustomobject]]::new()

    $newPs1 = @($AllFiles | Where-Object { $_.Path -match '^scripts/.+\.ps1$' -and $_.Status -match '^\?' })
    if ($newPs1.Count -gt 0) {
        $suggestions.Add([pscustomobject]@{
            Title       = "Add tests for new script(s): $($newPs1.Path -join ', ')"
            Description = "New PowerShell scripts were added but no corresponding test files were detected. Consider adding Pester tests."
            Tags        = 'auto-created;follow-up;testing'
            Type        = 'Task'
        })
    }

    $archDocs   = @($AllFiles | Where-Object { $_.Path -match '^docs/architecture/' })
    $instrFiles = @($AllFiles | Where-Object { $_.Path -match '\.github/(copilot|agent)-instructions' })
    if ($archDocs.Count -gt 0 -and $instrFiles.Count -eq 0) {
        $suggestions.Add([pscustomobject]@{
            Title       = 'Review and sync instruction files after architecture doc changes'
            Description = 'Architecture documentation was modified. Verify that .github/copilot-instructions.md and .github/agent-instructions.md reflect any impacted guidance.'
            Tags        = 'auto-created;follow-up;governance'
            Type        = 'Task'
        })
    }

    $pipelineFiles = @($AllFiles | Where-Object { $_.Path -match '^(azure-pipelines|\.github/workflows)' })
    if ($pipelineFiles.Count -gt 0) {
        $suggestions.Add([pscustomobject]@{
            Title       = 'Validate pipeline changes after merge'
            Description = 'Pipeline or workflow configuration was modified. After merging, trigger a test run and verify all stages pass before promoting to upper environments.'
            Tags        = 'auto-created;follow-up;pipeline'
            Type        = 'Task'
        })
    }

    return $suggestions
}

# ===========================================================================
# MAIN EXECUTION
# ===========================================================================

# Load config then apply parameter overrides
$cfg = Import-StampitConfig
Apply-Config $cfg

# Set defaults for anything still absent
if ([string]::IsNullOrWhiteSpace($TargetBranch))   { $script:TargetBranch   = 'main' }
if ([string]::IsNullOrWhiteSpace($IterationPath))  { $script:IterationPath  = "$Project\Backlog" }

# Validate required config
if ([string]::IsNullOrWhiteSpace($Organization)) { throw "Organization is required. Set it in stampit.config.ps1 or pass -Organization." }
if ([string]::IsNullOrWhiteSpace($Project))      { throw "Project is required. Set it in stampit.config.ps1 or pass -Project." }
if ([string]::IsNullOrWhiteSpace($AreaPath))     { throw "AreaPath is required. Set it in stampit.config.ps1 or pass -AreaPath." }

Write-Step 'STAMPIT — Governed Commit & Ship Workflow'
if ($WhatIfOnly) { Write-Warn 'DRY RUN: no git or ADO mutations will be made.' }

# 1. Guard: not on a protected branch
$currentBranch = Get-CurrentBranch
if ($currentBranch -match '^(main|release/.+)$') {
    Write-Warn "Currently on protected branch '$currentBranch'."
    Write-Info "Each commit bundle will be placed on its own new branch from '$TargetBranch'."
}

# 2. Collect dirty files
Write-Step 'Inspecting workspace changes'
$allDirty = Get-DirtyFiles
if ($allDirty.Count -eq 0) { Write-Ok 'Working tree is clean — nothing to stamp.'; exit 0 }
Write-Info "$($allDirty.Count) changed file(s) found."

# 3. Group by topic
$groups = [ordered]@{}
foreach ($f in $allDirty) {
    $topic = Get-TopicForFile -FilePath $f.Path
    if (-not $groups.Contains($topic)) { $groups[$topic] = [System.Collections.Generic.List[pscustomobject]]::new() }
    $groups[$topic].Add($f)
}

# 4. Present proposed groupings for confirmation
Write-Step 'Proposed commit groupings'
$groupKeys = @($groups.Keys)
for ($i = 0; $i -lt $groupKeys.Count; $i++) {
    $k = $groupKeys[$i]
    Write-Host "  [$($i+1)] Topic: $k ($($groups[$k].Count) file(s))" -ForegroundColor White
    foreach ($f in $groups[$k]) {
        Write-Host "        $($f.Status.Trim().PadRight(2))  $($f.Path)" -ForegroundColor DarkGray
    }
}

Write-Host ''
Write-Warn 'Each group becomes a separate branch + commit + PR.'
$proceed = Confirm-Yn 'Proceed with these groupings?'
if (-not $proceed) {
    Write-Info 'Grouping adjustment: enter a file path and the destination group number (blank to finish).'
    while ($true) {
        $move = Read-Host '  File to move (blank to finish)'
        if ([string]::IsNullOrWhiteSpace($move)) { break }
        $targetIdx = Read-Host "  Move to group number (1-$($groupKeys.Count)) or type a NEW group name"
        if ($targetIdx -match '^\d+$') {
            $idx = [int]$targetIdx - 1
            if ($idx -lt 0 -or $idx -ge $groupKeys.Count) { Write-Warn 'Invalid group number.'; continue }
            $destKey = $groupKeys[$idx]
        } else {
            $destKey = $targetIdx.Trim()
            if (-not $groups.Contains($destKey)) {
                $groups[$destKey] = [System.Collections.Generic.List[pscustomobject]]::new()
                $groupKeys = @($groups.Keys)
            }
        }
        foreach ($gk in $groupKeys) {
            $match = @($groups[$gk] | Where-Object { $_.Path -eq $move })
            if ($match.Count -gt 0) {
                $groups[$gk].Remove($match[0]) | Out-Null
                if ($groups[$gk].Count -eq 0) { $groups.Remove($gk); $groupKeys = @($groups.Keys) }
                break
            }
        }
        $groups[$destKey].Add([pscustomobject]@{ Status = '??'; Path = $move })
    }
}

# Remove empty groups
$emptyKeys = @($groups.Keys | Where-Object { $groups[$_].Count -eq 0 })
foreach ($ek in $emptyKeys) { $groups.Remove($ek) }
$groupKeys = @($groups.Keys)
if ($groupKeys.Count -eq 0) { Write-Ok 'No groups remaining. Exiting.'; exit 0 }

# 5. Authenticate
Write-Step 'Authenticating to Azure DevOps'
$patValue  = Get-PatValue
$headers   = New-AuthHeader -Token $patValue
$headers['Content-Type'] = 'application/json'

$repoId    = Get-RepoId -Headers $headers
Write-Ok "Repository ID: $repoId"

$projectInfo = Invoke-AdoGet -Uri "https://dev.azure.com/$Organization/_apis/projects/$Project`?api-version=7.1" -Headers $headers
$projectId   = $projectInfo.id
Write-Ok "Project ID: $projectId"

$resolvedIterPath = Get-CurrentIterationPath -Headers $headers
Write-Info "Iteration path: $resolvedIterPath"

# 6. Process each group
$processedBundles = [System.Collections.Generic.List[pscustomobject]]::new()

foreach ($topic in $groupKeys) {
    $files = @($groups[$topic])
    Write-Step "Processing bundle: $topic  ($($files.Count) file(s))"

    $suggestedBranchType = Get-BranchTypeForTopic -Topic $topic
    $suggestedWiType     = Get-WorkItemTypeForTopic -Topic $topic -BranchType $suggestedBranchType
    $suggestedTitle      = Get-SuggestedTitle -Topic $topic -Files $files
    $suggestedDesc       = Get-SuggestedDescription -Topic $topic -Files $files

    Write-Info "Suggested work item type : $suggestedWiType"
    Write-Info "Suggested title          : $suggestedTitle"

    if ($AutoWorkItems) {
        $wiType     = $suggestedWiType
        $wiTitle    = $suggestedTitle
        $wiDesc     = $suggestedDesc
        $wiTags     = 'auto-created;stampit'
        $wiAcText   = ''
        $doCreate   = $true
        $existingId = 0
    } else {
        Write-Host ''
        $existingIdStr = Read-UserInput "  Enter existing ADO work item ID to link (or press Enter to create a new one)" ''
        $existingId    = 0
        $doCreate      = $true

        if (-not [string]::IsNullOrWhiteSpace($existingIdStr) -and $existingIdStr -match '^\d+$') {
            $existingId = [int]$existingIdStr
            $doCreate   = $false
            Write-Info "Will link to existing work item #$existingId"
        } else {
            Write-Host ''
            $wiType   = Read-UserInput "  Work item type [Task / Bug / Feature / User Story]" $suggestedWiType
            $wiTitle  = Read-UserInput "  Title" $suggestedTitle
            $wiDesc   = Read-UserInput "  Description (Enter to accept auto-generated)" $suggestedDesc
            $wiAcText = Read-UserInput "  Acceptance criteria (optional)" ''
            $wiTags   = Read-UserInput "  Tags (semicolon separated)" 'auto-created;stampit'
            Write-Host ''
            Write-Host "  Type  : $wiType"  -ForegroundColor DarkCyan
            Write-Host "  Title : $wiTitle" -ForegroundColor DarkCyan
            Write-Host "  Tags  : $wiTags"  -ForegroundColor DarkCyan
            Write-Host ''
            $doCreate = Confirm-Yn '  Create this work item?'
            if (-not $doCreate) { Write-Warn "Skipping bundle '$topic' — no work item agreed."; continue }
        }
    }

    $wiId = $existingId
    if ($doCreate) {
        Write-Info "Creating ADO work item: [$wiType] $wiTitle"
        $wi   = New-AdoWorkItemObject -Headers $headers `
                    -WorkItemType $wiType -Title $wiTitle -Description $wiDesc `
                    -AcceptanceCriteria $wiAcText -Tags $wiTags -Priority 2 `
                    -ResolvedIterationPath $resolvedIterPath
        $wiId = $wi.id
        if (-not $WhatIfOnly) {
            Set-AdoWorkItemState -Headers $headers -Id $wiId -State 'Active'
            Write-Ok "Created work item #$wiId (Active)"
        }
    }

    # Branch name
    $slug       = Convert-ToSlug -Text ($wiTitle ?? $suggestedTitle)
    $branchName = "$suggestedBranchType/$wiId-$slug"
    if ($branchName.Length -gt 80) { $branchName = $branchName.Substring(0, 80).TrimEnd('-') }
    Write-Info "Branch: $branchName"
    if (-not $AutoWorkItems) { $branchName = Read-UserInput "  Confirm or override branch name" $branchName }

    # Create branch from target
    if ($WhatIfOnly) {
        Write-Dry "Would: git fetch origin $TargetBranch && git checkout -b $branchName origin/$TargetBranch"
    } else {
        git fetch origin $TargetBranch 2>&1 | Out-Null
        git checkout -b $branchName "origin/$TargetBranch" 2>&1 | Out-Null
        Write-Ok "Checked out branch '$branchName'"
    }

    # Stage files
    foreach ($f in $files) {
        if ($WhatIfOnly) { Write-Dry "Would: git add -- '$($f.Path)'" }
        else { git add -- "$($f.Path)" 2>&1 | Out-Null }
    }

    # Commit policy check
    if (-not $WhatIfOnly) {
        try {
            Write-Info 'Running commit policy check...'
            & "$root\Test-CommitPolicy.ps1" -Scope Staged -ErrorAction Stop
        } catch {
            Write-Fail "Commit policy check failed: $($_.Exception.Message)"
            Write-Warn "Unstaging files and returning to previous branch."
            git reset HEAD 2>&1 | Out-Null
            git checkout $currentBranch 2>&1 | Out-Null
            git branch -D $branchName 2>&1 | Out-Null
            continue
        }
    }

    # Commit
    $commitMsg = "$suggestedBranchType`: $wiTitle AB#$wiId"
    if (-not $AutoWorkItems) { $commitMsg = Read-UserInput "  Commit message" $commitMsg }

    if ($WhatIfOnly) {
        Write-Dry "Would: git commit -m '$commitMsg'"
        $commitSha = 'DRY_RUN_SHA'
    } else {
        git commit -m $commitMsg 2>&1 | Out-Null
        $commitSha = (git rev-parse HEAD 2>$null).Trim()
        Write-Ok "Committed: $commitSha"
    }

    # Push
    if ($WhatIfOnly) {
        Write-Dry "Would: git push -u origin $branchName"
    } else {
        $pushResult = git push -u origin $branchName 2>&1
        if ($LASTEXITCODE -ne 0) { Write-Fail "Push failed: $pushResult"; continue }
        Write-Ok "Pushed to origin/$branchName"
    }

    # PR readiness check
    if (-not $WhatIfOnly) {
        try {
            Write-Info 'Running PR readiness check...'
            & "$root\Test-PullRequestReadiness.ps1" `
                -SourceBranch $branchName -TargetBranch $TargetBranch `
                -AllowGeneratedArtifacts -ErrorAction Stop
        } catch {
            Write-Warn "PR readiness warning: $($_.Exception.Message)"
            if (-not (Confirm-Yn '  Continue with PR creation despite warnings?')) {
                Write-Info "Skipping PR for '$branchName'."
                continue
            }
        }
    }

    # Create PR
    $prTitle = $wiTitle
    $prDesc  = @"
## Summary
$wiTitle

## Work Item
AB#$wiId

## Files Changed
$(($files | ForEach-Object { "- ``$($_.Path)``" }) -join "`n")

---
*Created by Invoke-Stampit.ps1*
"@

    Write-Info "Creating PR: '$prTitle' ($branchName -> $TargetBranch)"
    $pr   = New-AdoPullRequest -Headers $headers -RepoId $repoId `
                -SourceBranch $branchName -Title $prTitle -Description $prDesc -WorkItemId $wiId
    $prId = $pr.pullRequestId
    $prUrl = if ($pr._links.web.href) { $pr._links.web.href } else { "https://dev.azure.com/$Organization/$Project/_git/$RepositoryName/pullrequest/$prId" }

    if (-not $WhatIfOnly) {
        Write-Ok "PR #$prId created: $prUrl"
        Add-CommitArtifactLink -Headers $headers -WorkItemId $wiId -CommitSha $commitSha -RepoId $repoId -ProjectId $projectId
        Add-PrArtifactLink     -Headers $headers -WorkItemId $wiId -PrId $prId -RepoId $repoId -ProjectId $projectId
        Write-Ok "Artifact links added to WI #$wiId (commit + PR)"
    }

    $processedBundles.Add([pscustomobject]@{
        Topic      = $topic
        Branch     = $branchName
        WorkItemId = $wiId
        CommitSha  = $commitSha
        PrId       = $prId
        PrUrl      = $prUrl
    })

    # Return to starting branch for next bundle
    if (-not $WhatIfOnly -and $groupKeys.Count -gt 1) {
        git checkout $TargetBranch 2>&1 | Out-Null
    }
}

# 7. Follow-up task detection
if (-not $SkipFollowUpScan) {
    Write-Step 'Scanning for follow-up backlog tasks'
    $suggestions = Get-FollowUpSuggestions -AllFiles $allDirty

    if ($suggestions.Count -eq 0) {
        Write-Ok 'No follow-up tasks detected.'
    } else {
        Write-Info "$($suggestions.Count) follow-up suggestion(s):"
        foreach ($s in $suggestions) { Write-Host "  - [$($s.Type)] $($s.Title)" -ForegroundColor Yellow }
        Write-Host ''
        if (Confirm-Yn 'Create these as backlog work items?') {
            foreach ($s in $suggestions) {
                Write-Info "Creating follow-up: $($s.Title)"
                $fu = New-AdoWorkItemObject -Headers $headers `
                          -WorkItemType $s.Type -Title $s.Title -Description $s.Description `
                          -Tags $s.Tags -Priority 3 -ResolvedIterationPath $script:IterationPath
                if (-not $WhatIfOnly) { Write-Ok "Follow-up WI #$($fu.id) created in backlog." }
            }
        }
    }
}

# 8. Summary
Write-Step 'Stampit complete'
if ($processedBundles.Count -eq 0) {
    Write-Warn 'No bundles were processed.'
} else {
    foreach ($b in $processedBundles) {
        Write-Ok "[$($b.Topic)]  WI #$($b.WorkItemId)  |  Branch: $($b.Branch)  |  PR #$($b.PrId)  |  $($b.PrUrl)"
    }
}
