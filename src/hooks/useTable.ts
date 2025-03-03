import type { ApiPromisePage } from '@/api/_fetch'
import type { UseApiOnSubmitFn } from './useApi'
import { isFunction, merge } from 'es-toolkit'
import { isObject } from '@vueuse/core'
import { iteratorObject } from '@/utils/iterator-object'
import type { Reactive, Ref, UnwrapRef } from 'vue'
import type { IteratorObjctType } from './_type'

type KeyPath = Array<string> | string

type _Ref<T> = { value: T } & UnwrapRef<T>

type ReturnFields<D> = [
  { rows: _Ref<D[]> },
  {
    request: (evt?: object) => {}
  },
  { pagination: ReturnType<typeof usePagination> },
  { loading: _Ref<boolean> },
]

type UseTableReturn<D> = IteratorObjctType<ReturnFields<D>>

/**
 * useTable hook
 * @author Akai
 */
export function useTable<P, D>(
  api: (_params: P) => ApiPromisePage<D>,
  params?: P | Reactive<P> | Ref<P>,
  options?: {
    path?: { data?: KeyPath; total?: KeyPath; page?: string; pageSize?: string }
    immediate?: boolean
    onSubmit?: UseApiOnSubmitFn<P>
  },
): UseTableReturn<D> {
  const dt = {
    path: { data: 'list', total: 'total', pageNo: 'pageNo', pageSize: 'pageSize' },
    immediate: false,
  }
  if (!options) options = dt
  if (!options.path) options.path = dt.path
  if (!options.immediate) options.immediate = dt.immediate
  if (!options.path.data) options.path.data = dt.path.data
  if (!options.path.total) options.path.total = dt.path.total
  if (!options.path.page) options.path.page = dt.path.pageNo
  if (!options.path.pageSize) options.path.pageSize = dt.path.pageSize
  // console.log(options, 'options')

  const pagination = usePagination((extraData?: object) => (extraData ? refresh(extraData) : refresh()))
  const listData = ref()

  const pageKey = options?.path?.page?.split('.')[options?.path?.page?.split('.').length - 1]
  const pageSizeKey = options?.path?.pageSize?.split('.')[options?.path?.pageSize?.split('.').length - 1]

  const [pageData, request, loading] = useApi(api, isFunction(params) ? params() : params, {
    immediate: options.immediate,
    onSubmit: async (requestData: any) => {
      const pageableData: Partial<P> | any = {
        [pageKey as string]: pagination.pageNo,
        [pageSizeKey as string]: pagination.pageSize,
      }
      if (options?.onSubmit) {
        const result = await options?.onSubmit(requestData)
        if (isObject(result)) merge(requestData, result)
      }
      merge(requestData, pageableData)
      return true
    },
  })

  watchEffect(() => {
    listData.value = pageData.value?.rows || []
    pagination.setTotal(pageData.value?.total || 0)
  })

  const refresh = (extraData?: object) => request(extraData)

  return iteratorObject({ rows: listData, request: refresh, pagination, loading })
}
