<route lang="json5">
{ meta: { layout: 'blank', auth: false } }
</route>

<template>
  <AuthPageShell>
    <LoginForm />
  </AuthPageShell>
</template>

<script setup lang="ts">
import AuthPageShell from '@/components/AuthPageShell.vue'
import LoginForm from './_views/LoginForm.vue'
</script>
