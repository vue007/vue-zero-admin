import { describe, expect, it } from 'vitest'
import { inferPropFromModelUpdate } from './infer-model-prop'

describe('inferPropFromModelUpdate', () => {
  it('reads dot and static bracket properties from update handlers', () => {
    const form = { age: 1, displayName: '' }
    const updateAge = (value: number) => (form.age = value)
    const updateName = (value: string) => (form['displayName'] = value)

    expect(inferPropFromModelUpdate(updateAge)).toBe('age')
    expect(inferPropFromModelUpdate(updateName)).toBe('displayName')
  })

  it('does not pretend to know a dynamic property', () => {
    const form = { age: 1 }
    const field: keyof typeof form = 'age'
    const update = (value: number) => (form[field] = value)

    expect(inferPropFromModelUpdate(update)).toBe('')
  })
})
