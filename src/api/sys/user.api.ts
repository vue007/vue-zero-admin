import { pick } from 'es-toolkit'
import { fetch, type ApiPromise, type ApiPromisePage } from '../_fetch'
import type { DeptVO } from './dept.type'
import type { RoleVO } from './role.types'
import type { UserForm, UserInfoVO, UserQuery, UserVO } from './user.type'

/**
 * 查询用户列表
 * @param query
 */
export function listUser(query: UserQuery): ApiPromisePage<UserVO> {
  return fetch({
    url: '/system/user/list',
    method: 'get',
    params: query,
  })
}

/**
 * 通过用户ids查询用户
 * @param userIds
 */
export function optionSelect(userIds: (number | string)[]): ApiPromise<UserVO[]> {
  return fetch({
    url: '/system/user/optionselect?userIds=' + userIds,
    method: 'get',
  })
}

/**
 * 获取用户详情
 * @param userId
 */
export function getUser({ userId }: { userId: string | number }): ApiPromise<UserInfoVO> {
  return fetch({
    url: '/system/user/' + userId,
    method: 'get',
  })
}

/**
 * 新增用户
 */
export function addUser(data: UserForm): ApiPromise<void> {
  return fetch({
    url: '/system/user',
    method: 'post',
    data: data,
  })
}

/**
 * 修改用户
 */
export function updateUser(data: UserForm): ApiPromise<void> {
  return fetch({
    url: '/system/user',
    method: 'put',
    data: data,
  })
}

/**
 * 删除用户
 * @param userId 用户ID
 */
export function delUser(userId: Array<string | number> | string | number): ApiPromise<void> {
  return fetch({
    url: '/system/user/' + userId,
    method: 'delete',
  })
}

/**
 * 用户密码重置
 * @param userId 用户ID
 * @param password 密码
 */
export function resetUserPwd(data: Pick<UserForm, 'userId' | 'password'>) {
  return fetch({
    url: '/system/user/resetPwd',
    method: 'put',
    headers: {
      isEncrypt: true,
      repeatSubmit: false,
    },
    data: pick(data, ['userId', 'password']),
  })
}

/**
 * 用户状态修改
 * @param userId 用户ID
 * @param status 用户状态
 */
export function changeUserStatus(data: Pick<UserForm, 'userId' | 'status'>): ApiPromise<void> {
  return fetch({
    url: '/system/user/changeStatus',
    method: 'put',
    data: pick(data, ['userId', 'status']),
  })
}

/**
 * 查询用户个人信息
 */
export function getUserProfile(): ApiPromise<UserInfoVO> {
  return fetch({
    url: '/system/user/profile',
    method: 'get',
  })
}

/**
 * 修改用户个人信息
 * @param data 用户信息
 */
export function updateUserProfile(data: UserForm) {
  return fetch({
    url: '/system/user/profile',
    method: 'put',
    data: data,
  })
}

/**
 * 用户密码重置
 * @param oldPassword 旧密码
 * @param newPassword 新密码
 */
export function updateUserPwd(oldPassword: string, newPassword: string) {
  const data = {
    oldPassword,
    newPassword,
  }
  return fetch({
    url: '/system/user/profile/updatePwd',
    method: 'put',
    headers: {
      isEncrypt: true,
      repeatSubmit: false,
    },
    data: data,
  })
}

/**
 * 用户头像上传
 * @param data 头像文件
 */
export function uploadAvatar(data: FormData) {
  return fetch({
    url: '/system/user/profile/avatar',
    method: 'post',
    data: data,
  })
}

/**
 * 查询授权角色
 * @param userId 用户ID
 */
export function getAuthRole(data: Pick<UserForm, 'userId'>): ApiPromise<{ user: UserVO; roles: RoleVO[] }> {
  return fetch({
    url: '/system/user/authRole/' + data.userId,
    method: 'get',
  })
}

/**
 * 保存授权角色
 * @param data 用户ID
 */
export function updateAuthRole(data: { userId: string; roleIds: string[] }): ApiPromise<void> {
  return fetch({
    url: '/system/user/authRole',
    method: 'put',
    params: { userId: data.userId, roleIds: data.roleIds.join(',') },
  })
}

/**
 * 查询当前部门的所有用户信息
 * @param deptId
 */
export function listUserByDeptId(deptId: string | number): ApiPromise<UserVO[]> {
  return fetch({
    url: '/system/user/list/dept/' + deptId,
    method: 'get',
  })
}

/**
 * 查询部门下拉树结构
 */
export function deptTreeSelect(): ApiPromise<DeptVO[]> {
  return fetch({
    url: '/system/user/deptTree',
    method: 'get',
  })
}
