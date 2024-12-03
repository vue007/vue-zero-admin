<template>
  <VPage>
    <template #header><h2>表单</h2></template>

    <div class="flex gap-20 flex-wrap">
      <el-card class="w-500">
        <div class="mb-16">表单元素</div>
        <ze-input ref="gtInputRef" v-model="gtInput" />
        <ze-formItem type="text" v-model="form.usename" label="名字" class="mt-10" ref="gtInputItemRef" />
        <ze-formItem type="number" v-model="form.age" label="年龄" />
        <ze-formItem type="radio" v-model="form.sex" label="性别" :enum-list="SEX_ENUM_LIST" />
        <ze-formItem type="select" v-model="form.region" label="区域" :enum-list="REGION_ENUM_LIST" />
        <ze-formItem type="date" v-model="form.date" label="开始日期" />
        <ze-formItem type="datetime" v-model="form.date" label="开始时间" />
        <ze-formItem type="daterange" v-model="form.daterange" label="日期段" />
        <ze-formItem type="datetimerange" v-model="form.datetimerange" label="时间段" />
      </el-card>

      <el-card class="w-500">
        <div class="mb-16">表单校验</div>
        <ze-form v-model="form" ref="validationFormRef" :rules="formRules">
          <ze-form-item type="text" v-model="form.usename" label="名字" class="mt-10" ref="gtInputItemRef" />
          <ze-form-item type="number" v-model="form.age" label="年龄" :min="0" />
          <ze-form-item type="radio" v-model="form.sex" label="性别" :enum-list="SEX_ENUM_LIST" />
          <ze-form-item type="switch" v-model="form.hasPassion" label="有无房贷" />
          <ze-form-item type="select" v-model="form.region" label="区域" :enum-list="REGION_ENUM_LIST" />
          <ze-form-item type="date" v-model="form.date" label="开始日期" />
          <ze-form-item type="datetime" v-model="form.date" label="开始时间" />
          <ze-form-item type="daterange" v-model="form.daterange" label="日期段" />
          <ze-form-item type="datetimerange" v-model="form.datetimerange" label="时间段" />
          <el-form-item>
            <el-button @click="() => validationFormRef?.resetFields()">重置</el-button>
            <el-button type="primary" @click="() => validationFormRef?.validate()">校验</el-button>
          </el-form-item>
        </ze-form>
      </el-card>
    </div>
  </VPage>
</template>

<script setup lang="ts">
import type { ZeInputInstance } from '@/components/types'
import type { ZeFormInstance } from '@/components/types/form'
import type { FormRules } from 'element-plus'

const SEX_ENUM_LIST = [
  { label: '男', value: 1 },
  { label: '女', value: 0 },
]
const REGION_ENUM_LIST = [
  { label: '罗湖区', value: '440303' },
  { label: '福田区', value: '440304' },
  { label: '南山区', value: '440305' },
]

const form = reactive({
  usename: '',
  age: 0,
  sex: 1,
  hasPassion: true,
  region: '',
  date: '',
  datetime: '',
  daterange: [],
  datetimerange: [],
})

const checkAge = (rule, value, cb) => {
  if (!value) cb(new Error('谁还不是个宝宝呢'))
  if (value < 18) cb(new Error('你还未满十八岁?'))
  if (value > 120) cb(new Error('现在知道为什么急救电话是120了吧'))
  cb()
}

const formRules: FormRules<typeof form> = {
  usename: [{ required: true, message: '敢问，怎么称呼？' }],
  age: [{ validator: checkAge }],
  sex: [],
  region: [{ required: true, message: '选一个吧' }],
}

const [gtInput, gtInputRef] = [ref(), ref<ZeInputInstance>()]
const [gtInputItem, gtInputItemRef] = [ref(), ref<ZeInputInstance>()]

const validationFormRef = ref<ZeFormInstance>()

onMounted(() => {
  nextTick(() => {
    console.log(gtInputItemRef.value)

    gtInputItemRef.value?.focus()
  })
})
</script>

<style lang="scss" scoped></style>
