import type { PageQuery } from '../_fetch'
import type { BaseEntity } from '../_type'

export interface NoticeVO extends BaseEntity {
  noticeId: number | string
  noticeTitle: string
  noticeType: string
  noticeContent: string
  status: string
  remark: string
  createBy?: number | string
  createByName: string
}

export interface NoticeForm {
  noticeId?: number | string
  noticeTitle: string
  noticeType: string
  noticeContent: string
  status: string
  remark: string
}

export interface NoticeQuery extends PageQuery {
  noticeTitle?: string
  noticeType?: string
  status?: string
  createByName?: string
}
