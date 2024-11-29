import type { ApiPromisePage } from '@/api/_fetch'
import type { UseApiOnSubmitFn } from './useApi'
import { isFunction, merge } from 'es-toolkit'
import { isObject } from '@vueuse/core'

type KeyPath = Array<string> | string
type Return = [Ref<any[] | undefined>, Function, any, Ref<boolean>]

/**
 * useTable
 */
export function useTable<P, D>(
  api: (_params: P) => ApiPromisePage<D>,
  params?: P | (() => P),
  options?: {
    path?: { data?: KeyPath; total?: KeyPath; page?: string; pageSize?: string }
    immediate?: boolean
    onSubmit?: UseApiOnSubmitFn<P>
  },
) {
  const dt = {
    path: {
      data: 'list',
      total: 'total',
      pageNo: 'pageNo',
      pageSize: 'pageSize',
    },
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

  const [pagination, , , setTotal] = usePagination((extraData?: object) => (extraData ? refresh(extraData) : refresh()))
  const listData = ref<D[]>()

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
    listData.value = pageData.value?.list || []
    setTotal(pageData.value?.total)
  })

  const refresh = (extraData?: object) => request(extraData)

  if (options.immediate) refresh()
  return [listData, refresh, pagination, loading]
}
