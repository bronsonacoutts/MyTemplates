# TEMPLATE_POWER_PLATFORM_CODE_APP

> **Template Definition:** Power Platform Code App
> **Target Audience:** Power Platform makers, delivery teams building Code Apps.
> **ID:** `template.power-platform-code-app`
> **Status:** Incubating

---

## Scope and Audience

The **Power Platform Code App Template** is a dedicated starting point for teams building and deploying custom code-first applications on the Power Platform.

**Primary Audience:** Power Platform makers, pro-code developers, and delivery teams responsible for full application lifecycles on the Power Platform.

**Main Use Cases:**

- Scaffolding new code-first Power Apps (Canvas or Model-driven extensions leveraging custom code).
- Standardizing environment promotion and deployment workflows.
- Integrating code-first app delivery with shared testing and release governance.

**Non-Goals:**

- **Not for PCF controls:** Use the `template.power-platform-pcf` template for building and packaging Power Apps Component Framework controls.
- **Not for ALM/Pipeline Governance:** Use the `template.power-platform-alm-governance` template for pure pipeline, branch, and work-item automation.
- **Not for generic Web Apps:** General SPA/Vite apps that do not target the Power Platform directly should use `template.vite-web-app`.

---

## Differentiators from Adjacent Templates

| Template           | Focus                                         | Runtime / Output                           |
| :----------------- | :-------------------------------------------- | :----------------------------------------- |
| **Code App**       | Full code-app delivery, environment promotion | Custom Power Platform Applications         |
| **PCF**            | Component development and packaging           | Reusable PCF UI Controls                   |
| **ALM Governance** | Pipeline automation, DevOps work-items        | Governance toolkits (PowerShell/Pipelines) |
| **Vite Web App**   | Generic interactive SPAs                      | Static web app deployments                 |

---

## Required Repository Structure

The dedicated repository should be scaffolded with the following baseline:

```text
/
├── .github/
│   ├── workflows/        # Environment promotion and deployment CI/CD
│   └── CODEOWNERS
├── docs/
│   ├── developer/
│   │   ├── SETUP.md
│   │   └── RELEASE_PROCESS.md
│   ├── deployment/       # Environment promotion strategy
│   └── architecture/     # ADRs
├── src/                  # Code App source code
├── test/                 # Test harness (Vitest / Playwright)
├── agent-instructions.md # Shared AI instructions with Power Platform overrides
├── CONTRIBUTING.md
├── SECURITY.md
├── CHANGELOG.md
├── RELEASE_NOTES.md
└── package.json
```

---

## Shared Governance Packs

This template relies on the following hub-synced packs:

- **`pack.ai-agent-instructions`**: Baseline prompt injection defenses and AI coding guidelines.
- **`pack.github-governance`**: Shared PR templates, issue templates, and basic workflow structures.
- **`pack.docs-as-code`**: Shared markdown standards and ADR templates.
- **`pack.testing-guardrails`**: Vitest and Playwright baselines for testing app logic.
- **`pack.release-management`**: Changelog and release note standards.

---

## Environment and Deployment Guidance

The template must include explicit documentation and default configurations for Power Platform environment promotion.

1. **Environment Strategy**: Docs detailing development, testing, and production environment boundaries.
2. **Deployment Flow**: CI/CD examples for promoting Code Apps across environments using Power Platform Build Tools or GitHub Actions.
3. **Secrets Handling**: Guidance on managing connection references, environment variables, and service principals.

---

## Maintainer Decisions Pending

- **Build Tooling:** Finalize the default bundler (e.g., Vite vs. Webpack) specific to Power Platform Code App constraints.
- **Testing Approach:** Determine the exact balance between Vitest (unit tests) and Playwright (E2E against Power Platform environments) defaults.
