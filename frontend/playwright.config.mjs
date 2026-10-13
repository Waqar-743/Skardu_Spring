import { defineConfig } from '@playwright/test';

const prefix = process.env.NEXT_PUBLIC_BASE_PATH || '/Skardu_Spring';
const externalURL = process.env.MOTION_BASE_URL;
export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  expect: { timeout: 10000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  forbidOnly: Boolean(process.env.CI),
  reporter: 'list',
  use: {
    baseURL: externalURL || `http://127.0.0.1:3006${prefix}/`,
    browserName: 'chromium',
    reducedMotion: 'no-preference',
    // Recording every scrubbed animation frame is expensive on lower-memory laptops.
    // CI keeps a trace for diagnosis; local runs rely on the failure screenshot.
    trace: process.env.CI ? 'retain-on-failure' : 'off',
    screenshot: 'only-on-failure',
    ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? {
      launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH },
    } : {}),
  },
  ...(!externalURL ? { webServer: {
    command: 'node scripts/serve-pages-test.mjs',
    url: `http://127.0.0.1:3006${prefix}/`,
    reuseExistingServer: false,
    timeout: 10000,
  } } : {}),
});
