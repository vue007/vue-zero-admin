import type { ZeFormItemProp } from '@/components/types/form'
import { iteratorObject } from '@/utils/iterator-object'
import type { FormItemRule } from 'element-plus'
import { forEach, set } from 'es-toolkit/compat'
import type { Ref, ComputedRef, UnwrapRef } from 'vue'
import type { IteratorObjctType } from './_type'

export type FormItemsDatas = {
  [key: string]: {
    value: any
    item?: Omit<ZeFormItemProp, 'prop'>
    rule?: FormItemRule[]
  }
}

type GenerateFormDataType<T extends FormItemsDatas> = {
  [K in keyof T]: T[K]['value']
}

type Return<D> = [
  {
    form: Ref<D>
  },
  { items: ZeFormItemProp[] },
  { rules: ComputedRef<Record<string, FormItemRule>> },
]

type useFormReturn<D> = IteratorObjctType<Return<D>>

/**
 * useForm hook
 * @author Akai
 */
export function useForm<T extends FormItemsDatas>(formItemDatas: T): useFormReturn<UnwrapRef<GenerateFormDataType<T>>> {
  const form = ref<GenerateFormDataType<T>>({} as any)
  // 设置为响应式数据，用来控制组件渲染
  const formItems = ref<ZeFormItemProp[]>([])
  const formRules = ref({})

  forEach(formItemDatas, (item, key) => {
    if (item) formItems.value.push({ ...item.item, prop: key as string })

    set(formRules.value, key, item.rule || [])
    set(form.value, key, formItemDatas[key].value)
  })
  return iteratorObject({ form, items: computed(() => formItems.value), rules: computed(() => formRules.value) })
}
