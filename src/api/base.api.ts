import type { AppRouteRecordRaw } from '@/router'
import { fetch, type ApiPromise } from './_fetch'
import type { LoginForm, LoginVo, SocialAccount, SocialLoginForm } from './base.type'
import type { UserInfo } from './user.type'
import type { TenantInfo } from './sys/tenant.types'

export function login(data: LoginForm): ApiPromise<LoginVo> {
  return fetch.post('/auth/login', JSON.stringify(data))
}

export function socialLogin(data: SocialLoginForm): ApiPromise<LoginVo> {
  return fetch.post('/auth/login', JSON.stringify(data))
}

export function getSocialProviders(): ApiPromise<string[]> {
  return fetch({
    url: '/auth/social/providers',
    method: 'get',
    headers: { isToken: false },
  })
}

export function getSocialAuthorizeUrl(source: string, tenantId: string, domain: string): ApiPromise<string> {
  return fetch({
    url: `/auth/binding/${encodeURIComponent(source)}`,
    method: 'get',
    params: { tenantId, domain },
    headers: { isToken: false },
  })
}

export function bindSocialAccount(data: Pick<SocialLoginForm, 'source' | 'socialCode' | 'socialState'>): ApiPromise<void> {
  return fetch.post('/auth/social/callback', data)
}

export function getSocialAccounts(): ApiPromise<SocialAccount[]> {
  return fetch.get('/system/social/list')
}

export function unbindSocialAccount(socialId: string | number): ApiPromise<void> {
  return fetch.delete(`/auth/unlock/${socialId}`)
}

export function logout(): ApiPromise<void> {
  return fetch({
    url: '/auth/logout',
    method: 'post',
  })
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
