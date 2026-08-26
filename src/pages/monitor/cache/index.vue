<template>
  <VPage class="p-24">
    <template #header>
      <div class="flex items-center justify-between w-full">
        <div class="text-16 font-600">{{ t('title') }}</div>
        <ze-actions :actions="[{ icon: 'el-refresh', content: t('refresh'), loading, onClick: refreshAll }]" />
      </div>
    </template>

    <div v-loading="loading" class="cache-page">
      <el-card shadow="never">
        <template #header>{{ t('overview') }}</template>
        <el-descriptions :column="4" border>
          <el-descriptions-item :label="t('redisVersion')">{{ info.redis_version || '-' }}</el-descriptions-item>
          <el-descriptions-item :label="t('mode')">{{ modeLabel }}</el-descriptions-item>
          <el-descriptions-item :label="t('port')">{{ info.tcp_port || '-' }}</el-descriptions-item>
          <el-descriptions-item :label="t('clients')">{{ info.connected_clients || '-' }}</el-descriptions-item>
          <el-descriptions-item :label="t('uptime')">{{ info.uptime_in_days || '-' }}</el-descriptions-item>
          <el-descriptions-item :label="t('memory')">{{ info.used_memory_human || '-' }}</el-descriptions-item>
          <el-descriptions-item :label="t('maxMemory')">{{ info.maxmemory_human || '-' }}</el-descriptions-item>
          <el-descriptions-item :label="t('keys')">{{ cacheInfo?.dbSize ?? 0 }}</el-descriptions-item>
          <el-descriptions-item :label="t('aof')">{{ info.aof_enabled === '1' ? t('yes') : t('no') }}</el-descriptions-item>
          <el-descriptions-item :label="t('rdb')">{{ info.rdb_last_bgsave_status || '-' }}</el-descriptions-item>
          <el-descriptions-item :label="t('input')">{{ info.instantaneous_input_kbps || '0' }} KB/s</el-descriptions-item>
          <el-descriptions-item :label="t('output')">{{ info.instantaneous_output_kbps || '0' }} KB/s</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <div class="cache-grid">
        <el-card shadow="never">
          <template #header>{{ t('groups') }}</template>
          <ze-table
            :data="cacheGroups || []"
            :loading="groupsLoading"
            :columns="[
              { prop: 'remark', label: t('groupRemark'), minWidth: 140 },
              { prop: 'cacheName', label: t('groupName'), minWidth: 190 },
              { prop: 'keyCount', label: t('keyCount'), width: 90 },
            ]"
          >
            <ze-table-column fixed="right" :label="t('actions')" width="150px" headerAlign="center">
              <template #default="{ row }">
                <ze-actions
                  :options="{ text: true, type: 'primary' }"
                  :actions="[
                    { content: t('viewKeys'), onClick: () => openKeys(row) },
                    { content: t('clear'), type: 'danger', confirm: true, onClick: () => clearGroup(row) },
                  ]"
                />
              </template>
            </ze-table-column>
          </ze-table>
        </el-card>

        <el-card shadow="never">
          <template #header>{{ t('commands') }}</template>
          <ze-table
            :data="cacheInfo?.commandStats || []"
            :loading="cacheLoading"
            :columns="[
              { type: 'index', label: '#', width: 56 },
              { prop: 'name', label: t('commandName'), minWidth: 150 },
              { prop: 'value', label: t('calls'), minWidth: 110 },
            ]"
          />
        </el-card>
      </div>
    </div>

    <el-dialog v-model="keysVisible" :title="`${currentGroup?.remark || ''} - ${t('cacheKeys')}`" width="720px">
      <ze-table
        :data="keyRows"
        :loading="keysLoading"
        max-height="520"
        :columns="[
          { type: 'index', label: '#', width: 56 },
          { prop: 'cacheKey', label: t('cacheKey'), minWidth: 420 },
        ]"
      >
        <ze-table-column fixed="right" :label="t('actions')" width="90px" headerAlign="center">
          <template #default="{ row }">
            <ze-actions
              :options="{ text: true, type: 'danger' }"
              :actions="[{ content: t('delete'), confirm: true, onClick: () => clearKey(row.cacheKey) }]"
            />
          </template>
        </ze-table-column>
      </ze-table>
    </el-dialog>
  </VPage>
</template>

<script setup lang="ts">
import { cacheApi } from '@/api/_index'
import type { CacheGroupVO, CacheInfoVO } from '@/api/monitor/cache.types'

const { t } = useI18nLocal()
const [cacheInfo, fetchCacheInfo, cacheLoading] = useApi<undefined, CacheInfoVO>(cacheApi.getCacheInfo, undefined, {
  immediate: true,
  tipError: computed(() => t('loadFailed')),
})
const [cacheGroups, fetchCacheGroups, groupsLoading] = useApi<undefined, CacheGroupVO[]>(
  cacheApi.getCacheGroups,
  undefined,
  { immediate: true, tipError: computed(() => t('loadFailed')) },
)

