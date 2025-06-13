export const useWebSocket = (path: string = 'ws') => {
  const isConnected = ref(false)
  const ws = ref<WebSocket | null>(null)
  const runtimeConfig = useRuntimeConfig()
  const message = ref<{ [key: string]: any } | null>(null)

  const connect = (code: string) => {
    ws.value = new WebSocket(`${runtimeConfig.public.wsBaseUrl}/${path}/${code}/`)

    ws.value.onopen = () => {
      isConnected.value = true
    }

    ws.value.onmessage = (event) => {
      const data = JSON.parse(event.data)
      message.value = {
        [data.type]: data.data,
      }
    }

    ws.value.onclose = () => {
      isConnected.value = false
    }

    ws.value.onerror = () => {
      isConnected.value = false
    }

    return ws.value
  }

  const disconnect = () => {
    if (ws.value) {
      ws.value.close()
      ws.value = null
    }
  }

  return {
    connect,
    disconnect,
    isConnected,
    message,
  }
}
