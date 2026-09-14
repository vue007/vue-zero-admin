import type { PageQuery } from '../_fetch'
import type { BaseEntity } from '../_type'

export interface PartnerVO extends BaseEntity {
  partnerId: number | string
  tenantId: string
  partnerCode: string
  partnerName: string
  creditCode?: string
  contactName?: string
  contactPhone?: string
  contactEmail?: string
  address?: string
  status: string
  remark?: string
}

export interface PartnerForm {
  partnerId?: number | string
  partnerCode: string
  partnerName: string
  creditCode?: string
  contactName?: string
  contactPhone?: string
  contactEmail?: string
  address?: string
  status: string
  remark?: string
}

export interface PartnerQuery extends PageQuery {
  partnerCode?: string
  partnerName?: string
  contactName?: string
  contactPhone?: string
  status?: string
}
