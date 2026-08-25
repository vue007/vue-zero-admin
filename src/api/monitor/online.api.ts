import { fetch, type ApiPromise, type ApiPromisePage } from '../_fetch'
import type { OnlineQuery, OnlineVO } from './online.types'

/** 查询在线用户 */
export function listOnline(query: OnlineQuery): ApiPromisePage<OnlineVO> {
  return fetch({ url: '/monitor/online/list', method: 'get', params: query })
}

/** 强退单个会话 */
export function forceLogout(data: Pick<OnlineVO, 'tokenId'>): ApiPromise<void> {
  return fetch({ url: '/monitor/online/force', method: 'delete', data })
}

/** 批量强退会话 */
export function batchLogout(data: { tokenIds: string[] }): ApiPromise<void> {
  return fetch({ url: '/monitor/online/batch', method: 'delete', data })
}
