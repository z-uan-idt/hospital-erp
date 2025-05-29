<template>
  <div
    v-if="isLoading || hooks.count.value > 0"
    class="list-direct-staff"
  >
    <v-text-field
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
      :style="{
        maxWidth: $vuetify.display.smAndDown ? '100%' : $vuetify.display.mdAndDown ? '300px' : '400px',
      }"
    />

    <v-data-table
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      :items="warehouses"
      item-value="name"
      :headers="headers"
      class="mt-3"
      fixed-header
      hover
      :loading="isLoading"
      :items-length="hooks.count"
      disable-sort
    >
      <template v-slot:headers="{ columns }">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            :style="{
              minWidth: column.minWidth,
            }"
          >
            <span>{{ column.title }}</span>
            <v-icon
              v-if="sortableColumns.includes(column.key)"
              size="16"
              class="text-erp-gray-800"
            >
              {{
                !column?.['sort_by']
                  ? 'fa-solid-sort'
                  : column?.['sort_by'] === 1
                    ? 'fa-solid-sort-up'
                    : 'fa-solid-sort-down'
              }}
            </v-icon>
          </th>
        </tr>
      </template>

      <template v-slot:item.created_at="{ item }">
        {{ formatDate(item.created_at, 'HH:mm:ss dd/MM/yyyy') }}
      </template>

      <template v-slot:bottom>
        <div class="d-flex align-center w-100 pa-2 ga-2">
          <template v-if="!$vuetify.display.smAndDown">
            <span> Số dòng trên 1 trang </span>
            <v-select
              v-model="itemsPerPage"
              :items="ITEM_PER_PAGES"
              variant="outlined"
              rounded="lg"
              max-width="max-content"
              hide-details
              density="compact"
              :menu-icon="null"
              readonly
            />
            <span>
              Trong tổng số: <strong>{{ hooks.count }}</strong> bản ghi
            </span>
          </template>
          <v-spacer />
          <v-pagination
            v-model="page"
            :length="hooks.numPages.value"
            rounded="circle"
            variant="elevated"
            elevation="0"
            size="small"
            :total-visible="$vuetify.display.smAndDown ? 3 : 7"
            active-color="erp-brand"
            border="sm"
          />
        </div>
      </template>
    </v-data-table>
  </div>
  <div
    v-if="!isLoading && hooks.count.value === 0"
    class="d-flex flex-column align-center justify-center w-100 pa-4"
  >
    <Icon
      name="custom:organization-empty"
      :size="$vuetify.display.smAndDown ? '45vw' : $vuetify.display.mdAndDown ? '30vw' : '20vw'"
    />

    <p class="text-md-h4 text-h5 mt-4 mb-4 font-playfair text-erp-gray-800">Chưa có kho trực thuộc</p>
  </div>
</template>

<script setup lang="ts">
  import type { DataTableHeader } from 'vuetify'
  import { ITEM_PER_PAGES } from '~/constants/core.constants'

  const { warehouses, ...hooks } = useWarehouse()

  const props = withDefaults(
    defineProps<{
      departmentId: string | number
    }>(),
    {
      departmentId: () => '',
    }
  )

  const headers = ref<DataTableHeader[]>([
    {
      title: 'Mã kho',
      key: 'code',
    },
    {
      title: 'Tên kho',
      key: 'name',
    },
    {
      title: 'Trực thuộc khoa',
      key: 'department.name',
      value: (item) => item?.department?.name ?? 'Không có dữ liệu',
    },
    {
      title: 'Thủ kho',
      key: 'keeper.full_name',
      value: (item) => item?.keeper?.full_name ?? 'Không có dữ liệu',
    },
    {
      title: 'Số lượng nhân viên',
      key: 'staff_count',
    },
    {
      title: 'Ngày tạo',
      key: 'created_at',
    },
  ])

  const page = ref(1)
  const isLoading = ref(false)
  const itemsPerPage = ref(5)
  const { organizationSelected } = useAuth()
  const sortableColumns = ['staff_count', 'warehouse_count', 'created_at']

  onMounted(async () => {
    isLoading.value = true
    hooks.setDid(Number(props.departmentId))
    await hooks.onFetchWarehouse(organizationSelected.value.id)
    isLoading.value = false
  })
</script>
