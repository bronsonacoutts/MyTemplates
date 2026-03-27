# Automation Profiles

This template repo supports two GitHub automation profiles:

- `preferred` (default here): local-first, draft-PR-first, minute-saving automation
- `standard`: cloud-first, always-run pull-request automation

Use the profile that matches your team’s tolerance for local hook cost versus GitHub Actions runtime usage.

---

## Preferred Profile

This repo now ships with the `preferred` profile.

### How it works

1. Husky `pre-commit` runs the local validation suite:
   - `npm run ci:checks`
   - `npm run ci:tests`
2. The `commit-msg` hook appends validation trailers to the commit message when those checks pass.
3. Husky `pre-push` validates the branch name and only re-runs the full suite when the commit does not already carry the local validation signal.
4. GitHub Actions only auto-start when a pull request changes from `draft` to `ready for review`.
5. GitHub workflows run in sequence:
   - `PR Validation`
   - `CI Checks`
   - `Tests`
6. `CI Checks` and `Tests` skip their heavy cloud work when the latest commit already carries a passing local validation signal from Husky.

### Trade-offs

- Best for reducing GitHub Actions minutes and duplicate compute.
- Best when contributors have local Node tooling and Husky enabled.
- After new commits are pushed to an already-open PR, rerun the workflows manually or switch the PR back to draft and then to ready for review again.

### Validation trailers

Validated commits receive trailers like:

```text
Local-Validation: passed
Local-Validation-Checks: lint, format:check, test, type-check, validate:catalog
Local-Validation-Source: husky-pre-commit
```

These trailers are the cloud skip signal.

---

## Standard Profile

Choose `standard` if you want cloud checks to run for every active PR update, even when Husky already ran locally.

### What to change

1. In [`.github/workflows/pr-validation.yml`](../../.github/workflows/pr-validation.yml), change the `pull_request` types back to:
   - `opened`
   - `edited`
   - `synchronize`
   - `reopened`
2. Replace the `workflow_run` triggers in [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) and [`.github/workflows/tests.yml`](../../.github/workflows/tests.yml) with direct `pull_request` triggers.
3. Remove or ignore the local-validation trailer gate if you want cloud CI and tests to run every time regardless of Husky.
4. Keep the Husky hooks if you still want early local feedback.

### Trade-offs

- More GitHub Actions minutes
- Less dependence on contributors having Husky enabled
- Simpler mental model for teams that want cloud re-validation on every PR update
