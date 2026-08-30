import { expect, test } from '@playwright/test'
import { createMockApiState, installMockApi, useAuthenticatedSession } from './support/mock-api'

test.describe('外观设置', () => {
  test('恢复持久化主题、深浅模式和组件尺寸', async ({ page }) => {
    const api = createMockApiState()
    await installMockApi(page, api)
    await useAuthenticatedSession(page, {
      'setting.scheme': 'dark',
      'setting.theme': 'default',
      'setting.size': 'small',
    })
    await page.goto('/dashboard')
    expect(api.pageErrors).toEqual([])

    await expect(page.locator('html')).toHaveAttribute('data-scheme', 'dark')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'default')
    await expect(page.locator('html')).toHaveAttribute('data-size', 'small')

    await page.locator('#header-right .action:has(use[href*="moon"])').click()
    await expect(page.locator('html')).toHaveAttribute('data-scheme', 'light')
    await expect.poll(() => page.evaluate(() => localStorage.getItem('setting.scheme'))).toBe('light')
    expect(api.unhandled).toEqual([])
  })

  test('跟随系统模式时响应系统主题变化', async ({ page }) => {
    const api = createMockApiState()
    await page.emulateMedia({ colorScheme: 'dark' })
    await installMockApi(page, api)
    await useAuthenticatedSession(page, { 'setting.scheme': 'auto', 'setting.theme': 'argon' })
    await page.goto('/dashboard')
    expect(api.pageErrors).toEqual([])

    await expect(page.locator('html')).toHaveAttribute('data-scheme', 'dark')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'argon')

    await page.emulateMedia({ colorScheme: 'light' })
    await expect(page.locator('html')).toHaveAttribute('data-scheme', 'light')
    expect(api.unhandled).toEqual([])
  })
})
