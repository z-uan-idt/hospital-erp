<template>
  <v-container
    fluid
    class="erp-kham-chua-benh pa-md-6 pa-3"
  ></v-container>
</template>

<script setup lang="ts">
  definePageMeta({
    layout: 'default',
    middleware: ['auth'],
  })

  useHead({
    title: 'Tổng quan',
  })
</script>

<style scoped lang="scss"></style>
