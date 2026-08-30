// @vitest-environment jsdom

import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
import ZeFormItem from './ZeFormItem.vue'

const formItemApi = { validate: vi.fn().mockResolvedValue(true) }
const inputApi = { focus: vi.fn() }

const ElFormItemStub = defineComponent({
  name: 'ElFormItem',
  inheritAttrs: false,
  props: { prop: String, label: String },
  setup(props, { expose, slots }) {
    expose(formItemApi)
    return () => h('label', { 'data-prop': props.prop, 'data-label': props.label }, slots.default?.())
  },
})

const ElInputStub = defineComponent({
  name: 'ElInput',
  setup(_props, { attrs, expose, slots }) {
    expose(inputApi)
    return () => h('input', { ...attrs, 'data-placeholder': attrs.placeholder }, slots.default?.())
  },
})

describe('ZeFormItem', () => {
  it('maps input type, label, prop and placeholder to the underlying components', () => {
    const wrapper = mount(ZeFormItem, {
      props: { type: 'text', prop: 'userName' },
      attrs: { label: '用户名' },
      global: {
        plugins: [i18n],
        stubs: {
          ElFormItem: ElFormItemStub,
          'el-input': ElInputStub,
          'svg-icon': true,
        },
      },
    })

    const input = wrapper.get('input')
    expect(input.attributes('prop')).toBe('userName')
    expect(input.attributes('label')).toBe('用户名')
    expect(input.attributes('data-placeholder')).toBe('Please Enter')
  })

  it('exposes both input and form-item APIs instead of replacing the original abilities', async () => {
    formItemApi.validate.mockClear()
    inputApi.focus.mockClear()
    const wrapper = mount(ZeFormItem, {
      props: { type: 'text', prop: 'userName' },
      global: {
        plugins: [i18n],
        stubs: {
          ElFormItem: ElFormItemStub,
          'el-input': ElInputStub,
          'svg-icon': true,
        },
      },
    })

    ;(wrapper.vm as any).focus()
    await (wrapper.vm as any).validate()

    expect(inputApi.focus).toHaveBeenCalledOnce()
    expect(formItemApi.validate).toHaveBeenCalledOnce()
  })
})
