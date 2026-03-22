# Template Repo Governance

## Purpose

This document defines the default GitHub settings and governance expectations for dedicated template repositories published from the `MyTemplates` ecosystem.

Use it when creating a new dedicated template repo or when retrofitting an existing repo to align with the shared governance posture.

## Design principles

- Keep the baseline safe, documented, and repeatable.
- Distinguish lightweight knowledge/demo repos from operationally sensitive automation repos.
- Prefer controls that work for a solo maintainer by default.
- Treat GitHub UI settings as required operational setup, even when they cannot be stored in the repository.
- Escalate controls only when the repo's runtime, permissions, or automation surface justifies them.

## Governance tiers

| Tier     | Repo class              | Typical examples                                                                          | Maintainer assumption                                   | Control intent                                                   |
| -------- | ----------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------- | ---------------------------------------------------------------- |
| `Tier 1` | Knowledge repos         | focused explainers, demo sites, educational sample repos                                  | solo maintainer or small ad hoc collaboration           | lightweight controls, low ceremony                               |
| `Tier 2` | Standard template repos | Vite app/site templates, Power Platform app templates, reusable starter repos             | solo maintainer with occasional outside contributions   | strong default hygiene without merge deadlock                    |
| `Tier 3` | Automation repos        | Home Assistant automation templates, infra-heavy or secret-adjacent operational templates | solo maintainer, but repo may run privileged automation | highest practical controls short of blocking a single maintainer |

## Tier matrix

`Required` means the setting should be treated as the default for that tier.

`Optional` means the setting is recommended only when the repo has the matching risk or team shape.

| Control area                                          | Tier 1: Knowledge                                                          | Tier 2: Standard template                                                          | Tier 3: Automation                                                                                   |
| ----------------------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Default branch                                        | `main` required                                                            | `main` required                                                                    | `main` required                                                                                      |
| Repository visibility                                 | public by default                                                          | public by default                                                                  | public or private based on runtime and secrets exposure                                              |
| Pull requests before merge                            | required                                                                   | required                                                                           | required                                                                                             |
| Minimum approvals                                     | `0` required for solo maintainers; `1` optional for multi-maintainer repos | `0` required for solo maintainers; `1` optional when another maintainer can review | `0` required for solo maintainers; `1` strongly recommended when there is another trusted maintainer |
| Dismiss stale approvals                               | optional                                                                   | required                                                                           | required                                                                                             |
| Require code owner review                             | optional; do not enable for a sole CODEOWNER                               | optional; enable only when more than one reviewer can unblock merges               | optional; enable only when it will not deadlock the maintainer                                       |
| Required status checks                                | required: docs/link/basic validation                                       | required: CI validation and security checks                                        | required: CI validation, security checks, and automation-specific checks                             |
| Require branch up to date before merge                | optional                                                                   | required                                                                           | required                                                                                             |
| Require conversation resolution                       | optional                                                                   | required                                                                           | required                                                                                             |
| Linear history                                        | optional                                                                   | recommended                                                                        | recommended                                                                                          |
| Signed commits                                        | optional                                                                   | optional                                                                           | recommended                                                                                          |
| Force pushes                                          | disabled required                                                          | disabled required                                                                  | disabled required                                                                                    |
| Branch deletion                                       | disabled required                                                          | disabled required                                                                  | disabled required                                                                                    |
| Dependabot version updates                            | recommended                                                                | required                                                                           | required                                                                                             |
| Dependabot alerts                                     | required                                                                   | required                                                                           | required                                                                                             |
| Dependabot security updates                           | required                                                                   | required                                                                           | required                                                                                             |
| Dependency graph                                      | required                                                                   | required                                                                           | required                                                                                             |
| Code scanning                                         | recommended for public repos                                               | required                                                                           | required                                                                                             |
| Secret scanning                                       | recommended for public repos                                               | required for public repos; enable for private repos when licensed                  | required                                                                                             |
| Push protection                                       | recommended                                                                | required where available                                                           | required where available                                                                             |
| Private vulnerability reporting / security advisories | recommended                                                                | required                                                                           | required                                                                                             |
| Workflow permissions default                          | restricted required                                                        | restricted required                                                                | restricted required                                                                                  |
| Allow GitHub Actions to create or approve PRs         | disabled required                                                          | disabled required                                                                  | disabled required                                                                                    |
| Actions policy                                        | allow GitHub-authored and explicitly approved actions                      | restrict to GitHub-authored and approved marketplace/internal actions              | restrict to pinned and approved actions/reusable workflows only                                      |
| Fork PR workflow approvals                            | first-time contributors minimum                                            | first-time contributors minimum                                                    | all external contributors recommended, especially with self-hosted runners                           |
| Self-hosted runners                                   | avoid                                                                      | optional                                                                           | only with runner hardening and explicit approval policy                                              |
| Environment protection rules                          | optional                                                                   | optional for release or deploy flows                                               | recommended for deploy, release, or secret-bearing jobs                                              |

