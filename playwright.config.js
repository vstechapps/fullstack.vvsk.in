const { devices } = require('@playwright/test');

/** @type {import('@playwright/test').PlaywrightTestConfig} */
module.exports = {
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  use: {
    // Use the running static server
    baseURL: process.env.BASE_URL || 'http://localhost:4321',
    // Try to use the installed Chrome/Edge instead of the bundled playwright binary
    channel: 'chrome',
    headless: true,
    ignoreHTTPSErrors: true
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
};
