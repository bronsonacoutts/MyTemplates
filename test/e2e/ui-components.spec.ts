import { expect, test } from '@playwright/test';

/**
 * UI Component Tests
 *
 * Demonstrates testing common UI components and interactions using page.setContent().
 * Covers: buttons, text inputs, checkboxes, radio buttons, select dropdowns, and forms.
 *
 * Patterns shown:
 * - getByRole / getByLabel accessibility locators (preferred over CSS selectors)
 * - Awaiting all assertions
 * - Testing enabled/disabled states
 * - ARIA attribute assertions
 * - Live region updates after interactions
 */

// ---------------------------------------------------------------------------
// Buttons
// ---------------------------------------------------------------------------

const BUTTON_PAGE = `
<!doctype html>
<html lang="en">
  <head><meta charset="UTF-8"><title>Buttons</title></head>
  <body>
    <button type="button" id="primary">Save changes</button>
    <button type="button" disabled>Disabled action</button>
    <button type="button" aria-pressed="false" id="toggle">Toggle feature</button>
    <div role="status" aria-live="polite" id="status"></div>
    <script>
      document.getElementById('primary').addEventListener('click', function () {
        document.getElementById('status').textContent = 'Changes saved.';
      });
      document.getElementById('toggle').addEventListener('click', function () {
        var pressed = this.getAttribute('aria-pressed') === 'true';
        this.setAttribute('aria-pressed', String(!pressed));
      });
    </script>
  </body>
</html>
`;

test.describe('Button Components', () => {
  test('enabled button should be clickable and update live region', async ({ page }) => {
    await page.setContent(BUTTON_PAGE);
    const button = page.getByRole('button', { name: 'Save changes' });
    await expect(button).toBeEnabled();
    await button.click();
    await expect(page.getByRole('status')).toHaveText('Changes saved.');
  });

  test('disabled button should not be interactive', async ({ page }) => {
    await page.setContent(BUTTON_PAGE);
    await expect(page.getByRole('button', { name: 'Disabled action' })).toBeDisabled();
  });

  test('toggle button should flip aria-pressed on each click', async ({ page }) => {
    await page.setContent(BUTTON_PAGE);
    const toggle = page.getByRole('button', { name: 'Toggle feature' });

    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  });
});

// ---------------------------------------------------------------------------
// Text & Email Inputs
// ---------------------------------------------------------------------------

const INPUT_PAGE = `
<!doctype html>
<html lang="en">
  <head><meta charset="UTF-8"><title>Inputs</title></head>
  <body>
    <label for="username">Username</label>
    <input id="username" type="text" placeholder="Enter username" />

    <label for="email">Email</label>
    <input id="email" type="email" placeholder="you@example.com" />

    <label for="bio">Bio</label>
    <textarea id="bio" placeholder="Tell us about yourself"></textarea>
  </body>
</html>
`;

test.describe('Text Inputs', () => {
  test('should type into a text field and read back the value', async ({ page }) => {
    await page.setContent(INPUT_PAGE);
    const input = page.getByLabel('Username');
    await input.fill('johndoe');
    await expect(input).toHaveValue('johndoe');
  });

  test('should clear a text field', async ({ page }) => {
    await page.setContent(INPUT_PAGE);
    const input = page.getByLabel('Username');
    await input.fill('to be removed');
    await input.clear();
    await expect(input).toHaveValue('');
  });

  test('should fill an email field', async ({ page }) => {
    await page.setContent(INPUT_PAGE);
    await page.getByLabel('Email').fill('user@example.com');
    await expect(page.getByLabel('Email')).toHaveValue('user@example.com');
  });

  test('should fill a textarea', async ({ page }) => {
    await page.setContent(INPUT_PAGE);
    await page.getByLabel('Bio').fill('Full-stack developer passionate about open source.');
    await expect(page.getByLabel('Bio')).toHaveValue(
      'Full-stack developer passionate about open source.'
    );
  });

  test('inputs should show placeholder text when empty', async ({ page }) => {
    await page.setContent(INPUT_PAGE);
    await expect(page.getByLabel('Username')).toHaveAttribute('placeholder', 'Enter username');
    await expect(page.getByLabel('Email')).toHaveAttribute('placeholder', 'you@example.com');
  });
});

// ---------------------------------------------------------------------------
// Checkbox & Radio
// ---------------------------------------------------------------------------

const CHECKBOX_PAGE = `
<!doctype html>
<html lang="en">
  <head><meta charset="UTF-8"><title>Checkboxes</title></head>
  <body>
    <fieldset>
      <legend>Notifications</legend>
      <label><input type="checkbox" name="email-notif" /> Email notifications</label>
      <label><input type="checkbox" name="sms-notif" checked /> SMS notifications</label>
    </fieldset>

    <fieldset>
      <legend>Plan</legend>
      <label><input type="radio" name="plan" value="free" /> Free</label>
      <label><input type="radio" name="plan" value="pro" checked /> Pro</label>
      <label><input type="radio" name="plan" value="enterprise" /> Enterprise</label>
    </fieldset>
  </body>
</html>
`;

