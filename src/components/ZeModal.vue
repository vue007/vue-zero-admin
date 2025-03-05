<template>
  <Component
    :is="WarpComp"
    class="modal-dialog"
    v-bind="$attrs"
    v-model="model"
    @close="close"
    :size="$attrs.size || $attrs.width"
    @submit.prevent
  >
    <template #header>
      <slot name="title">
        <span class="modal-title">{{ $attrs.title }}</span>
      </slot>
    </template>

    <template #default>
      <slot></slot>
    </template>

    <template #footer>
      <slot name="footer">
        <div v-if="options.showAction" class="modal-footer">
          <ze-actions
            :actions="[
              { content: t('base.cancel'), onClick: () => close() },
              { content: t('base.confirm'), type: 'primary', onClick: (e?: Event) => handleConfirm(e), loading: submitting },
            ]"
          />
        </div>
      </slot>
    </template>
  </Component>
</template>

<script lang="tsx" setup>
import { ElDialog, ElDrawer } from 'element-plus'
import { isUndefined } from 'es-toolkit'
let { t } = useI18nLocal()

const modalForm = ref()
provide('ZeModal->ZeForm', modalForm)
const emit = defineEmits(['open', 'close', 'confirm', 'cancel'])

const WarpComp = computed(() => (options.type === 'drawer' ? ElDrawer : ElDialog))

const model = defineModel<any>()
const props = defineProps({
  type: { type: String as PropType<'dialog' | 'drawer'>, default: 'dialog', require: true },
  showAction: { type: Boolean, default: true },
  isFull: { type: Boolean, default: () => false },
  readonly: { type: Boolean, default: () => false },
  submitting: { type: Boolean, default: () => false },
  footerConfirmTxt: { type: String, default: () => undefined },
})

const attrs = useAttrs()
const options = reactive({
  type: props.type,
  showAction: props.showAction,
})
watch(
  () => props,
  (val: any) => setData(val),
  { deep: true },
)

const setData = ({ type, showAction, title, submitting }: any) => {
  if (!isUndefined(type)) options.type = type
  if (!isUndefined(showAction)) options.showAction = showAction
}
const getData = () => {
  return {
    type: options.type,
    showAction: options.showAction,
  }
}

const open = (data: object | undefined = undefined) => {
  emit('open', data)
  model.value = true

  nextTick(() => {
    if (modalForm.value) {
      modalForm.value.setFields(data)
    }
  })
}

const close = (e?: Event) => {
  if (modalForm.value) modalForm.value.clearValidate()
  if (model.value) emit('close', e)
  e?.stopPropagation()
  model.value = false
}

const handleConfirm = async (e?: Event) => {
  if (modalForm.value) {
    try {
      await modalForm.value?.validate()
      emit('confirm', e)
    } catch (error) {
      ElMessage.error('请检查表单内容')
      console.warn(error)
    }
  } else {
    emit('confirm', e)
  }
}

const toggle = (isShow: boolean) => (model.value = isShow)

defineExpose({ toggle, open, close, setData, getData, confirm: handleConfirm, form: modalForm })
</script>

<!-- global style -->
<style lang="scss">
.modal-dialog {
  .el-dialog {
    height: auto;
    width: auto;
    max-height: 50vh;
    overflow-y: scroll;
  }

  &.el-drawer {
    .modal-footer {
      display: flex;
      min-height: 40px;
      margin-top: 40px;
      bottom: 0;
    }
    .el-drawer__header {
      margin-bottom: unset;
    }
  }

  .modal-title {
    font-size: 22px;
    font-weight: 500;
    color: $text-color-primary;
  }

  .modal-footer {
    padding-top: 16px;
    display: flex;
    justify-content: end;
    gap: 12px;

    .el-button {
      margin-left: unset;
    }
  }
}
</style>
