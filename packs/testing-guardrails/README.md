# Testing Guardrails Pack

## Purpose

Reusable test harness and quality-gate assets that make AI-assisted changes safer by default.

## Intended Consumers

- application templates that need strict TypeScript and no-network testing defaults
- frontend repos standardizing on Vitest and Playwright guardrails
- maintainers who want sample tests and docs for safe test authoring

## Source Of Truth

The authoritative test assets remain in the current config, docs, and `test/` paths below. This pack README defines the shared testing baseline that downstream templates should consume.

The authoritative files for this pack live in:

- `test/`
- `vitest.config.ts`
- `playwright.config.ts`
- `docs/developer/TESTING.md`

## Inventory

| Path                             | Role                    | Notes                                                       |
| -------------------------------- | ----------------------- | ----------------------------------------------------------- |
| `test/setup.ts`                  | Global harness          | Blocks real network calls and applies shared test setup.    |
| `test/sample.test.ts`            | Sample unit test        | Minimal reference for unit test structure.                  |
| `test/e2e/sample.spec.ts`        | Sample E2E test         | Base Playwright test example.                               |
| `test/e2e/accessibility.spec.ts` | Accessibility guardrail | ARIA-first smoke coverage example.                          |
| `test/e2e/ui-components.spec.ts` | UI guardrail            | Component interaction example using accessibility locators. |
| `vitest.config.ts`               | Unit-test config        | Coverage thresholds and Vitest configuration.               |
| `playwright.config.ts`           | E2E config              | Browser test defaults and runtime wiring.                   |
| `docs/developer/TESTING.md`      | Testing guide           | Shared testing practices and debugging guidance.            |

## Sync Notes

- Runtime-specific test suites can extend this baseline, but the no-network harness should remain intact unless the downstream repo documents an intentional exception.
- CI wiring that executes these checks belongs to the github-governance pack.
