<template>
  <v-container
    class="erp-danh-muc-hang-hoa pa-md-6 pa-3"
    fluid
  >
    <div class="d-flex align-center flex-row justify-space-between ga-4">
      <div class="d-flex align-center justify-start ga-3 w-100 w-md-auto">
        <h1 :class="['text-lg-h5 text-h6 font-weight-medium', 'text-blue-grey-darken-3']">
          Danh mục {{ currentLabel }}
        </h1>
      </div>

      <div class="action-buttons d-flex align-center ga-2">
        <v-btn
          icon
          variant="outlined"
          color="erp-gray"
          size="small"
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
        <v-btn
          icon
          variant="outlined"
          color="erp-gray"
          size="small"
          class="text-body-1"
          @click="router.push(ROUTE_DANH_MUC_HANG_HOA.CREATE.path)"
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

    <div
      v-if="$vuetify.display.smAndDown"
      class="mt-4"
    >
      <v-select
        :model-value="selectedMedicalProductType"
        :items="MEDICAL_PRODUCT_TYPES"
        variant="outlined"
        rounded="lg"
        density="compact"
        item-title="label_plural"
        item-value="value"
        hide-details
        @update:model-value="setSelectedMedicalProductType"
      >
        <template v-slot:prepend-inner>
          <v-icon
            size="20"
            class="text-erp-gray-900 me-2"
          >
            {{ MEDICAL_PRODUCT_TYPES.find((item) => item.value === selectedMedicalProductType)?.icon }}
          </v-icon>
        </template>
        <template v-slot:item="{ props, item }">
          <v-list-item
            v-bind="props"
            :title="item.raw.label_plural"
          >
            <template v-slot:prepend>
              <v-icon
                size="20"
                class="text-erp-gray-900"
                style="margin-right: -21px"
              >
                {{ item.raw.icon || undefined }}
              </v-icon>
            </template>
          </v-list-item>
        </template>
      </v-select>
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
      :page="hooks.page.value"
      :items-per-page="hooks.limit.value"
      :items="medicalProducts"
      item-value="name"
      :headers="headers"
      class="mt-3"
      fixed-header
      hover
      :loading="isLoading"
      :items-length="hooks.count.value"
      disable-sort
      :style="$vuetify.display.smAndUp ? 'height: calc(100dvh - 260px)' : 'height: calc(100dvh - 290px)'"
      @click:row="onRowClick"
      @update:options="onLoadTable"
    >
      <template
        v-if="$vuetify.display.smAndUp"
        v-slot:header.TenHangHoa="{ column }"
      >
        <v-select
          :model-value="selectedMedicalProductType"
          :items="MEDICAL_PRODUCT_TYPES"
          variant="outlined"
          rounded="lg"
          density="compact"
          class="ms-n4"
          item-title="label_plural"
          item-value="value"
          hide-details
          max-width="max-content"
          @update:model-value="setSelectedMedicalProductType"
        >
          <template v-slot:prepend-inner>
            <v-icon
              size="20"
              class="text-erp-gray-900 me-2"
            >
              {{ MEDICAL_PRODUCT_TYPES.find((item) => item.value === selectedMedicalProductType)?.icon }}
            </v-icon>
          </template>
          <template v-slot:item="{ props, item }">
            <v-list-item
              v-bind="props"
              :title="item.raw.label_plural"
            >
              <template v-slot:prepend>
                <v-icon
                  size="20"
                  class="text-erp-gray-900"
                  style="margin-right: -21px"
                >
                  {{ item.raw.icon || undefined }}
                </v-icon>
              </template>
            </v-list-item>
          </template>
        </v-select>
      </template>

      <template v-slot:item.TenHangHoa="{ item }">
        <v-card
          class="pa-0"
          :subtitle="item.MaHangHoa"
          elevation="0"
        >
          <template
            v-if="$vuetify.display.smAndUp"
            v-slot:prepend
          >
            <v-avatar
              color="erp-brand"
              class="ms-n4 me-1"
              size="42"
              :image="item.image"
              :text="item.TenHangHoa.charAt(0).toUpperCase()"
            />
          </template>
          <template v-slot:title>
            <span class="text-body-1 font-weight-medium text-erp-gray-800">
              {{ item.TenHangHoa }}
            </span>
          </template>
        </v-card>
      </template>

      <template v-slot:item.LoaiDangKy.name="{ item }">
        <v-chip
          :color="
            item.LoaiDangKy?.name
              ? item.LoaiDangKy?.code !== 'TAN_DUOC'
                ? 'erp-blue-light'
                : 'erp-gray-700'
              : 'erp-gray'
          "
          variant="tonal"
        >
          {{ item.LoaiDangKy?.name || 'Không xác định' }}
        </v-chip>
      </template>

      <template v-slot:item.NhomHangHoa.name="{ item }">
        <span
          :class="{
            'text-erp-gray': !item.NhomHangHoa?.name,
          }"
        >
          {{ item.NhomHangHoa?.name || 'Không có dữ liệu' }}
        </span>
      </template>

      <template v-slot:item.TrangThai.name="{ item }">
        <v-chip
          :color="getStatusColor(item.TrangThai.code)"
          variant="tonal"
        >
          <v-icon
            :color="getStatusColor(item.TrangThai.code)"
            class="me-1"
            size="16"
          >
            {{ getStatusIcon(item.TrangThai.code) }}
          </v-icon>
          {{ item.TrangThai.name }}
        </v-chip>
      </template>

      <template #item.available_quantity="{ item }">
        <span
          class="text-black"
          :class="{
            'font-weight-bold text-erp-blue-light': item?.['is_changed_available_quantity'] ?? false,
          }"
          style="transition: all 0.1s ease"
        >
          {{ item.available_quantity ? formatNumberDot(item.available_quantity) : '0' }}
        </span>
        <span
          class="text-erp-gray-700 text-caption ms-1"
          :class="{
            'font-weight-bold text-erp-blue-light': item?.['is_changed_available_quantity'] ?? false,
          }"
        >
          {{ item.DonViNhap?.name }}
        </span>
      </template>

      <template #item.real_quantity="{ item }">
        <span
          class="text-black"
          :class="{
            'font-weight-bold text-erp-blue-light': item?.['is_changed_real_quantity'] ?? false,
          }"
          style="transition: all 0.1s ease"
        >
          {{ item.real_quantity ? formatNumberDot(item.real_quantity) : '0' }}
        </span>
        <span
          class="text-erp-gray-700 text-caption ms-1"
          :class="{
            'font-weight-bold text-erp-blue-light': item?.['is_changed_real_quantity'] ?? false,
          }"
        >
          {{ item.DonViNhap?.name }}
        </span>
      </template>

      <template v-slot:item.created_at="{ item }">
        <span>{{ formatDate(item.created_at, 'HH:mm:ss dd/MM/yyyy') }}</span>
        <p
          v-if="item?.source?.value !== 'HIS'"
          class="text-erp-gray-700"
        >
          Bởi <span class="text-black">{{ item.created_by?.full_name || 'Hệ thống' }}</span>
        </p>
        <p
          v-else
          class="text-erp-gray-700 font-weight-medium"
        >
          Bởi <span class="text-black">HIS</span>
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

    <FormGroupService
      v-model:visible="isGroupServiceVisible"
      @close="isGroupServiceVisible = false"
    />
  </v-container>
