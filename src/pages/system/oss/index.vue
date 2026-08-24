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
          <el-upload :show-file-list="false" :http-request="handleUpload" :accept="uploadAccept">
            <el-button type="primary" plain @click="uploadAccept = ''">上传文件</el-button>
          </el-upload>
          <el-upload :show-file-list="false" :http-request="handleUpload" accept="image/*">
            <el-button type="primary" plain @click="uploadAccept = 'image/*'">上传图片</el-button>
          </el-upload>
          <el-button @click="router.push('/system/oss/config')">配置管理</el-button>
        </ze-form-item>
      </ze-form>
    </template>

    <ze-table
      ref="tableRef"
      :data="listData"
      :loading="loading"
      :columns="[
        { prop: 'ossId', label: '对象存储主键', hidden: true },
        { prop: 'fileName', label: '文件名', minWidth: 180, fixed: true },
        { prop: 'originalName', label: '原名', minWidth: 160 },
        { prop: 'fileSuffix', label: '文件后缀', width: 100 },
        { prop: 'url', label: '文件展示', minWidth: 220 },
        { prop: 'createTime', label: '创建时间', minWidth: 180 },
        { prop: 'createByName', label: '上传人', minWidth: 100 },
        { prop: 'service', label: '服务商', minWidth: 100 },
      ]"
      :filterColVR="filterColRef"
    >
      <template #col-url="{ row }">
        <el-image
          v-if="isImage(row.fileSuffix)"
          class="h-60 w-60"
          fit="cover"
          :src="row.url"
          :preview-src-list="[row.url]"
          preview-teleported
        />
        <el-link v-else type="primary" :href="row.url" target="_blank">{{ row.url }}</el-link>
      </template>

      <ze-table-column fixed="right" label="操作" width="150px" headerAlign="center">
        <template #default="{ row }">
          <ze-actions
            :options="{ text: true, type: 'primary' }"
            :actions="[
              { content: '下载', onClick: () => handleDownload(row) },
              { content: '删除', confirm: true, onClick: () => handleDel([row.ossId]) },
            ]"
          />
        </template>
      </ze-table-column>
    </ze-table>

    <template #content-footer>
      <ze-pagination class="ml-a" v-model="pagination" />
    </template>
  </VPage>
</template>

<script setup lang="ts">
import { ossApi } from '@/api/_index'
import type { OssQuery, OssVO } from '@/api/sys/oss.types'
import type { ZeFormInstance } from '@/components/types/form'
import { toReactive, watchDebounced } from '@vueuse/core'
import type { UploadRequestOptions } from 'element-plus'

const router = useRouter()
const searchFormRef = ref<ZeFormInstance>()
const [searchForm, searchFormItems] = useForm({
  fileName: { value: '', item: { type: 'text', plh: '文件名', prefixIcon: 'el-search' } },
  originalName: { value: '', item: { type: 'text', plh: '原名' } },
  fileSuffix: { value: '', item: { type: 'text', plh: '文件后缀' } },
  service: { value: '', item: { type: 'text', plh: '服务商' } },
})
watchDebounced(searchForm, () => refresh(), { deep: true, debounce: 666, maxWait: 3000 })

const [listData, refresh, pagination, loading] = useTable<OssQuery, OssVO>(
  ossApi.listOss,
  toReactive(searchForm),
  { immediate: true },
)

const [tableRef, filterColRef] = [ref(), ref()]
const reset = () => (searchFormRef.value?.resetFields(), nextTick(() => refresh()))

const uploadAccept = ref('')
const handleUpload = ({ file }: UploadRequestOptions) =>
  ossApi.uploadOss(file).then(() => {
    ElMessage.success('上传成功')
    refresh()
  })

const isImage = (suffix: string) => ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp'].includes(suffix.toLowerCase())

const handleDownload = async (row: OssVO) => {
  const blob = await ossApi.downloadOss(row.ossId)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = row.originalName || row.fileName
  link.click()
  URL.revokeObjectURL(url)
}

const [, handleDel] = useApi(ossApi.delOss, [], {
  onSuccess: () => refresh(),
  tipSuccess: '删除成功',
  tipError: '删除失败',
})
</script>

<style lang="scss" scoped></style>
