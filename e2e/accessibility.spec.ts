import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test('should have proper heading hierarchy on home page', async ({ page }) => {
    await page.goto('/');

    // Check for h1
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'test-screenshots/a11y-headings.png', fullPage: true });
  });

  test('should have accessible form labels', async ({ page }) => {
    await page.goto('/');

    // URL input should have associated label
    const urlInput = page.getByLabel(/url/i);
    await expect(urlInput).toBeVisible();

    // Switch to vCard and check labels
    await page.getByRole('button', { name: /vcard/i }).click();

    const firstNameInput = page.getByLabel(/first name/i);
    await expect(firstNameInput).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'test-screenshots/a11y-labels.png', fullPage: true });
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');

    // Tab through the page
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Some element should be focused
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'test-screenshots/a11y-keyboard.png', fullPage: true });
  });

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/');

    // This is a visual check - we'll take screenshots in both themes
    await page.screenshot({ path: 'test-screenshots/a11y-contrast-light.png', fullPage: true });

    // Toggle to dark mode if possible
    const themeToggle = page.getByRole('button', { name: /(theme|dark|light)/i });
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await page.waitForTimeout(300);
      await page.screenshot({ path: 'test-screenshots/a11y-contrast-dark.png', fullPage: true });
    }
  });

  test('should have alt text for images', async ({ page }) => {
    await page.goto('/');

    // Generate a QR code first
    await page.getByLabel(/url/i).fill('https://example.com');
    await page.waitForTimeout(500);

    // QR code image should have alt text
    const qrImage = page.getByAltText(/qr code/i);
    await expect(qrImage).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'test-screenshots/a11y-alt-text.png', fullPage: true });
  });

  test('should have proper button roles', async ({ page }) => {
    await page.goto('/');

    // All clickable elements that look like buttons should have button role
    const downloadButton = page.getByRole('button', { name: /download/i });
    await expect(downloadButton).toBeVisible();

    const copyButton = page.getByRole('button', { name: /copy/i });
    await expect(copyButton).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'test-screenshots/a11y-buttons.png', fullPage: true });
  });
});
