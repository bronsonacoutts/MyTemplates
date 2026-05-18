# Maintainer Sync Workflow

The `MyTemplates` repository acts as a hub for shared templates and "packs". Because downstream template repositories consume these packs, we use automation to ensure files remain in sync and that drift is caught early.

## The Sync Lifecycle

### 1. Publishing Pack Changes

Maintainers should make all substantive changes to shared packs (like GitHub actions, AI agent instructions, testing guardrails) within the **hub repository** (`MyTemplates/packs`).

The hub remains the absolute source of truth. Do not modify pack files directly in downstream template repositories.

### 2. Updating Downstream Repositories

When a pack is updated in the hub, downstream repositories must be updated. You can use the `sync-pack.js` script to pull the latest changes into a target directory.

**Command:**

```bash
npm run sync-pack <pack-id> <target-dir> [--dry-run]
```

**Example:**
To sync the GitHub Governance pack into a local clone of a downstream repo:

```bash
npm run sync-pack pack.github-governance ../template-vite-web-app/.github
```

Use the `--dry-run` flag to preview the changes safely before overwriting local files:

```bash
npm run sync-pack pack.github-governance ../template-vite-web-app/.github --dry-run
```

### 3. Detecting Drift

To ensure downstream repositories haven't diverged from the hub (either through accidental local edits or missed syncs), use the `detect-drift.js` script.

**Command:**

```bash
npm run detect-drift <pack-id> <target-dir>
```

**Example:**

```bash
npm run detect-drift pack.github-governance ../template-vite-web-app/.github
```

If drift is detected, the script will output the differing files and exit with a non-zero code. This is suitable for running in CI pipelines to block PRs that improperly edit managed pack files.

## Future Hardening

- **Automated PR Generation:** In the future, a GitHub Action could automatically run `sync-pack` across all known downstream repos and open pull requests whenever a pack in the hub is updated.
- **Centralized Manifest Validation:** The current sync flow relies on `catalog/templates.json` to find source paths. Enhancing this to pull from remote endpoints would allow downstream repos to run these scripts without cloning the entire hub.
- **Partial Syncs:** Currently, the entire pack is synced. Some repositories may need specific exclusions.
