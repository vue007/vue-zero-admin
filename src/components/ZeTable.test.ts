// @vitest-environment jsdom

import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ZeTable from './ZeTable.vue'
import ZeTableColumn from './ZeTableColumn.vue'

const tableApi = {
  toggleRowExpansion: vi.fn(),
  setCurrentRow: vi.fn(),
}

const ElTableStub = defineComponent({
  name: 'ElTable',
  setup(_props, { expose, slots }) {
    expose(tableApi)
    return () => h('section', { 'data-table': '' }, slots.default?.())
  },
})

const ColumnStub = defineComponent({
  name: 'ZeTableColumn',
  inheritAttrs: false,
  setup(_props, { attrs, slots }) {
    return () =>
      h(
        'div',
        { 'data-column': String(attrs.prop ?? attrs.label ?? '') },
        slots.default?.({ row: { status: '0' }, $index: 2 }),
      )
  },
})

const tableGlobal = {
  stubs: {
    'el-table': ElTableStub,
    'ze-table-column': ColumnStub,
    'el-checkbox': true,
    'el-checkbox-group': true,
    'el-popover': true,
  },
  directives: {
    loading: {},
  },
}

describe('ZeTable', () => {
  beforeEach(() => {
    tableApi.toggleRowExpansion.mockClear()
    tableApi.setCurrentRow.mockClear()
  })

  it('renders visible columns and forwards scoped column slots', () => {
    const wrapper = mount(ZeTable, {
      props: {
        columns: [
          { prop: 'userName', label: '用户名' },
          { prop: 'status', label: '状态' },
          { prop: 'internalId', label: '内部编号', hidden: true },
        ],
      },
      slots: {
        'col-status': ({ row, index }: any) => h('span', { 'data-status-slot': '' }, `${row.status}:${index}`),
      },
      global: tableGlobal,
    })

    expect(wrapper.findAll('[data-column]').map((item) => item.attributes('data-column'))).toEqual([
      'userName',
      'status',
    ])
    expect(wrapper.get('[data-status-slot]').text()).toBe('0:2')
  })

  it('toggles expansion recursively for tree rows', () => {
    const child = { id: 2 }
    const parent = { id: 1, children: [child] }
    const wrapper = mount(ZeTable, {
      props: { data: [parent] },
      global: tableGlobal,
    })

    ;(wrapper.vm as any).toggleAllExpansion()

    expect(tableApi.toggleRowExpansion.mock.calls).toEqual([
      [parent, true],
      [child, true],
    ])
  })

  it('preserves the original ElTable instance API', () => {
    const wrapper = mount(ZeTable, {
      global: tableGlobal,
    })

    ;(wrapper.vm as any).setCurrentRow({ id: 1 })

    expect(tableApi.setCurrentRow).toHaveBeenCalledWith({ id: 1 })
  })
})

describe('ZeTableColumn', () => {
  it('forwards column props, slots and the original instance API', () => {
    const clearFilter = vi.fn()
    const ElTableColumnStub = defineComponent({
      name: 'ElTableColumn',
      inheritAttrs: false,
      setup(_props, { attrs, expose, slots }) {
        expose({ clearFilter })
        return () =>
          h(
            'div',
            { 'data-label': attrs.label, 'data-tooltip': String(attrs.showOverflowTooltip) },
            slots.default?.({ row: { id: 1 } }),
          )
      },
    })
    const wrapper = mount(ZeTableColumn, {
      props: { label: '操作' },
      slots: { default: ({ row }: any) => `row:${row.id}` },
      global: { stubs: { 'el-table-column': ElTableColumnStub } },
    })

    ;(wrapper.vm as any).clearFilter()

    expect(wrapper.get('[data-label="操作"]').text()).toBe('row:1')
    expect(wrapper.get('[data-label="操作"]').attributes('data-tooltip')).toBe('true')
    expect(clearFilter).toHaveBeenCalledOnce()
  })
})
