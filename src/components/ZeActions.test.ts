// @vitest-environment jsdom

import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import ZeActions from './ZeActions.vue'

const ButtonStub = defineComponent({
  name: 'ElButton',
  inheritAttrs: false,
  emits: ['click'],
  setup(_props, { attrs, emit, slots }) {
    return () =>
      h(
        'button',
        {
          ...attrs,
          'data-action-button': '',
          onClick: (event: Event) => emit('click', event),
        },
        slots.default?.(),
      )
  },
})

const PassThroughStub = defineComponent({
  inheritAttrs: false,
  setup(_props, { slots }) {
    return () => h('div', slots.default?.())
  },
})

const DropdownStub = defineComponent({
  name: 'ElDropdown',
  setup(_props, { slots }) {
    return () => h('div', [slots.default?.(), h('div', { 'data-dropdown-menu': '' }, slots.dropdown?.())])
  },
})

const PopconfirmStub = defineComponent({
  name: 'ElPopconfirm',
  inheritAttrs: false,
  setup(_props, { attrs, slots }) {
    return () =>
      h('div', [
        slots.reference?.(),
        h(
          'button',
          { 'data-popconfirm-confirm': '', onClick: () => (attrs.onConfirm as (() => void) | undefined)?.() },
          '确认',
        ),
      ])
  },
})

const globalStubs = {
  'el-button': ButtonStub,
  'el-tooltip': PassThroughStub,
  'el-dropdown': DropdownStub,
  'el-dropdown-menu': PassThroughStub,
  'el-dropdown-item': PassThroughStub,
  'el-popconfirm': PopconfirmStub,
  SvgIcon: true,
}

describe('ZeActions', () => {
  it('renders every action inline and forwards click events', async () => {
    const edit = vi.fn()
    const wrapper = mount(ZeActions, {
      props: {
        actions: [{ content: '编辑', onClick: edit }, { content: '删除' }],
      },
      global: { stubs: globalStubs },
    })

    const buttons = wrapper.findAll('[data-action-button]')
    expect(buttons.map((button) => button.text())).toEqual(['编辑', '删除'])

    await buttons[0]!.trigger('click')
    expect(edit).toHaveBeenCalledOnce()
    expect(edit.mock.calls[0]?.[0]).toBeInstanceOf(Event)
  })

  it('moves trailing actions into the overflow area without dropping them', () => {
    const wrapper = mount(ZeActions, {
      props: {
        ellipsis: true,
        ellipsisStart: 2,
        actions: [{ content: 'A' }, { content: 'B' }, { content: 'C' }, { content: 'D' }],
      },
      global: { stubs: globalStubs },
    })

    const overflow = wrapper.get('[data-dropdown-menu]')
    expect(overflow.text()).toContain('C')
    expect(overflow.text()).toContain('D')
    expect(wrapper.text()).toContain('A')
    expect(wrapper.text()).toContain('B')
  })

  it('runs confirmed actions only through the confirmation event', async () => {
    const remove = vi.fn()
    const wrapper = mount(ZeActions, {
      props: { actions: [{ content: '删除', confirm: true, onClick: remove }] },
      global: { stubs: globalStubs },
    })

    expect(remove).not.toHaveBeenCalled()
    expect((wrapper.findComponent(ButtonStub).vm as any).$?.vnode?.props).not.toHaveProperty('onClick')

    await wrapper.get('[data-popconfirm-confirm]').trigger('click')
    expect(remove).toHaveBeenCalledOnce()
  })
})
