import { tansParams } from '@/utils/tans-params'
import { fetch, type ApiPromise, type ApiPromisePage } from '../_fetch'
import type { OperLogQuery, OperLogVO } from './operlog.types'

const paramsSerializer = { serialize: tansParams }

/** 查询操作日志列表 */
export function listOperLog(query: OperLogQuery): ApiPromisePage<OperLogVO> {
  return fetch({
    url: '/monitor/operlog/list',
    method: 'get',
    params: query,
    paramsSerializer,
  })
}

/** 导出操作日志 */
export function exportOperLog(query: OperLogQuery): Promise<Blob> {
  return fetch({
    url: '/monitor/operlog/export',
    method: 'post',
    params: query,
    paramsSerializer,
    responseType: 'blob',
  }) as unknown as Promise<Blob>
}

/** 删除操作日志 */
export function delOperLog(operIds: Array<string | number> | string | number): ApiPromise<void> {
  return fetch({
    url: '/monitor/operlog/' + operIds,
    method: 'delete',
  })
}

/** 清空操作日志 */
export function cleanOperLog(): ApiPromise<void> {
  return fetch({
    url: '/monitor/operlog/clean',
    method: 'delete',
  })
}
