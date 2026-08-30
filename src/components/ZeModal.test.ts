// @vitest-environment jsdom

import { mount } from '@vue/test-utils'
import { defineComponent, h, inject, nextTick, onMounted } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { ZE_MODAL_FORM_KEY } from './types/form'
import ZeModal from './ZeModal.vue'

const ModalShellStub = defineComponent({
  name: 'ModalShell',
  inheritAttrs: false,
  setup(_props, { attrs, slots }) {
    return () =>
      h('section', { 'data-modal-shell': '', 'data-size': attrs.size }, [
        h('header', slots.header?.()),
        h('main', slots.default?.()),
        h('footer', slots.footer?.()),
      ])
  },
})

const ActionsStub = defineComponent({
  name: 'ZeActions',
  props: { actions: { type: Array, default: () => [] } },
  setup(props: any) {
    return () =>
      h(
        'div',
        props.actions.map((action: any) =>
          h('button', { 'data-modal-action': action.content, onClick: action.onClick }, action.content),
        ),
      )
  },
})

const globalStubs = {
  ElDialog: ModalShellStub,
  ElDrawer: ModalShellStub,
  'el-dialog': ModalShellStub,
  'el-drawer': ModalShellStub,
  'ze-actions': ActionsStub,
}

describe('ZeModal', () => {
  it('opens with data and delegates that data to the nested enhanced form', async () => {
    const form = {
      setFields: vi.fn(),
      clearValidate: vi.fn(),
      validate: vi.fn().mockResolvedValue(true),
    }
    const FormProbe = defineComponent({
      setup() {
        const modalForm = inject(ZE_MODAL_FORM_KEY)
        onMounted(() => {
          if (modalForm) modalForm.value = form as any
        })
        return () => h('div', { 'data-form-probe': '' })
      },
    })
    const wrapper = mount(ZeModal, {
      props: { modelValue: false },
      slots: { default: () => h(FormProbe) },
      global: { stubs: globalStubs },
    })

    ;(wrapper.vm as any).open({ userName: 'admin' })
    await nextTick()

    expect(wrapper.emitted('open')).toEqual([[{ userName: 'admin' }]])
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([true])
    expect(form.setFields).toHaveBeenCalledWith({ userName: 'admin' })
  })

  it('validates an attached form before emitting confirm', async () => {
    const form = {
      setFields: vi.fn(),
      clearValidate: vi.fn(),
      validate: vi.fn().mockResolvedValue(true),
    }
    const FormProbe = defineComponent({
      setup() {
        const modalForm = inject(ZE_MODAL_FORM_KEY)
        onMounted(() => {
          if (modalForm) modalForm.value = form as any
        })
        return () => null
      },
    })
    const wrapper = mount(ZeModal, {
      slots: { default: () => h(FormProbe) },
      global: { stubs: globalStubs },
    })

    await (wrapper.vm as any).confirm()

    expect(form.validate).toHaveBeenCalledOnce()
    expect(wrapper.emitted('confirm')).toHaveLength(1)
  })

  it('switches presentation options without changing the caller API', async () => {
    const wrapper = mount(ZeModal, { global: { stubs: globalStubs } })

    ;(wrapper.vm as any).setData({ type: 'drawer', showAction: false })
    await nextTick()

    expect((wrapper.vm as any).getData()).toEqual({ type: 'drawer', showAction: false })
    expect(wrapper.findAll('[data-modal-action]')).toHaveLength(0)
  })
})
