import { fetch, type ApiPromise } from './_fetch'
import type { LoginForm, LoginInfo } from './base.type'

export function login(data: LoginForm): ApiPromise<LoginInfo> {
  return fetch.post('/auth/login', { data })
}
