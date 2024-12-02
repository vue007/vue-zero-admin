<template>
  <VPage>
    <template #header>
      <ze-form>
        <ze-form-item></ze-form-item>
        <ze-form-item>
          <el-button @click="refresh">search</el-button>
          <el-button ref="filterColRef">filter columns</el-button>
        </ze-form-item>
      </ze-form>
    </template>

    <ze-table
      :data="tableData"
      :columns="[
        { type: 'index', label: $t('base.index'), align: 'center', width: '60px', fixed: 'left' },
        { prop: 'id', hidden: true },
        { prop: 'name', label: $t('doc.col.name'), minWidth: 150, fixed: true },
        { prop: 'age', label: $t('doc.col.age'), minWidth: 120, headerAlign: 'center', align: 'center' },
        { prop: 'sex', label: $t('doc.col.sex'), minWidth: 120 },
        { prop: 'hasPassion', label: $t('doc.col.hasPassion'), minWidth: 120 },
        { prop: 'city', label: $t('doc.col.city'), minWidth: 120, headerAlign: 'center', align: 'center' },
        { prop: 'startDate', label: $t('doc.col.startDate'), minWidth: 160 },
        { prop: 'createdTime', label: $t('doc.col.createdTime'), minWidth: 160 },
      ]"
      :filterColVR="filterColRef"
    >
      <template #col-hasPassion="scope">
        <el-switch :modelValue="scope.row.hasPassion" @update:modelValue="scope.row.hasPassion = $event" />
      </template>

      <template #after-columns>
        <el-table-column min-width="160">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="() => editDlgRef.open(scope.row)">
              {{ $t('base.edit') }}
            </el-button>
            <el-button link type="primary" size="small">{{ $t('base.delete') }}</el-button>
          </template>
        </el-table-column>
      </template>
    </ze-table>

    <template #content-footer>
      <ze-pagination class="mt-10" v-model="pagination" />
    </template>
  </VPage>

  <EditDialog>
    <ze-form v-model="userForm" :items="userFormItems" :rules="userFormRules"></ze-form>
  </EditDialog>
</template>

<script setup lang="ts">
import { userApi } from '@/api/_index'
import type { UserForm } from '@/api/user.type'
import { toReactive } from '@vueuse/core'

const searchForm = reactive({ pageNo: 1, pageSize: 10 })

const {
  rows: tableData,
  request: refresh,
  pagination,
  loading,
} = useTable(userApi.list, searchForm, { immediate: true })
// const [tableData, refresh, pagination, loading] = useTable(userApi.list, searchForm, { immediate: true })

const filterColRef = ref()
const isEdit = computed(() => userForm?.value?.id)
const formTitle = computed(() => (isEdit?.value ? '编辑' : '新增'))

const SEX_ENUM_LIST = [
  { label: '男', value: 1 },
  { label: '女', value: 0 },
]
const REGION_ENUM_LIST = [
  { label: '罗湖区', value: '440303' },
  { label: '福田区', value: '440304' },
  { label: '南山区', value: '440305' },
]
const checkAge = (rule, value, cb) => {
  if (!value) cb(new Error('谁还不是个宝宝呢'))
  if (value < 18) cb(new Error('你还未满十八岁?'))
  if (value > 120) cb(new Error('现在知道为什么急救电话是120了吧'))
  cb() // DO NOT MISSING AT THE END
}

const [userForm, userFormItems, userFormRules] = useFormItems({
  name: {
    value: '',
    item: { type: 'text', label: '名字' },
    rule: [{ required: true, message: '必填' }],
  },
  age: {
    value: 0,
    item: { type: 'number', label: '年龄' },
    rule: [{ validator: checkAge }],
  },
  sex: {
    value: 0,
    item: { type: 'radio', enumList: SEX_ENUM_LIST, label: '性别' },
    rule: [],
  },
  hasPassion: {
    value: false,
    item: { type: 'switch', label: '是否热爱' },
    rule: [],
  },
  city: {
    value: '',
    item: { type: 'select', enumList: REGION_ENUM_LIST, label: '城市' },
    rule: [{ required: true, message: '请选择' }],
  },
  startDate: {
    value: '',
    item: { type: 'date', label: '开始日期' },
    rule: [],
  },
})

// 同时支持 对象 和 数组 析构
// const [,fetchEdit] = useApi(
const { request: fetchEdit } = useApi(
  (data: UserForm) => (isEdit.value ? userApi.update(data) : userApi.create(data)),
  toReactive(userForm),
  {
    onSuccess: () => editDlgRef.value.close(),
    tipSuccess: computed(() => (isEdit.value ? '保存成功' : '新增成功')),
    tipError: computed(() => (isEdit.value ? '保存失败' : '新增失败')),
  },
)

// 同时支持 对象 和 数组 析构
// const { reference: editDlgRef, component: EditDialog } = useModal()
const [editDlgRef, EditDialog] = useModal({ title: formTitle.value, onConfirm: () => fetchEdit() })
</script>

<style lang="scss" scoped></style>
