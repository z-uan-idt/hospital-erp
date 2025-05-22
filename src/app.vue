<template>
  <v-app class="bg-background">
    <NuxtLayout>
      <NuxtPwaAssets />
      <NuxtPage />
      <Toaster
        position="top-right"
        expand
        :gap="8"
        offset="10px"
        :visibleToasts="5"
        richColors
        closeButton
        dir="auto"
      />
    </NuxtLayout>
  </v-app>
</template>

<script setup lang="ts">
  const { $toast } = useNuxtApp()
  const { onUpdateOrCreateDevice, isAuthenticated } = useAuth()

  onMounted(() => {
    window.addEventListener('offline', () => {
      $toast.error('Lỗi kết nối mạng', {
        description: 'Vui lòng kiểm tra lại kết nối mạng của bạn',
      })
    })

    window.addEventListener('online', () => {
      $toast.success('Kết nối mạng', {
        description: 'Kết nối mạng đã được khôi phục',
      })
    })

    if (isAuthenticated.value) {
      onUpdateOrCreateDevice()
    }
  })

  onUnmounted(() => {
    window.removeEventListener('offline', () => {})
    window.removeEventListener('online', () => {})
  })
</script>
