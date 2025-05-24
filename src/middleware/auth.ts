import {
  ROUTE_DON_VI_TO_CHUC,
  ROUTE_FORGOT_PASSWORD,
  ROUTE_LOGIN,
  ROUTE_REGISTER,
  ROUTE_RESET_PASSWORD,
  ROUTE_THONG_TIN_CA_NHAN,
  ROUTE_VERIFY_EMAIL,
  ROUTE_VERIFY_OTP,
  ROUTE_VERIFY_PHONE,
} from '~/constants/route.constants'

export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated, isSelectedOrganization } = useAuth()
  const publicRoutes: string[] = [
    ROUTE_LOGIN.name,
    ROUTE_REGISTER.name,
    ROUTE_FORGOT_PASSWORD.name,
    ROUTE_RESET_PASSWORD.name,
    ROUTE_VERIFY_EMAIL.name,
    ROUTE_VERIFY_PHONE.name,
    ROUTE_VERIFY_OTP.name,
  ]
  const welcomeRoutes: string[] = [
    ROUTE_DON_VI_TO_CHUC.name,
    ROUTE_DON_VI_TO_CHUC.CREATE.name,
    ROUTE_DON_VI_TO_CHUC.DETAIL.name,
    ROUTE_THONG_TIN_CA_NHAN.name,
    'error',
  ]

  if (
    !welcomeRoutes.includes(to.name) &&
    !isSelectedOrganization.value &&
    isAuthenticated.value
  ) {
    return navigateTo(ROUTE_DON_VI_TO_CHUC.path)
  } else if (!publicRoutes.includes(to.name) && !isAuthenticated.value) {
    return navigateTo(ROUTE_LOGIN.path)
  }
})
