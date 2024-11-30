import { fetch, type ApiPromisePage } from './_fetch'
import type { UserForm, UserRow, UserSearchForm } from './user.type'

export function list(params: UserSearchForm): ApiPromisePage<UserRow> {
  return fetch.get('/user/list', { params })
}

export function add(params: UserForm): ApiPromisePage<UserRow> {
  return fetch.get('/user/add', { params })
}

export function update(params: UserForm): ApiPromisePage<UserRow> {
  return fetch.get('/user/update', { params })
}
