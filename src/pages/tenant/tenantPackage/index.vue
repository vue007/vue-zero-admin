<route lang="json5">
{ path: '/tenant/tenantPackage' }
</route>

<template>
  <VPage class="p-24">
    <template #header>
      <ze-form v-model="searchForm" :items="searchFormItems" ref="searchFormRef" inline>
        <ze-form-item>
          <ze-actions
            :actions="[
              { icon: 'el-scale-to-original', tip: t('columns'), onRef: (r) => (filterColRef = r) },
              { icon: 'el-refresh', tip: t('reset'), onClick: reset },
            ]"
          />
        </ze-form-item>

        <ze-form-item class="mla mr0!">
          <ze-actions
            :actions="[
              {
                content: t('deleteSelected'),
                disabled: selectedRows.length === 0,
                onClick: () => handleDelete(selectedRows.map((item) => item.packageId)),
              },
              { content: t('export'), loading: exporting, onClick: handleExport },
              { icon: 'el-plus', content: t('add'), type: 'primary', onClick: () => editRef.open() },
            ]"
          />
        </ze-form-item>
      </ze-form>
    </template>

    <ze-table
      ref="tableRef"
      :data="listData"
      :loading="loading"
      :columns="[
        { type: 'selection', width: 48, fixed: true },
        { prop: 'packageId', label: t('packageId'), hidden: true },
        { prop: 'packageName', label: t('packageName'), minWidth: 180, fixed: true },
        { prop: 'remark', label: t('remark'), minWidth: 220 },
        { prop: 'status', label: t('status'), width: 100 },
        { prop: 'createTime', label: t('createTime'), minWidth: 180 },
      ]"
      :filterColVR="filterColRef"
      @selection-change="selectedRows = $event"
    >
      <template #col-status="{ row }">
        <el-switch
          :model-value="getPackageStatus(row.status)"
          active-value="0"
          inactive-value="1"
          :disabled="!isPackageRowValid(row)"
          :before-change="() => handleStatusBeforeChange(row)"
          @update:model-value="(status) => handleStatusModelUpdate(row, status)"
        />
      </template>

      <ze-table-column fixed="right" :label="t('actions')" width="150px" headerAlign="center">
        <template #default="{ row }">
          <ze-actions
            :options="{ text: true, type: 'primary' }"
            :actions="[
              { content: t('edit'), onClick: () => editRef.open(row) },
              { content: t('delete'), onClick: () => handleDelete([row.packageId]) },
            ]"
          />
        </template>
      </ze-table-column>
    </ze-table>

    <template #content-footer>
      <ze-pagination class="ml-a" v-model="pagination" />
    </template>
  </VPage>

  <EditModal width="680px" top="5vh">
    <div v-loading="editorLoading">
      <ze-form v-model="editForm" :items="editFormItems" :rules="editFormRules" label-width="100px">
        <template #item-menuIds>
          <ze-form-item class="wfull" :label="t('menuPermissions')" prop="menuIds">
            <div class="wfull">
              <div class="mb-10 flex flex-wrap gap-x-16">
                <el-checkbox v-model="menuExpand" @change="handleMenuExpand">{{ t('expandCollapse') }}</el-checkbox>
                <el-checkbox v-model="menuNodeAll" @change="handleMenuNodeAll">{{ t('selectAll') }}</el-checkbox>
                <el-checkbox v-model="editForm.menuCheckStrictly" @change="setMenuIds">
                  {{ t('parentChildLink') }}
                </el-checkbox>
              </div>
              <el-tree
                ref="menuRef"
                class="min-h-300 max-h-45vh wfull of-auto border border-solid border-gray-200 p-10"
                :check-strictly="!editForm.menuCheckStrictly"
                :data="menuTreeData"
                :empty-text="t('emptyMenu')"
                node-key="id"
                :props="{ label: 'label', children: 'children' }"
                show-checkbox
                @check-change="setMenuIds"
              />
            </div>
          </ze-form-item>
        </template>
      </ze-form>
    </div>
  </EditModal>
</template>

