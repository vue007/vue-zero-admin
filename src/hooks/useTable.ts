import type { ApiDataOf, ApiPage, ApiPromisePage } from '@/api/_fetch'
import type { UseApiOnSubmitFn } from './useApi'
import { isFunction, merge } from 'es-toolkit'
import { isObject } from '@vueuse/core'
import { iteratorObject } from '@/utils/iterator-object'
import type { Reactive, Ref } from 'vue'
import type { IteratorObjectReturn } from './_type'

type KeyPath = Array<string> | string

type UseTableRequest = (evt?: object) => Promise<unknown>
type UseTableFields<D> = {
  rows: Ref<D[]>
  request: UseTableRequest
  pagination: ReturnType<typeof usePagination>
  loading: Ref<boolean>
}

type UseTableReturn<D> = IteratorObjectReturn<
  UseTableFields<D>,
  [
    UseTableFields<D>['rows'],
    UseTableFields<D>['request'],
    UseTableFields<D>['pagination'],
    UseTableFields<D>['loading'],
  ]
>

type UseTableOptions<P> = {
  path?: { data?: KeyPath; total?: KeyPath; page?: string; pageSize?: string }
  immediate?: boolean
  onSubmit?: UseApiOnSubmitFn<P>
}

type ApiPageItemOf<T> = ApiDataOf<T> extends ApiPage<infer D> ? D : never

/**
 * useTable hook
 * @author Akai
 */
export function useTable<A extends (params: any) => ApiPromisePage<any>>(
  api: A,
  params?: Parameters<A>[0] | Reactive<Parameters<A>[0]> | Ref<Parameters<A>[0]>,
  options?: UseTableOptions<Parameters<A>[0]>,
): UseTableReturn<ApiPageItemOf<ReturnType<A>>>
export function useTable<P, D>(
  api: (_params: P) => ApiPromisePage<D>,
  params?: P | Reactive<P> | Ref<P>,
  options?: UseTableOptions<P>,
): UseTableReturn<D>
export function useTable<P, D>(
  api: (_params: P) => ApiPromisePage<D>,
  params?: P | Reactive<P> | Ref<P>,
  options?: UseTableOptions<P>,
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
  const listData = shallowRef<D[]>([])

  const pageKey = options?.path?.page?.split('.')[options?.path?.page?.split('.').length - 1]
  const pageSizeKey = options?.path?.pageSize?.split('.')[options?.path?.pageSize?.split('.').length - 1]

  const [pageData, request, loading] = useApi<P, ApiPage<D>>(api, isFunction(params) ? params() : params, {
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

  const refresh: UseTableRequest = (extraData?: object) => request(extraData)

  return iteratorObject<UseTableReturn<D>>({ rows: listData, request: refresh, pagination, loading })
}
