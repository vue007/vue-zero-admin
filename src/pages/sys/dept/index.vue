<template>
  <VPage class="p-24">
    <template #header>
      <ze-form v-model="searchForm" :items="searchFormItems" ref="searchFormRef" inline>
        <ze-form-item>
          <ze-actions
            :actions="[
              { icon: 'el-expand', tip: '展开/折叠行', onClick: () => tableRef.toggleAllExpansion() },
              { icon: 'el-scale-to-original', tip: '显示/隐藏列', onRef: (r) => (filterColRef = r) },
              { icon: 'el-refresh', tip: '重置', onClick: reset },
            ]"
          />
        </ze-form-item>

        <ze-form-item class="ml-auto">
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
        { prop: 'deptName', label: '部门名称', minWidth: 200, fixed: true },
        { prop: 'deptCategory', label: '类别编码', minWidth: 100, headerAlign: 'center', align: 'center' },
        { prop: 'orderNum', label: '排序', width: 80 },
        { prop: 'status', label: '状态' },
        { prop: 'createTime', label: '创建时间', minWidth: 300 },
      ]"
      row-key="deptId"
      :default-expand-all="true"
      :filterColVR="filterColRef"
    >
      <template #col-status="{ row }"><VDictTag :options="sys_normal_disable" :value="row.status" /></template>

      <ze-table-column fixed="right" label="操作" width="180px" headerAlign="center">
        <template #default="scope">
          <ze-actions
            :options="{ text: true, type: 'primary' }"
            :actions="[
              { content: '编辑', onClick: () => editRef.open(scope.row) },
              { content: '新增', onClick: () => addAtNode(scope.row) },
              { content: '删除', confirm: true, onClick: () => handleDel(scope.row) },
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
import { deptApi } from '@/api/_index'
import type { ZeFormInstance } from '@/components/types/form'
import { array2Tree } from '@/utils/array2tree'
import { watchDebounced } from '@vueuse/core'

const { sys_normal_disable } = toRefs(useDict('sys_normal_disable'))
const searchFormRef = ref<ZeFormInstance>()

const [searchForm, searchFormItems] = useForm({
  deptName: { value: '', item: { type: 'text', plh: '部门名称', prefixIcon: 'el-search' } },
  status: {
    value: undefined,
    item: { type: 'select', label: '状态', plh: '请选择状态', options: sys_normal_disable, labelWidth: '50px' },
  },
})
watchDebounced(searchForm, () => refresh(), { deep: true, debounce: 666, maxWait: 3000 })
const reset = () => (searchFormRef.value?.resetFields(), nextTick(() => refresh()))

const [listData, refresh, loading] = useApi(deptApi.deptList, searchForm, { immediate: true })
const treeData = computed(() => array2Tree(listData.value || [], 'deptId'))

const [tableRef, filterColRef] = [ref(), ref()]

const isEdit = computed(() => editForm?.value?.deptId)

const [editRef, EditModal] = useModal({
  title: computed(() => `${isEdit.value ? '编辑' : '添加'}部门`),
  submitting: computed(() => submitting.value),
  onOpened: () => fetchParentList({ deptId: editForm?.value?.deptId }),
  onConfirm: () => fetchEdit(),
})

const [parentList, fetchParentList] = useApi((d) =>
  isEdit.value ? deptApi.deptListExcludeChild(d as any) : deptApi.deptList({}),
)
const parentTreeData = computed(() => array2Tree(parentList.value || [], 'deptId'))

const [editForm, editFormItems, editFormRules] = useForm({
  deptId: { value: '0' },
  parentId: {
    value: '',
    item: {
      type: 'tree',
      label: '上级部门',
      props: { value: 'deptId', label: 'deptName', children: 'children' },
      valueKey: 'deptId',
      plh: '选择上级部门',
      checkStrictly: true,
      data: parentTreeData,
    },
    rule: [{ required: true, message: '上级部门不能为空', trigger: 'blur' }],
  },
  deptName: {
    value: '',
    item: { type: 'text', label: '部门名称', plh: '请输入部门名称' },
    rule: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }],
  },
  deptCategory: { value: '', item: { type: 'text', label: '类别编码', plh: '请输入类别编码' } },
  orderNum: {
    value: 0,
    item: { type: 'number', label: '显示排序' },
    rule: [{ required: true, message: '显示排序不能为空', trigger: 'blur' }],
  },
  leader: { value: '', item: { type: 'text', label: '负责人' } },
  phone: { value: '', item: { type: 'text', label: '联系电话', plh: '请输入联系电话' } },
  email: { value: '', item: { type: 'text', label: '邮箱', plh: '请输入邮箱' } },
  status: {
    value: '0',
    item: { type: 'radio', label: '部门状态', plh: '请选择部门状态', options: sys_normal_disable },
  },
})

const { request: fetchEdit, loading: submitting } = useApi(
  (data: typeof editForm.value) => (isEdit.value ? deptApi.updateDept(data) : deptApi.addDept(data)),
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

  editForm.value.deptId = ''
  editForm.value.parentId = row.deptId
}

const handleDel = (row) => deptApi.delDept(row).then(() => refresh() && ElMessage.success('删除成功'))
</script>

<style lang="scss" scoped></style>
