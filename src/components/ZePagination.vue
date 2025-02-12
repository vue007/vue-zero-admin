<template>
  <el-pagination
    v-model:current-page="pagination!.pageNo"
    :page-size="pagination?.pageSize"
    layout="total, sizes, prev, pager, next,jumper"
    :page-sizes="pagination?.pageSizes"
    :total="pagination?.total"
    @size-change="(size) => pagination?.sizeChange(size)"
    @current-change="(page) => pagination?.currentChange(page)"
    :small="size !== 'large'"
  />
</template>

<script setup lang="ts">
const size = inject('size')
const pagination = defineModel<ReturnType<typeof usePagination>>()
</script>

<style lang="scss" scoped></style>
