import { fetch, type ApiPromise, type ApiPromisePage } from '../_fetch'
import type {
  ApplicationCredential,
  ApplicationClientOption,
  ApplicationForm,
  ApplicationQuery,
  ApplicationScopeOption,
  ApplicationStatusForm,
  ApplicationVO,
} from '../app/application.types'

const baseUrl = '/system/tenant-app'

/** 超级管理员为 App 接入选择所属租户时使用的轻量搜索结果。 */
export interface TenantAppTenantOption {
  tenantId: string
  tenantName: string
}

export function listTenantApp(query: ApplicationQuery): ApiPromisePage<ApplicationVO> {
  return fetch({ url: `${baseUrl}/list`, method: 'get', params: query })
}

export function getTenantAppScopeOptions(): ApiPromise<ApplicationScopeOption[]> {
  return fetch({ url: `${baseUrl}/scope-options`, method: 'get' })
}

export function getTenantAppClientOptions(): ApiPromise<ApplicationClientOption[]> {
  return fetch({ url: `${baseUrl}/client-options`, method: 'get' })
}

export function searchTenantAppTenantOptions(keyword: string): ApiPromise<TenantAppTenantOption[]> {
  return fetch({ url: `${baseUrl}/tenant-options`, method: 'get', params: { keyword } })
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
