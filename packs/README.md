# Shared Packs

`packs/` is the hub-facing index for reusable assets that downstream template repositories can consume without adopting the whole `MyTemplates` repo shape.

This first implementation is intentionally additive:

- canonical source files remain in their current working paths
- each pack README declares which files are authoritative for that pack
- mirrored files are called out explicitly
- sync automation is deferred to issue `14`

Current packs:

- [github-governance](github-governance/README.md)
- [azure-devops-governance](azure-devops-governance/README.md)
- [ai-agent-instructions](ai-agent-instructions/README.md)
- [docs-as-code](docs-as-code/README.md)
- [release-management](release-management/README.md)
- [testing-guardrails](testing-guardrails/README.md)
