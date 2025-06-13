<template>
  <div class="erp-scrollbar">
    <CommonFieldset
      title="Thông tin phiếu"
      class="pb-6"
    >
      <v-row>
        <v-col
          cols="12"
          md="6"
          lg="6"
          class="pb-0"
        >
          <v-text-field
            v-model="formPayload.code"
            label="Mã phiếu"
            placeholder="Nhập mã phiếu"
            :rules="[formRules.required]"
          >
            <template #label>
              <div class="d-flex align-center justify-start w-100">
                <span>
                  Mã phiếu
                  <span class="text-red-darken-3"> * </span>
                </span>
              </div>
            </template>
          </v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="6"
          lg="6"
          class="pb-0"
        >
          <v-select
            label="Nhà cung cấp"
            :items="[]"
            disabled
          />
        </v-col>

        <v-col
          cols="12"
          md="12"
          lg="12"
          :class="{ 'pb-0': formPayload.is_other_reason }"
        >
          <v-select
            v-model="reason"
            label="Lý do xuất"
            :items="groupServices"
            item-title="name"
            item-value="name"
            :rules="[formRules.required]"
            placeholder="Chọn lý do xuất"
            hide-details
            class="custom-input-message"
          >
            <template #label>
              <div class="d-flex align-center justify-start w-100">
                <span>
                  Lý do xuất
                  <span class="text-red-darken-3"> * </span>
                </span>
              </div>
            </template>
            <template
              v-if="formPayload.is_other_reason"
              #message
            />
          </v-select>

          <template v-if="formPayload.is_other_reason">
            <v-textarea
              v-model="formPayload.reason"
              label="Lý do khác"
              placeholder="Nhập lý do khác"
              width="100%"
              :rules="[formRules.required]"
            >
              <template #label>
                <div class="d-flex align-center justify-start w-100">
                  <span>
                    Lý do khác
                    <span class="text-red-darken-3"> * </span>
                  </span>
                </div>
              </template>
            </v-textarea>
          </template>
        </v-col>
      </v-row>
    </CommonFieldset>

    <CommonFieldset
      title="Thông tin lô hàng xuất"
      class="mt-10 pb-10"
    >
      <v-row>
        <v-col
          v-for="(batch, index) in formPayload.batches || []"
          cols="12"
          md="6"
          lg="4"
          class="pb-0"
        >
          <v-card
            elevation="0"
            class="pa-2 border-opacity-25 border"
          >
            <template #append>
              <v-btn
                icon
                class="mb-2"
                size="small"
                variant="outlined"
                color="erp-gray-600"
                @click="removeBatch(index)"
              >
                <v-icon
                  size="20"
                  color="red"
                >
                  custom-trash
                </v-icon>
              </v-btn>
            </template>
            <template #prepend>
              <v-icon
                size="20"
                class="me-n1"
              >
                custom-box-open
              </v-icon>
            </template>
            <template #title>
              <span class="text-subtitle-1 ms-2">Lô hàng {{ index + 1 }}</span>
            </template>

            <v-row class="px-3 pb-8">
              <v-col
                cols="12"
                md="12"
                lg="12"
                class="pb-0"
              >
                <v-select
                  :model-value="
                    nhomThuoc?.[index] ||
                    (batch.medical_product_info?.LoaiHangHoa?.value as IMedicalProductType) ||
                    selectedMedicalProductType
                  "
                  :items="MEDICAL_PRODUCT_TYPES"
                  variant="outlined"
                  rounded="lg"
                  density="comfortable"
                  item-title="label_plural"
                  item-value="value"
                  hide-details
                  :placeholder="`Chọn ${getCurrentSelected(index, batch.medical_product_info)?.label?.toLowerCase()}`"
                  @update:model-value="onChangeNhomThuoc($event, index)"
                >
                  <template
                    v-if="
                      nhomThuoc?.[index] || batch.medical_product_info?.LoaiHangHoa?.value || selectedMedicalProductType
                    "
                    v-slot:prepend-inner
                  >
                    <v-icon
                      size="20"
                      class="text-erp-gray-900 me-1 ms-1"
                    >
                      {{ getCurrentSelected(index, batch.medical_product_info)?.icon }}
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
              </v-col>

              <v-col
                cols="12"
                md="12"
                lg="12"
                class="mb-2"
              >
                <v-menu
                  scroll-strategy="close"
                  :model-value="menuActive === index"
                  :close-on-content-click="false"
                  location="bottom right"
                  transition="fade-transition"
                  style="z-index: 10"
                  @update:model-value="menuActive = null"
                >
                  <template #activator="{ props }">
                    <v-sheet
                      ref="sheetRef"
                      rounded="lg"
                      color="erp-gray-200"
                      class="pa-4 d-flex align-center justify-space-between border border-opacity-25 ga-3"
                      :class="{
                        'border-opacity-25': menuActive === index,
                      }"
                      v-bind="props"
                      style="transition: all 0.1s linear"
                    >
                      <div
                        v-if="!batch.medical_product"
                        class="left-sheet"
                      >
                        <label class="text-caption"> Bắt buộc </label>
                        <p class="text-subtitle-1">
                          Vui lòng chọn
                          {{ getCurrentSelected(index, batch.medical_product_info)?.label?.toLowerCase() }}
                        </p>
                      </div>
                      <template v-else>
                        <v-avatar
                          rounded="lg"
                          color="erp-brand"
                          size="42"
                          :image="batch.medical_product_info?.image"
                          :text="batch.medical_product_info?.TenHangHoa.charAt(0).toUpperCase()"
                        />
                        <div class="left-sheet text-truncate w-100 overflow-hidden">
                          <label class="text-caption">
                            Mã {{ getCurrentSelected(index, batch.medical_product_info)?.label?.toLowerCase() }}:
                            {{ batch.medical_product_info?.MaHangHoa || 'N/A' }}
                          </label>
                          <p
                            class="text-truncate"
                            style="max-width: 100%"
                          >
                            {{ batch.medical_product_info?.TenHangHoa || 'N/A' }}
                          </p>
                        </div>
                      </template>

                      <v-btn
                        elevation="2"
                        rounded="pill"
                        size="large"
                        class="flex-grow-1 flex-md-grow-0"
                        @click.stop="onOpenSelectDrug(index)"
                      >
                        <template #prepend>
                          <v-icon
                            size="24"
                            class="me-n1"
                          >
                            mdi-search
                          </v-icon>
                        </template>
                        <span class="text-body-1">
                          Chọn {{ getCurrentSelected(index, batch.medical_product_info)?.label?.toLowerCase() }}
                        </span>
                      </v-btn>
                    </v-sheet>
                  </template>

                  <v-sheet
                    elevation="0"
                    rounded="lg"
                    width="100%"
                    class="border-opacity-25 border my-2 erp-scrollbar pa-2"
                    style="z-index: 1"
                  >
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
                      class="mt-3 mx-3 mb-4"
                      @update:model-value="onSearch"
                    />

                    <v-infinite-scroll
                      v-if="!isLoading && menuActive === index"
                      height="300"
                      :items="medicalProductItems"
                      class="pb-2"
                      :empty-text="medicalProductItems.length === 0 ? 'Không có dữ liệu' : 'Không còn kết quả nào'"
                      @load="onLoadMore"
                    >
                      <div
                        v-for="(medical_product, cIndex) in medicalProductItems"
                        :key="medical_product.id"
                      >
                        <v-sheet
                          ref="sheetRef"
                          rounded="lg"
                          color="erp-gray-200"
                          class="pa-4 d-flex align-center justify-space-between ga-3 ma-2 mx-3"
                          :class="{
                            'mt-n4': cIndex === 0,
                          }"
                          v-bind="props"
                          style="transition: all 0.1s linear"
                        >
                          <v-avatar
                            rounded="lg"
                            color="erp-brand"
                            size="42"
                            :image="medical_product?.image"
                            :text="medical_product?.TenHangHoa.charAt(0).toUpperCase()"
                          />
                          <div class="left-sheet text-truncate w-100 overflow-hidden">
                            <label class="text-caption">
                              Mã {{ getCurrentSelected(index, batch.medical_product_info)?.label?.toLowerCase() }}:
                              {{ medical_product?.MaHangHoa || 'N/A' }}
                            </label>
                            <p
                              class="text-truncate"
                              style="max-width: 100%"
                            >
                              {{ medical_product?.TenHangHoa || 'N/A' }}
                            </p>
                          </div>

                          <v-btn
                            elevation="2"
                            rounded="pill"
                            class="flex-grow-1 flex-md-grow-0"
                            :disabled="batch.medical_product === medical_product.id"
                            :variant="batch.medical_product === medical_product.id ? 'outlined' : 'elevated'"
                            @click.stop="selectDrug(medical_product, index)"
                          >
                            <span class="text-body-1">{{
                              batch.medical_product === medical_product.id ? 'Đang chọn' : 'Chọn'
                            }}</span>
                          </v-btn>
                        </v-sheet>
                      </div>
                    </v-infinite-scroll>
                    <div
                      v-if="isLoading"
                      class="d-flex justify-center align-center pt-6"
                    >
                      <v-progress-circular
                        indeterminate
                        size="30"
                      />
                    </div>
                  </v-sheet>
                </v-menu>
              </v-col>

              <v-col
                cols="12"
                md="12"
                lg="12"
                class="pb-0"
              >
                <v-select
                  v-model="batch.goods_received_note_batch"
                  label="Lô"
                  :items="batch.batches || []"
                  item-title="code"
                  item-value="id"
                  :rules="[formRules.required]"
                  placeholder="Chọn lô"
                  :loading="batch?.loading || false"
                  @update:model-value="selectBatch($event, index)"
                  @update:menu="(v) => v && fetchGoodsReceivedNoteBatchByDrug(index, batch.medical_product)"
                >
                  <template #label>
                    <div class="d-flex align-center justify-start w-100">
                      <span>
                        Lô
                        <span class="text-red-darken-3"> * </span>
                      </span>
                    </div>
                  </template>
                  <template
                    v-if="batch?.goods_received_note_batch_info"
                    #details
                  >
                    <div class="d-flex align-center justify-start w-100">
                      <span class="text-body-2 text-erp-gray-800">
                        Còn: {{ batch?.goods_received_note_batch_info?.available_quantity }}
                        {{ batch?.goods_received_note_batch_info?.unit?.name?.toLowerCase() }}
                      </span>
                      <v-icon>mdi-dot</v-icon>
                      <span class="text-body-2 text-erp-gray-800">
                        HSD: {{ formatDate(batch?.goods_received_note_batch_info?.expired_date) || 'N/A' }}
                      </span>
                    </div>
                  </template>
                </v-select>
              </v-col>

              <v-col
                cols="12"
                md="12"
                lg="6"
                class="pb-0"
              >
                <v-number-input
                  v-model="batch.quantity"
                  label="Số lượng xuất"
                  placeholder="Nhập số lượng xuất"
                  :rules="[
                    formRules.required,
                    (v) =>
                      batch?.goods_received_note_batch_info
                        ? v > batch?.goods_received_note_batch_info?.available_quantity
                          ? `Không được vượt quá ${batch?.goods_received_note_batch_info?.available_quantity} ${batch?.goods_received_note_batch_info?.unit?.name?.toLowerCase()}`
                          : true
                        : true,
                  ]"
                >
                  <template #label>
                    <div class="d-flex align-center justify-start w-100">
                      <span>
                        Số lượng xuất
                        <span class="text-red-darken-3"> * </span>
                      </span>
                    </div>
                  </template>
                </v-number-input>
              </v-col>

              <v-col
                cols="12"
                md="12"
                lg="6"
                class="pb-0"
              >
                <v-number-input
                  v-model="batch.price"
                  label="Đơn giá xuất"
                  placeholder="Nhập đơn giá xuất"
                  :rules="[formRules.required]"
                  control-variant="hidden"
                >
                  <template #label>
                    <div class="d-flex align-center justify-start w-100">
                      <span>
                        Đơn giá xuất
                        <span class="text-red-darken-3"> * </span>
                      </span>
                    </div>
                  </template>
                  <template
                    v-if="batch.medical_product_info?.DonViNhap"
                    #append-inner
                  >
                    <div class="text-body-2 text-erp-gray-800 d-flex align-center justify-start mb-n1">
                      <span>/</span>
                      <span>{{ batch.medical_product_info?.DonViNhap?.name }}</span>
                    </div>
                  </template>
                </v-number-input>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col
          cols="12"
          md="6"
          lg="4"
          class="pb-0 d-flex justify-start align-center"
        >
          <v-btn
            color="pmg-gray-700"
            elevation="0"
            variant="outlined"
            rounded="pill"
            size="large"
            class="flex-grow-1 flex-md-grow-0"
            @click="addBatch"
          >
            <template #prepend>
              <v-icon
                size="20"
                class="me-n1"
              >
                mdi-plus
              </v-icon>
            </template>
            <span class="text-body-1">Thêm lô hàng</span>
          </v-btn>
        </v-col>
      </v-row>
    </CommonFieldset>
  </div>
