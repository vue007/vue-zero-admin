import type { PageQuery } from '../_fetch'

export interface OnlineQuery extends PageQuery {
  ipaddr?: string
  userName?: string
}

export interface OnlineVO {
  tokenId: string
  tenantId?: string
  deptName?: string
  userName: string
  clientKey?: string
  deviceType?: string
  ipaddr?: string
  loginLocation?: string
  browser?: string
  os?: string
  loginTime?: number
  lastAccessTime?: number
  expireTime?: number
}
