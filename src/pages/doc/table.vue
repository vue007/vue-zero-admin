<template>
  <VPage>
    <el-button @click="refresh">search</el-button>
    <el-button ref="filterColRef">filter columns</el-button>

    <ze-table
      :data="tableData"
      :columns="[
        { type: 'index', label: $t('doc.col.index'), align: 'center', width: '60px', fixed: 'left' },
        { prop: 'id', hidden: true },
        { prop: 'name', label: $t('doc.col.name'), minWidth: 150, fixed: true },
        { prop: 'age', label: $t('doc.col.age'), minWidth: 120, headerAlign: 'center', align: 'center' },
        { prop: 'sex', label: $t('doc.col.sex'), minWidth: 120 },
        { prop: 'hasLoan', label: $t('doc.col.hasLoan'), minWidth: 120 },
        { prop: 'zip', label: $t('doc.col.zip'), minWidth: 120, headerAlign: 'center', align: 'center' },
        { prop: 'createTime', label: $t('doc.col.createTime'), minWidth: 160 },
      ]"
      :filterColVR="filterColRef"
    >
      <template #col-hasLoan="scope">
        <el-switch :modelValue="scope.row.hasLoan" @update:modelValue="scope.row.hasLoan = $event" />
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
import { userList } from '@/api/user.api'

const searchForm = reactive({ pageNo: 1, pageSize: 10 })

const [tableData, refresh, pagination] = useTable(userList, searchForm, { immediate: true })

const filterColRef = ref()

onMounted(() => {})
</script>

<style lang="scss" scoped></style>
