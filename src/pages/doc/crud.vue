<template>
  <VPage>
    <el-button @click="() => editDlgRef.open()">open editDlg</el-button>
  </VPage>

  <EditDialog>
    <ze-form v-model="demoForm" :items="demoFormItems" :rules="demoFormRules"></ze-form>
  </EditDialog>
</template>

<script setup lang="ts">
const getTitle = computed(() => 'DialogTitle')
const [editDlgRef, EditDialog] = useModal({ title: getTitle.value })
const [demoForm, demoFormItems, demoFormRules] = useFormItems({
  approvedBy: {
    value: '',
    item: { type: 'text', label: '名字', placeholder: '请输入' },
    rule: [{ required: true, message: '必填' }],
  },
})
</script>

<style lang="scss" scoped></style>
