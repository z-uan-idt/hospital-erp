<template>
  <v-container
    class="erp-danh-sach-thuoc pa-md-6 pa-3"
    fluid
  >
    <div class="d-flex align-center flex-row justify-space-between ga-4">
      <div class="d-flex align-center justify-start ga-3 w-100 w-md-auto">
        <h1 :class="['text-lg-h5 text-h6 font-weight-medium', 'text-blue-grey-darken-3']">Danh sách thuốc</h1>
      </div>

      <div class="action-buttons d-flex align-center ga-2">
        <v-btn
          icon
          variant="outlined"
          color="erp-gray"
          size="x-small"
          @click="isGroupServiceVisible = true"
        >
          <v-icon
            size="20"
            class="text-erp-gray-800"
          >
            mdi-cog-outline
          </v-icon>
        </v-btn>
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
          @click="router.push(ROUTE_DANH_SACH_THUOC.CREATE.path)"
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
      :page="hooks.page.value"
      :items-per-page="hooks.limit.value"
      :items="drugs"
      item-value="name"
      :headers="headers"
      class="mt-3"
      fixed-header
      hover
      :loading="isLoading"
      :items-length="hooks.count.value"
      disable-sort
      style="height: calc(100dvh - 240px)"
      @click:row="onRowClick"
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

      <template v-slot:item.TenThuoc="{ item }">
        <v-card
          class="pa-0"
          :subtitle="item.MaThuoc"
          elevation="0"
        >
          <template v-slot:prepend>
            <v-avatar
              color="erp-brand"
              class="ms-n4 me-1"
              size="42"
              :image="item.image"
              :text="item.TenThuoc.charAt(0).toUpperCase()"
            />
          </template>
          <template v-slot:title>
            <span class="text-body-1 font-weight-medium text-erp-gray-800">
              {{ item.TenThuoc }}
            </span>
          </template>
        </v-card>
      </template>

      <template v-slot:item.created_at="{ item }">
        <span>{{ formatDate(item.created_at, 'HH:mm:ss dd/MM/yyyy') }}</span>
        <p class="text-erp-gray-700">Bởi {{ item.created_by?.full_name }}</p>
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
              Trong tổng số: <strong>{{ hooks.count }}</strong> bản ghi
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

    <FormGroupService
      v-model:visible="isGroupServiceVisible"
      @close="isGroupServiceVisible = false"
    />
  </v-container>
</template>

<script setup lang="ts">
  import type { DataTableHeader } from 'vuetify'
  import { ITEM_PER_PAGES } from '~/constants/core.constants'
  import { ROUTE_DANH_SACH_THUOC } from '~/constants/route.constants'

  definePageMeta({
    layout: 'default',
    middleware: ['auth'],
  })

  useHead({
    title: 'Danh sách khoa',
  })

  const router = useRouter()
  const sortableColumns = []
  const isLoading = ref(false)
  const { drugs, ...hooks } = useDrug()
  const { organizationSelected } = useAuth()
  const isGroupServiceVisible = ref(false)

  onMounted(async () => {
    isLoading.value = true
    await hooks.onFetchDrug(organizationSelected.value?.id)
    isLoading.value = false
  })

  const onPageChange = async (value: number) => {
    hooks.setPage(value)
    isLoading.value = true
    await hooks.onFetchDrug(organizationSelected.value?.id)
    isLoading.value = false
  }

  const onSearch = useDebounce(async (value: string) => {
    hooks.setPage(1)
    hooks.setSearch(value)
    isLoading.value = true
    await hooks.onFetchDrug(organizationSelected.value?.id)
    isLoading.value = false
  }, 1000)

  const onSelectItemsPerPage = async (value: number) => {
    hooks.setPage(1)
    hooks.setLimit(value)
    isLoading.value = true
    await hooks.onFetchDrug(organizationSelected.value?.id)
    isLoading.value = false
  }

  const onRowClick = (_: unknown, { item }) => {
    router.push(ROUTE_DANH_SACH_THUOC.DETAIL.pathFunc(item.id))
  }

  const headers = ref<DataTableHeader[]>([
    {
      title: 'Tên thuốc',
      key: 'TenThuoc',
    },
    {
      title: 'Nhóm thuốc',
      key: 'NhomThuoc.name',
    },
    {
      title: 'Trạng thái',
      key: 'TrangThai.name',
    },
    {
      title: 'Nguồn',
      key: 'source.label',
    },
    {
      title: 'Thời gian tạo',
      key: 'created_at',
    },
  ])

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
</script>

<style scoped lang="scss"></style>
