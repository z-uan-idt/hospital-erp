import type { ILoginPayload } from '~/types/auth.types'

export const useAuth = () => {
  const fetchApi = usePublicApi()
  const { $toast } = useNuxtApp()
  const userCookie = useCookie('user', {
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })
  const accessTokenCookie = useCookie('access_token', {
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })
  const refreshTokenCookie = useCookie('refresh_token', {
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })

  const isAuthenticated = computed(() => {
    return !!accessTokenCookie.value
  })

  const userData = computed(() => {
    try {
      if (!userCookie.value) return null
      return JSON.parse(userCookie.value)
    } catch (error) {
      return userCookie.value || null
    }
  })

  const onLogout = async () => {
    fetchApi.get('api/v1/auth/logout', {
      token: refreshTokenCookie.value,
    })

    refreshTokenCookie.value = null
    accessTokenCookie.value = null
    userCookie.value = null

    await navigateTo('/login')
    $toast.success('Thành công', {
      description: 'Đăng xuất thành công',
      duration: 5000,
    })
  }

  const setAuthData = (data: any) => {
    refreshTokenCookie.value = data.refresh_token
    accessTokenCookie.value = data.access_token
    userCookie.value = data.user
  }

  const onLogin = async (
    payload: ILoginPayload,
    onError?: (message: string) => void
  ) => {
    const defaultErrorMessage = 'Hệ thống gặp sự cố, vui lòng thử lại sau'

    try {
      const { data: response } = await fetchApi.post(
        'api/v1/auth/login',
        payload
      )
      if (response.code === 0) {
        refreshTokenCookie.value = response.data.refresh_token
        accessTokenCookie.value = response.data.access_token
        userCookie.value = response.data.user

        await navigateTo('/')

        $toast.success('Thành công', {
          description: 'Đăng nhập thành công',
          duration: 5000,
        })
      } else {
        const message = response?.message || defaultErrorMessage
        onError?.(message)
      }
    } catch {
      $toast.error('Thất bại', {
        description: defaultErrorMessage,
      })
    }
  }

  const onUpdateOrCreateDevice = () => {
    fetchApi.get('api/v1/auth/update-or-create-device')
  }

  return {
    isAuthenticated,
    userData,
    onLogin,
    onLogout,
    setAuthData,
    onUpdateOrCreateDevice,
  }
}