<script setup lang="ts">
import { menuApi, tenantPackageApi } from '@/api/_index'
import type { MenuTreeOption } from '@/api/sys/menu.type'
import type { TenantPkgForm, TenantPkgQuery, TenantPkgVO } from '@/api/sys/tenant-package.types'
import type { ZeFormInstance } from '@/components/types/form'
import { downloadBlob } from '@/utils/download'
import { watchDebounced } from '@vueuse/core'

const { t } = useI18nLocal()
const { sys_normal_disable } = toRefs(useDict('sys_normal_disable'))

const searchFormRef = ref<ZeFormInstance>()
const [searchForm, searchFormItems] = useForm({
  packageName: { value: '', item: { type: 'text', plh: t('packageName'), prefixIcon: 'el-search' } },
  status: {
    value: '',
    item: { type: 'select', label: t('status'), options: sys_normal_disable, labelWidth: '50px' },
  },
})
watchDebounced(searchForm, () => refresh(), { deep: true, debounce: 666, maxWait: 3000 })

const [listData, refresh, pagination, loading] = useTable<TenantPkgQuery, TenantPkgVO>(
  tenantPackageApi.listTenantPackage,
  searchForm,
  { immediate: true },
)

const [tableRef, filterColRef] = [ref(), ref()]
const selectedRows = ref<TenantPkgVO[]>([])
const reset = () => {
  searchFormRef.value?.resetFields()
  tableRef.value?.clearSelection()
  nextTick(() => refresh())
}

const menuRef = ref<any>()
const menuTreeData = ref<MenuTreeOption[]>([])
const menuExpand = ref(false)
const menuNodeAll = ref(false)
const menuTreeReady = ref(false)

const [editForm, editFormItems, editFormRules] = useForm({
  packageId: { value: undefined as string | number | undefined },
  packageName: {
    value: '',
    item: { type: 'text', label: t('packageName'), plh: t('packageNamePlaceholder') },
    rule: [{ required: true, message: t('packageNameRequired'), trigger: 'blur' }],
  },
  menuIds: { value: [] as Array<string | number>, item: {} },
  menuCheckStrictly: { value: true },
  status: { value: '0' },
  remark: {
    value: '',
    item: { type: 'textarea', label: t('remark'), plh: t('remarkPlaceholder'), rows: 3 },
  },
})

const applyMenuTree = (menus: MenuTreeOption[], checkedKeys: Array<string | number> = []) => {
  menuTreeData.value = menus
  menuTreeReady.value = true
  editForm.value.menuIds = [...checkedKeys]
  nextTick(() => menuRef.value?.setCheckedKeys(checkedKeys))
}

const [, loadAddMenuTree, addMenuTreeLoading] = useApi(menuApi.treeselect, {}, {
  onSuccess: (res) => applyMenuTree(res?.apiData || []),
  tipError: computed(() => t('menuLoadFailed')),
})

const [, loadPackageMenuTree, packageMenuTreeLoading] = useApi(
  ({ packageId }: { packageId: string | number }) => menuApi.tenantPackageMenuTreeselect(packageId),
  undefined,
  {
    onSuccess: (res) => applyMenuTree(res?.apiData?.menus || [], res?.apiData?.checkedKeys || []),
    tipError: computed(() => t('menuLoadFailed')),
  },
)

const [, loadPackageDetail, detailLoading] = useApi(
  ({ packageId }: { packageId: string | number }) => tenantPackageApi.getTenantPackage(packageId),
  undefined,
  {
    onSuccess: (res) => {
      const data = res?.apiData
      if (!data) return
      Object.assign(editForm.value, {
        packageId: data.packageId,
        packageName: data.packageName,
        remark: data.remark,
        menuCheckStrictly: data.menuCheckStrictly ?? true,
        status: data.status,
      })
    },
    tipError: computed(() => t('detailLoadFailed')),
  },
)

const editorLoading = computed(
  () => addMenuTreeLoading.value || packageMenuTreeLoading.value || detailLoading.value,
)

