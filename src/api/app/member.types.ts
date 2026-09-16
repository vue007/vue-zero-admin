import type { PageQuery } from '../_fetch'

export interface MemberVO {
  memberId: number | string
  tenantId: string
  username: string
  nickname: string
  mobile?: string
  email?: string
  avatar?: string
  status: string
  registerSource: string
  loginIp?: string
  loginDate?: string
  createTime?: string
  remark?: string
}

export interface MemberQuery extends PageQuery {
  tenantId?: string
  memberId?: number | string
  username?: string
  nickname?: string
  mobile?: string
  status?: string
}

export interface MemberStatusForm {
  memberId: number | string
  status: string
}
