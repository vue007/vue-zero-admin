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
      <ze-form v-model="searchForm" :items="searchFormItems" inline>
        <ze-form-item>
          <ze-actions :actions="toolbarActions" />
        </ze-form-item>

        <ze-form-item class="ml-a">
          <ze-actions :actions="createActions" />
        </ze-form-item>
      </ze-form>
    </template>
    <ze-table ref="tableRef" :data="tableData" :loading="loading" :columns="userColumns" :filterColVR="filterColRef">
      <template #col-status="{ row }">
        <el-switch v-model="row.status" active-value="0" inactive-value="1" @click="() => handleStatusChange(row)" />
      </template>

      <ze-table-column fixed="right" label="操作" width="200px" headerAlign="center">
        <template #default="scope">
          <ze-actions :options="{ text: true, type: 'primary' }" :actions="getRowActions(scope.row)" ellipsis />
        </template>
      </ze-table-column>
    </ze-table>

    <template #content-footer>
      <ze-pagination class="ml-a" v-model="pagination" />
    </template>
  </VAsidePage>

  <EditModal>
    <ze-form v-model="editForm" :items="editFormItems" :rules="editFormRules"></ze-form>
  </EditModal>
  <VUserAuthRole ref="authRoleRef" />
</template>

<script setup lang="ts">
import type { TreeNodeData } from 'element-plus'
import { userApi } from '@/api/_index'
import { toReactive, watchDebounced } from '@vueuse/core'
import { validatePassword, validatePhone, validateUsername } from '@/utils/validators'
import { merge } from 'es-toolkit'
import type { DeptVO } from '@/api/sys/dept.type'
import type { UserInfoVO, UserQuery, UserVO } from '@/api/sys/user.type'
import { defineActions, type ZeActionItem } from '@/components/types/action'
import { defineTableColumns } from '@/components/types/table'
import VUserAuthRole from './_views/VUserAuthRole.vue'

const authRoleRef = ref()
const filterColRef = ref()

const { sys_normal_disable } = toRefs(useDict('sys_normal_disable'))
const { sys_user_sex } = toRefs(useDict('sys_user_sex'))

const { data: deptOptions } = useQuery<undefined, DeptVO[]>(() => userApi.deptTreeSelect(), undefined, {
  immediate: true,
})

const deptTreeRef = ref()
const deptName = ref('')
const filterNode = (value: string, data: TreeNodeData) => {
  if (!value) return true
  return String(data.label || '').includes(value)
}

watchEffect(() => deptTreeRef.value?.filter(deptName.value), { flush: 'post' })

const searchFormSchema = defineFormSchema<Pick<UserQuery, 'deptId' | 'userName' | 'status'>>()({
  deptId: { value: '' },
  userName: { value: '', item: { type: 'text', plh: '用户名称', prefixIcon: 'el-search' } },
  status: {
    value: '',
    item: { type: 'select', label: '状态', options: sys_normal_disable, labelWidth: '50px' },
  },
})
const { form: searchForm, items: searchFormItems } = useForm(searchFormSchema)

const {
  rows: tableData,
  request: refresh,
  pagination,
  loading,
} = useTable<UserQuery, UserVO>(userApi.listUser, toReactive(searchForm), {
  immediate: true,
})

const SEARCH_DEBOUNCE_MS = 500
const SEARCH_MAX_WAIT_MS = 2000
const refreshFromFirstPage = () => {
  pagination.pageNo = 1
  return refresh()
}
watchDebounced(
  () => [searchForm.value.deptId, searchForm.value.userName, searchForm.value.status],
  () => refreshFromFirstPage(),
  { debounce: SEARCH_DEBOUNCE_MS, maxWait: SEARCH_MAX_WAIT_MS },
)

const handleNodeClick = (data: DeptVO) => {
  const deptId = String(data.id)
  if (searchForm.value.deptId !== deptId) searchForm.value.deptId = deptId
}

const reset = async () => {
  const alreadyEmpty = !searchForm.value.deptId && !searchForm.value.userName && !searchForm.value.status
  searchForm.value = { deptId: '', userName: '', status: '' }
  await nextTick()
  if (alreadyEmpty) await refreshFromFirstPage()
}

const userColumns = defineTableColumns<UserVO>([
  { prop: 'userId', label: '用户编号', hidden: true },
  { prop: 'userName', label: '用户名称', minWidth: 138, fixed: true },
  { prop: 'nickName', label: '用户昵称', minWidth: 138 },
  { prop: 'deptName', label: '部门', minWidth: 100 },
  { prop: 'phonenumber', label: '手机号码', width: 140 },
  { prop: 'status', label: '状态', width: 80 },
  { prop: 'createTime', label: '创建时间', minWidth: 180 },
])

const toolbarActions = defineActions([
  {
    key: 'columns',
    icon: 'el-scale-to-original',
    tip: '显示/隐藏列',
    onRef: (element) => {
      filterColRef.value = element
    },
  },
  { key: 'reset', icon: 'el-refresh', tip: '重置', onClick: reset },
])

