import { expect, test, type Locator } from '@playwright/test'
import { createMockApiState, findApiCall, installMockApi, useAuthenticatedSession } from './support/mock-api'

test.describe('参数配置 CRUD', () => {
  test('完成查询、新增、编辑、行内保存、删除和刷新缓存', async ({ page }) => {
    const api = createMockApiState()
    await installMockApi(page, api)
    await useAuthenticatedSession(page)
    await page.goto('/system/config')
    expect(api.pageErrors).toEqual([])

    await expect(page.getByRole('cell', { name: '用户初始密码', exact: true })).toBeVisible()
    expect(findApiCall(api, 'GET', '/system/config/list')?.query).toMatchObject({ pageNo: '1', pageSize: '10' })

    const search = page.getByPlaceholder('参数名称')
    await search.fill('首页')
    await expect(page.getByRole('cell', { name: '首页提示语', exact: true })).toBeVisible()
    await expect(page.getByRole('cell', { name: '用户初始密码', exact: true })).toHaveCount(0)
    await search.clear()
    await expect(page.getByRole('cell', { name: '用户初始密码', exact: true })).toBeVisible()

    await page.getByRole('button', { name: '新增' }).click()
    const createDialog = page.getByRole('dialog')
    await expect(createDialog).toContainText('添加参数')
    await createDialog.getByPlaceholder('请输入参数名称').fill('E2E参数')
    await createDialog.getByPlaceholder('请输入参数键名').fill('e2e.feature.enabled')
    await createDialog.getByPlaceholder('请输入参数键值').fill('true')
    await createDialog.getByPlaceholder('请输入备注').fill('由核心流程测试创建')
    await confirmDialog(createDialog)

    await expect(page.getByRole('cell', { name: 'E2E参数', exact: true })).toBeVisible()
    expect(findApiCall(api, 'POST', '/system/config')?.body).toMatchObject({
      configName: 'E2E参数',
      configKey: 'e2e.feature.enabled',
      configValue: 'true',
    })

    let row = page.getByRole('row').filter({ hasText: 'E2E参数' })
    await row.getByRole('button', { name: '编辑' }).click()
    const editDialog = page.getByRole('dialog')
    await expect(editDialog).toContainText('编辑参数')
    await editDialog.getByPlaceholder('请输入参数名称').fill('E2E参数-已编辑')
    await confirmDialog(editDialog)

    await expect(page.getByRole('cell', { name: 'E2E参数-已编辑', exact: true })).toBeVisible()
    expect(findApiCall(api, 'PUT', '/system/config')?.body).toMatchObject({ configName: 'E2E参数-已编辑' })

    row = page.getByRole('row').filter({ hasText: 'E2E参数-已编辑' })
    const valueInput = row.getByPlaceholder('请输入参数键值')
    await valueInput.fill('false')
    await valueInput.press('Tab')
    await expect
      .poll(() => findApiCall(api, 'PUT', '/system/config/updateByKey')?.body)
      .toMatchObject({
        configKey: 'e2e.feature.enabled',
        configValue: 'false',
      })

    await row.getByRole('button', { name: '删除' }).click()
    await page.getByRole('tooltip').getByRole('button', { name: '确定' }).click()
    await expect(page.getByRole('cell', { name: 'E2E参数-已编辑', exact: true })).toHaveCount(0)
    expect(findApiCall(api, 'DELETE', '/system/config/103')).toBeDefined()

    await page.getByRole('button', { name: '刷新缓存' }).click()
    await expect.poll(() => findApiCall(api, 'DELETE', '/system/config/refreshCache')).toBeDefined()
    expect(api.unhandled).toEqual([])
  })
})

const confirmDialog = async (dialog: Locator) => {
  await dialog.getByRole('button', { name: '确定' }).click()
  await expect(dialog).toBeHidden()
}
