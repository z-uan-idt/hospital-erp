export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated, isSelectedOrganization } = useAuth()
  const publicRoutes: string[] = ['dang-nhap', 'dang-ky']
  const welcomeRoutes: string[] = [
    'don-vi-to-chuc-org_id',
    'don-vi-to-chuc-tao-moi',
    'thong-tin-ca-nhan',
    'don-vi-to-chuc',
    'error',
  ]

  if (
    !welcomeRoutes.includes(to.name) &&
    !isSelectedOrganization.value &&
    isAuthenticated.value
  ) {
    return navigateTo('/don-vi-to-chuc')
  } else if (!publicRoutes.includes(to.name) && !isAuthenticated.value) {
    return navigateTo('/dang-nhap')
  }
})
