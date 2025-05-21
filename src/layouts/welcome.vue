<template>
  <v-container
    fluid
    class="d-flex flex-row align-start pa-0 align-stretch"
  >
    <v-navigation-drawer
      :model-value="!!$vuetify.display.mdAndUp"
      :absolute="false"
      :color="$vuetify.display.mdAndUp.value ? 'background' : 'white'"
      :class="$vuetify.display.mdAndUp.value ? 'border-0' : ''"
      :permanent="!$vuetify.display.mdAndUp"
      :rail="!$vuetify.display.mdAndUp.value"
      rail-width="257"
      width="257"
      class="pt-7"
    >
      <div class="d-flex flex-column align-center justify-center">
        <Icon
          name="custom:logo"
          size="159"
          class="mb-12"
        />
      </div>

      <template v-slot:append>
        <div
          class="pa-2 pb-10 d-flex flex-column ga-3 align-center justify-center"
        >
          <v-avatar
            size="58"
            variant="outlined"
            color="grey-lighten-1"
            class="d-flex align-center bg-white justify-center"
            style="user-select: none; pointer-events: none"
          >
            <v-img
              v-if="userData?.avatar"
              :src="userData?.avatar"
              class="position-absolute top-0 left-0"
            />
            <span
              class="text-blue-grey-darken-3 text-lg-h4 text-h6 font-weight-bold"
            >
              {{ userData?.full_name.charAt(0).toUpperCase() }}
            </span>
          </v-avatar>
          <div class="d-flex flex-column ga-2 align-center justify-center">
            <p
              class="text-body-1"
              style="min-width: max-content"
            >
              {{ userData?.full_name }}
            </p>
            <v-btn
              variant="outlined"
              color="grey-darken-1"
              class="rounded-xl pe-4 text-body-1 bg-white"
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
    <v-main class="min-h-screen pt-md-6">
      <div
        :class="[
          'bg-white h-100',
          {
            'rounded-ts-xl border-s border-t': $vuetify.display.mdAndUp.value,
          },
        ]"
      >
        <slot />
      </div>
    </v-main>
  </v-container>
</template>

<script setup lang="ts">
  const { $vuetify } = useNuxtApp()
  const { userData, onLogout } = useAuth()
  const sessionCookie = useCookie('session_id')

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
