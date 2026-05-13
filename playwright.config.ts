import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';

// On the maintainer's ubuntu26 host Playwright can't install its bundled
// chromium, so we point it at the system Chrome. On CI / supported hosts we
// leave executablePath undefined and let Playwright use its own browser.
const candidatePaths = [
  process.env.CHROME_EXECUTABLE,
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/snap/bin/chromium',
].filter(Boolean) as string[];

const resolvedChrome = candidatePaths.find((p) => existsSync(p));

const launchOptions = resolvedChrome ? { executablePath: resolvedChrome } : {};

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], launchOptions },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'], launchOptions },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
  outputDir: 'test-results',
});
