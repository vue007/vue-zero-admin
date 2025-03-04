<template>
  <el-form-item
    class="ze-form-item"
    v-bind="omit($attrs, ['class', 'style', 'width'])"
    :class="itemClass"
    :style="itemStyle"
    :label="props.labelT ? $t(props.labelT as string) : isUndefined($attrs.label) ? undefined : $attrs.label + ''"
    :prop="_prop"
    ref="formItemEl"
  >
    <template v-if="isInputComp">
      <component v-bind="getBindValues" :is="InputComp" :placeholder="_PLH" ref="inputEl">
        <template v-for="(_, n) in $slots" #[n]="scope">
          <slot :name="n" v-bind="scope" />
        </template>
      </component>
    </template>
    <template v-else-if="isEnumType">
      <component
        v-if="'select' === props.type || (props.options && !!props.options.length) || $slots.default"
        v-bind="getBindValues"
        :is="enumComponent"
        :placeholder="_PLH"
      >
        <component
          :is="enumItemComponent"
          v-for="item in props.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="item.disabled"
        ></component>
      </component>
      <component v-else v-bind="omit($attrs, OMIT_KEYS)" :is="enumItemComponent">
        <template v-for="(_, n) in $slots" #[n]="scope">
          <slot :name="n" v-bind="scope" />
        </template>
      </component>
    </template>

    <!-- <template v-else-if="isUploadType">
      <ze-upload v-bind="getBindValues" ref="inputEl"></ZeUpload>
    </template> -->
    <template v-else>
      <slot v-bind="getBindValues" :placeholder="_PLH"></slot>
    </template>

    <template v-if="$slots.label" #label="scope">
      <slot name="label" v-bind="scope"></slot>
    </template>
    <template v-if="$slots.error" #error="scope">
      <slot name="error" v-bind="scope"></slot>
    </template>
  </el-form-item>
</template>

<script setup lang="tsx">
import {
  ElCheckbox,
  ElCheckboxButton,
  ElCheckboxGroup,
  ElDatePicker,
  ElInputNumber,
  ElOption,
  ElRadio,
  ElRadioButton,
  ElRadioGroup,
  ElSelect,
  ElSwitch,
  ElTransfer,
  ElTreeSelect,
} from 'element-plus'
import type {
  CheckboxGroupInstance,
  DatePickerInstance,
  FormItemInstance,
  RadioGroupContext,
  SelectContext,
  TransferInstance,
} from 'element-plus'

import { isUndefined, omit } from 'es-toolkit'
import { includes } from 'es-toolkit/compat'
import {
  INPUT_TYPES,
  ENUM_TYPES,
  PICKER_TYPES,
  TREE_TYPES,
  NUMBER_TYPES,
  SWITCH_TYPES,
  type FormItemType,
  TRANSFER_TYPES,
} from './types/form'
import type { ZeInputInstance } from './types'
import ZeInput from './ZeInput.vue'
import { mergeProps } from 'vue'

const attrs = useAttrs()

const props = defineProps({
  type: { type: String as PropType<FormItemType>, default: '' },
  itemClass: { type: [String, Array], default: undefined },
  itemStyle: { type: Object, default: () => ({}) },
  labelT: { type: [String, Object], default: undefined },
  prop: { type: String, default: undefined },
  readonly: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  plh: { type: String, default: undefined },
  plhT: { type: [String, Object], default: undefined },
  isButton: { type: Boolean, default: false },
  options: { type: Array as PropType<Array<any> | any>, default: () => [] }, // 如果options为空 且type 属于 ENUM_TYPES 表示为单个 radio 或 checkbox 类型
  clearable: { type: Boolean, default: true },
  filterable: { type: Boolean, default: true },
  multiple: { type: Boolean, default: false },
  config: { type: Object, default: () => ({}) },
  hidden: { type: Boolean, default: false },
})

const { t } = useI18n()
const _PLH = computed(() =>
  props.plh
    ? props.plh
    : props.plhT
      ? t(props.plhT as string)
      : isInputComp.value
        ? t('placeholder')
        : t('placeholderSelect') + '',
)

const getBindValues = computed(() => mergeProps(omit(props, OMIT_KEYS), attrs))

