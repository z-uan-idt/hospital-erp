<template>
  <v-container
    fluid
    class="pa-4 pa-md-10 pt-7 pt-md-10"
  >
    <v-form
      :readonly="!isUpdate"
      @submit.prevent="onFormSubmit"
    >
      <div :class="['d-flex align-center flex-md-row', 'flex-column justify-space-between ga-4']">
        <div class="d-flex align-center justify-start ga-3 w-100 w-md-auto">
          <v-btn
            icon="mdi-chevron-left"
            variant="outlined"
            color="erp-gray-700"
            class="text-body-1 font-weight-medium"
            size="x-small"
            @click="isUpdate ? onCloseUpdate() : router.back()"
          />
          <h1 :class="['text-lg-h5 text-h6 font-weight-medium', 'text-blue-grey-darken-3']">
            {{ isUpdate ? 'Chỉnh sửa thông tin cá nhân' : 'Thông tin cá nhân' }}
          </h1>
        </div>

        <div
          :class="[
            'd-flex align-center justify-end ga-2 flex-wrap',
            !$vuetify.display.mdAndUp ? 'w-100 position-fixed pa-4 bg-white bottom-0 right-0 left-0 elevation-4' : '',
          ]"
          style="z-index: 1000"
        >
          <template v-if="!isUpdate">
            <v-btn
              color="erp-gray"
              size="large"
              variant="outlined"
              rounded="pill"
              elevation="0"
              class="ps-6 flex-grow-1"
            >
              <template #prepend>
                <Icon
                  name="custom-lock"
                  class="text-black"
                  size="18"
                />
              </template>
              <span class="text-body-1 text-black"> Lấy lại mật khẩu </span>
            </v-btn>
            <v-btn
              color="erp-brand"
              size="large"
              rounded="pill"
              elevation="0"
              class="flex-grow-1 ps-6"
              @click="isUpdate = true"
            >
              <template #prepend>
                <Icon
                  :name="isUpdate ? 'mdi-check' : 'custom-edit-box'"
                  class="me-n1"
                  size="20"
                />
              </template>
              <span
                class="text-body-1"
                style="margin-bottom: -1px"
              >
                {{ isUpdate ? 'Lưu lại' : 'Chỉnh sửa' }}
              </span>
            </v-btn>
          </template>
          <template v-else>
            <v-btn
              color="erp-gray"
              size="large"
              variant="outlined"
              rounded="pill"
              elevation="0"
              class="ps-6 flex-grow-1"
              @click="onCloseUpdate"
            >
              <template #prepend>
                <Icon
                  name="mdi-close"
                  class="text-black me-n1"
                  size="18"
                />
              </template>
              <span class="text-body-1 text-black"> Hủy bỏ </span>
            </v-btn>
            <v-btn
              color="erp-brand"
              size="large"
              rounded="pill"
              elevation="0"
              type="submit"
              class="flex-grow-1 ps-5"
            >
              <template #prepend>
                <Icon
                  :name="isUpdate ? 'mdi-check' : 'custom-edit-box'"
                  class="me-n1"
                  size="20"
                />
              </template>
              <span
                class="text-body-1"
                style="margin-bottom: -1px"
              >
                {{ isUpdate ? 'Lưu lại' : 'Chỉnh sửa' }}
              </span>
            </v-btn>
          </template>
        </div>
      </div>

      <v-row class="mt-4 mb-md-8 mb-15 pb-6 pb-md-0">
        <v-col
          cols="12"
          md="12"
          class="d-flex align-center justify-center"
        >
          <div
            v-if="!isUpdate"
            class="d-flex align-center justify-center flex-column"
          >
            <v-avatar
              size="159"
              variant="outlined"
              color="grey-lighten-1"
              class="mb-6"
              style="user-select: none; pointer-events: none"
            >
              <v-img
                v-if="userData?.avatar"
                :src="userData?.avatar"
              />
              <span
                v-else
                class="text-blue-grey-darken-3 text-h1 font-weight-bold"
              >
                {{ userData?.full_name.charAt(0).toUpperCase() }}
              </span>
            </v-avatar>

            <div :class="['mb-4 text-lg-h5 text-h6', 'font-weight-bold text-uppercase text-center']">
              {{ userData?.full_name }}
            </div>

            <v-chip
              v-if="userData?.is_active"
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
          <CommonImageUpload
            v-else
            v-model="formPayload.avatar_file"
            :preview="userData?.avatar"
            size="159"
            @update:preview="(v) => (isPreviewImage = v)"
          />
        </v-col>

        <v-col
          cols="12"
          md="12"
          class="mb-2"
          :class="{ 'form-readonly': !isUpdate }"
        >
          <CommonFieldset title="Thông tin tài khoản">
            <v-row>
              <v-col v-bind="colProps['6/4']">
                <v-text-field
                  v-model="formPayload.full_name"
                  dense
                  placeholder="Nhập họ và tên"
                  :rules="[formRules.required]"
                >
                  <template v-slot:label>
                    <span> Họ và tên </span>
                    <span
                      v-if="isUpdate"
                      class="text-red"
                    >
                      *
                    </span>
                  </template>
                </v-text-field>
              </v-col>

              <v-col v-bind="colProps['6/4']">
                <v-text-field
                  v-model="formPayload.username"
                  dense
                  placeholder="Nhập tên đăng nhập"
                  :rules="[formRules.required]"
                >
                  <template v-slot:label>
                    <span> Tên đăng nhập</span>
                    <span
                      v-if="isUpdate"
                      class="text-red"
                    >
                      *
                    </span>
                  </template>
                </v-text-field>
              </v-col>

              <v-col v-bind="colProps['6/4']">
                <v-text-field
                  v-model="formPayload.nickname"
                  dense
                  placeholder="Nhập biệt danh"
                  :rules="[formRules.required]"
                >
                  <template v-slot:label>
                    <span> Biệt danh </span>
                    <span
                      v-if="isUpdate"
                      class="text-red"
                    >
                      *
                    </span>
                  </template>
                </v-text-field>
              </v-col>

              <v-col v-bind="colProps['6/3']">
                <v-select
                  v-model="formPayload.gender"
                  :items="GENDER_OPTIONS"
                  dense
                  placeholder="Chọn giới tính"
                  :menu-icon="isUpdate ? 'mdi-chevron-down' : ''"
                >
                  <template v-slot:label>
                    <span> Giới tính </span>
                  </template>
                </v-select>
              </v-col>

              <v-col v-bind="colProps['6/3']">
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

              <v-col v-bind="colProps['6/3']">
                <v-text-field
                  v-model="formPayload.CCCD_number"
                  dense
                  placeholder="Nhập số CMND/CCCD"
                >
                  <template v-slot:label>
                    <span> Số CMND/CCCD</span>
                  </template>
                </v-text-field>
              </v-col>

              <v-col v-bind="colProps['6/3']">
                <v-date-input
                  v-model="formPayload.date_of_birth"
                  dense
                  placeholder="Chọn ngày sinh"
                  :append-inner-icon="isUpdate ? 'mdi-calendar-outline' : ''"
                  input-format="DD/MM/YYYY"
                >
                  <template v-slot:label>
                    <span> Ngày sinh </span>
                  </template>
                </v-date-input>
              </v-col>

              <v-col v-bind="colProps['6/3']">
                <v-text-field
                  v-model="formPayload.BHYT_code"
                  dense
                  placeholder="Nhập số BHYT"
                >
                  <template v-slot:label>
                    <span> Số BHYT </span>
                  </template>
                </v-text-field>
              </v-col>

              <v-col v-bind="colProps['6/3']">
                <v-text-field
                  v-model="formPayload.phone_number"
                  dense
                  placeholder="Nhập số điện thoại"
                  :rules="[formRules.required]"
                >
                  <template v-slot:label>
                    <span> Số điện thoại </span>
                    <span
                      v-if="isUpdate"
                      class="text-red"
                    >
                      *
                    </span>
                  </template>
                </v-text-field>
              </v-col>

              <v-col v-bind="colProps['6/3']">
                <v-text-field
                  v-model="formPayload.primary_contact_number"
                  dense
                  placeholder="Nhập số điện thoại liên hệ 1"
                >
                  <template v-slot:label>
                    <span> Số điện thoại liên hệ 1</span>
                  </template>
                </v-text-field>
              </v-col>

              <v-col v-bind="colProps['6/3']">
                <v-text-field
                  v-model="formPayload.secondary_contact_number"
                  dense
                  placeholder="Nhập số điện thoại liên hệ 2"
                >
                  <template v-slot:label>
                    <span> Số điện thoại liên hệ 2</span>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
          </CommonFieldset>

          <CommonFieldset
            title="Địa chỉ"
            class="mt-8"
          >
            <v-row>
              <v-col v-bind="colProps.full">
                <v-text-field
                  v-model="formPayload.address"
                  dense
                  placeholder="Nhập địa chỉ chi tiết"
                  :rules="[formRules.required]"
                >
                  <template v-slot:label>
                    <span>Địa chỉ chi tiết</span>
                    <span
                      v-if="isUpdate"
                      class="text-red"
                    >
                      *
                    </span>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
          </CommonFieldset>

          <template v-if="isUpdate">
            <v-btn
              :color="formPayload.is_hidden ? 'erp-brand-100' : 'erp-error-100'"
              size="large"
              rounded="pill"
              elevation="1"
              class="mt-4"
              @click="formPayload.is_hidden = !formPayload.is_hidden"
            >
              <template #prepend>
                <Icon
                  name="custom-eye-slash"
                  class="me-n1 ml-2"
                  :class="{
                    'text-erp-error-600': !formPayload.is_hidden,
                    'text-erp-brand-600': formPayload.is_hidden,
                  }"
                  size="18"
                />
              </template>
              <span
                class="text-body-1"
                :class="{
                  'text-erp-error-600': !formPayload.is_hidden,
                  'text-erp-brand-600': formPayload.is_hidden,
                }"
                style="margin-bottom: -2px"
              >
                {{ formPayload.is_hidden ? 'Hiện tài khoản' : 'Ẩn tài khoản' }}
              </span>
            </v-btn>
          </template>
        </v-col>

        <template v-if="!isUpdate">
          <v-col v-bind="colProps['6/6']">
            <v-text-field
              :model-value="userData?.created_at ? formatDateTime(userData?.created_at) : 'Chưa cập nhật'"
              placeholder="Chưa cập nhật"
              label="Tạo lúc"
              readonly
            >
              <template v-slot:details>
                <p class="text-caption text-black w-100">
                  Bởi
                  <strong class="font-weight-medium">
                    {{ userData?.created_by?.full_name || 'Hệ thống' }}
                  </strong>
                </p>
              </template>
            </v-text-field>
          </v-col>

          <v-col v-bind="colProps['6/6']">
            <v-text-field
              :model-value="userData?.updated_at ? formatDateTime(userData?.updated_at) : 'Chưa cập nhật'"
              placeholder="Chưa cập nhật"
              label="Cập nhật lúc"
              readonly
            >
              <template
                v-if="userData?.updated_by?.full_name"
                v-slot:details
              >
                <p class="text-caption text-black w-100">
                  Bởi
                  <strong class="font-weight-medium">
                    {{ userData?.updated_by?.full_name }}
                  </strong>
                </p>
              </template>
            </v-text-field>
          </v-col>
        </template>
      </v-row>
    </v-form>
  </v-container>

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
</template>

