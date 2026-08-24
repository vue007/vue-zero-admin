import { fetch, type ApiPromise, type ApiPromisePage } from '../_fetch'
import type { ConfigForm, ConfigQuery, ConfigVO } from './config.types'

/** 查询参数列表 */
export function listConfig(query: ConfigQuery): ApiPromisePage<ConfigVO> {
  return fetch({
    url: '/system/config/list',
    method: 'get',
    params: query,
  })
}

/** 查询参数详情 */
export function getConfig({ configId }: Pick<ConfigVO, 'configId'>): ApiPromise<ConfigVO> {
  return fetch({
    url: '/system/config/' + configId,
    method: 'get',
  })
}

/** 新增参数 */
export function addConfig(data: ConfigForm): ApiPromise<void> {
  return fetch({
    url: '/system/config',
    method: 'post',
    data,
  })
}

/** 修改参数 */
export function updateConfig(data: ConfigForm): ApiPromise<void> {
  return fetch({
    url: '/system/config',
    method: 'put',
    data,
  })
}

/** 根据键名修改参数值 */
export function updateConfigByKey(data: Pick<ConfigVO, 'configKey' | 'configValue'>): ApiPromise<void> {
  return fetch({
    url: '/system/config/updateByKey',
    method: 'put',
    data,
  })
}

/** 删除参数 */
export function delConfig(configIds: Array<string | number> | string | number): ApiPromise<void> {
  return fetch({
    url: '/system/config/' + configIds,
    method: 'delete',
  })
}

/** 刷新参数缓存 */
export function refreshCache(): ApiPromise<void> {
  return fetch({
    url: '/system/config/refreshCache',
    method: 'delete',
  })
}