const isNumberType = computed(() => includes([...NUMBER_TYPES], props.type))
const isPickerType = computed(() => includes([...PICKER_TYPES], props.type))
const isTreeType = computed(() => includes([...TREE_TYPES], props.type))
const isSwitchType = computed(() => includes([...SWITCH_TYPES], props.type))
const isInputType = computed(() => includes([...INPUT_TYPES], props.type))
const isEnumType = computed(() => includes([...ENUM_TYPES], props.type))
const isTransferType = computed(() => includes([...TRANSFER_TYPES], props.type))
// const isUploadType = computed(() => includes([...UPLOAD_TYPES], props.type))
const isInputComp = computed(
  () =>
    isInputType.value ||
    isPickerType.value ||
    isTreeType.value ||
    isNumberType.value ||
    isSwitchType.value ||
    isTransferType.value,
)
const InputComp = computed<any>(() => {
  if (isInputType.value) return ZeInput
  else if (isPickerType.value) return ElDatePicker
  else if (isTreeType.value) return ElTreeSelect
  else if (isNumberType.value) return ElInputNumber
  else if (isSwitchType.value) return ElSwitch
  else if (isTransferType.value) return ElTransfer
  else return undefined
})

// beta
const _prop = computed(() => {
  if (props.prop) return props.prop

  const str = attrs['onUpdate:modelValue']?.toString()
  if (!str) return ''

  const strArr = str.split('=')
  const p = strArr[strArr.length - 2]?.split('.').pop()?.trim() || ''
  return p
})

const enumComponent = computed(() => {
  if (props.type === 'select') return ElSelect
  if (props.type === 'radio') return ElRadioGroup
  if (props.type === 'checkbox') return ElCheckboxGroup
  return props.type
})

const enumItemComponent = computed(() => {
  if (props.type === 'select') return ElOption
  if (props.type === 'radio') return props.isButton ? ElRadioButton : ElRadio
  if (props.type === 'checkbox') return props.isButton ? ElCheckboxButton : ElCheckbox
  return props.type
})

const formItemEl = ref()

const FORM_ITEM_ATTRS = [
  'label',
  'label-width',
  'required',
  'rules',
  'error',
  'show-message',
  'inline-message',
  'for',
  'validate-status',
  'options',
]

const OMIT_KEYS: any[] = FORM_ITEM_ATTRS

// TODO 根据type 切换类型
type ZeFormItemInputElType =
  | ZeInputInstance
  | SelectContext
  | RadioGroupContext
  | CheckboxGroupInstance
  | DatePickerInstance
  | TransferInstance
const [inputEl] = [ref<ZeFormItemInputElType>()]
// formitem 和内部input元素合并expose
type ZeFormExposeType = FormItemInstance & ZeFormItemInputElType
defineExpose<ZeFormExposeType>(
  new Proxy(
    {},
    {
      get(_target, prop) {
        if (inputEl.value?.[prop]) return inputEl.value[prop]
        if (formItemEl.value?.[prop]) return formItemEl.value[prop]
      },
      has: (_target, prop) => prop in (inputEl.value || {}) || prop in (formItemEl.value || {}),
    },
  ) as ZeFormExposeType,
)
</script>

<style lang="scss" scoped>
.ze-form-item {
  width: auto;
  margin-bottom: 16px;
  margin-right: 16px;

  .el-select {
    min-width: 200px;
  }

  :deep(:not(.el-form--inline) & + &) {
    margin-top: 10px;
  }

  :deep(.el-input__prefix) {
    padding-right: 9px;
  }

  :deep(.el-input__suffix) {
    padding-left: 9px;
  }
}

:deep(.el-select) {
  min-width: 200px;
}

:deep(.el-transfer) {
  .el-transfer-panel {
    margin-top: 6px;
  }
  .el-transfer__buttons {
    width: 80px;
    padding: 20px;
    .el-button {
      margin: 0;
      margin-top: 14px;
    }
  }
}
</style>

<i18n lang="yaml">
en:
  placeholder: Please Enter
  placeholderSelect: Please Select
zh-CN:
  placeholder: 请输入
  placeholderSelect: 请选择
zh-TW:
  placeholder: 請輸入
  placeholderSelect: 請選擇
</i18n>
