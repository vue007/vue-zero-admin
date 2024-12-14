import type { FormInstance, FormItemProps } from 'element-plus'
import type ZeFormItem from '../ZeFormItem.vue'

export const INPUT_TYPES = ['text', 'textarea', 'password'] as const
export const ENUM_TYPES = ['select', 'radio', 'checkbox', 'transfer'] as const
export const PICKER_TYPES = [
  'year',
  'years',
  'month',
  'date',
  'dates',
  'time',
  'datetime',
  'week',
  'datetimerange',
  'daterange',
  'monthrange',
] as const
export const TREE_TYPES = ['tree'] as const
export const NUMBER_TYPES = ['number'] as const
export const SWITCH_TYPES = ['switch'] as const
export const UPLOAD_TYPES = ['upload'] as const
export const TRANSFER_TYPES = ['transfer'] as const
export const FORM_ITEM_TYPES = [
  ...INPUT_TYPES,
  ...ENUM_TYPES,
  ...PICKER_TYPES,
  ...TREE_TYPES,
  ...NUMBER_TYPES,
  ...SWITCH_TYPES,
  ...UPLOAD_TYPES,
  ...TRANSFER_TYPES,
] as const

export type FormItemType = (typeof FORM_ITEM_TYPES)[number]

export type FormItemInstance = Partial<InstanceType<typeof ZeFormItem>>
export type ZeFormItem = FormItemInstance & {}
type ElFormItemProps = Omit<FormItemProps, 'type'>
type _formItemProps = ZeFormItem['$props']
export type ZeFormItemProp = Partial<Omit<_formItemProps, 'type'>> &
  Partial<ElFormItemProps> & { type?: FormItemType; hidden?: boolean; [k: string]: any }

export type ZeFormInstance = FormInstance & { setFields: any }

export interface FormItemActionType {}
