import type { ZeFormItemProp } from '@/components/types/form'
import { iteratorObject } from '@/utils/iteratorObject'
import { toReactive } from '@vueuse/core'
import type { FormItemRule } from 'element-plus'
import { forEach, set } from 'es-toolkit/compat'
import type { Ref, ComputedRef } from 'vue'

export type FormItemsDatas = {
  [key: string]: {
    value: any
    item?: Omit<ZeFormItemProp, 'prop'>
    rule?: FormItemRule[]
  }
}

type R<D> = {
  form: Ref<D>
  items: ZeFormItemProp[]
  rules: ComputedRef<Record<string, FormItemRule>>
}

type UseFormItemsReturn<D> = R<D> & [R<D>['form'], R<D>['items'], R<D>['rules']]

export function useFormItems(formItemDatas: FormItemsDatas): UseFormItemsReturn<any> {
  const form = ref<any>({})
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
