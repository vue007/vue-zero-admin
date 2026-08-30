import { expect, test } from '@playwright/test'
import { createMockApiState, findApiCall, installMockApi } from './support/mock-api'

test.describe('认证核心流程', () => {
  test('校验必填字段，不发送无效登录请求', async ({ page }) => {
    const api = createMockApiState()
    await installMockApi(page, api)
    await page.goto('/login')
    expect(api.pageErrors).toEqual([])

    await page.getByPlaceholder('请输入用户名').clear()
    await page.getByPlaceholder('请输入密码').clear()
    await page.getByRole('button', { name: '立即登录' }).click()

    await expect(page.getByText('请输入您的账号')).toBeVisible()
    await expect(page.getByText('请输入您的密码')).toBeVisible()
    await expect(page.getByText('请输入验证码')).toBeVisible()
    expect(findApiCall(api, 'POST', '/auth/login')).toBeUndefined()
  })

  test('提交完整认证契约、保存令牌并进入控制台', async ({ page }) => {
    const api = createMockApiState()
    await installMockApi(page, api)
    await page.goto('/login')
    expect(api.pageErrors).toEqual([])

    await page.getByPlaceholder('请输入用户名').fill('admin')
    await page.getByPlaceholder('请输入密码').fill('admin123')
    await page.getByPlaceholder('请输入验证码').fill('1234')
    await page.getByRole('button', { name: '立即登录' }).click()

    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 5_000 })
    await expect(page.getByText('Dashboard', { exact: true }).last()).toBeVisible()
    await expect.poll(() => page.evaluate(() => localStorage.getItem('Admin-Token'))).toBe('e2e-access-token')

    const login = findApiCall(api, 'POST', '/auth/login')
    expect(login?.body).toMatchObject({
      tenantId: '000000',
      username: 'admin',
      password: 'admin123',
      code: '1234',
      clientId: 'e5cd7e4891bf95d1d19206ce24a7b32e',
      grantType: 'password',
      uuid: 'e2e-captcha-uuid',
    })
    expect(api.unhandled).toEqual([])
  })
})
