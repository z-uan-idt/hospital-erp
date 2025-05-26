<template>
  <div class="erp-kho-duoc pa-6"></div>
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
