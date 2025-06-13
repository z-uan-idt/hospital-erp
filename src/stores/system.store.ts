export const useSystemStore = defineStore('system', () => {
  const isLoading = ref(false)
  const notification = ref(null)
  const realtimeERPMessage = ref<{ [key: string]: any }>({})

  const setLoading = (value: boolean) => {
    isLoading.value = value
  }

  const setNotification = (value: any) => {
    notification.value = value
  }

  const setRealtimeERPMessage = (value: { [key: string]: any }) => {
    realtimeERPMessage.value = value
  }

  return {
    isLoading,
    setLoading,
    notification,
    setNotification,
    realtimeERPMessage,
    setRealtimeERPMessage,
  }
})
