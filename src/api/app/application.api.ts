import { fetch, type ApiPromise, type ApiPromisePage } from '../_fetch'
import type {
  ApplicationCredential,
  ApplicationClientOption,
  ApplicationForm,
  ApplicationQuery,
  ApplicationScopeOption,
  ApplicationStatusForm,
  ApplicationVO,
} from './application.types'

const baseUrl = '/app/application'

export function listApplication(query: ApplicationQuery): ApiPromisePage<ApplicationVO> {
  return fetch({ url: `${baseUrl}/list`, method: 'get', params: query })
}

export function getApplicationScopeOptions(): ApiPromise<ApplicationScopeOption[]> {
  return fetch({ url: `${baseUrl}/scope-options`, method: 'get' })
}

export function getApplicationClientOptions(): ApiPromise<ApplicationClientOption[]> {
  return fetch({ url: `${baseUrl}/client-options`, method: 'get' })
}

export function getApplication(id: ApplicationVO['id']): ApiPromise<ApplicationVO> {
  return fetch({ url: `${baseUrl}/${id}`, method: 'get' })
}

export function addApplication(data: ApplicationForm): ApiPromise<ApplicationCredential> {
  return fetch({ url: baseUrl, method: 'post', data })
}

export function updateApplication(data: ApplicationForm): ApiPromise<void> {
  return fetch({ url: baseUrl, method: 'put', data })
}

export function changeApplicationStatus(data: ApplicationStatusForm): ApiPromise<void> {
  return fetch({ url: `${baseUrl}/changeStatus`, method: 'put', data })
}

export function resetApplicationSecret(id: ApplicationVO['id']): ApiPromise<ApplicationCredential> {
  return fetch({ url: `${baseUrl}/${id}/reset-secret`, method: 'post' })
}

export function delApplication(ids: Array<string | number> | string | number): ApiPromise<void> {
  return fetch({ url: `${baseUrl}/${ids}`, method: 'delete' })
}
