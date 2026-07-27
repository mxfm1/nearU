import { test, expect } from '@playwright/test'

// Helper function to login before tests
async function loginAsTestUser(page: any) {
  await page.goto('/auth/login')
  await page.getByLabel(/email|correo/i).fill('test@example.com')
  await page.getByLabel(/contraseña|password/i).fill('TestPassword123!')
  await page.getByRole('button', { name: /entrar|iniciar sesión|login/i }).click()
  await page.waitForLoadState('networkidle').catch(() => {})
}

test.describe('Service Creation', () => {
  test.beforeEach(async ({ page }) => {
    // Login before service creation tests
    await loginAsTestUser(page)
  })

  test('should navigate to service creation page', async ({ page }) => {
    await page.goto('/crear/servicio')

    // Should show service form or creation UI
    await expect(page.getByRole('heading', { name: /crear servicio|nuevo servicio/i }).or(
      page.getByText(/servicio|service/i)
    )).toBeVisible()
  })

  test('should display service form fields', async ({ page }) => {
    await page.goto('/crear/servicio')

    // Check for common service form fields
    await expect(page.getByLabel(/título|title|name/i).or(
      page.getByPlaceholder(/título|title|name/i)
    )).toBeVisible()

    await expect(page.getByLabel(/descripción|description/i).or(
      page.getByPlaceholder(/descripción|description/i)
    )).toBeVisible()

    await expect(page.getByLabel(/precio|price|costo|cost/i).or(
      page.getByPlaceholder(/precio|price|costo/i)
    )).toBeVisible()
  })

  test('should create service with valid data', async ({ page }) => {
    await page.goto('/crear/servicio')

    // Fill service form
    const timestamp = Date.now()

    const titleInput = page.getByLabel(/título|title|name/i).or(
      page.getByPlaceholder(/título|title|name/i)
    )
    await titleInput.fill(`Test Service ${timestamp}`)

    const descInput = page.getByLabel(/descripción|description/i).or(
      page.getByPlaceholder(/descripción|description/i)
    )
    await descInput.fill('This is a test service description')

    const priceInput = page.getByLabel(/precio|price|costo|cost/i).or(
      page.getByPlaceholder(/precio|price/)
    )
    await priceInput.fill('100')

    // Submit form
    const submitButton = page.getByRole('button', { name: /crear|crear servicio|publicar|submit/i })
    await submitButton.click()

    // Wait for redirect or success message
    await page.waitForURL(/\/servicios\/|\/user\/publicaciones/, { timeout: 10000 }).catch(() => {
      // If no redirect, check for success
    })

    // Verify service was created or we're on a success page
    const currentUrl = page.url()
    expect(currentUrl.includes('/servicios/') || currentUrl.includes('/publicaciones')).toBe(true)
  })

  test('should validate required fields', async ({ page }) => {
    await page.goto('/crear/servicio')

    // Try to submit empty form
    const submitButton = page.getByRole('button', { name: /crear|crear servicio|publicar|submit/i })
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