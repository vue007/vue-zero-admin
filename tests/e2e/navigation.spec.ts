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
    await expect(menu.getByText('用户管理', { exact: true })).toBeVisible()
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

  test('App 管理目录进入会员管理页面', async ({ page }) => {
    const api = createMockApiState()
    await installMockApi(page, api)
    await useAuthenticatedSession(page)
    await page.goto('/app/member')

    const menu = page.locator('#layout-aside-menu')
    await expect(menu.getByText('App管理', { exact: true })).toBeVisible()
    await expect(menu.getByText('会员管理', { exact: true })).toBeVisible()
    await expect(menu.getByText('合作客户管理', { exact: true })).toBeVisible()
    await expect(page.locator('.page-breadcrumb')).toContainText('App管理')
    await expect(page.locator('.page-breadcrumb')).toContainText('会员管理')
    await expect(page.getByText('app-user', { exact: true })).toBeVisible()
    expect(api.pageErrors).toEqual([])
    expect(api.unhandled).toEqual([])
  })

  test('App 管理目录进入合作客户管理页面', async ({ page }) => {
    const api = createMockApiState()
    await installMockApi(page, api)
    await useAuthenticatedSession(page)
    await page.goto('/app/partner')

    const menu = page.locator('#layout-aside-menu')
    await expect(menu.getByText('App管理', { exact: true })).toBeVisible()
    await expect(menu.getByText('合作客户管理', { exact: true })).toBeVisible()
    await expect(page.locator('.page-breadcrumb')).toContainText('合作客户管理')
    await expect(page.getByText('示例合作商户', { exact: true })).toBeVisible()
    expect(api.pageErrors).toEqual([])
    expect(api.unhandled).toEqual([])
  })

  test('租户管理目录进入 App 接入管理页面', async ({ page }) => {
    const api = createMockApiState()
    await installMockApi(page, api)
    await useAuthenticatedSession(page)
    await page.goto('/tenant/appAccess')

    const menu = page.locator('#layout-aside-menu')
    await expect(menu.getByText('租户管理', { exact: true })).toBeVisible()
    await expect(menu.getByText('App接入管理', { exact: true })).toBeVisible()
    await expect(page.locator('.page-breadcrumb')).toContainText('租户管理')
    await expect(page.locator('.page-breadcrumb')).toContainText('App接入管理')
    await expect(page.getByText('示例平台应用', { exact: true })).toBeVisible()
    await expect(page.getByText('XXX有限责任公司', { exact: true })).toBeVisible()
    expect(api.calls.some((call) => call.method === 'GET' && call.path === '/system/tenant-app/list')).toBe(true)
    expect(api.pageErrors).toEqual([])
    expect(api.unhandled).toEqual([])
  })

  test('App 管理目录进入租户应用接入页面', async ({ page }) => {
    const api = createMockApiState()
    await installMockApi(page, api)
    await useAuthenticatedSession(page)
    await page.goto('/app/access')

    const menu = page.locator('#layout-aside-menu')
    await expect(menu.getByText('App管理', { exact: true })).toBeVisible()
    await expect(menu.getByText('应用接入', { exact: true })).toBeVisible()
    await expect(page.locator('.page-breadcrumb')).toContainText('App管理')
    await expect(page.locator('.page-breadcrumb')).toContainText('应用接入')
    await expect(page.getByText('租户自助应用', { exact: true })).toBeVisible()
    expect(api.calls.some((call) => call.method === 'GET' && call.path === '/app/application/list')).toBe(true)
    expect(api.pageErrors).toEqual([])
    expect(api.unhandled).toEqual([])
  })
})
