import type { Page, Request } from '@playwright/test'

export type ApiCall = {
  method: string
  path: string
  query: Record<string, string>
  body: unknown
  authorization?: string
}

export type MockConfig = {
  configId: number
  configName: string
  configKey: string
  configValue: string
  configType: 'Y' | 'N'
  remark: string
  createTime: string
}

export type MockApiState = {
  calls: ApiCall[]
  unhandled: string[]
  pageErrors: string[]
  consoleErrors: string[]
  requestFailures: string[]
  configs: MockConfig[]
  nextConfigId: number
}

const ok = (data: unknown = null) => ({ code: 200, msg: '操作成功', data })

const normalDisableDict = [
  { dictLabel: '正常', dictValue: '0', listClass: 'success', cssClass: '' },
  { dictLabel: '停用', dictValue: '1', listClass: 'danger', cssClass: '' },
]

const yesNoDict = [
  { dictLabel: '是', dictValue: 'Y', listClass: 'success', cssClass: '' },
  { dictLabel: '否', dictValue: 'N', listClass: 'info', cssClass: '' },
]

export const authorisedMenus = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    component: 'dashboard/index',
    meta: { title: 'Dashboard', icon: 'el-odometer' },
  },
  {
    name: 'System',
    path: '/system',
    component: 'Layout',
    meta: { title: '系统管理', icon: 'el-setting' },
    children: [
      {
        name: 'User',
        path: 'user',
        component: 'system/user/index',
        meta: { title: '用户管理', icon: 'el-user' },
      },
      {
        name: 'Config',
        path: 'config',
        component: 'system/config/index',
        meta: { title: '参数设置', icon: 'el-setting' },
      },
      {
        name: 'Profile',
        path: 'user/profile',
        component: 'system/user/profile/index',
        hidden: true,
        meta: { title: '个人中心' },
      },
    ],
  },
  {
    name: 'Tenant',
    path: '/tenant',
    component: 'Layout',
    meta: { title: '租户管理', icon: 'ze-tenant' },
    children: [
      {
        name: 'TenantAppAccess',
        path: 'appAccess',
        component: 'tenant/appAccess/index',
        meta: { title: 'App接入管理', icon: 'el-key' },
      },
    ],
  },
  {
    name: 'App',
    path: '/app',
    component: 'Layout',
    meta: { title: 'App管理', icon: 'el-cellphone' },
    children: [
      {
        name: 'AppMember',
        path: 'member',
        component: 'app/member/index',
        meta: { title: '会员管理', icon: 'ze-users' },
      },
      {
        name: 'AppPartner',
        path: 'partner',
        component: 'app/partner/index',
        meta: { title: '合作客户管理', icon: 'el-office-building' },
      },
      {
        name: 'AppAccess',
        path: 'access',
        component: 'app/access/index',
        meta: { title: '应用接入', icon: 'el-key' },
      },
    ],
  },
]

export const createMockApiState = (): MockApiState => ({
  calls: [],
  unhandled: [],
  pageErrors: [],
  consoleErrors: [],
  requestFailures: [],
  nextConfigId: 103,
  configs: [
    {
      configId: 101,
      configName: '用户初始密码',
      configKey: 'sys.user.initPassword',
      configValue: 'admin123',
      configType: 'Y',
      remark: '系统参数',
      createTime: '2026-08-30 10:00:00',
    },
    {
      configId: 102,
      configName: '首页提示语',
      configKey: 'sys.index.notice',
      configValue: '欢迎使用',
      configType: 'N',
      remark: '普通参数',
      createTime: '2026-08-30 10:10:00',
    },
  ],
})

