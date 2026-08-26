<template>
  <ExternalConsole :title="t('title')" :description="t('description')" :url="snailJobUrl" />
</template>

<script setup lang="ts">
import ExternalConsole from '../_views/ExternalConsole.vue'

const { t } = useI18nLocal()
const snailJobUrl = import.meta.env.VITE_APP_SNAIL_JOB_URL || '/snail-job/'
</script>

<i18n lang="yaml">
en:
  title: 'Task scheduling center'
  description: 'Manage distributed jobs, executors, workflows and execution logs'
zh:
  title: '任务调度中心'
  description: '管理分布式任务、执行器、工作流和执行日志'
</i18n>
