import type { PageQuery } from '../_fetch'
import type { BaseEntity } from '../_type'

export interface TenantPkgVO extends BaseEntity {
  packageId?: string | number
  packageName?: string
  menuIds?: string
  remark?: string
  menuCheckStrictly?: boolean
  status?: string
}

export interface TenantPkgQuery extends PageQuery {
  packageName?: string
}

export interface TenantPkgForm {
  packageId?: string | number | undefined
  packageName?: string
  menuIds?: string
  remark?: string
  menuCheckStrictly?: boolean
}
