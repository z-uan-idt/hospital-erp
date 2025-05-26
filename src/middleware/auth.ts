import {
  ROUTE_DANG_NHAP,
  ROUTE_DON_VI_TO_CHUC,
  ROUTE_THONG_TIN_CA_NHAN,
  ROUTES_QUAN_TRI_TONG,
  ROUTES_KHO_DUOC,
} from '~/constants/route.constants'

export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated, isSelectedOrganization, setSelectedOrganization } = useAuth()
  const publicRoutes: string[] = [ROUTE_DANG_NHAP.name]
  const welcomeRoutes: string[] = [
    ROUTE_DON_VI_TO_CHUC.name,
    ROUTE_DON_VI_TO_CHUC.CREATE.name,
    ROUTE_DON_VI_TO_CHUC.DETAIL.name,
    ROUTE_THONG_TIN_CA_NHAN.name,
    'error',
  ]

  // if (isAuthenticated.value) {
  //   throw createError({
  //     statusCode: 403,
  //     statusMessage: 'Bạn không có quyền truy cập vào trang này',
  //     fatal: true,
  //   })
  // }

  if (!welcomeRoutes.includes(to.name) && !isSelectedOrganization.value && isAuthenticated.value) {
    return navigateTo(ROUTE_DON_VI_TO_CHUC.path)
  } else if (!publicRoutes.includes(to.name) && !isAuthenticated.value) {
    return navigateTo(ROUTE_DANG_NHAP.path)
  }
})
