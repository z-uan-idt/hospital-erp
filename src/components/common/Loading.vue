<template>
  <v-overlay
    v-model="isLoading"
    class="align-center justify-center"
    persistent
    opacity="1"
    color="background"
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

  const isLoading = ref(false)

  watchEffect(() => {
    isLoading.value = props.isLoading
  })
</script>