</template>

<script setup lang="ts">
  import { ROUTE_DANH_MUC_HANG_HOA } from '~/constants/route.constants'
  import { ITEM_PER_PAGES, MEDICAL_PRODUCT_TYPES } from '~/constants/core.constants'

  const { organizationSelected, setSelectedMedicalProductType, selectedMedicalProductType } = useAuth()

  const currentLabel = computed(() => {
    return MEDICAL_PRODUCT_TYPES.find((item) => item.value === selectedMedicalProductType.value)?.label.toLowerCase()
  })

  definePageMeta({
    layout: 'default',
    middleware: ['auth'],
  })

  useHead({
    title: `Danh sách ${currentLabel.value}`,
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'STOP_IMPORT':
        return 'erp-gray'
      case 'DEACTIVATED':
        return 'erp-error'
      case 'ACTIVATED':
        return 'erp-brand'
      default:
        return 'erp-gray'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'STOP_IMPORT':
        return 'mdi-pause'
      case 'DEACTIVATED':
        return 'mdi-cancel'
      case 'ACTIVATED':
        return 'mdi-check'
      default:
        return 'mdi-pause'
    }
  }

  const router = useRouter()
  const isLoading = ref(false)
  const isGroupServiceVisible = ref(false)
  const { medicalProducts, ...hooks } = useMedicalProduct()

  watch(
    selectedMedicalProductType,
    async (newValue) => {
      hooks.setPage(1)
      isLoading.value = true
      await hooks.onFetchMedicalProduct(organizationSelected.value?.id, newValue)
      isLoading.value = false
    },
    {
      immediate: true,
    }
  )

  const onPageChange = async (value: number) => {
    hooks.setPage(value)
    isLoading.value = true
    await hooks.onFetchMedicalProduct(organizationSelected.value?.id)
    isLoading.value = false
  }

  const onSearch = useDebounce(async (value: string) => {
    hooks.setPage(1)
    hooks.setSearch(value)
    isLoading.value = true
    await hooks.onFetchMedicalProduct(organizationSelected.value?.id)
    isLoading.value = false
  }, 1000)

  const onSelectItemsPerPage = async (value: number) => {
    hooks.setPage(1)
    hooks.setLimit(value)
    isLoading.value = true
    await hooks.onFetchMedicalProduct(organizationSelected.value?.id)
    isLoading.value = false
  }

  const onRowClick = (_: unknown, { item }) => {
    router.push(ROUTE_DANH_MUC_HANG_HOA.DETAIL.pathFunc(item.id))
  }

  const headers = computed(() => {
    const appendHeaders =
      selectedMedicalProductType.value === 'THUOC'
        ? [
            {
              title: `Loại đăng ký`,
              key: 'LoaiDangKy.name',
              minWidth: '160px',
            },
          ]
        : []

    return [
      {
        title: `Tên ${currentLabel.value}`,
        key: 'TenHangHoa',
        minWidth: '260px',
      },
      ...appendHeaders,
      {
        title: `Nhóm ${currentLabel.value}`,
        key: 'NhomHangHoa.name',
        minWidth: '160px',
      },
      {
        title: 'Trạng thái',
        key: 'TrangThai.name',
        minWidth: '160px',
      },
      {
        title: 'Tồn khả dụng',
        key: 'available_quantity',
        minWidth: '160px',
      },
      {
        title: 'Tồn thực tế',
        key: 'real_quantity',
        minWidth: '160px',
      },
      {
        title: 'Thời gian tạo',
        key: 'created_at',
        minWidth: '200px',
      },
    ]
  })

  function onLoadTable({ page, itemsPerPage, sortBy, ...args }) {}
</script>

<style scoped lang="scss"></style>
