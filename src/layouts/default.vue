<template>
  <v-main>
    <slot />
  </v-main>
</template>

<script setup lang="ts">
  useHead({
    titleTemplate(title?: string) {
      return title ? `${title} - Hospital ERP` : 'Hospital ERP'
    },
    meta: [
      {
        name: 'description',
        content: 'Hospital ERP - Hệ thống quản lý kho bệnh viện',
      },
    ],
  })
</script>
