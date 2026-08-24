import { fetch, type ApiPromise, type ApiPromisePage } from '../_fetch'
import type { NoticeForm, NoticeQuery, NoticeVO } from './notice.types'

/** 查询通知公告列表 */
export function listNotice(query: NoticeQuery): ApiPromisePage<NoticeVO> {
  return fetch({
    url: '/system/notice/list',
    method: 'get',
    params: query,
  })
}

/** 查询通知公告详情 */
export function getNotice({ noticeId }: Pick<NoticeVO, 'noticeId'>): ApiPromise<NoticeVO> {
  return fetch({
    url: '/system/notice/' + noticeId,
    method: 'get',
  })
}

/** 新增通知公告 */
export function addNotice(data: NoticeForm): ApiPromise<void> {
  return fetch({
    url: '/system/notice',
    method: 'post',
    data,
  })
}

/** 修改通知公告 */
export function updateNotice(data: NoticeForm): ApiPromise<void> {
  return fetch({
    url: '/system/notice',
    method: 'put',
    data,
  })
}

/** 删除通知公告 */
export function delNotice(noticeIds: Array<string | number> | string | number): ApiPromise<void> {
  return fetch({
    url: '/system/notice/' + noticeIds,
    method: 'delete',
  })
}
