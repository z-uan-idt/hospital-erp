export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated, isSelectedOrganization } = useAuth()
  const publicRoutes: string[] = ['login', 'register']
  const welcomeRoutes: string[] = [
    'organization-org_id',
    'organization-new',
    'organization',
    'profile',
    'error',
  ]

  if (
    !welcomeRoutes.includes(to.name) &&
    !isSelectedOrganization.value &&
    isAuthenticated.value
  ) {
    return navigateTo('/organization')
  } else if (!publicRoutes.includes(to.name) && !isAuthenticated.value) {
    return navigateTo('/login')
  }
})
