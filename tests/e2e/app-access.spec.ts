import { expect, test } from '@playwright/test'
import { createMockApiState, findApiCall, installMockApi, useAuthenticatedSession } from './support/mock-api'

test.describe('应用接入凭证', () => {
  test('租户创建应用后只在确认保存前展示一次 Secret Key', async ({ page }) => {
    const api = createMockApiState()
    await installMockApi(page, api)
    await useAuthenticatedSession(page)
    await page.goto('/app/access')

    await page.getByRole('button', { name: '新增' }).click()
    const editDialog = page.getByRole('dialog', { name: '新增应用接入' })
    await expect(editDialog).toContainText('新增应用接入')
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

    const credentialDialog = page.getByRole('dialog', { name: '请立即保存应用凭证' })
    await expect(credentialDialog).toContainText('请立即保存应用凭证')
    await expect(credentialDialog.getByText('app_new_example', { exact: true })).toBeVisible()
    await expect(credentialDialog.getByTestId('one-time-app-secret')).toHaveText('secret_shown_only_once')

    const closeButton = credentialDialog.getByRole('button', { name: '已保存，关闭窗口' })
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
