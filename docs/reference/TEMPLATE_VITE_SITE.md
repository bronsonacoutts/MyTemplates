# Vite Site Template Definition

> This document defines the `template.vite-site` dedicated template repo.

## Goal

Create a dedicated repository for content-heavy Vite sites. This template serves as the foundation for documentation, marketing, and explainer-style sites.

## Target Use Cases

- Documentation sites (like docs-as-code).
- Marketing websites.
- Explainer and educational micro-sites.
- Content-heavy sites prioritizing publishing workflows over dynamic interactivity.

## Non-Goals

- Complex Single Page Applications (SPAs) with extensive client-side routing and state management (use the Vite Web App template instead).
- Data-heavy portals or dashboards.
- Highly interactive web applications.

## Boundary with Vite Web App Template

The Vite Web App template (`template.vite-web-app`) is explicitly designed for interactive SPAs. It focuses on runtime validation, complex routing, API mocking, state management, and robust E2E testing of interactive flows.

By contrast, this Vite Site template (`template.vite-site`) is built for **content delivery**. It favors documentation and publishing clarity over framework complexity. Its primary concerns are static content, Markdown workflows, accessibility checks for content readability, SEO, and fast time-to-first-byte.

## Recommended Workflows & Defaults

### Content Workflow

- **Markdown-first:** Content should be primarily authored in Markdown or MDX.
- **Static Generation:** The site should be statically generated (SSG) to ensure fast load times and strong SEO.

### Validation Checks

- **Link Validation:** Automated link checking must be integrated (e.g., via `markdown-link-check` or similar tools in CI) to prevent dead links.
- **Accessibility Checks:** Automated accessibility audits (e.g., using `axe-core` in Playwright tests or a specialized CI action) must be part of the build pipeline to ensure content is readable and navigable by everyone.

### SEO Defaults

- **Metadata:** Pre-configured meta tags for descriptions, canonical URLs, and Open Graph/Twitter cards.
- **Sitemap & robots.txt:** Automated generation of `sitemap.xml` and `robots.txt`.

### Deployment Docs

- Clear instructions on deploying to static hosting providers (e.g., GitHub Pages, Vercel, Netlify, Azure Static Web Apps).

## Shared Hub Dependencies

This template will consume the following shared packs from the hub:

- `pack.github-governance` (for baseline workflows)
- `pack.ai-agent-instructions` (for AI assistance guardrails)
- `pack.docs-as-code` (for baseline documentation standards)
- `pack.testing-guardrails` (for accessibility and basic content E2E testing)

## Unresolved Maintainer Decisions

1. **Specific SSG Framework:** Will this use VitePress, Astro (with Vite), or plain Vite with a static site plugin? (Recommendation leans toward VitePress for docs or Astro for marketing, but VitePress is most aligned with a pure Vite docs focus).
2. **Tailwind UI Integration:** Should `pack.tailwind-ui` be a default inclusion here, or strictly an opt-in variant for marketing sites versus generic docs?
3. **Link Checking Tool:** Selecting the specific link-checking action/tool to standardise on in the CI pipeline.
