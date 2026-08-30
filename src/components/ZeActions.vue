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
            <Action v-bind="item" :is-more-action="true" />
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </el-tooltip>
</template>

<script setup lang="tsx">
import { omit } from 'es-toolkit'
import SvgIcon from './SvgIcon.vue'
import { mergeProps, type PropType } from 'vue'
import type { ZeActionItem } from './types/action'

type ActionRenderProps = ZeActionItem & { isMoreAction?: boolean }

const Action = (action: ActionRenderProps) =>
  action.confirm ? PopconfirmButton(action) : action.tip ? TipButton(action) : ActionButton(action)

const PopconfirmButton = (action: ActionRenderProps) => {
  const confirm = typeof action.confirm === 'object' ? action.confirm : {}
  const referenceAction = omit(action, ['onClick']) as ActionRenderProps
  return (
    <el-popconfirm
      key={`${action.content ?? ''}:${action.tip ?? ''}`}
      title={confirm.title ?? `确定要${action.content || action.tip || '操作'}吗？`}
      placement={confirm.placement ?? 'top'}
      confirmButtonText={confirm.confirmButtonText}
      cancelButtonText={confirm.cancelButtonText}
      onConfirm={action.onClick}
    >
      {{
        reference: () => <span>{action.tip ? TipButton(referenceAction) : ActionButton(referenceAction)}</span>,
      }}
    </el-popconfirm>
  )
}

const TipButton = (action: ActionRenderProps) => (
  <el-tooltip key={action.tip} content={action.tip} placement="top">
    <ActionButton {...action} />
  </el-tooltip>
)

const ActionButton = (action: ActionRenderProps) => (
  <el-button
    ref={action.onRef}
    {...omit(mergeProps(options.value, action), UNBUTTON_PROPS)}
    class={`ze-action p10! ${action.text || options.value?.text ? 'ml0!' : 'ml8!'}`}
  >
    {{
      icon: action.icon ? () => action.icon && <SvgIcon name={action.icon} /> : undefined,
      default: action.content ? () => action.content : undefined,
    }}
  </el-button>
)

const props = defineProps({
  options: { type: Object as PropType<ZeActionItem>, default: () => ({}) },
  actions: { type: Array as PropType<ZeActionItem[]>, default: () => [] },
  ellipsis: { type: Boolean, default: () => false },
  ellipsisStart: { type: Number, default: 2 },
})
const options = computed(() => props.options)

const UNBUTTON_PROPS = ['key', 'confirm', 'content', 'icon', 'tip', 'onRef', 'isMoreAction']
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
