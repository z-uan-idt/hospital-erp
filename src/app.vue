<template>
  <KeepAlive>
    <v-app class="erp-background">
      <NuxtLayout>
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
  </KeepAlive>
</template>

<script setup lang="ts">
  const { $toast, $deviceId } = useNuxtApp()
  const { onUpdateOrCreateDevice, isAuthenticated, userData } = useAuth()

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

    if (isAuthenticated.value && !(userData.value?.devices || []).includes($deviceId.value)) {
      onUpdateOrCreateDevice()
    }

    return () => {
      window.removeEventListener('offline', () => {})
      window.removeEventListener('online', () => {})
    }
  })
</script>
