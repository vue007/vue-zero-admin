import { fetch, type ApiPromise, type ApiPromisePage } from '../_fetch'
import type { CommunityAssetQuery, CommunityAssetVO, CommunityReviewForm } from './community.types'

export function listCommunity(query: CommunityAssetQuery): ApiPromisePage<CommunityAssetVO> {
  return fetch({ url: '/app/community/list', method: 'get', params: query })
}

export function getCommunity(assetId: CommunityAssetVO['assetId']): ApiPromise<CommunityAssetVO> {
  return fetch({ url: `/app/community/${assetId}`, method: 'get' })
}

export function reviewCommunity({ assetId, ...data }: CommunityReviewForm): ApiPromise<void> {
  return fetch({ url: `/app/community/${assetId}/review`, method: 'put', data })
}

export function featureCommunity(
  assetId: CommunityAssetVO['assetId'],
  featured: boolean,
): ApiPromise<void> {
  return fetch({ url: `/app/community/${assetId}/feature`, method: 'put', data: { featured } })
}

export function hideCommunity(assetId: CommunityAssetVO['assetId']): ApiPromise<void> {
  return fetch({ url: `/app/community/${assetId}/hide`, method: 'put' })
}
