<template>
  <v-container
    class="erp-nhan-vien pa-md-6 pa-3"
    fluid
  >
    <div class="d-flex align-center flex-row justify-space-between ga-4">
      <div class="d-flex align-center justify-start ga-3 w-100 w-md-auto">
        <h1 :class="['text-lg-h5 text-h6 font-weight-medium', 'text-blue-grey-darken-3']">Nhân viên</h1>
      </div>

      <div class="action-buttons d-flex align-center ga-2">
        <v-btn
          icon
          variant="outlined"
          color="erp-gray"
          size="small"
        >
          <v-icon
            size="20"
            class="text-erp-gray-800"
          >
            custom-upload
          </v-icon>
        </v-btn>
        <v-btn
          icon
          variant="outlined"
          color="erp-gray"
          size="small"
        >
          <v-icon
            size="20"
            class="me-n1 text-erp-gray-800"
          >
            custom-file-export
          </v-icon>
        </v-btn>
        <v-btn
          icon
          variant="outlined"
          color="erp-gray"
          size="small"
          class="text-body-1"
          @click="isInvitationSentAccept = true"
        >
          <v-icon
            size="18"
            class="text-erp-gray-800"
            style="margin-left: -2px"
          >
            custom-paper-plane
          </v-icon>
        </v-btn>
      </div>
    </div>

    <div class="d-flex align-center flex-row justify-space-between mt-3 w-100">
      <v-text-field
        v-model="hooks.search.value"
        prepend-inner-icon="mdi-magnify"
        label="Tìm kiếm"
        variant="outlined"
        single-line
        placeholder="Nhập từ khóa"
        rounded="pill"
        bg-color="grey-lighten-5"
        hide-details
        density="compact"
        :style="{
          maxWidth: $vuetify.display.smAndDown ? '100%' : $vuetify.display.mdAndDown ? '300px' : '400px',
        }"
        @update:model-value="onSearch"
      />

      <div
        class="action-buttons d-flex align-center ga-2"
        :class="{
          'ms-2': invitationSentOrganizations.length || requestJoinOrganizations.length,
        }"
      >
        <v-menu
          v-model="isInvitationSent"
          :close-on-content-click="false"
          location="bottom right"
        >
          <template v-slot:activator="{ props }">
            <v-chip
              v-if="invitationSentOrganizations.length > 0"
              variant="outlined"
              color="erp-gray"
              size="auto"
              class="pa-1"
              v-bind="props"
            >
              <div
                v-if="!$vuetify.display.smAndDown"
                class="ps-3 pe-2 text-erp-gray-700"
              >
                Đã gửi lời mời
              </div>
              <v-chip
                variant="tonal"
                color="erp-blue"
                size="auto"
                :style="{
                  width: $vuetify.display.smAndDown ? '28px' : 'auto',
                }"
                class="text-body-2 ps-2 pe-2 pt-1 pb-1 d-flex align-center justify-center"
              >
                {{ formatNumberDot(invitationSentOrganizations.length) }}
              </v-chip>
            </v-chip>
          </template>

          <div class="erp-scrollbar border border-opacity-25 pa-2 rounded-lg bg-white mt-2">
            <div class="ps-4 pe-4 pt-4">
              <CommonDivider label="Đã gửi lời mời gia nhập tổ chức" />
            </div>
            <div class="overflow-y-auto">
              <v-sheet
                min-width="534"
                rounded="lg"
                max-height="500px"
                variant="outlined"
              >
                <template
                  v-for="(item, index) in invitationSentOrganizations"
                  :key="index"
                >
                  <v-card
                    class="pa-0"
                    elevation="0"
                  >
                    <template #prepend>
                      <v-avatar
                        size="40"
                        variant="outlined"
                        color="grey-darken-4"
                        class="text-body-1 text-black"
                        :image="item.avatar"
                        :text="item.full_name.charAt(0).toUpperCase()"
                      />
                    </template>
                    <template #title>
                      <div class="d-flex align-center ga-2 mt-1">
                        <span class="text-body-1 font-weight-medium">{{ item.full_name }}</span>
                      </div>
                    </template>
                    <template
                      v-if="item.phone_number"
                      #subtitle
                    >
                      <span class="text-body-2 text-erp-gray-700">{{ item.phone_number }}</span>
                    </template>
                    <template #append>
                      <v-btn
                        icon="mdi-close"
                        size="small"
                        color="erp-error"
                        class="me-2"
                        variant="outlined"
                        :loading="isInvitationSentLoading === item.id"
                        @click="onInvitationSentOrganizationAction(item.id, false)"
                      />
                    </template>
                    <div class="text-body-2 text-erp-gray-700 ps-5 pb-3">
                      Đã gửi lúc: {{ formatDate(item.requested_at, 'HH:mm:ss dd/MM/yyyy') }}
                    </div>
                  </v-card>
                  <v-divider v-if="index !== invitationSentOrganizations.length - 1" />
                </template>
              </v-sheet>
            </div>
          </div>
        </v-menu>

        <v-menu
          v-model="isRequestJoin"
          :close-on-content-click="false"
          location="bottom right"
          class="erp-scrollbar"
        >
          <template v-slot:activator="{ props }">
            <v-chip
              v-if="requestJoinOrganizations.length > 0"
              variant="outlined"
              color="erp-gray"
              size="auto"
              class="pa-1"
              :style="{
                width: $vuetify.display.smAndDown ? '38px' : 'auto',
              }"
              v-bind="props"
            >
              <div
                v-if="!$vuetify.display.smAndDown"
                class="ps-3 pe-2 text-erp-gray-700"
              >
                Yêu cầu gia nhập
              </div>
              <v-chip
                variant="tonal"
                color="erp-error"
                size="auto"
                :style="{
                  width: $vuetify.display.smAndDown ? '28px' : 'auto',
                }"
                class="text-body-2 ps-2 pe-2 pt-1 pb-1 d-flex align-center justify-center"
              >
                {{ formatNumberDot(requestJoinOrganizations.length) }}
              </v-chip>
            </v-chip>
          </template>

          <div class="erp-scrollbar border border-opacity-25 pa-2 rounded-lg bg-white mt-2">
            <div class="ps-4 pe-4 pt-4">
              <CommonDivider label="Xét duyệt yêu cầu gia nhập" />
            </div>
            <div class="overflow-y-auto erp-scrollbar">
              <v-sheet
                :min-width="$vuetify.display.smAndDown ? 'calc(100dvw - 42px)' : '534px'"
                rounded="lg"
                max-height="500px"
                variant="outlined"
              >
                <template
                  v-for="(item, index) in requestJoinOrganizations"
                  :key="index"
                >
                  <v-card
                    class="pa-0"
                    elevation="0"
                  >
                    <template #prepend>
                      <v-avatar
                        size="40"
                        variant="outlined"
                        color="grey-darken-4"
                        class="text-body-1 text-black"
                        :image="item.avatar"
                        :text="item.full_name.charAt(0).toUpperCase()"
                      />
                    </template>
                    <template #title>
                      <div class="d-flex align-center ga-2">
                        <span class="text-body-1 font-weight-medium">{{ item.full_name }}</span>
                        <v-icon
                          size="8"
                          class="text-erp-gray-800"
                          style="margin-top: -1px"
                          :color="item?.is_active ? 'erp-brand' : 'erp-error'"
                        >
                          mdi-circle
                        </v-icon>
                      </div>
                    </template>
                    <template
                      v-if="item.phone_number"
                      #subtitle
                    >
                      <span class="text-body-2 text-erp-gray-700">{{ item.phone_number }}</span>
                    </template>
                    <template #append>
                      <v-btn
                        icon="mdi-close"
                        size="small"
                        color="erp-error"
                        class="me-2"
                        variant="outlined"
                        :loading="isRequestJoinLoading === item.id"
                        @click="onRequestJoinOrganizationAction(item.id, false)"
                      />
                      <v-btn
                        icon="mdi-check"
                        color="erp-brand"
                        variant="outlined"
                        size="small"
                        @click="requestJoinAccept = item"
                      />
                    </template>
                    <div class="text-body-2 text-erp-gray-700 ps-5 pb-3">
                      Đã yêu cầu lúc: {{ formatDate(item.requested_at, 'HH:mm:ss dd/MM/yyyy') }}
                    </div>
                  </v-card>
                  <v-divider v-if="index !== requestJoinOrganizations.length - 1" />
                </template>
              </v-sheet>
            </div>
          </div>
        </v-menu>
      </div>
    </div>

    <v-data-table
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      :items="staffs"
      item-value="name"
      :headers="headers"
      class="mt-3"
      fixed-header
      hover
      :loading="isLoading"
      :items-length="hooks.count"
      disable-sort
      style="height: calc(100dvh - 240px)"
      @update:options="onLoadTable"
    >
      <template v-slot:headers="{ columns }">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            :style="{
              minWidth: column.minWidth,
            }"
            @click="sortableColumns.includes(column.key) && sortBy(column)"
          >
            <span>{{ column.title }}</span>
            <v-icon
              v-if="sortableColumns.includes(column.key)"
              size="16"
              class="text-erp-gray-800"
            >
              {{
                !column?.['sort_by']
                  ? 'fa-solid-sort'
                  : column?.['sort_by'] === 1
                    ? 'fa-solid-sort-up'
                    : 'fa-solid-sort-down'
              }}
            </v-icon>
          </th>
        </tr>
      </template>

      <template v-slot:item.created_at="{ item }">
        {{ formatDate(item.created_at, 'HH:mm:ss dd/MM/yyyy') }}
      </template>

      <template v-slot:bottom>
        <div class="d-flex align-center w-100 pa-2 ga-2">
          <template v-if="!$vuetify.display.smAndDown">
            <span> Số dòng trên 1 trang </span>
            <v-select
              v-model="itemsPerPage"
              :items="[10, 20, 50, 100]"
              variant="outlined"
              rounded="lg"
              max-width="100px"
              hide-details
              density="compact"
              @update:model-value="onSelectItemsPerPage"
            />
            <span>
              Trong tổng số: <strong>{{ hooks.count }}</strong> bản ghi
            </span>
          </template>
          <v-spacer />
          <v-pagination
            v-model="page"
            :length="hooks.numPages.value"
            rounded="circle"
            variant="elevated"
            elevation="0"
            size="small"
            :total-visible="$vuetify.display.smAndDown ? 3 : 7"
            active-color="erp-brand"
            border="sm"
          />
        </div>
      </template>
    </v-data-table>

    <FormOrganizationAccept
      :visible="!!requestJoinAccept"
      active="accept"
      :account="requestJoinAccept"
      @close="requestJoinAccept = null"
      @success="onRequestJoinOrganizationSuccess"
    />

    <FormOrganizationAccept
      :visible="isInvitationSentAccept"
      active="search"
      @close="isInvitationSentAccept = false"
      @success="onInviteRequestJoinOrganizationSuccess"
    />
  </v-container>
