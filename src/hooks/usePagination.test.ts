import { describe, expect, it, vi } from 'vitest'
import { DEFAULT_PAGE_SIZES, usePagination } from './usePagination'

describe('usePagination', () => {
  it('uses safe defaults when pageSizes is empty and forwards its layout', () => {
    const pagination = usePagination(vi.fn(), [], 'prev, pager, next')

    expect(pagination.pageSizes).toEqual(DEFAULT_PAGE_SIZES)
    expect(pagination.pageSize).toBe(DEFAULT_PAGE_SIZES[0])
    expect(pagination.layout).toBe('prev, pager, next')
  })

  it('clamps pageNo when total shrinks below the current page', () => {
    const pagination = usePagination(vi.fn())
    pagination.pageNo = 4

    expect(pagination.setTotal(21)).toBe(true)
    expect(pagination.pageNo).toBe(3)
    expect(pagination.setTotal(21)).toBe(false)
  })
})
