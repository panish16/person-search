import { createResolver } from 'nuxt/kit'
import { defineConfig, devices } from '@playwright/test'
import type { ConfigOptions } from '@nuxt/test-utils/playwright'

const { resolve } = createResolver(import.meta.url)

const deviceNames = [
  'Desktop Chrome',
  ...(process.env.CI
    ? [
      'Desktop Firefox',
      'Desktop Edge',
      'Desktop Safari'
    ]
    : [])
]

export default defineConfig<ConfigOptions>({
  globalSetup: './tests/e2e/setup',
  testDir: './tests/e2e',
  testMatch: '*.spec.ts',
  workers: process.env.CI ? 2 : undefined,
  // retry in CI: the search page can take >10s to hydrate on the slower engines
  // (WebKit especially) when workers are contended — a retry clears those blips.
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], [process.env.CI ? 'blob' : 'html']],
  // give web-first assertions (toBeVisible/toHaveText/...) their own retry budget
  expect: { timeout: 10000 },
  use: {
    nuxt: {
      rootDir: resolve('./'),
      runner: 'vitest',
      host: process.env.NUXT_PUBLIC_BASE_URL
    },
    actionTimeout: 15000,
    navigationTimeout: 30000,
    baseURL: process.env.NUXT_PUBLIC_BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    // do not open browser
    headless: true
  },
  projects: deviceNames.map(name => ({ name, use: devices[name] })),
  webServer: {
    command: 'pnpm build:test',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
    env: {
      playwright: 'true'
    }
  }
})
