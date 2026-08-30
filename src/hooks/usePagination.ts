import { iteratorObject } from '@/utils/iterator-object'
import { reactive } from 'vue'

export const DEFAULT_PAGE_SIZES = [10, 20, 50, 100, 200, 500] as const
export const DEFAULT_PAGINATION_LAYOUT = 'total, sizes, prev, pager, next, jumper'

export type PaginationCallback = (extraData?: object) => unknown

/**
 * usePagination hook
 * @author Akai
 */
export function usePagination(
  cb: PaginationCallback,
  pageSizes: number[] = [...DEFAULT_PAGE_SIZES],
  layout: string = DEFAULT_PAGINATION_LAYOUT,
) {
  const normalizedPageSizes = pageSizes.length > 0 ? [...pageSizes] : [...DEFAULT_PAGE_SIZES]
  const initialPageSize = normalizedPageSizes[0]!
  const runCallback = (extraData?: object) => cb(extraData)

  const pagination = reactive({
    pageNo: 1,
    total: 0,
    pageSize: initialPageSize,
    pageSizes: normalizedPageSizes,
    layout,
    currentChange: (page: number, extraData?: object) => {
      pagination.pageNo = Math.max(1, page)
      return runCallback(extraData)
    },
    sizeChange: (pageSize: number, extraData?: object) => {
      pagination.pageNo = 1
      pagination.pageSize = pageSize
      return runCallback(extraData)
    },
    setTotal: (total: number) => {
      pagination.total = Math.max(0, total)
      const maxPage = Math.max(1, Math.ceil(pagination.total / pagination.pageSize))
      if (pagination.pageNo <= maxPage) return false
      pagination.pageNo = maxPage
      return true
    },
    reset() {
      pagination.pageNo = 1
      pagination.total = 0
      pagination.pageSize = initialPageSize
    },
  })

  return iteratorObject(pagination)
}
