<template>
  <v-container
    class="erp-danh-sach-khoa pa-md-6 pa-3"
    fluid
  >
    <v-form @submit.prevent="onFormSubmit">
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
          <h1 :class="['text-lg-h5 text-h6 font-weight-medium', 'text-blue-grey-darken-3']">Tạo mới phiếu xuất kho</h1>
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

      <FormGoodsDeliveryNote
        ref="formGoodsDeliveryNoteRef"
        :receipt="hooks.receiptExport.value"
      />
    </v-form>

    <v-overlay
      :model-value="isLoading"
      class="d-flex justify-center align-center"
      persistent
    >
      <v-progress-circular
        indeterminate
        size="80"
      />
    </v-overlay>
  </v-container>
</template>

<script setup lang="ts">
  import type { SubmitEventPromise } from 'vuetify'
  import { ROUTE_PHIEU_XUAT_KHO } from '~/constants/route.constants'

  definePageMeta({
    layout: 'default',
    middleware: ['auth'],
  })

  useHead({
    title: 'Tạo mới phiếu xuất kho',
  })

  const route = useRoute()
  const router = useRouter()
  const isLoading = ref(false)
  const { $toast } = useNuxtApp()
  const formGoodsDeliveryNoteRef = ref(null)
  const { onCreateGoodsDeliveryNote, ...hooks } = useReceipt()

  const status = ref<'DRAFT' | 'PENDING' | null>(null)

  const receiptId = route.query?.['id'] as string

  onMounted(async () => {
    if (receiptId) {
      isLoading.value = true
      await hooks.onFetchGoodsDeliveryNoteById(receiptId)
      if (!hooks.receiptExport.value) {
        router.replace(ROUTE_PHIEU_XUAT_KHO.CREATE.path)
      } else if (hooks.receiptExport.value?.status?.value !== 'DRAFT') {
        router.replace(ROUTE_PHIEU_XUAT_KHO.DETAIL.pathFunc(receiptId))
      }
      isLoading.value = false
    }
  })

  const onFormSubmit = async (formEvent: SubmitEventPromise) => {
    const result = await formEvent

    if (result.valid) {
      const payload = formGoodsDeliveryNoteRef?.value?.formPayload
      payload.status = status.value

      if (receiptId) {
        try {
          isLoading.value = true
          await hooks.onUpdateGoodsDeliveryNote(
            receiptId,
            payload,
            (result) => {
              if (status.value !== 'DRAFT') {
                $toast.success('Cập nhật phiếu xuất kho thành công', {
                  description: 'Phiếu xuất kho đã được cập nhật thành công',
                })
                router.replace(ROUTE_PHIEU_XUAT_KHO.DETAIL.pathFunc(result.id))
              } else {
                $toast.success('Đã cập nhật bản nháp', {
                  description: 'Đã cập nhật bản nháp phiếu xuất kho thành công',
                })
              }
            },
            (error) => {
              if (status.value !== 'DRAFT') {
                $toast.error('Cập nhật phiếu xuất kho thất bại', {
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
          $toast.error(status.value !== 'DRAFT' ? 'Cập nhật phiếu xuất kho thất bại' : 'Cập nhật bản nháp thất bại', {
            description: 'Hệ thống gặp sự cố, vui lòng thử lại sau',
          })
        } finally {
          isLoading.value = false
        }
      } else {
        try {
          isLoading.value = true
          await onCreateGoodsDeliveryNote(
            payload,
            (result) => {
              if (status.value !== 'DRAFT') {
                $toast.success('Tạo phiếu xuất kho thành công', {
                  description: 'Phiếu xuất kho đã được tạo thành công',
                })
                router.replace(ROUTE_PHIEU_XUAT_KHO.DETAIL.pathFunc(result.id))
              } else {
                $toast.success('Đã lưu nháp', {
                  description: 'Đã lưu nháp phiếu xuất kho thành công',
                })
              }
            },
            (error) => {
              if (status.value !== 'DRAFT') {
                $toast.error('Tạo phiếu xuất kho thất bại', {
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
          $toast.error(status.value !== 'DRAFT' ? 'Tạo phiếu xuất kho thất bại' : 'Lưu nháp thất bại', {
            description: 'Hệ thống gặp sự cố, vui lòng thử lại sau',
          })
        } finally {
          isLoading.value = false
        }
      }
    }
  }
</script>
