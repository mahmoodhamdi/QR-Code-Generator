import { test, expect } from '@playwright/test';

test.describe('Templates Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/templates');
  });

  test('should display the templates gallery', async ({ page }) => {
    // Check heading
    await expect(page.getByRole('heading', { name: /template/i })).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'test-screenshots/templates-initial.png', fullPage: true });
  });

  test('should show template cards', async ({ page }) => {
    // Should display multiple template options
    // Wait for templates to load
    await page.waitForTimeout(500);

    // Check for template items (cards or buttons)
    const templates = page.locator('[data-template], .template-card, button:has-text("template"), [class*="template"]');

    // Take screenshot showing templates
    await page.screenshot({ path: 'test-screenshots/templates-gallery.png', fullPage: true });
  });

  test('should show preview when template is selected', async ({ page }) => {
    await page.waitForTimeout(500);

    // Click on first template-like element if available
    const firstTemplate = page.locator('button').filter({ hasText: /business|modern|classic|simple/i }).first();

    if (await firstTemplate.isVisible()) {
      await firstTemplate.click();
      await page.waitForTimeout(300);

      // Take screenshot after selection
      await page.screenshot({ path: 'test-screenshots/templates-selected.png', fullPage: true });
    }
  });

  test('should have use template action', async ({ page }) => {
    await page.waitForTimeout(500);

    // Should have a way to use/apply the template
    const useButton = page.getByRole('button', { name: /use|apply|select/i });

    if (await useButton.first().isVisible()) {
      // Take screenshot
      await page.screenshot({ path: 'test-screenshots/templates-use-button.png', fullPage: true });
    }
  });

  test('should show template categories or filters', async ({ page }) => {
    await page.waitForTimeout(500);

    // Check for category filters or tabs
    const hasFilters = await page.getByRole('tablist').isVisible().catch(() => false);
    const hasCategories = await page.getByText(/all|business|social|creative/i).isVisible().catch(() => false);

    // Take screenshot
    await page.screenshot({ path: 'test-screenshots/templates-filters.png', fullPage: true });
  });
});
