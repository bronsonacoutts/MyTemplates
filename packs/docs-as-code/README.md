# Docs-As-Code Pack

## Purpose

Reusable documentation standards, templates, and structure guidance for repos that treat docs as first-class project assets.

## Intended Consumers

- downstream template repos that need shared documentation structure
- maintainers standardizing ADRs, API docs, and user-facing documentation
- repos adopting the hub's documentation tone and file conventions

## Source Of Truth

The canonical files for this pack remain in `docs/` and related top-level doc configuration paths. This pack README is the authoritative inventory for what belongs to the shared docs baseline.

The authoritative files for this pack live in:

- `docs/DOC_STANDARDS.md`
- `docs/STYLE_GUIDE.md`
- `docs/architecture/`
- `docs/api/`
- `docs/user/`
- `docs/reference/`
- `docs/troubleshooting/`

## Inventory

| Path                                               | Role                           | Notes                                                       |
| -------------------------------------------------- | ------------------------------ | ----------------------------------------------------------- |
| `docs/DOC_STANDARDS.md`                            | Standards                      | Shared markdown and documentation quality rules.            |
| `docs/STYLE_GUIDE.md`                              | Writing and coding conventions | Includes AI-assisted edit expectations that influence docs. |
| `docs/architecture/ADR_TEMPLATE.md`                | Template                       | Architecture decision record starter.                       |
| `docs/api/API_TEMPLATE.md`                         | Template                       | API documentation starter.                                  |
| `docs/user/USER_GUIDE_TEMPLATE.md`                 | Template                       | End-user documentation starter.                             |
| `docs/reference/LOGO_ASSETS_TEMPLATE.md`           | Template                       | Brand and logo asset inventory starter.                     |
| `docs/troubleshooting/TROUBLESHOOTING_TEMPLATE.md` | Template                       | Troubleshooting guide starter.                              |
| `docs/USAGE.md`                                    | Adoption guide                 | Explains how consumers should copy and adapt shared assets. |
| `docs/TEMPLATE_LIBRARY_STRATEGY.md`                | Hub policy                     | Documents why the hub-and-spoke docs approach exists.       |

## Sync Notes

- Migration backlog files stay under `docs/migration/` and are owned by the hub, not by this pack's downstream sync surface.
- Release-process docs are owned by the release-management pack.
