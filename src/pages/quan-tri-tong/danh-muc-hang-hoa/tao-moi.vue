<template>
  <v-container
    class="erp-danh-muc-hang-hoa-tao-moi pa-md-6 pa-3"
    fluid
  >
    <FormMedicalProduct
      :is-loading="isLoading"
      :is-update="isUpdate"
      :is-create="true"
      :page-label="`Tạo mới ${currentLabel.toLowerCase()}`"
      @submit="onSubmit"
    />
  </v-container>
</template>

<script setup lang="ts">
  import { MEDICAL_PRODUCT_TYPES } from '~/constants/core.constants'
  import { ROUTE_DANH_MUC_HANG_HOA } from '~/constants/route.constants'
  import type { IMedicalProductFormPayload } from '~/types/medical_product.types'

  const { selectedMedicalProductType } = useAuth()

  const currentLabel = computed(() => {
    return MEDICAL_PRODUCT_TYPES.find((item) => item.value === selectedMedicalProductType.value)?.label
  })

  definePageMeta({
    layout: 'default',
    middleware: ['auth'],
  })

  useHead({
    title: `Tạo mới ${currentLabel.value.toLowerCase()}`,
  })

  const isUpdate = ref(false)
  const isLoading = ref(false)

  const router = useRouter()
  const { $toast } = useNuxtApp()
  const hooks = useMedicalProduct()

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
      await hooks.onCreateMedicalProduct(
        formData,
        (result) => {
          $toast.success(`Tạo ${currentLabel.value.toLowerCase()} thành công`, {
            description: `${currentLabel.value} đã được tạo thành công`,
          })
          router.replace(ROUTE_DANH_MUC_HANG_HOA.DETAIL.pathFunc(result.id))
        },
        (error) => {
          $toast.error(`Tạo ${currentLabel.value.toLowerCase()} thất bại`, {
            description: error,
          })
        }
      )
    } catch (error) {
      $toast.error(`Tạo ${currentLabel.value.toLowerCase()} thất bại`, {
        description: 'Hệ thống gặp sự cố, vui lòng thử lại sau',
      })
    } finally {
      isLoading.value = false
    }
  }
</script>
