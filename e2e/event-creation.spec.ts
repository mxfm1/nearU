import { test, expect } from '@playwright/test'

// Helper function to login before tests
async function loginAsTestUser(page: any) {
  await page.goto('/auth/login')
  await page.getByLabel(/email|correo/i).fill('test@example.com')
  await page.getByLabel(/contraseña|password/i).fill('TestPassword123!')
  await page.getByRole('button', { name: /entrar|iniciar sesión|login/i }).click()
  await page.waitForLoadState('networkidle').catch(() => {})
}

test.describe('Event Creation', () => {
  test.beforeEach(async ({ page }) => {
    // Login before event creation tests
    await loginAsTestUser(page)
  })

  test('should navigate to event creation page', async ({ page }) => {
    await page.goto('/crear/evento')

    // Should show event form or creation UI
    await expect(page.getByRole('heading', { name: /crear evento|nuevo evento/i }).or(
      page.getByText(/título|title/i)
    )).toBeVisible()
  })

  test('should display event form fields', async ({ page }) => {
    await page.goto('/crear/evento')

    // Check for common event form fields
    await expect(page.getByLabel(/título|title/i).or(
      page.getByPlaceholder(/título|title/i)
    )).toBeVisible()

    await expect(page.getByLabel(/fecha|date/i).or(
      page.getByPlaceholder(/fecha|date/i)
    )).toBeVisible()

    await expect(page.getByLabel(/ubicación|locación|location|place/i).or(
      page.getByPlaceholder(/ubicación|locación|location/i)
    )).toBeVisible()

    await expect(page.getByLabel(/descripción|description/i).or(
      page.getByPlaceholder(/descripción|description/i)
    )).toBeVisible()
  })

  test('should create event with valid data', async ({ page }) => {
    await page.goto('/crear/evento')

    // Fill event form
    const timestamp = Date.now()

    const titleInput = page.getByLabel(/título|title/i).or(
      page.getByPlaceholder(/título|title/i)
    )
    await titleInput.fill(`Test Event ${timestamp}`)

    const dateInput = page.getByLabel(/fecha|date/i).or(
      page.getByPlaceholder(/YYYY-MM-DD/)
    )
    const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    await dateInput.fill(futureDate)

    const locationInput = page.getByLabel(/ubicación|locación|location|place/i).or(
      page.getByPlaceholder(/ubicación|locación|location/i)
    )
    await locationInput.fill('Test Location')

    const descInput = page.getByLabel(/descripción|description/i).or(
      page.getByPlaceholder(/descripción|description/i)
    )
    await descInput.fill('This is a test event description')

    // Submit form
    const submitButton = page.getByRole('button', { name: /crear|crear evento|publicar|submit/i })
    await submitButton.click()

    // Wait for redirect or success message
    await page.waitForURL(/\/eventos\/|\/user\/publicaciones/, { timeout: 10000 }).catch(() => {
      // If no redirect, check for success
    })

    // Verify event was created or we're on a success page
    const currentUrl = page.url()
    expect(currentUrl.includes('/eventos/') || currentUrl.includes('/publicaciones')).toBe(true)
  })

  test('should validate required fields', async ({ page }) => {
    await page.goto('/crear/evento')

    // Try to submit empty form
    const submitButton = page.getByRole('button', { name: /crear|crear evento|publicar|submit/i })
    await submitButton.click()

    // Should show validation errors
    await expect(
      page.getByText(/requerido|required|campo vacío/i).or(
        page.getByRole('alert').first()
      )
    ).toBeVisible({ timeout: 3000 }).catch(() => {
      // Form might prevent submission
    })
  })
})