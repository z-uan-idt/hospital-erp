export const useSystemStore = defineStore('system', () => {
  const isLoading = ref(false)
  const isReloadWelcome = ref(false)
  const reloadWelcomeData = ref(null)

  const setLoading = (value: boolean) => {
    isLoading.value = value
  }

  const setReloadWelcome = (value: boolean) => {
    isReloadWelcome.value = value
  }

  const setReloadWelcomeData = (value: any) => {
    reloadWelcomeData.value = value
  }

  return {
    isLoading,
    setLoading,
    isReloadWelcome,
    setReloadWelcome,
    reloadWelcomeData,
    setReloadWelcomeData,
  }
})
