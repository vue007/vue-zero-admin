/**
 * usePagination
 */
export function usePagination(
  cb: Function,
  pageSizes: Array<number> = [10, 20, 50, 100, 200, 500],
  layout: string = 'total, sizes, prev, pager, next, jumper',
): [any, Function, Function, Function] {
  const pagination = reactive({
    pageNo: 1,
    total: 0,
    pageSize: pageSizes[0],
    pageSizes: pageSizes,
    layout: layout,
    currentChange: (page: number, extraData?: object) => {
      pagination.pageNo = page
      return extraData ? cb(extraData) : cb()
    },
    sizeChange: (pageSize: number, extraData?: object) => {
      pagination.pageNo = 1
      pagination.pageSize = pageSize
      return extraData ? cb(extraData) : cb()
    },
    setTotal: (total: number) => {
      pagination.total = total
    },
    reset() {
      pagination.pageNo = 1
      pagination.total = 0
      pagination.pageSize = pagination.pageSizes[0]
    },
  })

  return [pagination, pagination.currentChange, pagination.sizeChange, pagination.setTotal]
}
