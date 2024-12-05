<template>
  <el-button
    v-for="item in props.actions"
    :key="item.action"
    :type="'confirm' == item.action ? 'primary' : item.type || 'default'"
    :loading="item.loading || false"
    v-bind="omit(item, ['action', 'type', 'text', 'loading'])"
    @click="() => emit(item.action)"
  >
    {{ item.text }}
  </el-button>
</template>

<script setup lang="ts">
import type { ButtonType } from 'element-plus'
import { omit } from 'es-toolkit'

const { t } = useI18nLocal()

const emit = defineEmits(['confirm', 'cancel'])
type ZeActionType = Parameters<typeof emit>[0]

type ZeActionItem = {
  action: ZeActionType
  type?: ButtonType
  text: string
  loading?: boolean
}

const props = defineProps({
  actions: { type: Array as PropType<ZeActionItem[]>, default: () => [] },
})
</script>

<style lang="scss" scoped>
.gt-actions {
  min-width: 160px;
}
</style>
