import type { PageQuery } from '../_fetch'
import type { BaseEntity } from '../_type'

export interface OssVO extends BaseEntity {
  ossId: number | string
  fileName: string
  originalName: string
  fileSuffix: string
  url: string
  createBy?: number | string
  createByName: string
  service: string
}

export interface OssUploadVO {
  url: string
  fileName: string
  ossId: string
}

export interface OssQuery extends PageQuery {
  fileName?: string
  originalName?: string
  fileSuffix?: string
  service?: string
}

export interface OssConfigVO {
  ossConfigId: number | string
  configKey: string
  accessKey: string
  secretKey: string
  bucketName: string
  prefix: string
  endpoint: string
  domain: string
  isHttps: string
  region: string
  status: string
  ext1: string
  remark: string
  accessPolicy: string
}

export interface OssConfigForm extends Omit<OssConfigVO, 'ossConfigId'> {
  ossConfigId?: number | string
}

export interface OssConfigQuery extends PageQuery {
  configKey?: string
  bucketName?: string
  status?: string
}
