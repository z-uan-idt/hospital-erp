<template>
  <div
    v-if="isLoading || hooks.count.value > 0 || hooks.search.value"
    class="list-direct-staff"
  >
    <v-text-field
      :model-value="hooks.search.value"
      prepend-inner-icon="mdi-magnify"
      label="Tìm kiếm"
      variant="outlined"
      single-line
      placeholder="Nhập từ khóa"
      rounded="pill"
      bg-color="grey-lighten-5"
      hide-details
      density="comfortable"
      class="mt-5"
      :readonly="false"
      :style="{
        maxWidth: $vuetify.display.smAndDown ? '100%' : $vuetify.display.mdAndDown ? '300px' : '400px',
      }"
      @update:model-value="onSearch"
    />

    <v-data-table
      v-model:page="hooks.page.value"
      v-model:items-per-page="hooks.limit.value"
      :items="staffs"
      item-value="name"
      :headers="headers"
      class="mt-3"
      fixed-header
      hover
      :loading="isLoading"
      :items-length="hooks.count"
      disable-sort
    >
      <template v-slot:item.created_at="{ item }">
        <span>{{ formatDate(item.created_at, 'HH:mm:ss dd/MM/yyyy') }}</span>
        <p class="text-erp-gray-700">
          Bởi <span class="font-weight-medium text-black">{{ (item.updated_by || item.created_by)?.full_name }}</span>
        </p>
      </template>

      <template v-slot:bottom>
        <div class="d-flex align-center w-100 pa-2 ga-2">
          <template v-if="!$vuetify.display.smAndDown">
            <span> Số dòng trên 1 trang </span>
            <v-select
              v-model="hooks.limit.value"
              :items="ITEM_PER_PAGES"
              variant="outlined"
              rounded="lg"
              max-width="max-content"
              hide-details
              density="compact"
              :menu-icon="null"
              readonly
              @update:model-value="onSelectItemsPerPage"
            />
            <span>
              Trong tổng số: <strong>{{ hooks.count }}</strong> bản ghi
            </span>
          </template>
          <v-spacer />
          <v-pagination
            v-model="hooks.page.value"
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
  </div>
  <div
    v-if="!isLoading && hooks.count.value === 0 && !hooks.search.value"
    class="d-flex flex-column align-center justify-center w-100 pa-4"
  >
    <Icon
      name="custom:organization-empty"
      :size="$vuetify.display.smAndDown ? '45vw' : $vuetify.display.mdAndDown ? '30vw' : '20vw'"
    />

    <p class="text-md-h4 text-h5 mt-4 mb-4 font-playfair text-erp-gray-800">Chưa có nhân viên</p>
  </div>
</template>

<script setup lang="ts">
  import type { DataTableHeader } from 'vuetify'
  import { ITEM_PER_PAGES } from '~/constants/core.constants'

  const { staffs, ...hooks } = useStaff()

  const props = withDefaults(
    defineProps<{
      departmentId?: string | number
      warehouseId?: string | number
    }>(),
    {
      departmentId: '',
      warehouseId: '',
    }
  )

  const onPageChange = async (value: number) => {
    hooks.setPage(value)
    isLoading.value = true
    if (props.warehouseId) {
      hooks.setWid(Number(props.warehouseId))
    }
    if (props.departmentId) {
      hooks.setDid(Number(props.departmentId))
    }
    await hooks.onFetchStaff(organizationSelected.value?.id)
    isLoading.value = false
  }

  const onSelectItemsPerPage = async (value: number) => {
    hooks.setPage(1)
    hooks.setLimit(value)
    isLoading.value = true
    if (props.warehouseId) {
      hooks.setWid(Number(props.warehouseId))
    }
    if (props.departmentId) {
      hooks.setDid(Number(props.departmentId))
    }
    await hooks.onFetchStaff(organizationSelected.value?.id)
    isLoading.value = false
  }

  const headers = ref<DataTableHeader[]>([
    {
      title: 'Mã nhân viên',
      key: 'staff_code',
      minWidth: '160px',
      value: (item) => (item.staff_code ? `#${item.staff_code}` : 'Không có dữ liệu'),
    },
    {
      title: 'Tên tài khoản',
      key: 'full_name',
    },
    {
      title: 'Số điện thoại tại tổ chức',
      key: 'phone_number',
      value: (item) => item?.phone_number ?? 'Không có dữ liệu',
    },
    {
      title: 'Email tại tổ chức',
      key: 'email',
      value: (item) => item?.organization_email ?? 'Không có dữ liệu',
    },
    {
      title: 'Chức vụ',
      key: 'role.name',
      value: (item) => item?.role?.name ?? 'Không có dữ liệu',
    },
    {
      title: 'Kho trực thuộc',
      key: 'warehouse.name',
      value: (item) => item?.warehouse?.name ?? 'Không có dữ liệu',
    },
    {
      title: 'Thời gian thêm',
      key: 'created_at',
    },
  ])

  const isLoading = ref(false)
  const { organizationSelected } = useAuth()

  onMounted(async () => {
    hooks.setPage(1)
    hooks.setLimit(5)
    isLoading.value = true
    if (props.warehouseId) {
      hooks.setWid(Number(props.warehouseId))
    }
    if (props.departmentId) {
      hooks.setDid(Number(props.departmentId))
    }
    await hooks.onFetchStaff(organizationSelected.value.id)
    isLoading.value = false
  })

  const onSearch = useDebounce(async (value: string) => {
    hooks.setSearch(value)
    isLoading.value = true
    if (props.warehouseId) {
      hooks.setWid(Number(props.warehouseId))
    }
    if (props.departmentId) {
      hooks.setDid(Number(props.departmentId))
    }
    await hooks.onFetchStaff(organizationSelected.value.id)
    isLoading.value = false
  }, 500)
</script>
