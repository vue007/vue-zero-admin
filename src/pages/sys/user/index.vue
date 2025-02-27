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
        { prop: 'userId', label: '用户编号', hidden: true },
        { prop: 'userName', label: '用户名称', minWidth: 138, fixed: true },
        { prop: 'nickName', label: '用户昵称', minWidth: 138 },
        { prop: 'deptName', label: '部门', minWidth: 100 },
        { prop: 'phonenumber', label: '手机号码', width: 140 },
        { prop: 'status', label: '状态', width: 80 },
        { prop: 'createTime', label: '创建时间', minWidth: 180 },
        // { prop: '', label: '' },
      ]"
      :filterColVR="filterColRef"
    >
      <template #col-status="{ row }">
        <el-switch v-model="row.status" active-value="0" inactive-value="1" @click="() => handleStatusChange(row)" />
      </template>

      <ze-table-column fixed="right" label="操作" width="200px" headerAlign="center">
        <template #default="scope">
          <ze-actions
            :options="{ text: true, type: 'primary' }"
            :actions="[
              { content: '编辑', text: true, type: 'primary', onClick: () => editRef.open(scope.row) },
              { content: '分配角色', text: true, type: 'primary', onClick: () => authRoleRef.open(scope.row) },
              { content: '删除', confirm: true, onClick: () => handleDel([scope.row.userId]) },
              { content: '重置密码', text: true, type: 'primary', onClick: () => handleResetPwd(scope.row) },
            ]"
            ellipsis
          />
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
import type { ZeFormInstance } from '@/components/types/form'
import { userApi } from '@/api/_index'
import { toReactive, watchDebounced } from '@vueuse/core'
import { validatePassword, validatePhone, validateUsername } from '@/utils/validators'
import { merge } from 'es-toolkit'
import type { DeptVO } from '@/api/sys/dept.type'
import VUserAuthRole from './_views/VUserAuthRole.vue'

const authRoleRef = ref()

const { sys_normal_disable } = toRefs(useDict('sys_normal_disable'))
const { sys_user_sex } = toRefs(useDict('sys_user_sex'))

const [deptOptions] = useApi(userApi.deptTreeSelect, {}, { immediate: true })

const [deptTreeRef, deptName] = [ref(), ref('')]
const filterNode = (value: string, data: any) => {
  if (!value) return true
  return data.label.indexOf(value) !== -1
}

watchEffect(() => deptTreeRef.value?.filter(deptName.value), { flush: 'post' })
const handleNodeClick = (data: DeptVO) => {
  if (searchForm.value.deptId === data.id + '') return
  loading.value = true
  searchForm.value.deptId = data.id + ''
}
const searchFormRef = ref<ZeFormInstance>()

const [searchForm, searchFormItems] = useForm({
  deptId: { value: '' },
  userName: { value: '', item: { type: 'text', plh: '用户名称', prefixIcon: 'el-search' } },
  status: {
    value: '',
    item: { type: 'select', label: '状态', options: sys_normal_disable, labelWidth: '50px' },
  },
})
watchDebounced(searchForm, () => refresh(), { deep: true, debounce: 666, maxWait: 3000 })

const [tableData, refresh, pagination, loading] = useTable(userApi.listUser, toReactive(searchForm), {
  immediate: true,
})

const reset = () => (searchFormRef.value?.resetFields(), nextTick(() => refresh()))
const filterColRef = ref()

const isEdit = computed(() => editForm?.value?.userId)
const [editRef, EditModal] = useModal({
  title: computed(() => `${isEdit.value ? '编辑' : '添加'}用户`),
  submitting: computed(() => submitting.value),
  onOpen: (row) => {
    refreshUserDetail(row || { userId: '' })
  },
  onConfirm: () => fetchEdit(),
})
const [userDetail, refreshUserDetail] = useApi(userApi.getUser)
watch(userDetail, () => merge(editForm.value, userDetail.value || {}), { deep: true })
const [editForm, editFormItems, editFormRules] = useForm({
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
    item: { type: 'text', label: '用户密码', plh: '请输入用户密码' },
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

const { request: fetchEdit, loading: submitting } = useApi(
  (data: typeof editForm.value) => (isEdit.value ? userApi.updateUser(data) : userApi.addUser(data)),
  editForm,
  {
    onSuccess: () => refresh() && editRef.value.close(),
    tipSuccess: computed(() => (isEdit.value ? '保存成功' : '新增成功')),
    tipError: computed(() => (isEdit.value ? '保存失败' : '新增失败')),
  },
)

const handleStatusChange = (row) => {
  const text = row.status === '0' ? '启用' : '停用'

  const cancel = () => (row.status = row.status === '0' ? '1' : '0')

  ElMessageBox.confirm(`确定要${text}${row.userName}用户吗？`, { type: 'warning' })
    .then(() => {
      userApi
        .changeUserStatus(row)
        .then(() => ElMessage.success(`${text}成功`))
        .catch(() => cancel())
    })
    .catch(() => cancel())
}

const handleResetPwd = (row) => {
  ElMessageBox.prompt('请输入"' + row.userName + '"的新密码', '重置密码', {
    closeOnClickModal: false,
    inputPattern: /^.{5,20}$/,
    inputErrorMessage: '用户密码长度必须介于 5 和 20 之间',
    inputValidator: (value) => {
      if (/<|>|"|'|\||\\/.test(value)) return '不能包含非法字符：< > " \' \\\ |'
      return true
    },
  }).then((res) => {
    userApi.resetUserPwd({ userId: row.userId, password: res.value }).then(() => ElMessage.success('修改成功！'))
  })
}

const [, handleDel] = useApi(userApi.delUser, [], { onSuccess: refresh, tipSuccess: '删除成功' })
</script>

<style lang="scss" scoped></style>
