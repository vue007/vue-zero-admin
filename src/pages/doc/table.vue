<template>
  <VPage>
    <el-button @click="refresh">search</el-button>
    <el-button ref="filterColRef">filter columns</el-button>

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

      <template #after-columns="scope">
        <el-table-column min-width="160">
          <el-button link type="primary" size="small">{{ $t('base.delete') }}</el-button>
        </el-table-column>
      </template>
    </ze-table>

    <ze-pagination v-model="pagination" />
  </VPage>
</template>

<script setup lang="ts">
import { userApi } from '@/api/_index'

const searchForm = reactive({ pageNo: 1, pageSize: 10 })

const [tableData, refresh, pagination] = useTable(userApi.list, searchForm, { immediate: true })

const filterColRef = ref()

onMounted(() => {})
</script>

<style lang="scss" scoped></style>
