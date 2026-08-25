<route lang="json5">
{ meta: { auth: true, layout: 'base', menuIndependent: true, title: '个人中心' } }
</route>

<template>
  <VPage class="profile-page p-16 lt-sm:p-10" v-loading="loading">
    <el-row :gutter="16" class="profile-grid">
      <el-col :xs="24" :md="8" :lg="6">
        <VCard title="个人信息" class="h-full" fluid>
          <div class="flex flex-col items-center">
            <UserAvatar :avatar="profile?.user.avatar" @success="handleAvatarSuccess" />
            <div class="mt-14 text-lg font-600">{{ profile?.user.nickName || '-' }}</div>
            <div class="mt-4 text-sm color-[var(--el-text-color-secondary)]">{{ profile?.user.userName || '-' }}</div>
          </div>

          <el-divider />
          <div class="profile-list">
            <div v-for="item in summaryItems" :key="item.label" class="profile-list__item">
              <span class="flex items-center gap-8 font-500">
                <svg-icon :name="item.icon" />{{ item.label }}
              </span>
              <span class="profile-list__value" :title="item.value">{{ item.value || '-' }}</span>
            </div>
          </div>
        </VCard>
      </el-col>

      <el-col :xs="24" :md="16" :lg="18">
        <VCard title="个人设置" class="h-full" fluid>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="userinfo">
              <UserInfo v-if="profile" :user="profile.user" @success="refreshProfile" />
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="password">
              <ResetPassword />
            </el-tab-pane>
          </el-tabs>
        </VCard>
      </el-col>
    </el-row>
  </VPage>
</template>

<script setup lang="ts">
import { userApi } from '@/api/_index'
import type { UserInfoVO } from '@/api/sys/user.type'
import { useBaseStore } from '@/stores/base.module'
import ResetPassword from './_views/ResetPassword.vue'
import UserAvatar from './_views/UserAvatar.vue'
import UserInfo from './_views/UserInfo.vue'

const activeTab = ref('userinfo')
const baseStore = useBaseStore()
const [profile, refreshProfile, loading] = useApi<undefined, UserInfoVO>(() => userApi.getUserProfile(), undefined, {
  immediate: true,
  tipError: true,
})

const summaryItems = computed(() => [
  { label: '手机号码', icon: 'el-phone', value: profile.value?.user.phonenumber },
  { label: '用户邮箱', icon: 'el-message', value: profile.value?.user.email },
  { label: '所属部门', icon: 'el-office-building', value: profile.value?.user.deptName },
  { label: '所属岗位', icon: 'el-briefcase', value: profile.value?.postGroup },
  { label: '所属角色', icon: 'el-user-filled', value: profile.value?.roleGroup },
  { label: '创建日期', icon: 'el-calendar', value: profile.value?.user.createTime },
])

const handleAvatarSuccess = (avatar: string) => {
  if (profile.value) profile.value.user.avatar = avatar
  if (baseStore.setting.userInfo.user) baseStore.setting.userInfo.user.avatar = avatar
}
</script>

<style lang="scss" scoped>
.profile-grid { row-gap: 16px; }
.profile-grid > :deep(.el-col) { display: flex; min-width: 0; }
.profile-list__item { display: flex; justify-content: space-between; gap: 16px; padding: 12px 0; border-bottom: 1px solid var(--el-border-color-lighter); }
.profile-list__item:last-child { border-bottom: 0; }
.profile-list__item > span:first-child { flex: none; white-space: nowrap; }
.profile-list__value { min-width: 0; flex: 1; text-align: right; color: var(--el-text-color-secondary); overflow-wrap: anywhere; }
</style>
