<template>
  <ConfigModal>
    <VPage class="p-24">
      <template #header>
        <ze-form v-model="searchForm" ref="searchFormRef" inline>
          <ze-form-item class="mla mr0!">
            <ze-actions
              :actions="[
                {
                  icon: 'el-plus',
                  content: '新增',
                  type: 'primary',
                  onClick: () => editRef.open({ dictType: searchForm?.dictType + '' }),
                },
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
          { prop: 'dictId', hidden: true },
          { prop: 'dictCode', label: '字典编码', minWidth: 80, fixed: true },
          { prop: 'dictLabel', label: '字典标签', minWidth: 100 },
          { prop: 'dictValue', label: '字典键值', minWidth: 100 },
          { prop: 'remark', label: '备注', width: 100 },
          { prop: 'createTime', label: '创建时间', minWidth: 180 },
          // { prop: '', label: '' },
        ]"
        :filterColVR="filterColRef"
      >
        <template #col-dictLabel="{ row }">
          <VDictTag
            :options="[{ label: row.dictLabel, value: row.dictValue, elTagType: row.listClass }]"
            :value="row.dictValue"
          />
        </template>
        <ze-table-column fixed="right" label="操作" width="140px" headerAlign="center">
          <template #default="{ row }">
            <ze-actions
              :options="{ text: true, type: 'primary' }"
              :actions="[
                { content: '修改', onClick: () => editRef.open(row) },
                { content: '删除', confirm: true, onClick: () => handleDel([row.dictCode]) },
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
  </ConfigModal>

  <EditModal>
    <ze-form v-model="editForm" :items="editFormItems" :rules="editFormRules"></ze-form>
  </EditModal>
</template>

<script setup lang="ts">
import { dictApi } from '@/api/_index'
import type { ZeFormInstance } from '@/components/types/form'
import VDictTag from '@/pages/_views/VDictTag.vue'
import type { TagInstance } from 'element-plus'

const TAG_TYPES = [
  { label: 'primary', value: 'primary' },
  { label: 'success', value: 'success' },
  { label: 'info', value: 'info' },
  { label: 'warning', value: 'warning' },
  { label: 'danger', value: 'danger' },
]

const [configRef, ConfigModal] = useModal({
  type: 'drawer',
  title: '配置字典项',
  width: '800px',
  onClose: () => {
    dictId.value = ''
  },
})
const dictId = ref()

const searchFormRef = ref<ZeFormInstance>()
const searchForm = reactive({
  dictName: '',
  dictType: '',
  dictLabel: '',
})
// watchDebounced(searchForm, () => refresh(), { deep: true, debounce: 666, maxWait: 3000 })

const [typeData, fetchType] = useApi(dictApi.getType, toRef({ dictId }))
const [listData, refresh, pagination, loading] = useTable(dictApi.listData, searchForm)
watch(
  typeData,
  () => {
    searchForm.dictType = typeData.value?.dictType + ''
    refresh()
  },
  { deep: true },
)

const [tableRef, filterColRef] = [ref(), ref()]

const isEdit = computed(() => editForm?.value?.dictCode)

const [editRef, EditModal] = useModal({
  title: computed(() => `${isEdit.value ? '编辑' : '添加'}字典类型`),
  submitting: computed(() => submitting.value),
  onConfirm: () => fetchEdit(),
})
const [editForm, editFormItems, editFormRules] = useForm({
  dictCode: { value: '' },
  dictType: {
    value: '',
    item: { type: 'text', label: '字典类型', plh: '请输入字典类型', readonly: true },
    rule: [{ required: true, message: '字典类型不能为空', trigger: 'blur' }],
  },
  dictLabel: {
    value: '',
    item: { type: 'text', label: '数据标签', plh: '请输入数据标签' },
    rule: [{ required: true, message: '数据标签不能为空', trigger: 'blur' }],
  },
  dictValue: {
    value: '',
    item: { type: 'text', label: '数据键值', plh: '请输入数据键值' },
    rule: [{ required: true, message: '数据键值不能为空', trigger: 'blur' }],
  },
  cssClass: { value: '', item: { type: 'text', label: '样式属性', plh: '请输入样式属性' } },
  dictSort: { value: 0, item: { type: 'number', label: '显示排序', plh: '请输入显示排序' } },
  listClass: {
    value: '' as TagInstance['type'],
    item: { type: 'radio', label: '回显样式', plh: '请输入回显样式', options: TAG_TYPES, isButton: true },
  },
  remark: { value: '', item: { type: 'textarea', label: '备注' } },
})

const { request: fetchEdit, loading: submitting } = useApi(
  (data: typeof editForm.value) => (isEdit.value ? dictApi.updateData(data) : dictApi.addData(data)),
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

const [, handleDel] = useApi(dictApi.delData, [], { onSuccess: () => refresh(), tipSuccess: '删除成功' })
const open = (row) => {
  dictId.value = row.dictId
  fetchType()
  configRef.value.open(row)
}

defineExpose({ open, close: () => configRef.value.close() })
</script>

<style lang="scss" scoped></style>
