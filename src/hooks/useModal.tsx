import type { ZeModalInstance } from '@/components/types'
import ZeModal from '@/components/ZeModal.vue'
import { iteratorObject } from '@/utils/iterator-object'
import { toReactive } from '@vueuse/core'
import { isString } from 'es-toolkit'
import { mergeProps, nextTick, render } from 'vue'

type ModalType = 'dialog' | 'drawer'
type ModalArgs = {
  type?: ModalType
  content?: any
  onConfirm?: () => void
  onClose?: () => void
  immediate?: boolean
  [key: string]: any
}

type UseModalReturn<R, C> = { reference: R; component: C } & [R, C]

const defModalArgs: ModalArgs = { type: 'dialog', content: undefined, onConfirm: () => {}, immediate: false }

/**
 * useModal hook
 * @param args
 * @returns [reference, component] ｜ { reference, component }
 * @author Akai
 */
export const useModal = ({ content, immediate, ...props }: ModalArgs = defModalArgs): UseModalReturn<
  Ref<ZeModalInstance>,
  Component
> => {
  const modalRef = ref()

  const __Use_Modal = (_props, { slots: _slots, attrs: _attrs }) => (
    <ZeModal ref={modalRef} {...mergeProps(_attrs, _props, toReactive(props))}>
      {{
        default: () => (!content ? _slots.default && _slots.default() : isString(content) ? content : content()),
        footer: () => _slots.footer && _slots.footer(),
      }}
    </ZeModal>
  )

  if (immediate && typeof document !== 'undefined') {
    const container = document.createElement('div')
    container.dataset.zeModalHost = ''
    document.body.appendChild(container)

    let cleaned = false
    const cleanup = () => {
      if (cleaned) return
      cleaned = true
      queueMicrotask(() => {
        render(null, container)
        container.remove()
      })
    }

    // Wait for the leave transition and user onClosed callback before unmounting.
    const nVNode = h(__Use_Modal, { onClosed: cleanup })
    render(nVNode, container)
    nextTick(() => {
      if (modalRef.value) modalRef.value.open()
      else cleanup()
    })
  }

  return iteratorObject({
    reference: modalRef,
    component: __Use_Modal,
  })
}
