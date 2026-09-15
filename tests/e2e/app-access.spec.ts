import { expect, test } from '@playwright/test'
import { createMockApiState, findApiCall, installMockApi, useAuthenticatedSession } from './support/mock-api'

test.describe('应用接入凭证', () => {
  test('超级管理员按企业名称搜索租户并为其创建应用', async ({ page }) => {
    const api = createMockApiState()
    await installMockApi(page, api)
    await useAuthenticatedSession(page)
    await page.goto('/tenant/appAccess')

    await page.getByRole('button', { name: '新增' }).click()
    const editDialog = page.getByRole('dialog', { name: '新增应用接入' })
    const tenantSelect = editDialog.getByRole('combobox', { name: /租户编号/ })
    await tenantSelect.fill('XXX')
    await page.getByRole('option', { name: '000001 · XXX有限责任公司' }).click()
    await editDialog.getByPlaceholder('请输入应用名称').fill('平台接入应用')
    await editDialog.getByRole('combobox', { name: /授权范围/ }).press('ArrowDown')
    await page.getByRole('option', { name: '会员管理' }).click()
    await editDialog.getByRole('button', { name: '确定' }).click()

    expect(api.calls.some((call) =>
      call.method === 'GET' && call.path === '/system/tenant-app/tenant-options' && call.query.keyword === 'XXX',
    )).toBe(true)
    expect(findApiCall(api, 'POST', '/system/tenant-app')?.body).toMatchObject({
      tenantId: '000001',
      appName: '平台接入应用',
      scopes: ['app:member'],
    })
    expect(api.pageErrors).toEqual([])
    expect(api.unhandled).toEqual([])
  })

  test('租户创建应用后只在确认保存前展示一次 Secret Key', async ({ page }) => {
    const api = createMockApiState()
    await installMockApi(page, api)
    await useAuthenticatedSession(page)
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto('/app/access')

    await page.getByRole('button', { name: '新增' }).click()
    const editDialog = page.getByRole('dialog', { name: '新增应用接入' })
    await expect(editDialog).toContainText('新增应用接入')
    await expect(page.locator('body > .el-overlay').filter({ has: editDialog })).toBeVisible()

    const asideBox = await page.locator('.layout-aside').boundingBox()
    expect(asideBox).not.toBeNull()
    const overlayCoversAside = await page.evaluate(
      ({ x, y }) => document.elementFromPoint(x, y)?.closest('.el-overlay') !== null,
      {
        x: asideBox!.x + asideBox!.width / 2,
        y: asideBox!.y + asideBox!.height / 2,
      },
    )
    expect(overlayCoversAside).toBe(true)

    await editDialog.getByPlaceholder('请输入应用名称').fill('E2E 接入应用')
    await editDialog.getByRole('combobox', { name: /授权范围/ }).press('ArrowDown')
    await page.getByRole('option', { name: '会员管理' }).click()
    await editDialog.getByRole('button', { name: '确定' }).click()
    await expect(editDialog).toBeHidden()

    const createBody = findApiCall(api, 'POST', '/app/application')?.body
    expect(createBody).toMatchObject({
      appName: 'E2E 接入应用',
      scopes: ['app:member'],
    })
    expect(createBody).not.toHaveProperty('appType')
    expect(createBody).not.toHaveProperty('tenantId')
    expect(api.calls.some((call) => call.path === '/system/tenant-app/tenant-options')).toBe(false)

    const credentialDialog = page.getByRole('dialog', { name: '请立即保存应用凭证' })
    await expect(credentialDialog).toContainText('请立即保存应用凭证')
    await expect(credentialDialog.getByText('app_new_example', { exact: true })).toBeVisible()
    await expect(credentialDialog.getByTestId('one-time-app-secret')).toHaveText('secret_shown_only_once')

    const closeButton = credentialDialog.getByRole('button', { name: '已保存，关闭窗口' })
    await expect(closeButton).toBeDisabled()
    await credentialDialog.getByRole('button', { name: '一键复制 App ID 和 Secret Key' }).click()
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toBe('App ID: app_new_example\nSecret Key: secret_shown_only_once')
    await expect(closeButton).toBeDisabled()
    await credentialDialog.getByText('我已将凭证保存到安全位置', { exact: true }).click()
    await expect(closeButton).toBeEnabled()
    await closeButton.click()

    await expect(credentialDialog).toBeHidden()
    await expect(page.getByTestId('one-time-app-secret')).toHaveCount(0)
    expect(api.pageErrors).toEqual([])
    expect(api.unhandled).toEqual([])
  })
})
