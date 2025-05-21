<template>
  <v-overlay
    :model-value="props.isLoading"
    class="align-center justify-center"
    persistent
  >
    <v-progress-circular
      color="white"
      bg-color="erp-brand"
      indeterminate
      size="80"
      width="4"
    />
  </v-overlay>
</template>

<script setup lang="ts">
  type Props = {
    isLoading: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    isLoading: false,
  })
</script>
