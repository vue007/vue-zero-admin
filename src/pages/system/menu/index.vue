<template>
  <VPage class="p24">
    <template #header>
      <ze-form v-model="searchForm" :items="searchFromItems" ref="searchFormRef" inline>
        <ze-form-item>
          <ze-actions
            :actions="[
              { icon: 'ze-table-tree', tip: '展开/折叠行', onClick: () => tableRef.toggleAllExpansion() },
              { icon: 'el-scale-to-original', tip: '显示/隐藏列', onRef: (r) => (filterColRef = r) },
              { icon: 'el-refresh', tip: '重置', onClick: reset },
            ]"
          />
        </ze-form-item>

        <ze-form-item class="mla">
          <ze-actions
            :actions="[{ icon: 'el-plus', content: '新增', type: 'primary', onClick: () => editRef.open() }]"
          />
        </ze-form-item>
      </ze-form>
    </template>

    <ze-table
      ref="tableRef"
      :data="treeData"
      :loading="loading"
      :columns="[
        { prop: 'menuName', label: '菜单名称', minWidth: 200, fixed: true },
        { prop: 'icon', label: '图标', minWidth: 100 },
        { prop: 'orderNum', label: '排序', minWidth: 80 },
        { prop: 'perms', label: '权限标识', minWidth: 160 },
        { prop: 'component', label: '组件路径', minWidth: 200 },
        { prop: 'status', label: '状态', minWidth: 80 },
        { prop: 'createTime', label: '创建时间', minWidth: 300 },
      ]"
      row-key="menuId"
      :default-expand-all="false"
      :filterColVR="filterColRef"
    >
      <template #col-status="{ row }"><VDictTag :options="sys_normal_disable" :value="row.status" /></template>

      <ze-table-column fixed="right" label="操作" width="200px" headerAlign="center">
        <template #default="{ row }">
          <ze-actions
            :options="{ text: true, type: 'primary' }"
            :actions="[
              { content: '编辑', onClick: () => editRef.open(row) },
              { content: '新增', onClick: () => addAtNode(row) },
              { content: '删除', confirm: true, onClick: () => handleDel(row) },
            ]"
            ellipsis
          />
        </template>
      </ze-table-column>
    </ze-table>
  </VPage>

  <EditModal>
    <ze-form v-model="editForm" :items="editFormItems" :rules="editFormRules"></ze-form>
  </EditModal>
</template>

<script setup lang="ts">
import { menuApi } from '@/api/_index'
import type { ZeFormInstance } from '@/components/types/form'
import { MenuTypeEnum, MenuTypeEnumList } from '@/constants/menu.enum'
import { array2Tree } from '@/utils/array2tree'
import { watchDebounced } from '@vueuse/core'

const { sys_show_hide } = toRefs(useDict('sys_show_hide'))
const { sys_normal_disable } = toRefs(useDict('sys_normal_disable'))
const searchFormRef = ref<ZeFormInstance>()

const [searchForm, searchFromItems] = useForm({
  menuName: { value: '', item: { type: 'text', plh: '菜单名称', prefixIcon: 'el-search' } },
  status: {
    value: undefined,
    item: { type: 'select', label: '状态', options: sys_normal_disable, labelWidth: '50px' },
  },
})
watchDebounced(searchForm, () => refresh(), { deep: true, debounce: 666, maxWait: 3000 })
const reset = () => (searchFormRef.value?.resetFields(), nextTick(() => refresh()))

const [listData, refresh, loading] = useApi(menuApi.listMenu, searchForm, { immediate: true })
const treeData = computed(() => array2Tree(listData.value || [], 'menuId'))

const [tableRef, filterColRef] = [ref(), ref()]

const isEdit = computed(() => editForm?.value?.menuId)

const [editRef, EditModal] = useModal({
  title: computed(() => `${isEdit.value ? '编辑' : '添加'}菜单`),
  submitting: computed(() => submitting.value),
  onOpened: () => fetchParentList({ menuId: editForm?.value?.menuId }),
  onConfirm: () => fetchEdit(),
})

