import { fetch, type ApiPromise } from '../_fetch'
import type { CacheGroupVO, CacheInfoVO } from './cache.types'

/** Redis 运行状态 */
export function getCacheInfo(): ApiPromise<CacheInfoVO> {
  return fetch({ url: '/monitor/cache', method: 'get' })
}

/** 可管理的业务缓存组 */
export function getCacheGroups(): ApiPromise<CacheGroupVO[]> {
  return fetch({ url: '/monitor/cache/groups', method: 'get' })
}

/** 缓存组键名 */
export function getCacheKeys({ cacheName }: { cacheName: string }): ApiPromise<string[]> {
  return fetch({ url: `/monitor/cache/groups/${encodeURIComponent(cacheName)}/keys`, method: 'get' })
}

/** 清空缓存组 */
export function clearCacheGroup({ cacheName }: { cacheName: string }): ApiPromise<void> {
  return fetch({ url: `/monitor/cache/groups/${encodeURIComponent(cacheName)}`, method: 'delete' })
}

/** 删除缓存键 */
export function clearCacheKey({ cacheName, cacheKey }: { cacheName: string; cacheKey: string }): ApiPromise<void> {
  return fetch({
    url: `/monitor/cache/groups/${encodeURIComponent(cacheName)}/keys`,
    method: 'delete',
    params: { cacheKey },
  })
}
