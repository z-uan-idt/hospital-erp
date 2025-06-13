import type { IAccount } from '~/types/account.types'
import type { ILoginPayload } from '~/types/auth.types'

import * as apiConstants from '~/constants/api.constants'
import { ROUTE_DANG_NHAP } from '~/constants/route.constants'

import type { IOrganization } from '~/types/oranization.types'
import type { IMedicalProductType } from '~/types/medical_product.types'

export const useAuth = () => {
  const fetchApi = usePublicApi()
  const { $toast } = useNuxtApp()
  const fetchPrivateApi = usePrivateApi()
  const userCookie = useCookie('user', {
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })
  const accessTokenCookie = useCookie('access_token', {
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })
  const refreshTokenCookie = useCookie('refresh_token', {
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })
  const isEmptyOrganization = useCookie('is_not_org')
  const selectedOrganization = useCookie('o_data')
  const selectedDepartment = useCookie('d_id')
  const selectedWarehouse = useCookie('w_id')
  const selectedMedicalProductType = useCookie<IMedicalProductType>('mp_type', {
    default: () => 'THUOC',
  })

  const isSelectedOrganization = computed(() => {
    return !!selectedOrganization.value
  })

  const setSelectedMedicalProductType = (type: IMedicalProductType) => {
    selectedMedicalProductType.value = type
  }

  const setSelectedDepartment = (departmentId: string | number | null) => {
    selectedDepartment.value = departmentId?.toString()
  }

  const setSelectedWarehouse = (warehouseId: string | number | null) => {
    selectedWarehouse.value = warehouseId?.toString()
  }

  const setSelectedOrganization = (organizationCode: string | null) => {
    selectedOrganization.value = organizationCode
  }

  const organizationSelected: Ref<IOrganization | null> = computed(() => {
    if (!selectedOrganization.value) return null
    try {
      return JSON.parse(selectedOrganization.value)
    } catch (error) {
      return selectedOrganization.value || null
    }
  })

  const departmentSelected: Ref<string | number> = computed(() => {
    return selectedDepartment.value
  })

  const warehouseSelected: Ref<string | number> = computed(() => {
    return selectedWarehouse.value
  })

  const isAuthenticated = computed(() => {
    return !!accessTokenCookie.value
  })

  const userData: Ref<IAccount | null> = computed(() => {
    try {
      if (!userCookie.value) return null
      return JSON.parse(userCookie.value)
    } catch (error) {
      return userCookie.value || null
    }
  })

  const setUserData = (data: IAccount) => {
    userCookie.value = JSON.stringify(data)
  }

  const onLogout = async () => {
    fetchApi.get('api/v1/auth/logout', {
      token: refreshTokenCookie.value,
    })

    selectedMedicalProductType.value = null
    selectedOrganization.value = null
    isEmptyOrganization.value = null
    selectedDepartment.value = null
    selectedWarehouse.value = null
    refreshTokenCookie.value = null
    accessTokenCookie.value = null
    userCookie.value = null

    await navigateTo(ROUTE_DANG_NHAP.path)
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

  const onLogin = async (payload: ILoginPayload, onError?: (message: string) => void) => {
    selectedMedicalProductType.value = null
    selectedOrganization.value = null
    isEmptyOrganization.value = null
    selectedDepartment.value = null
    selectedWarehouse.value = null
    refreshTokenCookie.value = null
    accessTokenCookie.value = null
    userCookie.value = null

    const defaultErrorMessage = 'Hệ thống gặp sự cố, vui lòng thử lại sau'

    try {
      const { data: response } = await fetchApi.post('api/v1/auth/login', payload)
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

  const onFetchCurrentUser = async () => {
    const { data: response } = await fetchPrivateApi.get('api/v1/auth/current-user')
    if (response.code === 0) {
      setUserData(response.data)
    }
  }

  const onUpdateCurrentUser = async (
    formData: FormData,
    onSuccess: (account: IAccount) => void,
    onError: (error: string) => void
  ) => {
    const { data: response } = await fetchApi.post<IAccount>('api/v1/auth/current-user', formData, {
      headers: {
        'Content-Type': apiConstants.API_CONTENT_TYPE_MULTIPART_FORM_DATA,
      },
    })

    if (response.success) {
      onSuccess(response.data)
    } else {
      onError(response.message)
    }
  }

  const onUpdateOrCreateDevice = () => {
    fetchPrivateApi.get('api/v1/auth/update-or-create-device')
  }

  return {
    isAuthenticated,
    userData,
    onLogin,
    onLogout,
    setAuthData,
    onUpdateOrCreateDevice,
    setUserData,
    onFetchCurrentUser,
    onUpdateCurrentUser,
    isSelectedOrganization,
    setSelectedOrganization,
    organizationSelected,
    setSelectedDepartment,
    setSelectedWarehouse,
    departmentSelected,
    warehouseSelected,
    setSelectedMedicalProductType,
    selectedMedicalProductType,
  }
}
