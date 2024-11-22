<template>
  <Component :is="WarpComp" class="modal-dialog" v-bind="$attrs" v-model="model" @close="close" @submit.prevent>
    <template #header>
      <slot name="title">
        <span class="modal-title">{{ options.title }}</span>
      </slot>
    </template>

    <template #default>
      <slot></slot>
    </template>

    <template #footer>
      <slot name="footer">
        <FormAction v-if="options.showAction" />
      </slot>
    </template>
  </Component>
</template>

<script lang="tsx" setup>
import 'element-plus/es/components/dialog/style/css'
import 'element-plus/es/components/drawer/style/css'

import { ElButton, ElDialog, ElDrawer } from 'element-plus'
import { isUndefined } from 'es-toolkit'
const { t } = useI18n()

const vFormRef = ref()
provide('VModal_VForm', reactive({ setVFormRef: (r: Ref<any>) => (vFormRef.value = r) }))
const emit = defineEmits(['open', 'close', 'confirm', 'cancel'])

const WarpComp = computed(() => (options.type == 'drawer' ? ElDrawer : ElDialog))

const model = defineModel()
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
const options = reactive({
  type: props.type,
  title: attrs.title,
  showAction: props.showAction,
  submitting: props.submitting,
})
watch(
  () => props,
  (val: any) => setData(val),
  { deep: true },
)

const FormAction = defineComponent({
  name: 'VFormAction',
  render: () => (
    <div class='modal-footer'>
      {!props.footerConfirmTxt && <ElButton onClick={close}>{t('common.cancel')}</ElButton>}
      <ElButton type={'primary'} onClick={handleConfirm} loading={options.submitting}>
        {props.footerConfirmTxt || t('common.confirm')}
      </ElButton>
    </div>
  ),
})

const setData = ({ type, showAction, title, submitting }) => {
  if (!isUndefined(type)) options.type = type
  if (!isUndefined(showAction)) options.showAction = showAction
  if (!isUndefined(title)) options.title = title
  if (!isUndefined(submitting)) options.submitting = submitting
}
const getData = () => {
  return {
    type: options.type,
    title: options.title,
    showAction: options.showAction,
  }
}

const setTitle = (title: string) => {
  if (!isUndefined(title)) options.title = title
}

const open = (data = undefined) => {
  emit('open', data)
  model.value = true

  nextTick(() => {
    if (vFormRef.value) {
      vFormRef.value.setFields(data)
    }
  })
}

const close = (e?: Event) => {
  if (vFormRef.value) vFormRef.value.clearValidate()
  if (model.value) emit('close', e)
  e?.stopPropagation()
  model.value = false
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

const toggle = (isShow: boolean) => (model.value = isShow)

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
