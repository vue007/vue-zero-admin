<template>
  <el-form-item
    class="ze-form-item"
    v-bind="omit($attrs, ['class', 'style'])"
    :class="itemClass"
    :style="itemStyle"
    :label="props.labelT ? $t(props.labelT as string) : isUndefined($attrs.label) ? undefined : $attrs.label + ''"
    :prop="_prop"
    ref="formItemEl"
  >
    <template v-if="isInputType">
      <ze-input v-bind="getBindValues" :placeholder="_PLH" ref="inputEl">
        <template v-for="(_, n) in $slots" #[n]="scope">
          <slot :name="n" v-bind="scope" />
        </template>
      </ze-input>
    </template>
    <template v-else-if="isEnumType">
      <template v-if="props.type === 'select'">
        <el-select v-bind="getBindValues" :placeholder="_PLH" ref="inputEl">
          <el-option
            v-for="item in props.enumList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          ></el-option>
          <template v-for="(_, n) in $slots" #[n]="scope">
            <slot :name="n" v-bind="scope" />
          </template>
        </el-select>
      </template>
      <template v-else>
        <component
          v-if="(props.enumList && !!props.enumList.length) || $slots.default"
          v-bind="omit($attrs, OMIT_KEYS)"
          :is="enumComponent"
        >
          <component
            :is="enumItemComponent"
            v-for="item in props.enumList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          ></component>
          <template v-for="(_, n) in $slots" #[n]="scope">
            <slot :name="n" v-bind="scope" />
          </template>
        </component>
        <component v-else v-bind="omit($attrs, OMIT_KEYS)" :is="enumItemComponent">
          <template v-for="(_, n) in $slots" #[n]="scope">
            <slot :name="n" v-bind="scope" />
          </template>
        </component>
      </template>
    </template>
    <template v-else-if="isPickerType">
      <el-date-picker v-bind="getBindValues" :type="(props.type as any) || 'date'" :placeholder="_PLH" ref="inputEl">
        <template v-for="(_, n) in $slots" #[n]="scope">
          <slot :name="n" v-bind="scope" />
        </template>
      </el-date-picker>
    </template>
    <template v-else-if="isTreeType">
      <el-cascader
        v-if="props.type === 'cascader'"
        :options="props.enumList"
        v-bind="getBindValues"
        :placeholder="_PLH"
        ref="inputEl"
      ></el-cascader>
    </template>
    <template v-else-if="isNumberType">
      <el-input-number v-bind="omit($attrs, OMIT_KEYS)" :placeholder="_PLH" ref="inputEl">
        <template v-for="(_, n) in $slots" #[n]="scope">
          <slot :name="n" v-bind="scope" />
        </template>
      </el-input-number>
    </template>
    <template v-else-if="isSwitchType">
      <el-switch v-bind="getBindValues" :placeholder="_PLH" ref="inputEl">
        <template v-for="(_, n) in $slots" #[n]="scope">
          <slot :name="n" v-bind="scope" />
        </template>
      </el-switch>
    </template>
    <!-- <template v-else-if="isUploadType">
      <ze-upload v-bind="getBindValues" ref="inputEl"></ZeUpload>
    </template> -->
    <template v-else>
      <slot v-bind="getBindValues"></slot>
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
import 'element-plus/es/components/checkbox/style/css'
import 'element-plus/es/components/checkbox-button/style/css'
import 'element-plus/es/components/checkbox-group/style/css'
import 'element-plus/es/components/radio/style/css'
import 'element-plus/es/components/radio-button/style/css'
import 'element-plus/es/components/radio-group/style/css'
import 'element-plus/es/components/select/style/css'
import {
  ElCheckbox,
  ElCheckboxButton,
  ElCheckboxGroup,
  ElOption,
  ElRadio,
  ElRadioButton,
  ElRadioGroup,
  ElSelect,
} from 'element-plus'
import type {
  CheckboxGroupInstance,
  DatePickerInstance,
  FormItemInstance,
  RadioGroupContext,
  SelectContext,
} from 'element-plus'

import { isUndefined, omit, toMerged } from 'es-toolkit'
import { includes } from 'es-toolkit/compat'
import {
  INPUT_TYPES,
  ENUM_TYPES,
  PICKER_TYPES,
  TREE_TYPES,
  NUMBER_TYPES,
  SWITCH_TYPES,
  type FormItemType,
} from './types/form'
import type { ZeInputInstance } from './types'

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
  enumList: { type: Array as PropType<Array<any> | any>, default: () => [] }, // 如果enumList为空 且type 属于 ENUM_TYPES 表示为单个 radio 或 checkbox 类型
  clearable: { type: Boolean, default: () => true },
  filterable: { type: Boolean, default: () => true },
  config: { type: Object, default: () => ({}) },
})

const { t } = useI18n()
const _PLH = computed(() =>
  props.plh ? props.plh : props.plhT ? t(props.plhT as unknown as string) : t('placeholder') + '',
)

const isInputType = computed(() => includes([...INPUT_TYPES], props.type))
const isEnumType = computed(() => includes([...ENUM_TYPES], props.type))
const isNumberType = computed(() => includes([...NUMBER_TYPES], props.type))
const isPickerType = computed(() => includes([...PICKER_TYPES], props.type))
const isTreeType = computed(() => includes([...TREE_TYPES], props.type))
const isSwitchType = computed(() => includes([...SWITCH_TYPES], props.type))
// const isUploadType = computed(() => includes([...UPLOAD_TYPES], props.type))

const getBindValues = computed(() => toMerged(attrs, omit(props, OMIT_KEYS)))

// beta
const _prop = computed(() => {
  const str = attrs['onUpdate:modelValue']
  if (props.prop || !str) return props.prop

  let strArr = str ? str.toString().split('=') : []
  strArr = strArr[strArr.length - 2].split('.')
  const p = strArr[strArr.length - 1].trim() || ''
  return p
})

const enumComponent = computed(() => {
  if (props.type === 'radio') return ElRadioGroup
  if (props.type === 'checkbox') return ElCheckboxGroup
  return props.type
})

const enumItemComponent = computed(() => {
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
  'enumList',
]

const OMIT_KEYS: any[] = FORM_ITEM_ATTRS

onMounted(() => {
  // console.log('asdfa', attrs, attrs.on)
})

// TODO 根据type 切换类型
type ZeFormItemInputElType =
  | ZeInputInstance
  | SelectContext
  | RadioGroupContext
  | CheckboxGroupInstance
  | DatePickerInstance
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

<style lang="scss">
.ze-form-item {
  min-width: 160px;
  width: auto;

  :deep(:not(.el-form--inline) & + &) {
    margin-top: 10px;
  }

  .el-select {
    min-width: 160px;
  }
}

:deep(.el-select) {
  min-width: 160px;
}
</style>

<i18n lang="yaml">
en:
  placeholder: Enter
zh-CN:
  placeholder: 请输入
zh-TW:
  placeholder: 請輸入
</i18n>
