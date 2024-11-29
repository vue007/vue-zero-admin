import { fetch, type ApiPromisePage } from './_fetch'
import type { UserRow, UserSearchForm } from './user.type'

export function userList(params: UserSearchForm): ApiPromisePage<UserRow> {
  return fetch.get('/user/list', { params })
}
