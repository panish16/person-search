import { expect, type Page } from '@playwright/test'

/**
 * Navigate to the search page and wait until it is rendered and interactive.
 *
 * Uses an auto-retrying `expect(...).toBeVisible()` rather than
 * `page.waitForSelector(...)` because `waitForSelector` is bounded by
 * `use.actionTimeout` (10s) — too tight for first-load hydration on the
 * slower engines (notably WebKit) when CI workers are contended, which was
 * the source of the intermittent `search-container` timeouts.
 */
export async function goToSearchPage(page: Page, path = '/en-CA'): Promise<void> {
  await page.goto(path, { waitUntil: 'domcontentloaded' })
  await expect(page.getByTestId('search-container')).toBeVisible({ timeout: 30_000 })
}
