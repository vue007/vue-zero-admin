<template>
  <VPage class="p-24">
    <template #header>
      <ze-form v-model="searchForm" :items="searchFormItems" ref="searchFormRef" inline>
        <ze-form-item>
          <ze-actions
            :actions="[
              { icon: 'el-back', tip: '返回文件列表', onClick: () => router.push('/system/oss') },
              { icon: 'el-scale-to-original', tip: '显示/隐藏列', onRef: (r) => (filterColRef = r) },
              { icon: 'el-refresh', tip: '重置', onClick: reset },
            ]"
          />
        </ze-form-item>
        <ze-form-item class="mla mr0!">
          <ze-actions
            :actions="[
              { content: '腾讯云 COS', type: 'primary', plain: true, onClick: openTencentCosConfig },
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
        { prop: 'ossConfigId', label: '主键', hidden: true },
        { prop: 'configKey', label: '配置 Key', minWidth: 120, fixed: true },
        { prop: 'endpoint', label: '访问站点', minWidth: 180 },
        { prop: 'domain', label: '自定义域名', minWidth: 180 },
        { prop: 'bucketName', label: '桶名称', minWidth: 130 },
        { prop: 'prefix', label: '前缀', minWidth: 100 },
        { prop: 'region', label: '域', minWidth: 100 },
        { prop: 'accessPolicy', label: '桶权限', width: 100 },
        { prop: 'status', label: '默认配置', width: 100 },
      ]"
      :filterColVR="filterColRef"
    >
      <template #col-accessPolicy="{ row }">{{ accessPolicyLabel(row.accessPolicy) }}</template>
      <template #col-status="{ row }">
        <el-switch
          v-model="row.status"
          active-value="0"
          inactive-value="1"
          @click="() => handleStatusChange(row)"
        />
      </template>
      <ze-table-column fixed="right" label="操作" width="150px" headerAlign="center">
        <template #default="{ row }">
          <ze-actions
            :options="{ text: true, type: 'primary' }"
            :actions="[
              { content: '编辑', onClick: () => editRef.open(row) },
              { content: '删除', confirm: true, onClick: () => handleDel([row.ossConfigId]) },
            ]"
          />
        </template>
      </ze-table-column>
    </ze-table>

    <template #content-footer><ze-pagination class="ml-a" v-model="pagination" /></template>
  </VPage>

  <EditModal width="720px" top="5vh">
    <ze-form v-model="editForm" :items="editFormItems" :rules="editFormRules" />
  </EditModal>
</template>

<script setup lang="ts">
import { ossApi } from '@/api/_index'
import type { OssConfigQuery, OssConfigVO } from '@/api/sys/oss.types'
import type { ZeFormInstance } from '@/components/types/form'
import { toReactive, watchDebounced } from '@vueuse/core'
import { merge } from 'es-toolkit'

const router = useRouter()
const { sys_yes_no } = toRefs(useDict('sys_yes_no'))
const accessPolicyOptions = [
  { label: '私有', value: '0' },
  { label: '公开', value: '1' },
  { label: '自定义', value: '2' },
]
const accessPolicyLabel = (value: string) => accessPolicyOptions.find((item) => item.value === value)?.label || value

const searchFormRef = ref<ZeFormInstance>()
const [searchForm, searchFormItems] = useForm({
  configKey: { value: '', item: { type: 'text', plh: '配置 Key', prefixIcon: 'el-search' } },
  bucketName: { value: '', item: { type: 'text', plh: '桶名称' } },
  status: {
    value: '',
    item: {
      type: 'select',
      label: '默认配置',
      labelWidth: '70px',
      options: [
        { label: '是', value: '0' },
        { label: '否', value: '1' },
      ],
    },
  },
})
watchDebounced(searchForm, () => refresh(), { deep: true, debounce: 666, maxWait: 3000 })

const [listData, refresh, pagination, loading] = useTable<OssConfigQuery, OssConfigVO>(
  ossApi.listOssConfig,
  toReactive(searchForm),
  { immediate: true },
)
const [tableRef, filterColRef] = [ref(), ref()]
const reset = () => (searchFormRef.value?.resetFields(), nextTick(() => refresh()))

const isEdit = computed(() => Boolean(editForm.value.ossConfigId))
const [configDetail, fetchConfigDetail] = useApi<Pick<OssConfigVO, 'ossConfigId'>, OssConfigVO>(ossApi.getOssConfig)
watch(configDetail, () => merge(editForm.value, configDetail.value || {}), { deep: true })

const [editRef, EditModal] = useModal({
  title: computed(() => `${isEdit.value ? '编辑' : '添加'}对象存储配置`),
  submitting: computed(() => submitting.value),
  onOpen: (row?: OssConfigVO) => row?.ossConfigId && fetchConfigDetail({ ossConfigId: row.ossConfigId }),
  onConfirm: () => fetchEdit(),
})

