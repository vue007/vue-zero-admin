import { fetch, type ApiPromise, type ApiPromisePage } from '../_fetch'
import type { TenantPkgForm, TenantPkgQuery, TenantPkgVO } from './tenant-package.types'

// 查询租户套餐列表
export function listTenantPackage(query?: TenantPkgQuery): ApiPromisePage<TenantPkgVO[]> {
  return fetch({
    url: '/system/tenant/package/list',
    method: 'get',
    params: query,
  })
}

// 查询租户套餐下拉选列表
export function selectTenantPackage(): ApiPromise<TenantPkgVO[]> {
  return fetch({
    url: '/system/tenant/package/selectList',
    method: 'get',
  })
}

// 查询租户套餐详细
export function getTenantPackage(packageId: string | number): ApiPromise<TenantPkgVO> {
  return fetch({
    url: '/system/tenant/package/' + packageId,
    method: 'get',
  })
}

// 新增租户套餐
export function addTenantPackage(data: TenantPkgForm) {
  return fetch({
    url: '/system/tenant/package',
    method: 'post',
    data: data,
  })
}

// 修改租户套餐
export function updateTenantPackage(data: TenantPkgForm) {
  return fetch({
    url: '/system/tenant/package',
    method: 'put',
    data: data,
  })
}

// 租户套餐状态修改
export function changePackageStatus(packageId: number | string, status: string) {
  const data = {
    packageId,
    status,
  }
  return fetch({
    url: '/system/tenant/package/changeStatus',
    method: 'put',
    data: data,
  })
}

// 删除租户套餐
export function delTenantPackage(packageId: string | number | Array<string | number>) {
  return fetch({
    url: '/system/tenant/package/' + packageId,
    method: 'delete',
  })
}
