<template>
  <v-container
    class="d-flex flex-row align-start pa-0 align-stretch erp-scrollbar"
    fluid
  >
    <v-navigation-drawer
      v-model="isDrawerOpen"
      :absolute="false"
      expand-on-hover
      color="white"
      :class="[mdAndUp ? 'border-0 4' : '', !isRailOpen ? 'elevation-5' : '']"
      :permanent="mdAndUp"
      :rail="mdAndUp"
      :rail-width="104"
      :width="264"
      class="pt-4 erp-scrollbar"
      style="transition: all 0.25s ease-in-out"
      @update:rail="isRailOpen = $event"
    >
      <template v-slot:prepend>
        <div class="d-flex flex-column align-center justify-center mb-2">
          <NuxtLink to="/">
            <Icon
              name="custom:logo"
              :size="!isRailOpen || !mdAndUp ? 100 : 80"
              style="transition: all 0.15s ease-in-out"
            />
          </NuxtLink>
        </div>
      </template>

      <v-list
        density="comfortable"
        nav
        :class="{
          'd-flex flex-column ga-2 mt-3': isRailOpen && mdAndUp,
          'align-center justify-center': isRailOpen && mdAndUp,
        }"
      >
        <v-list-item
          v-for="item in moduleItems"
          :value="item.name"
          :rounded="isRailOpen && mdAndUp ? 'pill' : 'lg'"
          :variant="isRailOpen && mdAndUp ? 'elevated' : 'elevated'"
          :width="isRailOpen && mdAndUp ? 45 : '100%'"
          :height="isRailOpen && mdAndUp ? 45 : 'auto'"
          class="select-none"
          :class="[isRailOpen && mdAndUp ? 'border border-opacity-25' : '']"
          color="erp-brand-600"
          active-class="erp-brand-700"
          elevation="0"
        >
          <template #prepend="{ isActive }">
            <v-icon
              :size="isRailOpen && mdAndUp ? item.iconSize : 22"
              :class="[
                isRailOpen && mdAndUp ? 'ms-1' : 'me-n4 ms-6',
                isActive ? 'text-white' : 'text-black',
              ]"
              :style="isRailOpen && mdAndUp ? item.iconStyle : ''"
            >
              {{ item.icon }}
            </v-icon>
          </template>
          <v-list-item-title
            class="text-body-2"
            style="margin-top: 1px"
          >
            {{ item.name }}
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <div
          :class="[
            'pa-2 mb-6 d-flex flex-column w-auto mt-2',
            'ga-3 align-center justify-center',
          ]"
        >
          <v-avatar
            size="58"
            variant="outlined"
            color="grey-lighten-1"
            class="d-flex align-center bg-white justify-center cursor-pointer select-none"
            style="user-select: none"
            @click="navigateTo('/profile')"
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
              v-if="!isRailOpen || !mdAndUp"
              class="text-body-1 font-weight-medium text-erp-gray-800 cursor-pointer select-none"
              style="
                min-width: max-content;
                text-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
              "
              @click="navigateTo('/profile')"
            >
              {{ userData?.full_name }}
            </p>

            <v-btn
              :icon="isRailOpen && mdAndUp"
              variant="outlined"
              color="grey-darken-1"
              class="rounded-xl pe-4 text-body-1 bg-white mt-1"
              :density="isRailOpen && mdAndUp ? 'comfortable' : 'default'"
              :slim="isRailOpen && mdAndUp"
              @click="onLogout"
            >
              <Icon
                v-if="isRailOpen && mdAndUp"
                name="custom:arrowleft-from-line"
                class="text-red me-n1"
                style="width: 18px; height: 18px"
              />
              <template #prepend>
                <Icon
                  name="custom:arrowleft-from-line"
                  class="text-red me-n1"
                  style="width: 16px; height: 16px"
                />
              </template>
              <span
                class="text-red"
                :class="isRailOpen && mdAndUp ? 'opacity-0 w-0' : ''"
              >
                Đăng xuất
              </span>
            </v-btn>
          </div>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar
      color="white"
      elevation="0"
      height="72"
    >
      <v-app-bar-nav-icon
        v-if="!mdAndUp"
        variant="text"
        @click.stop="isDrawerOpen = !isDrawerOpen"
      />

      <v-app-bar-title>
        {{ organizationSelected?.name }}
      </v-app-bar-title>
    </v-app-bar>

    <v-main class="h-screen pt-17">
      <div class="pa-4 h-100 overflow-y-auto erp-scrollbar">
        <div class="bg-white rounded-lg">
          <slot />
        </div>
      </div>
    </v-main>
  </v-container>
</template>

<script setup lang="ts">
  const { $vuetify } = useNuxtApp()
  const { userData, onLogout, organizationSelected } = useAuth()
  const sessionCookie = useCookie('session_id')

  const isDrawerOpen = ref(false)
  const isRailOpen = ref(true)
  const mdAndUp = computed(() => $vuetify.display.mdAndUp.value)

  const moduleItems = [
    {
      iconStyle: 'margin-left: 4px !important',
      iconSize: 19,
      icon: 'custom-chart-simple',
      name: 'Tổng quan',
    },
    {
      iconStyle: 'margin-left: 5px !important',
      iconSize: 18,
      icon: 'custom-list-timeline',
      name: 'Đơn thuốc',
    },
    {
      iconStyle: 'margin-top: 1px !important; margin-left: 3px !important',
      iconSize: 23,
      icon: 'custom-box-circle-check',
      name: 'Phiếu lĩnh',
    },
    {
      iconStyle: 'margin-top: 1.5px !important; margin-left: 1px !important',
      iconSize: 25,
      icon: 'custom-box-open',
      name: 'Lô hàng',
    },
    {
      iconStyle: 'margin-top: 1px !important; margin-left: 2px !important',
      iconSize: 25,
      icon: 'custom-capsules',
      name: 'Danh sách thuốc',
    },
    {
      iconStyle: 'margin-top: 1px !important; margin-left: 3px !important',
      iconSize: 20,
      icon: 'custom-bars',
      name: 'Đơn vị tính',
    },
    {
      iconStyle: 'margin-left: 2px !important; margin-top: -1px !important',
      iconSize: 24,
      icon: 'custom-circle-arrow-down-right',
      name: 'Phiếu nhập kho',
    },
    {
      iconStyle: 'margin-left: 2px !important; margin-top: 0px !important',
      iconSize: 24,
      icon: 'custom-circle-arrow-up-left',
      name: 'Phiếu xuất kho',
    },
    {
      iconStyle: '',
      iconSize: 19,
      icon: 'custom-arrow-right-arrow-left',
      name: 'Phiếu chuyển hàng',
    },
    {
      iconStyle: 'margin-left: 2px !important;',
      iconSize: 23,
      icon: 'custom-shield-check',
      name: 'Phiếu kiểm kho',
    },
    {
      iconStyle: 'margin-top: -3px; margin-left: 2px !important',
      iconSize: 23,
      icon: 'custom-warehouse-full',
      name: 'Kho trực thuộc',
    },
    {
      iconStyle: 'margin-top: -3px; margin-left: 4px !important',
      iconSize: 21,
      icon: 'custom-user',
      name: 'Nhân viên',
    },
  ]

  watchEffect(() => {
    isDrawerOpen.value = mdAndUp.value
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
