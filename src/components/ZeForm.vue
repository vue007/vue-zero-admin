<template>
  <el-form v-bind="omit(getBindValues, ['items'])" :model="model" class="ze-form" ref="formRef">
    <slot name="title"></slot>
    <template v-if="formItems?.length">
      <template v-for="item in formItems" :key="item.prop">
        <slot :name="'item-' + item.prop" v-bind="item">
          <ze-form-item v-if="!isEmpty(model)" v-model="model[item.prop]" v-bind="item">
            <template
              v-for="(_, n) in pickBy($slots, (v, k) => startsWith(k.toString(), `item-${item.prop}`))"
              #[n.toString().split(`#`)[1]]="scope"
            >
              <slot :name="n" v-bind="scope" />
            </template>
            <template
              v-for="(_, n) in pickBy(
                omit($slots, ['default']),
                (v, k) => !startsWith(k.toString(), `item-${item.prop}`),
              )"
              #[n]="scope"
            >
              <slot :name="n" v-bind="scope" />
            </template>
          </ze-form-item>
        </slot>
      </template>
    </template>

    <slot></slot>
  </el-form>
</template>

<script setup lang="tsx">
import type { FormValidateCallback } from 'element-plus/lib/components/index.js'
import ZeFormItem from './ZeFormItem.vue'
import { watchOnce } from '@vueuse/core'
import type { ZeFormInstance, ZeFormItemProp } from './types/form'
import { cloneDeep, omit, pickBy, toMerged } from 'es-toolkit'
import { isEmpty, startsWith } from 'es-toolkit/compat'
import type { FormInstance } from 'element-plus'

const emit = defineEmits(['update:modelValue', 'submit'])
const model = defineModel<ZeFormItemProp & { prop?: string }>()
const defaultModelVal = ref<any>(null)

watchOnce(
  () => model.value,
  (val) => (defaultModelVal.value = val),
  { immediate: true },
)

const props = defineProps({
  labelWidth: { type: String, default: '120' },
  inline: { type: Boolean, default: () => false },
  items: { type: Array as PropType<(ZeFormItemProp & { prop?: any })[]>, default: () => [] },
  hidden: { type: Boolean, default: () => false },
  changeEvent: { type: Function },
})

const attrs = useAttrs()

const getBindValues = computed(() => toMerged(attrs, props))

const formItems = computed(() => props.items.filter((item) => !item.hidden))

const formRef = ref<FormInstance | null>(null)

const setFields = (data) => {
  emit('update:modelValue', cloneDeep(data ? data : defaultModelVal.value))
  setTimeout(() => {
    formRef.value && formRef.value.clearValidate()
  })
}
const expose = new Proxy(
  { setFields },
  {
    get: (_target, prop) => formRef.value?.[prop],
    has: (_target, prop) => prop in (formRef.value || {}),
  },
)

const vFormRef = inject<any>('ZeModal->ZeForm', undefined)

const initInject = () => {
  if (vFormRef) vFormRef.value = { ...formRef.value, setFields }
}
onMounted(() => {
  initInject()
})

defineExpose<ZeFormInstance>(expose as any)
</script>

<style lang="scss" scoped>
.ze-form {
  &.el-form--inline {
    display: flex;
    width: 100%;
    flex-flow: wrap;
  }

  :last-child {
    margin-right: 0;
  }
}

:deep(form-buttom > .el-form-item__content) {
  justify-content: center;
}
</style>
