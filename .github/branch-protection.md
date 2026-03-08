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

| Setting                                                          | Value                    | Reason                                                                 |
| ---------------------------------------------------------------- | ------------------------ | ---------------------------------------------------------------------- |
| Require a pull request before merging                            | ✅ Enabled               | No direct pushes to main                                               |
| Required number of approvals before merging                      | **0**                    | Solo maintainer cannot self-approve; set to ≥ 1 for multi-maintainer  |
| Dismiss stale pull request approvals when new commits are pushed | ✅ Enabled               | Re-review after new changes                                            |
| Require review from Code Owners                                  | ❌ Disabled              | Must be off when sole maintainer is the only CODEOWNER                 |
| Require status checks to pass before merging                     | ✅ Enabled               | CI must pass                                                           |
| Required status checks                                           | `validate`               | The CI job from ci.yml                                                 |
| Require branches to be up to date before merging                 | ✅ Enabled               | Prevents stale merges                                                  |
| Require conversation resolution before merging                   | ✅ Enabled               | All review comments resolved                                           |
| Require linear history                                           | ✅ Enabled (recommended) | Keeps git history clean                                                |
| Include administrators                                           | ❌ Disabled              | Must be off so the sole maintainer (repo owner) can merge their own PRs |
| Allow force pushes                                               | ❌ Disabled              | Preserve history                                                       |
| Allow deletions                                                  | ❌ Disabled              | Prevent accidental deletion                                            |

> **Note for solo maintainers:** GitHub does not allow PR authors to approve their own pull requests.
> If you are the sole CODEOWNER, you must set **Required number of approvals to 0**, disable
> **"Require review from Code Owners"**, and disable **"Include administrators"** — otherwise you
> will be permanently blocked from merging. When your team grows, increase approvals to ≥ 1 and
> re-enable these settings.

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

The `CODEOWNERS` file (`.github/CODEOWNERS`) automatically requests reviews from `@bronsonacoutts` on all PRs.

> **Important:** Only enable **"Require review from Code Owners"** in branch protection when there is
> more than one maintainer. When you are the sole CODEOWNER, enabling this setting combined with
> GitHub's prohibition on self-approval will permanently block you from merging your own PRs.
