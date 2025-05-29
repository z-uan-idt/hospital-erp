<template>
  <v-dialog
    :model-value="props.visible"
    max-width="900"
    persistent
  >
    <template v-if="tabActive === 'search'">
      <v-btn @click="tabActive = 'accept'">Accept</v-btn>
    </template>
    <v-form
      v-if="tabActive === 'accept'"
      validate-on="submit"
      @submit.prevent="onFormSubmit"
    >
      <v-card class="pb-2 pe-2 pt-2">
        <template v-slot:title>
          <div class="d-flex align-center justify-space-between">
            Xét duyệt yêu cầu gia nhập
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
          <div class="ps-4 pe-4 mb-n2">
            <CommonDivider label="Cho phép tài khoản gia nhập vào khoa của bạn" />
          </div>

          <v-card
            class="pa-0"
            elevation="0"
          >
            <template #prepend>
              <v-avatar
                size="40"
                variant="outlined"
                color="grey-darkĐã yêu cầu lúc: en-4"
                class="text-body-1 text-black"
                :image="props?.account?.avatar"
                :text="props?.account?.full_name.charAt(0).toUpperCase()"
              />
            </template>
            <template #title>
              <div class="d-flex align-center ga-1">
                <span class="text-body-1 font-weight-medium">{{ props?.account?.full_name }}</span>
                <v-icon
                  size="8"
                  class="text-erp-gray-800"
                  style="margin-top: -1px"
                  :color="props?.account?.is_active ? 'erp-brand' : 'erp-error'"
                >
                  mdi-circle
                </v-icon>
              </div>
            </template>
            <template
              v-if="props?.account?.phone_number"
              #subtitle
            >
              <span class="text-body-2 text-erp-gray-700">{{ props?.account?.phone_number }}</span>
            </template>
            <div class="text-body-2 text-erp-gray-700 ps-5 pb-3">
              Đã yêu cầu lúc: {{ formatDate(props?.account?.requested_at, 'HH:mm:ss dd/MM/yyyy') }}
            </div>

            <div class="ps-5 pe-5 pt-3">
              <CommonDivider label="Chọn chức vụ" />
            </div>

            <v-row class="ps-4 pe-4 mb-6">
              <v-col
                cols="12"
                sm="12"
                md="6"
                class="pb-0"
              >
                <v-select
                  clearable
                  label="Khoa"
                  placeholder="Chọn khoa"
                  :rules="[rules.required]"
                  :items="departmentsDropdown"
                  item-title="name"
                  item-value="id"
                >
                  <template v-slot:label>
                    <span> Khoa </span>
                    <span class="text-red"> * </span>
                  </template>
                </v-select>
              </v-col>

              <v-col
                cols="12"
                sm="12"
                md="6"
                class="pb-0"
              >
                <v-select
                  clearable
                  label="Kho trực thuộc"
                  placeholder="Chọn kho trực thuộc"
                />
              </v-col>

              <v-col
                cols="12"
                sm="12"
                md="12"
                class="pb-0"
              >
                <v-select
                  clearable
                  label="Chức vụ"
                  placeholder="Chọn chức vụ"
                  variant="outlined"
                />
              </v-col>

              <v-col
                cols="12"
                sm="12"
                md="4"
                class="pb-0"
              >
                <v-text-field
                  label="Mã nhân viên"
                  placeholder="Nhập mã nhân viên"
                />
              </v-col>

              <v-col
                cols="12"
                sm="12"
                md="4"
                class="pb-0"
              >
                <v-text-field
                  label="Số điện thoại tại tổ chức"
                  placeholder="Nhập số điện thoại tại tổ chức"
                  :rules="[rules.required]"
                >
                  <template v-slot:label>
                    <span> Số điện thoại tại tổ chức </span>
                    <span class="text-red"> * </span>
                  </template>
                </v-text-field>
              </v-col>

              <v-col
                cols="12"
                sm="12"
                md="4"
                class="pb-0"
              >
                <v-text-field
                  label="Email tại tổ chức"
                  placeholder="Nhập email tại tổ chức"
                />
              </v-col>
            </v-row>
          </v-card>
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
  import type { IBasicAccount } from '~/types/account.types'
  import type { IBasicDepartment } from '~/types/department.types'
  import type { IOrganization } from '~/types/oranization.types'

  type Props = {
    visible: boolean
    active?: 'search' | 'accept'
    account?: IBasicAccount
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
  const { organizationSelected } = useAuth()
  const { organization, ...hooks } = useOrganization()
  const tabActive = ref<'search' | 'accept'>('search')

  const departmentsDropdown = ref<IBasicDepartment[]>([])

  const { onFetchDepartmentDropdown } = useDepartment()

  onMounted(async () => {
    console.log(organizationSelected.value)

    departmentsDropdown.value = await onFetchDepartmentDropdown(organizationSelected.value?.id)
  })

  const search = ref<string>('')
  const isLoading = ref<boolean>(false)
  const isHandleSearch = ref<boolean>(false)
  const isSearchLoading = ref<boolean>(false)

  watch(
    () => props.active,
    (value) => {
      tabActive.value = value
    },
    {
      immediate: true,
    }
  )

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
