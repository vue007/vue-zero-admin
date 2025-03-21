import { fetch, type ApiPromise, type ApiPromisePage } from './_fetch'
import type { UserForm, UserVO, UserSearchForm } from './user.type'

export function list(params: UserSearchForm): ApiPromisePage<UserVO> {
  return fetch.get('/user/list', { params })
}

export function create(data: UserForm): ApiPromise<UserVO> {
  return fetch.post('/user/create', { data })
}

export function update(data: UserForm): ApiPromise<UserVO> {
  return fetch.post('/user/update', { ...data })
}
