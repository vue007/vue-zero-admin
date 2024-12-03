<template>
  <el-button @click="() => emit('cancel')">{{ props.text.cancel || t ? t('base.cancel') : 'cancel' }}</el-button>
  <el-button type="primary" @click="() => emit('confirm')" :loading="props.loading">
    {{ props.text.confirm || t ? t?.('base.confirm') : 'confirm' }}
  </el-button>
</template>

<script setup lang="ts">
const { t } = useI18nLocal()

const emit = defineEmits(['confirm', 'cancel'])
type ZeActionType = Parameters<typeof emit>[0]

const props = defineProps({
  actions: { type: Array as PropType<ZeActionType[]>, default: () => [] },
  text: {
    type: Object as PropType<Record<ZeActionType, string>>,
    default: () => ({
      confirm: '',
      cancel: '',
    }),
  },
  loading: { type: Boolean, default: false },
})
</script>

<style lang="scss" scoped>
.ze-actions {
  min-width: 160px;
}
</style>
