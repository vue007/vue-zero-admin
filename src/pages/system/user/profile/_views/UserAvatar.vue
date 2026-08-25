<template>
  <el-upload action="#" :show-file-list="false" :auto-upload="false" accept="image/*" :on-change="handleChange">
    <div class="avatar-wrap" v-loading="loading">
      <el-avatar :size="112" :src="avatar || ''"><svg-icon name="el-user-filled" /></el-avatar>
      <div class="avatar-mask"><svg-icon name="el-camera" /> 修改头像</div>
    </div>
  </el-upload>
</template>

<script setup lang="ts">
import { userApi } from '@/api/_index'
import type { UploadFile } from 'element-plus'

defineProps<{ avatar?: string }>()
const emit = defineEmits<{ success: [avatar: string] }>()
const formData = ref<FormData>()
const { request: upload, loading } = useApi(userApi.uploadAvatar, formData, { tipSuccess: '头像修改成功', tipError: true, onSuccess: (res) => emit('success', res?.apiData.imgUrl || '') })
const handleChange = (file: UploadFile) => {
  const raw = file.raw
  if (!raw) return
  if (!raw.type.startsWith('image/')) return void ElMessage.error('请选择图片文件')
  if (raw.size > 5 * 1024 * 1024) return void ElMessage.error('头像大小不能超过 5MB')
  formData.value = new FormData()
  formData.value.append('avatarfile', raw)
  upload()
}
</script>

<style lang="scss" scoped>
.avatar-wrap { position: relative; width: 112px; height: 112px; overflow: hidden; border-radius: 50%; cursor: pointer; }
.avatar-mask { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; gap: 4px; color: #fff; background: rgb(0 0 0 / 52%); opacity: 0; transition: opacity .2s; }
.avatar-wrap:hover .avatar-mask { opacity: 1; }
</style>
