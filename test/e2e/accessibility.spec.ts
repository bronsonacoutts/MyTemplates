import { expect, test } from '@playwright/test';

/**
 * Accessibility Tests
 *
 * Demonstrates testing accessibility fundamentals with Playwright:
 * - Correct heading hierarchy (h1 → h2 → h3)
 * - Landmark regions (main, nav, footer, aside)
 * - Form accessibility (labels, required, ARIA attributes)
 * - Keyboard navigation (Tab focus order, Enter/Space activation)
 * - ARIA state management (aria-expanded, aria-disabled, aria-hidden)
 * - Image alt text
 *
 * Accessibility locators (getByRole, getByLabel, getByText) are preferred
 * because they mirror how assistive technologies navigate the DOM.
 */

// ---------------------------------------------------------------------------
// Document structure
// ---------------------------------------------------------------------------

const STRUCTURE_PAGE = `
<!doctype html>
<html lang="en">
  <head><meta charset="UTF-8"><title>Page Structure</title></head>
  <body>
    <header>
      <nav aria-label="Primary navigation">
        <a href="#main">Skip to main content</a>
        <a href="#section-a">Section A</a>
        <a href="#section-b">Section B</a>
      </nav>
    </header>
    <main id="main">
      <h1>Page title</h1>
      <section aria-labelledby="section-a-heading">
        <h2 id="section-a-heading">Section A</h2>
        <p>Content for section A.</p>
        <h3>Sub-section A1</h3>
        <p>Sub-section content.</p>
      </section>
      <section aria-labelledby="section-b-heading">
        <h2 id="section-b-heading">Section B</h2>
        <p>Content for section B.</p>
      </section>
    </main>
    <aside aria-label="Related links">
      <h2>See also</h2>
      <ul>
        <li><a href="#resource-1">Resource 1</a></li>
        <li><a href="#resource-2">Resource 2</a></li>
      </ul>
    </aside>
    <footer>
      <p>&copy; 2024 MyTemplates</p>
    </footer>
  </body>
</html>
`;

test.describe('Document Structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.setContent(STRUCTURE_PAGE);
  });

  test('page should have exactly one h1', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  });

  test('h1 should precede h2 headings', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page title');
    const h2Headings = page.getByRole('heading', { level: 2 });
    await expect(h2Headings).toHaveCount(3); // Section A, Section B, See also
  });

  test('page should have the required landmark regions', async ({ page }) => {
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible();
    await expect(page.getByRole('complementary', { name: 'Related links' })).toBeVisible();
    await expect(page.getByRole('contentinfo')).toBeVisible();
  });

  test('skip link should be present for keyboard users', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeAttached();
  });
});

// ---------------------------------------------------------------------------
// Form accessibility
// ---------------------------------------------------------------------------

const ACCESSIBLE_FORM_PAGE = `
<!doctype html>
<html lang="en">
  <head><meta charset="UTF-8"><title>Accessible Form</title></head>
  <body>
    <form>
      <div>
        <label for="a11y-name">
          Full name
          <span aria-label="required" title="Required field">*</span>
        </label>
        <input
          id="a11y-name"
          type="text"
          required
          aria-required="true"
          aria-describedby="name-hint"
        />
        <span id="name-hint">Enter your legal first and last name.</span>
      </div>

      <div>
        <label for="a11y-email">Email</label>
        <input
          id="a11y-email"
          type="email"
          required
          aria-required="true"
          autocomplete="email"
        />
      </div>

      <div>
        <label for="a11y-age">Age</label>
        <input
          id="a11y-age"
          type="number"
          min="18"
          max="120"
          aria-describedby="age-hint"
        />
        <span id="age-hint">Must be 18 or older.</span>
      </div>

      <div role="group" aria-labelledby="comms-legend">
        <span id="comms-legend">Preferred contact method</span>
        <label><input type="radio" name="comms" value="email" /> Email</label>
        <label><input type="radio" name="comms" value="phone" /> Phone</label>
        <label><input type="radio" name="comms" value="none" checked /> No preference</label>
      </div>

      <button type="submit">Register</button>
    </form>
  </body>
</html>
`;

test.describe('Form Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.setContent(ACCESSIBLE_FORM_PAGE);
  });

  test('all inputs should have associated labels', async ({ page }) => {
    await expect(page.getByLabel('Full name')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Age')).toBeVisible();
  });

  test('required fields should be marked with aria-required', async ({ page }) => {
    await expect(page.getByLabel('Full name')).toHaveAttribute('aria-required', 'true');
    await expect(page.getByLabel('Email')).toHaveAttribute('aria-required', 'true');
  });

  test('input should reference its hint text via aria-describedby', async ({ page }) => {
    const nameInput = page.getByLabel('Full name');
    await expect(nameInput).toHaveAttribute('aria-describedby', 'name-hint');
    await expect(page.locator('#name-hint')).toHaveText('Enter your legal first and last name.');
  });

  test('radio group should be reachable by role', async ({ page }) => {
    const group = page.getByRole('group', { name: 'Preferred contact method' });
    await expect(group).toBeVisible();
    await expect(group.getByRole('radio')).toHaveCount(3);
  });

  test('number input should have min and max constraints', async ({ page }) => {
    const ageInput = page.getByLabel('Age');
    await expect(ageInput).toHaveAttribute('min', '18');
    await expect(ageInput).toHaveAttribute('max', '120');
  });
});

// ---------------------------------------------------------------------------
// Image alt text
// ---------------------------------------------------------------------------

