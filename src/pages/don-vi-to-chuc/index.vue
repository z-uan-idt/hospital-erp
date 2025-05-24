<template>
  <div class="erp-welcome">
    <div class="pa-4 pa-md-10 pt-7 pt-md-10">
      <div
        :class="[
          'text-blue-grey-darken-3 font-playfair',
          'text-md-h3 text-h5 font-weight-bold',
        ]"
      >
        <span>Xin chào, </span>
        <span class="text-erp-brand font-weight-bold">
          {{ userData?.full_name }}
        </span>
      </div>
      <p
        :class="[
          'mt-md-3 mb-2 mb-8 text-erp-gray-700',
          'text-md-body-1 text-body-2',
        ]"
      >
        Mời bạn chọn Tổ chức để làm việc
      </p>
      <div
        v-if="!isEmptyOrganization"
        :class="[
          'd-flex justify-space-between align-center',
          'mb-8 gap-4 flex-column flex-md-row',
        ]"
      >
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Tìm kiếm"
          variant="outlined"
          single-line
          placeholder="Nhập từ khóa"
          rounded="pill"
          bg-color="grey-lighten-5"
          hide-details
          density="comfortable"
          class="w-md-auto w-100 order-md-first order-last mt-3 mt-md-0 me-md-3"
          :style="{
            maxWidth: $vuetify.display.smAndDown.value
              ? '100%'
              : $vuetify.display.mdAndDown.value
                ? '400px'
                : '500px',
          }"
          @update:model-value="onHandleSearch"
        />
        <v-btn
          class="ms-auto w-md-auto w-100 w-md-auto order-md-2 order-first mt-3 mt-md-0 ps-5"
          color="erp-gray-700"
          elevation="0"
          height="48"
          variant="outlined"
          rounded="pill"
          @click="isRequestVisible = true"
        >
          <template #prepend>
            <Icon
              name="custom:paper-plane"
              size="18"
            />
          </template>
          <span class="text-body-1 font-weight-medium">Gửi duyệt</span>
        </v-btn>
        <v-btn
          class="ms-md-3 w-100 w-md-auto order-md-last order-2 mt-3 mt-md-0"
          color="erp-brand"
          elevation="0"
          height="48"
          rounded="pill"
          @click="navigateTo(ROUTE_DON_VI_TO_CHUC.CREATE.path)"
        >
          <template #prepend>
            <v-icon
              size="26"
              class="me-n2"
            >
              mdi-plus
            </v-icon>
          </template>
          <span class="text-body-1 font-weight-medium me-1">Tạo mới</span>
        </v-btn>
      </div>
      <template v-if="!isLoading">
        <div
          v-if="organizations.length === 0"
          class="d-flex flex-column justify-center align-center w-100"
        >
          <Icon
            name="custom:organization-empty"
            :size="
              $vuetify.display.smAndDown.value
                ? '45vw'
                : $vuetify.display.mdAndDown.value
                  ? '30vw'
                  : '20vw'
            "
          />

          <p
            class="text-md-h3 text-h4 mt-4 mb-4 font-playfair text-erp-gray-800"
          >
            {{
              !isEmptyOrganization
                ? 'Không tìm thấy tổ chức'
                : 'Chưa có Tổ chức'
            }}
          </p>

          <div
            v-if="isEmptyOrganization"
            :class="[
              'w-100 d-flex flex-column flex-md-row mt-6',
              'align-center justify-center gap-4',
            ]"
          >
            <v-btn
              class="w-100 w-md-auto order-md-2 order-first mt-3 mt-md-0 ps-5"
              color="erp-gray-700"
              elevation="0"
              height="48"
              variant="outlined"
              rounded="pill"
              @click="isRequestVisible = true"
            >
              <template #prepend>
                <Icon
                  name="custom:paper-plane"
                  size="18"
                />
              </template>
              <span class="text-body-1 font-weight-medium">Gửi duyệt</span>
            </v-btn>
            <v-btn
              class="ms-md-3 w-100 w-md-auto order-md-last order-2 mt-3 mt-md-0"
              color="erp-brand"
              elevation="0"
              height="48"
              rounded="pill"
              @click="navigateTo(ROUTE_DON_VI_TO_CHUC.CREATE.path)"
            >
              <template #prepend>
                <v-icon
                  size="26"
                  class="me-n2"
                >
                  mdi-plus
                </v-icon>
              </template>
              <span class="text-body-1 font-weight-medium me-1">Tạo mới</span>
            </v-btn>
          </div>
        </div>

        <FeatureListOrganization
          :organizations="organizations"
          @update="onLoadingWrapper(onFetchOrganization)"
        />

        <div
          v-if="numPages > 1"
          class="d-flex justify-end align-center w-100 mt-6 pb-6"
        >
          <v-pagination
            v-model="page"
            :length="numPages"
            rounded="circle"
            variant="elevated"
            :total-visible="7"
            active-color="erp-brand"
            border="sm"
            @update:model-value="onPageChange"
          />
        </div>
      </template>
      <template v-else>
        <div
          class="d-flex justify-center align-center w-100 mt-6 pb-6"
          style="height: 300px"
        >
          <v-progress-circular
            indeterminate
            color="erp-brand"
            size="60"
          />
        </div>
      </template>
    </div>

    <FormOrganizationRequest
      :visible="isRequestVisible"
      @success="onRequestSuccess"
      @close="isRequestVisible = false"
    />

    <v-dialog
      v-model="isNotificationVisible"
      transition="dialog-bottom-transition"
      width="auto"
    >
      <template v-slot:default="{ isActive }">
        <v-card
          v-if="notificationData"
          rounded="xl"
          class="pa-2"
        >
          <v-card-text class="text-h2 pa-12 pb-6">
            <div class="d-flex flex-column justify-center align-center ga-2">
              <v-avatar
                size="180"
                variant="outlined"
                color="grey-lighten-1"
                class="d-flex align-center bg-white justify-center"
                style="user-select: none; pointer-events: none"
              >
                <v-img
                  v-if="notificationData?.profile_picture"
                  :src="notificationData?.profile_picture"
                  class="position-absolute top-0 left-0"
                />
                <span
                  v-else
                  class="text-blue-grey-darken-3 text-lg-h4 text-h6 font-weight-bold"
                  style="line-height: 1; margin-right: -2px"
                >
                  {{ notificationData?.name.charAt(0).toUpperCase() }}
                </span>
              </v-avatar>
              <span class="text-h6 text-md-h5 mt-4">
                {{ notificationData?.name }}
              </span>
              <div
                class="text-body-1 text-erp-brand d-flex align-center ga-1 mt-2 mb-2"
              >
                <v-icon
                  size="24"
                  style="margin-top: -2px"
                >
                  mdi-check-circle
                </v-icon>
                {{ notificationData?.message }}
              </div>
            </div>
          </v-card-text>

          <v-card-actions>
            <v-btn
              text="Close"
              block
              color="erp-gray-700"
              variant="outlined"
              elevation="0"
              height="48"
              rounded="pill"
              @click="isActive.value = false"
            >
              <span class="text-body-1 font-weight-medium">Đóng</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ROUTE_DON_VI_TO_CHUC } from '~/constants/route.constants'

  type INotificationData = {
    id: number
    name: string
    profile_picture: string
    message: string
  }

  definePageMeta({
    keepalive: true,
    layout: 'welcome',
    middleware: ['auth'],
  })

  useHead({
    title: 'Lựa chọn tổ chức',
    meta: [
      {
        name: 'description',
        content: 'Lựa chọn tổ chức để làm việc',
      },
    ],
  })

  const { userData, setSelectedOrganization } = useAuth()
  const { $vuetify } = useNuxtApp()
  const {
    onFetchOrganization,
    organizations,
    numPages,
    page,
    setPage,
    search,
    setSearch,
    isEmptyOrganization,
  } = useOrganization()

  const { $toast } = useNuxtApp()
  const systemStore = useSystemStore()
  const isLoading = ref<boolean>(false)
  const isRequestVisible = ref<boolean>(false)
  const isNotificationVisible = ref<boolean>(false)
  const notificationData = ref<INotificationData | null>(null)

  onActivated(() => {
    setSelectedOrganization(null)
  })

  const onLoadingWrapper = async (fn: () => Promise<void>) => {
    isLoading.value = true
    try {
      await fn()
    } catch {
      $toast.error('Thất bại', {
        description: 'Hệ thống gặp sự cố, vui lòng thử lại sau',
      })
    } finally {
      isLoading.value = false
    }
  }

  onMounted(async () => {
    await onLoadingWrapper(onFetchOrganization)
  })

  watchEffect(() => {
    if (systemStore.isReloadWelcome) {
      const payload = systemStore.reloadWelcomeData

      const body = payload.notification?.body

      notificationData.value = {
        id: Number(payload.data.id),
        name: payload.data.name as string,
        profile_picture: payload.data.profile_picture as string,
        message: body || 'Bạn đã được chấp thuận vào tổ chức',
      }

      isNotificationVisible.value = true

      organizations.value = organizations.value.map((organization) => {
        if (organization.id === Number(payload.data.id)) {
          return {
            ...organization,
            infor: {
              label: payload.data.role_label,
              value: payload.data.role_value,
            },
            status: {
              label: payload.data.status_label,
              value: payload.data.status_value,
            },
          }
        }
        return organization
      })

      systemStore.setReloadWelcome(false)
      systemStore.setReloadWelcomeData(null)
    }
  })

  const onPageChange = async (value: number) => {
    setPage(value)
    await onLoadingWrapper(onFetchOrganization)
  }

  const onHandleSearch = useDebounce(async (value: string) => {
    setPage(1)
    setSearch(value)
    await onLoadingWrapper(onFetchOrganization)
  }, 500)

  const onRequestSuccess = async () => {
    isRequestVisible.value = false
    await onLoadingWrapper(onFetchOrganization)
  }
</script>

<style lang="scss" scoped>
  .search-field {
    &-lg {
      max-width: 500px;
    }
    &-md {
      max-width: 400px;
    }
  }
</style>
