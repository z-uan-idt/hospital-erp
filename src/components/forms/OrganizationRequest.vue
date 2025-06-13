<template>
  <v-dialog
    :model-value="props.visible"
    max-width="630"
    persistent
  >
    <v-form
      validate-on="submit"
      @submit.prevent="onFormSubmit"
    >
      <v-card class="pb-2 pe-2 pt-2">
        <template v-slot:title>
          <div class="d-flex align-center justify-space-between">
            Gửi duyệt truy cập tổ chức
            <v-btn
              size="x-small"
              icon="mdi-close"
              variant="outlined"
              class="text-body-2"
              color="grey-darken-1"
              @click="requestEmit('close')"
            />
          </div>
        </template>

        <div class="ps-2 pe-2">
          <v-text-field
            v-model="search"
            placeholder="Nhập mã tổ chức"
            color="grey-darken-1"
            class="ps-4 pe-4 mt-3 mb-3"
            :rules="[rules.required]"
            @input="onSearch"
          >
            <template v-slot:label>
              <span> Mã tổ chức <span class="text-red">*</span> </span>
            </template>
            <template v-slot:append-inner>
              <v-progress-circular
                v-if="isSearchLoading"
                size="24"
                width="2"
                indeterminate
              />
              <v-icon
                v-else-if="isHandleSearch && !isSearchLoading"
                :class="organization ? 'text-green-darken-1' : 'text-red-darken-1'"
                size="24"
              >
                {{ organization ? 'mdi-check-circle' : 'mdi-close' }}
              </v-icon>
            </template>
          </v-text-field>

          <Transition name="fade">
            <div
              v-if="organization"
              class="d-flex align-center gap-2 justify-center flex-column mb-9"
            >
              <v-avatar
                size="159"
                variant="outlined"
                color="grey-lighten-1"
                class="mb-8"
                style="user-select: none; pointer-events: none"
              >
                <v-img
                  v-if="organization?.profile_picture"
                  :src="organization?.profile_picture"
                />
                <span
                  v-else
                  class="text-blue-grey-darken-3 text-lg-h4 text-h6 font-weight-bold"
                >
                  {{ organization?.name.charAt(0).toUpperCase() }}
                </span>
              </v-avatar>

              <div :class="['text-md-h5 text-h6 font-weight-bold', 'text-uppercase mb-2 text-center ps-4 pe-4']">
                {{ organization?.name }}
                <v-icon
                  v-if="organization.is_verified"
                  color="green-darken-1"
                  :size="!$vuetify.display.mdAndUp ? 20 : 26"
                  class="mt-auto mt-md-n1"
                  style="margin-top: -1px !important"
                >
                  mdi-check-circle
                </v-icon>
              </div>
              <v-chip
                v-if="organization?.is_active"
                size="small"
                color="green-darken-1"
              >
                Đang hoạt động
              </v-chip>
              <v-chip
                v-else
                size="small"
                color="red-darken-1"
              >
                Bị khóa
              </v-chip>
            </div>
          </Transition>
        </div>

        <div class="d-flex justify-end pe-6 ps-6 pb-4 ga-3">
          <v-btn
            color="pmg-gray-700"
            elevation="0"
            variant="outlined"
            rounded="pill"
            size="large"
            class="flex-grow-1 flex-md-grow-0"
            @click="requestEmit('close')"
          >
            <template #prepend>
              <v-icon
                size="18"
                class="me-n1"
              >
                mdi-close
              </v-icon>
            </template>
            <span class="text-body-1">Hủy bỏ</span>
          </v-btn>

          <v-btn
            type="submit"
            color="erp-brand"
            elevation="0"
            rounded="pill"
            size="large"
            :disabled="!organization || organization?.infor?.value !== 'UNKNOWN'"
            class="flex-grow-1 flex-md-grow-0"
            :loading="isLoading"
          >
            <template #prepend>
              <Icon
                name="custom:paper-plane"
                size="18"
                class="me-n1"
              />
            </template>
            <span class="text-body-1">Gửi duyệt</span>
          </v-btn>
        </div>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup lang="ts">
  import type { SubmitEventPromise } from 'vuetify'
  import type { IOrganization } from '~/types/oranization.types'

  type Props = {
    visible: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    visible: false,
  })
  const requestEmit = defineEmits<{
    (e: 'success', value: IOrganization | null): void
    (e: 'close'): void
  }>()

  const rules = useFormRules()
  const { $toast } = useNuxtApp()
  const { organization, ...hooks } = useOrganization()

  const search = ref<string>('')
  const isLoading = ref<boolean>(false)
  const isHandleSearch = ref<boolean>(false)
  const isSearchLoading = ref<boolean>(false)

  watch(
    () => props.visible,
    (value) => {
      if (!value) {
        search.value = ''
        isLoading.value = false
        organization.value = null
        isHandleSearch.value = false
        isSearchLoading.value = false
      }
    }
  )

  const onFormSubmit = async (formEvent: SubmitEventPromise) => {
    const results = await formEvent
    if (results.valid) {
      try {
        isLoading.value = true
        await hooks.onRequestOrganization(
          organization.value.id,
          () => {
            requestEmit('success', organization.value)
            $toast.success('Thông báo', {
              description: 'Đã gửi yêu cầu tham gia tổ chức',
            })
          },
          (error) => {
            $toast.error('Thông báo', {
              description: error || 'Gửi yêu cầu tham gia tổ chức thất bại',
            })
          }
        )
      } catch {
        $toast.error('Thông báo', {
          description: 'Hệ thống gặp sự cố, vui lòng thử lại sau',
        })
      } finally {
        isLoading.value = false
      }
    }
  }

  const onSearch = useDebounce(async () => {
    isHandleSearch.value = false
    isSearchLoading.value = true
    const searchValue = search.value.trim()
    if (searchValue) {
      await hooks.onSearchOrganization(searchValue)
    } else {
      organization.value = null
    }
    isHandleSearch.value = !!searchValue
    isSearchLoading.value = false
  }, 1000)
</script>
