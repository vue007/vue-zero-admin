import { fetch, type ApiPromise } from './_fetch'
import type { LoginForm, UserInfo } from './base.type'

export function login(data: LoginForm): ApiPromise<UserInfo> {
  return fetch.post('/auth/login', { data })
}
