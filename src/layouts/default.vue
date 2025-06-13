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
        <div class="d-flex flex-column align-center justify-center mb-3">
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
            }"
            variant="elevated"
            color="erp-brand"
            active-class="erp-brand"
            elevation="0"
            :to="item.path"
            nuxt
            exact
          >
            <template #prepend="{ isActive }">
              <v-icon
                :size="isRailOpen && mdAndUp ? item.iconSize : 20"
                :class="[isRailOpen && mdAndUp ? 'ms-1' : 'me-n4 ms-6', isActive ? 'text-white' : 'text-black']"
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
        <div :class="['pa-2 mb-6 d-flex flex-column w-auto mt-2', 'ga-3 align-center justify-center']">
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

      <div class="d-flex align-center justify-end w-100">
        <slot name="app-bar-right" />

        <div
          v-if="isKhoDuoc && $vuetify.display.smAndUp.value"
          class="d-flex align-center"
        >
          <v-select
            v-model="warehouseId"
            :items="warehouseDropdown"
            label="Kho"
            height="40"
            density="compact"
            variant="outlined"
            placeholder="Chọn kho"
            hide-details
            elevation="0"
            rounded="s-lg e-0"
            style="max-width: max-content; min-width: 300px"
            item-title="name"
            item-value="id"
            :loading="isLoadingWarehouse"
          />
          <v-select
            v-model="departmentId"
            :items="departmentDropdown"
            label="Khoa"
            height="40"
            density="compact"
            placeholder="Chọn khoa"
            variant="outlined"
            hide-details
            elevation="0"
            rounded="0"
            style="max-width: max-content; min-width: 200px; margin-left: -1px"
            item-title="name"
            item-value="id"
            :loading="isLoading"
            @update:model-value="onChangeDepartment"
          />
        </div>
        <v-list-item
          class="position-relative d-flex align-center justify-between select-none border-opacity-25 border pe-0 bg-erp-brand-50"
          :class="[!mdAndUp ? 'ps-0' : '']"
          elevation="0"
          :rounded="isKhoDuoc && $vuetify.display.smAndUp.value ? 's-0 e-lg' : 'lg'"
          height="40"
          density="compact"
          exact
          style="margin-left: -1px"
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
              :rounded="isKhoDuoc && $vuetify.display.smAndUp.value ? 's-0 e-lg' : 'lg'"
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
        v-if="isKhoDuoc && $vuetify.display.smAndDown.value"
        class="d-flex align-center mt-4 ga-2 justify-space-between px-2"
      >
        <v-select
          v-model="warehouseId"
          :items="warehouseDropdown"
          label="Kho"
          height="40"
          density="compact"
          variant="outlined"
          placeholder="Chọn kho"
          hide-details
          elevation="0"
          item-title="name"
          item-value="id"
          :loading="isLoadingWarehouse"
        />
        <v-select
          v-model="departmentId"
          :items="departmentDropdown"
          label="Khoa"
          height="40"
          density="compact"
          placeholder="Chọn khoa"
          variant="outlined"
          hide-details
          elevation="0"
          item-title="name"
          item-value="id"
          :loading="isLoading"
          @update:model-value="onChangeDepartment"
        />
      </div>

      <v-container
        class="h-100 overflow-y-auto erp-scrollbar ps-md-4 ps-0 pe-md-4 pe-0 pb-0"
        fluid
      >
        <div
          class="position-relative"
          :class="[
            mdAndUp ? 'rounded-t-lg' : 'rounded-0',
            {
              'bg-white': !noBackground,
            },
          ]"
          style="min-height: 100%"
        >
          <slot />
        </div>
      </v-container>
    </v-main>
  </v-container>

  <v-overlay
    :model-value="isLoading || isLoadingWarehouse"
    class="d-flex justify-center align-center"
    persistent
  >
    <v-progress-circular
      indeterminate
      size="80"
    />
  </v-overlay>
</template>

