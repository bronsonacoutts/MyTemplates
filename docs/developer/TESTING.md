# Testing Guide

> Comprehensive guide to testing practices, tools, and requirements for this project.

---

## Overview

This project uses a two-tier testing strategy:

| Tier               | Tool                                  | Purpose                                    |
| ------------------ | ------------------------------------- | ------------------------------------------ |
| Unit / Integration | [Vitest](https://vitest.dev/)         | Fast, isolated tests of individual modules |
| End-to-End (E2E)   | [Playwright](https://playwright.dev/) | Browser-level tests of complete user flows |

---

## Coverage Thresholds

Coverage is enforced in CI using `@vitest/coverage-v8`. The build **fails** if any threshold is not met.

| Metric     | Threshold |
| ---------- | --------- |
| Lines      | **80%**   |
| Functions  | **80%**   |
| Statements | **80%**   |
| Branches   | **75%**   |

Thresholds are configured in `vitest.config.ts`.

---

## Running Tests

```bash
# Unit tests (no coverage report)
npm test

# Unit tests with coverage report
npm run test:unit

# Watch mode (re-runs on file change)
npm run test:watch

# E2E tests (full suite)
npm run test:e2e

# E2E smoke tests only (tagged @smoke)
npm run test:e2e:smoke
```

---

## Unit Tests (Vitest)

### File Location & Naming

- Unit test files use the `.test.ts` or `.spec.ts` extension.
- Place tests in `test/` mirroring the `src/` structure, or co-locate next to source files.
- Example: `src/utils/format.ts` → `test/utils/format.test.ts`

### Writing Unit Tests

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { myFunction } from '../../src/utils/myModule.js';

describe('myFunction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return the correct value for valid input', () => {
    const result = myFunction('valid input');
    expect(result).toBe('expected output');
  });

  it('should throw an error for invalid input', () => {
    expect(() => myFunction('')).toThrow('Input cannot be empty');
  });
});
```

### Mocking

Use `vi.mock()` to mock modules, and `vi.spyOn()` to spy on specific methods:

```typescript
import { vi } from 'vitest';

// Mock an entire module
vi.mock('../../src/services/httpClient.js', () => ({
  get: vi.fn().mockResolvedValue({ data: { id: 1 } }),
}));

// Spy on a method
const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
```

### Rules

- **No real network calls.** Mock all HTTP clients.
- **No real filesystem access** unless testing a filesystem utility (use temp directories).
- **Independent tests.** No shared mutable state between tests.
- **Descriptive names.** Use behavior-driven naming: `"should return 404 when user is not found"`.
- **Assert outcomes, not implementation.** Don't test private methods directly.

---

## E2E Tests (Playwright)

### File Location & Naming

- E2E test files live in `test/e2e/` and use the `.spec.ts` extension.
- Name files after the feature being tested: `test/e2e/auth.spec.ts`, `test/e2e/checkout.spec.ts`.

### Writing E2E Tests

```typescript
import { test, expect } from '@playwright/test';

test.describe('User Authentication', () => {
  test('should log in with valid credentials @smoke', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('secret');
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page).toHaveURL('/dashboard');
  });
});
```

### Playwright Best Practices

- Use accessibility locators (`getByRole`, `getByLabel`, `getByText`) over CSS selectors.
- Tag smoke tests with `@smoke` in the test name for fast subset runs.
- Clean up test data after each test.
- Use `page.waitForLoadState('networkidle')` sparingly — prefer explicit assertions.
- Use the Playwright `expect` API for assertions — it has auto-retry built in.

### Configuration

Playwright config lives in `playwright.config.ts`. Key settings:

- Base URL is configured via environment variables.
- Multiple browser contexts can be configured for cross-browser testing.

---

## Test Setup & Global Utilities

The file `test/setup.ts` is run before each test suite. Use it for:

- Global mocks that apply to all tests.
- Custom matchers.
- Environment variable setup.

Test helpers live in `test/tests/helpers/`. Import shared utilities from there to avoid duplication.

---

## Debugging Failing Tests

### Vitest

```bash
# Run a single test file
npx vitest run test/utils/format.test.ts

# Run tests matching a pattern
npx vitest run --reporter verbose -t "should return 404"

# Debug with Node.js inspector
node --inspect-brk node_modules/.bin/vitest run
```

### Playwright

```bash
# Run in headed mode (visible browser)
npx playwright test --headed

# Run with Playwright Inspector (step-through debugger)
npx playwright test --debug

# Show HTML report after test run
npx playwright show-report
```

---

## CI Behavior

- Unit tests with coverage run in the `test` job of `.github/workflows/ci.yml`.
- CI fails if any coverage threshold is not met.
- Coverage reports are uploaded as artifacts (retained for 7 days).
- E2E tests are not run in the standard CI pipeline by default — configure separately for environments with a running application.