</template>

<script setup lang="ts">
  import { CommonDivider } from '#components'
  import type { DataTableHeader } from 'vuetify'
  import type { IBasicAccount } from '~/types/account.types'

  definePageMeta({
    layout: 'default',
    middleware: ['auth'],
    keepalive: true,
  })

  useHead({
    title: 'Danh sách khoa',
  })

  const page = ref(1)
  const isLoading = ref(false)
  const isInvitationSent = ref(false)
  const isRequestJoin = ref(false)
  const itemsPerPage = ref(15)
  const { $toast } = useNuxtApp()
  const requestJoinOrganizations = ref<IBasicAccount[]>([])
  const invitationSentOrganizations = ref<IBasicAccount[]>([])
  const isRequestJoinLoading = ref(null)
  const isInvitationSentLoading = ref(null)
  const requestJoinAccept = ref<IBasicAccount | null>(null)
  const isInvitationSentAccept = ref<boolean>(false)

  const systemStore = useSystemStore()
  const { staffs, ...hooks } = useStaff()
  const { organizationSelected } = useAuth()
  const organizationHooks = useOrganization()

  const onRequestJoinOrganizationSuccess = async () => {
    isLoading.value = true
    requestJoinOrganizations.value = requestJoinOrganizations.value.filter(
      (item) => item.id !== requestJoinAccept.value?.id
    )
    requestJoinAccept.value = null
    isRequestJoin.value = false
    await hooks.onFetchStaff(organizationSelected.value.id)
    isLoading.value = false
  }

  const onInviteRequestJoinOrganizationSuccess = async () => {
    isInvitationSentAccept.value = false
    invitationSentOrganizations.value = await organizationHooks.onFetchInvitationSentOrganizations(
      organizationSelected.value.id
    )
  }

  onMounted(async () => {
    isLoading.value = true
    await hooks.onFetchStaff(organizationSelected.value.id)
    isLoading.value = false
  })

  onMounted(async () => {
    requestJoinOrganizations.value = await organizationHooks.onFetchRequestJoinOrganizations(
      organizationSelected.value.id
    )
  })

  onMounted(async () => {
    invitationSentOrganizations.value = await organizationHooks.onFetchInvitationSentOrganizations(
      organizationSelected.value.id
    )
  })

  watchEffect(async () => {
    if (systemStore.notification) {
      const payload = systemStore.notification
      const data = payload?.data
      if (
        data?.type === 'organization_member_requested_to_join' &&
        Number(data?.id) === Number(organizationSelected.value.id)
      ) {
        requestJoinOrganizations.value = await organizationHooks.onFetchRequestJoinOrganizations(
          organizationSelected.value.id
        )
        systemStore.setNotification(null)
      }
    }
  })

  const sortableColumns = ['staff_count', 'warehouse_count', 'created_at']

  const headers = ref<DataTableHeader[]>([
    {
      title: 'Mã nhân viên',
      key: 'staff_code',
    },
    {
      title: 'Tên tài khoản',
      key: 'full_name',
    },
    {
      title: 'Số điện thoại tại tổ chức',
      key: 'organization_phone_number',
      value: (item) => item?.organization_phone_number ?? 'Không có dữ liệu',
    },
    {
      title: 'Email tại tổ chức',
      key: 'organization_email',
      value: (item) => item?.organization_email ?? 'Không có dữ liệu',
    },
    {
      title: 'Chức vụ',
      key: 'department_role',
      value: (item) => item?.department_role ?? 'Không có dữ liệu',
    },
    {
      title: 'Khoa',
      key: 'department',
      value: (item) => item?.department ?? 'Không có dữ liệu',
    },
    {
      title: 'Kho trực thuộc',
      key: 'warehouse',
      value: (item) => item?.warehouse ?? 'Không có dữ liệu',
    },
    {
      title: 'Ngày tạo',
      key: 'created_at',
    },
  ])

  const onSelectItemsPerPage = async (value: number) => {
    hooks.setPage(1)
    hooks.setLimit(value)
    isLoading.value = true
    await hooks.onFetchStaff(organizationSelected.value?.id)
    isLoading.value = false
  }

  const sortBy = (column: any) => {
    if (!column.sort_by) {
      column.sort_by = 0
    }

    if (column.sort_by === 0) {
      column.sort_by = 2
    } else if (column.sort_by === 2) {
      column.sort_by = 1
    } else {
      column.sort_by = 0
    }
    isLoading.value = true
    setTimeout(() => {
      isLoading.value = false
    }, 1000)
  }

  function onLoadTable({ page, itemsPerPage, sortBy, ...args }) {}

  const onSearch = useDebounce(async (value: string) => {
    hooks.setPage(1)
    hooks.setSearch(value)
    isLoading.value = true
    await hooks.onFetchStaff(organizationSelected.value?.id)
    isLoading.value = false
  }, 1000)

  const onRequestJoinOrganizationAction = async (aid: number, is_accept: boolean) => {
    try {
      isRequestJoinLoading.value = aid
      await organizationHooks.onRequestJoinOrganizationAction(
        {
          aid,
          is_accept,
          oid: organizationSelected.value.id,
        },
        () => {
          requestJoinOrganizations.value = requestJoinOrganizations.value.filter((item) => item.id !== aid)
          if (requestJoinOrganizations.value.length === 0) {
            isRequestJoin.value = false
          }
          if (is_accept) {
            $toast.success('Đã xác nhận yêu cầu gia nhập', {
              description: 'Nhân viên đã được thêm vào tổ chức',
            })
          } else {
            $toast.success('Đã từ chối yêu cầu gia nhập', {
              description: 'Nhân viên đã bị từ chối gia nhập tổ chức',
            })
          }
        },
        (error) => {
          $toast.error('Thất bại', {
            description: error,
          })
        }
      )
    } catch (error) {
      $toast.error('Thất bại', {
        description: 'Hệ thống đang gặp sự cố, vui lòng thử lại sau',
      })
    } finally {
      isRequestJoinLoading.value = null
    }
  }

  const onInvitationSentOrganizationAction = async (aid: number, is_accept: boolean) => {
    try {
      isInvitationSentLoading.value = aid
      await organizationHooks.onInvitationSentOrganizationAction(
        {
          aid,
          is_accept,
          oid: organizationSelected.value.id,
        },
        () => {
          invitationSentOrganizations.value = invitationSentOrganizations.value.filter((item) => item.id !== aid)
          if (invitationSentOrganizations.value.length === 0) {
            isInvitationSent.value = false
          }
          if (is_accept) {
            $toast.success('Đã xác nhận lời mời gia nhập', {
              description: 'Nhân viên đã được thêm vào tổ chức',
            })
          } else {
            $toast.success('Đã hủy lời mời gia nhập', {
              description: 'Đã hủy lời mời gia nhập tổ chức',
            })
          }
        },
        (error) => {
          $toast.error('Thất bại', {
            description: error,
          })
        }
      )
    } catch (error) {
      $toast.error('Thất bại', {
        description: 'Hệ thống đang gặp sự cố, vui lòng thử lại sau',
      })
    } finally {
      isInvitationSentLoading.value = null
    }
  }
</script>

<style scoped lang="scss"></style>