const isEdit = computed(() => Boolean(editForm.value.packageId))
const { request: fetchEdit, loading: submitting } = useApi<TenantPkgForm, void>(
  (data) => (isEdit.value ? tenantPackageApi.updateTenantPackage(data) : tenantPackageApi.addTenantPackage(data)),
  editForm,
  {
    onSuccess: () => {
      editRef.value.close()
      selectedRows.value = []
      refresh()
    },
    tipSuccess: computed(() => (isEdit.value ? t('saveSuccess') : t('addSuccess'))),
    tipError: computed(() => (isEdit.value ? t('saveFailed') : t('addFailed'))),
  },
)

const getMenuAllCheckedKeys = (): Array<string | number> => {
  const checkedKeys = menuRef.value?.getCheckedKeys() || []
  const halfCheckedKeys = menuRef.value?.getHalfCheckedKeys() || []
  return [...new Set<string | number>([...checkedKeys, ...halfCheckedKeys])]
}

const setMenuIds = () => {
  editForm.value.menuIds = getMenuAllCheckedKeys()
}

const submitForm = () => {
  if (!menuTreeReady.value) {
    ElMessage.warning(t('menuLoadRequired'))
    return
  }
  setMenuIds()
  fetchEdit()
}

const handleEditorOpen = (row?: TenantPkgVO) => {
  menuTreeData.value = []
  menuTreeReady.value = false
  menuExpand.value = false
  menuNodeAll.value = false
  menuRef.value?.setCheckedKeys([])
  if (row?.packageId !== undefined) {
    loadPackageDetail({ packageId: row.packageId })
    loadPackageMenuTree({ packageId: row.packageId })
  } else {
    loadAddMenuTree()
  }
}

const [editRef, EditModal] = useModal({
  title: computed(() => (isEdit.value ? t('editTitle') : t('addTitle'))),
  submitting: computed(() => submitting.value || editorLoading.value),
  onOpen: handleEditorOpen,
  onConfirm: submitForm,
})

const getAllMenuIds = (nodes: MenuTreeOption[]): Array<string | number> =>
  nodes.flatMap((node) => [node.id, ...getAllMenuIds(node.children || [])])

const handleMenuExpand = (expanded: string | number | boolean) => {
  const walk = (nodes: MenuTreeOption[]) => {
    nodes.forEach((node) => {
      const treeNode = menuRef.value?.getNode(node.id)
      if (treeNode) treeNode.expanded = Boolean(expanded)
      walk(node.children || [])
    })
  }
  walk(menuTreeData.value)
}

const handleMenuNodeAll = (checked: string | number | boolean) => {
  menuRef.value?.setCheckedKeys(checked ? getAllMenuIds(menuTreeData.value) : [])
  setMenuIds()
}

const getPackageStatus = (status: unknown): '0' | '1' => (String(status) === '0' ? '0' : '1')

const isPackageRowValid = (row?: Partial<TenantPkgVO>): row is TenantPkgVO =>
  row?.packageId !== undefined && row.packageId !== null && Boolean(row.packageName?.trim())

const handleStatusModelUpdate = (row: TenantPkgVO, status: string | number | boolean) => {
  if (isPackageRowValid(row) && (status === '0' || status === '1')) row.status = status
}

const handleStatusBeforeChange = async (row: TenantPkgVO): Promise<boolean> => {
  if (!isPackageRowValid(row)) {
    ElMessage.warning(t('invalidPackageRow'))
    return false
  }

  const changedStatus = getPackageStatus(row.status) === '0' ? '1' : '0'
  const action = changedStatus === '0' ? t('enable') : t('disable')
  try {
    await ElMessageBox.confirm(t('statusConfirm', { action, name: row.packageName }), t('confirmTitle'), {
      type: 'warning',
    })
    await tenantPackageApi.changePackageStatus(row.packageId, changedStatus)
    ElMessage.success(t('statusSuccess', { action }))
    return true
  } catch {
    return false
  }
}

const [, deletePackages] = useApi(tenantPackageApi.delTenantPackage, [], {
  onSuccess: () => {
    selectedRows.value = []
    tableRef.value?.clearSelection()
    refresh()
  },
  tipSuccess: computed(() => t('deleteSuccess')),
  tipError: computed(() => t('deleteFailed')),
})

