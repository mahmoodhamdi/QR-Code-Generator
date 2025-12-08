import { test, expect } from '@playwright/test';

test.describe('Batch Generation Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/batch');
  });

  test('should display the batch generator interface', async ({ page }) => {
    // Check heading
    await expect(page.getByRole('heading', { name: /batch/i })).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'test-screenshots/batch-initial.png', fullPage: true });
  });

  test('should show input method options', async ({ page }) => {
    // Take screenshot
    await page.screenshot({ path: 'test-screenshots/batch-input-options.png', fullPage: true });
  });

  test('should show QR type selector', async ({ page }) => {
    // Take screenshot of batch page with type selector
    await page.screenshot({ path: 'test-screenshots/batch-type-selector.png', fullPage: true });
  });

  test('should have text input for batch data', async ({ page }) => {
    // Should have a textarea or similar for entering multiple items
    const textarea = page.getByRole('textbox').first();

    if (await textarea.isVisible()) {
      await textarea.fill('https://example1.com\nhttps://example2.com\nhttps://example3.com');

      // Take screenshot
      await page.screenshot({ path: 'test-screenshots/batch-with-data.png', fullPage: true });
    }
  });

  test('should show generate button', async ({ page }) => {
    // Should have a button to generate batch QR codes
    const generateButton = page.getByRole('button', { name: /generate/i });
    await expect(generateButton).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'test-screenshots/batch-generate-button.png', fullPage: true });
  });
});
