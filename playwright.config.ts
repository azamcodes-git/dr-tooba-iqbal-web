import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT ?? 3000);
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "list",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry"
  },
  projects: [
    {
      name: "Mobile Chrome (Android)",
      use: {
        ...devices["Pixel 7"]
      }
    },
    {
      name: "Desktop Chromium",
      use: {
        ...devices["Desktop Chrome"]
      }
    }
  ],
  webServer: {
    command: "npm run dev",
    url: `${BASE_URL}/en`,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000
  }
});
