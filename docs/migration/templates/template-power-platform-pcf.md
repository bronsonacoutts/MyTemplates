# Power Platform PCF Template Definition

## Current implementation status

- This hub-side definition remains the authoritative planning document for the PCF template family.
- A dedicated scaffold repo exists at `bronsonacoutts/template-power-platform-pcf`.
- Follow-up work is still open to keep the hub metadata and the downstream repo aligned on manifest shape, shared-pack consumption, and repo-local instruction overrides before this workstream is considered fully complete.

## Scope and Audience

- Audience: PCF control developers, Power Platform engineering teams, and delivery leads who need repeatable packaging/ALM for controls.
- In scope: TypeScript-based PCF controls for model-driven and canvas apps, React/Fluent-UI variants via `pac pcf init --framework`, and solution packaging for managed/unmanaged promotion.
- Non-goals: broader Power Platform app templates, Power Automate flows, or ALM governance beyond the PCF solution surface (covered separately by the ALM governance template).

## Template Positioning

- Differentiates from `template.power-platform-code-app` by focusing on controls, not full app delivery.
- Differentiates from the ALM governance template by keeping ALM guidance scoped to PCF solution packaging and deployment, not environment-wide policies.
- Reuses shared governance packs (AI instructions, docs-as-code, release, testing, GitHub governance) rather than duplicating policies.

## Recommended Repo Structure

- `README.md`: concise orientation, prerequisites (Node 18 LTS, PAC CLI), quick start.
- `package.json`: scripts for lint, build, test, pack.
- `pcfconfig.json`: control project metadata (namespace, template, framework).
- `src/controls/<ControlName>/`
  - `ControlManifest.Input.xml`
  - `index.ts` (entry) and `control.ts` (logic)
  - `resources/` for icons, strings, and css
- `solution/`
  - `Solution.xml`, `Customizations.xml`, `Other/SolutionPackageMapping.xml`
  - `Publisher/` metadata (unique name, prefix)
- `.github/workflows/`: CI pipeline for lint, unit tests, `pac pcf push` smoke, solution pack, and artifact publish.
- `docs/`
  - `developer/SETUP.md` (CLI install, auth, environment setup)
  - `developer/ALM.md` (solution versioning, managed/unmanaged flow)
  - `developer/TESTING.md` (pcf-scripts/Jest + PowerApps Test Engine)
  - `developer/RELEASE_PROCESS.md`
  - `reference/CONTROL_CHECKLIST.md` (accessibility, perf, telemetry)
- `tests/` (Jest specs run via `pcf-scripts test` + optional Test Engine suites)

## Tooling and Scripts

- Use PAC CLI 1.27+ to gain `pac pcf init --framework fluent-react` and solution version increments via `pac solution version --inc <part>` to avoid manual XML edits.
- Target Node 18 LTS (matches current PAC CLI guidance) and keep TypeScript aligned with `pcf-scripts` defaults.
- Suggested npm scripts:
  - `lint`: `eslint "src/**/*.ts"` with repo ESLint baseline.
  - `build`: `pcf-scripts build`
  - `test`: `pcf-scripts test`
  - `pack:solution`: `pac solution pack --zipFile dist/unmanaged.zip --folder solution` (add `--managed` for managed).
  - `version:bump`: `pac solution version --path solution --inc patch`
  - `verify`: runs lint + test + `pac pcf push --publisher-prefix <prefix> --environment <dev>` against a disposable dev environment.

## Build, Test, and Packaging Flow

1. Install tools: `npm ci`, `pac install latest`.
2. Lint and unit tests via `pcf-scripts` (Jest) to cover property updates, bound parameters, and dataset rendering.
3. Optional behaviour tests with PowerApps Test Engine for model-driven/canvas hosts.
4. Pack solution:
   - `pac solution init --publisher-name "<name>" --publisher-prefix "<prefix>" --output-directory solution`
   - `pac solution add-reference --path src/controls/<ControlName>`
   - `pac solution pack --zipFile dist/unmanaged.zip --folder solution`
   - `pac solution pack --zipFile dist/managed.zip --folder solution --managed`
5. Promotion guidance:
   - Keep dev as unmanaged; export managed for test/prod.
   - Version with `pac solution version --inc minor/patch` before each release to keep solution layering predictable.

## CI/CD Expectations

- GitHub Actions workflow using matrix on Node 18/20 to catch toolchain drift.
- Steps: checkout → setup-node → install PAC CLI → `npm ci` → lint → unit tests → optional Test Engine run (gated) → pack unmanaged and managed artifacts → upload artifacts.
- Secrets: service principal for PAC (`POWERPLATFORM_TENANT`, `POWERPLATFORM_CLIENTID`, `POWERPLATFORM_CLIENTSECRET`, `POWERPLATFORM_ENVIRONMENT`) with least privilege; no PAT storage in repo.
- Enforce branch protection and status checks via `pack.github-governance`; reuse release notes and changelog gates via `pack.release-management`.

## Shared Pack Dependencies for the Dedicated Repo

- `pack.ai-agent-instructions` for instruction parity and prompt-injection defense.
- `pack.docs-as-code` for doc templates and style.
- `pack.testing-guardrails` for baseline test config.
- `pack.github-governance` for Actions, CODEOWNERS, and PR templates.
- `pack.release-management` for release docs and validation scripts.

## Open Decisions for Maintainers

- Default UI stack: keep `--framework react` as baseline but document `--framework fluent-react` as the recommended first-class option for Fluent-based controls.
- Telemetry: decide whether to include optional Application Insights wiring in the starter; if yes, add opt-in stub with clear privacy notes.
- Distribution: choose whether to publish a sample control package to GitHub Releases for smoke testing or keep builds internal only.

## Files to Produce When the Dedicated Repo Is Scaffoled

- Machine-readable manifest aligned to `catalog/template-manifest.schema.json`.
- Starter GitHub Actions workflow `ci-pcf.yml` implementing the flow above.
- `docs/developer/ALM.md` derived from this definition and PAC CLI commands.
- Sample control under `src/controls/SampleControl/` illustrating dataset + property binding and accessibility patterns (keyboard + screen reader notes).
