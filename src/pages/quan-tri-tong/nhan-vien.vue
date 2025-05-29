<template>
  <v-container
    class="erp-nhan-vien pa-6"
    fluid
  >
    <div class="d-flex align-center flex-row justify-space-between ga-4">
      <div class="d-flex align-center justify-start ga-3 w-100 w-md-auto">
        <h1 :class="['text-lg-h5 text-h6 font-weight-medium', 'text-blue-grey-darken-3']">Nhân viên</h1>
      </div>

      <div class="action-buttons d-flex align-center ga-2">
        <v-btn
          icon
          variant="outlined"
          color="erp-gray"
          size="small"
        >
          <v-icon
            size="20"
            class="text-erp-gray-800"
          >
            custom-upload
          </v-icon>
        </v-btn>
        <v-btn
          icon
          variant="outlined"
          color="erp-gray"
          size="small"
        >
          <v-icon
            size="20"
            class="me-n1 text-erp-gray-800"
          >
            custom-file-export
          </v-icon>
        </v-btn>
        <v-btn
          icon
          variant="outlined"
          color="erp-gray"
          size="small"
          class="text-body-1"
        >
          <v-icon
            size="18"
            class="text-erp-gray-800"
            style="margin-left: -2px"
          >
            custom-paper-plane
          </v-icon>
        </v-btn>
      </div>
    </div>

    <div class="d-flex align-center flex-row justify-space-between ga-4 mt-3">
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
        :style="{
          maxWidth: $vuetify.display.smAndDown ? '100%' : $vuetify.display.mdAndDown ? '300px' : '400px',
        }"
        @update:model-value="onSearch"
      />

      <div class="action-buttons d-flex align-center ga-2">
        <v-menu
          v-model="isInvitationSent"
          :close-on-content-click="false"
          location="bottom right"
        >
          <template v-slot:activator="{ props }">
            <v-chip
              variant="outlined"
              color="erp-gray"
              size="auto"
              class="pa-1"
              v-bind="props"
            >
              <div class="ps-3 pe-2 text-erp-gray-700">Đã gửi lời mời</div>
              <v-chip
                variant="tonal"
                color="erp-blue"
                size="auto"
                class="text-body-2 ps-2 pe-2 pt-1 pb-1"
              >
                10
              </v-chip>
            </v-chip>
          </template>

          <v-card min-width="300"> 1 </v-card>
        </v-menu>

        <v-menu
          v-model="isRequestJoin"
          :close-on-content-click="false"
          location="bottom right"
        >
          <template v-slot:activator="{ props }">
            <v-chip
              variant="outlined"
              color="erp-gray"
              size="auto"
              class="pa-1"
              v-bind="props"
            >
              <div class="ps-3 pe-2 text-erp-gray-700">Yêu cầu gia nhập</div>
              <v-chip
                variant="tonal"
                color="erp-error"
                size="auto"
                class="text-body-2 ps-2 pe-2 pt-1 pb-1"
              >
                10
              </v-chip>
            </v-chip>
          </template>

          <v-sheet
            min-width="534"
            class="pa-4 mt-1"
            rounded="lg"
          >
            <CommonDivider label="Xét duyệt yêu cầu gia nhập" />
            <v-list
              item-props
              density="compact"
              class="pa-0"
            >
              <v-list-item>
                <v-list-item-title> 1 </v-list-item-title>
              </v-list-item>
              <v-divider />
              <v-list-item> 2 </v-list-item>
            </v-list>
          </v-sheet>
        </v-menu>
      </div>
    </div>

    <v-data-table
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      :items="staffs"
      item-value="name"
      :headers="headers"
      class="mt-3"
      fixed-header
      hover
      :loading="isLoading"
      :items-length="hooks.count"
      disable-sort
      style="height: calc(100dvh - 240px)"
      @update:options="onLoadTable"
    >
      <template v-slot:headers="{ columns }">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            :style="{
              minWidth: column.minWidth,
            }"
            @click="sortableColumns.includes(column.key) && sortBy(column)"
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
              :items="[10, 20, 50, 100]"
              variant="outlined"
              rounded="lg"
              max-width="100px"
              hide-details
              density="compact"
              @update:model-value="onSelectItemsPerPage"
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
  </v-container>
</template>

<script setup lang="ts">
  import { CommonDivider } from '#components'
  import type { DataTableHeader } from 'vuetify'

  definePageMeta({
    layout: 'default',
    middleware: ['auth'],
    keepalive: true,
  })

  useHead({
    title: 'Danh sách khoa',
  })

  const page = ref(1)
  const isLoading = ref(false)
  const isInvitationSent = ref(false)
  const isRequestJoin = ref(false)
  const itemsPerPage = ref(15)
  const { staffs, ...hooks } = useStaff()
  const { organizationSelected } = useAuth()

  onMounted(async () => {
    isLoading.value = true
    await hooks.onFetchStaff(organizationSelected.value.id)
    isLoading.value = false
  })

  const sortableColumns = ['staff_count', 'warehouse_count', 'created_at']

  const headers = ref<DataTableHeader[]>([
    {
      title: 'Mã nhân viên',
      key: 'staff_code',
    },
    {
      title: 'Tên tài khoản',
      key: 'full_name',
    },
    {
      title: 'Số điện thoại tại tổ chức',
      key: 'organization_phone_number',
      value: (item) => item?.organization_phone_number ?? 'Không có dữ liệu',
    },
    {
      title: 'Email tại tổ chức',
      key: 'organization_email',
      value: (item) => item?.organization_email ?? 'Không có dữ liệu',
    },
    {
      title: 'Chức vụ',
      key: 'department_role',
      value: (item) => item?.department_role ?? 'Không có dữ liệu',
    },
    {
      title: 'Khoa',
      key: 'department',
      value: (item) => item?.department ?? 'Không có dữ liệu',
    },
    {
      title: 'Kho trực thuộc',
      key: 'warehouse',
      value: (item) => item?.warehouse ?? 'Không có dữ liệu',
    },
    {
      title: 'Ngày tạo',
      key: 'created_at',
    },
  ])

  const onSelectItemsPerPage = async (value: number) => {
    hooks.setPage(1)
    hooks.setLimit(value)
    isLoading.value = true
    await hooks.onFetchStaff(organizationSelected.value?.id)
    isLoading.value = false
  }

  const sortBy = (column: any) => {
    if (!column.sort_by) {
      column.sort_by = 0
    }

    if (column.sort_by === 0) {
      column.sort_by = 2
    } else if (column.sort_by === 2) {
      column.sort_by = 1
    } else {
      column.sort_by = 0
    }
    isLoading.value = true
    setTimeout(() => {
      isLoading.value = false
    }, 1000)
  }

  function onLoadTable({ page, itemsPerPage, sortBy, ...args }) {}

  const onSearch = useDebounce(async (value: string) => {
    hooks.setPage(1)
    hooks.setSearch(value)
    isLoading.value = true
    await hooks.onFetchStaff(organizationSelected.value?.id)
    isLoading.value = false
  }, 1000)
</script>

<style scoped lang="scss"></style>
