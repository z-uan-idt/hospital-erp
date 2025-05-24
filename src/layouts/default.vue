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
      :class="[mdAndUp ? 'border-0 4' : '', !isRailOpen ? 'elevation-1' : '']"
      :permanent="mdAndUp"
      :rail="mdAndUp"
      :rail-width="80"
      :width="264"
      class="pt-2 erp-scrollbar"
      style="transition: all 0.25s ease-in-out"
      @update:rail="isRailOpen = $event"
    >
      <template v-slot:prepend>
        <div class="d-flex flex-column align-center justify-center">
          <NuxtLink to="/">
            <Icon
              name="custom:logo"
              :size="60"
              style="transition: all 0.15s ease-in-out"
            />
          </NuxtLink>
        </div>
      </template>

      <div class="overflow-y-auto">
        <v-list
          density="compact"
          nav
          :class="{
            'h-100': true,
            'd-flex flex-column ga-2': true,
            'align-center justify-start pb-0 pt-0': true,
          }"
        >
          <v-list-item
            v-for="item in moduleItems"
            :value="item.name"
            :rounded="isRailOpen && mdAndUp ? 'pill' : 'xl'"
            :width="isRailOpen && mdAndUp ? 40 : '100%'"
            :height="40"
            class="select-none"
            :class="{
              'border border-opacity-25': isRailOpen && mdAndUp,
              'border-success': item.path === $route.path,
            }"
            variant="elevated"
            color="erp-brand"
            active-class="erp-brand"
            elevation="0"
            :active="item.path === $route.path"
            :to="item.path"
            nuxt
          >
            <template #prepend="{ isActive }">
              <v-icon
                :size="isRailOpen && mdAndUp ? item.iconSize : 20"
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
      </div>

      <template v-slot:append>
        <div
          :class="[
            'pa-2 mb-6 d-flex flex-column w-auto mt-2',
            'ga-3 align-center justify-center',
          ]"
        >
          <v-avatar
            size="48"
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
            <div
              class="text-body-1 font-weight-medium text-erp-gray-800 cursor-pointer select-none text-truncate"
              style="text-shadow: 0 0 8px rgba(0, 0, 0, 0.3)"
              :style="{
                width: isRailOpen && mdAndUp ? '30% !important' : '',
              }"
              @click="navigateTo(ROUTE_THONG_TIN_CA_NHAN.path)"
            >
              {{ userData?.full_name }}
            </div>

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
      class="pe-4"
    >
      <v-app-bar-nav-icon
        v-if="!mdAndUp"
        variant="text"
        @click.stop="isDrawerOpen = !isDrawerOpen"
      />

      <v-spacer />

      <div class="d-flex align-center justify-end ga-3 w-100">
        <slot name="app-bar-right" />

        <v-list-item
          class="position-relative d-flex align-center justify-between select-none border pe-0 bg-erp-brand-50"
          :class="[!mdAndUp ? 'ps-0' : '']"
          elevation="0"
          rounded="lg"
          height="40"
          density="compact"
          exact
        >
          <template #prepend>
            <v-icon
              v-if="mdAndUp"
              class="me-n6"
              size="20"
            >
              custom-house
            </v-icon>
          </template>
          <template #title>
            <div
              v-if="mdAndUp"
              class="me-4 text-body-2 font-weight-medium text-truncate"
              style="margin-top: 1px"
            >
              <span>{{ organizationSelected?.name }}</span>
            </div>
          </template>
          <template #append>
            <v-btn
              icon
              color="erp-brand-600"
              variant="elevated"
              elevation="0"
              height="40"
              width="48"
              :class="[mdAndUp ? 'rounded-e-lg rounded-s-0' : 'rounded-lg']"
              :to="ROUTE_DON_VI_TO_CHUC.path"
              nuxt
            >
              <v-icon size="18">custom-right-from-line</v-icon>
            </v-btn>
          </template>
        </v-list-item>
      </div>
    </v-app-bar>

    <v-main class="h-screen pt-17">
      <div
        class="pa-4 h-100 overflow-y-auto erp-scrollbar ps-md-4 ps-0 pe-md-4 pe-0 pb-0"
      >
        <div
          class="bg-white position-relative"
          :class="[mdAndUp ? 'rounded-lg' : 'rounded-0']"
          style="min-height: 100%"
        >
          <slot />
        </div>
      </div>
    </v-main>
  </v-container>
</template>

