<template>
  <NuxtLayout name="default">
    <template #app-bar-right>
      <v-select
        v-model="warehouseSelected"
        max-width="270"
        variant="outlined"
        density="compact"
        hide-details
        color="erp-brand-600"
        rounded="lg"
        :items="['Khoa kiểm soát nhiễm trùng', 'Khoa nội', 'Khoa ngoại']"
      />
    </template>
    <div class="erp-danh-sach-thuoc">
      <h1>Danh sách thuốc</h1>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
  definePageMeta({
    layout: false,
    middleware: ['auth'],
  })

  const warehouseSelected = ref('Khoa kiểm soát nhiễm trùng')
</script>

<style scoped lang="scss"></style>
