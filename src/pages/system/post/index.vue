<template>
  <VAsidePage>
    <template #aside>
      <div class="pl-10 pb-20">
        <ze-input v-model="deptName" placeholder="请输入部门名称" prefix-icon="el-search" />
        <el-tree
          ref="deptTreeRef"
          class="mt-10"
          node-key="id"
          :data="deptOptions"
          :props="{ label: 'label', children: 'children' }"
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          highlight-current
          default-expand-all
          @node-click="handleNodeClick"
        />
      </div>
    </template>

    <template #header>
      <ze-form v-model="searchForm" :items="searchFormItems" ref="searchFormRef" inline>
        <ze-form-item>
          <ze-actions
            :actions="[
              { icon: 'el-scale-to-original', tip: '显示/隐藏列', onRef: (r) => (filterColRef = r) },
              { icon: 'el-refresh', tip: '重置', onClick: reset },
            ]"
          />
        </ze-form-item>

        <ze-form-item class="ml-a">
          <ze-actions
            :actions="[{ icon: 'el-plus', content: '新增', type: 'primary', onClick: () => editRef.open() }]"
          />
        </ze-form-item>
      </ze-form>
    </template>

    <ze-table
      ref="tableRef"
      :data="tableData"
      :loading="loading"
      :columns="[
        { prop: 'postId', label: '岗位编号', hidden: true },
        { prop: 'postCode', label: '岗位编码', minWidth: 120, fixed: true },
        { prop: 'postCategory', label: '类别编码', minWidth: 120 },
        { prop: 'postName', label: '岗位名称', minWidth: 140 },
        { prop: 'deptName', label: '部门', minWidth: 120 },
        { prop: 'postSort', label: '排序', width: 80 },
        { prop: 'status', label: '状态', width: 80 },
        { prop: 'createTime', label: '创建时间', minWidth: 180 },
      ]"
      :filterColVR="filterColRef"
    >
      <template #col-status="{ row }">
        <VDictTag :options="sys_normal_disable" :value="row.status" />
      </template>

      <ze-table-column fixed="right" label="操作" width="150px" headerAlign="center">
        <template #default="{ row }">
          <ze-actions
            :options="{ text: true, type: 'primary' }"
            :actions="[
              { content: '编辑', onClick: () => editRef.open(row) },
              { content: '删除', confirm: true, onClick: () => handleDel([row.postId]) },
            ]"
          />
        </template>
      </ze-table-column>
    </ze-table>

    <template #content-footer>
      <ze-pagination class="ml-a" v-model="pagination" />
    </template>
  </VAsidePage>

  <EditModal>
    <ze-form v-model="editForm" :items="editFormItems" :rules="editFormRules" />
  </EditModal>
</template>

<script setup lang="ts">
import { postApi, userApi } from '@/api/_index'
import type { DeptVO } from '@/api/sys/dept.type'
import type { PostQuery, PostVO } from '@/api/sys/post.types'
import type { ZeFormInstance } from '@/components/types/form'
import { toReactive, watchDebounced } from '@vueuse/core'
import { merge } from 'es-toolkit'

const { sys_normal_disable } = toRefs(useDict('sys_normal_disable'))

const [deptOptions] = useApi<undefined, DeptVO[]>(() => userApi.deptTreeSelect(), undefined, { immediate: true })
const [deptTreeRef, deptName] = [ref(), ref('')]

const filterNode = (value: string, data: any) => !value || data.label.includes(value)
watchEffect(() => deptTreeRef.value?.filter(deptName.value), { flush: 'post' })

const handleNodeClick = (data: DeptVO) => {
  if (searchForm.value.belongDeptId === data.id) return
  searchForm.value.deptId = undefined
  searchForm.value.belongDeptId = data.id
}

const searchFormRef = ref<ZeFormInstance>()
const [searchForm, searchFormItems] = useForm({
  deptId: { value: undefined as number | string | undefined },
  belongDeptId: { value: undefined as number | string | undefined },
  postCode: { value: '', item: { type: 'text', plh: '岗位编码', prefixIcon: 'el-search' } },
  postCategory: { value: '', item: { type: 'text', plh: '类别编码' } },
  postName: { value: '', item: { type: 'text', plh: '岗位名称' } },
  status: {
    value: '',
    item: { type: 'select', label: '状态', options: sys_normal_disable, labelWidth: '50px' },
  },
})
watchDebounced(searchForm, () => refresh(), { deep: true, debounce: 666, maxWait: 3000 })

const [tableData, refresh, pagination, loading] = useTable<PostQuery, PostVO>(postApi.listPost, toReactive(searchForm), {
  immediate: true,
})

const [tableRef, filterColRef] = [ref(), ref()]
const reset = () => {
  deptTreeRef.value?.setCurrentKey(undefined)
  searchFormRef.value?.resetFields()
  nextTick(() => refresh())
}

const isEdit = computed(() => Boolean(editForm.value.postId))
const [postDetail, refreshPostDetail] = useApi<Pick<PostVO, 'postId'>, PostVO>(postApi.getPost)
watch(postDetail, () => merge(editForm.value, postDetail.value || {}), { deep: true })

const [editRef, EditModal] = useModal({
  title: computed(() => `${isEdit.value ? '编辑' : '添加'}岗位`),
  submitting: computed(() => submitting.value),
  onOpen: (row?: PostVO) => row && refreshPostDetail({ postId: row.postId }),
  onConfirm: () => fetchEdit(),
})

const [editForm, editFormItems, editFormRules] = useForm({
  postId: { value: undefined as number | string | undefined },
  postName: {
    value: '',
    item: { type: 'text', label: '岗位名称', plh: '请输入岗位名称' },
    rule: [{ required: true, message: '岗位名称不能为空', trigger: 'blur' }],
  },
  deptId: {
    value: undefined as number | string | undefined,
    item: {
      type: 'tree',
      label: '部门',
      plh: '请选择部门',
      data: deptOptions,
      props: { value: 'id', label: 'label', children: 'children' },
      valueKey: 'id',
      checkStrictly: true,
    },
    rule: [{ required: true, message: '部门不能为空', trigger: 'change' }],
  },
  postCode: {
    value: '',
    item: { type: 'text', label: '岗位编码', plh: '请输入岗位编码' },
    rule: [{ required: true, message: '岗位编码不能为空', trigger: 'blur' }],
  },
  postCategory: {
    value: '',
    item: { type: 'text', label: '类别编码', plh: '请输入类别编码' },
  },
  postSort: {
    value: 0,
    item: { type: 'number', label: '岗位顺序', min: 0 },
    rule: [{ required: true, message: '岗位顺序不能为空', trigger: 'blur' }],
  },
  status: {
    value: '0',
    item: { type: 'radio', label: '岗位状态', options: sys_normal_disable },
  },
  remark: {
    value: '',
    item: { type: 'textarea', label: '备注', plh: '请输入备注' },
  },
})

const { request: fetchEdit, loading: submitting } = useApi(
  (data: typeof editForm.value) => (isEdit.value ? postApi.updatePost(data) : postApi.addPost(data)),
  editForm,
  {
    onSuccess: () => (editRef.value.close(), refresh()),
    tipSuccess: computed(() => (isEdit.value ? '保存成功' : '新增成功')),
    tipError: computed(() => (isEdit.value ? '保存失败' : '新增失败')),
  },
)

const [, handleDel] = useApi(postApi.delPost, [], {
  onSuccess: () => refresh(),
  tipSuccess: '删除成功',
  tipError: '删除失败',
})
</script>

<style lang="scss" scoped></style>
