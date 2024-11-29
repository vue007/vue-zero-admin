import { isString } from 'es-toolkit'
import { render } from 'vue'

type ModalType = 'dialog' | 'drawer'
type ModalArgs = {
  type?: ModalType
  content?: any
  onConfirm?: () => void
  onClose?: () => void
  immediate?: boolean
  [key: string]: any
}

const _ZeModal = defineAsyncComponent(() => import('@/components/ZeModal.vue'))

const defModalArgs: ModalArgs = { type: 'dialog', content: undefined, onConfirm: () => {}, immediate: false }

export const useModal = ({ content, immediate, ...props }: ModalArgs = defModalArgs): [Ref, Component] => {
  const modalRef = ref()

  const __Use_Modal = (_props, { slots: _slots, attrs: _attrs }) => (
    <_ZeModal ref={modalRef} {...Object.assign({}, _attrs, _props, props)}>
      {{
        default: () => (!content ? _slots.default && _slots.default() : isString(content) ? content : content()),
        footer: () => _slots.footer && _slots.footer(),
      }}
    </_ZeModal>
  )

  if (immediate) {
    const nVNode = h(__Use_Modal)
    render(nVNode, document.body)
    modalRef.value.open()
  }

  return [modalRef, __Use_Modal]
}