export const installMockApi = async (page: Page, state: MockApiState) => {
  page.on('pageerror', (error) => state.pageErrors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') state.consoleErrors.push(message.text())
  })
  page.on('requestfailed', (request) =>
    state.requestFailures.push(
      `${request.method()} ${request.url()}: ${request.failure()?.errorText || 'unknown error'}`,
    ),
  )
  // Do not intercept Vite source modules such as `/src/api/_fetch.ts`.
  await page.route(/^https?:\/\/[^/]+\/api\/.*$/, async (route) => {
    const request = route.request()
    const url = new URL(request.url())
    const path = url.pathname.replace(/^\/api/, '')
    const call: ApiCall = {
      method: request.method(),
      path,
      query: Object.fromEntries(url.searchParams),
      body: readRequestBody(request),
      authorization: request.headers().authorization,
    }
    state.calls.push(call)

    const fulfill = (data: unknown = null) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(ok(data)) })

    if (call.method === 'GET' && path === '/auth/tenant/list') {
      return fulfill({ tenantEnabled: true, voList: [{ tenantId: '000000', companyName: '默认租户' }] })
    }
    if (call.method === 'GET' && path === '/auth/captcha') {
      return fulfill({ img: 'R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=', uuid: 'e2e-captcha-uuid' })
    }
    if (call.method === 'POST' && path === '/auth/login') {
      return fulfill({ access_token: 'e2e-access-token', expire_in: 3600 })
    }
    if (call.method === 'POST' && path === '/auth/logout') return fulfill()
    if (call.method === 'GET' && path === '/system/user/getInfo') {
      return fulfill({
        user: { userId: 1, userName: 'admin', nickName: '管理员', avatar: '' },
        roles: ['superadmin'],
        permissions: ['*:*:*'],
      })
    }
    if (call.method === 'GET' && path === '/system/menu/getRouters') return fulfill(authorisedMenus)

    if (call.method === 'GET' && path.startsWith('/system/dict/data/type/')) {
      const type = path.split('/').at(-1)
      return fulfill(type === 'sys_yes_no' ? yesNoDict : normalDisableDict)
    }

    if (call.method === 'GET' && path === '/system/user/deptTree') {
      return fulfill([
        {
          id: 100,
          label: '华南理工大学',
          children: [{ id: 101, label: '研发部门', children: [] }],
        },
      ])
    }
    if (call.method === 'GET' && path === '/system/user/list') {
      return fulfill({
        rows: [
          {
            userId: 1,
            userName: 'admin',
            nickName: '管理员',
            deptName: '研发部门',
            phonenumber: '13800138000',
            status: '0',
            createTime: '2026-08-30 10:00:00',
          },
        ],
        total: 1,
      })
    }

    if (call.method === 'GET' && path === '/app/member/list') {
      return fulfill({
        rows: [
          {
            memberId: 1,
            tenantId: '000000',
            username: 'app-user',
            nickname: '测试会员',
            mobile: '13800138000',
            status: '0',
            registerSource: 'password',
            createTime: '2026-09-10 10:00:00',
          },
        ],
        total: 1,
      })
    }

    if (call.method === 'GET' && path === '/app/partner/list') {
      return fulfill({
        rows: [
          {
            partnerId: 1,
            tenantId: '000000',
            partnerCode: 'PARTNER001',
            partnerName: '示例合作商户',
            creditCode: '91440101MA00000001',
            contactName: '张经理',
            contactPhone: '13700000001',
            status: '0',
            createTime: '2026-09-12 10:00:00',
          },
        ],
        total: 1,
      })
    }

    if (call.method === 'GET' && path === '/system/tenant-app/list') {
      return fulfill({
        rows: [
          {
            id: 1,
            tenantId: '000001',
            tenantName: 'XXX有限责任公司',
            appName: '示例平台应用',
            appId: 'app_platform_example',
            scopes: ['app:member'],
            status: '0',
            secretRotatedTime: '2026-09-12 10:00:00',
            createTime: '2026-09-12 10:00:00',
          },
        ],
        total: 1,
      })
    }

    if (call.method === 'GET' && path === '/system/tenant-app/tenant-options') {
      const keyword = (call.query.keyword || '').toLowerCase()
      return fulfill(
        [
          { tenantId: '000000', tenantName: '默认租户' },
          { tenantId: '000001', tenantName: 'XXX有限责任公司' },
        ].filter((item) => `${item.tenantId} ${item.tenantName}`.toLowerCase().includes(keyword)),
      )
    }
    if (call.method === 'POST' && path === '/system/tenant-app') {
      return fulfill({
        id: 4,
        tenantId: '000001',
        appId: 'app_platform_new',
        appSecret: 'platform_secret_shown_only_once',
      })
    }

    if (
      call.method === 'GET' &&
      (path === '/system/tenant-app/scope-options' || path === '/app/application/scope-options')
    ) {
      return fulfill([
        { value: 'app:member', label: '会员管理' },
        { value: 'app:partner', label: '合作客户管理' },
      ])
    }

    if (call.method === 'GET' && path === '/app/application/list') {
      return fulfill({
        rows: [
          {
            id: 2,
            tenantId: '000001',
            appName: '租户自助应用',
            appId: 'app_tenant_example',
            scopes: ['app:member'],
            status: '0',
            secretRotatedTime: '2026-09-12 10:00:00',
            createTime: '2026-09-12 10:00:00',
          },
        ],
        total: 1,
      })
    }
    if (call.method === 'POST' && path === '/app/application') {
      return fulfill({
        id: 3,
        tenantId: '000001',
        appId: 'app_new_example',
        appSecret: 'secret_shown_only_once',
      })
    }

    if (call.method === 'GET' && path === '/system/config/list') {
      const name = call.query.configName?.toLowerCase() || ''
      const key = call.query.configKey?.toLowerCase() || ''
      const type = call.query.configType || ''
      const rows = state.configs.filter(
        (item) =>
          item.configName.toLowerCase().includes(name) &&
          item.configKey.toLowerCase().includes(key) &&
          (!type || item.configType === type),
      )
      return fulfill({ rows, total: rows.length })
    }
    if (call.method === 'GET' && /^\/system\/config\/\d+$/.test(path)) {
      const id = Number(path.split('/').at(-1))
      return fulfill(state.configs.find((item) => item.configId === id))
    }
    if (call.method === 'POST' && path === '/system/config') {
      const input = call.body as Omit<MockConfig, 'configId' | 'createTime'>
      state.configs.push({ ...input, configId: state.nextConfigId++, createTime: '2026-08-30 11:00:00' })
      return fulfill()
    }
    if (call.method === 'PUT' && path === '/system/config') {
      const input = call.body as MockConfig
      const index = state.configs.findIndex((item) => item.configId === Number(input.configId))
      if (index >= 0) state.configs[index] = { ...state.configs[index], ...input }
      return fulfill()
    }
    if (call.method === 'PUT' && path === '/system/config/updateByKey') {
      const input = call.body as Pick<MockConfig, 'configKey' | 'configValue'>
      const item = state.configs.find((config) => config.configKey === input.configKey)
      if (item) item.configValue = input.configValue
      return fulfill()
    }
    if (call.method === 'DELETE' && path === '/system/config/refreshCache') return fulfill()
    if (call.method === 'DELETE' && /^\/system\/config\/[\d,]+$/.test(path)) {
      const ids = new Set(path.split('/').at(-1)?.split(',').map(Number))
      state.configs = state.configs.filter((item) => !ids.has(item.configId))
      return fulfill()
    }

    state.unhandled.push(`${call.method} ${path}`)
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ code: 404, msg: `E2E API 未实现: ${call.method} ${path}`, data: null }),
    })
  })
}

export const useAuthenticatedSession = async (page: Page, settings: Record<string, string> = {}) => {
  await page.addInitScript(
    ({ token, values }) => {
      localStorage.setItem('Admin-Token', token)
      localStorage.setItem('setting.local', 'zh-CN')
      Object.entries(values).forEach(([key, value]) => localStorage.setItem(key, value))
    },
    { token: 'e2e-access-token', values: settings },
  )
}

export const findApiCall = (state: MockApiState, method: string, path: string) =>
  state.calls.findLast((call) => call.method === method && call.path === path)

const readRequestBody = (request: Request): unknown => {
  const body = request.postData()
  if (!body) return undefined
  try {
    return JSON.parse(body)
  } catch {
    return body
  }
}
