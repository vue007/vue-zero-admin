import { fetch, type ApiPromise, type ApiPromisePage } from '../_fetch'
import type { RoleDeptTree, RoleQuery, RoleVO } from './role.types'
import type { UserQuery, UserVO } from './user.type'

export const listRole = (query: RoleQuery): ApiPromisePage<RoleVO> => {
  return fetch({
    url: '/system/role/list',
    method: 'get',
    params: query,
  })
}

/**
 * 通过roleIds查询角色
 * @param roleIds
 */
export const optionSelect = (roleIds: (number | string)[]): ApiPromise<RoleVO[]> => {
  return fetch({
    url: '/system/role/optionselect?roleIds=' + roleIds.join(','),
    method: 'get',
  })
}

/**
 * 查询角色详细
 */
export const getRole = (roleId: string | number): ApiPromise<RoleVO> => {
  return fetch({
    url: '/system/role/' + roleId,
    method: 'get',
  })
}

/**
 * 新增角色
 */
export const addRole = (data: any): ApiPromise<void> => {
  return fetch({
    url: '/system/role',
    method: 'post',
    data: data,
  })
}

/**
 * 修改角色
 * @param data
 */
export const updateRole = (data: any): ApiPromise<void> => {
  return fetch({
    url: '/system/role',
    method: 'put',
    data: data,
  })
}

/**
 * 角色数据权限
 */
export const dataScope = (data: any): ApiPromise<void> => {
  return fetch({
    url: '/system/role/dataScope',
    method: 'put',
    data: data,
  })
}

/**
 * 角色状态修改
 */
export const changeRoleStatus = ({ roleId, status }: RoleVO): ApiPromise<void> => {
  return fetch({
    url: '/system/role/changeStatus',
    method: 'put',
    data: { roleId, status },
  })
}

/**
 * 删除角色
 */
export const delRole = (roleId: Array<string | number> | string | number): ApiPromise<void> => {
  return fetch({
    url: '/system/role/' + roleId,
    method: 'delete',
  })
}

/**
 * 查询角色已授权用户列表
 */
export const allocatedUserList = (query: UserQuery): ApiPromise<UserVO[]> => {
  return fetch({
    url: '/system/role/authUser/allocatedList',
    method: 'get',
    params: query,
  })
}

/**
 * 查询角色未授权用户列表
 */
export const unallocatedUserList = (query: UserQuery): ApiPromise<UserVO[]> => {
  return fetch({
    url: '/system/role/authUser/unallocatedList',
    method: 'get',
    params: query,
  })
}

/**
 * 取消用户授权角色
 */
export const authUserCancel = (data: any): ApiPromise<void> => {
  return fetch({
    url: '/system/role/authUser/cancel',
    method: 'put',
    data: data,
  })
}

/**
 * 批量取消用户授权角色
 */
export const authUserCancelAll = (data: any): ApiPromise<void> => {
  return fetch({
    url: '/system/role/authUser/cancelAll',
    method: 'put',
    params: data,
  })
}

/**
 * 授权用户选择
 */
export const authUserSelectAll = (data: any): ApiPromise<void> => {
  return fetch({
    url: '/system/role/authUser/selectAll',
    method: 'put',
    params: data,
  })
}
// 根据角色ID查询部门树结构
export const deptTreeSelect = (roleId: string | number): ApiPromise<RoleDeptTree> => {
  return fetch({
    url: '/system/role/deptTree/' + roleId,
    method: 'get',
  })
}

export default {
  optionSelect,
  listRole,
}