const [parentList, fetchParentList] = useApi(menuApi.listMenu)
const parentTreeData = computed(() => {
  return [{ menuId: 0, menuName: '主类目', children: array2Tree(parentList.value || [], 'menuId') }]
})
const FLAG_ENUM = (okText = '是', xText = '否') => [
  { label: okText, value: '0' },
  { label: xText, value: '1' },
]
const isETFold = computed(() => editForm.value.menuType === MenuTypeEnum.FOLD)
const isETMenu = computed(() => editForm.value.menuType === MenuTypeEnum.MENU)
const isETBtn = computed(() => editForm.value.menuType === MenuTypeEnum.BTN)
// const isNotETFold = computed(() => !isETFold.value)
const isNotETMenu = computed(() => !isETMenu.value)
// const isNotETBtn = computed(() => !isETBtn.value)

const [editForm, editFormItems, editFormRules] = useForm({
  menuId: { value: '' },
  parentId: {
    value: 0,
    item: {
      type: 'tree',
      label: '上级菜单',
      props: { value: 'menuId', label: 'menuName', children: 'children' },
      valueKey: 'menuId',
      plh: '选择上级菜单',
      checkStrictly: true,
      data: parentTreeData,
    },
    rule: [{ required: true, message: '上级菜单不能为空', trigger: 'blur' }],
  },
  menuType: {
    value: '',
    item: { type: 'radio', label: '菜单类型', options: MenuTypeEnumList },
  },
  icon: {
    value: '',
    item: { hidden: isETBtn, type: 'text', label: '菜单图标' },
  },
  menuName: {
    value: '',
    item: { type: 'text', label: '菜单名称', plh: '请输入菜单名称' },
    rule: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
  },
  orderNum: {
    value: 0,
    item: { type: 'number', label: '显示排序', min: 0 },
    rule: [{ required: true, message: '菜单顺序不能为空', trigger: 'blur' }],
  },
  isFrame: {
    value: '1',
    item: { hidden: isETBtn, type: 'radio', label: '是否外链', options: FLAG_ENUM() },
  },
  path: {
    value: '',
    item: { hidden: computed(() => isETBtn.value), type: 'text', label: '路由地址' },
    rule: [{ required: true, message: '路由地址不能为空', trigger: 'blur' }],
  },
  component: {
    value: '',
    item: { hidden: computed(() => isNotETMenu.value), type: 'text', label: '组件路径', plh: '请输入组件路径' },
  },
  perms: {
    value: '',
    item: { hidden: computed(() => isETFold.value), type: 'text', label: '权限字符', plh: '请输入权限标识' },
  },
  queryParam: {
    value: '',
    item: { hidden: computed(() => isNotETMenu.value), type: 'text', label: '路由参数', plh: '请输入路由参数' },
  },
  isCache: {
    value: '0',
    item: {
      hidden: computed(() => isNotETMenu.value),
      type: 'radio',
      label: '是否缓存',
      options: FLAG_ENUM('缓存', '不缓存'),
    },
  },
  visible: {
    value: 0,
    item: { hidden: computed(() => isNotETMenu.value), type: 'radio', label: '是否显示', options: sys_show_hide },
  },
  status: {
    value: '0',
    item: { type: 'radio', label: '菜单状态', plh: '请选择菜单状态', options: sys_normal_disable },
  },
})

const { request: fetchEdit, loading: submitting } = useApi(
  (data: typeof editForm.value) => (isEdit.value ? menuApi.updateMenu(data) : menuApi.addMenu(data)),
  editForm,
  {
    onSuccess: () => {
      editRef.value.close()
      refresh()
    },
    tipSuccess: computed(() => (isEdit.value ? '保存成功' : '新增成功')),
    tipError: computed(() => (isEdit.value ? '保存失败' : '新增失败')),
  },
)

const addAtNode = (row) => {
  editRef.value.open()

  editForm.value.menuId = ''
  editForm.value.parentId = row.menuId
}

const [, handleDel] = useApi(menuApi.delMenu, {}, { onSuccess: () => refresh(), tipSuccess: '删除成功' })
</script>

<style lang="scss" scoped></style>
