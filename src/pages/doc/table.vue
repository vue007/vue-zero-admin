<template>
  <VPage>
    <template #header>
      <ze-form inline>
        <ze-form-item class="ml-auto">
          <el-button @click="refresh" :loading="loading">search</el-button>
          <el-button ref="filterColRef">filter columns</el-button>
        </ze-form-item>
      </ze-form>
    </template>

    <ze-table
      :data="tableData"
      :columns="[
        { prop: 'age', label: $t('doc.col.age'), minWidth: 120, headerAlign: 'center', align: 'center' },
        { prop: 'sex', label: $t('doc.col.sex'), minWidth: 120 },
        { prop: 'hasPassion', label: $t('doc.col.hasPassion'), minWidth: 120 },
        { prop: 'city', label: $t('doc.col.city'), minWidth: 120, headerAlign: 'center', align: 'center' },
        { prop: 'startDate', label: $t('doc.col.startDate'), minWidth: 160 },
        { prop: 'createdTime', label: $t('doc.col.createdTime'), minWidth: 160 },
      ]"
      :filterColVR="filterColRef"
      :loading="loading"
    >
      <template #col-hasPassion="scope">
        <el-switch :modelValue="scope.row.hasPassion" @update:modelValue="scope.row.hasPassion = $event" />
      </template>

      <el-table-column min-width="160">
        <el-button link type="primary" size="small">{{ $t('base.delete') }}</el-button>
      </el-table-column>
    </ze-table>

    <template #content-footer>
      <ze-pagination class="ml-a" v-model="pagination" />
    </template>
  </VPage>
</template>

<script setup lang="ts">
import { userApi } from '@/api/_index'

const searchForm = reactive({ pageNo: 1, pageSize: 10 })

const [tableData, refresh, pagination, loading] = useTable(userApi.listUser, searchForm, { immediate: true })

const filterColRef = ref()

onMounted(() => {})
</script>

<style lang="scss" scoped></style>
