// @vitest-environment jsdom

import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { usePagination } from '@/hooks/usePagination'
import ZePagination from './ZePagination.vue'

const ElPaginationStub = defineComponent({
  name: 'ElPagination',
  props: {
    currentPage: Number,
    pageSize: Number,
    pageSizes: Array,
    total: Number,
    layout: String,
    small: Boolean,
  },
  emits: ['update:currentPage', 'current-change', 'size-change'],
  setup(props) {
    return () => h('div', { 'data-current-page': props.currentPage, 'data-small': String(props.small) })
  },
})

describe('ZePagination', () => {
  it('keeps pagination state and component events synchronized', async () => {
    const request = vi.fn()
    const pagination = usePagination(request)
    const wrapper = mount(ZePagination, {
      props: { modelValue: pagination },
      global: { provide: { size: 'default' }, stubs: { 'el-pagination': ElPaginationStub } },
    })
    const raw = wrapper.findComponent(ElPaginationStub)

    raw.vm.$emit('update:currentPage', 3)
    raw.vm.$emit('current-change', 3)
    await nextTick()

    expect(pagination.pageNo).toBe(3)
    expect(request).toHaveBeenCalledOnce()

    raw.vm.$emit('size-change', 50)
    expect(pagination.pageNo).toBe(1)
    expect(pagination.pageSize).toBe(50)
    expect(request).toHaveBeenCalledTimes(2)
  })

  it('derives compact rendering from the shared size context', () => {
    const pagination = usePagination(vi.fn())
    const large = mount(ZePagination, {
      props: { modelValue: pagination },
      global: { provide: { size: 'large' }, stubs: { 'el-pagination': ElPaginationStub } },
    })
    const compact = mount(ZePagination, {
      props: { modelValue: pagination },
      global: { provide: { size: 'small' }, stubs: { 'el-pagination': ElPaginationStub } },
    })

    expect(large.findComponent(ElPaginationStub).props('small')).toBe(false)
    expect(compact.findComponent(ElPaginationStub).props('small')).toBe(true)
  })
})
