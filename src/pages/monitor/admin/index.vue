<template>
  <ExternalConsole :title="t('title')" :description="t('description')" :url="monitorUrl" />
</template>

<script setup lang="ts">
import ExternalConsole from '../_views/ExternalConsole.vue'

const { t } = useI18nLocal()
const monitorUrl = import.meta.env.VITE_APP_MONITOR_URL || '/admin/'
</script>

<i18n lang="yaml">
en:
  title: 'Admin monitoring'
  description: 'Spring Boot application health, metrics, logs and runtime diagnostics'
zh:
  title: 'Admin监控'
  description: '查看 Spring Boot 应用健康状态、指标、日志和运行诊断信息'
</i18n>
