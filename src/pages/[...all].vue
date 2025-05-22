<script setup lang="ts">
  import type { NuxtError } from '#app'

  defineProps({
    error: Object as () => NuxtError,
  })
</script>

<template>
  <div
    class="h-screen w-100 position-relative d-flex align-center justify-center"
  >
    <div class="d-flex flex-column align-center justify-center h-full">
      <h1 class="text-blue-grey-darken-1 font-weight-black">
        {{ error?.statusCode ?? 500 }}
      </h1>
      <p class="text-h6 font-weight-regular text-blue-grey-darken-2">
        Trang bạn đang tìm kiếm không tồn tại.
      </p>
      <v-btn
        variant="plain"
        color="blue-grey-darken-2"
        class="text-none mt-4"
        @click="navigateTo('/')"
        >Quay về trang chủ
      </v-btn>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  h1 {
    font-family: fantasy;
    font-size: 14rem;
    font-weight: 700;
    color: #000;
  }
</style>
