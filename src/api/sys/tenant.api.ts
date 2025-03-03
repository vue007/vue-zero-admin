import { isArray } from 'es-toolkit/compat'
import { fetch, type ApiPromise, type ApiPromisePage } from '../_fetch'
import type { TenantForm, TenantQuery, TenantVO } from './tenant.types'

// 查询租户列表
export function listTenant(query: TenantQuery): ApiPromisePage<TenantVO> {
  return fetch({
    url: '/system/tenant/list',
    method: 'get',
    params: query,
  })
}

// 查询租户详细
export function getTenant(id: string | number): ApiPromise<TenantVO> {
  return fetch({
    url: '/system/tenant/' + id,
    method: 'get',
  })
}

// 新增租户
export function addTenant(data: TenantForm) : ApiPromise<TenantVO>{
  return fetch({
    url: '/system/tenant',
    method: 'post',
    headers: {
      isEncrypt: true,
      repeatSubmit: false,
    },
    data: data,
  })
}

// 修改租户
export function updateTenant(data: TenantForm) : ApiPromise<TenantVO>{
  return fetch({
    url: '/system/tenant',
    method: 'put',
    data: data,
  })
}

// 租户状态修改
export function changeTenantStatus({ id, tenantId, status }: TenantVO) {
  const data = {
    id,
    tenantId,
    status,
  }
  return fetch({
    url: '/system/tenant/changeStatus',
    method: 'put',
    data: data,
  })
}

// 删除租户
export function delTenant(ids: string): ApiPromise<void> {
  return fetch({
    url: '/system/tenant/' + ids,
    method: 'delete',
  })
}

// 动态切换租户
export function dynamicTenant(tenantId: string | number) {
  return fetch({
    url: '/system/tenant/dynamic/' + tenantId,
    method: 'get',
  })
}

// 清除动态租户
export function dynamicClear() {
  return fetch({
    url: '/system/tenant/dynamic/clear',
    method: 'get',
  })
}

// 同步租户套餐
export function syncTenantPackage(tenantId: string | number, packageId: string | number) {
  const data = {
    tenantId,
    packageId,
  }
  return fetch({
    url: '/system/tenant/syncTenantPackage',
    method: 'get',
    params: data,
  })
}

// 同步租户字典
export function syncTenantDict() {
  return fetch({
    url: '/system/tenant/syncTenantDict',
    method: 'get',
  })
}
