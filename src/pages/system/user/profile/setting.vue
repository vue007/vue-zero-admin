<template>
  <VPage class="flex flex-col items-center p-24">
    <VCard title="设置">
      <ze-form v-model="form" :items="formItems" :rules="formRules" label-width="130px">
        <ze-form-item>
          <ze-actions :actions="[{ content: $t('base.confirm'), type: 'primary', loading: false }]"></ze-actions>
        </ze-form-item>
      </ze-form>
    </VCard>
  </VPage>
</template>

<script setup lang="tsx">
const [form, formItems, formRules] = useForm({
  avatar: {
    value: '',
    item: { type: 'text', label: '头像', plh: '头像url' },
    rule: [{ required: true, message: '头像url' }],
  },
  username: {
    value: '',
    item: { type: 'text', label: '用户名', plh: '用户名' },
    rule: [{ required: true, message: '请输入您的账号' }],
  },
  password: {
    value: '',
    item: { type: 'password', label: '登录密码', plh: '密码', showPassword: true },
    rule: [{ required: true, message: '请输入您的密码' }],
  },
})
</script>

<i18n lang="yaml"></i18n>
