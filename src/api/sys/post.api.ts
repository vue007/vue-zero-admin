import { fetch, type ApiPromise, type ApiPromisePage } from '../_fetch'
import type { PostForm, PostQuery, PostVO } from './post.types'

/** 查询岗位列表 */
export function listPost(query: PostQuery): ApiPromisePage<PostVO> {
  return fetch({
    url: '/system/post/list',
    method: 'get',
    params: query,
  })
}

/** 查询岗位详情 */
export function getPost({ postId }: Pick<PostVO, 'postId'>): ApiPromise<PostVO> {
  return fetch({
    url: '/system/post/' + postId,
    method: 'get',
  })
}

/** 新增岗位 */
export function addPost(data: PostForm): ApiPromise<void> {
  return fetch({
    url: '/system/post',
    method: 'post',
    data,
  })
}

/** 修改岗位 */
export function updatePost(data: PostForm): ApiPromise<void> {
  return fetch({
    url: '/system/post',
    method: 'put',
    data,
  })
}

/** 删除岗位 */
export function delPost(postIds: Array<string | number> | string | number): ApiPromise<void> {
  return fetch({
    url: '/system/post/' + postIds,
    method: 'delete',
  })
}

