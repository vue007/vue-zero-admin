import { expect, test } from '@playwright/test'
import { createMockApiState, installMockApi, useAuthenticatedSession } from './support/mock-api'

test.describe('授权菜单与导航', () => {
  test('只渲染授权可见菜单，并同步激活状态与面包屑', async ({ page }) => {
    const api = createMockApiState()
    await installMockApi(page, api)
    await useAuthenticatedSession(page)
    await page.goto('/system/config')
    expect(api.pageErrors).toEqual([])

    const menu = page.locator('#layout-aside-menu')
    await expect(menu.getByText('系统管理', { exact: true })).toBeVisible()
    await expect(menu.locator('.el-sub-menu.is-active')).toHaveCount(1)
    await menu.getByRole('menuitem', { name: '系统管理' }).click()
    await expect(menu.getByText('参数设置', { exact: true })).toBeVisible()
    await expect(menu.getByText('个人中心', { exact: true })).toHaveCount(0)

    const activeItem = page.locator('#layout-aside-menu .el-menu-item.is-active')
    await expect(activeItem).toContainText('参数设置')
    await expect(page.locator('.page-breadcrumb')).toContainText('系统管理')
    await expect(page.locator('.page-breadcrumb')).toContainText('参数设置')

    await page.locator('.collapse-action').click()
    await expect(page.locator('.layout-aside')).toHaveClass(/is-collapse/)
    await expect(menu.locator('.el-sub-menu.is-active')).toHaveCount(1)
    expect(api.unhandled).toEqual([])
  })
})
