import {
  ROUTE_DON_VI_TO_CHUC,
  ROUTE_DANG_NHAP,
  ROUTE_THONG_TIN_CA_NHAN,
} from '~/constants/route.constants'

export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated, isSelectedOrganization } = useAuth()
  const publicRoutes: string[] = [ROUTE_DANG_NHAP.name]
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
    return navigateTo(ROUTE_DANG_NHAP.path)
  }
})
