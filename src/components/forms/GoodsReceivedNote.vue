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
            label="Lý do nhập"
            :items="groupServices"
            item-title="name"
            item-value="name"
            :rules="[formRules.required]"
            placeholder="Chọn lý do nhập"
            hide-details
            class="custom-input-message"
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
                  :model-value="nhomThuoc?.[index]"
                  label="Danh mục thuốc"
                  placeholder="Chọn danh mục thuốc"
                  :items="groupServiceNhomThuoc"
                  item-title="name"
                  item-value="id"
                  variant="outlined"
                  clearable
                  @update:model-value="onChangeNhomThuoc($event, index)"
                >
                  <template #prepend-inner>
                    <v-icon
                      size="20"
                      class="mx-2"
                    >
                      custom-capsules
                    </v-icon>
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
                        v-if="!batch.drug"
                        class="left-sheet"
                      >
                        <label class="text-caption"> Bắt buộc </label>
                        <p class="text-subtitle-1">Vui lòng chọn thuốc</p>
                      </div>
                      <template v-else>
                        <v-avatar
                          rounded="lg"
                          color="erp-brand"
                          size="42"
                          :image="batch.drug_info?.image"
                          :text="batch.drug_info?.TenThuoc.charAt(0).toUpperCase()"
                        />
                        <div class="left-sheet text-truncate w-100 overflow-hidden">
                          <label class="text-caption"> Mã thuốc: {{ batch.drug_info?.MaThuoc || 'N/A' }} </label>
                          <p
                            class="text-truncate"
                            style="max-width: 100%"
                          >
                            {{ batch.drug_info?.TenThuoc || 'N/A' }}
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
                        <span class="text-body-1">Chọn thuốc</span>
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
                    />

                    <v-infinite-scroll
                      v-if="menuActive === index"
                      height="300"
                      :items="drugItems"
                      class="pb-2"
                      :empty-text="drugItems.length === 0 ? 'Không có dữ liệu' : 'Không còn kết quả nào'"
                      @load="onLoadMore"
                    >
                      <div
                        v-for="(drug, cIndex) in drugItems"
                        :key="drug.id"
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
                            :image="drug?.image"
                            :text="drug?.TenThuoc.charAt(0).toUpperCase()"
                          />
                          <div class="left-sheet text-truncate w-100 overflow-hidden">
                            <label class="text-caption"> Mã thuốc: {{ drug?.MaThuoc || 'N/A' }} </label>
                            <p
                              class="text-truncate"
                              style="max-width: 100%"
                            >
                              {{ drug?.TenThuoc || 'N/A' }}
                            </p>
                          </div>

                          <v-btn
                            elevation="2"
                            rounded="pill"
                            class="flex-grow-1 flex-md-grow-0"
                            :disabled="batch.drug === drug.id"
                            :variant="batch.drug === drug.id ? 'outlined' : 'elevated'"
                            @click.stop="selectDrug(drug, index)"
                          >
                            <span class="text-body-1">{{ batch.drug === drug.id ? 'Đang chọn' : 'Chọn' }}</span>
                          </v-btn>
                        </v-sheet>
                      </div>
                    </v-infinite-scroll>
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
                    v-if="batch.drug_info?.DonViNhap"
                    #append-inner
                  >
                    <div class="text-body-2 text-erp-gray-800 d-flex align-center justify-start mb-n1">
                      <span>/</span>
                      <span>{{ batch.drug_info?.DonViNhap?.name }}</span>
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
  import type { IDrug } from '~/types/drug.types'
  import type { IReceipt, IReceiptFormPayload } from '~/types/receipt.types'

  const props = defineProps<{
    receipt?: IReceipt
  }>()

  const formRules = useFormRules()
  const groupServiceHook = useGroupService()

  const groupServices = ref<IGroupService[]>([])
  const groupServiceNhomThuoc = ref<IGroupService[]>([])
  const nhomThuoc = ref<{ [key: number]: number } | null>(null)

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
    const result = await groupServiceHook.onFetchGroupServiceAutocomplete(1, 'NHOM_THUOC', -1)
    groupServiceNhomThuoc.value = result.items
  })

  onMounted(() => {
    if (formPayload.value.batches.length === 0) {
      addBatch()
    }
  })

  const reason = ref('')
  const sheetRef = ref(null)
  const { organizationSelected, warehouseSelected } = useAuth()
  const menuActive = ref<number | null>(null)

  const drugItems = ref<IDrug[]>([])
  const { drugs, ...hooks } = useDrug()

  const onChangeNhomThuoc = async (key: number, index: number) => {
    if (!nhomThuoc.value) {
      nhomThuoc.value = {}
    }
    nhomThuoc.value[index] = key
  }

  const onOpenSelectDrug = async (index: number) => {
    const gid = nhomThuoc.value?.[index]
    menuActive.value = index
    isEmpty.value = false
    drugItems.value = []
    hooks.setGid(gid)
    hooks.setPage(1)
  }

  const formPayload = ref<IReceiptFormPayload>({
    code: props.receipt?.code,
    warehouse: warehouseSelected?.value as number,
    reason: props.receipt?.reason,
    is_other_reason: props.receipt?.is_other_reason,
    batches: (props.receipt?.batches || []).map((batch) => ({
      id: batch?.id || undefined,
      drug: batch.drug?.id,
      drug_info: batch?.drug,
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
      drug: null,
      drug_info: null,
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

  const selectDrug = (drug: IDrug, index: number) => {
    formPayload.value.batches[index].unit = drug.DonViNhap?.id
    formPayload.value.batches[index].drug_info = drug
    formPayload.value.batches[index].drug = drug.id
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
          drug: batch.drug?.id,
          drug_info: batch?.drug,
          quantity: batch.quantity,
          MFG_date: batch.MFG_date,
          expired_date: batch.expired_date,
          unit: batch.unit?.id,
          price: batch.price,
          code: batch.code,
        })),
      }
      reason.value = newVal?.is_other_reason ? 'Khác' : newVal?.reason
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
    return drugItems.value.length >= hooks.count.value
  })

  const isEmpty = ref(false)

  const onLoadMore = async ({ done }) => {
    if (isEmpty.value) {
      hooks.setLimit(10)
      hooks.setPage(1)
      done('empty')
    } else if (isLastPage.value && drugItems.value.length > 0) {
      done('empty')
    } else {
      hooks.setLimit(10)
      await hooks.onFetchDrug(organizationSelected.value.id)
      isEmpty.value = drugs.value.length === 0
      drugItems.value.push(...drugs.value)
      hooks.setPage(hooks.page.value + 1)
      done('ok')
    }
  }
</script>
