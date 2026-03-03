# Documentation Standards

> This guide defines documentation standards for this project. All contributors are expected to follow these standards.

---

## Principles

1. **Accurate over comprehensive.** Outdated documentation is worse than no documentation. Keep docs current.
2. **Audience-first.** Know who you are writing for (developer, user, operator) and tailor accordingly.
3. **Discoverable.** Documentation only helps if people can find it. Use consistent naming and structure.
4. **Maintainable.** Write documentation that is easy to update as code evolves.

---

## Documentation Types

| Type                   | Location                | Audience                            |
| ---------------------- | ----------------------- | ----------------------------------- |
| API Reference          | `docs/api/`             | Developers integrating with the API |
| Architecture Decisions | `docs/architecture/`    | All contributors                    |
| Developer Guides       | `docs/developer/`       | Contributors and maintainers        |
| User Guides            | `docs/user/`            | End users                           |
| Troubleshooting        | `docs/troubleshooting/` | Users and operators                 |
| Deployment             | `docs/deployment/`      | DevOps / operators                  |
| Integration Guides     | `docs/integration/`     | Developers                          |
| Migration Guides       | `docs/migration/`       | Upgrading users                     |
| Reference              | `docs/reference/`       | All audiences                       |

---

## File Naming Conventions

- Use `UPPER_SNAKE_CASE.md` for standalone guides (e.g., `TESTING.md`, `SETUP.md`).
- Use `ADR-NNNN-short-title.md` for Architecture Decision Records (e.g., `ADR-0001-use-vitest.md`).
- Use `API_TEMPLATE.md` style for templates.
- All documentation files must use the `.md` (Markdown) extension.

---

## Markdown Standards

- Use ATX-style headings (`##`) not Setext-style.
- Use `##` for top-level sections within a file (the file title uses `#`).
- Use fenced code blocks with language identifiers:

  ````
  ```typescript
  const x: number = 42;
  ```
  ````

- Use tables for structured comparisons.
- Use relative links when referencing other docs in this repo.
- Wrap lines at 120 characters maximum (enforced by Prettier).
- Use ordered lists for steps/sequences; unordered lists for non-sequential items.

---

## Code Documentation (JSDoc)

All exported symbols **must** have JSDoc comments. See [agent-instructions.md](../agent-instructions.md) for detailed JSDoc requirements.

Minimum required JSDoc:

- `@param` — for each parameter
- `@returns` — for non-void return values
- `@throws` — for documented error conditions
- `@example` — for non-trivial APIs

---

## README Requirements

The root `README.md` must always include:

1. **Project name and description** — what it does in 1–2 sentences.
2. **Badges** — CI status, coverage, license.
3. **Prerequisites** — Node version, npm version, other dependencies.
4. **Getting Started** — clone, install, run (must be tested and accurate).
5. **Available Scripts** — list of `npm run <script>` commands with descriptions.
6. **Project Structure** — high-level directory layout.
7. **Contributing** — link to `CONTRIBUTING.md`.
8. **License** — link to `LICENSE`.

---

## Architecture Decision Records (ADRs)

- ADRs document significant architectural decisions and their context.
- Use the template at `docs/architecture/ADR_TEMPLATE.md`.
- Number ADRs sequentially: `ADR-0001`, `ADR-0002`, etc.
- Once an ADR is accepted, **never modify** it. To supersede it, create a new ADR with `Supersedes: ADR-XXXX`.
- ADR statuses: `Proposed` → `Accepted` / `Rejected` → `Deprecated` / `Superseded`.

---

## Changelog & Release Notes

- **`CHANGELOG.md`** — follows [Keep a Changelog](https://keepachangelog.com/) format.
  - Update for every user-facing change.
  - Group changes under: Added, Changed, Deprecated, Removed, Fixed, Security.
- **`RELEASE_NOTES.md`** — human-readable summary for the current release.
  - Must have `## Changes` and `## Breaking Changes` sections.
  - Validated by `scripts/validate-release-notes.js`.

---

## Review Checklist for Documentation PRs

- [ ] Accurate and reflects current behavior.
- [ ] No broken links.
- [ ] Code examples are syntactically correct.
- [ ] Follows naming conventions.
- [ ] Formatted correctly (run `npm run format:check`).
- [ ] Targeted at the right audience.
