import type { ApiPageForm } from '../_fetch'
import type { BaseEntity } from '../_type'

export interface DeptQuery extends ApiPageForm {
  deptName?: string
  // deptCategory?: string
  status?: number
}

/**
 * 部门类型
 */
export interface DeptVO extends BaseEntity {
  id: number | string
  parentName: string
  parentId: number | string
  children: DeptVO[]
  deptId: number | string
  deptName: string
  deptCategory: string
  orderNum: number
  leader: string
  phone: string
  email: string
  status: string
  delFlag: string
  ancestors: string
  menuId: string | number
}

/**
 * 部门表单类型
 */
export interface DeptForm {
  parentName?: string
  parentId?: number | string
  children?: DeptForm[]
  deptId?: number | string
  deptName?: string
  deptCategory?: string
  orderNum?: number
  leader?: string
  phone?: string
  email?: string
  status?: string
  delFlag?: string
  ancestors?: string
}
