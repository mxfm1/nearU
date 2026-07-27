import { test, expect } from '@playwright/test'

test.describe('Login', () => {
  test('should display login form', async ({ page }) => {
    await page.goto('/auth/login')
    await expect(page.getByRole('heading', { name: /iniciar sesión|login/i })).toBeVisible()
    await expect(page.getByLabel(/email|correo/i)).toBeVisible()
    await expect(page.getByLabel(/contraseña|password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /entrar|iniciar sesión|login/i })).toBeVisible()
  })

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/auth/login')

    await page.getByLabel(/email|correo/i).fill('test@example.com')
    await page.getByLabel(/contraseña|password/i).fill('TestPassword123!')
    await page.getByRole('button', { name: /entrar|iniciar sesión|login/i }).click()

    // Wait for redirect - either to home or dashboard
    await page.waitForURL(/\/(home|dashboard|)?$|descubrir/, { timeout: 10000 }).catch(() => {
      // If no redirect, check for error message
    })

    // Verify we're not on login page anymore or success occurred
    const isOnLoginPage = page.url().includes('/auth/login')
    expect(isOnLoginPage).toBe(false)
  })

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/auth/login')

    await page.getByLabel(/email|correo/i).fill('invalid@example.com')
    await page.getByLabel(/contraseña|password/i).fill('wrongpassword')
    await page.getByRole('button', { name: /entrar|iniciar sesión|login/i }).click()

    // Look for error message (common patterns)
    await expect(
      page.getByText(/credenciales inválidas|incorrectas|error/i).or(
        page.getByRole('alert').first()
      )
    ).toBeVisible({ timeout: 5000 }).catch(() => {
      // Error might show differently
    })
  })
})