const handleDelete = async (packageIds: Array<string | number>) => {
  if (!packageIds.length) return
  try {
    await ElMessageBox.confirm(t('deleteConfirm', { ids: packageIds.join(', ') }), t('confirmTitle'), {
      type: 'warning',
    })
    await deletePackages(packageIds)
  } catch {
    // 取消删除或接口失败时保持当前列表。
  }
}

const exporting = ref(false)
const handleExport = async () => {
  exporting.value = true
  try {
    downloadBlob(await tenantPackageApi.exportTenantPackage(searchForm.value), `tenant-package-${Date.now()}.xlsx`)
    ElMessage.success(t('exportSuccess'))
  } catch {
    ElMessage.error(t('exportFailed'))
  } finally {
    exporting.value = false
  }
}
</script>

<style lang="scss" scoped></style>

<i18n lang="yaml">
en:
  columns: 'Show/hide columns'
  reset: 'Reset'
  add: 'Add'
  edit: 'Edit'
  delete: 'Delete'
  deleteSelected: 'Delete selected'
  export: 'Export'
  packageId: 'Package ID'
  packageName: 'Package name'
  packageNamePlaceholder: 'Enter a package name'
  packageNameRequired: 'Package name is required'
  remark: 'Remarks'
  remarkPlaceholder: 'Enter remarks'
  status: 'Status'
  createTime: 'Created at'
  actions: 'Actions'
  menuPermissions: 'Menu access'
  expandCollapse: 'Expand/collapse'
  selectAll: 'Select all/none'
  parentChildLink: 'Link parent and child'
  emptyMenu: 'No menus available'
  addTitle: 'Add tenant package'
  editTitle: 'Edit tenant package'
  confirmTitle: 'Confirmation'
  enable: 'enable'
  disable: 'disable'
  statusConfirm: 'Are you sure you want to {action} package "{name}"?'
  statusSuccess: 'Package {action}d successfully'
  invalidPackageRow: 'Invalid package data. Refresh the list and try again.'
  addSuccess: 'Package added successfully'
  addFailed: 'Failed to add package'
  saveSuccess: 'Package saved successfully'
  saveFailed: 'Failed to save package'
  deleteConfirm: 'Delete tenant package(s) {ids}? Packages currently used by tenants cannot be deleted.'
  deleteSuccess: 'Package deleted successfully'
  deleteFailed: 'Failed to delete package'
  exportSuccess: 'Exported successfully'
  exportFailed: 'Failed to export'
  menuLoadFailed: 'Failed to load menu permissions'
  menuLoadRequired: 'Menu permissions are not ready yet'
  detailLoadFailed: 'Failed to load package details'
zh-CN:
  columns: '显示/隐藏列'
  reset: '重置'
  add: '新增'
  edit: '编辑'
  delete: '删除'
  deleteSelected: '批量删除'
  export: '导出'
  packageId: '套餐编号'
  packageName: '套餐名称'
  packageNamePlaceholder: '请输入套餐名称'
  packageNameRequired: '套餐名称不能为空'
  remark: '备注'
  remarkPlaceholder: '请输入备注'
  status: '状态'
  createTime: '创建时间'
  actions: '操作'
  menuPermissions: '关联菜单'
  expandCollapse: '展开/折叠'
  selectAll: '全选/全不选'
  parentChildLink: '父子联动'
  emptyMenu: '暂无可选菜单'
  addTitle: '新增租户套餐'
  editTitle: '编辑租户套餐'
  confirmTitle: '操作确认'
  enable: '启用'
  disable: '停用'
  statusConfirm: '确认要{action}套餐“{name}”吗？'
  statusSuccess: '{action}成功'
  invalidPackageRow: '套餐数据不完整，请刷新列表后重试'
  addSuccess: '新增成功'
  addFailed: '新增失败'
  saveSuccess: '保存成功'
  saveFailed: '保存失败'
  deleteConfirm: '确认删除租户套餐编号“{ids}”吗？已被租户使用的套餐不能删除。'
  deleteSuccess: '删除成功'
  deleteFailed: '删除失败'
  exportSuccess: '导出成功'
  exportFailed: '导出失败'
  menuLoadFailed: '菜单权限加载失败'
  menuLoadRequired: '菜单权限尚未加载完成'
  detailLoadFailed: '套餐详情加载失败'
</i18n>
