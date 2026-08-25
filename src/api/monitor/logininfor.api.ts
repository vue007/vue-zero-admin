import { tansParams } from '@/utils/tans-params'
import { fetch, type ApiPromise, type ApiPromisePage } from '../_fetch'
import type { LoginInfoQuery, LoginInfoVO } from './logininfor.types'

const paramsSerializer = { serialize: tansParams }

/** 查询登录日志列表 */
export function listLoginInfo(query: LoginInfoQuery): ApiPromisePage<LoginInfoVO> {
  return fetch({
    url: '/monitor/logininfor/list',
    method: 'get',
    params: query,
    paramsSerializer,
  })
}

/** 导出登录日志 */
export function exportLoginInfo(query: LoginInfoQuery): Promise<Blob> {
  return fetch({
    url: '/monitor/logininfor/export',
    method: 'post',
    params: query,
    paramsSerializer,
    responseType: 'blob',
  }) as unknown as Promise<Blob>
}

/** 删除登录日志 */
export function delLoginInfo(infoIds: Array<string | number> | string | number): ApiPromise<void> {
  return fetch({
    url: '/monitor/logininfor/' + infoIds,
    method: 'delete',
  })
}

/** 清空登录日志 */
export function cleanLoginInfo(): ApiPromise<void> {
  return fetch({
    url: '/monitor/logininfor/clean',
    method: 'delete',
  })
}

/** 解锁账号 */
export function unlockUser(userName: string): ApiPromise<void> {
  return fetch({
    url: '/monitor/logininfor/unlock/' + encodeURIComponent(userName),
    method: 'get',
  })
}
