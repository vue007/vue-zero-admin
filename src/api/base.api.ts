import type { AppRouteRecordRaw } from '@/router'
import { fetch, type ApiPromise } from './_fetch'
import type { LoginForm, LoginVo } from './base.type'

export function login(data: LoginForm): ApiPromise<LoginVo> {
  return fetch.post('/auth/login', JSON.stringify(data))
}

export function getCaptcha(): ApiPromise<{img:string, uuid:string}> {
  return fetch({
    url: '/auth/captcha',
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
