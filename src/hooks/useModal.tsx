import type { ZeModalInstance } from '@/components/types'
import { iteratorObject } from '@/utils/iterator-object'
import { toReactive } from '@vueuse/core'
import { isString } from 'es-toolkit'
import { mergeProps, render } from 'vue'

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

const _ZeModal = defineAsyncComponent(() => import('@/components/ZeModal.vue'))

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
    <_ZeModal ref={modalRef} {...mergeProps(_attrs, _props, toReactive(props))}>
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

  return iteratorObject({
    reference: modalRef,
    component: __Use_Modal,
  })
}
