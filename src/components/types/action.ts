import type { ButtonProps, Placement } from 'element-plus'
import type { ComponentPublicInstance } from 'vue'

export type ZeActionHandler = (event?: Event) => unknown | Promise<unknown>

export type ZeActionConfirm = {
  title?: string
  confirmButtonText?: string
  cancelButtonText?: string
  placement?: Placement
}

export type ZeActionItem = {
  key?: string | number
  confirm?: boolean | ZeActionConfirm
  content?: string
  loading?: boolean
  icon?: string
  tip?: string
  onRef?: (element?: Element | ComponentPublicInstance | null) => void
  onClick?: ZeActionHandler
} & Partial<Omit<ButtonProps, 'icon' | 'onClick'>>

export const defineActions = <TActions extends ZeActionItem[]>(actions: TActions): TActions => actions
