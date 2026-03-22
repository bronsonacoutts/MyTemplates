# Issue 14: Automate pack sync and drift detection

## Goal

Automate reuse of shared assets across dedicated template repos.

## Deliverables

- `scripts/sync-pack.js`
- manifest validation script
- drift-detection workflow
- documentation for downstream maintenance

## Acceptance criteria

- downstream repos can sync authoritative packs with one command or workflow
- drift is detected automatically
- pack ownership and update flow are documented

## Prompt for Codex

```text
You are working in the `MyTemplates` repository. Build the automation needed to sync shared packs to downstream template repos and detect drift.

Read first:
- `docs/TEMPLATE_LIBRARY_STRATEGY.md`
- any existing sync/automation scripts in `scripts/`
- pack definitions and catalogue/manifest docs if they already exist

Objective:
Create a maintainable sync path so this hub repo can remain the source of truth while downstream template repos consume shared assets reliably.

Required work:
1. Add or update scripts that can sync pack contents into target repos or target directories.
2. Add manifest validation support if the sync flow depends on manifest metadata.
3. Add drift-detection automation or documentation describing how drift will be detected.
4. Document the maintainer workflow for publishing pack changes and resyncing consumers.

Constraints:
- Keep the automation understandable and safe to run repeatedly.
- Prefer dry-run or preview behavior if destructive changes are possible.
- Avoid assuming access to private repos or secrets unless clearly documented.

Validation:
- run formatting/lint/tests relevant to changed files
- prove that the sync flow can detect or report changes deterministically

Final output expectation:
Summarize the automation added, explain how maintainers should use it, and note any limitations or future hardening work.
```
