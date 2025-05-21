export const usePrivateApi = () => {
  const { $api, $deviceId } = useNuxtApp()
  const accessToken = useCookie('access_token')
  $api.setAuthToken(accessToken.value || null)
  $api.setDeviceId($deviceId.value || null)
  $api.setAppCode('HOSPITAL_ERP')
  return $api
}

export const usePublicApi = () => {
  return useNuxtApp()?.$api
}
