<template>
  <VPage class="p-24">
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

        <ze-form-item class="mla mr0!">
          <ze-actions
            :actions="[{ icon: 'el-plus', content: '新增', type: 'primary', onClick: () => editRef.open() }]"
          />
        </ze-form-item>
      </ze-form>
    </template>

    <ze-table
      ref="tableRef"
      :data="listData"
      :loading="loading"
      :columns="[
        { prop: 'roleId', hidden: true },
        { prop: 'roleName', label: '角色名称', minWidth: 100, fixed: true },
        { prop: 'roleKey', label: '权限字符', minWidth: 100, fixed: true },
        { prop: 'roleSort', label: '显示顺序', minWidth: 100 },
        { prop: 'status', label: '状态', minWidth: 100 },
        { prop: 'createTime', label: '创建时间', minWidth: 180 },
        // { prop: '', label: '' },
      ]"
      :filterColVR="filterColRef"
    >
      <template #col-status="{ row }">
        <el-switch v-model="row.status" active-value="0" inactive-value="1" @click="() => handleStatusChange(row)" />
      </template>

      <ze-table-column fixed="right" label="操作" width="150px" headerAlign="center" :show-overflow-tooltip="false">
        <template #default="{ row }">
          <ze-actions
            v-if="row.roleId !== 1"
            :options="{ text: true, type: 'primary' }"
            :actions="[
              { content: '编辑', onClick: () => editRef.open(row) },
              // { content: '数据权限', onClick: () => scopeRef.open(row) },
              { content: '删除', confirm: true, onClick: () => handleDel([row.roleId]) },
            ]"
            ellipsis
          />
        </template>
      </ze-table-column>
    </ze-table>

    <template #content-footer>
      <ze-pagination class="ml-a" v-model="pagination" />
    </template>
  </VPage>

  <EditModal top="5vh">
    <ze-form v-model="editForm" :items="editFormItems" :rules="editFormRules">
      <template #item-menuIds>
        <ze-form-item label="菜单权限" prop="menuIds">
          <div>
            <el-checkbox v-model="menuExpand">展开/折叠</el-checkbox>
            <el-checkbox v-model="menuNodeAll">全选/全不选</el-checkbox>
            <el-checkbox v-model="editForm.menuCheckStrictly">父子联动</el-checkbox>
          </div>
          <el-tree
            ref="menuRef"
            class="min-h-300 max-h-40vh min-w280 of-auto p10 border border-solid border-gray-200"
            :check-strictly="!editForm.menuCheckStrictly"
            :data="menuTreeData"
            :default-checked-keys="menuOptions?.checkedKeys"
            node-key="id"
            :props="{ label: 'label', children: 'children' }"
            multiple
            show-checkbox
            @check-change="setMenuIds"
          ></el-tree>
        </ze-form-item>
      </template>
    </ze-form>
  </EditModal>

  <ScopeModal>
    <ze-form v-model="scopeForm" :items="scopeFormItems" :rules="scopeFormRules">
      <template #item-deptIds v-if="scopeForm.dataScope === '2'">
        <ze-form-item label="数据权限" prop="menuIds">
          <div class="wfull">
            <el-checkbox v-model="deptExpand">展开/折叠</el-checkbox>
            <el-checkbox v-model="deptNodeAll">全选/全不选</el-checkbox>
            <el-checkbox v-model="scopeForm.deptCheckStrictly">父子联动</el-checkbox>
          </div>
          <el-tree
            ref="deptRef"
            class="min-h-300 max-h-40vh min-w280 of-auto p10 border border-solid border-gray-200"
            :check-strictly="!scopeForm.deptCheckStrictly"
            :data="deptOptions?.depts"
            :default-checked-keys="deptOptions?.checkedKeys"
            node-key="id"
            :props="{ label: 'label', children: 'children' }"
            multiple
            show-checkbox
            @check-change="setDeptIds"
          ></el-tree>
        </ze-form-item>
      </template>
    </ze-form>
  </ScopeModal>
</template>

<script setup lang="ts">
import { menuApi, roleApi } from '@/api/_index'
import type { ZeFormInstance } from '@/components/types/form'
import { RoleScopeEnumList } from '@/constants/role.enum'
import { watchDebounced } from '@vueuse/core'
import { forEach } from 'es-toolkit/compat'

const { sys_normal_disable } = toRefs(useDict('sys_normal_disable'))

const searchFormRef = ref<ZeFormInstance>()

const [searchForm, searchFormItems] = useForm({
  roleName: { value: '', item: { type: 'text', plh: '角色名称', prefixIcon: 'el-search' } },
  roleKey: { value: '', item: { type: 'text', plh: '权限字符' } },
  status: { value: '', item: { type: 'select', label: '状态', options: sys_normal_disable, labelWidth: '50px' } },
})
watchDebounced(searchForm, () => refresh(), { debounce: 666, maxWait: 3000 })

const [listData, refresh, pagination, loading] = useTable(roleApi.listRole, searchForm, { immediate: true })

const [tableRef, filterColRef] = [ref(), ref()]
const reset = () => {
  searchFormRef.value?.resetFields()
  nextTick(() => refresh())
}

const isEdit = computed(() => editForm.value?.roleId || false)

