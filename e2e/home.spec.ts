import { test, expect } from '@playwright/test';

test.describe('Home Page - QR Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the QR Generator interface', async ({ page }) => {
    // Check main heading
    await expect(page.getByRole('heading', { name: /qr code generator/i })).toBeVisible();

    // Check QR type selector buttons
    await expect(page.getByRole('button', { name: /url/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /text/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /email/i })).toBeVisible();

    // Check preview area
    await expect(page.getByText(/no qr code yet/i)).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'test-screenshots/home-initial.png', fullPage: true });
  });

  test('should generate QR code for URL', async ({ page }) => {
    // URL should be selected by default
    const urlInput = page.getByLabel(/website url/i);
    await expect(urlInput).toBeVisible();

    // Enter a URL
    await urlInput.fill('https://example.com');

    // Wait for QR code to generate
    await page.waitForTimeout(500); // Debounce delay

    // Check that preview is visible
    await expect(page.getByAltText(/qr code preview/i)).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'test-screenshots/home-url-qr.png', fullPage: true });
  });

  test('should switch between QR types', async ({ page }) => {
    // Click on WiFi type button
    await page.getByRole('button', { name: 'WiFi Network' }).click();

    // Check WiFi form is visible
    await expect(page.getByLabel(/network name/i)).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'test-screenshots/home-wifi-form.png', fullPage: true });

    // Switch to vCard
    await page.getByRole('button', { name: 'Contact Card (vCard)' }).click();

    // Check vCard form is visible
    await expect(page.getByLabel(/first name/i)).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'test-screenshots/home-vcard-form.png', fullPage: true });
  });

  test('should generate WiFi QR code', async ({ page }) => {
    // Select WiFi type
    await page.getByRole('button', { name: 'WiFi Network' }).click();

    // Fill in WiFi details
    await page.getByLabel(/network name/i).fill('TestNetwork');
    await page.getByLabel(/password/i).fill('securepassword123');

    // Wait for QR code to generate
    await page.waitForTimeout(500);

    // Take screenshot
    await page.screenshot({ path: 'test-screenshots/home-wifi-qr.png', fullPage: true });
  });

  test('should generate vCard QR code', async ({ page }) => {
    // Select vCard type
    await page.getByRole('button', { name: 'Contact Card (vCard)' }).click();

    // Fill in first name (required field)
    await page.getByLabel(/first name/i).fill('John');

    // Wait for QR code to generate
    await page.waitForTimeout(500);

    // Take screenshot
    await page.screenshot({ path: 'test-screenshots/home-vcard-qr.png', fullPage: true });
  });

  test('should customize QR code colors', async ({ page }) => {
    // Enter a URL first
    await page.getByLabel(/website url/i).fill('https://example.com');
    await page.waitForTimeout(500);

    // Find and interact with color customization
    // This depends on the implementation of QRCustomizer
    // Take screenshot of customization area
    await page.screenshot({ path: 'test-screenshots/home-customization.png', fullPage: true });
  });

  test('should show export options when QR is generated', async ({ page }) => {
    // Enter a URL
    await page.getByLabel(/website url/i).fill('https://example.com');
    await page.waitForTimeout(500);

    // Check download button is enabled
    const downloadButton = page.getByRole('button', { name: /download/i });
    await expect(downloadButton).toBeEnabled();

    // Check other action buttons are enabled
    await expect(page.getByRole('button', { name: /copy/i })).toBeEnabled();
    await expect(page.getByRole('button', { name: /share/i })).toBeEnabled();
    await expect(page.getByRole('button', { name: /print/i })).toBeEnabled();
    await expect(page.getByRole('button', { name: /save/i })).toBeEnabled();

    // Take screenshot
    await page.screenshot({ path: 'test-screenshots/home-export-options.png', fullPage: true });
  });

  test('should show download menu with format options', async ({ page }) => {
    // Enter a URL
    await page.getByLabel(/website url/i).fill('https://example.com');
    await page.waitForTimeout(500);

    // Click download button
    await page.getByRole('button', { name: /download/i }).click();

    // Wait for dropdown menu to appear
    await page.waitForTimeout(300);

    // Take screenshot
    await page.screenshot({ path: 'test-screenshots/home-download-menu.png', fullPage: true });
  });
});

test.describe('Navigation', () => {
  test('should navigate to Scanner page', async ({ page }) => {
    await page.goto('/');
    await page.goto('/scan');
    await expect(page).toHaveURL('/scan');

    await page.screenshot({ path: 'test-screenshots/scanner-page.png', fullPage: true });
  });

  test('should navigate to Batch page', async ({ page }) => {
    await page.goto('/');
    await page.goto('/batch');
    await expect(page).toHaveURL('/batch');

    await page.screenshot({ path: 'test-screenshots/batch-page.png', fullPage: true });
  });

  test('should navigate to Templates page', async ({ page }) => {
    await page.goto('/');
    await page.goto('/templates');
    await expect(page).toHaveURL('/templates');

    await page.screenshot({ path: 'test-screenshots/templates-page.png', fullPage: true });
  });
});

test.describe('Theme Toggle', () => {
  test('should toggle between light and dark theme', async ({ page }) => {
    await page.goto('/');

    // Find theme toggle button
    const themeToggle = page.getByRole('button', { name: /(theme|dark|light)/i });

    // Take screenshot of light mode
    await page.screenshot({ path: 'test-screenshots/theme-light.png', fullPage: true });

    // Toggle theme
    await themeToggle.click();
    await page.waitForTimeout(300); // Wait for theme transition

    // Take screenshot of dark mode
    await page.screenshot({ path: 'test-screenshots/theme-dark.png', fullPage: true });
  });
});

test.describe('Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/');

    // Check main elements are visible
    await expect(page.getByRole('heading', { name: /qr code generator/i })).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'test-screenshots/mobile-home.png', fullPage: true });
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad
    await page.goto('/');

    // Check main elements are visible
    await expect(page.getByRole('heading', { name: /qr code generator/i })).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'test-screenshots/tablet-home.png', fullPage: true });
  });
});