const IMAGE_PAGE = `
<!doctype html>
<html lang="en">
  <head><meta charset="UTF-8"><title>Images</title></head>
  <body>
    <img src="logo.png" alt="MyTemplates logo" width="200" height="60" />
    <img src="hero.jpg" alt="Developer working at a standing desk" width="800" height="400" />
    <!-- Decorative image — empty alt attribute is correct -->
    <img src="divider.png" alt="" role="presentation" width="600" height="4" />
  </body>
</html>
`;

test.describe('Image Alt Text', () => {
  test.beforeEach(async ({ page }) => {
    await page.setContent(IMAGE_PAGE);
  });

  test('informative images should have descriptive alt text', async ({ page }) => {
    const logo = page.getByRole('img', { name: 'MyTemplates logo' });
    await expect(logo).toBeAttached();

    const hero = page.getByRole('img', { name: 'Developer working at a standing desk' });
    await expect(hero).toBeAttached();
  });

  test('decorative images should have empty alt attribute', async ({ page }) => {
    const decorative = page.locator('img[role="presentation"]');
    await expect(decorative).toHaveAttribute('alt', '');
  });
});

// ---------------------------------------------------------------------------
// Keyboard navigation
// ---------------------------------------------------------------------------

const KEYBOARD_PAGE = `
<!doctype html>
<html lang="en">
  <head><meta charset="UTF-8"><title>Keyboard Nav</title></head>
  <body>
    <a href="#main">Skip to content</a>
    <nav>
      <a href="#home">Home</a>
      <a href="#about">About</a>
    </nav>
    <main id="main">
      <h1>Keyboard Navigation</h1>
      <button type="button" id="open-dialog">Open dialog</button>
      <dialog id="modal" aria-labelledby="dialog-title">
        <h2 id="dialog-title">Confirm action</h2>
        <p>Are you sure you want to proceed?</p>
        <button type="button" id="confirm">Confirm</button>
        <button type="button" id="cancel">Cancel</button>
      </dialog>
    </main>
    <script>
      var modal = document.getElementById('modal');
      document.getElementById('open-dialog').addEventListener('click', function () {
        modal.showModal();
        document.getElementById('confirm').focus();
      });
      document.getElementById('cancel').addEventListener('click', function () {
        modal.close();
        document.getElementById('open-dialog').focus();
      });
      document.getElementById('confirm').addEventListener('click', function () {
        modal.close();
        document.getElementById('open-dialog').focus();
      });
    </script>
  </body>
</html>
`;

test.describe('Keyboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.setContent(KEYBOARD_PAGE);
  });

  test('Tab key should move focus through interactive elements in order', async ({ page }) => {
    // Start from the body and tab through
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Home' })).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'About' })).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Open dialog' })).toBeFocused();
  });

  test('Enter key should activate a focused button', async ({ page }) => {
    await page.getByRole('button', { name: 'Open dialog' }).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('dialog', { name: 'Confirm action' })).toBeVisible();
  });

  test('dialog should trap focus on open', async ({ page }) => {
    await page.getByRole('button', { name: 'Open dialog' }).click();
    // Focus should land on the first interactive element inside the dialog
    await expect(page.getByRole('button', { name: 'Confirm' })).toBeFocused();
  });

  test('closing dialog should return focus to trigger button', async ({ page }) => {
    await page.getByRole('button', { name: 'Open dialog' }).click();
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('button', { name: 'Open dialog' })).toBeFocused();
  });
});

// ---------------------------------------------------------------------------
// ARIA states
// ---------------------------------------------------------------------------

const ARIA_STATES_PAGE = `
<!doctype html>
<html lang="en">
  <head><meta charset="UTF-8"><title>ARIA States</title></head>
  <body>
    <nav>
      <button
        type="button"
        aria-expanded="false"
        aria-controls="dropdown"
        id="menu-btn"
      >
        Menu
      </button>
      <ul id="dropdown" hidden>
        <li><a href="#item1">Item 1</a></li>
        <li><a href="#item2">Item 2</a></li>
      </ul>
    </nav>

    <button type="button" aria-disabled="true" id="disabled-btn">Restricted action</button>

    <div role="alert" id="alert-region" hidden>Operation completed.</div>
    <button type="button" id="trigger-alert">Complete operation</button>

    <script>
      document.getElementById('menu-btn').addEventListener('click', function () {
        var expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', String(!expanded));
        var dropdown = document.getElementById('dropdown');
        dropdown.hidden = expanded;
      });
      document.getElementById('trigger-alert').addEventListener('click', function () {
        var alert = document.getElementById('alert-region');
        alert.hidden = false;
      });
    </script>
  </body>
</html>
`;

test.describe('ARIA States', () => {
  test.beforeEach(async ({ page }) => {
    await page.setContent(ARIA_STATES_PAGE);
  });

  test('collapsed menu should have aria-expanded="false" and hidden list', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Menu' });
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#dropdown')).toBeHidden();
  });

  test('expanding menu should update aria-expanded and reveal the list', async ({ page }) => {
    await page.getByRole('button', { name: 'Menu' }).click();
    await expect(page.getByRole('button', { name: 'Menu' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
    await expect(page.locator('#dropdown')).toBeVisible();
  });

  test('collapsing menu again should restore aria-expanded="false"', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Menu' });
    await button.click(); // open
    await button.click(); // close
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#dropdown')).toBeHidden();
  });

  test('aria-disabled button should be present but marked as unavailable', async ({ page }) => {
    await expect(page.locator('#disabled-btn')).toHaveAttribute('aria-disabled', 'true');
  });

  test('role="alert" region should appear after triggering action', async ({ page }) => {
    await expect(page.locator('#alert-region')).toBeHidden();
    await page.getByRole('button', { name: 'Complete operation' }).click();
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByRole('alert')).toHaveText('Operation completed.');
  });
});