const [menuOptions, fetchRoleMenutreeOpt] = useApi(
  menuApi.roleMenuTreeselect,
  computed(() => editForm.value.roleId || undefined),
  {
    onSuccess: (data) => (editForm.value.menuIds = data?.apiData.checkedKeys || []),
  },
)

const [addMenuTreeOpt, fetchAddRoleMenutreeOpt] = useApi(menuApi.treeselect)

const menuTreeData = computed(() => (isEdit.value ? menuOptions.value?.menus : addMenuTreeOpt.value))

const getTreeAllCheckedKeys = (el): any => {
  let checkedKeys = el.getCheckedKeys()
  let halfCheckedKeys = el.getHalfCheckedKeys()
  if (halfCheckedKeys) checkedKeys?.unshift.apply(checkedKeys, halfCheckedKeys)
  return checkedKeys
}

const [editRef, EditModal] = useModal({
  title: computed(() => `${isEdit.value ? '编辑' : '添加'}角色类型`),
  submitting: computed(() => submitting.value),
  onOpen: (row) => (row ? fetchRoleMenutreeOpt(row?.roleId) : fetchAddRoleMenutreeOpt()),
  onConfirm: () => fetchEdit(),
})

const [menuRef, menuExpand, menuNodeAll] = [ref(), ref(), ref()]
const [deptRef, deptExpand, deptNodeAll] = [ref(), ref(), ref()]
watchDebounced(
  menuExpand,
  (val) => {
    forEach(menuOptions.value?.menus || [], (item) => {
      if (menuRef.value) menuRef.value.store.nodesMap[item.id].expanded = val
    })
  },
  { debounce: 222, maxWait: 666 },
)
watchDebounced(
  menuNodeAll,
  (val) => {
    menuRef.value?.setCheckedNodes(val ? menuOptions.value?.menus : [])
  },
  { debounce: 222, maxWait: 666 },
)

const setMenuIds = () => (editForm.value.menuIds = getTreeAllCheckedKeys(menuRef.value))
const [editForm, editFormItems, editFormRules] = useForm({
  roleId: { value: '' },
  roleName: {
    value: '',
    item: { type: 'text', label: '角色名称', plh: '请输入角色名称' },
    rule: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
  },
  roleKey: {
    value: '',
    item: { type: 'text', label: '权限字符', plh: '请输入权限字符' },
    rule: [{ required: true, message: '权限字符不能为空', trigger: 'blur' }],
  },

  menuCheckStrictly: { value: true, item: { hidden: true } },
  menuIds: {
    value: [] as string[],
    item: {},
    rule: [{ required: true, message: '上级菜单不能为空', trigger: 'blur' }],
  },
  roleSort: {
    value: '',
    item: { type: 'number', label: '角色顺序' },
  },
  status: {
    value: '0',
    item: { type: 'radio', label: '状态', options: sys_normal_disable },
  },
  remark: { value: '', item: { type: 'textarea', label: '备注' } },
})

const { request: fetchEdit, loading: submitting } = useApi(
  (data: typeof editForm.value) => (isEdit.value ? roleApi.updateRole(data) : roleApi.addRole(data)),
  editForm,
  {
    onSuccess: () => (editRef.value.close(), refresh()),
    tipSuccess: computed(() => (isEdit.value ? '保存成功' : '新增成功')),
    tipError: computed(() => (isEdit.value ? '保存失败' : '新增失败')),
  },
)

const [scopeRef, ScopeModal] = useModal({
  title: computed(() => `${isEdit.value ? '编辑' : '添加'}角色类型`),
  submitting: computed(() => submitting.value),
  onOpen: (row) => fetchDeptTreeSelect(row?.roleId),
  onConfirm: () => fetchEdit(),
})
const [deptOptions, fetchDeptTreeSelect] = useApi(roleApi.deptTreeSelect, '')

const setDeptIds = () => (scopeForm.value.deptIds = getTreeAllCheckedKeys(deptRef.value))
const [scopeForm, scopeFormItems, scopeFormRules] = useForm({
  roleId: { value: '' },
  roleName: {
    value: '',
    item: { type: 'text', label: '角色名称', plh: '请输入角色名称' },
    rule: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
  },
  roleKey: {
    value: '',
    item: { type: 'text', label: '权限字符', plh: '请输入权限字符' },
    rule: [{ required: true, message: '权限字符不能为空', trigger: 'blur' }],
  },
  dataScope: {
    value: '1',
    item: { type: 'select', label: '权限范围', options: RoleScopeEnumList },
  },

  deptCheckStrictly: { value: true, item: { hidden: true } },
  deptIds: {
    value: [] as string[],
    rule: [{ required: true, message: '上级菜单不能为空', trigger: 'blur' }],
  },
})

const handleStatusChange = (row) => {
  const text = row.status === '0' ? '启用' : '停用'
  const cancel = () => (row.status = row.status === '0' ? '1' : '0')
  ElMessageBox.confirm(`确定要${text} ${row.roleName} 角色吗？`, { type: 'warning' })
    .then(() => {
      roleApi
        .changeRoleStatus(row)
        .then(() => ElMessage.success(`${text}成功`))
        .catch(() => cancel())
    })
    .catch(() => cancel())
}

const [, handleDel] = useApi(roleApi.delRole, [], { onSuccess: () => refresh(), tipSuccess: '删除成功' })
</script>

<style lang="scss" scoped></style>