</template>

<script setup lang="ts">
  import type { IGroupService } from '~/types/core.types'
  import { MEDICAL_PRODUCT_TYPES } from '~/constants/core.constants'
  import type { IMedicalProduct, IMedicalProductType } from '~/types/medical_product.types'
  import type { IReceiptExport, IReceiptExportFormPayload } from '~/types/receipt.types'

  const props = defineProps<{
    receipt?: IReceiptExport
  }>()

  const formRules = useFormRules()
  const groupServiceHook = useGroupService()

  const groupServices = ref<IGroupService[]>([])
  const groupServiceNhomThuoc = ref<IGroupService[]>([])
  const nhomThuoc = ref<{ [key: number]: IMedicalProductType } | null>(null)

  onMounted(async () => {
    const result = await groupServiceHook.onFetchGroupServiceAutocomplete(1, 'LY_DO_XUAT_HANG', -1)
    groupServices.value = [
      ...result.items,
      {
        id: 0,
        name: 'Khác',
        code: 'OTHER',
      },
    ]
  })

  onMounted(async () => {
    const result = await groupServiceHook.onFetchGroupServiceAutocomplete(1, 'NHOM_HANG_HOA', -1)
    groupServiceNhomThuoc.value = result.items
  })

  const reason = ref('')
  const sheetRef = ref(null)
  const { organizationSelected, warehouseSelected, selectedMedicalProductType } = useAuth()
  const menuActive = ref<number | null>(null)

  const medicalProductItems = ref<IMedicalProduct[]>([])
  const { medicalProducts, ...hooks } = useMedicalProduct()

  const onChangeNhomThuoc = async (key: IMedicalProductType, index: number) => {
    if (!nhomThuoc.value) {
      nhomThuoc.value = {}
    }
    nhomThuoc.value[index] = key
  }

  const getCurrentSelected = (index: number, medical_product_info?: IMedicalProduct) => {
    const LoaiHangHoa = medical_product_info?.LoaiHangHoa?.value
    return MEDICAL_PRODUCT_TYPES.find(
      (item) => item.value === (nhomThuoc?.value?.[index] || LoaiHangHoa || selectedMedicalProductType?.value)
    )
  }

  const onOpenSelectDrug = async (index: number) => {
    menuActive.value = index
    isEmpty.value = false
    medicalProductItems.value = []
    hooks.setPage(1)
    hooks.setSearch('')
    hooks.setWid(warehouseSelected?.value as number)
  }

  const formPayload = ref<IReceiptExportFormPayload>({
    code: props.receipt?.code,
    warehouse: warehouseSelected?.value as number,
    reason: props.receipt?.reason,
    is_other_reason: props.receipt?.is_other_reason,
    batches: (props.receipt?.batches || []).map((batch) => ({
      id: batch?.id || undefined,
      medical_product: batch.medical_product?.id,
      medical_product_info: batch?.medical_product,
      quantity: batch.quantity,
      goods_received_note_batch_info: batch.goods_received_note_batch,
      goods_received_note_batch: batch.goods_received_note_batch?.id,
      unit: batch.unit?.id,
      price: batch.price,
      batches: [],
      loading: false,
    })),
  })

  const receiptHook = useReceipt()

  const fetchGoodsReceivedNoteBatchByDrug = async (index: number, medicalProductId: number) => {
    formPayload.value.batches[index].loading = true
    const batches = await receiptHook.onFetchGoodsReceivedNoteBatchByMedicalProduct(medicalProductId, props.receipt?.id)
    formPayload.value.batches[index].batches = batches.map((batch) => ({
      ...batch,
      code: `#${batch.code}`,
    }))
    formPayload.value.batches[index].loading = false
  }

  defineExpose({
    formPayload,
  })

  const addBatch = () => {
    formPayload.value.batches.push({
      medical_product: null,
      medical_product_info: null,
      quantity: null,
      goods_received_note_batch_info: null,
      goods_received_note_batch: null,
      unit: null,
      price: null,
      batches: [],
      loading: false,
    })
  }

  onMounted(() => {
    if (formPayload.value.batches.length === 0) {
      addBatch()
    }
  })

  const removeBatch = (index: number) => {
    formPayload.value.batches.splice(index, 1)

    if (formPayload.value.batches.length === 0) {
      addBatch()
    }
  }

  const selectBatch = (batch_id: number, index: number) => {
    const batch = formPayload.value.batches[index].batches?.find((batch) => batch.id === batch_id)
    if (batch) {
      formPayload.value.batches[index].goods_received_note_batch_info = batch
      formPayload.value.batches[index].goods_received_note_batch = batch.id
      formPayload.value.batches[index].price = batch.price
    }
  }

  const selectDrug = (medical_product: IMedicalProduct, index: number) => {
    formPayload.value.batches[index].goods_received_note_batch_info = null
    formPayload.value.batches[index].goods_received_note_batch = null
    formPayload.value.batches[index].unit = medical_product.DonViNhap?.id
    formPayload.value.batches[index].medical_product_info = medical_product
    formPayload.value.batches[index].medical_product = medical_product.id
    formPayload.value.batches[index].batches = []
    menuActive.value = null
  }

  watch(
    () => props.receipt,
    (newVal) => {
      formPayload.value = {
        code: newVal?.code,
        warehouse: warehouseSelected?.value as number,
        reason: newVal?.reason,
        is_other_reason: newVal?.is_other_reason,
        batches: (newVal?.batches || []).map((batch) => {
          batch.goods_received_note_batch.available_quantity = batch.available_quantity
          return {
            id: batch?.id || undefined,
            medical_product: batch.medical_product?.id,
            medical_product_info: {
              ...batch?.medical_product,
              available_quantity: batch?.available_quantity,
              max_quantity: batch?.max_quantity,
              is_unlimited: batch?.is_unlimited,
              min_quantity: batch?.min_quantity,
            },
            quantity: batch.quantity,
            goods_received_note_batch_info: batch.goods_received_note_batch,
            goods_received_note_batch: batch.goods_received_note_batch?.id,
            unit: batch.unit?.id,
            price: batch.price,
            batches: [batch.goods_received_note_batch],
            loading: false,
          }
        }),
      }
      reason.value = newVal?.is_other_reason ? 'Khác' : newVal?.reason
      formPayload.value.batches.forEach((batch, index) => {
        if (!nhomThuoc.value) {
          nhomThuoc.value = {}
        }
        if (batch.medical_product_info?.LoaiHangHoa?.value) {
          nhomThuoc.value[index] = batch.medical_product_info?.LoaiHangHoa?.value as IMedicalProductType
        } else {
          nhomThuoc.value[index] = selectedMedicalProductType?.value as IMedicalProductType
        }
      })
    },
    {
      immediate: true,
      deep: true,
    }
  )

  watch(reason, (newVal) => {
    formPayload.value.is_other_reason = newVal === 'Khác'
    if (formPayload.value.is_other_reason) {
      formPayload.value.reason = ''
    } else {
      formPayload.value.reason = newVal
    }
  })

  const isLastPage = computed(() => {
    return medicalProductItems.value.length >= hooks.count.value
  })

  const isEmpty = ref(false)
  const isLoading = ref(false)

  const onSearch = useDebounce(async (value: string) => {
    hooks.setPage(1)
    hooks.setLimit(10)
    hooks.setSearch(value)
    isLoading.value = true
    medicalProducts.value = []
    medicalProductItems.value = []
    await hooks.onFetchMedicalProduct(organizationSelected.value.id, nhomThuoc.value?.[menuActive.value])
    medicalProductItems.value = medicalProducts.value
    hooks.setPage(hooks.page.value + 1)
    medicalProducts.value = []
    isLoading.value = false
  }, 1000)

  watch(warehouseSelected, async (newVal) => {
    formPayload.value.batches.forEach((batch) => {
      batch.medical_product = null
      batch.medical_product_info = null
      batch.unit = null
      batch.price = null
    })
  })

  const onLoadMore = async ({ done }) => {
    if (medicalProductItems.value.length > 0 && hooks.page.value >= hooks.numPages.value) {
      done('empty')
      return
    }
    if (medicalProductItems.value.length === 0) {
      hooks.setPage(1)
    }
    hooks.setLimit(10)
    await hooks.onFetchMedicalProduct(organizationSelected.value.id, nhomThuoc.value?.[menuActive.value])
    medicalProductItems.value.push(...medicalProducts.value)

    if (medicalProducts.value.length === 0 || isLastPage.value) {
      done('empty')
    } else {
      hooks.setPage(hooks.page.value + 1)
      done('ok')
    }
  }

  const webSocket = useWebSocket('ws/erp')

  const isConnected = computed(() => webSocket.isConnected.value)

  watch(
    warehouseSelected,
    async () => {
      if (warehouseSelected.value && !isConnected.value) {
        webSocket.connect(`${warehouseSelected.value}`)
      } else if (isConnected.value) {
        webSocket.disconnect()
      }
    },
    {
      immediate: true,
    }
  )

  watch(webSocket.message, (newVal) => {
    try {
      const stockWatchs = JSON.parse(newVal?.stock_watch?.data) || []
      if (stockWatchs.length > 0) {
        formPayload.value.batches.forEach((batch) => {
          const stockWatch = stockWatchs.find(
            (stock) => stock?.goods_received_note_batch_id === batch.goods_received_note_batch
          )
          if (stockWatch && 'available_quantity' in stockWatch) {
            batch.goods_received_note_batch_info.available_quantity = stockWatch.available_quantity
            batch['is_changed_available_quantity'] = true
          }
        })
      }

      const timeout = setTimeout(() => {
        formPayload.value.batches.forEach((batch) => {
          batch['is_changed_available_quantity'] = false
        })
      }, 450)

      return () => {
        clearTimeout(timeout)
      }
    } catch {}
  })
</script>
