import { fetch, type ApiPromise } from '../_fetch'
import type { DeptForm, DeptQuery, DeptVO } from './dept.type'

export function deptList(params: DeptQuery): ApiPromise<DeptVO[]> {
  return fetch({
    url: '/system/dept/list',
    method: 'get',
    params,
  })
}

export function deptListExcludeChild({ deptId }: { deptId: string | number }): ApiPromise<DeptVO[]> {
  return fetch({
    url: '/system/dept/list/exclude/' + deptId,
    method: 'get',
  })
}

// 查询部门详细
export function getDept({ deptId }: { deptId: string | number }): ApiPromise<DeptVO> {
  return fetch({
    url: '/system/dept/' + deptId,
    method: 'get',
  })
}

// 查询部门下拉树结构
export function treeselect(): ApiPromise<DeptVO[]> {
  return fetch({
    url: '/system/dept/treeselect',
    method: 'get',
  })
}

// 新增部门
export function addDept(data: DeptForm): ApiPromise<void> {
  return fetch({
    url: '/system/dept',
    method: 'post',
    data: data,
  })
}

// 修改部门
export function updateDept(data: DeptForm): ApiPromise<void> {
  return fetch({
    url: '/system/dept',
    method: 'put',
    data: data,
  })
}

// 删除部门
export function delDept({ deptId }: { deptId: number | string }) {
  return fetch({
    url: '/system/dept/' + deptId,
    method: 'delete',
  })
}
