<template>
  <v-container
    fluid
    class="erp-kho-duoc pa-md-6 pa-3"
  ></v-container>
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
