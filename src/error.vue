<script setup lang="ts">
  import type { NuxtError } from '#app'
  const { isAuthenticated } = useAuth()

  defineProps({
    error: Object as () => NuxtError,
  })

  useHead({
    title: 'Trang bạn đang tìm kiếm không tồn tại',
  })
</script>

<template>
  <v-app>
    <NuxtLayout :name="isAuthenticated ? 'welcome' : 'empty'">
      <div :class="['d-flex align-center justify-center', 'h-100 w-100 position-relative']">
        <div class="d-flex flex-column align-center justify-center h-full">
          <h1 class="text-blue-grey-darken-1 font-weight-black">
            {{ error?.statusCode ?? 500 }}
          </h1>
          <p class="text-h6 font-weight-regular text-blue-grey-darken-2">
            {{ error?.statusMessage ?? 'Trang bạn đang tìm kiếm không tồn tại.' }}
          </p>
          <v-btn
            variant="outlined"
            color="blue-grey-darken-2"
            class="text-none mt-4"
            rounded="pill"
            @click="navigateTo('/')"
          >
            <template #prepend>
              <v-icon class="me-n1">mdi-arrow-left</v-icon>
            </template>
            {{ isAuthenticated ? 'Quay lại' : 'Quay về trang chủ' }}
          </v-btn>
        </div>
      </div>
    </NuxtLayout>
  </v-app>
</template>

<style lang="scss" scoped>
  h1 {
    font-family: fantasy;
    font-size: 14rem;
    font-weight: 700;
    color: #000;
  }
</style>
