<template>
  <VPage>
    <template #header>弹窗</template>

    <el-button @click="openBaseModal">open base modal</el-button>
    <el-button @click="() => testModalRef.open()">TestModal.open</el-button>
    <el-button @click="openTestModal1">函数式调用</el-button>
    <!--<el-button @click="() => channelModalRef.open()">打开渠道管理</el-button>
    <el-button @click="() => DialogContentRef.open()">打开自定义Dialog</el-button> -->
    <template #footer></template>
  </VPage>

  <ze-modal v-model="modalFlag" type="dialog" width="400px" title="BaseModal">base modal</ze-modal>
  <TestModal />
</template>

<script setup lang="tsx">
const modalFlag = ref(false)
const openBaseModal = () => (modalFlag.value = true)

const toggleModalType = () => {
  if (testModalRef.value.getData().type === 'dialog') {
    testModalRef.value.setData({ type: 'drawer' })
  } else testModalRef.value.setData({ type: 'dialog' })
}

const [testModalRef, TestModal] = useModal({
  title: '关闭前Title JS', // tip: 属性在js中优先级更高
  type: 'dialog',
  content: () => <el-button onClick={toggleModalType}>toggleModalType</el-button>,
  onConfirm: () => {
    testModalRef.value.setData({ visible: false })
    testModalRef.value.setData({ title: 'onConfirm 关闭后Title onConfirm' })
    testModalRef.value.setData({ type: 'drawer' })
  },
})

const openTestModal1 = () => {
  useModal({
    immediate: true,
    title: '函数调用',
    content: 'immediate: true, 立即在body rende并显示',
  })
}

onMounted(() => {})

// const [ChannelModal, channelModalRef] = useModal({ type: 'drawer', immediate: true, showAction: false, size: '80%' })
// const tableData = ref<any[]>([
//   { name: '777', country: '巴西、印度', recent: '2024-12-12 12:00:00', auth: '何况', allowSend: false },
//   { name: '888', country: '巴西、印度', recent: '2024-06-06 11:08:35', auth: 'admin', allowSend: true },
//   { name: '999', country: '巴西', recent: '2024-06-04 11:08:42', auth: 'Superadmin', allowSend: true },
// ])

// const doSomething = () => {
//   console.log()
//   channelModalRef.value.close()
// }

const form = reactive({
  region: '',
})

// const [DialogContentModal, DialogContentRef] = useModal({ type: 'dialog' })
</script>

<style lang="scss" scoped></style>
