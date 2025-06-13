<template>
  <v-container
    class="erp-danh-sach-khoa pa-md-6 pa-3"
    fluid
  >
    <v-form @submit.prevent="checkWarningBatchs">
      <div class="d-flex align-center flex-row justify-space-between ga-4 mb-6">
        <div class="d-flex align-center justify-start ga-3 w-100 w-md-auto">
          <v-btn
            icon="mdi-chevron-left"
            variant="outlined"
            color="erp-gray-700"
            class="text-body-1 font-weight-medium"
            size="x-small"
            @click="router.back()"
          />
          <h1 :class="['text-lg-h5 text-h6 font-weight-medium', 'text-blue-grey-darken-3']">Tạo mới phiếu nhập kho</h1>
        </div>
        <div class="action-buttons d-flex align-center ga-2">
          <v-btn
            rounded="pill"
            variant="outlined"
            elevation="0"
            type="submit"
            height="38"
            @click="status = 'DRAFT'"
          >
            <template #prepend>
              <v-icon
                class="me-n1"
                size="18"
              >
                mdi-pencil-outline
              </v-icon>
            </template>
            <span class="text-body-1"> Lưu nháp </span>
          </v-btn>
          <v-btn
            color="erp-brand"
            rounded="pill"
            elevation="0"
            type="submit"
            height="38"
            @click="status = 'PENDING'"
          >
            <template #prepend>
              <v-icon
                class="me-n1"
                size="22"
              >
                mdi-check
              </v-icon>
            </template>
            <span class="text-body-1"> Xác nhận </span>
          </v-btn>
        </div>
      </div>

      <FormGoodsReceivedNote
        ref="formGoodsReceivedNoteRef"
        :receipt="hooks.receipt.value"
      />
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
              Vượt định mức tối đa
            </p>
          </div>
          <p class="text-body-1 font-weight-regular text-wrap text-center text-body-2 mb-4">
            Nếu tiếp tục tạo phiếu nhập, số lượng tồn kho của sản phẩm
            <span class="font-weight-medium text-body-1">
              {{ showConfirmProducts.join(', ') }}
            </span>
            sẽ bị vượt định mức tối đa bạn đã cài đặt trước đó.
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
            @click="onFormSubmit(true)"
          >
            <template #prepend>
              <v-icon
                class="ms-1"
                size="16"
              >
                mdi-plus
              </v-icon>
            </template>
            <span style="margin-bottom: -1px"> Tiếp tục tạo </span>
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
  import type { SubmitEventPromise } from 'vuetify'
  import { Colors } from '~/constants/color.constants'
  import { ROUTE_PHIEU_NHAP_KHO } from '~/constants/route.constants'

  definePageMeta({
    layout: 'default',
    middleware: ['auth'],
  })

  useHead({
    title: 'Tạo mới phiếu nhập kho',
  })

  const route = useRoute()
  const router = useRouter()
  const isLoading = ref(false)
  const { $toast } = useNuxtApp()
  const showConfirmProducts = ref([])
  const formGoodsReceivedNoteRef = ref(null)
  const { onCreateGoodsReceivedNote, ...hooks } = useReceipt()

  const status = ref<'DRAFT' | 'PENDING' | null>(null)

  const receiptId = route.query?.['id'] as string

  onMounted(async () => {
    if (receiptId) {
      isLoading.value = true
      await hooks.onFetchGoodsReceivedNoteById(receiptId)
      if (!hooks.receipt.value) {
        router.replace(ROUTE_PHIEU_NHAP_KHO.CREATE.path)
      } else if (hooks.receipt.value?.status?.value !== 'DRAFT') {
        router.replace(ROUTE_PHIEU_NHAP_KHO.DETAIL.pathFunc(receiptId))
      }
      isLoading.value = false
    }
  })

  const checkWarningBatchs = async (formEvent: SubmitEventPromise) => {
    const result = await formEvent

    if (result.valid) {
      const payload = formGoodsReceivedNoteRef?.value?.formPayload
      payload.status = status.value

      const warning_batchs = payload.batches.filter((batch) => {
        if (batch.medical_product_info?.is_unlimited) return false
        if (batch.medical_product_info?.max_quantity === null) return false
        const next_quantity = (batch?.available_quantity || 0) + (batch?.quantity || 0)
        if (next_quantity > batch.medical_product_info?.max_quantity) {
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

  const onFormSubmit = async (valid: boolean) => {
    if (valid) {
      const payload = formGoodsReceivedNoteRef?.value?.formPayload
      payload.status = status.value

      if (receiptId) {
        try {
          isLoading.value = true
          await hooks.onUpdateGoodsReceivedNote(
            receiptId,
            payload,
            (result) => {
              if (status.value !== 'DRAFT') {
                $toast.success('Cập nhật phiếu nhập kho thành công', {
                  description: 'Phiếu nhập kho đã được cập nhật thành công',
                })
                router.replace(ROUTE_PHIEU_NHAP_KHO.DETAIL.pathFunc(result.id))
              } else {
                $toast.success('Đã cập nhật bản nháp', {
                  description: 'Đã cập nhật bản nháp phiếu nhập kho thành công',
                })
              }
            },
            (error) => {
              if (status.value !== 'DRAFT') {
                $toast.error('Cập nhật phiếu nhập kho thất bại', {
                  description: error,
                })
              } else {
                $toast.error('Cập nhật bản nháp thất bại', {
                  description: error,
                })
              }
            }
          )
        } catch (error) {
          $toast.error(status.value !== 'DRAFT' ? 'Cập nhật phiếu nhập kho thất bại' : 'Cập nhật bản nháp thất bại', {
            description: 'Hệ thống gặp sự cố, vui lòng thử lại sau',
          })
        } finally {
          isLoading.value = false
        }
      } else {
        try {
          isLoading.value = true
          await onCreateGoodsReceivedNote(
            payload,
            (result) => {
              if (status.value !== 'DRAFT') {
                $toast.success('Tạo phiếu nhập kho thành công', {
                  description: 'Phiếu nhập kho đã được tạo thành công',
                })
                router.replace(ROUTE_PHIEU_NHAP_KHO.DETAIL.pathFunc(result.id))
              } else {
                router.replace(ROUTE_PHIEU_NHAP_KHO.CREATE.path + '?id=' + result.id)
                $toast.success('Đã lưu nháp', {
                  description: 'Đã lưu nháp phiếu nhập kho thành công',
                })
              }
            },
            (error) => {
              if (status.value !== 'DRAFT') {
                $toast.error('Tạo phiếu nhập kho thất bại', {
                  description: error,
                })
              } else {
                $toast.error('Lưu nháp thất bại', {
                  description: error,
                })
              }
            }
          )
        } catch (error) {
          $toast.error(status.value !== 'DRAFT' ? 'Tạo phiếu nhập kho thất bại' : 'Lưu nháp thất bại', {
            description: 'Hệ thống gặp sự cố, vui lòng thử lại sau',
          })
        } finally {
          isLoading.value = false
          showConfirmProducts.value = []
        }
      }
    }
  }
</script>
