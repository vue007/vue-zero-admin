import { fetch, type ApiPromise } from './_fetch'

export function login(data: LoginForm): ApiPromise<UserInfo> {
  return fetch.post('/auth/login', { data })
}
