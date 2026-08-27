import type { PageQuery } from '../_fetch'
import type { BaseEntity } from '../_type'

export interface TenantPkgVO extends BaseEntity {
  packageId: string | number
  packageName: string
  menuIds: string
  remark: string
  menuCheckStrictly: boolean
  status: string
}

export interface TenantPkgQuery extends PageQuery {
  packageName?: string
  status?: string
}

export interface TenantPkgForm {
  packageId?: string | number
  packageName: string
  menuIds: Array<string | number>
  remark: string
  menuCheckStrictly: boolean
  status?: string
}
