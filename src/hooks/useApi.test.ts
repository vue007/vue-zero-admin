import { describe, expect, it, vi } from 'vitest'
import type { ApiPromise } from '@/api/_fetch'
import { useApi } from './useApi'

const deferred = () => {
  let resolve!: (value: unknown) => void
  const promise = new Promise<unknown>((done) => {
    resolve = done
  })
  return { promise, resolve }
}

describe('useApi', () => {
  it('keeps loading active and ignores stale response data', async () => {
    const pending: ReturnType<typeof deferred>[] = []
    const api = vi.fn(() => {
      const request = deferred()
      pending.push(request)
      return request.promise as ApiPromise<string>
    })
    const { data, request, loading } = useApi<unknown, string>(api)

    const first = request()
    const second = request()
    expect(loading.value).toBe(true)
    await Promise.resolve()

    pending[1]!.resolve({ apiData: 'newer' })
    await second
    expect(data.value).toBe('newer')
    expect(loading.value).toBe(true)

    pending[0]!.resolve({ apiData: 'older' })
    await first
    expect(data.value).toBe('newer')
    expect(loading.value).toBe(false)
  })

  it('clears loading when the api throws synchronously', async () => {
    const api = vi.fn(() => {
      throw new Error('sync failure')
    }) as unknown as (_params: unknown) => ApiPromise<string>
    const onError = vi.fn()
    const { request, loading } = useApi<unknown, string>(api, undefined, { onError })

    await expect(request()).rejects.toThrow('sync failure')

    expect(onError).toHaveBeenCalledOnce()
    expect(loading.value).toBe(false)
  })

  it('cancels the api request when onSubmit returns false', async () => {
    const api = vi.fn(() => Promise.resolve({ apiData: 'unexpected' }) as ApiPromise<string>)
    const { request, loading } = useApi<unknown, string>(api, undefined, {
      onSubmit: async () => false,
    })

    await request()

    expect(api).not.toHaveBeenCalled()
    expect(loading.value).toBe(false)
  })

  it('lets per-request data override default parameters', async () => {
    const api = vi.fn(() => Promise.resolve({ apiData: 'ok' }) as ApiPromise<string>)
    const { request } = useApi<{ cacheName: string }, string>(api, { cacheName: '' })

    await request({ cacheName: 'sys_dict' })

    expect(api).toHaveBeenCalledWith({ cacheName: 'sys_dict' })
  })
})
