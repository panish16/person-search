import { test, expect } from '@playwright/test'
import { goToSearchPage } from '../../utils/go-to-search'
import { mockApiCallsForPage } from '../../mocks/playwright-mock-helpers'

import { SearchAccess } from '../../../app/enums/search-access'

test.describe('App access - public', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiCallsForPage(page, SearchAccess.PUBLIC)
  })
  test('Search page has expected elements', async ({ page }) => {
    await goToSearchPage(page)
    expect(page.getByRole('heading', { name: 'Business and Person Search' })).toBeVisible()
    expect(page.getByTestId('account-name')).toHaveText('Playwright')
    expect(page.getByTestId('user-name')).toHaveText('-')
    expect(page.getByTestId('search-help-btn')).toHaveText('Help with Business and Person Search')
    // tabs should NOT be there
    expect(page.getByTestId('search-tabs')).toBeVisible()
    // search should be there (outside of the tabs)
    expect(page.getByTestId('search-container')).toBeVisible()
    expect(page.getByTestId('search-input')).toBeVisible()
    const radios = page.getByTestId('search-radios')
    expect(radios).toBeVisible()
    expect(radios.getByRole('radio', { name: 'Search Business' })).toBeVisible()
    expect(radios.getByRole('radio', { name: 'Search Business' })).not.toBeDisabled()
    expect(radios.getByRole('radio', { name: 'Search People' })).toBeVisible()
    expect(radios.getByRole('radio', { name: 'Search People' })).not.toBeDisabled()
    expect(radios.getByRole('radio', { name: 'Search Directors' })).not.toBeVisible()
  })
})