test.describe('Checkboxes and Radio Buttons', () => {
  test('unchecked checkbox should be checkable', async ({ page }) => {
    await page.setContent(CHECKBOX_PAGE);
    const checkbox = page.getByRole('checkbox', { name: 'Email notifications' });
    await expect(checkbox).not.toBeChecked();
    await checkbox.check();
    await expect(checkbox).toBeChecked();
  });

  test('checked checkbox should be uncheckable', async ({ page }) => {
    await page.setContent(CHECKBOX_PAGE);
    const checkbox = page.getByRole('checkbox', { name: 'SMS notifications' });
    await expect(checkbox).toBeChecked();
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
  });

  test('radio button selection should be mutually exclusive', async ({ page }) => {
    await page.setContent(CHECKBOX_PAGE);
    const proRadio = page.getByRole('radio', { name: 'Pro' });
    const freeRadio = page.getByRole('radio', { name: 'Free' });

    await expect(proRadio).toBeChecked();
    await freeRadio.check();
    await expect(freeRadio).toBeChecked();
    await expect(proRadio).not.toBeChecked();
  });
});

// ---------------------------------------------------------------------------
// Select dropdown
// ---------------------------------------------------------------------------

const SELECT_PAGE = `
<!doctype html>
<html lang="en">
  <head><meta charset="UTF-8"><title>Select</title></head>
  <body>
    <label for="country">Country</label>
    <select id="country">
      <option value="">— choose a country —</option>
      <option value="au">Australia</option>
      <option value="gb">United Kingdom</option>
      <option value="us">United States</option>
    </select>
  </body>
</html>
`;

test.describe('Select Dropdown', () => {
  test('should select an option by label', async ({ page }) => {
    await page.setContent(SELECT_PAGE);
    await page.getByLabel('Country').selectOption({ label: 'Australia' });
    await expect(page.getByLabel('Country')).toHaveValue('au');
  });

  test('should select an option by value', async ({ page }) => {
    await page.setContent(SELECT_PAGE);
    await page.getByLabel('Country').selectOption('gb');
    await expect(page.getByLabel('Country')).toHaveValue('gb');
  });
});

// ---------------------------------------------------------------------------
// Form — submission and dynamic content
// ---------------------------------------------------------------------------

const FORM_PAGE = `
<!doctype html>
<html lang="en">
  <head><meta charset="UTF-8"><title>Contact Form</title></head>
  <body>
    <form id="contact-form">
      <div>
        <label for="full-name">Full name</label>
        <input id="full-name" name="full-name" type="text" required />
      </div>
      <div>
        <label for="contact-email">Email</label>
        <input id="contact-email" name="contact-email" type="email" required />
      </div>
      <div>
        <label for="subject">Subject</label>
        <select id="subject" name="subject">
          <option value="">Select a subject</option>
          <option value="support">Support</option>
          <option value="sales">Sales</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label>
          <input type="checkbox" id="agree" name="agree" required />
          I agree to the terms
        </label>
      </div>
      <button type="submit">Send message</button>
    </form>
    <section id="success-message" hidden aria-live="polite">
      <h2>Thank you!</h2>
      <p>Your message has been sent.</p>
    </section>
    <script>
      document.getElementById('contact-form').addEventListener('submit', function (e) {
        e.preventDefault();
        document.getElementById('contact-form').hidden = true;
        document.getElementById('success-message').hidden = false;
      });
    </script>
  </body>
</html>
`;

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.setContent(FORM_PAGE);
  });

  test('form fields should be present and labelled', async ({ page }) => {
    await expect(page.getByLabel('Full name')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Subject')).toBeVisible();
    await expect(page.getByRole('checkbox', { name: /I agree to the terms/ })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send message' })).toBeVisible();
  });

  test('should show success message after valid submission', async ({ page }) => {
    await page.getByLabel('Full name').fill('Jane Smith');
    await page.getByLabel('Email').fill('jane@example.com');
    await page.getByLabel('Subject').selectOption('support');
    await page.getByRole('checkbox', { name: /I agree to the terms/ }).check();

    await page.getByRole('button', { name: 'Send message' }).click();

    await expect(page.getByRole('heading', { name: 'Thank you!' })).toBeVisible();
    await expect(page.getByText('Your message has been sent.')).toBeVisible();
    await expect(page.locator('#contact-form')).toBeHidden();
  });

  test('submit button should be reachable via keyboard', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Send message' });
    await button.focus();
    await expect(button).toBeFocused();
  });
});
