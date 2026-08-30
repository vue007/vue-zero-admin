import { describe, expect, it } from 'vitest'
import { iteratorObject } from './iterator-object'

describe('iteratorObject', () => {
  it('lets the caller choose object or positional destructuring', () => {
    const result = iteratorObject({ data: 'data', request: 'request', loading: 'loading' }, [
      'data',
      'request',
      'loading',
    ] as const)

    const { request } = result
    const [data, positionalRequest, loading] = result

    expect(request).toBe('request')
    expect([data, positionalRequest, loading]).toEqual(['data', 'request', 'loading'])
  })

  it('uses property insertion order when no explicit order is supplied', () => {
    const result = iteratorObject({ first: 1, second: 2 })

    expect([...result]).toEqual([1, 2])
    expect(Object.keys(result)).toEqual(['first', 'second'])
  })

  it('can redefine positional semantics without changing named properties', () => {
    const result = iteratorObject({ first: 1, second: 2 })

    iteratorObject(result, ['second', 'first'] as const)

    expect([...result]).toEqual([2, 1])
    expect(result.first).toBe(1)
  })

  it('keeps the original explicit return-type form available', () => {
    type LegacyReturn = { first: number; second: number } & [number, number]
    const result = iteratorObject<LegacyReturn>({ first: 1, second: 2 })

    const [first, second] = result
    expect([first, second]).toEqual([1, 2])
  })
})
