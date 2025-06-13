<template>
  <v-container
    class="erp-danh-muc-hang-hoa pa-md-6 pa-3"
    fluid
  >
    <div class="d-flex align-center flex-row justify-space-between ga-4">
      <div class="d-flex align-center justify-start ga-3 w-100 w-md-auto">
        <h1 :class="['text-lg-h5 text-h6 font-weight-medium', 'text-blue-grey-darken-3']">Phiếu nhập kho</h1>
      </div>

      <div class="action-buttons d-flex align-center ga-2">
        <v-btn
          icon
          variant="outlined"
          color="erp-gray"
          size="small"
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
          size="small"
        >
          <v-icon
            size="18"
            class="me-n1 text-erp-gray-800"
          >
            custom-file-export
          </v-icon>
        </v-btn>
        <v-menu
          v-if="!warehouseSelected || hooks.draftCount.value > 0"
          open-on-hover
          location="bottom right"
        >
          <template #activator="{ props }">
            <v-btn
              icon
              variant="outlined"
              color="erp-gray"
              size="small"
              class="text-body-1"
              v-bind="props"
            >
              <v-icon
                size="20"
                class="text-erp-gray"
              >
                mdi-plus
              </v-icon>
            </v-btn>
          </template>

          <v-card
            rounded="lg"
            elevation="1"
            class="pt-2 mt-2 border border-opacity-25"
            :max-width="340"
          >
            <template #prepend>
              <v-icon size="20"> mdi-information </v-icon>
            </template>
            <template #title>
              <p class="text-subtitle-2">Không thể tạo mới</p>
            </template>

            <template #text>
              <p class="text-body-2 text-erp-gray-700">
                {{
                  !warehouseSelected
                    ? 'Vui lòng chọn kho trước khi tạo phiếu nhập kho'
                    : 'Bạn đang có phiếu lưu nháp. Vui lòng hoàn thành phiếu lưu nháp để tiếp tục tạo mới.'
                }}
              </p>
            </template>
          </v-card>
        </v-menu>
        <v-btn
          v-else
          icon
          variant="outlined"
          color="erp-gray"
          size="small"
          class="text-body-1"
          @click="router.push(ROUTE_PHIEU_NHAP_KHO.CREATE.path)"
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
      density="comfortable"
      class="mt-5"
      :style="{
        maxWidth: $vuetify.display.smAndDown ? '100%' : $vuetify.display.mdAndDown ? '300px' : '400px',
      }"
      @update:model-value="onSearch"
    />

    <v-data-table
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      :items="receipts"
      item-value="name"
      :headers="headers"
      class="mt-3"
      fixed-header
      hover
      :loading="isLoading"
      :items-length="hooks.count.value"
      disable-sort
      style="height: calc(100dvh - 260px)"
      @click:row="onRowClick"
      @update:options="onLoadTable"
    >
      <template v-slot:item.code="{ item }">
        <v-chip
          variant="outlined"
          :elevation="3"
        >
          <v-icon
            size="16"
            class="text-erp-gray-800 me-1"
          >
            custom-circle-arrow-down-right
          </v-icon>
          {{ item.code }}
        </v-chip>
      </template>

      <template v-slot:item.batch_price="{ item }">
        <span class="text-erp-gray-800"> {{ formatNumberDot(item.batch_price) }} đ </span>
      </template>

      <template v-slot:item.status.label="{ item }">
        <v-chip
          :variant="item.status?.value === 'DRAFT' ? 'outlined' : 'tonal'"
          :color="getStatusColor(item.status?.value)"
        >
          {{ item.status.label }}
        </v-chip>
      </template>

      <template v-slot:item.created_at="{ item }">
        <span>{{ formatDate(item.created_at, 'HH:mm:ss dd/MM/yyyy') }}</span>
        <p class="text-erp-gray-700">
          Bởi <span class="font-weight-medium text-black">{{ item.created_by?.full_name }}</span>
        </p>
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
  </v-container>
</template>

<script setup lang="ts">
  import type { DataTableHeader } from 'vuetify'
  import { ITEM_PER_PAGE, ITEM_PER_PAGES } from '~/constants/core.constants'
  import { ROUTE_PHIEU_NHAP_KHO } from '~/constants/route.constants'

  definePageMeta({
    layout: 'default',
    middleware: ['auth'],
  })

  useHead({
    title: 'Phiếu nhập kho',
  })

  const page = ref(1)
  const router = useRouter()
  const isLoading = ref(false)
  const itemsPerPage = ref(ITEM_PER_PAGE)
  const { receipts, ...hooks } = useReceipt()
  const { warehouseSelected } = useAuth()

  watch(
    warehouseSelected,
    async () => {
      isLoading.value = true
      await hooks.onFetchGoodsReceivedNote(warehouseSelected.value)
      isLoading.value = false
    },
    {
      immediate: true,
    }
  )

  const onSearch = useDebounce(async (value: string) => {
    hooks.setPage(1)
    hooks.setSearch(value)
    isLoading.value = true
    await hooks.onFetchGoodsReceivedNote(warehouseSelected.value)
    isLoading.value = false
  }, 1000)

  const onSelectItemsPerPage = async (value: number) => {
    hooks.setPage(1)
    hooks.setLimit(value)
    isLoading.value = true
    await hooks.onFetchGoodsReceivedNote(warehouseSelected.value)
    isLoading.value = false
  }

  const onRowClick = (_: unknown, { item }) => {
    if (item.status?.value === 'DRAFT') {
      router.push(`${ROUTE_PHIEU_NHAP_KHO.CREATE.path}?id=${item.id}`)
    } else {
      router.push(ROUTE_PHIEU_NHAP_KHO.DETAIL.pathFunc(item.id))
    }
  }

  const getStatusColor = (status: string) => {
    if (status === 'DRAFT') return 'erp-gray-700'
    if (status === 'PENDING') return 'erp-gray-700'
    if (status === 'APPROVED') return 'erp-brand-600'
    if (status === 'REJECTED') return 'erp-error-600'
    if (status === 'CANCELLED') return 'erp-error-600'
    return 'erp-gray-700'
  }

  const headers = ref<DataTableHeader[]>([
    {
      title: 'Mã phiếu',
      key: 'code',
      width: 200,
    },
    {
      title: 'Lý do nhập',
      key: 'reason',
    },
    {
      title: 'Số lượng lô',
      key: 'batch_count',
    },
    {
      title: 'Giá trị nhập',
      key: 'batch_price',
    },
    {
      title: 'Nhà cung cấp',
      key: 'supplier.full_name',
      value: () => 'Không có dữ liệu',
    },
    {
      title: 'Mã phiếu lĩnh đi kèm',
      key: 'PhieuLinh_ref',
      value: () => 'Không có dữ liệu',
    },
    {
      title: 'Trạng thái',
      key: 'status.label',
    },
    {
      title: 'Thời gian tạo',
      key: 'created_at',
    },
  ])

  const onPageChange = async (value: number) => {
    hooks.setPage(value)
    isLoading.value = true
    await hooks.onFetchGoodsReceivedNote(warehouseSelected.value)
    isLoading.value = false
  }

  function onLoadTable({ page, itemsPerPage, sortBy, ...args }) {}
</script>

<style scoped lang="scss"></style>
