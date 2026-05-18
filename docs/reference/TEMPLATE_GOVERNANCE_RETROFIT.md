# Governance Retrofit Pack

## Scope

The Governance Retrofit Pack provides a reusable, framework-agnostic governance baseline for existing repositories. It is designed for maintainers who want to adopt the governance, documentation, and testing guardrails from the `MyTemplates` ecosystem without replacing their existing application architecture or runtime stack.

The pack is divided into two variants:

- **GitHub-oriented**: For repositories using GitHub Actions, Issues, and Pull Requests.
- **Azure DevOps-oriented**: For repositories using Azure DevOps Repos, Work Items, and Pipelines.

## Target Audience

- Maintainers of existing repositories looking to standardize contribution, issue intake, and PR policies.
- Teams that need baseline CI/CD enforcement without adopting a full scaffolding template.
- Organizations seeking to align multiple legacy codebases with a central governance posture.

## Constraints

- **Framework-Agnostic**: The assets in this pack do not depend on a specific programming language, runtime environment, or application framework.
- **Minimal Disruption**: The adoption process is additive. It layers governance files on top of the existing repository structure without breaking current functionality.
- **Modular**: Consumers can adopt the GitHub or Azure DevOps variants independently, and can further select specific packs (e.g., AI instructions, docs-as-code) as needed.

## Pack Inventory

The Governance Retrofit Pack is an umbrella offering that combines several specialized governance packs. The core contents depend on the variant chosen.

### Common Baseline (Both Variants)

These files establish the minimum project hygiene for both GitHub and Azure DevOps environments.

- **`CODE_OF_CONDUCT.md`**: Community conduct expectations.
- **`CONTRIBUTING.md`**: Contribution process and standards.
- **`SECURITY.md`**: Vulnerability reporting policy.
- **`docs-as-code` (Pack)**: Baseline documentation structures (e.g., `DOC_STANDARDS.md`, `STYLE_GUIDE.md`).
- **`ai-agent-instructions` (Pack)**: Shared AI governance and prompt-injection defense (`agent-instructions.md`).

### GitHub-Oriented Variant

This variant includes the contents of the `github-governance` pack, tailored for GitHub repositories.

- **`.github/workflows/`**: Continuous integration workflows (`ci.yml`, `codeql.yml`, `pr-validation.yml`).
- **`.github/ISSUE_TEMPLATE/`**: Standardized issue intake forms.
- **`.github/PULL_REQUEST_TEMPLATE.md`**: PR description template.
- **`.github/dependabot.yml`**: Dependency update configuration.
- **`.github/CODEOWNERS`**: Code review routing.
- **`commitlint.config.cjs`**: Conventional Commits enforcement.
- **`scripts/validate-branch.js`**: Branch naming policy checker.

### Azure DevOps-Oriented Variant

This variant includes the contents of the `azure-devops-governance` pack, built around the `commitship` model for Azure DevOps.

- **`templates/commitship-ado-governance/commitship.config.ps1`**: Configuration for ADO organization, project, and iteration.
- **`templates/commitship-ado-governance/.githooks/`**: Local git hooks for pre-push checks and commit message validation (`commit-msg`, `pre-push`).
- **`templates/commitship-ado-governance/scripts/`**: Governance enforcement scripts (`Test-CommitMessage.ps1`, `Test-PushPolicy.ps1`, etc.).

## Adoption Guidance

Applying the Governance Retrofit Pack to an existing repository is designed to be safe and additive.

### Step 1: Establish the Baseline

1.  Copy `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, and `SECURITY.md` from the root of `MyTemplates` to the root of your existing repository.
2.  Copy the `agent-instructions.md` file to set up AI governance. If using the `ai-agent-instructions` pack, copy the global template and define your `agent-instructions.local.md` overrides.
3.  Review the `docs-as-code` pack and copy relevant standards (e.g., `DOC_STANDARDS.md`, `STYLE_GUIDE.md`) to your `docs/` folder.

### Step 2: Apply the Platform Variant

**For GitHub Repositories:**

1.  Copy the contents of the `.github/` folder from `MyTemplates` into your repository's `.github/` folder. This includes workflows, issue templates, and the PR template.
2.  Copy `commitlint.config.cjs` and `scripts/validate-branch.js` if you wish to enforce branch naming and commit message standards.
3.  **Action Required:** Review `.github/workflows/` and remove any jobs (like Vitest or Playwright) that do not apply to your repository's existing tech stack. Ensure your repository settings match the [Governance Tiers](../admin/TEMPLATE_REPO_GOVERNANCE.md).

**For Azure DevOps Repositories:**

1.  Copy the contents of `templates/commitship-ado-governance/` into your repository.
2.  Update `commitship.config.ps1` with your specific ADO organization, project, area path, and iteration settings.
3.  Run the installation script (`Install-GitHooks.ps1`) to enable the local commit and push policies.

### Step 3: Validate and Commit

1.  Review all changed files to ensure they do not conflict with existing tooling (e.g., existing `.github/workflows` or pre-commit hooks).
2.  Commit the changes using a dedicated branch (e.g., `chore/adopt-governance-pack`).
3.  Open a Pull Request and verify that the newly added governance checks execute correctly in your CI pipeline.

## Updating and Resyncing

The governance pack is continuously improved within the `MyTemplates` repository. Maintainers of downstream repositories should follow this process to keep their governance baseline synchronized.

### Monitoring for Updates

- Watch the `MyTemplates` repository releases.
- Read the `RELEASE_NOTES.md` or `CHANGELOG.md` for announcements regarding updates to any of the core governance packs (`pack.github-governance`, `pack.azure-devops-governance`, `pack.ai-agent-instructions`, `pack.docs-as-code`).

### Resync Process

When an update is announced, follow these steps to resync:

1.  **Pull Latest Files:** Copy the updated files from the latest version of `MyTemplates` into your repository.
2.  **Review Overrides:** If you made any local modifications (e.g., removing specific GitHub Action jobs or updating `.githooks`), ensure you reapply those changes to the newly copied files.
3.  **Run Sync Automation (If Applicable):** If your repository utilizes sync automation scripts (such as `scripts/sync-instructions.js` for AI instructions), run them locally to regenerate any mirrored output files.
4.  **Validate Locally:** Run your standard validation commands (`npm run format`, `npm run lint`, `npm test`) to ensure the updated governance files do not break your project.
5.  **Commit and Test:** Create a pull request to test the updated CI/CD workflows and governance scripts before merging into your default branch.
