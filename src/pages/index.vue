<template>
  <div class="erp-home pa-6">
    <h1>Tổng quan</h1>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({
    layout: 'default',
    middleware: ['auth'],
    keepalive: true,
  })

  useHead({
    title: 'Tổng quan',
  })
</script>

<style scoped lang="scss"></style>
