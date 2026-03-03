# Release Process

> This guide describes the end-to-end process for creating and publishing a release.

---

## Overview

Releases follow [Semantic Versioning](https://semver.org/) (`MAJOR.MINOR.PATCH`):

| Version bump        | When                              |
| ------------------- | --------------------------------- |
| `PATCH` (1.0.**x**) | Backwards-compatible bug fixes    |
| `MINOR` (1.**x**.0) | New backwards-compatible features |
| `MAJOR` (**x**.0.0) | Breaking changes                  |

---

## Prerequisites

Before starting a release, ensure:

- [ ] `develop` branch is stable and all CI checks pass.
- [ ] All intended features/fixes for this release are merged to `develop`.
- [ ] `CHANGELOG.md` has an `[Unreleased]` section with all changes documented.
- [ ] You have write access to the repository.

---

## Step-by-Step Release Process

### 1. Create a release branch

```bash
git checkout develop
git pull origin develop
git checkout -b release/vX.Y.Z
```

### 2. Bump the version

Update the version in `package.json`:

```bash
npm version X.Y.Z --no-git-tag-version
```

### 3. Update CHANGELOG.md

Move items from `[Unreleased]` to a new versioned section:

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added

- ...

### Fixed

- ...
```

Add/update the comparison links at the bottom of the file.

### 4. Update RELEASE_NOTES.md

Replace the content with a human-readable summary of this release:

- `## Changes` — what's new or changed
- `## Breaking Changes` — any breaking changes and migration steps

Run the validator to confirm the format is correct:

```bash
npm run validate:release-notes
```

### 5. Commit the release preparation

```bash
git add package.json CHANGELOG.md RELEASE_NOTES.md
git commit -m "chore(release): prepare vX.Y.Z"
```

### 6. Merge to main

Open a PR from `release/vX.Y.Z` → `main`. After approval and CI passing, merge.

### 7. Tag the release

```bash
git checkout main
git pull origin main
git tag -a vX.Y.Z -m "Release vX.Y.Z"
git push origin vX.Y.Z
```

Pushing the tag triggers the **release workflow** (`.github/workflows/release.yml`), which:

1. Runs the full CI suite (lint, type-check, test, build).
2. Validates `RELEASE_NOTES.md`.
3. Creates a GitHub Release with the content of `RELEASE_NOTES.md`.

### 8. Merge main back to develop

To keep `develop` in sync:

```bash
git checkout develop
git merge main
git push origin develop
```

### 9. Verify the release

- Check the [Releases page](../../releases) on GitHub.
- Confirm the release notes are correct.
- Verify all CI checks on the tag passed.

---

## Hotfix Process

For critical production bugs that cannot wait for the next regular release:

```bash
# Branch from main (not develop)
git checkout main
git pull origin main
git checkout -b hotfix/vX.Y.Z

# Make the fix, bump PATCH version, update CHANGELOG and RELEASE_NOTES

git commit -m "fix: <description of the fix>"
git commit -m "chore(release): prepare hotfix vX.Y.Z"

# PR directly to main, merge, then tag
git tag -a vX.Y.Z -m "Hotfix vX.Y.Z"
git push origin vX.Y.Z

# Merge main back to develop
git checkout develop
git merge main
git push origin develop
```

---

## Pre-release / Beta Versions

For pre-releases, use a hyphenated version suffix: `v2.0.0-beta.1`, `v2.0.0-rc.1`.

The release workflow will automatically mark the GitHub Release as a **pre-release** if the tag contains a hyphen.

---

## Rollback Process

If a release needs to be rolled back:

1. Identify the previous stable version tag (e.g., `vX.Y.(Z-1)`).
2. Deploy the previous release artifact.
3. Create a hotfix that addresses the issue (do not just revert the tag).
4. Release a new `PATCH` version with the fix.

> Do not delete release tags. Deleted tags cause confusion and break any systems pinned to that version.
