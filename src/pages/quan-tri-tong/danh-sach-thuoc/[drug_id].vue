<template>
  <v-container
    class="erp-danh-sach-khoa pa-md-6 pa-3"
    fluid
  >
    <FormDrug
      :is-loading="isLoading"
      :is-update="isUpdate"
      :is-create="false"
      :drug="drug"
      :page-label="isUpdate ? 'Chỉnh sửa thuốc' : 'Chi tiết thuốc'"
      @update="(v) => (isUpdate = v)"
      @submit="onSubmit"
    />
  </v-container>
</template>

<script setup lang="ts">
  import type { IDrugFormPayload } from '~/types/drug.types'

  definePageMeta({
    layout: 'default',
    middleware: ['auth'],
  })

  const route = useRoute()

  const isLoading = ref(false)
  const isUpdate = ref(false)
  const drugId = route.params?.['drug_id'] as string

  const { drug, ...hooks } = useDrug()

  onMounted(async () => {
    isLoading.value = true
    await hooks.onFetchDrugById(drugId)

    useHead({
      title: `Chi tiết thuốc ${drug.value?.TenThuoc}`,
    })

    isLoading.value = false
  })

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
      await hooks.onUpdateDrug(
        drugId,
        formData,
        (result) => {
          useHead({
            title: `Chi tiết thuốc ${result.TenThuoc}`,
          })
          drug.value = result
          $toast.success('Cập nhật thuốc thành công', {
            description: 'Thuốc đã được cập nhật thành công',
          })
          isUpdate.value = false
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
