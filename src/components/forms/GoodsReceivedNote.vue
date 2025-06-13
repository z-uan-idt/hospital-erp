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
            autocomplete="off"
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
            autocomplete="off"
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
            label="Lý do nhập"
            :items="groupServices"
            item-title="name"
            item-value="name"
            :rules="[formRules.required]"
            placeholder="Chọn lý do nhập"
            hide-details
            class="custom-input-message"
            autocomplete="off"
          >
            <template #label>
              <div class="d-flex align-center justify-start w-100">
                <span>
                  Lý do nhập
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
              autocomplete="off"
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
      title="Thông tin lô hàng nhập"
      class="mt-10 pb-10"
      :class="{
        'form-readonly': receipt?.is_transfer,
      }"
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
                      class="text-erp-gray-900 me-2"
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
                    min-height="394"
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
                      autocomplete="off"
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
                <v-text-field
                  v-model="batch.code"
                  label="Mã lô hàng"
                  placeholder="Nhập mã lô hàng"
                  :rules="[formRules.required]"
                  autocomplete="off"
                >
                  <template #label>
                    <div class="d-flex align-center justify-start w-100">
                      <span>
                        Mã lô hàng
                        <span class="text-red-darken-3"> * </span>
                      </span>
                    </div>
                  </template>
                </v-text-field>
              </v-col>

              <v-col
                cols="12"
                md="12"
                lg="6"
                class="pb-0"
              >
                <v-number-input
                  v-model="batch.quantity"
                  label="Số lượng nhập"
                  placeholder="Nhập số lượng nhập"
                  :rules="[formRules.required]"
                  autocomplete="off"
                >
                  <template #label>
                    <div class="d-flex align-center justify-start w-100">
                      <span>
                        Số lượng nhập
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
                  label="Đơn giá nhập"
                  placeholder="Nhập đơn giá nhập"
                  :rules="[formRules.required]"
                  control-variant="hidden"
                  autocomplete="off"
                >
                  <template #label>
                    <div class="d-flex align-center justify-start w-100">
                      <span>
                        Đơn giá nhập
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

              <v-col
                cols="12"
                md="12"
                lg="6"
                class="pb-0"
              >
                <v-date-input
                  v-model="batch.MFG_date"
                  label="Ngày sản xuất"
                  placeholder="Chọn ngày sản xuất"
                  :rules="[formRules.required]"
                  autocomplete="off"
                  input-format="DD/MM/YYYY"
                >
                  <template #label>
                    <div class="d-flex align-center justify-start w-100">
                      <span>
                        Ngày sản xuất
                        <span class="text-red-darken-3"> * </span>
                      </span>
                    </div>
                  </template>
                </v-date-input>
              </v-col>

              <v-col
                cols="12"
                md="12"
                lg="6"
                class="pb-0"
              >
                <v-date-input
                  v-model="batch.expired_date"
                  label="Hạn sử dụng"
                  placeholder="Chọn hạn sử dụng"
                  :rules="[formRules.required]"
                  autocomplete="off"
                  input-format="DD/MM/YYYY"
                >
                  <template #label>
                    <div class="d-flex align-center justify-start w-100">
                      <span>
                        Hạn sử dụng
                        <span class="text-red-darken-3"> * </span>
                      </span>
                    </div>
                  </template>
                </v-date-input>
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
  import type { IReceipt, IReceiptFormPayload } from '~/types/receipt.types'

  const props = defineProps<{
    receipt?: IReceipt
  }>()

  const formRules = useFormRules()
  const groupServiceHook = useGroupService()

  const groupServices = ref<IGroupService[]>([])
  const groupServiceNhomThuoc = ref<IGroupService[]>([])
  const nhomThuoc = ref<{ [key: number]: IMedicalProductType } | null>(null)

  onMounted(async () => {
    const result = await groupServiceHook.onFetchGroupServiceAutocomplete(1, 'LY_DO_NHAP_HANG', -1)
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

  onMounted(() => {
    if (formPayload.value.batches.length === 0) {
      addBatch()
    }
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
  }

  const formPayload = ref<IReceiptFormPayload>({
    code: props.receipt?.code,
    warehouse: warehouseSelected?.value as number,
    reason: props.receipt?.reason,
    is_other_reason: props.receipt?.is_other_reason,
    batches: (props.receipt?.batches || []).map((batch) => ({
      id: batch?.id || undefined,
      medical_product: batch.medical_product?.id,
      medical_product_info: batch?.medical_product,
      quantity: batch.quantity,
      MFG_date: batch.MFG_date,
      expired_date: batch.expired_date,
      unit: batch.unit?.id,
      price: batch.price,
      code: batch.code,
    })),
  })

  defineExpose({
    formPayload,
  })

  const addBatch = () => {
    formPayload.value.batches.push({
      medical_product: null,
      medical_product_info: null,
      quantity: null,
      MFG_date: null,
      expired_date: null,
      unit: null,
      price: null,
      code: null,
    })
  }

  const removeBatch = (index: number) => {
    formPayload.value.batches.splice(index, 1)

    if (formPayload.value.batches.length === 0) {
      addBatch()
    }
  }

  const selectDrug = (medical_product: IMedicalProduct, index: number) => {
    formPayload.value.batches[index].unit = medical_product.DonViNhap?.id
    formPayload.value.batches[index].medical_product_info = medical_product
    formPayload.value.batches[index].medical_product = medical_product.id
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
        batches: (newVal?.batches || []).map((batch) => ({
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
          MFG_date: batch.MFG_date,
          expired_date: batch.expired_date,
          unit: batch.unit?.id,
          price: batch.price,
          code: batch.code,
        })),
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
</script>