## Default settings for every dedicated template repo

Apply these defaults to every dedicated template repo unless this document explicitly says a lower tier can relax the control:

| Setting area                      | Default                                                                                                                                                     |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Branch model                      | `main` is the only mandatory protected branch; add `develop` or `staging` only if the repo has an actual release flow that uses them                        |
| Merge path                        | pull requests only; no direct pushes to protected branches                                                                                                  |
| Merge method                      | squash merge enabled; rebase merge optional; merge commits optional only if the repo needs them                                                             |
| Branch protection / ruleset scope | protect `~DEFAULT_BRANCH`; add named non-default branches only when they are actively used                                                                  |
| Status checks                     | require the repo's main validation workflow; require CodeQL or equivalent when enabled                                                                      |
| Force push / deletion             | disabled on protected branches                                                                                                                              |
| Security analysis                 | dependency graph, Dependabot alerts, security updates, and security advisories enabled                                                                      |
| Workflow token                    | restricted `GITHUB_TOKEN` by default; elevate per workflow file only where required                                                                         |
| Actions PR automation             | keep "Allow GitHub Actions to create and approve pull requests" disabled                                                                                    |
| Actions allow-list                | prefer GitHub-authored actions plus a short explicit allow-list of approved external actions                                                                |
| Repository artefacts              | `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CHANGELOG.md`, `RELEASE_NOTES.md`, agent instructions, CODEOWNERS, workflows, and Dependabot config present |
| Documentation                     | include setup, release, and operational caveat docs appropriate to the template's runtime                                                                   |

## Branch protection and ruleset guidance

Use GitHub repository rulesets as the default implementation mechanism for new dedicated template repos. Keep classic branch protection only where rulesets are not yet practical for the repo owner.

### Baseline default-branch ruleset

Apply a ruleset to `~DEFAULT_BRANCH` with:

- pull requests required
- required status checks enabled
- force pushes blocked
- deletions blocked
- conversation resolution required for Tier 2 and Tier 3
- stale approval dismissal enabled for Tier 2 and Tier 3
- branch must be up to date before merge for Tier 2 and Tier 3

### Review caveat for solo maintainers

Do not enable both of the following unless another maintainer can approve merges:

- a positive approval count that the PR author cannot satisfy
- "Require review from Code Owners" when the sole maintainer is the only CODEOWNER

For solo-maintainer repos, the safe default is:

- approvals required: `0`
- code owner review requirement: disabled
- administrators included in enforcement: disabled if required to avoid permanent self-blocking

When a repo gains at least one other active maintainer, raise the approval count to `1` and consider enabling code owner review.

### Additional protected branches

Only add `develop`, `staging`, or release branches when the template repo actually uses them.

If you add them:

- apply the same no-force-push and no-deletion protections
- require PRs for shared branches
- keep the required checks smaller than or equal to `main`
- document why the branch exists in the repo's release-process docs

This differs from the current `MyTemplates` branch-protection guide, which documents `main`, `develop`, and `staging` for this hub repository specifically.

## Reviews and merge guidance

### Tier 1

- Keep PRs required on `main`.
- Use approvals only when another maintainer is available.
- Use CODEOWNERS for review routing, not as a blocking control, when the repo is solo maintained.

### Tier 2

- Require PRs and status checks.
- Keep approvals at `0` for solo maintenance.
- Raise approvals to `1` once a second maintainer is consistently available.
- Require conversation resolution.

### Tier 3

- Require PRs, status checks, and conversation resolution.
- Keep approvals at `0` only if the repo would otherwise deadlock.
- Prefer a second maintainer or trusted reviewer before enabling blocking code-owner review.
- Treat release and automation workflow changes as high-scrutiny areas.

## Security baseline by repo type

