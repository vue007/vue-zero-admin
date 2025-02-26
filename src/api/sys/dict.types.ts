import type { TagProps } from 'element-plus'
import type { ApiPageForm } from '../_fetch'
import type { BaseEntity } from '../_type'

export interface DictTypeVO extends BaseEntity {
  dictId: number | string
  dictName: string
  dictType: string
  remark: string
}

export interface DictTypeForm {
  dictId: number | string | undefined
  dictName: string
  dictType: string
  remark: string
}

export interface DictTypeQuery extends ApiPageForm {
  dictName: string
  dictType: string
}

// dict data

export interface DictDataQuery extends ApiPageForm {
  dictName: string
  dictType: string
  dictLabel: string
}

export interface DictDataVO extends BaseEntity {
  dictCode: string
  dictLabel: string
  dictValue: string
  cssClass: string
  listClass: TagProps['type']
  dictSort: number
  remark: string
}

export interface DictDataForm {
  dictType?: string
  dictCode: string | undefined
  dictLabel: string
  dictValue: string
  cssClass: string
  listClass: TagProps['type']
  dictSort: number
  remark: string
}
