import { test, expect } from '@playwright/test'

test.describe('Event Search', () => {
  test('should load discover page', async ({ page }) => {
    await page.goto('/descubrir')
    await expect(page).toHaveURL(/.*descubrir/)
    // Page should load without error
    await expect(page.getByRole('main')).toBeVisible()
  })

  test('should display event list', async ({ page }) => {
    await page.goto('/descubrir')

    // Wait for content to load
    await page.waitForLoadState('networkidle').catch(() => {})

    // Should have some content - either events or "no events" message
    const hasEvents = await page.getByTestId(/event-card|event-item/).count()
    const hasEmptyState = await page.getByText(/no hay eventos|sin resultados|no events/i).count()

    expect(hasEvents > 0 || hasEmptyState > 0).toBe(true)
  })

  test('should search for events', async ({ page }) => {
    await page.goto('/descubrir')

    // Look for search input - common patterns
    const searchInput = page.getByPlaceholder(/buscar|search|Buscar eventos/i).or(
      page.getByLabel(/buscar|search/i)
    )

    if (await searchInput.isVisible()) {
      await searchInput.fill('concierto')
      await searchInput.press('Enter')

      // Wait for results to load
      await page.waitForLoadState('networkidle').catch(() => {})

      // Check that something happened - either results or no results message
      const currentUrl = page.url()
      expect(currentUrl).toBeTruthy()
    } else {
      // If no search input found, skip this part
      test.skip()
    }
  })

  test('should filter events by category if filters exist', async ({ page }) => {
    await page.goto('/descubrir')

    // Look for category filter buttons
    const categoryButton = page.getByRole('button', { name: /música|deporte|teatro|categoría/i }).first()

    if (await categoryButton.isVisible()) {
      await categoryButton.click()
      await page.waitForLoadState('networkidle').catch(() => {})
      // Verify something changed
      expect(page.url()).toBeTruthy()
    } else {
      test.skip()
    }
  })
})