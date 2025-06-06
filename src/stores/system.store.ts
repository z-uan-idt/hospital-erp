export const useSystemStore = defineStore('system', () => {
  const isLoading = ref(false)
  const notification = ref(null)
  const webSocket = useWebSocket('ws/erp')
  const erpSocket = ref<WebSocket | null>(null)
  const { isAuthenticated, userData } = useAuth()

  const connectErpSocket = () => {
    if (isAuthenticated.value && userData.value?.id) {
      erpSocket.value = webSocket.connect(userData.value?.id?.toString())
    }
  }

  const disconnectErpSocket = () => {
    if (erpSocket.value) {
      erpSocket.value.close()
    }
  }

  const setLoading = (value: boolean) => {
    isLoading.value = value
  }

  const setNotification = (value: any) => {
    notification.value = value
  }

  return {
    isLoading,
    setLoading,
    notification,
    setNotification,
    connectErpSocket,
    disconnectErpSocket,
    erpSocket,
  }
})
