import type { PageQuery } from '../_fetch'
import type { LogTimeQuery } from './operlog.types'

export interface LoginInfoQuery extends PageQuery, LogTimeQuery {
  userName?: string
  ipaddr?: string
  status?: string
}

export interface LoginInfoVO {
  infoId: number | string
  tenantId: string
  userName: string
  clientKey: string
  deviceType: string
  status: string
  ipaddr: string
  loginLocation: string
  browser: string
  os: string
  msg: string
  loginTime: string
}
