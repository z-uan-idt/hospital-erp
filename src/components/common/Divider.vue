<template>
  <div class="d-flex align-center justify-start ga-2 mb-4">
    <span
      style="min-width: max-content"
      class="text-grey-darken-3 text-body-2"
    >
      {{ label }}
    </span>
    <v-divider />
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    label: string
  }>()
</script>
