import { fetch, type ApiPromise, type ApiPromisePage } from '../_fetch'
import type { OssConfigForm, OssConfigQuery, OssConfigVO, OssQuery, OssUploadVO, OssVO } from './oss.types'

export function listOss(query: OssQuery): ApiPromisePage<OssVO> {
  return fetch({ url: '/system/oss/list', method: 'get', params: query })
}

export function uploadOss(file: File): ApiPromise<OssUploadVO> {
  const data = new FormData()
  data.append('file', file)
  return fetch({
    url: '/system/oss/upload',
    method: 'post',
    data,
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export function downloadOss(ossId: string | number): Promise<Blob> {
  return fetch({ url: '/system/oss/download/' + ossId, method: 'get', responseType: 'blob' }) as unknown as Promise<Blob>
}

export function delOss(ossIds: Array<string | number> | string | number): ApiPromise<void> {
  return fetch({ url: '/system/oss/' + ossIds, method: 'delete' })
}

export function listOssConfig(query: OssConfigQuery): ApiPromisePage<OssConfigVO> {
  return fetch({ url: '/system/oss/config/list', method: 'get', params: query })
}

export function getOssConfig({ ossConfigId }: Pick<OssConfigVO, 'ossConfigId'>): ApiPromise<OssConfigVO> {
  return fetch({ url: '/system/oss/config/' + ossConfigId, method: 'get' })
}

export function addOssConfig(data: OssConfigForm): ApiPromise<void> {
  return fetch({ url: '/system/oss/config', method: 'post', data })
}

export function updateOssConfig(data: OssConfigForm): ApiPromise<void> {
  return fetch({ url: '/system/oss/config', method: 'put', data })
}

export function changeOssConfigStatus(data: Pick<OssConfigVO, 'ossConfigId' | 'status' | 'configKey'>): ApiPromise<void> {
  return fetch({ url: '/system/oss/config/changeStatus', method: 'put', data })
}

export function delOssConfig(ossConfigIds: Array<string | number> | string | number): ApiPromise<void> {
  return fetch({ url: '/system/oss/config/' + ossConfigIds, method: 'delete' })
}