<script setup lang="ts">
  import {
    ROUTE_DANH_SACH_THUOC,
    ROUTE_DON_THUOC,
    ROUTE_DON_VI_TO_CHUC,
    ROUTE_KHO_TRUC_THUOC,
    ROUTE_LO_HANG,
    ROUTE_NHAN_VIEN,
    ROUTE_PHIEU_CHUYEN_HANG,
    ROUTE_PHIEU_KIEM_KHO,
    ROUTE_PHIEU_LINH,
    ROUTE_PHIEU_NHAP_KHO,
    ROUTE_PHIEU_XUAT_KHO,
    ROUTE_THONG_TIN_CA_NHAN,
    ROUTE_DON_VI_TINH,
    ROUTE_DANH_SACH_KHOA,
  } from '~/constants/route.constants'

  const { $vuetify } = useNuxtApp()
  const { userData, onLogout, organizationSelected } = useAuth()
  const sessionCookie = useCookie('session_id')

  const isDrawerOpen = ref(false)
  const isRailOpen = ref(true)
  const mdAndUp = computed(() => $vuetify.display.mdAndUp.value)

  const moduleItems = [
    {
      iconStyle: 'margin-left: 2px !important',
      iconSize: 18,
      icon: 'custom-chart-simple',
      name: 'Tổng quan',
      path: '/',
    },
    {
      iconStyle: 'margin-left: 3px !important',
      iconSize: 18,
      icon: 'custom-list-timeline',
      name: 'Đơn thuốc',
      path: ROUTE_DON_THUOC.path,
    },
    {
      iconStyle: 'margin-top: 1px !important; margin-left: 2px !important',
      iconSize: 22,
      icon: 'custom-box-circle-check',
      name: 'Phiếu lĩnh',
      path: ROUTE_PHIEU_LINH.path,
    },
    {
      iconStyle: 'margin-top: 1px !important; margin-left: 0px !important',
      iconSize: 23,
      icon: 'custom-box-open',
      name: 'Lô hàng',
      path: ROUTE_LO_HANG.path,
    },
    {
      iconStyle: 'margin-top: 1px !important; margin-left: 2px !important',
      iconSize: 22,
      icon: 'custom-capsules',
      name: 'Danh sách thuốc',
      path: ROUTE_DANH_SACH_THUOC.path,
    },
    {
      iconStyle: 'margin-top: 1px !important; margin-left: 2px !important',
      iconSize: 18,
      icon: 'custom-bars',
      name: 'Đơn vị tính',
      path: ROUTE_DON_VI_TINH.path,
    },
    {
      iconStyle: 'margin-left: 0px !important; margin-top: -1px !important',
      iconSize: 22,
      icon: 'custom-circle-arrow-down-right',
      name: 'Phiếu nhập kho',
      path: ROUTE_PHIEU_NHAP_KHO.path,
    },
    {
      iconStyle: 'margin-left: 0px !important; margin-top: 0px !important',
      iconSize: 22,
      icon: 'custom-circle-arrow-up-left',
      name: 'Phiếu xuất kho',
      path: ROUTE_PHIEU_XUAT_KHO.path,
    },
    {
      iconStyle: 'margin-left: 2px !important',
      iconSize: 19,
      icon: 'custom-arrow-right-arrow-left',
      name: 'Phiếu chuyển hàng',
      path: ROUTE_PHIEU_CHUYEN_HANG.path,
    },
    {
      iconStyle: 'margin-left: 2px !important;',
      iconSize: 20,
      icon: 'custom-shield-check',
      name: 'Phiếu kiểm kho',
      path: ROUTE_PHIEU_KIEM_KHO.path,
    },
    {
      iconStyle: 'margin-top: -2px; margin-left: 1px !important',
      iconSize: 20,
      icon: 'custom-house-medical',
      name: 'Danh sách khoa',
      path: ROUTE_DANH_SACH_KHOA.path,
    },
    {
      iconStyle: 'margin-top: -3px; margin-left: 2px !important',
      iconSize: 20,
      icon: 'custom-warehouse-full',
      name: 'Kho trực thuộc',
      path: ROUTE_KHO_TRUC_THUOC.path,
    },
    {
      iconStyle: 'margin-top: -3px; margin-left: 2px !important',
      iconSize: 18,
      icon: 'custom-user',
      name: 'Nhân viên',
      path: ROUTE_NHAN_VIEN.path,
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
