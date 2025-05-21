export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return

  const { isAuthenticated } = useAuth()
  const publicRoutes: string[] = ['login', 'register']
  const welcomeRoutes: string[] = [
    'organization-create',
    'organization-id',
    'welcome',
  ]
  const organizationSelected = useCookie('selected_organization')

  if (
    !welcomeRoutes.includes(to.name) &&
    !organizationSelected.value &&
    isAuthenticated.value
  ) {
    return navigateTo('/welcome')
  } else if (!publicRoutes.includes(to.name) && !isAuthenticated.value) {
    return navigateTo('/login')
  }
})
