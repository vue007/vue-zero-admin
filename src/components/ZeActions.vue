<template>
  <template v-for="item in listActions" :key="item.content">
    <Action v-bind="item" />
  </template>
  <el-tooltip v-if="hasMoreActions" content="更多操作" placement="top" effect="dark">
    <el-dropdown :hide-on-click="false" trigger="click">
      <ActionButton icon="el-more" type="primary" text @click=""></ActionButton>

      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="item in moreActions" :key="item.content">
            <Action v-bind="item" is-more-action />
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
import type { Ref } from 'vue'

const Action = (props) => (props.confirm ? PopconfirmButton(props) : props.tip ? TipButton(props) : ActionButton(props))

const PopconfirmButton = (props) => (
  <el-popconfirm
    key={props.content + props.tip}
    title={`确定要${props.content || props.tip || '操作'}吗?`}
    placement='top'
    onConfirm={props.onClick}
  >
    {{ reference: (h) => <span>{props.tip ? TipButton(props) : ActionButton(props)}</span> }}
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
    {...omit(props, ['confirm', 'content', 'icon'])}
    class={`gt-action p10!  ${props.text ? 'ml0!' : 'ml8!'}`}
  >
    {{
      icon: props.icon ? () => props.icon && <SvgIcon name={props.icon} /> : undefined,
      default: props.content ? () => props.content : undefined,
    }}
  </el-button>
)

const { t } = useI18nLocal()

const emit = defineEmits(['click', 'ready'])

type ZeActionItem = {
  confirm?: boolean
  content?: string
  loading?: boolean
  icon?: string
  tip?: string
  onRef?: (e?: Ref<any>) => void
  onClick?: (e?: Event) => void
} & Partial<Omit<ButtonProps, 'icon'>>

const props = defineProps({
  actions: { type: Array as PropType<ZeActionItem[]>, default: () => [] },
  ellipsis: { type: Boolean, default: () => false },
  ellipsisStart: { type: Number, default: 2 },
})

const hasMoreActions = computed(() => props.actions.length > props.ellipsisStart + 1)

const listActions = computed(() => {
  return hasMoreActions.value ? props.actions.slice(0, props.ellipsisStart) : props.actions
})

const moreActions = computed(() => props.actions.slice(props.ellipsisStart))
</script>

<style lang="scss" scoped>
.gt-actions {
  min-width: 160px;
}
</style>
