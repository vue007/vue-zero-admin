import type { ApiDataOf, ApiPage, ApiPromisePage } from '@/api/_fetch'
import { useApi, type UseApiOnSubmitFn } from './useApi'
import { isFunction, merge } from 'es-toolkit'
import { isObject } from '@vueuse/core'
import { iteratorObject } from '@/utils/iterator-object'
import { ref, watchEffect, type Reactive, type Ref } from 'vue'
import type { IteratorObjectReturn } from './_type'
import { usePagination } from './usePagination'

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
  const resolvedOptions = {
    immediate: options?.immediate ?? false,
    onSubmit: options?.onSubmit,
    path: {
      data: options?.path?.data ?? 'rows',
      total: options?.path?.total ?? 'total',
      page: options?.path?.page ?? 'pageNo',
      pageSize: options?.path?.pageSize ?? 'pageSize',
    },
  }

  const pagination = usePagination((extraData?: object) => (extraData ? refresh(extraData) : refresh()))
  const listData = ref<D[]>([]) as Ref<D[]>

  const pageKey = getLastPathSegment(resolvedOptions.path.page)
  const pageSizeKey = getLastPathSegment(resolvedOptions.path.pageSize)

  const [pageData, request, loading] = useApi<P, ApiPage<D>>(api, isFunction(params) ? params() : params, {
    immediate: resolvedOptions.immediate,
    onSubmit: async (requestData: any) => {
      const pageableData: Partial<P> | any = {
        [pageKey as string]: pagination.pageNo,
        [pageSizeKey as string]: pagination.pageSize,
      }
      if (resolvedOptions.onSubmit) {
        const result = await resolvedOptions.onSubmit(requestData)
        if (result === false) return false
        if (isObject(result)) merge(requestData, result)
      }
      merge(requestData, pageableData)
      return true
    },
  })

  watchEffect(() => {
    const rows = getPathValue(pageData.value, resolvedOptions.path.data, [])
    const total = getPathValue(pageData.value, resolvedOptions.path.total, 0)
    listData.value = Array.isArray(rows) ? (rows as D[]) : []
    pagination.setTotal(Number(total) || 0)
  })

  const refresh: UseTableRequest = (extraData?: object) => request(extraData)

  return iteratorObject<UseTableReturn<D>>({ rows: listData, request: refresh, pagination, loading })
}

const getLastPathSegment = (path: string) => path.split('.').filter(Boolean).at(-1) || path

const getPathValue = <T>(source: unknown, path: KeyPath, fallback: T): unknown | T => {
  const segments = Array.isArray(path) ? path : path.split('.').filter(Boolean)
  let value: any = source
  for (const segment of segments) {
    if (value == null || typeof value !== 'object' || !(segment in value)) return fallback
    value = value[segment]
  }
  return value ?? fallback
}
