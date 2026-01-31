import { test, expect } from '@playwright/test';

/**
 * Smoke tests - quick critical path tests
 * Run with: npm run test:e2e:smoke
 */

test.describe('Smoke Tests @smoke', () => {
  test('homepage should load', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/MyTemplates/);
  });

  test('navigation should be visible @smoke', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });
});

/**
 * Full E2E tests - comprehensive test coverage
 * Run with: npm run test:e2e (runs all tests including smoke)
 */

test.describe('Full E2E Tests', () => {
  test('should navigate between pages', async ({ page }) => {
    await page.goto('/');
    // Add your navigation tests here
    expect(true).toBe(true);
  });

  test('should handle user interactions', async ({ page }) => {
    await page.goto('/');
    // Add your interaction tests here
    expect(true).toBe(true);
  });
});
