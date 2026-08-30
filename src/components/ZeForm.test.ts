// @vitest-environment jsdom

import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import ZeForm from './ZeForm.vue'

const createFormStub = () => {
  const api = {
    clearValidate: vi.fn(),
    validate: vi.fn().mockResolvedValue(true),
  }
  const component = defineComponent({
    name: 'ElForm',
    props: { model: { type: Object, default: () => ({}) } },
    setup(_props, { attrs, expose, slots }) {
      expose(api)
      return () => h('form', attrs, slots.default?.())
    },
  })
  return { api, component }
}

const FormItemStub = defineComponent({
  name: 'ZeFormItem',
  inheritAttrs: false,
  props: { prop: String },
  setup(props, { slots }) {
    return () => h('div', { 'data-form-prop': props.prop }, slots.default?.())
  },
})

describe('ZeForm', () => {
  it('renders schema items while excluding hidden configuration', () => {
    const form = createFormStub()
    const wrapper = mount(ZeForm, {
      props: {
        modelValue: { userName: 'admin', internalId: '1' },
        items: [
          { prop: 'userName', label: '用户名' },
          { prop: 'internalId', label: '内部编号', hidden: true },
        ],
      },
      global: { stubs: { 'el-form': form.component, 'ze-form-item': FormItemStub } },
    })

    expect(wrapper.findAll('[data-form-prop]').map((item) => item.attributes('data-form-prop'))).toEqual(['userName'])
  })

  it('resets fields through v-model and clears validation after rendering', async () => {
    const form = createFormStub()
    const onUpdate = vi.fn()
    const wrapper = mount(ZeForm, {
      props: { modelValue: { userName: 'admin' }, 'onUpdate:modelValue': onUpdate },
      global: { stubs: { 'el-form': form.component } },
    })

    ;(wrapper.vm as any).setFields({ userName: 'editor' })
    await nextTick()

    expect(onUpdate).toHaveBeenCalledWith({ userName: 'editor' })
    expect(form.api.clearValidate).toHaveBeenCalledOnce()
  })

  it('preserves the original ElForm instance API on the enhanced component', async () => {
    const form = createFormStub()
    const wrapper = mount(ZeForm, {
      global: { stubs: { 'el-form': form.component } },
    })

    await (wrapper.vm as any).validate()

    expect(form.api.validate).toHaveBeenCalledOnce()
  })
})
