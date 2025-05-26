<template>
  <v-container
    class="d-flex flex-row align-start pa-0 align-stretch"
    fluid
  >
    <v-navigation-drawer
      v-model="isDrawerOpen"
      :absolute="false"
      :color="$vuetify.display.mdAndUp.value ? 'transparent' : 'white'"
      :class="$vuetify.display.mdAndUp.value ? 'border-0' : ''"
      :permanent="$vuetify.display.mdAndUp.value"
      :rail="!$vuetify.display.mdAndUp.value"
      rail-width="264"
      width="264"
      class="pt-7"
    >
      <div class="d-flex flex-column align-center justify-center">
        <NuxtLink to="/">
          <Icon
            name="custom:logo"
            size="159"
            class="mb-12"
          />
        </NuxtLink>
      </div>

      <template v-slot:append>
        <div :class="['pa-2 mb-6 d-flex flex-column w-auto', 'ga-3 align-center justify-center']">
          <v-avatar
            size="58"
            variant="outlined"
            color="grey-lighten-1"
            class="d-flex align-center bg-white justify-center cursor-pointer select-none"
            style="user-select: none"
            @click="navigateTo(ROUTE_THONG_TIN_CA_NHAN.path)"
          >
            <v-img
              v-if="userData?.avatar"
              :src="userData?.avatar"
              class="position-absolute top-0 left-0"
            />
            <span
              class="text-blue-grey-darken-3 text-lg-h5 text-h6 font-weight-bold"
              style="margin-bottom: -2px"
            >
              {{ userData?.full_name.charAt(0).toUpperCase() }}
            </span>
          </v-avatar>

          <div class="d-flex flex-column ga-2 align-center justify-center">
            <p
              class="text-body-1 font-weight-medium text-erp-gray-800 cursor-pointer select-none"
              style="min-width: max-content; text-shadow: 0 0 8px rgba(0, 0, 0, 0.3)"
              @click="navigateTo(ROUTE_THONG_TIN_CA_NHAN.path)"
            >
              {{ userData?.full_name }}
            </p>
            <v-btn
              variant="outlined"
              color="grey-darken-1"
              class="rounded-xl pe-4 text-body-1 bg-white mt-1"
              @click="onLogout"
            >
              <template #prepend>
                <Icon
                  name="custom:arrowleft-from-line"
                  class="text-red me-n1"
                  style="width: 16px; height: 16px"
                />
              </template>
              <span class="text-red">Đăng xuất</span>
            </v-btn>
          </div>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar
      :model-value="!$vuetify.display.mdAndUp.value"
      color="white"
      elevation="0"
      height="72"
    >
      <v-app-bar-nav-icon
        @click.stop="isDrawerOpen = !isDrawerOpen"
        variant="text"
      />
    </v-app-bar>

    <v-main class="h-screen pt-md-6">
      <div
        class="bg-white h-100 border-s border-t"
        :class="$vuetify.display.mdAndUp.value ? 'rounded-ts-xl' : ''"
      >
        <div class="h-100 overflow-y-auto erp-scrollbar">
          <slot />
        </div>
      </div>
    </v-main>
  </v-container>
</template>

<script setup lang="ts">
  import { ROUTE_THONG_TIN_CA_NHAN } from '~/constants/route.constants'

  const { $vuetify } = useNuxtApp()
  const { userData, onLogout } = useAuth()
  const sessionCookie = useCookie('session_id')

  const isDrawerOpen = ref(false)

  watchEffect(() => {
    isDrawerOpen.value = $vuetify.display.mdAndUp.value
  })

  useHead({
    titleTemplate(title?: string) {
      return title ? `${title} - Hospital ERP` : 'Hospital ERP'
    },
    meta: [
      {
        name: 'description',
        content: 'Hospital ERP - Hệ thống quản lý kho bệnh viện',
      },
    ],
  })

  onMounted(() => {
    sessionCookie.value = null
  })
</script>
