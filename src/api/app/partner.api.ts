import { fetch, type ApiPromise, type ApiPromisePage } from '../_fetch'
import type { PartnerForm, PartnerQuery, PartnerVO } from './partner.types'

export function listPartner(query: PartnerQuery): ApiPromisePage<PartnerVO> {
  return fetch({ url: '/app/partner/list', method: 'get', params: query })
}

export function getPartner({ partnerId }: Pick<PartnerVO, 'partnerId'>): ApiPromise<PartnerVO> {
  return fetch({ url: `/app/partner/${partnerId}`, method: 'get' })
}

export function addPartner(data: PartnerForm): ApiPromise<void> {
  return fetch({ url: '/app/partner', method: 'post', data })
}

export function updatePartner(data: PartnerForm): ApiPromise<void> {
  return fetch({ url: '/app/partner', method: 'put', data })
}

export function delPartner(partnerIds: Array<string | number> | string | number): ApiPromise<void> {
  return fetch({ url: `/app/partner/${partnerIds}`, method: 'delete' })
}
