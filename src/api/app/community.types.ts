import type { PageQuery } from '../_fetch'

export type CommunityAssetKind = 'dpi' | 'macro' | 'lighting' | 'profile'
export type CommunityDeviceType = 'mouse' | 'keyboard' | 'gamepad' | 'headset' | 'speaker' | 'any'
export type CommunityAssetStatus = 'draft' | 'pending' | 'published' | 'rejected' | 'hidden'

export interface CommunityAssetVO {
  assetId: number | string
  tenantId: string
  applicationId: number | string
  ownerMemberId: number | string
  ownerName?: string
  ownerAvatar?: string
  title: string
  summary?: string
  coverUrl?: string
  kind: CommunityAssetKind
  deviceType: CommunityDeviceType
  visibility: 'public' | 'private'
  status: CommunityAssetStatus
  currentReleaseId: number | string
  featured: '0' | '1'
  favoriteCount: number
  downloadCount: number
  favorited?: boolean
  publishedAt?: string
  rejectReason?: string
  createTime?: string
  updateTime?: string
  versionNo?: number
  schemaVersion?: number
  sourcePlatformCode?: string
  sourceProductCode?: string
  sourceCapabilityVersion?: string
  payload?: unknown
  payloadHash?: string
  payloadSize?: number
  changelog?: string
}

export interface CommunityAssetQuery extends PageQuery {
  tenantId?: string
  applicationId?: number | string
  keyword?: string
  kind?: string
  deviceType?: string
  status?: string
  featured?: string
}

export interface CommunityReviewForm {
  assetId: number | string
  action: 'approve' | 'reject'
  reason?: string
}
