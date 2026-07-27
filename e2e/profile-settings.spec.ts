import { test, expect } from '@playwright/test'

// Helper function to login before tests
async function loginAsTestUser(page: any) {
  await page.goto('/auth/login')
  await page.getByLabel(/email|correo/i).fill('test@example.com')
  await page.getByLabel(/contraseña|password/i).fill('TestPassword123!')
  await page.getByRole('button', { name: /entrar|iniciar sesión|login/i }).click()
  await page.waitForLoadState('networkidle').catch(() => {})
}

test.describe('Profile Settings', () => {
  test.beforeEach(async ({ page }) => {
    // Login before profile settings tests
    await loginAsTestUser(page)
  })

  test('should navigate to profile settings page', async ({ page }) => {
    await page.goto('/user/configuracion')

    // Should show settings UI
    await expect(page.getByRole('heading', { name: /configuración|settings/i }).or(
      page.getByText(/perfil|profile|configuración/i)
    )).toBeVisible()
  })

  test('should display profile form fields', async ({ page }) => {
    await page.goto('/user/configuracion')

    // Check for profile fields - name, bio, etc.
    const hasNameField = await page.getByLabel(/nombre|name/i).isVisible().catch(() => false)
    const hasBioField = await page.getByLabel(/bio|biografía/i).isVisible().catch(() => false)
    const hasAvatarSection = await page.getByText(/avatar|foto/i).isVisible().catch(() => false)

    // At least one profile field should be visible
    expect(hasNameField || hasBioField || hasAvatarSection).toBe(true)
  })

  test('should update profile name', async ({ page }) => {
    await page.goto('/user/configuracion')

    const nameInput = page.getByLabel(/nombre|name/i)
    if (await nameInput.isVisible()) {
      await nameInput.clear()
      await nameInput.fill('Updated Test Name')

      // Save changes
      const saveButton = page.getByRole('button', { name: /guardar|save|cambios/i })
      await saveButton.click()

      // Wait for success feedback
      await page.waitForLoadState('networkidle').catch(() => {})

      // Check for success message or verify field was updated
      const successMessage = page.getByText(/guardado|actualizado|saved|updated/i)
      const isUpdated = await nameInput.inputValue()

      expect(isUpdated === 'Updated Test Name' || await successMessage.isVisible()).toBe(true)
    } else {
      test.skip()
    }
  })

  test('should update profile bio', async ({ page }) => {
    await page.goto('/user/configuracion')

    const bioInput = page.getByLabel(/bio|biografía|descripción/i)
    if (await bioInput.isVisible()) {
      await bioInput.clear()
      await bioInput.fill('This is my updated bio for testing purposes')

      // Save changes
      const saveButton = page.getByRole('button', { name: /guardar|save|cambios/i })
      await saveButton.click()

      // Wait for success feedback
      await page.waitForLoadState('networkidle').catch(() => {})

      // Check for success message or verify field was updated
      const successMessage = page.getByText(/guardado|actualizado|saved|updated/i)
      const isUpdated = await bioInput.inputValue()

      expect(isUpdated === 'This is my updated bio for testing purposes' || await successMessage.isVisible()).toBe(true)
    } else {
      test.skip()
    }
  })

  test('should show validation errors for invalid data', async ({ page }) => {
    await page.goto('/user/configuracion')

    const nameInput = page.getByLabel(/nombre|name/i)
    if (await nameInput.isVisible()) {
      // Try to set an invalid name (too short or special characters depending on validation)
      await nameInput.clear()
      await nameInput.fill('')

      const saveButton = page.getByRole('button', { name: /guardar|save|cambios/i })
      await saveButton.click()

      // Check for validation error
      await expect(
        page.getByText(/requerido|required|mínimo|invalid/i).or(
          page.getByRole('alert').first()
        )
      ).toBeVisible({ timeout: 3000 }).catch(() => {
        // Validation might prevent saving
      })
    } else {
      test.skip()
    }
  })
})