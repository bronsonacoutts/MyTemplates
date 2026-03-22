# Release Management Pack

## Purpose

Shared release lifecycle assets for changelog maintenance, release notes validation, and repeatable release execution.

## Intended Consumers

- downstream template repos with tagged releases
- maintainers who want consistent changelog and release-note handling
- repos consuming GitHub Actions-based release automation

## Source Of Truth

Release metadata stays canonical in the root release files, release-process docs, and release validation script listed below.

The authoritative files for this pack live in:

- `CHANGELOG.md`
- `RELEASE_NOTES.md`
- `docs/developer/RELEASE_PROCESS.md`
- `scripts/validate-release-notes.js`
- `.github/workflows/release.yml`

## Inventory

| Path                                | Role            | Notes                                                    |
| ----------------------------------- | --------------- | -------------------------------------------------------- |
| `CHANGELOG.md`                      | Release history | User-facing change log baseline.                         |
| `RELEASE_NOTES.md`                  | Release draft   | Structured release-note source used before tagging.      |
| `docs/developer/RELEASE_PROCESS.md` | Runbook         | Maintainer process for versioning and releases.          |
| `scripts/validate-release-notes.js` | Validation      | Checks release-note structure before publishing.         |
| `.github/workflows/release.yml`     | Automation      | Release workflow bound to tagging and release execution. |

## Sync Notes

- Repos with no formal releases can defer this pack.
- General CI workflows remain owned by the github-governance pack.
