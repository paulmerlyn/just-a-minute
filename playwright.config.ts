import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for Project 60 E2E Tests
 * 
 * Tests the critical user flows:
 * - Access code authentication
 * - Player management
 * - Topic generation and selection
 * - Timer controls
 * - Score updates
 * - Keyboard navigation
 */
export default defineConfig({
  testDir: './tests/e2e',
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* Number of workers on CI only */
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter to use */
  reporter: 'html',
  
  /* Shared settings for all the projects below */
  use: {
    /* Base URL to use in actions like `await page.goto('/')` */
    baseURL: 'http://localhost:3000',
    
    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',
    
    /* Increase timeout for slower operations */
    navigationTimeout: 60000,
  },

  /* Global timeout for tests */
  timeout: 60000,

  /* Configure projects for major browsers */
  /* Full test suite on Chromium, critical auth test on Firefox/WebKit for compatibility */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      grep: /@critical|Authentication/, // Run all tests tagged @critical + all auth tests
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      grep: /@critical|Authentication/, // Run all tests tagged @critical + all auth tests
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev:test',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
