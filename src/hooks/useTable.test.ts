import { nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import type { ApiPromisePage } from '@/api/_fetch'
import { useTable } from './useTable'

type Row = { id: number }

describe('useTable', () => {
  it('reads custom row and total paths without mutating options', async () => {
    const api = vi.fn((params: object) =>
      Promise.resolve({
        apiData: {
          payload: {
            items: [{ id: 1 }],
            totalCount: 7,
          },
        },
      }) as unknown as ApiPromisePage<Row>,
    )
    const options = {
      path: { data: 'payload.items', total: 'payload.totalCount' },
    }
    const originalOptions = structuredClone(options)
    const { rows, request, pagination } = useTable(api, {}, options)

    await request()
    await nextTick()

    expect(rows.value).toEqual([{ id: 1 }])
    expect(pagination.total).toBe(7)
    expect(api).toHaveBeenCalledWith({ pageNo: 1, pageSize: 10 })
    expect(options).toEqual(originalOptions)
  })
})
