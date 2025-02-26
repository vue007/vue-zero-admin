import type { TagType } from '@/components/types/mixin'

export interface BaseEntity {
  createBy?: any
  createByName?: any
  createDept?: any
  createTime?: string
  updateBy?: any
  updateByName?: any
  updateTime?: any
}

export interface DictDataOption {
  label: string
  value: string
  elTagType?: TagType
  elTagClass?: string
}
