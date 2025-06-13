<template>
  <div class="erp-organization-form">
    <v-form
      ref="formRef"
      :readonly="!props.isCreate && !props.isUpdate"
      @submit.prevent="onFormSubmit"
    >
      <div :class="['d-flex align-center flex-md-row', 'flex-column justify-space-between ga-4']">
        <div class="d-flex align-center justify-start ga-3 w-100 w-md-auto">
          <slot
            name="prepend-button"
            v-bind="props"
          >
            <v-btn
              icon="mdi-chevron-left"
              variant="outlined"
              color="erp-gray-700"
              class="text-body-1 font-weight-medium"
              size="x-small"
              @click="onButtonBack"
            />
            <h1 :class="['text-lg-h5 text-h6 font-weight-medium', 'text-blue-grey-darken-3']">
              {{ pageLabel }}
            </h1>
          </slot>
        </div>

        <div
          :class="[
            'd-flex align-center justify-end ga-2',
            !$vuetify.display.mdAndUp ? 'w-100 position-fixed pa-4 bg-white bottom-0 right-0 left-0 elevation-4' : '',
          ]"
          style="z-index: 1000"
        >
          <v-btn
            v-if="props.isUpdate"
            color="erp-gray"
            size="large"
            variant="outlined"
            rounded="pill"
            elevation="0"
            class="ps-6"
            @click="isShowConfirm = true"
          >
            <template #prepend>
              <Icon
                name="custom-trash"
                class="me-n1 text-red"
                size="18"
              />
            </template>
            <span class="text-body-1 text-red"> Xóa </span>
          </v-btn>
          <v-btn
            v-if="(isOwner && isUpdateOrCreate) || props.isCreate"
            color="erp-brand"
            size="large"
            rounded="pill"
            elevation="0"
            type="submit"
            class="flex-grow-1 flex-md-grow-0 border"
            :class="{
              'border-success': hasChanged,
            }"
            :disabled="!hasChanged"
          >
            <template #prepend>
              <v-icon
                class="me-n1"
                size="22"
              >
                mdi-check
              </v-icon>
            </template>
            <span class="text-body-1">
              {{ props.isCreate ? 'Tạo mới' : 'Lưu lại' }}
            </span>
          </v-btn>
          <v-btn
            v-else-if="isOwner && !props.isCreate && !props.isUpdate"
            color="erp-brand"
            size="large"
            rounded="pill"
            elevation="0"
            class="ps-6 flex-grow-1 flex-md-grow-0"
            @click="formEmit('update', true)"
          >
            <template #prepend>
              <Icon
                name="custom-edit-box"
                class="me-n1"
                size="20"
              />
            </template>
            <span
              class="text-body-1"
              style="margin-bottom: -1px"
            >
              Chỉnh sửa
            </span>
          </v-btn>
        </div>
      </div>

      <v-row
        v-if="isUpdateOrCreate || props.organizationData || props.isLoading"
        class="mt-4 mb-md-8 mb-15 pb-6 pb-md-0"
      >
        <v-col
          cols="12"
          md="12"
          class="d-flex align-center justify-center"
        >
          <div
            v-if="!props.isCreate && !props.isUpdate"
            class="d-flex align-center justify-center flex-column"
          >
            <div class="position-relative">
              <v-avatar
                size="159"
                variant="outlined"
                color="grey-lighten-1"
                class="mb-6"
                style="user-select: none; pointer-events: none"
              >
                <v-img
                  v-if="props.organizationData?.profile_picture"
                  :src="props.organizationData?.profile_picture"
                />
                <span
                  v-else
                  class="text-blue-grey-darken-3 text-h1 font-weight-bold"
                >
                  {{ formPayload.name.charAt(0).toUpperCase() }}
                </span>
              </v-avatar>
              <v-icon
                v-if="props.organizationData?.is_verified"
                color="blue-darken-1"
                class="mt-n1 position-absolute bg-white rounded-circle"
                style="bottom: 8px; left: 50%; transform: translateX(calc(-50% + 3px))"
                size="35"
              >
                mdi-check-circle
              </v-icon>
            </div>
            <div :class="['mb-4 text-lg-h5 text-h6', 'font-weight-bold text-uppercase text-center']">
              {{ props.organizationData ? formPayload.name : 'Unnamed' }}
            </div>

            <template v-if="props.organizationData">
              <v-chip
                v-if="props.organizationData?.is_active"
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
            </template>
          </div>
          <CommonImageUpload
            v-else
            v-model="formPayload.profile_picture"
            :preview="props.organizationData?.profile_picture"
            size="159"
            @update:preview="(v) => formEmit('update:preview', v)"
          />
        </v-col>

        <v-col
          :class="{
            'form-readonly': !props.isCreate && !props.isUpdate,
            'mb-4': true,
          }"
          v-bind="colProps.full"
        >
          <CommonFieldset title="Thông tin tổ chức">
            <v-row>
              <v-col v-bind="colProps['6/4']">
                <v-text-field
                  v-model="formPayload.name"
                  dense
                  placeholder="Nhập tên tổ chức"
                  :rules="[rules.required]"
                >
                  <template v-slot:label>
                    <span> Tên tổ chức </span>
                    <span
                      v-if="props.isCreate || props.isUpdate"
                      class="text-red"
                    >
                      *
                    </span>
                  </template>
                </v-text-field>
              </v-col>

              <v-col v-bind="colProps['6/4']">
                <v-text-field
                  v-model="formPayload.code"
                  dense
                  placeholder="Nhập mã tổ chức"
                  :rules="[rules.required]"
                >
                  <template v-slot:label>
                    <span> Mã tổ chức </span>
                    <span
                      v-if="props.isCreate || props.isUpdate"
                      class="text-red"
                    >
                      *
                    </span>
                  </template>
                </v-text-field>
              </v-col>

              <v-col v-bind="colProps['6/4']">
                <v-text-field
                  v-model="formPayload.tax_number"
                  dense
                  placeholder="Nhập mã số thuế"
                >
                  <template v-slot:label>
                    <span> Mã số thuế</span>
                  </template>
                </v-text-field>
              </v-col>

              <v-col v-bind="colProps['6/4']">
                <v-text-field
                  v-model="formPayload.representative"
                  dense
                  placeholder="Nhập người đại diện"
                >
                  <template v-slot:label>
                    <span> Người đại diện </span>
                  </template>
                </v-text-field>
              </v-col>

              <v-col v-bind="colProps['6/4']">
                <v-text-field
                  v-model="formPayload.phone_number"
                  dense
                  placeholder="Nhập số điện thoại"
                >
                  <template v-slot:label>
                    <span> Số điện thoại liên hệ </span>
                  </template>
                </v-text-field>
              </v-col>

              <v-col v-bind="colProps['6/4']">
                <v-text-field
                  v-model="formPayload.emergency_phone_number"
                  dense
                  placeholder="Nhập số điện thoại cấp cứu"
                >
                  <template v-slot:label>
                    <span> Số điện thoại cấp cứu</span>
                  </template>
                </v-text-field>
              </v-col>

              <v-col v-bind="colProps['6/6']">
                <v-text-field
                  v-model="formPayload.email"
                  dense
                  placeholder="Nhập email"
                >
                  <template v-slot:label>
                    <span> Email </span>
                  </template>
                </v-text-field>
              </v-col>

              <v-col v-bind="colProps['6/6']">
                <v-text-field
                  v-model="formPayload.website"
                  dense
                  placeholder="Nhập website"
                >
                  <template v-slot:label>
                    <span> Website </span>
                  </template>
                </v-text-field>
              </v-col>

              <v-col v-bind="colProps.full">
                <v-textarea
                  v-model="formPayload.description"
                  dense
                  placeholder="Nhập mô tả tổ chức"
                >
                  <template v-slot:label>
                    <span> Mô tả tổ chức </span>
                  </template>
                </v-textarea>
              </v-col>
            </v-row>
          </CommonFieldset>

          <CommonFieldset
            title="Địa chỉ tổ chức"
            class="mt-8"
          >
            <v-row>
              <v-col v-bind="colProps.full">
                <v-text-field
                  v-model="formPayload.address"
                  dense
                  placeholder="Nhập địa chỉ chi tiết"
                  :rules="[rules.required]"
                >
                  <template v-slot:label>
                    <span>Địa chỉ chi tiết</span>
                    <span
                      v-if="props.isCreate || props.isUpdate"
                      class="text-red"
                    >
                      *
                    </span>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
          </CommonFieldset>
        </v-col>

        <template v-if="!props.isCreate && !props.isUpdate">
          <v-col v-bind="colProps['6/6']">
            <v-text-field
              :model-value="
                props.organizationData?.created_at
                  ? formatDateTime(props.organizationData?.created_at)
                  : 'Chưa cập nhật'
              "
              placeholder="Chưa cập nhật"
              label="Tạo lúc"
              readonly
            >
              <template v-slot:details>
                <p class="text-caption text-black w-100">
                  Bởi
                  <strong class="font-weight-medium">
                    {{ props.organizationData?.created_by?.full_name || 'Hệ thống' }}
                  </strong>
                </p>
              </template>
            </v-text-field>
          </v-col>

          <v-col v-bind="colProps['6/6']">
            <v-text-field
              :model-value="
                props.organizationData?.updated_at
                  ? formatDateTime(props.organizationData?.updated_at)
                  : 'Chưa cập nhật'
              "
              placeholder="Chưa cập nhật"
              label="Cập nhật lúc"
              readonly
            >
              <template
                v-if="props.organizationData?.updated_by?.full_name"
                v-slot:details
              >
                <p class="text-caption text-black w-100">
                  Bởi
                  <strong class="font-weight-medium">
                    {{ props.organizationData?.updated_by?.full_name }}
                  </strong>
                </p>
              </template>
            </v-text-field>
          </v-col>
        </template>
      </v-row>

      <div
        v-else-if="!props.isLoading"
        class="mt-10"
      >
        <slot name="empty" />
      </div>
    </v-form>

    <v-overlay
      :model-value="props.isLoading || isLoadingConfirm"
      class="d-flex justify-center align-center"
      persistent
    >
      <v-progress-circular
        indeterminate
        size="80"
      />
    </v-overlay>

    <v-dialog
      v-model="isShowConfirm"
      transition="fade-transition"
      max-width="fit-content"
      persistent
    >
      <v-card class="pt-2">
        <template #prepend>
          <v-icon
            size="24"
            style="margin-top: -2px"
          >
            mdi-info-outline
          </v-icon>
        </template>
        <template #title>
          <p class="text-body-1 font-weight-regular">Bạn có chắc chắn muốn xóa tổ chức này?</p>
        </template>
        <div class="d-flex ga-2 ps-4 pe-4 pb-4 align-center justify-end">
          <v-btn
            rounded="pill"
            variant="outlined"
            color="erp-gray-700"
            @click="isShowConfirm = false"
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
            color="erp-error"
            :loading="isLoading"
            @click="onFinishConfirm"
          >
            <template #prepend>
              <Icon
                name="custom:trash"
                size="16"
                class="ms-1"
              />
            </template>
            <span style="margin-bottom: -1px"> Xóa </span>
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
  import type { SubmitEventPromise } from 'vuetify'
  import type { VForm } from 'vuetify/components/VForm'
  import type { IOrganization, IOrganizationFormPayload } from '~/types/oranization.types'

  const props = withDefaults(defineProps<Props>(), {
    isCreate: true,
    isUpdate: false,
    isLoading: false,
    isSuccess: false,
  })

  const formEmit = defineEmits<{
    (e: 'submit', payload: IOrganizationFormPayload): void
    (e: 'update:preview', payload: boolean): void
    (e: 'update', payload: boolean): void
  }>()

  type Props = {
    isCreate?: boolean
    isUpdate?: boolean
    isLoading?: boolean
    isSuccess?: boolean
    organizationData?: IOrganization
  }

  const router = useRouter()
  const rules = useFormRules()
  const hooks = useOrganization()
  const { $toast } = useNuxtApp()
  const formRef = ref<InstanceType<typeof VForm> | null>(null)
  const isOwner = computed(() => props.organizationData?.is_owner)

  const colProps = {
    '6/4': {
      cols: '12',
      sm: '12',
      md: '6',
      lg: '4',
      class: 'pb-0',
    },
    '6/6': {
      cols: '12',
      sm: '12',
      md: '6',
      lg: '6',
      class: 'pb-0',
    },
    full: {
      cols: '12',
      sm: '12',
      md: '12',
      lg: '12',
      class: 'pb-0',
    },
  }

  const initialFormPayload = {
    profile_picture: null,
    name: '',
    code: '',
    representative: '',
    tax_number: '',
    phone_number: '',
    emergency_phone_number: '',
    email: '',
    address: '',
    website: '',
    description: '',
  }

  const formPayload = ref<IOrganizationFormPayload>(initialFormPayload)

  const isUpdateOrCreate = computed(() => {
    return props.isCreate || props.isUpdate
  })

  const pageLabel = computed(() => {
    return props.isCreate ? 'Tạo tổ chức' : props.isUpdate ? 'Chỉnh sửa tổ chức' : 'Thông tin tổ chức'
  })

  const onButtonBack = () => {
    if (props.isCreate || !props.isUpdate) {
      router.back()
    } else {
      formEmit('update', false)
    }
  }

  const isLoadingConfirm = ref(false)

  const onFinishConfirm = async () => {
    try {
      isLoadingConfirm.value = true

      await hooks.onActionOrganization(
        props.organizationData?.id,
        'DELETE',
        () => {
          useRouter().back()
          $toast.success('Thành công', {
            description: 'Tổ chức đã được xóa thành công',
          })
        },
        (error) => {
          $toast.error('Thất bại', {
            description: error || 'Hệ thống gặp sự cố, vui lòng thử lại sau',
          })
        }
      )
    } catch {
      $toast.error('Thất bại', {
        description: 'Hệ thống gặp sự cố, vui lòng thử lại sau',
      })
    } finally {
      isLoadingConfirm.value = false
      isShowConfirm.value = false
    }
  }

  const formPayloadJSON = ref(JSON.stringify(formPayload.value))
  const isShowConfirm = ref(false)
  const hasChanged = ref(false)

  watch(
    formPayload,
    (newValue) => {
      const newValueJSON = JSON.stringify(newValue)
      hasChanged.value = newValueJSON !== formPayloadJSON.value
    },
    { deep: true }
  )

  watchEffect(() => {
    hasChanged.value = !props.isLoading
    const organization = props.organizationData
    formPayload.value = {
      profile_picture: null,
      name: organization?.name ?? '',
      code: organization?.code ?? '',
      representative: organization?.representative ?? '',
      tax_number: organization?.tax_number ?? '',
      phone_number: organization?.phone_number ?? '',
      emergency_phone_number: organization?.emergency_phone_number ?? '',
      email: organization?.email ?? '',
      address: organization?.address ?? '',
      website: organization?.website ?? '',
      description: organization?.description ?? '',
    }
  })

  const onFormSubmit = async (formEvent: SubmitEventPromise) => {
    const results = await formEvent
    if (results.valid) {
      formEmit('submit', formPayload.value)
      formRef.value?.reset()
    }
  }

  onBeforeRouteLeave((to, from, next) => {
    if (hasChanged.value && (props.isCreate || props.isUpdate)) {
      const confirm = window.confirm('Bạn có thay đổi chưa lưu. Bạn có chắc chắn muốn rời khỏi trang này không?')
      if (confirm) {
        next()
      } else {
        next(false)
      }
    } else {
      next()
    }
  })
</script>