const validateSecretKey = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (!isEdit.value && !value) callback(new Error('Secret Key 不能为空'))
  else callback()
}

const validateAccessKey = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (!isEdit.value && !value) callback(new Error('Access Key / SecretId 不能为空'))
  else if (value && editForm.value.configKey === 'qcloud' && !value.trim().startsWith('AKID')) {
    callback(new Error('请填写腾讯云 API 密钥 SecretId（通常以 AKID 开头），不要填写 APPID'))
  }
  else callback()
}

const [editForm, editFormItems, editFormRules] = useForm({
  ossConfigId: { value: undefined as number | string | undefined },
  configKey: {
    value: '',
    item: { type: 'text', label: '配置 Key', plh: '请输入配置 Key' },
    rule: [{ required: true, message: '配置 Key 不能为空', trigger: 'blur' }],
  },
  accessKey: {
    value: '',
    item: { type: 'text', label: 'SecretId', plh: '腾讯云 API 密钥，通常以 AKID 开头；编辑留空表示保持原密钥' },
    rule: [{ validator: validateAccessKey, trigger: 'blur' }],
  },
  secretKey: {
    value: '',
    item: { type: 'password', label: 'Secret Key', plh: '新增必填；编辑留空表示保持原密钥', showPassword: true },
    rule: [{ validator: validateSecretKey, trigger: 'blur' }],
  },
  bucketName: {
    value: '',
    item: { type: 'text', label: '桶名称', plh: '腾讯云示例：example-1250000000' },
    rule: [{ required: true, message: '桶名称不能为空', trigger: 'blur' }],
  },
  endpoint: {
    value: '',
    item: { type: 'text', label: '访问站点', plh: '示例：cos.ap-guangzhou.myqcloud.com（不含协议）' },
    rule: [{ required: true, message: '访问站点不能为空', trigger: 'blur' }],
  },
  domain: { value: '', item: { type: 'text', label: '自定义域名' } },
  prefix: { value: '', item: { type: 'text', label: '前缀' } },
  region: { value: '', item: { type: 'text', label: '地域', plh: '腾讯云示例：ap-guangzhou' } },
  isHttps: { value: 'Y', item: { type: 'radio', label: 'HTTPS', options: sys_yes_no } },
  accessPolicy: {
    value: '0',
    item: { type: 'radio', label: '桶权限', options: accessPolicyOptions },
    rule: [{ required: true, message: '桶权限不能为空', trigger: 'change' }],
  },
  status: { value: '1', item: { hidden: true } },
  ext1: { value: '', item: { type: 'text', label: '扩展字段' } },
  remark: { value: '', item: { type: 'textarea', label: '备注' } },
})

const openTencentCosConfig = () =>
  editRef.value.open({
    configKey: 'qcloud',
    accessKey: '',
    secretKey: '',
    bucketName: '',
    endpoint: 'cos.ap-guangzhou.myqcloud.com',
    domain: '',
    prefix: 'upload',
    region: 'ap-guangzhou',
    isHttps: 'Y',
    accessPolicy: '0',
    status: '1',
    ext1: '',
    remark: '腾讯云 COS（S3 兼容）',
  })

watch(
  () => editForm.value.region,
  (region, oldRegion) => {
    if (
      editForm.value.configKey === 'qcloud' &&
      region &&
      (!editForm.value.endpoint || editForm.value.endpoint === `cos.${oldRegion}.myqcloud.com`)
    ) {
      editForm.value.endpoint = `cos.${region}.myqcloud.com`
    }
  },
)

const { request: fetchEdit, loading: submitting } = useApi(
  (data: typeof editForm.value) => (isEdit.value ? ossApi.updateOssConfig(data) : ossApi.addOssConfig(data)),
  editForm,
  {
    onSuccess: () => (editRef.value.close(), refresh()),
    tipSuccess: computed(() => (isEdit.value ? '保存成功' : '新增成功')),
    tipError: computed(() => (isEdit.value ? '保存失败' : '新增失败')),
  },
)

const handleStatusChange = (row: OssConfigVO) => {
  const cancel = () => (row.status = row.status === '0' ? '1' : '0')
  if (row.status !== '0') {
    cancel()
    ElMessage.info('默认配置不能直接取消，请将其他配置设为默认')
    return
  }
  ElMessageBox.confirm(`确定要将配置 ${row.configKey} 设为默认吗？`, { type: 'warning' })
    .then(() =>
      ossApi
        .changeOssConfigStatus({ ossConfigId: row.ossConfigId, status: row.status, configKey: row.configKey })
        .then(() => (ElMessage.success('修改成功'), refresh()))
        .catch(cancel),
    )
    .catch(cancel)
}

const [, handleDel] = useApi(ossApi.delOssConfig, [], {
  onSuccess: () => refresh(),
  tipSuccess: '删除成功',
  tipError: '删除失败',
})
</script>

<style lang="scss" scoped></style>
