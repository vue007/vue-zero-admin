import type { PageQuery } from '../_fetch'

export interface ClientVO {
  id: number | string
  clientId: string
  clientKey: string
  clientSecret: string
  grantTypeList: string[]
  grantType: string
  deviceType: string
  activeTimeout: number
  timeout: number
  status: string
}

export interface ClientForm {
  id?: number | string
  clientId?: string
  clientKey: string
  clientSecret: string
  grantTypeList: string[]
  grantType?: string
  deviceType: string
  activeTimeout: number
  timeout: number
  status: string
}

export interface ClientQuery extends PageQuery {
  clientId?: string
  clientKey?: string
  clientSecret?: string
  grantType?: string
  deviceType?: string
  status?: string
}