const isEdit = computed(() => editForm?.value?.userId)
const { reference: editRef, component: EditModal } = useModal({
  title: computed(() => `${isEdit.value ? '编辑' : '添加'}用户`),
  submitting: computed(() => submitting.value),
  onOpen: (row) => {
    editForm.value.password = ''
    const passwordItem = editFormItems.value.find((item) => item.prop === 'password')
    if (passwordItem) passwordItem.hidden = Boolean(row)
    refreshUserDetail(row || { userId: '' })
  },
  onConfirm: () => fetchEdit(),
})
const { data: userDetail, request: refreshUserDetail } = useQuery<Pick<UserVO, 'userId'>, UserInfoVO>(userApi.getUser)
watch(userDetail, (detail) => {
  if (detail) merge(editForm.value, detail)
})
const {
  form: editForm,
  items: editFormItems,
  rules: editFormRules,
} = useForm({
  userId: { value: '' },
  roles: { value: [] },
  nickName: {
    value: '',
    item: { type: 'text', label: '用户昵称', plh: '请输入用户昵称' },
    rule: [{ required: true, message: '用户昵称不能为空', trigger: 'blur' }],
  },
  deptId: {
    value: '',
    item: {
      type: 'tree',
      label: '归属部门',
      plh: '请选择归属部门',
      data: deptOptions,
      props: { value: 'id', label: 'label', children: 'children' },
      valueKey: 'id',
      checkStrictly: true,
    },
  },
  phonenumber: {
    value: '',
    item: { type: 'text', label: '手机号码', plh: '请输入手机号码' },
    rule: [{ validator: validatePhone, trigger: 'blur' }],
  },
  email: {
    value: '',
    item: { type: 'text', label: '邮箱', plh: '请输入邮箱' },
    rule: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }],
  },
  userName: {
    value: '',
    item: { type: 'text', label: '用户名称', plh: '请输入用户名称' },
    rule: [
      { required: true, message: '用户名称不能为空', trigger: 'blur' },
      { required: true, validator: validateUsername, trigger: 'blur' },
    ],
  },
  password: {
    value: '',
    item: { type: 'password', label: '用户密码', plh: '请输入用户密码', showPassword: true },
    rule: [{ validator: validatePassword, trigger: 'blur' }],
  },
  sex: {
    value: '2',
    item: { type: 'radio', label: '用户性别', plh: '请选择', options: sys_user_sex },
  },
  status: {
    value: '0',
    item: { type: 'radio', label: '用户状态', plh: '请输入用户状态', options: sys_normal_disable },
  },
  roleIds: {
    value: [] as string[],
    item: {
      type: 'select',
      label: '角色',
      multiple: true,
      options: computed(() => userDetail.value?.roles.map((r) => ({ label: r.roleName, value: r.roleId }))),
    },
    rule: [{ required: true, message: '用户角色不能为空', trigger: 'blur' }],
  },
  remark: {
    value: '',
    item: { type: 'textarea', label: '备注', plh: '请输入备注' },
  },
})

const { request: fetchEdit, loading: submitting } = useMutation(
  (data: typeof editForm.value) => (isEdit.value ? userApi.updateUser(data) : userApi.addUser(data)),
  editForm,
  {
    onSuccess: () => {
      refresh()
      editRef.value.close()
    },
    tipSuccess: computed(() => (isEdit.value ? '保存成功' : '新增成功')),
    tipError: computed(() => (isEdit.value ? '保存失败' : '新增失败')),
  },
)

const handleStatusChange = (row: UserVO) => {
  const text = row.status === '0' ? '启用' : '停用'

  const cancel = () => (row.status = row.status === '0' ? '1' : '0')

  ElMessageBox.confirm(`确定要${text}${row.userName}用户吗？`, { type: 'warning' })
    .then(() => {
      userApi
        .changeUserStatus({ userId: String(row.userId), status: row.status })
        .then(() => ElMessage.success(`${text}成功`))
        .catch(() => cancel())
    })
    .catch(() => cancel())
}

const handleResetPwd = (row: UserVO) => {
  ElMessageBox.confirm(`确定要将"${row.userName}"的密码重置为系统默认密码吗？`, '重置密码', {
    type: 'warning',
  }).then(() => {
    userApi.resetUserPwd({ userId: row.userId }).then(() => ElMessage.success('重置成功！'))
  })
}

const { request: handleDel } = useMutation(userApi.delUser, [], {
  onSuccess: () => refresh(),
  tipSuccess: '删除成功',
})

const createActions = defineActions([
  {
    key: 'create',
    icon: 'el-plus',
    content: '新增',
    type: 'primary',
    onClick: () => editRef.value?.open(),
  },
])

const getRowActions = (row: UserVO): ZeActionItem[] => [
  {
    key: 'edit',
    content: '编辑',
    text: true,
    type: 'primary',
    onClick: () => editRef.value?.open(row),
  },
  {
    key: 'assign-role',
    content: '分配角色',
    text: true,
    type: 'primary',
    onClick: () => authRoleRef.value?.open(row),
  },
  {
    key: 'delete',
    content: '删除',
    confirm: { title: `确定删除用户“${row.userName}”吗？` },
    onClick: () => handleDel([row.userId]),
  },
  {
    key: 'reset-password',
    content: '重置密码',
    text: true,
    type: 'primary',
    onClick: () => handleResetPwd(row),
  },
]
</script>

<style lang="scss" scoped></style>
