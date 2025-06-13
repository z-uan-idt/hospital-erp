export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig()
  return {
    provide: {
      api: new ApiService(runtimeConfig),
    },
  }
})
