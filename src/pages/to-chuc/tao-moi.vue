<template>
  <div class="pa-4 pa-lg-10">
    <FormOrganization
      :is-loading="isLoading"
      :is-success="isSuccess"
      @submit="onFormSubmit"
    />
  </div>
</template>

<script setup lang="ts">
  import { ROUTE_DON_VI_TO_CHUC } from '~/constants/route.constants'
  import type { IOrganizationFormPayload } from '~/types/oranization.types'

  definePageMeta({
    layout: 'welcome',
    middleware: ['auth'],
  })

  const router = useRouter()
  const { $toast } = useNuxtApp()
  const { onCreateOrganization } = useOrganization()

  const isLoading = ref(false)
  const isSuccess = ref(false)

  useHead({
    title: 'Tạo tổ chức',
    meta: [
      {
        name: 'description',
        content: 'Tạo tổ chức mới',
      },
    ],
  })

  const onFormSubmit = async (formPayload: IOrganizationFormPayload) => {
    isLoading.value = true
    const formData = new FormData()

    Object.entries(formPayload).forEach(([key, value]) => {
      const file_keys = ['profile_picture', 'certificate_file']
      const is_file = file_keys.includes(key)
      if (value === null && !is_file) {
        value = ''
      }
      formData.append(key, value as any)
      if (is_file && !value) {
        formData.delete(key)
      }
    })

    await onCreateOrganization(
      formData,
      (organization) => {
        isSuccess.value = true
        $toast.success('Thành công', {
          description: 'Tạo tổ chức thành công',
        })
        router.replace(ROUTE_DON_VI_TO_CHUC.DETAIL.pathFunc(organization.id))
      },
      (error) => {
        isSuccess.value = false
        $toast.error('Thất bại', {
          description: error || 'Hệ thống gặp sự cố, vui lòng thử lại sau',
        })
      }
    )

    isLoading.value = false
  }
</script>
