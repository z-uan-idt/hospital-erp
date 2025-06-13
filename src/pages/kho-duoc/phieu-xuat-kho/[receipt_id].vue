<template>
  <v-container
    class="erp-danh-sach-khoa pa-md-6 pa-3"
    fluid
  >
    <v-form
      :readonly="!isUpdate"
      @submit.prevent="checkWarningBatchs"
    >
      <div class="d-flex align-center flex-row justify-space-between ga-4 mb-6">
        <div class="d-flex align-center justify-start ga-3 w-100 w-md-auto">
          <v-btn
            icon="mdi-chevron-left"
            variant="outlined"
            color="erp-gray-700"
            class="text-body-1 font-weight-medium"
            size="x-small"
            @click="isUpdate ? (isUpdate = false) : router.back()"
          />
          <h1 :class="['text-lg-h5 text-h6 font-weight-medium', 'text-blue-grey-darken-3']">
            {{ isUpdate ? 'Chỉnh sửa phiếu xuất kho' : 'Chi tiết phiếu xuất kho' }}
          </h1>
          <v-chip
            v-if="receiptExport?.status"
            :variant="receiptExport?.status?.value === 'DRAFT' ? 'outlined' : 'tonal'"
            :color="getStatusColor(receiptExport?.status?.value)"
          >
            {{ receiptExport?.status.label }}
          </v-chip>
          <template v-if="!isUpdate">
            <template v-if="receiptExport?.status?.value === 'APPROVED'">
              <v-btn
                icon
                variant="outlined"
                color="erp-gray"
                size="x-small"
                @click="onHandleAction('CANCELLED')"
              >
                <v-icon
                  size="22"
                  color="erp-error"
                >
                  mdi-close
                </v-icon>
              </v-btn>
            </template>
            <template v-if="['REJECTED', 'CANCELLED'].includes(receiptExport?.status?.value)">
              <v-btn
                icon
                variant="outlined"
                color="erp-gray"
                size="x-small"
                @click="onHandleAction('PENDING')"
              >
                <v-icon
                  size="20"
                  class="text-erp-gray-800"
                >
                  mdi-orbit-variant
                </v-icon>
              </v-btn>
            </template>
            <template v-if="receiptExport?.status?.value === 'PENDING'">
              <v-btn
                icon
                variant="outlined"
                color="erp-gray"
                size="x-small"
                @click="onHandleAction('REJECTED')"
              >
                <v-icon
                  size="22"
                  color="erp-error"
                >
                  mdi-close
                </v-icon>
              </v-btn>

              <v-btn
                icon
                variant="outlined"
                color="erp-gray"
                size="x-small"
                @click="checkWarningBatchAction('APPROVED')"
              >
                <v-icon
                  size="22"
                  color="erp-brand"
                >
                  mdi-check
                </v-icon>
              </v-btn>
            </template>
          </template>
        </div>
        <div class="action-buttons d-flex align-center ga-2">
          <v-btn
            v-if="isUpdate"
            color="erp-brand"
            rounded="pill"
            elevation="0"
            type="submit"
            height="38"
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
          <template v-else>
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
              v-if="receiptExport?.status?.value !== 'APPROVED'"
              icon
              variant="outlined"
              color="erp-gray"
              size="x-small"
              @click="isUpdate = !isUpdate"
            >
              <v-icon
                size="18"
                class="me-n1 text-erp-gray-800"
              >
                custom-edit-box
              </v-icon>
            </v-btn>
          </template>
        </div>
      </div>

      <template v-if="isUpdate">
        <FormGoodsDeliveryNote
          ref="formGoodsDeliveryNoteRef"
          :class="{
            'form-readonly': !isUpdate,
          }"
          :receipt="receiptExport"
        />
      </template>
      <template v-else>
        <CommonFieldset
          title="Thông tin phiếu"
          class="form-readonly"
        >
          <v-row>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                :model-value="receiptExport?.code"
                label="Mã phiếu"
                hide-details
                readonly
              />
            </v-col>

            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                label="Nhà cung cấp"
                hide-details
                readonly
              />
            </v-col>

            <v-col
              cols="12"
              :md="receiptExport?.reject_reason ? 4 : 6"
            >
              <v-text-field
                :model-value="receiptExport?.batch_price ? `${formatNumberDot(receiptExport?.batch_price)} đ` : 'N/A'"
                label="Giá trị xuất"
                hide-details
                readonly
              />
            </v-col>

            <v-col
              cols="12"
              :md="receiptExport?.reject_reason ? 4 : 6"
            >
              <v-text-field
                :model-value="receiptExport?.reason"
                label="Lý do xuất"
                hide-details
                readonly
              />
            </v-col>

            <v-col
              v-if="receiptExport?.reject_reason"
              cols="12"
              :md="receiptExport?.reject_reason ? 4 : 6"
            >
              <v-text-field
                :model-value="receiptExport?.reject_reason"
                label="Lý do hủy"
                hide-details
                readonly
                style="--v-activated-opacity: 1"
              >
                <template #label>
                  <span class="text-erp-error"> Lý do hủy </span>
                </template>
              </v-text-field>
            </v-col>

            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                :model-value="receiptExport?.created_at ? formatDateTime(receiptExport?.created_at) : ''"
                label="Tạo lúc"
                readonly
              >
                <template #details>
                  <p class="text-caption text-black w-100">
                    Bởi
                    <strong class="font-weight-medium">
                      {{ receiptExport?.created_by?.full_name || 'Chưa có thông tin' }}
                    </strong>
                  </p>
                </template>
              </v-text-field>
            </v-col>

            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                :model-value="receiptExport?.updated_at ? formatDateTime(receiptExport?.updated_at) : ''"
                label="Cập nhật lúc"
                readonly
              >
                <template #details>
                  <p class="text-caption text-black w-100">
                    Bởi
                    <strong class="font-weight-medium">
                      {{ receiptExport?.updated_by?.full_name || 'Chưa có thông tin' }}
                    </strong>
                  </p>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
        </CommonFieldset>

        <CommonFieldset
          title="Thông tin lô hàng xuất"
          class="mt-10"
        >
          <v-data-table
            :headers="batchHeaders"
            :items="receiptExport?.batches || []"
            hide-default-footer
            fixed-header
            style="height: calc(100dvh - 607px)"
          >
            <template #item.goods_received_note_batch.code="{ item }">
              <p class="text-black">#{{ item.goods_received_note_batch?.code }}</p>
            </template>
            <template #item.goods_received_note_batch.MFG_date="{ item }">
              <p class="text-black">
                {{
                  item.goods_received_note_batch?.MFG_date
                    ? formatDate(item.goods_received_note_batch?.MFG_date)
                    : 'N/A'
                }}
              </p>
            </template>
            <template #item.goods_received_note_batch.expired_date="{ item }">
              <p class="text-black">
                {{
                  item.goods_received_note_batch?.expired_date
                    ? formatDate(item.goods_received_note_batch?.expired_date)
                    : 'N/A'
                }}
              </p>
            </template>
            <template #item.medical_product="{ item }">
              <p class="text-subtitle-2 font-weight-medium">
                {{ item.medical_product.TenHangHoa }}
              </p>
              <p class="text-caption text-black">#{{ item.medical_product.MaHangHoa || 'N/A' }}</p>
            </template>
            <template #item.price="{ item }">
              <p class="text-black">{{ item.price ? formatNumberDot(item.price) : 'N/A' }} đ</p>
            </template>
            <template #item.quantity="{ item }">
              <p class="text-black">
                {{ item.quantity ? formatNumberDot(item.quantity) : 'N/A' }}
              </p>
            </template>
            <template #item.total_price="{ item, value }">
              <p class="text-black">{{ formatNumberDot(value) }} đ</p>
            </template>
          </v-data-table>
        </CommonFieldset>
      </template>
    </v-form>

    <v-overlay
      :model-value="isLoading && showConfirmProducts.length === 0"
      class="d-flex justify-center align-center"
      persistent
    >
      <v-progress-circular
        indeterminate
        size="80"
      />
    </v-overlay>

    <v-dialog
      v-if="handleAction !== null"
      :model-value="handleAction !== null"
      max-width="600"
      persistent
    >
      <v-form @submit.prevent="onSubmitAction">
        <v-card class="pb-2 pe-2 pt-2">
          <template #prepend>
            <v-icon size="24"> mdi-information-outline </v-icon>
          </template>
          <template v-slot:title>
            <div class="d-flex align-center justify-space-between text-body-1">
              {{ actions[handleAction].label }}
            </div>
          </template>

          <div class="ps-6 pe-6">
            <p class="text-caption text-erp-gray-700 mb-4">
              {{ actions[handleAction].message }}
            </p>

            <v-row
              v-if="actions[handleAction]?.is_reason"
              class="mb-2"
            >
              <v-col
                cols="12"
                sm="12"
                md="12"
                class="pb-0"
              >
                <v-textarea
                  v-model="rejectReason"
                  label="Lý do"
                  :rules="[formRules.required]"
                  :placeholder="actions[handleAction]?.['placeholder'] || 'Nhập lý do'"
                >
                  <template #label>
                    <div class="d-flex align-center justify-start w-100">
                      <span>
                        Lý do
                        <span class="text-red-darken-3"> * </span>
                      </span>
                    </div>
                  </template>
                </v-textarea>
              </v-col>
            </v-row>
          </div>

          <div class="d-flex justify-end pe-6 ps-6 pb-4 ga-3">
            <v-btn
              color="erp-gray-600"
              elevation="0"
              variant="outlined"
              rounded="pill"
              size="large"
              class="flex-grow-1 flex-md-grow-0"
              @click="handleAction = null"
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
              type="submit"
              :color="actions[handleAction].color"
              elevation="0"
              rounded="pill"
              size="large"
              :variant="actions[handleAction]?.['is_outlined'] ? 'outlined' : 'elevated'"
              class="flex-grow-1 flex-md-grow-0"
            >
              <template #prepend>
                <Icon
                  :name="actions[handleAction].icon"
                  size="22"
                  class="me-n2"
                  :class="actions[handleAction]?.['icon_class']"
                />
              </template>
              <span
                class="text-body-1"
                :class="actions[handleAction]?.['icon_class']"
              >
                {{ actions[handleAction].button_label }}
              </span>
            </v-btn>
          </div>
        </v-card>
      </v-form>
    </v-dialog>

    <v-dialog
      :model-value="showConfirmProducts.length > 0"
      transition="fade-transition"
      persistent
      max-width="380"
    >
      <v-card class="px-4 pt-2 pb-2">
        <div class="ps-4 pe-4 pb-4">
          <div class="d-flex align-center flex-column justify-center pt-6 pb-4">
            <div
              class="ripple-multiple d-flex align-center justify-center"
              :style="{
                '--v-ripple-color': Colors['erp-warning'][400],
                width: '50px',
                height: '50px',
              }"
            >
              <v-btn
                icon
                variant="tonal"
                density="default"
                color="erp-warning"
              >
                <v-icon
                  size="32"
                  color="erp-warning"
                >
                  mdi-warning-outline
                </v-icon>
              </v-btn>
            </div>
            <p
              class="font-weight-regular text-wrap mt-2 font-weight-medium"
              :class="[$vuetify.display.mdAndUp ? 'text-body-1' : 'text-body-2']"
            >
              Chưa đạt định mức tối tiểu
            </p>
          </div>
          <p class="text-body-1 font-weight-regular text-wrap text-center text-body-2 mb-4">
            Nếu tiếp tục tạo phiếu nhập, số lượng tồn kho của sản phẩm
            <span class="font-weight-medium text-body-1">
              {{ showConfirmProducts.join(', ') }}
            </span>
            sẽ bị thấp hơn định mức tối thiểu bạn đã cài đặt trước đó.
          </p>
        </div>
        <div class="d-flex ga-2 ps-4 pe-4 pb-4 align-center justify-space-between">
          <v-btn
            rounded="pill"
            variant="outlined"
            color="erp-gray-700"
            class="flex-grow-1"
            @click="showConfirmProducts = []"
          >
            <template #prepend>
              <v-icon
                size="18"
                class="me-n1"
              >
                mdi-close
              </v-icon>
            </template>
            <span style="margin-bottom: -1px"> Hủy bỏ </span>
          </v-btn>

          <v-btn
            elevation="0"
            rounded="pill"
            color="erp-brand"
            class="flex-grow-1"
            :loading="isLoading"
            @click="!isConfirmWarning ? onFormSubmit(true) : onHandleAction('APPROVED')"
          >
            <template #prepend>
              <v-icon
                class="ms-1"
                size="16"
              >
                mdi-plus
              </v-icon>
            </template>
            <span style="margin-bottom: -1px">
              {{ !isConfirmWarning ? 'Tiếp tục cập nhật' : 'Tiếp tục duyệt' }}
            </span>
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
  import { Colors } from '~/constants/color.constants'
  import type { DataTableHeader, SubmitEventPromise } from 'vuetify'
  import { ROUTE_PHIEU_XUAT_KHO } from '~/constants/route.constants'

  definePageMeta({
    layout: 'default',
    middleware: ['auth'],
  })

  useHead({
    title: 'Chi tiết phiếu xuất kho',
  })

  const route = useRoute()
  const router = useRouter()

  const isLoading = ref(false)
  const isUpdate = ref(false)
  const handleAction = ref<'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | null>(null)
  const receiptId = route.params?.['receipt_id'] as string
  const { $toast } = useNuxtApp()
  const formGoodsDeliveryNoteRef = ref(null)
  const { receiptExport, ...hooks } = useReceipt()
  const { warehouseSelected } = useAuth()
  const formRules = useFormRules()

  watch(warehouseSelected, () => {
    if (!warehouseSelected.value && receiptExport.value) {
      router.replace(ROUTE_PHIEU_XUAT_KHO.path)
    }
  })

  onMounted(async () => {
    isLoading.value = true
    await hooks.onFetchGoodsDeliveryNoteById(receiptId)
    isLoading.value = false
  })

  const actions = {
    APPROVED: {
      label: 'Bạn có chắc muốn duyệt phiếu xuất kho này?',
      message: 'Sau khi duyệt, các lô hàng trong phiếu sẽ được cập nhật vào kho của bạn và cộng tồn treo.',
      icon: 'mdi-check',
      color: 'erp-brand',
      button_label: 'Duyệt',
      is_reason: false,
    },
    REJECTED: {
      label: 'Bạn có chắc muốn từ chối phiếu xuất kho này?',
      message: 'Sau khi từ chối, phiếu xuất kho sẽ được chuyển sang trạng thái ‘Không duyệt’.',
      icon: 'mdi-close',
      color: 'erp-error',
      button_label: 'Từ chối',
      placeholder: 'Nhập lý do từ chối',
      is_reason: true,
    },
    CANCELLED: {
      label: 'Bạn có chắc muốn hủy phiếu xuất kho này?',
      message: 'Sau khi từ chối, phiếu xuất kho sẽ được chuyển sang trạng thái ‘Đã hủy’.',
      icon: 'mdi-close',
      color: 'erp-error',
      button_label: 'Hủy phiếu',
      placeholder: 'Nhập lý do hủy phiếu',
      is_reason: true,
    },
    PENDING: {
      label: 'Bạn có chắc muốn gửi duyệt lại phiếu xuất kho này?',
      message: 'Sau khi gửi duyệt lại, phiếu này sẽ được chuyển về trạng thái ‘Gửi duyệt’.',
      icon: 'mdi-orbit-variant',
      is_outlined: true,
      color: 'erp-gray-600',
      icon_class: 'text-erp-gray-800',
      button_label: 'Gửi duyệt lại',
      is_reason: false,
    },
  }

  const rejectReason = ref('')

  const showConfirmProducts = ref([])

  const onHandleAction = (status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED') => {
    rejectReason.value = ''
    handleAction.value = status
    isConfirmWarning.value = false
    showConfirmProducts.value = []
  }

  const isConfirmWarning = ref(false)

  const checkWarningBatchAction = async (status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED') => {
    const warning_batchs = receiptExport.value?.batches.filter((batch) => {
      if (batch?.min_quantity === null) return false
      const next_quantity = (batch?.available_quantity || 0) + (batch?.quantity || 0)
      if (next_quantity < batch?.min_quantity) {
        return true
      }
    })
    if (warning_batchs.length > 0) {
      showConfirmProducts.value = warning_batchs.map((batch) => batch?.medical_product?.TenHangHoa)
      isConfirmWarning.value = true
    } else {
      onHandleAction(status)
    }
  }

  const checkWarningBatchs = async (formEvent: SubmitEventPromise) => {
    const result = await formEvent

    if (result.valid) {
      const payload = formGoodsDeliveryNoteRef?.value?.formPayload
      const warning_batchs = payload.batches.filter((batch) => {
        if (batch.medical_product_info?.min_quantity === null) return false
        const next_quantity = (batch?.medical_product_info?.available_quantity || 0) + (batch?.quantity || 0)
        if (next_quantity < batch.medical_product_info?.min_quantity) {
          return true
        }
      })
      if (warning_batchs.length > 0) {
        showConfirmProducts.value = warning_batchs.map((batch) => batch.medical_product_info?.TenHangHoa)
      } else {
        await onFormSubmit(true)
      }
    }
  }

  const onUpdateGoodsDeliveryNoteStatus = async (status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED') => {
    try {
      handleAction.value = null
      isLoading.value = true
      await hooks.onUpdateGoodsDeliveryNoteStatus(
        receiptId,
        { status, reject_reason: rejectReason.value },
        (result) => {
          $toast.success('Cập nhật trạng thái phiếu xuất kho thành công', {
            description: 'Phiếu xuất kho đã được cập nhật thành công',
          })
          receiptExport.value.status = result.status
          receiptExport.value.reason = result.reason
          receiptExport.value.reject_reason = result.reject_reason
          receiptExport.value.updated_at = result.updated_at
          receiptExport.value.updated_by = result.updated_by
          receiptExport.value.created_at = result.created_at
          receiptExport.value.created_by = result.created_by
        },
        (error) => {
          $toast.error('Cập nhật trạng thái phiếu xuất kho thất bại', {
            description: error,
          })
        }
      )
    } catch (error) {
      $toast.error('Cập nhật trạng thái phiếu xuất kho thất bại', {
        description: 'Hệ thống gặp sự cố, vui lòng thử lại sau',
      })
    } finally {
      handleAction.value = null
      rejectReason.value = ''
      isLoading.value = false
    }
  }

  const onSubmitAction = async (formEvent: SubmitEventPromise) => {
    const result = await formEvent

    if (result.valid) {
      onUpdateGoodsDeliveryNoteStatus(handleAction.value)
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

  const batchHeaders = ref<DataTableHeader[]>([
    {
      title: 'Mã lô',
      key: 'goods_received_note_batch.code',
    },
    {
      title: 'NSX',
      key: 'goods_received_note_batch.MFG_date',
    },
    {
      title: 'HSD',
      key: 'goods_received_note_batch.expired_date',
    },
    {
      title: 'Thuốc',
      key: 'medical_product',
    },
    {
      title: 'Đơn giá xuất',
      key: 'price',
    },
    {
      title: 'Số lượng xuất',
      key: 'quantity',
    },
    {
      title: 'Thành tiền',
      key: 'total_price',
      value: (item) => item.quantity * item.price,
    },
  ])

  const onFormSubmit = async (valid: boolean) => {
    if (valid) {
      const payload = formGoodsDeliveryNoteRef?.value?.formPayload

      try {
        isLoading.value = true
        await hooks.onUpdateGoodsDeliveryNote(
          receiptId,
          payload,
          (result) => {
            $toast.success('Cập nhật phiếu xuất kho thành công', {
              description: 'Phiếu xuất kho đã được cập nhật thành công',
            })
            isUpdate.value = false
            hooks.setReceiptExport(result)
          },
          (error) => {
            $toast.error('Cập nhật phiếu xuất kho thất bại', {
              description: error,
            })
          }
        )
      } catch (error) {
        $toast.error('Cập nhật phiếu xuất kho thất bại', {
          description: 'Hệ thống gặp sự cố, vui lòng thử lại sau',
        })
      } finally {
        isLoading.value = false
        showConfirmProducts.value = []
      }
    }
  }
</script>
