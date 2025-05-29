export const useSystemStore = defineStore('system', () => {
  const isLoading = ref(false)
  const notification = ref(null)

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
  }
})