<script setup lang="ts">
  import {
    ROUTE_DANH_MUC_HANG_HOA,
    ROUTE_DON_THUOC,
    ROUTE_DON_VI_TO_CHUC,
    ROUTE_KHO_TRUC_THUOC,
    ROUTE_NHAN_VIEN,
    ROUTE_PHIEU_CHUYEN_HANG,
    ROUTE_PHIEU_KIEM_KHO,
    ROUTE_PHIEU_LINH,
    ROUTE_PHIEU_NHAP_KHO,
    ROUTE_PHIEU_XUAT_KHO,
    ROUTE_THONG_TIN_CA_NHAN,
    ROUTE_DANH_SACH_KHOA,
    QUAN_TRI_TONG_PREFIX,
    KHO_DUOC_PREFIX,
    ROUTE_TON_KHO,
    ROUTE_PHIEU_TRA,
    KHAM_CHUA_BENH_PREFIX,
  } from '~/constants/route.constants'
  import type { IDepartment } from '~/types/department.types'
  import type { IWarehouse } from '~/types/warehouse.types'

  const { $vuetify } = useNuxtApp()
  const { userData, onLogout, organizationSelected, warehouseSelected, departmentSelected } = useAuth()
  const sessionCookie = useCookie('session_id')

  const systemStore = useSystemStore()

  const webSocket = useWebSocket('ws/erp')

  const noBackground = ref(false)

  provide('noBackground', noBackground)

  watch(
    warehouseSelected,
    async () => {
      if (warehouseSelected.value) {
        webSocket.connect(`${warehouseSelected.value}`)
      }
    },
    {
      immediate: true,
    }
  )

  onUnmounted(() => {
    webSocket.disconnect()
  })

  watch(
    webSocket.message,
    (newVal) => {
      systemStore.setRealtimeERPMessage(newVal)
    },
    {
      deep: true,
    }
  )

  const router = useRouter()
  const isLoading = ref(false)
  const isLoadingWarehouse = ref(false)
  const isRailOpen = ref(true)
  const isDrawerOpen = ref(false)
  const mdAndUp = computed(() => $vuetify.display.mdAndUp.value)

  const isKhamChuaBenh = computed(() => router.currentRoute.value.fullPath.startsWith(KHAM_CHUA_BENH_PREFIX.path))

  const isQuanTriTong = computed(() => router.currentRoute.value.fullPath.startsWith(QUAN_TRI_TONG_PREFIX.path))

  const isKhoDuoc = computed(() => router.currentRoute.value.fullPath.startsWith(KHO_DUOC_PREFIX.path))

  const moduleItems = computed(() => {
    if (isQuanTriTong.value) {
      return [
        {
          iconStyle: 'margin-left: 2px !important',
          iconSize: 18,
          icon: 'custom-chart-simple',
          name: 'Tổng quan',
          path: QUAN_TRI_TONG_PREFIX.path,
          isActive: true,
        },
        {
          iconStyle: 'margin-top: 1px !important; margin-left: 2px !important',
          iconSize: 22,
          icon: 'custom-capsules',
          name: 'Danh mục hàng hóa',
          path: ROUTE_DANH_MUC_HANG_HOA.path,
          isActive: true,
        },
        {
          iconStyle: 'margin-top: -2px; margin-left: 1px !important',
          iconSize: 20,
          icon: 'custom-house-medical',
          name: 'Danh sách khoa',
          path: ROUTE_DANH_SACH_KHOA.path,
          isActive: true,
        },
        {
          iconStyle: 'margin-top: -3px; margin-left: 2px !important',
          iconSize: 20,
          icon: 'custom-warehouse-full',
          name: 'Kho trực thuộc',
          path: ROUTE_KHO_TRUC_THUOC.path,
          isActive: true,
        },
        {
          iconStyle: 'margin-top: -3px; margin-left: 2px !important',
          iconSize: 18,
          icon: 'custom-user',
          name: 'Nhân viên',
          path: ROUTE_NHAN_VIEN.path,
          isActive: true,
        },
      ].filter((item) => item.isActive)
    }

    if (isKhoDuoc.value) {
      return [
        {
          iconStyle: 'margin-left: 2px !important',
          iconSize: 18,
          icon: 'custom-chart-simple',
          name: 'Tổng quan',
          path: KHO_DUOC_PREFIX.path,
          isActive: true,
        },
        {
          iconStyle: 'margin-top: 1px !important; margin-left: 0px !important',
          iconSize: 23,
          icon: 'custom-box-open',
          name: 'Tồn kho',
          path: ROUTE_TON_KHO.path,
          isActive: true,
        },
        {
          iconStyle: 'margin-top: 1px !important; margin-left: 2px !important',
          iconSize: 22,
          icon: 'custom-box-circle-check',
          name: 'Phiếu lĩnh',
          path: ROUTE_PHIEU_LINH.path,
          isActive: false,
        },
        {
          iconStyle: 'margin-top: 1px !important; margin-left: 2px !important',
          iconSize: 19,
          icon: 'custom-rotate-left',
          name: 'Phiếu trả',
          path: ROUTE_PHIEU_TRA.path,
          isActive: false,
        },
        {
          iconStyle: 'margin-left: 0px !important; margin-top: -1px !important',
          iconSize: 22,
          icon: 'custom-circle-arrow-down-right',
          name: 'Phiếu nhập kho',
          path: ROUTE_PHIEU_NHAP_KHO.path,
          isActive: true,
        },
        {
          iconStyle: 'margin-left: 0px !important; margin-top: 0px !important',
          iconSize: 22,
          icon: 'custom-circle-arrow-up-left',
          name: 'Phiếu xuất kho',
          path: ROUTE_PHIEU_XUAT_KHO.path,
          isActive: true,
        },
        {
          iconStyle: 'margin-left: 2px !important',
          iconSize: 19,
          icon: 'custom-arrow-right-arrow-left',
          name: 'Phiếu chuyển hàng',
          path: ROUTE_PHIEU_CHUYEN_HANG.path,
          isActive: false,
        },
        {
          iconStyle: 'margin-left: 2px !important;',
          iconSize: 20,
          icon: 'custom-shield-check',
          name: 'Phiếu kiểm kho',
          path: ROUTE_PHIEU_KIEM_KHO.path,
          isActive: false,
        },
      ].filter((item) => item.isActive)
    }

    if (isKhamChuaBenh.value) {
      return [
        {
          iconStyle: 'margin-left: 2px !important',
          iconSize: 18,
          icon: 'custom-chart-simple',
          name: 'Tổng quan',
          path: KHAM_CHUA_BENH_PREFIX.path,
          isActive: true,
        },
        {
          iconStyle: 'margin-left: 3px !important',
          iconSize: 18,
          icon: 'custom-list-timeline',
          name: 'Đơn thuốc',
          path: ROUTE_DON_THUOC.path,
          isActive: true,
        },
      ].filter((item) => item.isActive)
    }

    return []
  })

  const departmentHooks = useDepartment()
  const warehouseHooks = useWarehouse()

  const departmentId = ref<string | number | null>(null)
  const warehouseId = ref<string | number | null>(null)

  const departmentDropdown = ref<IDepartment[]>([])
  const warehouseDropdown = ref<IWarehouse[]>([])

  const { setSelectedDepartment, setSelectedWarehouse } = useAuth()

  watchEffect(() => {
    isDrawerOpen.value = mdAndUp.value
    if (isKhoDuoc.value) {
      if (warehouseId.value) {
        setSelectedWarehouse(warehouseId.value)
      }
      if (departmentId.value) {
        setSelectedDepartment(departmentId.value)
      }
    }
  })

  const onChangeDepartment = async (value: string | number) => {
    warehouseId.value = null
    warehouseDropdown.value = []
    isLoadingWarehouse.value = true
    warehouseDropdown.value = await warehouseHooks.onFetchWarehouseDropdown(value)
    isLoadingWarehouse.value = false
    if (warehouseDropdown.value.length > 0) {
      warehouseId.value = warehouseDropdown.value.find((item) => item.id === warehouseSelected.value)
        ? warehouseSelected.value
        : warehouseDropdown.value[0].id
    }
  }

  onMounted(async () => {
    if (isKhoDuoc.value) {
      isLoading.value = true
      departmentDropdown.value = await departmentHooks.onFetchDepartmentDropdown(
        organizationSelected.value?.id,
        userData.value?.id
      )
      if (departmentDropdown.value.length > 0) {
        departmentDropdown.value = departmentDropdown.value.reverse()
        departmentId.value = departmentDropdown.value.find((item) => item.id === departmentSelected.value)
          ? departmentSelected.value
          : departmentDropdown.value[0].id
        await onChangeDepartment(departmentId.value)
      }
      isLoading.value = false
    }
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
