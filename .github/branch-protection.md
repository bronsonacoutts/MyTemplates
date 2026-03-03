# Branch Protection Settings

> This document describes the recommended branch protection rules for this repository.
> These settings should be applied by a repository administrator via **Settings → Branches**.

---

## Protected Branches

The following branches should have protection rules enabled:

- `main`
- `develop`
- `staging`

---

## Recommended Settings for `main`

Navigate to **Settings → Branches → Add branch protection rule** and enter `main`.

### Protect matching branches

| Setting                                                          | Value                    | Reason                       |
| ---------------------------------------------------------------- | ------------------------ | ---------------------------- |
| Require a pull request before merging                            | ✅ Enabled               | No direct pushes to main     |
| Required number of approvals before merging                      | **1**                    | At least one human review    |
| Dismiss stale pull request approvals when new commits are pushed | ✅ Enabled               | Re-review after new changes  |
| Require review from Code Owners                                  | ✅ Enabled               | Enforces CODEOWNERS          |
| Require status checks to pass before merging                     | ✅ Enabled               | CI must pass                 |
| Required status checks                                           | `validate`               | The CI job from ci.yml       |
| Require branches to be up to date before merging                 | ✅ Enabled               | Prevents stale merges        |
| Require conversation resolution before merging                   | ✅ Enabled               | All review comments resolved |
| Require linear history                                           | ✅ Enabled (recommended) | Keeps git history clean      |
| Include administrators                                           | ✅ Enabled               | Rules apply to admins too    |
| Allow force pushes                                               | ❌ Disabled              | Preserve history             |
| Allow deletions                                                  | ❌ Disabled              | Prevent accidental deletion  |

---

## Recommended Settings for `develop`

Same as `main`, but with slightly relaxed settings:

| Setting                               | Value       |
| ------------------------------------- | ----------- |
| Require a pull request before merging | ✅ Enabled  |
| Required approvals                    | **1**       |
| Require status checks                 | `validate`  |
| Require branches to be up to date     | ✅ Enabled  |
| Allow force pushes                    | ❌ Disabled |
| Allow deletions                       | ❌ Disabled |

---

## Recommended Settings for `staging`

| Setting                               | Value       |
| ------------------------------------- | ----------- |
| Require a pull request before merging | ✅ Enabled  |
| Required approvals                    | **1**       |
| Require status checks                 | `validate`  |
| Allow force pushes                    | ❌ Disabled |

---

## Rulesets (Newer GitHub Feature)

GitHub now supports **Repository Rulesets** which provide more flexible protection including regex-based branch matching. Consider migrating from classic branch protection to Rulesets for:

- Enforcing branch naming conventions via bypass policies.
- Applying rules across multiple branch patterns at once.
- Granting granular bypass permissions per role.

**Settings → Rules → Rulesets** → Create a new ruleset targeting `~DEFAULT_BRANCH` and `refs/heads/develop`.

---

## Required Status Checks Reference

These are the job names from `.github/workflows/ci.yml` that should be added as required status checks:

| Job ID     | Display Name           |
| ---------- | ---------------------- |
| `validate` | `Lint, Format & Tests` |

To add them: **Settings → Branches → [branch rule] → Require status checks → Search** for each job name (they must have run at least once to appear).

---

## CODEOWNERS

The `CODEOWNERS` file (`.github/CODEOWNERS`) automatically requests reviews from `@bronsonacoutts` on all PRs. Ensure the **"Require review from Code Owners"** option is enabled in branch protection for this to be enforced.
