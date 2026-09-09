import { fetch, type ApiPromise, type ApiPromisePage } from '../_fetch'
import type { MemberQuery, MemberStatusForm, MemberVO } from './member.types'

export function listMember(query: MemberQuery): ApiPromisePage<MemberVO> {
  return fetch({ url: '/system/member/list', method: 'get', params: query })
}

export function getMember(memberId: MemberVO['memberId']): ApiPromise<MemberVO> {
  return fetch({ url: `/system/member/${memberId}`, method: 'get' })
}

export function changeMemberStatus(data: MemberStatusForm): ApiPromise<void> {
  return fetch({ url: '/system/member/changeStatus', method: 'put', data })
}
