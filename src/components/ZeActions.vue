<template>
  <template v-for="(item, index) in listActions" :key="getActionKey(item, index, 'inline')">
    <Action v-bind="item" />
  </template>
  <el-tooltip v-if="hasMoreActions" content="更多操作" placement="top" effect="dark">
    <el-dropdown :hide-on-click="false" trigger="click">
      <ActionButton icon="el-more" type="primary" text></ActionButton>

      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="(item, index) in moreActions"
            :key="getActionKey(item, index, 'overflow')"
            class="ze-action-dropdown-item"
          >
            <Action v-bind="item" isMoreAction="true" />
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </el-tooltip>
</template>

<script setup lang="tsx">
import type { ButtonProps } from 'element-plus'
import { omit } from 'es-toolkit'
import SvgIcon from './SvgIcon.vue'
import { mergeProps, type ComponentPublicInstance, type PropType } from 'vue'

const Action = (props) => (props.confirm ? PopconfirmButton(props) : props.tip ? TipButton(props) : ActionButton(props))

const PopconfirmButton = (props) => (
  <el-popconfirm
    key={props.content + props.tip}
    title={`确定要${props.content || props.tip || '操作'}吗?`}
    placement='top'
    onConfirm={props.onClick}
  >
    {{
      reference: (h) => (
        <span>{props.tip ? TipButton(omit(props, ['onClick'])) : ActionButton(omit(props, ['onClick']))}</span>
      ),
    }}
  </el-popconfirm>
)

const TipButton = (props) => (
  <el-tooltip key={props.tip} content={props.tip} placement='top'>
    <ActionButton {...props} />
  </el-tooltip>
)

const ActionButton = (props) => (
  <el-button
    ref={props.onRef}
    {...omit(mergeProps(options.value, props), UnButtonProp)}
    class={`ze-action p10! ${props.text || options.value?.text ? 'ml0!' : 'ml8!'}`}
  >
    {{
      icon: props.icon ? () => props.icon && <SvgIcon name={props.icon} /> : undefined,
      default: props.content ? () => props.content : undefined,
    }}
  </el-button>
)

type ZeActionItem = {
  key?: string | number
  confirm?: boolean
  content?: string
  loading?: boolean
  icon?: string
  tip?: string
  onRef?: (element?: Element | ComponentPublicInstance | null) => void
  onClick?: (e?: Event) => void
} & Partial<Omit<ButtonProps, 'icon'>>

const props = defineProps({
  options: { type: Object as PropType<ZeActionItem>, default: () => ({}) },
  actions: { type: Array as PropType<ZeActionItem[]>, default: () => [] },
  ellipsis: { type: Boolean, default: () => false },
  ellipsisStart: { type: Number, default: 2 },
})
const options = computed(() => props.options)

const UnButtonProp = ['key', 'confirm', 'content', 'icon', 'tip', 'onRef']
const overflowStart = computed(() => Math.max(0, props.ellipsisStart))

const hasMoreActions = computed(() => props.ellipsis && props.actions.length > overflowStart.value)

const listActions = computed(() => {
  return hasMoreActions.value ? props.actions.slice(0, overflowStart.value) : props.actions
})

const moreActions = computed(() => {
  return hasMoreActions.value ? props.actions.slice(overflowStart.value) : []
})

const getActionKey = (item: ZeActionItem, index: number, group: string) =>
  item.key ?? `${group}:${item.content ?? ''}:${item.tip ?? ''}:${item.icon ?? ''}:${index}`
</script>

<style lang="scss" scoped>
.ze-actions {
  min-width: 160px;
}
</style>
<style lang="scss">
.ze-action-dropdown-item {
  .el-tooltip__trigger,
  .el-button {
    margin-left: unset !important;
    width: 100%;
    height: 100%;
  }
}
</style>
