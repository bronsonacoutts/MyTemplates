# stampit.config.ps1 — Project configuration for Invoke-Stampit.ps1
#
# Copy this file to your repository root and fill in all values before first use.
# This file is sourced automatically by Invoke-Stampit.ps1.
#
# REQUIRED fields are marked. All others have sensible defaults.

@{
    # -----------------------------------------------------------------------
    # REQUIRED: Azure DevOps organisation name (the subdomain in your ADO URL)
    # Example: for https://dev.azure.com/contoso — set 'contoso'
    Organization    = 'YOUR_ADO_ORG'

    # REQUIRED: Azure DevOps project name
    Project         = 'YOUR_ADO_PROJECT'

    # REQUIRED: Area path for new work items. Matches your ADO area hierarchy.
    # Example: 'MyProject\Team A'
    AreaPath        = 'YOUR_AREA_PATH'

    # REQUIRED: Default iteration path for new work items.
    # Example: 'MyProject\Sprint 1'  or  'MyProject\Backlog'
    IterationPath   = 'YOUR_ITERATION_PATH'

    # -----------------------------------------------------------------------
    # OPTIONAL: Repository name inside the ADO project.
    # Leave empty to auto-detect from the git remote URL.
    RepositoryName  = ''

    # OPTIONAL: Team name used to query the current active sprint/iteration.
    # Leave empty to skip the iteration auto-detection and use IterationPath above.
    TeamName        = ''

    # OPTIONAL: Target branch that all PRs will target. Defaults to 'main'.
    TargetBranch    = 'main'
}
