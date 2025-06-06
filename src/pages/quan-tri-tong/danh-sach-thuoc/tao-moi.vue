<template>
  <v-container
    class="erp-danh-sach-khoa pa-md-6 pa-3"
    fluid
  >
    <FormDrug
      :is-loading="isLoading"
      :is-update="isUpdate"
      :is-create="true"
      @submit="onSubmit"
    />
  </v-container>
</template>

<script setup lang="ts">
  import { ROUTE_DANH_SACH_THUOC } from '~/constants/route.constants'
  import type { IDrugFormPayload } from '~/types/drug.types'

  definePageMeta({
    layout: 'default',
    middleware: ['auth'],
  })

  useHead({
    title: 'Tạo mới thuốc',
  })

  const isLoading = ref(false)
  const isUpdate = ref(false)

  const hooks = useDrug()
  const router = useRouter()
  const { $toast } = useNuxtApp()

  const onSubmit = async (formPayload: IDrugFormPayload) => {
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
      await hooks.onCreateDrug(
        formData,
        (result) => {
          $toast.success('Tạo thuốc thành công', {
            description: 'Thuốc đã được tạo thành công',
          })
          router.replace(ROUTE_DANH_SACH_THUOC.DETAIL.pathFunc(result.id))
        },
        (error) => {
          $toast.error('Tạo thuốc thất bại', {
            description: error,
          })
        }
      )
    } catch (error) {
      $toast.error('Tạo thuốc thất bại', {
        description: 'Hệ thống gặp sự cố, vui lòng thử lại sau',
      })
    } finally {
      isLoading.value = false
    }
  }
</script>
