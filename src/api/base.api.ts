import type { AppRouteRecordRaw } from '@/router'
import { fetch, type ApiPromise } from './_fetch'
import type { LoginForm, LoginVo } from './base.type'
import type { UserInfo } from './user.type'
import type { TenantInfo } from './sys/tenant.types'

export function login(data: LoginForm): ApiPromise<LoginVo> {
  return fetch.post('/auth/login', JSON.stringify(data))
}

export function getCaptcha(): ApiPromise<{ img: string; uuid: string }> {
  return fetch({
    url: '/auth/captcha',
    method: 'get',
  })
}

// 获取用户详细信息
export function getInfo(): ApiPromise<UserInfo> {
  return fetch({
    url: '/system/user/getInfo',
    method: 'get',
  })
}

// 获取租户列表
export function getTenantList(isToken: boolean): ApiPromise<TenantInfo> {
  return fetch({
    url: '/auth/tenant/list',
    headers: {
      isToken: isToken,
    },
    method: 'get',
  })
}

// 获取路由
export function getRouters(): ApiPromise<AppRouteRecordRaw[]> {
  return fetch({
    url: '/system/menu/getRouters',
    method: 'get',
  })
}
