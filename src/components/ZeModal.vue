<template>
  <template v-if="_type === 'dialog'">
    <el-dialog
      class="modal-dialog"
      v-bind="$attrs"
      v-model="_visible"
      :fullscreen="isFull"
      @close="close"
      @submit.prevent
    >
      <template #title>
        <slot name="title">
          <span class="modal-title">{{ _title }}</span>
        </slot>
      </template>

      <template #default>
        <slot></slot>
      </template>

      <template #footer>
        <slot name="footer">
          <FormAction v-if="_showAction" />
        </slot>
      </template>
    </el-dialog>
  </template>

  <template v-else-if="_type === 'drawer'">
    <el-drawer class="modal-dialog is-drawer" v-model="_visible" v-bind="$attrs" @close="close">
      <template #title>
        <slot name="title">
          <span class="modal-title">{{ _title }}</span>
        </slot>
      </template>
      <template #default>
        <slot></slot>
      </template>
      <template #footer>
        <slot name="footer">
          <FormAction v-if="showAction" />
        </slot>
      </template>
    </el-drawer>
  </template>
</template>

<script lang="tsx" setup>
import { ElButton } from 'element-plus'
import { isUndefined } from 'es-toolkit'
const { t } = useI18n()

const vFormRef = ref()
provide('VModal_VForm', reactive({ setVFormRef: (r: Ref<any>) => (vFormRef.value = r) }))
const emit = defineEmits(['open', 'close', 'confirm', 'cancel'])

const props = defineProps({
  type: { type: String as PropType<'dialog' | 'drawer'>, default: 'dialog', require: true },
  visible: { type: Boolean },
  showAction: { type: Boolean, default: true },
  isFull: { type: Boolean, default: () => false },
  readonly: { type: Boolean, default: () => false },
  submitting: { type: Boolean, default: () => false },
  footerConfirmTxt: { type: String, default: () => undefined },
})

const attrs = useAttrs()
const [_type, _visible, _isFull, _title, _showAction, _submitting] = [
  ref(props.type),
  ref(props.visible),
  ref(props.isFull),
  ref(attrs.title),
  ref(props.showAction),
  ref(props.submitting),
]

const FormAction = defineComponent({
  name: 'VFormAction',
  render: () => (
    <div class='modal-footer'>
      {!props.footerConfirmTxt && <ElButton onClick={close}>{t('common.cancel')}</ElButton>}
      <ElButton type={'primary'} onClick={handleConfirm} loading={_submitting.value}>
        {props.footerConfirmTxt || t('common.confirm')}
      </ElButton>
    </div>
  ),
})

const setData = ({ type, visible, isFull, showAction, title, submitting }) => {
  if (!isUndefined(type)) _type.value = type
  if (!isUndefined(visible)) _visible.value = visible
  if (!isUndefined(isFull)) _isFull.value = isFull
  if (!isUndefined(showAction)) _showAction.value = showAction
  if (!isUndefined(title)) _title.value = title
  if (!isUndefined(submitting)) _submitting.value = submitting
}
const getData = () => {
  return {
    type: _type.value,
    visible: _visible.value,
    isFull: _isFull.value,
    title: _title.value,
    showAction: _showAction.value,
  }
}

const setTitle = (title: string) => {
  if (!isUndefined(title)) _title.value = title
}

const open = (data = undefined) => {
  emit('open', data)
  _visible.value = true

  nextTick(() => {
    if (vFormRef.value) {
      vFormRef.value.setFields(data)
    }
  })
}

const close = (e?: Event) => {
  if (vFormRef.value) vFormRef.value.clearValidate()
  if (_visible.value) emit('close', e)
  e?.stopPropagation()
  _visible.value = false
}

const handleConfirm = async (e: Event) => {
  if (vFormRef.value) {
    try {
      if (vFormRef.value) await vFormRef.value.validate()
      emit('confirm', e)
    } catch (error) {
      ElMessage.error('请检查表单内容')
      console.log(error)
    }
  } else {
    emit('confirm', e)
  }
}

const toggle = (isShow: boolean) => (_visible.value = isShow)

defineExpose({ toggle, open, close, setData, setTitle, getData, confirm: handleConfirm, form: vFormRef })
</script>

<!-- global style -->
<style lang="scss">
.modal-dialog {
  :deep(.el-dialog) {
    height: auto;
    width: auto;
    max-height: 50vh;
    overflow-y: scroll;
  }

  &.el-drawer {
    .modal-footer {
      display: flex;
      justify-content: start;
      flex-direction: row-reverse;
      position: absolute;
      min-height: 40px;
      margin-top: 40px;
      bottom: 0;
      padding-bottom: 16px;
    }
  }

  .modal-title {
    font-size: 22px;
    font-weight: 500;
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
