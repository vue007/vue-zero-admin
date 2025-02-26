<template>
  <ConfigModal>
    <VPage class="p-24">
      <ze-table
        ref="tableRef"
        :data="tableData || []"
        :loading="loading"
        :columns="[
          { type: 'selection', width: 80 },
          { type: 'index', label: '序号', minWidth: 60 },
          { prop: 'roleId', label: '角色编号', minWidth: 80 },
          { prop: 'roleName', label: '角色名称', minWidth: 100 },
          { prop: 'roleKey', label: '权限字符', minWidth: 100 },
          { prop: 'createTime', label: '创建时间', minWidth: 180 },
          // { prop: '', label: '' },
        ]"
        @selection-change="handleSelectionChange"
      ></ze-table>

      <template #content-footer>
        <el-pagination
          class="mla mt5"
          v-show="total > 0"
          v-model:page="pageNum"
          v-model:limit="pageSize"
          :total="total"
          size="small"
        />
      </template>
    </VPage>
  </ConfigModal>
</template>

<script setup lang="ts">
import { userApi } from '@/api/_index'
import type { RoleVO } from '@/api/sys/role.types'
import { filter } from 'es-toolkit/compat'

const [configRef, ConfigModal] = useModal({
  type: 'drawer',
  title: '分配角色',
  width: '800px',
  onConfirm: () => submit(),
})
const formData = ref({
  userId: '',
  roleIds: [] as Array<string | number>,
})
const { request: submit } = useApi(userApi.updateAuthRole, formData, {
  tipSuccess: '分配成功',
  tipError: '分配失败',
  onSuccess: () => {
    configRef.value.close()
    formData.value = { userId: '', roleIds: [] }
  },
})

const [data, refresh, loading] = useApi(userApi.getAuthRole, formData)

const [pageNum, pageSize, total] = [ref(1), ref(10), computed(() => data.value?.roles.length || 0)]
const tableData = computed(() =>
  data.value?.roles.slice((pageNum.value - 1) * pageSize.value, pageNum.value * pageSize.value),
)
watch(tableData, (val) => nextTick(() => toggleSelection(filter(val, (item) => item.flag))))

const tableRef = ref()
const handleSelectionChange = (rows: RoleVO[]) => {
  formData.value.roleIds = rows?.map((item) => item.roleId)
}
const toggleSelection = (rows?: RoleVO[], ignoreSelectable?: boolean) => {
  if (rows) rows.forEach((row) => tableRef.value!.toggleRowSelection(row, undefined, ignoreSelectable))
  else tableRef.value!.clearSelection()
}

const open = (rows) => {
  formData.value.userId = rows.userId
  refresh()
  configRef.value.open()
}

defineExpose({ open, close: () => configRef.value.close() })
</script>

<style lang="scss" scoped></style>
