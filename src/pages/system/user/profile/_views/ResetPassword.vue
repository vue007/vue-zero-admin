<template>
  <ze-form ref="formRef" v-model="form" :items="items" :rules="rules" label-width="90px" class="max-w-560">
    <ze-form-item>
      <ze-actions :actions="[{ content: '保存', type: 'primary', loading, onClick: submit }, { content: '重置', onClick: reset }]" />
    </ze-form-item>
  </ze-form>
</template>

<script setup lang="ts">
import { userApi } from '@/api/_index'
import type { ResetPwdForm } from '@/api/sys/user.type'
import type { ZeFormInstance } from '@/components/types/form'
import { validatePassword } from '@/utils/validators'

const formRef = ref<ZeFormInstance>()
const [form, items, rules] = useForm({
  oldPassword: { value: '', item: { type: 'password', label: '旧密码', plh: '请输入旧密码', showPassword: true }, rule: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }] },
  newPassword: { value: '', item: { type: 'password', label: '新密码', plh: '请输入新密码', showPassword: true }, rule: [{ required: true, message: '新密码不能为空', trigger: 'blur' }, { validator: validatePassword, trigger: 'blur' }] },
  confirmPassword: { value: '', item: { type: 'password', label: '确认密码', plh: '请再次输入新密码', showPassword: true }, rule: [{ required: true, message: '确认密码不能为空', trigger: 'blur' }, { validator: (_rule, value, callback) => value === form.value.newPassword ? callback() : callback(new Error('两次输入的密码不一致')), trigger: 'blur' }] },
})
const reset = () => formRef.value?.setFields()
const { request: save, loading } = useApi<Pick<ResetPwdForm, 'oldPassword' | 'newPassword'>, void>(userApi.updateUserPwd, () => ({ oldPassword: form.value.oldPassword, newPassword: form.value.newPassword }), { tipSuccess: '密码修改成功', tipError: true, onSuccess: reset })
const submit = async () => { if (await formRef.value?.validate().catch(() => false)) save() }
</script>
