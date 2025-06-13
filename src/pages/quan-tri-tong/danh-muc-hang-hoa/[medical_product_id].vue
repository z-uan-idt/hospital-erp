<template>
  <v-container
    class="erp-danh-sach-khoa pa-md-6 pa-3"
    fluid
  >
    <FormMedicalProduct
      :is-loading="isLoading"
      :is-update="isUpdate"
      :is-create="false"
      :medical-product="medicalProduct"
      :page-label="isUpdate ? `Chỉnh sửa ${currentLabel.toLowerCase()}` : `Chi tiết ${currentLabel.toLowerCase()}`"
      @update="(v) => (isUpdate = v)"
      @submit="onSubmit"
    />
  </v-container>
</template>

<script setup lang="ts">
  import type { IMedicalProductFormPayload } from '~/types/medical_product.types'
  import { MEDICAL_PRODUCT_TYPES } from '~/constants/core.constants'

  const { selectedMedicalProductType } = useAuth()

  const currentLabel = computed(() => {
    return MEDICAL_PRODUCT_TYPES.find((item) => item.value === selectedMedicalProductType.value)?.label
  })

  definePageMeta({
    layout: 'default',
    middleware: ['auth'],
  })

  const route = useRoute()

  const isLoading = ref(false)
  const isUpdate = ref(false)
  const medicalProductId = route.params?.['medical_product_id'] as string

  const { medicalProduct, ...hooks } = useMedicalProduct()

  onMounted(async () => {
    isLoading.value = true
    await hooks.onFetchMedicalProductById(medicalProductId)

    useHead({
      title: `Chi tiết ${currentLabel.value.toLowerCase()} ${medicalProduct.value?.TenHangHoa}`,
    })

    isLoading.value = false
  })

  const { $toast } = useNuxtApp()

  const onSubmit = async (formPayload: IMedicalProductFormPayload) => {
    const formData = new FormData()

    Object.entries(formPayload).forEach(([key, value]) => {
      if (['LoaiBenhAn', 'LoaiThanhToan'].includes(key)) {
        if (value && Array.isArray(value)) {
          formData.append(key, value.join(','))
        } else {
          formData.append(key, value as string)
        }
      } else if (key === 'image') {
        formData.append(key, value as File)
      } else {
        formData.append(key, value as string)
      }
    })

    try {
      isLoading.value = true
      await hooks.onUpdateMedicalProduct(
        medicalProductId,
        formData,
        (result) => {
          useHead({
            title: `Chi tiết ${currentLabel.value.toLowerCase()} ${result.TenHangHoa}`,
          })
          medicalProduct.value = result
          $toast.success(`Cập nhật ${currentLabel.value.toLowerCase()} thành công`, {
            description: `${currentLabel.value} đã được cập nhật thành công`,
          })
          isUpdate.value = false
        },
        (error) => {
          $toast.error(`Cập nhật ${currentLabel.value.toLowerCase()} thất bại`, {
            description: error,
          })
        }
      )
    } catch (error) {
      $toast.error(`Cập nhật ${currentLabel.value.toLowerCase()} thất bại`, {
        description: 'Hệ thống gặp sự cố, vui lòng thử lại sau',
      })
    } finally {
      isLoading.value = false
    }
  }
</script>
