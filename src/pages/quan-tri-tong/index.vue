<template>
  <v-container
    class="erp-quan-tri-tong pa-md-6 pa-3"
    fluid
  >
    <div class="d-flex align-center flex-row justify-space-between ga-4">
      <div class="d-flex align-center justify-start ga-3 w-100 w-md-auto">
        <h1 :class="['text-lg-h5 text-h6 font-weight-medium', 'text-blue-grey-darken-3']">Tổng quan</h1>
      </div>
    </div>
  </v-container>
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
