import { describe, expect, it } from 'vitest'
import { useForm } from './useForm'

describe('useForm', () => {
  it('keeps data-only fields out of rendered form items', () => {
    const { form, items } = useForm({
      id: { value: 1 },
      name: { value: '', item: { type: 'text', label: 'Name' } },
    })

    expect(form.value).toEqual({ id: 1, name: '' })
    expect(items.value).toEqual([{ type: 'text', label: 'Name', prop: 'name' }])
  })
})
