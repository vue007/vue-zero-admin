import { test, expect } from '@playwright/test'

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    // 导航到登录页面
    await page.goto('/login')
  })

  const selector = {
    username: 'input[prop="username"]',
    password: 'input[prop="password"]',
    login_button: 'input[prop="password"]',
  }

  test('should display login form', async ({ page }) => {
    // 检查登录表单是否存在
    await expect(page.locator('.login-form-box')).toBeVisible()
    await expect(page.locator(selector.username)).toBeVisible()
    await expect(page.locator(selector.password)).toBeVisible()
    await expect(page.locator(selector.login_button)).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    // 输入无效的用户名和密码
    await page.fill(selector.username, 'invalidUser')
    await page.fill(selector.password, 'wrongPassword')
    await page.click(selector.login_button)

    // 检查错误提示是否显示
    await expect(page.locator('.error-message')).toHaveText('Invalid username or password')
  })

  test('should login successfully with valid credentials', async ({ page }) => {
    // 输入有效的用户名和密码
    await page.fill(selector.username, 'admin')
    await page.fill(selector.password, 'admin123')
    await page.click(selector.login_button)

    // 检查是否跳转到主页
    await expect(page).toHaveURL('/dashboard')
  })
})
