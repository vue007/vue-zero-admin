import { fetch, type ApiPromise, type ApiPromisePage } from '../_fetch'
import type { ClientForm, ClientQuery, ClientVO } from './client.types'

export function listClient(query: ClientQuery): ApiPromisePage<ClientVO> {
  return fetch({ url: '/system/client/list', method: 'get', params: query })
}

export function getClient({ id }: Pick<ClientVO, 'id'>): ApiPromise<ClientVO> {
  return fetch({ url: '/system/client/' + id, method: 'get' })
}

export function addClient(data: ClientForm): ApiPromise<void> {
  return fetch({ url: '/system/client', method: 'post', data })
}

export function updateClient(data: ClientForm): ApiPromise<void> {
  return fetch({ url: '/system/client', method: 'put', data })
}

export function changeClientStatus(data: Pick<ClientVO, 'clientId' | 'status'>): ApiPromise<void> {
  return fetch({ url: '/system/client/changeStatus', method: 'put', data })
}

export function delClient(ids: Array<string | number> | string | number): ApiPromise<void> {
  return fetch({ url: '/system/client/' + ids, method: 'delete' })
}