<script setup lang="ts">
  import type { SubmitEventPromise } from 'vuetify'
  import type { IChoice } from '~/types/core.types'
  import type { IAccount } from '~/types/account.types'

  definePageMeta({
    keepalive: true,
    layout: 'welcome',
    middleware: ['auth'],
  })

  useHead({
    title: 'Thông tin cá nhân',
  })

  const router = useRouter()
  const { $toast } = useNuxtApp()
  const formRules = useFormRules()
  const { userData, ...hooks } = useAuth()

  const GENDER_OPTIONS = [
    {
      label: 'Nam',
      value: 'MALE',
    },
    {
      label: 'Nữ',
      value: 'FEMALE',
    },
    {
      label: 'Khác',
      value: 'OTHER',
    },
  ]

  const formPayload = ref<IAccount>({
    avatar: null,
    avatar_file: null,
    gender: GENDER_OPTIONS[2],
    full_name: '',
    CCCD_number: '',
    BHYT_code: '',
    address: '',
    date_of_birth: null,
    username: '',
    phone_number: '',
    email: '',
    nickname: '',
    primary_contact_number: '',
    secondary_contact_number: '',
    is_hidden: false,
  })

  const isUpdate = ref(false)
  const isLoading = ref(false)
  const isPreviewImage = ref(false)
  const colProps = {
    '6/4': {
      cols: 12,
      sm: 12,
      md: 6,
      lg: 4,
      class: 'pb-0',
    },
    '6/3': {
      cols: 12,
      sm: 12,
      md: 6,
      lg: 3,
      class: 'pb-0',
    },
    '6/6': {
      cols: 12,
      sm: 12,
      md: 6,
      lg: 6,
      class: 'pb-0',
    },
    full: {
      cols: 12,
      sm: 12,
      md: 12,
      lg: 12,
      class: 'pb-0',
    },
  }

  const updateFormPayload = () => {
    Object.keys(formPayload.value).forEach((key) => {
      formPayload.value[key] = userData.value[key]
    })
  }

  watchEffect(() => {
    if (userData.value) {
      updateFormPayload()
    }
  })

  const onCloseUpdate = () => {
    updateFormPayload()
    isUpdate.value = false
    formPayload.value.avatar_file = null
  }

  const onFormSubmit = async (formEvent: SubmitEventPromise) => {
    const results = await formEvent
    if (!results.valid) return

    isLoading.value = true
    const formData = new FormData()
    const file_keys = ['avatar_file']

    const _formPayload = { ...formPayload.value }

    Object.keys(_formPayload).forEach((key) => {
      const value = _formPayload[key]
      if (key === 'date_of_birth') {
        _formPayload[key] = formatDate(value, 'yyyy-MM-dd')
      } else if (typeof value === 'object' && value && !file_keys.includes(key)) {
        _formPayload[key] = (value as IChoice).value
      }
    })

    const deleteFileKeys = []
    Object.entries(_formPayload).forEach(([key, value]) => {
      const is_file = file_keys.includes(key)
      const currentKey = is_file ? key.replace('_file', '') : key
      if (isUpdate.value && is_file && !value) {
        deleteFileKeys.push(currentKey)
      }
      if (value === null && !is_file) {
        value = ''
      }
      formData.append(currentKey, value as any)
      if (is_file && !value) {
        formData.delete(currentKey)
      }
    })

    if (deleteFileKeys.length > 0 && !isPreviewImage.value) {
      formData.append('delete_file_keys', deleteFileKeys.join(','))
    }

    try {
      await hooks.onUpdateCurrentUser(
        formData,
        async (accountValue: IAccount) => {
          hooks.setUserData(accountValue)
          $toast.success('Thành công', {
            description: 'Cập nhật tài khoản thành công',
          })
          isUpdate.value = false
          updateFormPayload()
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
      isLoading.value = false
    }
  }
</script>

<style scoped lang="scss"></style>
