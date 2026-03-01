import { expect, test } from '@playwright/test';

/**
 * Demo page used across sample tests.
 *
 * Tests use page.setContent() to inject HTML directly — no dev server required.
 * In a real project replace these with page.goto('/') once your dev server is configured.
 */
const DEMO_PAGE = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MyTemplates Demo</title>
  </head>
  <body>
    <nav aria-label="Main navigation">
      <a href="#home">Home</a>
      <a href="#about">About</a>
      <a href="#docs">Docs</a>
    </nav>
    <main>
      <h1>Welcome to MyTemplates</h1>
      <p>A comprehensive project template with built-in quality guardrails.</p>
    </main>
    <footer>
      <p>&copy; 2024 MyTemplates</p>
    </footer>
  </body>
</html>
`;

/**
 * Smoke tests — quick critical-path checks.
 * Run with: npm run test:e2e:smoke
 */
test.describe('Smoke Tests @smoke', () => {
  test('page should have the correct title', async ({ page }) => {
    await page.setContent(DEMO_PAGE);
    await expect(page).toHaveTitle('MyTemplates Demo');
  });

  test('main navigation should be visible', async ({ page }) => {
    await page.setContent(DEMO_PAGE);
    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
  });

  test('main heading should be present', async ({ page }) => {
    await page.setContent(DEMO_PAGE);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Welcome to MyTemplates');
  });
});

/**
 * Full E2E tests — broader structural and content coverage.
 * Run with: npm run test:e2e
 */
test.describe('Full E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.setContent(DEMO_PAGE);
  });

  test('all navigation links should be present', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Docs' })).toBeVisible();
  });

  test('main content area should render body copy', async ({ page }) => {
    await expect(page.getByRole('main')).toBeVisible();
    await expect(
      page.getByText('A comprehensive project template with built-in quality guardrails.')
    ).toBeVisible();
  });

  test('footer should be present', async ({ page }) => {
    await expect(page.getByRole('contentinfo')).toBeVisible();
  });
});
