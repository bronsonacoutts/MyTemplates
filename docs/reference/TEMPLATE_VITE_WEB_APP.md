# Vite Web App Template Definition

> **Status:** Incubating
> **Phase:** Phase 2
> **Catalogue ID:** `template.vite-web-app`

This document defines the baseline architecture, tooling, and governance for the dedicated **Vite Web App** template repository. It serves as the definition while the standalone repository is being prepared for release.

---

## 1. Intended Audience and Use Cases

The Vite Web App template is designed for **frontend engineers and interactive SPA (Single Page Application) delivery teams**.

### Use Cases

- Highly interactive web applications.
- Client-side state-heavy applications (dashboards, admin portals, internal tools).
- Applications that require robust testing, runtime validation, and structured routing.

### Template Boundary

**What it is:** A scaffolding tool for complex, interactive web applications. It assumes a dynamic user experience where client-side JavaScript drives the core functionality.
**What it is NOT:** A tool for content-heavy sites, marketing pages, or documentation. (Those use cases are served by the **Vite Site Template** [`template.vite-site`], which defaults to a static, Markdown-first, accessibility-checked publishing flow).

---

## 2. Baseline Tooling

This template inherits the proven guardrails established in the `MyTemplates` hub repo, enforcing strict quality gates before code can be merged or deployed.

- **Build Tooling:** [Vite](https://vitejs.dev/) with strict [TypeScript](https://www.typescriptlang.org/) configured for high-fidelity type checking.
- **Linting:** [ESLint](https://eslint.org/) configured for **zero warnings**. The build will fail if any unused variables, implicit `any` types, or formatting drift are detected.
- **Formatting:** [Prettier](https://prettier.io/) enforced as the single source of truth for code style.
- **Unit Testing:** [Vitest](https://vitest.dev/) enforcing **80% coverage thresholds** across lines, functions, and statements (75% for branches). Tests run in a **no-network test harness** that blocks all real API calls, ensuring AI-generated tests do not accidentally leak or call live endpoints.
- **E2E Testing:** [Playwright](https://playwright.dev/) configured for **accessibility-first** testing using ARIA locators.

---

## 3. Extension Points

While the core template remains lean, it is designed with clear extension points for common SPA requirements.

### Routing

The template does not enforce a specific router but expects routing to be implemented using the ecosystem standard for the chosen framework (e.g., React Router, Vue Router, or TanStack Router).

### Runtime Validation

**Recommended Tool:** [Zod](https://zod.dev/)
Data boundaries (API responses, form inputs, external config) should be validated at runtime. Zod is recommended for creating schemas that infer static TypeScript types while ensuring runtime safety.

### API Mocking

**Recommended Tool:** [MSW (Mock Service Worker)](https://mswjs.io/)
For local development and robust integration testing, MSW is recommended to intercept network requests at the browser and Node.js level. This aligns perfectly with the repository's strict no-network testing guardrails.

---

## 4. Hub References and Governance

This template consumes shared governance assets from the `MyTemplates` hub:

- **AI Agent Instructions:** Consumes `pack.ai-agent-instructions` for baseline AI governance and prompt-injection defense.
- **Testing Guardrails:** Consumes `pack.testing-guardrails` for Vitest/Playwright CI execution scripts and the no-network harness.
- **GitHub Governance:** Consumes `pack.github-governance` for PR templates, issue templates, and basic CI/CD workflow sequences.

---

## 5. Future Work Needed for Dedicated Repo Publication

Before the standalone `template-vite-web-app` repository can be officially published, the following steps must be completed:

1. **Repository Scaffolding:** Create the actual `template-vite-web-app` repository with the core Vite + TypeScript structure.
2. **Pack Synchronization:** Implement the sync automation (`scripts/sync-pack.js`) to pull the referenced governance, testing, and AI instruction packs from the hub into the new repository.
3. **Local Docs Refinement:** Tailor the `docs/developer/SETUP.md` and `docs/developer/RELEASE_PROCESS.md` specifically for the web application build output.
4. **Manifest Generation:** Add the final machine-readable `template.manifest.json` into the root of the new repository for catalogue compliance.
