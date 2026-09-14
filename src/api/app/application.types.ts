import type { PageQuery } from '../_fetch'
import type { BaseEntity } from '../_type'

/** 租户应用接入配置。密钥及其摘要不会出现在列表或详情响应中。 */
export interface ApplicationVO extends BaseEntity {
  id: number | string
  tenantId: string
  tenantName?: string
  appName: string
  appId: string
  appType: string
  scopes: string[]
  status: string
  remark?: string
  lastAccessTime?: string
  secretRotatedTime?: string
}

export interface ApplicationForm {
  id?: number | string
  /** 仅平台端新增应用时提交；租户自助接口从登录会话获取租户。 */
  tenantId?: string
  appName: string
  appType: string
  scopes: string[]
  status?: string
  remark?: string
}

export interface ApplicationQuery extends PageQuery {
  /** 仅平台端查询支持。 */
  tenantId?: string
  appName?: string
  appId?: string
  appType?: string
  status?: string
}

/** 只在创建或重置密钥成功后返回一次。 */
export interface ApplicationCredential {
  id: number | string
  tenantId: string
  appId: string
  appSecret: string
}

export type ApplicationStatusForm = Pick<ApplicationVO, 'id' | 'status'>
