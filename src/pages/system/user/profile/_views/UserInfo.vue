<template>
  <ze-form ref="formRef" v-model="form" :items="items" :rules="rules" label-width="90px" class="max-w-560">
    <ze-form-item>
      <ze-actions :actions="[{ content: '保存', type: 'primary', loading, onClick: submit }]" />
    </ze-form-item>
  </ze-form>
</template>

<script setup lang="ts">
import { userApi } from '@/api/_index'
import type { UserProfileForm, UserVO } from '@/api/sys/user.type'
import type { ZeFormInstance } from '@/components/types/form'
import { validatePhone } from '@/utils/validators'

const props = defineProps<{ user: UserVO }>()
const emit = defineEmits<{ success: [] }>()
const { sys_user_sex } = toRefs(useDict('sys_user_sex'))
const formRef = ref<ZeFormInstance>()
const [form, items, rules] = useForm({
  nickName: { value: '', item: { type: 'text', label: '用户昵称', plh: '请输入用户昵称', maxlength: 30 }, rule: [{ required: true, message: '用户昵称不能为空', trigger: 'blur' }] },
  phonenumber: { value: '', item: { type: 'text', label: '手机号码', plh: '请输入手机号码', maxlength: 11 }, rule: [{ validator: validatePhone, trigger: 'blur' }] },
  email: { value: '', item: { type: 'text', label: '邮箱', plh: '请输入邮箱', maxlength: 50 }, rule: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }] },
  sex: { value: '2', item: { type: 'radio', label: '性别', options: sys_user_sex } },
})

watch(
  () => props.user,
  (user) => {
    Object.assign(form.value, {
      nickName: user.nickName,
      phonenumber: user.phonenumber,
      email: user.email,
      sex: user.sex,
    })
    nextTick(() => formRef.value?.clearValidate())
  },
  { immediate: true, deep: true },
)
const { request: save, loading } = useApi<UserProfileForm, void>(userApi.updateUserProfile, form, { tipSuccess: '修改成功', tipError: true, onSuccess: () => emit('success') })
const submit = async () => { if (await formRef.value?.validate().catch(() => false)) save() }
</script>
