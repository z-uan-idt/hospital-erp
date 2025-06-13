<template>
  <v-container
    fluid
    class="erp-don-thuoc pa-md-6 pa-3"
  >
    <div class="d-flex align-center flex-row justify-space-between ga-4">
      <div class="d-flex align-center justify-start ga-3 w-100 w-md-auto">
        <h1 :class="['text-lg-h5 text-h6 font-weight-medium', 'text-blue-grey-darken-3']">Đơn thuốc</h1>
      </div>

      <div class="action-buttons d-flex align-center ga-2">
        <v-btn
          icon
          variant="outlined"
          color="erp-gray"
          size="x-small"
        >
          <v-icon
            size="16"
            class="text-erp-gray-800"
          >
            custom-upload
          </v-icon>
        </v-btn>
        <v-btn
          icon
          variant="outlined"
          color="erp-gray"
          size="x-small"
        >
          <v-icon
            size="18"
            class="me-n1 text-erp-gray-800"
          >
            custom-file-export
          </v-icon>
        </v-btn>
        <v-btn
          icon
          variant="outlined"
          color="erp-gray"
          size="x-small"
          class="text-body-1"
        >
          <v-icon
            size="20"
            class="text-erp-gray-800"
          >
            mdi-plus
          </v-icon>
        </v-btn>
      </div>
    </div>

    <v-text-field
      v-model="hooks.search.value"
      prepend-inner-icon="mdi-magnify"
      label="Tìm kiếm"
      variant="outlined"
      single-line
      placeholder="Nhập từ khóa"
      rounded="pill"
      bg-color="grey-lighten-5"
      hide-details
      density="compact"
      class="mt-5"
      :style="{
        maxWidth: $vuetify.display.smAndDown ? '100%' : $vuetify.display.mdAndDown ? '300px' : '400px',
      }"
      @update:model-value="onSearch"
    />

    <v-data-table
      v-model="prescriptionsSelected"
      :page="hooks.page.value"
      :items-per-page="hooks.limit.value"
      :items="prescriptions"
      item-value="id"
      :headers="headers"
      class="mt-3"
      fixed-header
      hover
      show-select
      :loading="isLoading"
      :items-length="hooks.count.value"
      disable-sort
      style="height: calc(100dvh - 240px)"
      @update:options="onLoadTable"
    >
      <template v-slot:item.created_at="{ item }">
        {{ formatDate(item.created_at, 'HH:mm:ss dd/MM/yyyy') }}
      </template>

      <template v-slot:item.TenBenhNhan="{ item }">
        {{ item?.TenBenhNhan }}
        <p class="text-body-2 text-erp-gray-600">
          {{ item?.MaBenhNhan }}
        </p>
      </template>

      <template v-slot:item.TenKhoa="{ item }">
        {{ item?.TenKhoa }}
        <p class="text-body-2 text-erp-gray-600">
          {{ item?.MaKhoa }}
        </p>
      </template>

      <template v-slot:item.IsNoiTru="{ item }">
        <v-chip
          size="small"
          variant="tonal"
        >
          {{ item?.IsNoiTru ? 'Nội trú' : 'Ngoại trú' }}
        </v-chip>
      </template>

      <template v-slot:bottom>
        <div class="d-flex align-center w-100 pa-2 ga-2">
          <template v-if="!$vuetify.display.smAndDown">
            <span> Số dòng trên 1 trang </span>
            <v-select
              :model-value="hooks.limit.value"
              :items="ITEM_PER_PAGES"
              variant="outlined"
              rounded="lg"
              max-width="100px"
              hide-details
              density="compact"
              @update:model-value="onSelectItemsPerPage"
            />
            <span>
              Trong tổng số: <strong>{{ hooks.count.value }}</strong> bản ghi
            </span>
          </template>
          <v-spacer />
          <v-pagination
            :model-value="hooks.page.value"
            :length="hooks.numPages.value"
            rounded="circle"
            variant="elevated"
            elevation="0"
            size="small"
            :total-visible="$vuetify.display.smAndDown ? 3 : 7"
            active-color="erp-brand"
            border="sm"
            @update:model-value="onPageChange"
          />
        </div>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup lang="ts">
  import type { DataTableHeader } from 'vuetify'
  import { ITEM_PER_PAGES } from '~/constants/core.constants'

  definePageMeta({
    layout: 'default',
    middleware: ['auth'],
    keepalive: true,
  })

  useHead({
    title: 'Danh sách khoa',
  })

  const isLoading = ref(false)
  const { organizationSelected } = useAuth()
  const { prescriptions, ...hooks } = usePrescription()

  const prescriptionsSelected = ref([])

  function onUpdateSelected(value: any) {
    console.log(value)
  }

  const headers = ref<DataTableHeader[]>([
    {
      title: 'Mã đơn thuốc',
      key: 'MaLanKham',
    },
    {
      title: 'Bệnh nhân',
      key: 'TenBenhNhan',
    },
    {
      title: 'Tên khoa',
      key: 'TenKhoa',
    },
    {
      title: 'Bác sĩ kê',
      key: 'BacSiKe',
    },
    {
      title: 'DVKT',
      key: 'IsDVKT',
      value: (item) => (item?.IsDVKT ? 'Có' : 'Không'),
    },
    {
      title: 'BHYT',
      key: 'IsBHYT',
      value: (item) => (item?.IsBHYT ? 'Có' : 'Không'),
    },
    {
      title: 'Mã phiếu lĩnh',
      key: 'MaPhieuLinh',
      value: (item) => item?.MaPhieuLinh || 'Không có dữ liệu',
    },
    {
      title: 'Nguồn đơn',
      key: 'IsHIS',
      value: (item) => (item?.IsHIS ? 'HIS' : 'Tự tạo'),
    },
    {
      title: 'Loại đơn',
      key: 'IsNoiTru',
    },
    {
      title: 'Ngày tạo',
      key: 'created_at',
    },
  ])

  function onLoadTable({ page, itemsPerPage, sortBy, ...args }) {}

  onMounted(async () => {
    isLoading.value = true
    await hooks.onFetchPrescription(organizationSelected.value?.id)
    isLoading.value = false
  })

  const onSearch = useDebounce(async (value: string) => {
    hooks.setPage(1)
    hooks.setSearch(value)
    isLoading.value = true
    await hooks.onFetchPrescription(organizationSelected.value?.id)
    isLoading.value = false
  }, 1000)

  const onPageChange = async (value: number) => {
    hooks.setPage(value)
    isLoading.value = true
    await hooks.onFetchPrescription(organizationSelected.value?.id)
    isLoading.value = false
  }

  const onSelectItemsPerPage = async (value: number) => {
    hooks.setPage(1)
    hooks.setLimit(value)
    isLoading.value = true
    await hooks.onFetchPrescription(organizationSelected.value?.id)
    isLoading.value = false
  }
</script>

<style scoped lang="scss"></style>