const loading = computed(() => cacheLoading.value || groupsLoading.value)
const info = computed(() => cacheInfo.value?.info || {})
const modeLabel = computed(() => (info.value.redis_mode === 'standalone' ? t('standalone') : t('cluster')))
const refreshAll = () => Promise.all([fetchCacheInfo(), fetchCacheGroups()])

const keysVisible = ref(false)
const currentGroup = ref<CacheGroupVO>()
const [cacheKeys, fetchCacheKeys, keysLoading] = useApi<{ cacheName: string }, string[]>(
  cacheApi.getCacheKeys,
  undefined,
  { tipError: computed(() => t('loadKeysFailed')) },
)
const keyRows = computed(() => (cacheKeys.value || []).map((cacheKey) => ({ cacheKey })))
const openKeys = (group: CacheGroupVO) => {
  currentGroup.value = group
  keysVisible.value = true
  fetchCacheKeys({ cacheName: group.cacheName })
}

const [, requestClearGroup] = useApi(cacheApi.clearCacheGroup, undefined, {
  onSuccess: () => refreshAll(),
  tipSuccess: computed(() => t('clearSuccess')),
  tipError: computed(() => t('clearFailed')),
})
const clearGroup = (group: CacheGroupVO) => requestClearGroup({ cacheName: group.cacheName })

const [, requestClearKey] = useApi(cacheApi.clearCacheKey, undefined, {
  onSuccess: () => {
    if (currentGroup.value) fetchCacheKeys({ cacheName: currentGroup.value.cacheName })
    fetchCacheGroups()
  },
  tipSuccess: computed(() => t('deleteSuccess')),
  tipError: computed(() => t('deleteFailed')),
})
const clearKey = (cacheKey: string) => {
  if (!currentGroup.value) return
  requestClearKey({ cacheName: currentGroup.value.cacheName, cacheKey })
}
</script>

<style lang="scss" scoped>
.cache-page {
  display: grid;
  gap: 16px;
}

.cache-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 0.72fr);
  gap: 16px;
  align-items: start;
}

@media (max-width: 1100px) {
  .cache-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<i18n lang="yaml">
en:
  title: 'Cache management'
  refresh: 'Refresh'
  overview: 'Redis overview'
  redisVersion: 'Redis version'
  mode: 'Mode'
  port: 'Port'
  clients: 'Clients'
  uptime: 'Uptime (days)'
  memory: 'Memory used'
  maxMemory: 'Memory limit'
  keys: 'Keys'
  aof: 'AOF enabled'
  rdb: 'Last RDB save'
  input: 'Network input'
  output: 'Network output'
  yes: 'Yes'
  no: 'No'
  standalone: 'Standalone'
  cluster: 'Cluster'
  groups: 'Business cache groups'
  groupRemark: 'Cache'
  groupName: 'Group name'
  keyCount: 'Entries'
  commands: 'Command statistics'
  commandName: 'Command'
  calls: 'Calls'
  actions: 'Actions'
  viewKeys: 'Keys'
  clear: 'Clear'
  cacheKeys: 'Cache keys'
  cacheKey: 'Key'
  delete: 'Delete'
  loadFailed: 'Failed to load cache data'
  loadKeysFailed: 'Failed to load cache keys'
  clearSuccess: 'Cache cleared'
  clearFailed: 'Failed to clear cache'
  deleteSuccess: 'Cache key deleted'
  deleteFailed: 'Failed to delete cache key'
zh:
  title: '缓存管理'
  refresh: '刷新'
  overview: 'Redis 运行概览'
  redisVersion: 'Redis版本'
  mode: '运行模式'
  port: '端口'
  clients: '客户端数'
  uptime: '运行时间(天)'
  memory: '使用内存'
  maxMemory: '内存上限'
  keys: 'Key数量'
  aof: 'AOF已开启'
  rdb: 'RDB状态'
  input: '网络入口'
  output: '网络出口'
  yes: '是'
  no: '否'
  standalone: '单机'
  cluster: '集群'
  groups: '业务缓存组'
  groupRemark: '缓存名称'
  groupName: '缓存组'
  keyCount: '条目数'
  commands: '命令统计'
  commandName: '命令'
  calls: '调用次数'
  actions: '操作'
  viewKeys: '键列表'
  clear: '清空'
  cacheKeys: '缓存键'
  cacheKey: '键名'
  delete: '删除'
  loadFailed: '缓存数据加载失败'
  loadKeysFailed: '缓存键加载失败'
  clearSuccess: '缓存清理成功'
  clearFailed: '缓存清理失败'
  deleteSuccess: '缓存键删除成功'
  deleteFailed: '缓存键删除失败'
</i18n>
