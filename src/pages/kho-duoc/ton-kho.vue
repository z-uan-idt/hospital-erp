<template>
  <v-container
    fluid
    class="erp-lo-hang pa-md-6 pa-3"
  >
    <div class="d-flex align-center flex-row justify-space-between ga-4">
      <div class="d-flex align-center justify-start ga-3 w-100 w-md-auto">
        <h1 :class="['text-lg-h5 text-h6 font-weight-medium', 'text-blue-grey-darken-3']">Tồn kho</h1>
      </div>

      <div class="action-buttons d-flex align-center ga-2">
        <v-btn
          icon
          variant="outlined"
          color="erp-gray"
          size="small"
          @click="isBatchWarningSettingsVisible = true"
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
      :page="hooks.page.value"
      :items-per-page="hooks.limit.value"
      :items="batchStocks"
      item-value="name"
      :headers="headers"
      class="mt-3"
      fixed-header
      hover
      :loading="isLoading"
      :items-length="hooks.count"
      disable-sort
      style="height: calc(100dvh - 260px)"
    >
      <template v-slot:header.medical_product.TenHangHoa="{ column }">
        <v-select
          v-model="hooks.mpType.value"
          :items="MEDICAL_PRODUCT_TYPES"
          variant="outlined"
          rounded="lg"
          density="compact"
          class="ms-n4"
          item-title="label_plural"
          item-value="value"
          hide-details
          max-width="max-content"
          @update:model-value="onChangeMPType"
        >
          <template v-slot:prepend-inner>
            <v-icon
              size="20"
              class="text-erp-gray-900 me-2"
            >
              {{ MEDICAL_PRODUCT_TYPES.find((item) => item.value === hooks.mpType.value)?.icon }}
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

      <template v-slot:item.alert="{ item }">
        <div
          v-if="getColorWarningHSD(item.expired_date) && !getColorWarningHSD(item.expired_date)?.is_expired"
          class="ripple-multiple"
          :style="{
            '--v-ripple-color': Colors[getColorWarningHSD(item.expired_date)?.color]?.[400] || Colors['erp-gray'][600],
          }"
        >
          <v-btn
            icon
            variant="tonal"
            density="comfortable"
            :color="getColorWarningHSD(item.expired_date)?.color"
          >
            <v-icon
              size="18"
              :color="`text-${getColorWarningHSD(item.expired_date)?.color}`"
            >
              mdi-warning-outline
            </v-icon>
          </v-btn>
        </div>
      </template>

      <template v-slot:item.code="{ item }">
        <v-chip
          variant="outlined"
          :elevation="3"
        >
          <v-icon
            size="16"
            class="text-erp-gray-800 me-1"
          >
            custom-box-open
          </v-icon>
          {{ item.code }}
        </v-chip>
      </template>

      <template v-slot:item.medical_product.TenHangHoa="{ item }">
        <v-card
          class="pa-0"
          :subtitle="item.medical_product?.MaHangHoa"
          elevation="0"
        >
          <template v-slot:prepend>
            <v-avatar
              color="erp-brand"
              class="ms-n4 me-1"
              size="42"
              :image="item.medical_product?.image"
              :text="item.medical_product?.TenHangHoa.charAt(0).toUpperCase()"
            />
          </template>
          <template v-slot:title>
            <span class="text-body-2 font-weight-medium text-erp-gray-800">
              {{ item.medical_product?.TenHangHoa }}
            </span>
          </template>
          <template v-slot:subtitle>
            <span class="text-body-2 font-weight-regular text-erp-gray-800">
              #{{ item.medical_product?.MaHangHoa || 'N/A' }}
            </span>
          </template>
        </v-card>
      </template>

      <template #item.real_quantity="{ item }">
        <v-chip
          v-if="getColorWarningQuantity(item.receipt_status, item.real_quantity)"
          :color="getColorWarningQuantity(item.receipt_status, item.real_quantity)"
        >
          <div class="d-flex align-center justify-start ga-1">
            <v-icon
              size="18"
              :color="`text-${getColorWarningQuantity(item.receipt_status, item.real_quantity)}`"
              :style="item.real_quantity === 0 ? `margin-top: -2px` : ''"
            >
              mdi-warning-outline
            </v-icon>

            {{ typeof item.real_quantity === 'number' ? formatNumberDot(item.real_quantity) : 'N/A' }}
          </div>
        </v-chip>
        <span
          v-else
          class="text-black"
          :class="{
            'text-erp-blue-light': item?.['is_changed_quantity'] ?? false,
          }"
        >
          {{ typeof item.real_quantity === 'number' ? formatNumberDot(item.real_quantity) : 'N/A' }}
        </span>
        <span
          class="text-erp-gray-700 text-caption ms-1"
          :class="{
            'text-erp-blue-light': item?.['is_changed_quantity'] ?? false,
          }"
        >
          {{ item.unit?.name }}
        </span>
      </template>

      <template #item.available_quantity="{ item }">
        <v-chip
          v-if="getColorWarningQuantity(item.receipt_status, item.available_quantity)"
          :color="getColorWarningQuantity(item.receipt_status, item.available_quantity)"
        >
          <div class="d-flex align-center justify-start ga-1">
            <v-icon
              size="18"
              :color="`text-${getColorWarningQuantity(item.receipt_status, item.available_quantity)}`"
              :style="item.available_quantity === 0 ? `margin-top: -2px` : ''"
            >
              mdi-warning-outline
            </v-icon>

            {{ typeof item.available_quantity === 'number' ? formatNumberDot(item.available_quantity) : 'N/A' }}
          </div>
        </v-chip>
        <span
          v-else
          class="text-black"
          :class="{
            'text-erp-blue-light': item?.['is_changed_available_quantity'] ?? false,
          }"
        >
          {{ typeof item.available_quantity === 'number' ? formatNumberDot(item.available_quantity) : 'N/A' }}
        </span>
        <span
          class="text-erp-gray-700 text-caption ms-1"
          :class="{
            'text-erp-blue-light': item?.['is_changed_available_quantity'] ?? false,
          }"
        >
          {{ item.unit?.name }}
        </span>
      </template>

      <template #item.MFG_date="{ item }">
        <p class="text-black">
          {{ item.MFG_date ? formatDate(item.MFG_date) : 'N/A' }}
        </p>
      </template>

      <template #item.expired_date="{ item }">
        <div class="d-flex align-center justify-start ga-2">
          <p class="text-black">
            {{ item.expired_date ? formatDate(item.expired_date) : 'N/A' }}
          </p>

          <v-chip
            v-if="getColorWarningHSD(item.expired_date)"
            :color="getColorWarningHSD(item.expired_date)?.color"
          >
            <div class="d-flex align-center justify-start ga-1">
              <v-icon
                :size="getColorWarningHSD(item.expired_date)?.is_expired ? 16 : 18"
                :color="`text-${getColorWarningHSD(item.expired_date)?.color}`"
              >
                {{ getColorWarningHSD(item.expired_date)?.is_expired ? 'mdi-tag-outline' : 'mdi-warning-outline' }}
              </v-icon>

              {{ calculateDateDifference(item.expired_date, new Date())?.text }}
            </div>
          </v-chip>
        </div>
      </template>

      <template v-slot:item.created_at="{ item }">
        <span>{{ formatDate(item.created_at, 'HH:mm:ss dd/MM/yyyy') }}</span>
        <p class="text-erp-gray-700">
          Bởi <span class="font-weight-medium text-black">{{ item.created_by?.full_name }}</span>
        </p>
      </template>

      <template v-slot:item.receipt_status="{ item }">
        <v-chip
          :variant="item.receipt_status?.value === 'DRAFT' ? 'outlined' : 'tonal'"
          :color="getStatusColor(item.receipt_status?.value)"
        >
          {{ item.receipt_status.label }}
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

    <v-dialog
      v-model="isBatchWarningSettingsVisible"
      max-width="750"
      persistent
    >
      <v-form @submit.prevent="onSubmitBatchWarningSettings">
        <v-card class="pb-2 pe-2 pt-2 erp-scrollbar">
          <template v-slot:title>
            <div class="d-flex align-center justify-space-between">
              Cài đặt cảnh báo Lô hàng
              <v-btn
                size="small"
                icon="mdi-close"
                variant="outlined"
                class="text-body-2"
                color="grey-darken-1"
                @click="isBatchWarningSettingsVisible = false"
              />
            </div>
          </template>

          <div class="ps-6 pe-6">
            <CommonDivider label="Cài đặt hiển thị cảnh báo cho lô hàng" />

            <v-divider>
              <v-tabs
                v-model="tabActive"
                class="pt-2 pb-2 px-3 rounded-pill"
                show-arrows
                hide-slider
                bg-color="erp-gray-300"
                height="59"
                selected-class="bg-white border rounded-xl border-opacity-25"
                density="compact"
              >
                <v-tab
                  v-for="tab in tabs"
                  :key="tab.name"
                  :text="tab.label"
                  :value="tab.name"
                  height="100%"
                  class="rounded-xl border border-opacity-0 ps-4 pe-4 text-body-2"
                />
              </v-tabs>
            </v-divider>

            <v-tabs-window v-model="tabActive">
              <v-tabs-window-item value="HSD">
                <v-row>
                  <v-col
                    v-for="(batchWarning, index) in batchWarningHSD"
                    :key="batchWarning.id"
                    cols="12"
                    sm="12"
                    md="12"
                    class="pb-0"
                  >
                    <CommonFieldset
                      :title="`Mức ${index + 1}`"
                      class="pb-0 d-flex align-start justify-space-between ga-3"
                    >
                      <v-number-input
                        v-model="batchWarning.amount"
                        type="number"
                        label="Số lượng"
                        placeholder="Nhập số lượng"
                        :rules="[formRules.required]"
                      >
                        <template #label>
                          <div class="d-flex align-center justify-start w-100">
                            <span>
                              Số lượng
                              <span class="text-red-darken-3"> * </span>
                            </span>
                          </div>
                        </template>
                      </v-number-input>

                      <v-select
                        v-model="batchWarning.type"
                        :items="HSD_dropdown"
                        item-title="title"
                        item-value="value"
                        width="max-content"
                      />

                      <v-select
                        v-model="batchWarning.level_type"
                        :items="Color_dropdown"
                        item-title="color"
                        item-value="value"
                        hide-details
                        max-width="56px"
                        :menu-icon="null"
                      >
                        <template #selection>
                          <v-chip
                            :color="Color_dropdown.find((color) => color.value === batchWarning.level_type)?.color"
                            style="--v-activated-opacity: 1; max-width: 24px; max-height: 24px"
                            width="24"
                            height="24"
                          />
                        </template>

                        <template v-slot:item="{ props: itemProps, item }">
                          <v-list-item
                            v-bind="itemProps"
                            title=""
                            class="py-0"
                          >
                            <v-btn
                              icon
                              :color="item.raw.color"
                              v-bind="itemProps"
                              width="24"
                              height="24"
                            />
                          </v-list-item>
                        </template>
                      </v-select>

                      <v-btn
                        icon
                        variant="outlined"
                        color="erp-gray"
                        size="small"
                        style="margin-top: 10px"
                        @click="onDeleteBatchWarning(batchWarning.type, index)"
                      >
                        <v-icon
                          size="18"
                          class="text-erp-error"
                          style="margin-right: -1px"
                        >
                          custom-trash
                        </v-icon>
                      </v-btn>
                    </CommonFieldset>
                  </v-col>

                  <v-col
                    v-if="batchWarningHSD.length < 5"
                    cols="12"
                    class="mt-4"
                  >
                    <v-btn
                      class="border-dashed"
                      variant="outlined"
                      color="erp-blue-light"
                      rounded="pill"
                      @click="addBatchWarning('DAY', batchWarningHSD.length)"
                    >
                      <template #prepend>
                        <v-icon
                          size="18"
                          class="text-erp-blue-light me-n1"
                        >
                          mdi-plus
                        </v-icon>
                      </template>
                      <span
                        class="text-body-2 text-erp-blue-light font-weight-medium"
                        style="margin-bottom: -1px"
                      >
                        Thêm mức độ
                      </span>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-tabs-window-item>
              <v-tabs-window-item value="QUANTITY">
                <v-row>
                  <v-col
                    v-for="(batchWarning, index) in batchWarningQuantity"
                    :key="batchWarning.id"
                    cols="12"
                    sm="12"
                    md="12"
                    class="pb-0"
                  >
                    <CommonFieldset
                      :title="`Mức ${index + 1}`"
                      class="pb-0 d-flex align-start justify-space-between ga-3"
                    >
                      <v-number-input
                        v-model="batchWarning.amount"
                        type="number"
                        label="Số lượng"
                        placeholder="Nhập số lượng"
                        :rules="[formRules.required]"
                      >
                        <template #label>
                          <div class="d-flex align-center justify-start w-100">
                            <span>
                              Số lượng
                              <span class="text-red-darken-3"> * </span>
                            </span>
                          </div>
                        </template>
                      </v-number-input>

                      <v-select
                        v-model="batchWarning.level_type"
                        :items="Color_dropdown"
                        item-title="color"
                        item-value="value"
                        hide-details
                        max-width="56px"
                        :menu-icon="null"
                      >
                        <template #selection>
                          <v-chip
                            :color="Color_dropdown.find((color) => color.value === batchWarning.level_type)?.color"
                            style="--v-activated-opacity: 1; max-width: 24px; max-height: 24px"
                            width="24"
                            height="24"
                          />
                        </template>

                        <template v-slot:item="{ props: itemProps, item }">
                          <v-list-item
                            v-bind="itemProps"
                            title=""
                            class="py-0"
                          >
                            <v-btn
                              icon
                              :color="item.raw.color"
                              v-bind="itemProps"
                              width="24"
                              height="24"
                            />
                          </v-list-item>
                        </template>
                      </v-select>

                      <v-btn
                        icon
                        variant="outlined"
                        color="erp-gray"
                        size="small"
                        style="margin-top: 10px"
                        @click="onDeleteBatchWarning(batchWarning.type, index)"
                      >
                        <v-icon
                          size="18"
                          class="text-erp-error"
                          style="margin-right: -1px"
                        >
                          custom-trash
                        </v-icon>
                      </v-btn>
                    </CommonFieldset>
                  </v-col>

                  <v-col
                    v-if="batchWarningQuantity.length < 5"
                    cols="12"
                    class="mt-4"
                  >
                    <v-btn
                      class="border-dashed"
                      variant="outlined"
                      color="erp-blue-light"
                      rounded="pill"
                      @click="addBatchWarning('QUANTITY', batchWarningQuantity.length)"
                    >
                      <template #prepend>
                        <v-icon
                          size="18"
                          class="text-erp-blue-light me-n1"
                        >
                          mdi-plus
                        </v-icon>
                      </template>
                      <span
                        class="text-body-2 text-erp-blue-light font-weight-medium"
                        style="margin-bottom: -1px"
                      >
                        Thêm mức độ
                      </span>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-tabs-window-item>
            </v-tabs-window>
          </div>

          <div class="d-flex justify-end pe-6 ps-6 pb-4 ga-3 mt-12">
            <v-btn
              color="erp-gray-600"
              elevation="0"
              variant="outlined"
              rounded="pill"
              size="large"
              class="flex-grow-1 flex-md-grow-0"
              @click="isBatchWarningSettingsVisible = false"
            >
              <template #prepend>
                <v-icon
                  size="20"
                  class="me-n2 text-erp-gray-800"
                >
                  mdi-close
                </v-icon>
              </template>
              <span class="text-body-1 text-erp-gray-800"> Hủy bỏ </span>
            </v-btn>
            <v-btn
              color="erp-brand"
              rounded="pill"
              elevation="0"
              type="submit"
              size="large"
              :loading="isLoadingBatchWarningSettings"
            >
              <template #prepend>
                <v-icon
                  class="me-n1"
                  size="22"
                >
                  mdi-check
                </v-icon>
              </template>
              <span class="text-body-1">Lưu lại</span>
            </v-btn>
          </div>
        </v-card>
      </v-form>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
  import type { DataTableHeader, SubmitEventPromise } from 'vuetify'
  import { MEDICAL_PRODUCT_TYPES } from '~/constants/core.constants'
  import type { IChoice } from '~/types/core.types'
  import { Colors } from '~/constants/color.constants'
  import { ITEM_PER_PAGES } from '~/constants/core.constants'
  import type { IMedicalProductType } from '~/types/medical_product.types'
  import type { IBatchWarningSettingsFormPayload } from '~/types/warehouse.types'

  definePageMeta({
    layout: 'default',
    middleware: ['auth'],
    keepalive: true,
  })

  useHead({
    title: 'Tồn kho',
  })

  const LoaiHangHoa = ref<IMedicalProductType>('THUOC')

  const isLoading = ref(false)
  const formRules = useFormRules()
  const systemStore = useSystemStore()
  const { warehouseSelected } = useAuth()
  const isBatchWarningSettingsVisible = ref(false)
  const { batchStocks, ...hooks } = useBatchStock()

  const onSelectItemsPerPage = async (value: number) => {
    hooks.setPage(1)
    hooks.setLimit(value)
    isLoading.value = true
    hooks.setMPType(LoaiHangHoa.value)
    await hooks.onFetchBatchStock(warehouseSelected.value)
    isLoading.value = false
  }

  const batchWarningQuantity = ref<IBatchWarningSettingsFormPayload['batch_warnings']>([])
  const batchWarningHSD = ref<IBatchWarningSettingsFormPayload['batch_warnings']>([])

  const HSD_dropdown = ref([
    {
      title: 'Ngày',
      value: 'DAY',
    },
    {
      title: 'Tháng',
      value: 'MONTH',
    },
    {
      title: 'Năm',
      value: 'YEAR',
    },
  ])

  const Color_dropdown = ref([
    {
      color: 'erp-error',
      value: 1,
    },
    {
      color: 'erp-warning',
      value: 2,
    },
    {
      color: 'erp-blue-light',
      value: 3,
    },
    {
      color: 'erp-gray-800',
      value: 4,
    },
    {
      color: 'erp-brand',
      value: 5,
    },
  ])

  const getStatusColor = (status: string) => {
    if (status === 'DRAFT') return 'erp-gray-700'
    if (status === 'PENDING') return 'erp-gray-700'
    if (status === 'APPROVED') return 'erp-brand-600'
    if (status === 'REJECTED') return 'erp-error-600'
    if (status === 'CANCELLED') return 'erp-error-600'
    return 'erp-gray-700'
  }

  const onDeleteBatchWarning = (type: 'QUANTITY' | 'DAY' | 'MONTH' | 'YEAR', index: number) => {
    if (type === 'QUANTITY') {
      batchWarningQuantity.value.splice(index, 1)
    } else {
      batchWarningHSD.value.splice(index, 1)
    }
  }

  const resultsSettings = ref<
    {
      id: number
      type: 'QUANTITY' | 'DAY' | 'MONTH' | 'YEAR'
      level: number
      level_type: 1 | 2 | 3 | 4 | 5
      amount: number
      receipt_status?: IChoice
    }[]
  >([])

  const onLoadBatchWarningSettings = async () => {
    resultsSettings.value = []
    batchWarningHSD.value = []
    batchWarningQuantity.value = []
    const result = await hooks.onFetchBatchWarningSettings(warehouseSelected?.value)
    if (result) {
      const results = result.map((item) => ({
        id: item.id ?? undefined,
        type: item.type?.value as 'QUANTITY' | 'DAY' | 'MONTH' | 'YEAR',
        level: item.level ?? undefined,
        level_type: item.level_type?.value as unknown as 1 | 2 | 3 | 4 | 5,
        amount: item.amount ?? undefined,
      }))
      resultsSettings.value = JSON.parse(JSON.stringify([...results]))
      batchWarningQuantity.value = results.filter((item) => item.type === 'QUANTITY')
      batchWarningHSD.value = results.filter((item) => item.type !== 'QUANTITY')

      if (tabActive.value === 'QUANTITY' && batchWarningQuantity.value.length === 0) {
        addBatchWarning('QUANTITY', 1)
      }
      if (tabActive.value === 'HSD' && batchWarningHSD.value.length === 0) {
        addBatchWarning('DAY', 1)
      }
    }
  }

  watch(
    () => isBatchWarningSettingsVisible.value,
    (newVal) => {
      if (!newVal) {
        const results = JSON.parse(JSON.stringify([...resultsSettings.value]))
        batchWarningQuantity.value = results.filter((item) => item.type === 'QUANTITY')
        batchWarningHSD.value = results.filter((item) => item.type !== 'QUANTITY')
      }
    }
  )

  const getColorWarningQuantity = (status: IChoice, quantity: number) => {
    const QUANTITIES = resultsSettings.value
      .filter((item) => item.type === 'QUANTITY')
      .sort((a, b) => {
        return a.amount - b.amount
      })

    if (status?.value !== 'APPROVED') {
      return null
    }

    for (const item of QUANTITIES) {
      if (quantity <= item.amount) {
        return Color_dropdown.value.find((color) => color.value === item.level_type)?.color
      }
    }

    return null
  }

  const getColorWarningHSD = (date: string) => {
    const calculate = calculateDateDifference(date, new Date())
    const decimal = calculate?.item?.decimal

    const HSD = resultsSettings.value
      .filter((item) => item.type !== 'QUANTITY')
      .sort((a, b) => {
        const typePriority = { DAY: 1, MONTH: 2, YEAR: 3 }
        if (typePriority[a.type] !== typePriority[b.type]) {
          return typePriority[a.type] - typePriority[b.type]
        }
        return a.amount - b.amount
      })

    for (const item of HSD) {
      if (!(item.type in decimal)) {
        return null
      }

      const warningColor = Color_dropdown.value.find((color) => color.value === item.level_type)?.color

      if (item.type === 'DAY' && decimal.DAY <= item.amount) {
        return {
          color: warningColor,
          is_expired: calculate?.is_expired,
        }
      } else if (item.type === 'MONTH' && decimal.MONTH <= item.amount) {
        return {
          color: warningColor,
          is_expired: calculate?.is_expired,
        }
      } else if (item.type === 'YEAR' && decimal.YEAR <= item.amount) {
        return {
          color: warningColor,
          is_expired: calculate?.is_expired,
        }
      }
    }

    return null
  }

  const isLoadingBatchWarningSettings = ref(false)
  const { $toast } = useNuxtApp()

  const onSubmitBatchWarningSettings = async (formEvent: SubmitEventPromise) => {
    const result = await formEvent
    if (result.valid) {
      isLoadingBatchWarningSettings.value = true
      const payload = {
        warehouse: warehouseSelected?.value as number,
        batch_warnings: [...batchWarningQuantity.value, ...batchWarningHSD.value],
      }
      try {
        await hooks.onBatchWarningSetting(
          payload,
          (result) => {
            $toast.success('Đã cập nhật cài đặt cảnh báo lô hàng')
            isBatchWarningSettingsVisible.value = false
            const results = result.map((item) => ({
              id: item.id ?? undefined,
              type: item.type?.value as 'QUANTITY' | 'DAY' | 'MONTH' | 'YEAR',
              level: item.level ?? undefined,
              level_type: item.level_type?.value as unknown as 1 | 2 | 3 | 4 | 5,
              amount: item.amount ?? undefined,
            }))

            batchWarningQuantity.value = results.filter((item) => item.type === 'QUANTITY')
            batchWarningHSD.value = results.filter((item) => item.type !== 'QUANTITY')
            resultsSettings.value = results
          },
          (error) => {
            $toast.error(error)
          }
        )
      } catch {
        $toast.error('Hệ thống đang có lỗi, vui lòng thử lại sau')
      } finally {
        isLoadingBatchWarningSettings.value = false
      }
    }
  }

  const addBatchWarning = (type: 'QUANTITY' | 'DAY' | 'MONTH' | 'YEAR', level: number) => {
    if (type === 'QUANTITY') {
      batchWarningQuantity.value.push({
        id: undefined,
        type,
        level,
        level_type: 1,
        amount: null,
      })
    } else {
      batchWarningHSD.value.push({
        id: undefined,
        type,
        level,
        level_type: 1,
        amount: null,
      })
    }
  }

  const tabs = ref([
    {
      name: 'HSD',
      label: 'Cảnh báo HSD',
    },
    {
      name: 'QUANTITY',
      label: 'Cảnh báo số lượng',
    },
  ])

  const tabActive = ref('HSD')

  const headers = ref<DataTableHeader[]>([
    {
      title: '',
      key: 'alert',
      width: 50,
    },
    {
      title: 'Mã lô',
      key: 'code',
      width: 200,
    },
    {
      title: 'Trạng thái phiếu nhập',
      key: 'receipt_status',
      width: 200,
    },
    {
      title: 'Thuốc',
      key: 'medical_product.TenHangHoa',
    },
    {
      title: 'Tồn khả dụng',
      key: 'available_quantity',
      width: 220,
    },
    {
      title: 'Tồn thực tế',
      key: 'real_quantity',
      width: 220,
    },
    {
      title: 'Ngày sản xuất',
      key: 'MFG_date',
    },
    {
      title: 'Hạn sử dụng',
      key: 'expired_date',
    },
    {
      title: 'Thời gian tạo',
      key: 'created_at',
    },
  ])

  watch(
    () => systemStore.realtimeERPMessage,
    (newVal) => {
      try {
        const stockWatchs = JSON.parse(newVal?.stock_watch?.data) || []
        if (stockWatchs.length > 0) {
          batchStocks.value = batchStocks.value.map((item) => {
            const onStockApprovedItem = stockWatchs.find((stock) => stock?.goods_received_note_batch_id === item.id)
            item['is_changed_quantity'] = onStockApprovedItem && 'real_quantity' in onStockApprovedItem
            item['is_changed_available_quantity'] = onStockApprovedItem && 'available_quantity' in onStockApprovedItem
            if (onStockApprovedItem && 'real_quantity' in onStockApprovedItem) {
              item.real_quantity = onStockApprovedItem?.real_quantity ?? 0
            }
            if (onStockApprovedItem && 'available_quantity' in onStockApprovedItem) {
              item.available_quantity = onStockApprovedItem?.available_quantity ?? 0
            }
            return item
          })
        }

        const timeout = setTimeout(() => {
          batchStocks.value = batchStocks.value.map((item) => ({
            ...item,
            is_changed_available_quantity: false,
            is_changed_quantity: false,
          }))
        }, 450)

        return () => {
          clearTimeout(timeout)
        }
      } catch {}
    },
    {
      deep: true,
    }
  )

  watch(
    warehouseSelected,
    async () => {
      if (warehouseSelected.value) {
        hooks.setPage(1)
        isLoading.value = true
        hooks.setMPType(LoaiHangHoa.value)
        await hooks.onFetchBatchStock(warehouseSelected.value)
        isLoading.value = false
      }
    },
    {
      immediate: true,
    }
  )

  const onChangeMPType = async (mpType: IMedicalProductType) => {
    hooks.setPage(1)
    isLoading.value = true
    hooks.setMPType(mpType)
    await hooks.onFetchBatchStock(warehouseSelected.value)
    isLoading.value = false
  }

  watch(
    warehouseSelected,
    async () => {
      if (warehouseSelected.value) {
        await onLoadBatchWarningSettings()
      }
    },
    {
      immediate: true,
    }
  )

  const onSearch = useDebounce(async (value: string) => {
    hooks.setPage(1)
    hooks.setSearch(value)
    hooks.setMPType(LoaiHangHoa.value)
    isLoading.value = true
    await hooks.onFetchBatchStock(warehouseSelected.value)
    isLoading.value = false
  }, 1000)

  const onPageChange = async (value: number) => {
    hooks.setPage(value)
    hooks.setMPType(LoaiHangHoa.value)
    isLoading.value = true
    await hooks.onFetchBatchStock(warehouseSelected.value)
    isLoading.value = false
  }

  function onLoadTable({ page, itemsPerPage, sortBy, ...args }) {}
</script>

<style scoped lang="scss"></style>
