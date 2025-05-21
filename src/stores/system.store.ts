export const useSystemStore = defineStore('system', () => {
  const isLoading = ref(false)

  const setLoading = (value: boolean) => {
    isLoading.value = value
  }

  return {
    isLoading,
    setLoading,
  }
})
