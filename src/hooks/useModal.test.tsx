// @vitest-environment jsdom

import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

const openSpy = vi.hoisted(() => vi.fn())

vi.mock('@/components/ZeModal.vue', async () => ({
  default: defineComponent({
    name: 'ZeModal',
    emits: ['closed'],
    setup(_props, { emit, expose, slots }) {
      expose({
        open: () => {
          openSpy()
          emit('closed')
        },
      })
      return () => h('div', { 'data-modal-stub': '' }, slots.default?.())
    },
  }),
}))

import { useModal } from './useModal'

describe('useModal', () => {
  afterEach(() => {
    openSpy.mockClear()
    document.querySelectorAll('[data-ze-modal-host]').forEach((element) => element.remove())
  })

  it('supports both named and positional access chosen by the caller', () => {
    const result = useModal({ content: 'modal content' })
    const [reference, component] = result

    expect(reference).toBe(result.reference)
    expect(component).toBe(result.component)

    const wrapper = mount(component)
    expect(wrapper.text()).toContain('modal content')
  })

  it('opens and cleans up an immediate modal host', async () => {
    useModal({ immediate: true, content: 'immediate content' })
    await nextTick()
    await Promise.resolve()

    expect(openSpy).toHaveBeenCalledOnce()
    expect(document.querySelector('[data-ze-modal-host]')).toBeNull()
  })
})
