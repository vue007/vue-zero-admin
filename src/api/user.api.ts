import { fetch, type ApiPromisePage } from './_fetch'
import type { UserForm, UserRow, UserSearchForm } from './user.type'

export function list(params: UserSearchForm): ApiPromisePage<UserRow> {
  return fetch.get('/user/list', { params })
}

export function create(data: UserForm): ApiPromisePage<UserRow> {
  return fetch.post('/user/create', { data })
}

export function update(data: UserForm): ApiPromisePage<UserRow> {
  return fetch.post('/user/update', { ...data })
}
