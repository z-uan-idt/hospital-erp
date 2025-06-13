<template>
  <div class="pa-4 pa-lg-10">
    <FormOrganization
      :organization-data="organization"
      :is-loading="isLoading"
      :is-success="isSuccess"
      :is-update="isUpdate"
      :is-create="false"
      @submit="onFormSubmit"
      @update="(v) => (isUpdate = v)"
      @update:preview="(v) => (isPreviewImage = v)"
    >
      <template #empty>
        <div
          v-if="!organization"
          class="d-flex flex-column justify-center align-center w-100"
        >
          <Icon
            name="custom:organization-empty"
            :size="$vuetify.display.smAndDown ? '45vw' : $vuetify.display.mdAndDown ? '30vw' : '20vw'"
          />

          <p class="text-md-h3 text-h4 mt-4 mb-4 font-playfair text-erp-gray-800">Chưa có Tổ chức</p>
        </div>
      </template>
    </FormOrganization>
  </div>
</template>

<script setup lang="ts">
  import type { IOrganizationFormPayload } from '~/types/oranization.types'

  definePageMeta({
    keepalive: true,
    layout: 'welcome',
    middleware: ['auth'],
  })

  const route = useRoute()
  const { $toast } = useNuxtApp()
  const { organization, ...hooks } = useOrganization()

  const isUpdate = ref(false)
  const isSuccess = ref(false)
  const isLoading = ref(false)
  const isPreviewImage = ref(false)

  useHead({
    title: 'Chi tiết tổ chức',
    meta: [
      {
        name: 'description',
        content: 'Chi tiết tổ chức',
      },
    ],
  })

  const organizationId = route.params['org_id'] as string

  const fetchOrganization = async () => {
    try {
      await hooks.onFetchOrganizationById(organizationId)

      useHead({
        meta: [
          {
            name: 'description',
            content: `Chi tiết tổ chức ${organization.value?.name}`,
          },
        ],
      })
    } catch {
      $toast.error('Thất bại', {
        description: 'Hệ thống gặp sự cố, vui lòng thử lại sau',
      })
    }
  }

  onMounted(async () => {
    isLoading.value = true
    await fetchOrganization()
    isLoading.value = false
  })

  const onFormSubmit = async (formPayload: IOrganizationFormPayload) => {
    isLoading.value = true
    const formData = new FormData()

    const deleteFileKeys = []
    Object.entries(formPayload).forEach(([key, value]) => {
      const file_keys = ['profile_picture', 'certificate_file']
      const is_file = file_keys.includes(key)
      if (isUpdate.value && is_file && value === null) {
        deleteFileKeys.push(key)
      }
      if (value === null && !is_file) {
        value = ''
      }
      formData.append(key, value as any)
      if (is_file && !value) {
        formData.delete(key)
      }
    })

    if (deleteFileKeys.length > 0 && !isPreviewImage.value) {
      formData.append('delete_file_keys', deleteFileKeys.join(','))
    }

    try {
      await hooks.onUpdateOrganization(
        Number(organizationId),
        formData,
        async () => {
          isSuccess.value = true
          await fetchOrganization()
          $toast.success('Thành công', {
            description: 'Cập nhật tổ chức thành công',
          })
          isUpdate.value = false
        },
        (error) => {
          isSuccess.value = false
          $toast.error('Thất bại', {
            description: error || 'Hệ thống gặp sự cố, vui lòng thử lại sau',
          })
        }
      )
    } catch {
      isSuccess.value = false
      $toast.error('Thất bại', {
        description: 'Hệ thống gặp sự cố, vui lòng thử lại sau',
      })
    } finally {
      isLoading.value = false
    }
  }
</script>
