# Issue 12: Publish the Home Assistant / operations automation template repo

## Goal

Create a dedicated template for automation-heavy operational repositories.

## Deliverables

- scripts/hooks/examples structure
- security and secrets documentation
- operations runbook and troubleshooting docs
- governance baseline for high-control repos

## Acceptance criteria

- the repo reflects the operational safety expectations seen in `ha-git-sync`
- secrets handling and rollback guidance are documented
- CI and settings follow the stronger automation tier

## Prompt for Codex

```text
You are working in the `MyTemplates` repository. Prepare the operations-automation template definition inspired by Home Assistant / automation-heavy work.

Read first:
- `docs/TEMPLATE_LIBRARY_STRATEGY.md`
- current security, testing, and troubleshooting docs
- any existing automation/governance materials in the repo

Objective:
Define a dedicated template for operational automation repositories where secrets handling, rollback guidance, and runbooks matter more than general app scaffolding.

Required work:
1. Document the template's audience, scope, and higher-control governance posture.
2. Specify expected structure for scripts, hooks, examples, troubleshooting, and operations docs.
3. Capture secrets handling, rollback, and least-privilege guidance.
4. Add any catalogue or roadmap updates needed in the hub repo.

Constraints:
- Keep the template clearly distinct from app starters and knowledge-site templates.
- Do not weaken security expectations for convenience.

Validation:
- run formatting/lint checks relevant to changed files
- verify the governance tier aligns with the repo settings guidance

Final output expectation:
Summarize the operations template definition, its safety controls, and any manual maintainer choices still needed.
```