| Security control                         | Tier 1: Knowledge            | Tier 2: Standard template                                              | Tier 3: Automation       |
| ---------------------------------------- | ---------------------------- | ---------------------------------------------------------------------- | ------------------------ |
| `SECURITY.md` and private reporting path | required                     | required                                                               | required                 |
| Dependency graph                         | required                     | required                                                               | required                 |
| Dependabot alerts                        | required                     | required                                                               | required                 |
| Dependabot security updates              | required                     | required                                                               | required                 |
| Dependabot version updates               | recommended                  | required                                                               | required                 |
| CodeQL or equivalent code scanning       | recommended for public repos | required                                                               | required                 |
| Secret scanning alerts                   | recommended for public repos | required for public repos; recommended for private repos when licensed | required                 |
| Push protection                          | recommended                  | required where available                                               | required where available |
| Manual secret review in PRs              | recommended                  | required                                                               | required                 |
| Security review for workflow changes     | optional                     | recommended                                                            | required                 |
| Environment protection for deployments   | optional                     | optional                                                               | recommended              |

### Repo-type interpretation

- Knowledge repos are allowed to stay lightweight, but they still need dependency visibility, a security reporting path, and at least non-blocking secret hygiene.
- Standard template repos should look like safe public starters: reusable, reviewable, and secure by default.
- Automation repos need the strongest baseline because workflow permissions, runner usage, and secret handling create operational risk even when the code footprint is small.

## Dependency automation guidance

Apply these defaults:

- enable Dependabot alerts
- enable Dependabot security updates
- configure Dependabot version update PRs for package managers and GitHub Actions where used
- group low-risk dependency updates where that reduces review burden
- keep auto-merge optional and only for low-risk dependency classes with passing checks

For solo maintainers, grouped weekly updates are preferred over high-churn daily PRs.

## Workflow permissions guidance

Apply these defaults in GitHub Actions settings:

- set repository default workflow permissions to restricted
- keep "Allow GitHub Actions to create and approve pull requests" disabled
- require explicit workflow-level `permissions` blocks when write access is needed
- approve forked PR workflows conservatively; escalate to "all external contributors" for Tier 3 repos or any repo with self-hosted runners

For repo implementation:

- pin third-party actions to a full-length commit SHA where practical
- prefer reusable workflows from the same owner or organisation
- avoid self-hosted runners for Tier 1 and Tier 2 unless there is a clear runtime need

## Manual GitHub settings checklist

These controls must be applied in GitHub and cannot be fully enforced from files in the repository alone.

### Required for all dedicated template repos

- set the default branch to `main`
- create the default-branch ruleset or branch protection
- enable dependency graph
- enable Dependabot alerts
- enable Dependabot security updates
- set Actions workflow permissions to restricted
- keep GitHub Actions PR creation/approval disabled
- choose the allowed-actions policy
- enable private vulnerability reporting or security advisories

### Required when available or licensed

- enable code scanning default setup or equivalent CodeQL configuration
- enable secret scanning alerts
- enable push protection

### Required for Tier 3 repos

- review fork workflow approval policy and prefer approval for all external contributors
- configure environment protection for deploy/release environments
- review whether self-hosted runners are necessary; if they are, document the runner trust boundary

## Recommended rollout order for a new dedicated repo

1. Create the repository with `main` as default.
2. Push the baseline files and workflows.
3. Enable security and analysis features.
4. Configure Actions permissions and allowed actions.
5. Apply the default-branch ruleset.
6. Add any extra branch or environment protections that the repo's runtime actually needs.
7. Record the selected governance tier in the repo README or setup docs.

## Source alignment notes

- This guidance aligns with `.github/branch-protection.md` on the solo-maintainer caveat: do not require self-approval or blocking CODEOWNER review when the maintainer cannot satisfy those controls.
- This guidance narrows the default protected-branch recommendation for dedicated template repos to `main` unless additional branches are actively used.
- This guidance aligns with `SECURITY.md` by treating Dependabot, CodeQL/code scanning, and private vulnerability reporting as baseline controls.

## References

- GitHub Docs: [About rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)
- GitHub Docs: [Managing security and analysis settings for your repository](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-security-and-analysis-settings-for-your-repository)
- GitHub Docs: [Managing GitHub Actions settings for a repository](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository)
- GitHub Docs: [Configuring Dependabot version updates](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuring-dependabot-version-updates)
- GitHub Docs: [About push protection](https://docs.github.com/en/code-security/concepts/secret-security/about-push-protection)
