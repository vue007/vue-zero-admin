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
        <div v-if="options.showAction" class="modal-footer">
          <ze-actions
            :actions="[
              { action: 'cancel', text: $t('base.cancel') },
              { action: 'confirm', text: $t('base.confirm'), loading: submitting },
            ]"
            @cancel="close"
            @confirm="handleConfirm"
          />
        </div>
      </slot>
    </template>
  </Component>
</template>

<script lang="tsx" setup>
import 'element-plus/es/components/dialog/style/css'
import 'element-plus/es/components/drawer/style/css'

import { ElButton, ElDialog, ElDrawer } from 'element-plus'
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
  title: attrs.title,
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
  if (!isUndefined(title)) options.title = title
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

const handleConfirm = async (e: Event) => {
  console.log('onConfirm')

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

defineExpose({ toggle, open, close, setData, setTitle, getData, confirm: handleConfirm, form: modalForm })
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
