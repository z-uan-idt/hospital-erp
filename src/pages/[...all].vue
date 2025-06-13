<script setup lang="ts">
  import type { NuxtError } from '#app'
  const { isAuthenticated, isSelectedOrganization } = useAuth()

  const router = useRouter()

  watchEffect(() => {
    setPageLayout(isAuthenticated.value ? (isSelectedOrganization.value ? 'default' : 'welcome') : 'empty')
  })

  defineProps({
    error: Object as () => NuxtError,
  })

  useHead({
    title: 'Trang bạn đang tìm kiếm không tồn tại',
  })
</script>

<template>
  <div :class="['d-flex align-center justify-center', 'h-100 w-100 position-relative']">
    <div class="d-flex flex-column align-center justify-center h-100">
      <h1 class="text-blue-grey-darken-1 font-weight-black">
        {{ error?.statusCode ?? 500 }}
      </h1>
      <p class="text-h6 font-weight-regular text-blue-grey-darken-2">Trang bạn đang tìm kiếm không tồn tại.</p>
      <v-btn
        variant="outlined"
        color="blue-grey-darken-2"
        class="text-none mt-4"
        rounded="pill"
        @click="router.back()"
      >
        <template #prepend>
          <v-icon class="me-n1">mdi-arrow-left</v-icon>
        </template>
        Quay lại
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
