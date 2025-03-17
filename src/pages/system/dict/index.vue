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
        { prop: 'dictId', hidden: true },
        { prop: 'dictName', label: '字典名称', minWidth: 100, fixed: true },
        { prop: 'dictType', label: '字典类型', minWidth: 160 },
        { prop: 'remark', label: '备注', width: 200 },
        { prop: 'createTime', label: '创建时间', minWidth: 180 },
        // { prop: '', label: '' },
      ]"
      :filterColVR="filterColRef"
    >
      <ze-table-column fixed="right" label="操作" width="180px" headerAlign="center">
        <template #default="scope">
          <ze-actions
            :actions="[
              { content: '编辑', text: true, type: 'primary', onClick: () => editRef.open(scope.row) },
              { content: '配置', text: true, type: 'primary', onClick: () => configRef.open(scope.row) },
              { content: '删除', text: true, type: 'primary', confirm: true, onClick: () => handleDel(scope.row) },
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

  <EditModal>
    <ze-form v-model="editForm" :items="editFormItems" :rules="editFormRules"></ze-form>
  </EditModal>

  <VDictConfig ref="configRef" />
</template>

<script setup lang="ts">
import { dictApi } from '@/api/_index'
import type { ZeFormInstance } from '@/components/types/form'
import { toReactive, watchDebounced } from '@vueuse/core'
import VDictConfig from './_views/VDictConfig.vue'

const searchFormRef = ref<ZeFormInstance>()
const [searchForm, searchFormItems] = useForm({
  dictName: { value: '', item: { type: 'text', plh: '字典名称', prefixIcon: 'el-search' } },
  dictType: {
    value: '',
    item: { type: 'select', label: '字典类型', plh: '请选择字典类型', options: [], labelWidth: '70px' },
  },
})
watchDebounced(searchForm, () => refresh(), { deep: true, debounce: 666, maxWait: 3000 })

const [listData, refresh, pagination, loading] = useTable(dictApi.listType, toReactive(searchForm), { immediate: true })

const [tableRef, filterColRef] = [ref(), ref()]
const reset = () => {
  searchFormRef.value?.resetFields()
  nextTick(() => refresh())
}

const isEdit = computed(() => editForm?.value?.dictId)

const [editRef, EditModal] = useModal({
  title: computed(() => `${isEdit.value ? '编辑' : '添加'}字典类型`),
  submitting: computed(() => submitting.value),
  onConfirm: () => fetchEdit(),
})
const [editForm, editFormItems, editFormRules] = useForm({
  dictId: { value: '' },
  dictName: {
    value: '',
    item: { type: 'text', label: '字典名称', plh: '请输入字典名称' },
    rule: [{ required: true, message: '字典名称不能为空', trigger: 'blur' }],
  },
  dictType: {
    value: '',
    item: { type: 'text', label: '字典类型', plh: '请输入字典类型' },
    rule: [{ required: true, message: '字典类型不能为空', trigger: 'blur' }],
  },
  remark: { value: '', item: { type: 'textarea', label: '备注' } },
})

const { request: fetchEdit, loading: submitting } = useApi(
  (data: typeof editForm.value) => (isEdit.value ? dictApi.updateType(data) : dictApi.addType(data)),
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

const handleDel = (row) => dictApi.delType(row).then(() => refresh() && ElMessage.success('删除成功'))

const configRef = ref()
</script>

<style lang="scss" scoped></style>
