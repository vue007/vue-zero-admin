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
            :actions="[
              { icon: 'el-refresh', content: '刷新缓存', onClick: handleRefreshCache },
              { icon: 'el-plus', content: '新增', type: 'primary', onClick: () => editRef.open() },
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
        { prop: 'configId', label: '参数编号', hidden: true },
        { prop: 'configName', label: '参数名称', minWidth: 150, fixed: true },
        { prop: 'configKey', label: '参数键名', minWidth: 180 },
        { prop: 'configValue', label: '参数键值', minWidth: 180 },
        { prop: 'configType', label: '系统内置', width: 100 },
        { prop: 'remark', label: '备注', minWidth: 180 },
        { prop: 'createTime', label: '创建时间', minWidth: 180 },
      ]"
      :filterColVR="filterColRef"
    >
      <template #col-configValue="{ row }">
        <ze-input
          v-model="row.configValue"
          placeholder="请输入参数键值"
          @change="() => handleInlineSave(row)"
        />
      </template>

      <template #col-configType="{ row }">
        <VDictTag :options="sys_yes_no" :value="row.configType" />
      </template>

      <ze-table-column fixed="right" label="操作" width="150px" headerAlign="center">
        <template #default="{ row }">
          <ze-actions
            :options="{ text: true, type: 'primary' }"
            :actions="[
              { content: '编辑', onClick: () => editRef.open(row) },
              { content: '删除', confirm: true, onClick: () => handleDel([row.configId]) },
            ]"
          />
        </template>
      </ze-table-column>
    </ze-table>

    <template #content-footer>
      <ze-pagination class="ml-a" v-model="pagination" />
    </template>
  </VPage>

  <EditModal>
    <ze-form v-model="editForm" :items="editFormItems" :rules="editFormRules" />
  </EditModal>
</template>

<script setup lang="ts">
import { configApi } from '@/api/_index'
import type { ConfigQuery, ConfigVO } from '@/api/sys/config.types'
import type { ZeFormInstance } from '@/components/types/form'
import { toReactive, watchDebounced } from '@vueuse/core'
import { merge } from 'es-toolkit'

const { sys_yes_no } = toRefs(useDict('sys_yes_no'))

const searchFormRef = ref<ZeFormInstance>()
const [searchForm, searchFormItems] = useForm({
  configName: { value: '', item: { type: 'text', plh: '参数名称', prefixIcon: 'el-search' } },
  configKey: { value: '', item: { type: 'text', plh: '参数键名' } },
  configType: {
    value: '',
    item: { type: 'select', label: '系统内置', options: sys_yes_no, labelWidth: '70px' },
  },
})
watchDebounced(searchForm, () => refresh(), { deep: true, debounce: 666, maxWait: 3000 })

const [listData, refresh, pagination, loading] = useTable<ConfigQuery, ConfigVO>(
  configApi.listConfig,
  toReactive(searchForm),
  { immediate: true },
)

const [tableRef, filterColRef] = [ref(), ref()]
const reset = () => {
  searchFormRef.value?.resetFields()
  nextTick(() => refresh())
}

const isEdit = computed(() => Boolean(editForm.value.configId))
const [configDetail, refreshConfigDetail] = useApi<Pick<ConfigVO, 'configId'>, ConfigVO>(configApi.getConfig)
watch(configDetail, () => merge(editForm.value, configDetail.value || {}), { deep: true })

const [editRef, EditModal] = useModal({
  title: computed(() => `${isEdit.value ? '编辑' : '添加'}参数`),
  submitting: computed(() => submitting.value),
  onOpen: (row?: ConfigVO) => row && refreshConfigDetail({ configId: row.configId }),
  onConfirm: () => fetchEdit(),
})

const [editForm, editFormItems, editFormRules] = useForm({
  configId: { value: undefined as number | string | undefined },
  configName: {
    value: '',
    item: { type: 'text', label: '参数名称', plh: '请输入参数名称' },
    rule: [{ required: true, message: '参数名称不能为空', trigger: 'blur' }],
  },
  configKey: {
    value: '',
    item: { type: 'text', label: '参数键名', plh: '请输入参数键名' },
    rule: [{ required: true, message: '参数键名不能为空', trigger: 'blur' }],
  },
  configValue: {
    value: '',
    item: { type: 'textarea', label: '参数键值', plh: '请输入参数键值' },
    rule: [{ required: true, message: '参数键值不能为空', trigger: 'blur' }],
  },
  configType: {
    value: 'Y',
    item: { type: 'radio', label: '系统内置', options: sys_yes_no },
  },
  remark: {
    value: '',
    item: { type: 'textarea', label: '备注', plh: '请输入备注' },
  },
})

const { request: fetchEdit, loading: submitting } = useApi(
  (data: typeof editForm.value) => (isEdit.value ? configApi.updateConfig(data) : configApi.addConfig(data)),
  editForm,
  {
    onSuccess: () => (editRef.value.close(), refresh()),
    tipSuccess: computed(() => (isEdit.value ? '保存成功' : '新增成功')),
    tipError: computed(() => (isEdit.value ? '保存失败' : '新增失败')),
  },
)

const [, saveConfigByKey] = useApi(configApi.updateConfigByKey, undefined, {
  tipSuccess: '修改成功',
  tipError: '修改失败',
})
const handleInlineSave = (row: ConfigVO) =>
  saveConfigByKey({ configKey: row.configKey, configValue: row.configValue })

const [, handleDel] = useApi(configApi.delConfig, [], {
  onSuccess: () => refresh(),
  tipSuccess: '删除成功',
  tipError: '删除失败',
})

const [, refreshConfigCache] = useApi(configApi.refreshCache, undefined, {
  tipSuccess: '刷新缓存成功',
  tipError: '刷新缓存失败',
})
const handleRefreshCache = () => refreshConfigCache()
</script>

<style lang="scss" scoped></style>
