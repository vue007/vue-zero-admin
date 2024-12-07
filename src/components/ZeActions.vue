<template>
  <template v-for="item in props.actions">
    <template v-if="!item.confirm">
      <InnerButton v-bind="item"></InnerButton>
    </template>
    <template v-else>
      <el-popconfirm :title="`确定要${item.content}吗?`" @confirm="item.onClick">
        <template #reference>
          <InnerButton v-bind="omit(item, ['onClick'])"></InnerButton>
        </template>
      </el-popconfirm>
    </template>
  </template>
</template>

<script setup lang="tsx">
import type { ButtonProps } from 'element-plus'
import { omit } from 'es-toolkit'
import SvgIcon from './SvgIcon.vue'

const InnerButton = (props) => (
  <el-button {...omit(props, ['confirm', 'content', 'icon'])}>
    {{
      icon: props.icon ? () => props.icon && <SvgIcon name={props.icon} /> : undefined,
      default: () => props.content,
    }}
  </el-button>
)

const { t } = useI18nLocal()

const emit = defineEmits(['click'])

type ZeActionItem = {
  confirm?: boolean
  content?: string
  loading?: boolean
  icon?: string
  onClick?: (e?: Event) => void
} & Partial<Omit<ButtonProps, 'icon'>>

const props = defineProps({
  actions: { type: Array as PropType<ZeActionItem[]>, default: () => [] },
})
</script>

<style lang="scss" scoped>
.gt-actions {
  min-width: 160px;
}
</style>
