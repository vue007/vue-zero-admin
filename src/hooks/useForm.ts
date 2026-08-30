import type { ZeFormItemProp } from '@/components/types/form'
import { iteratorObject } from '@/utils/iterator-object'
import type { FormItemRule } from 'element-plus'
import { computed, ref, type Ref, type ComputedRef, type UnwrapRef } from 'vue'
import type { IteratorObjectReturn } from './_type'

export type FormFieldConfig<TValue = unknown> = {
  value: TValue
  item?: Omit<ZeFormItemProp, 'prop'>
  rule?: FormItemRule[]
}

export type FormItemsDatas = Record<string, FormFieldConfig>

export type FormSchemaFor<TModel extends object> = {
  [K in keyof TModel]-?: FormFieldConfig<TModel[K]>
}

export type GenerateFormDataType<T extends FormItemsDatas> = {
  [K in keyof T]: T[K]['value']
}

type UseFormFields<D> = {
  form: Ref<D>
  items: ComputedRef<ZeFormItemProp[]>
  rules: ComputedRef<Record<string, FormItemRule[]>>
}

type UseFormReturn<D> = IteratorObjectReturn<
  UseFormFields<D>,
  [UseFormFields<D>['form'], UseFormFields<D>['items'], UseFormFields<D>['rules']]
>

/**
 * 为需要显式模型约束的页面提供 schema 定义器，同时保留 useForm 的自动推断用法。
 */
export const defineFormSchema =
  <TModel extends object>() =>
  <TSchema extends FormSchemaFor<TModel>>(schema: TSchema): TSchema =>
    schema

/**
 * useForm hook
 * @author Akai
 */
export function useForm<T extends FormItemsDatas>(formItemDatas: T): UseFormReturn<UnwrapRef<GenerateFormDataType<T>>> {
  const entries = Object.entries(formItemDatas)
  const initialValues = Object.fromEntries(entries.map(([key, config]) => [key, config.value]))
  const form = ref(initialValues) as Ref<UnwrapRef<GenerateFormDataType<T>>>
  const formItems = ref<ZeFormItemProp[]>(
    entries.flatMap(([prop, config]) => (config.item ? [{ ...config.item, prop }] : [])),
  )
  const formRules = ref<Record<string, FormItemRule[]>>(
    Object.fromEntries(entries.map(([key, config]) => [key, config.rule || []])),
  )

  return iteratorObject(
    {
      form,
      items: computed(() => formItems.value),
      rules: computed(() => formRules.value),
    },
    ['form', 'items', 'rules'] as const,
  ) as UseFormReturn<UnwrapRef<GenerateFormDataType<T>>>
}
