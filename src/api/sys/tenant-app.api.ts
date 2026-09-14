import { fetch, type ApiPromise, type ApiPromisePage } from '../_fetch'
import type {
  ApplicationCredential,
  ApplicationForm,
  ApplicationQuery,
  ApplicationStatusForm,
  ApplicationVO,
} from '../app/application.types'

const baseUrl = '/system/tenant-app'

export function listTenantApp(query: ApplicationQuery): ApiPromisePage<ApplicationVO> {
  return fetch({ url: `${baseUrl}/list`, method: 'get', params: query })
}

export function getTenantApp(id: ApplicationVO['id']): ApiPromise<ApplicationVO> {
  return fetch({ url: `${baseUrl}/${id}`, method: 'get' })
}

export function addTenantApp(data: ApplicationForm): ApiPromise<ApplicationCredential> {
  return fetch({ url: baseUrl, method: 'post', data })
}

export function updateTenantApp(data: ApplicationForm): ApiPromise<void> {
  return fetch({ url: baseUrl, method: 'put', data })
}

export function changeTenantAppStatus(data: ApplicationStatusForm): ApiPromise<void> {
  return fetch({ url: `${baseUrl}/changeStatus`, method: 'put', data })
}

export function resetTenantAppSecret(id: ApplicationVO['id']): ApiPromise<ApplicationCredential> {
  return fetch({ url: `${baseUrl}/${id}/reset-secret`, method: 'post' })
}

export function delTenantApp(ids: Array<string | number> | string | number): ApiPromise<void> {
  return fetch({ url: `${baseUrl}/${ids}`, method: 'delete' })
}
