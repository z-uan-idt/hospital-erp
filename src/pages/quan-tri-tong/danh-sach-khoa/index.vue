<template>
  <v-container
    class="erp-danh-sach-khoa pa-md-6 pa-3"
    fluid
  >
    <div class="d-flex align-center flex-row justify-space-between ga-4">
      <div class="d-flex align-center justify-start ga-3 w-100 w-md-auto">
        <h1 :class="['text-lg-h5 text-h6 font-weight-medium', 'text-blue-grey-darken-3']">Danh sách khoa</h1>
      </div>

      <div class="action-buttons d-flex align-center ga-2">
        <v-btn
          icon
          variant="outlined"
          color="erp-gray"
          size="small"
        >
          <v-icon
            size="16"
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
            size="18"
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
          @click="isCreateDialog = true"
        >
          <v-icon
            size="20"
            class="text-erp-gray-800"
          >
            mdi-plus
          </v-icon>
        </v-btn>
      </div>
    </div>

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
      class="mt-5"
      :style="{
        maxWidth: $vuetify.display.smAndDown ? '100%' : $vuetify.display.mdAndDown ? '300px' : '400px',
      }"
      @update:model-value="onSearch"
    />

    <v-data-table
      :page="page"
      :items-per-page="hooks.limit.value"
      :items="departments"
      item-value="name"
      :headers="headers"
      class="mt-3"
      fixed-header
      hover
      :loading="isLoading"
      :items-length="departments.length"
      disable-sort
      :sort-by="[]"
      style="height: calc(100dvh - 240px)"
      @click:row="onRowClick"
      @update:options="onLoadTable"
    >
      <template v-slot:item.created_at="{ item }">
        <span>{{ formatDate(item.created_at, 'HH:mm:ss dd/MM/yyyy') }}</span>
        <p class="text-erp-gray-700">
          Bởi <span class="font-weight-medium text-black">{{ item.created_by?.full_name || 'Hệ thống' }}</span>
        </p>
      </template>

      <template v-slot:bottom>
        <div class="d-flex align-center w-100 pa-2 ga-2">
          <template v-if="!$vuetify.display.smAndDown">
            <span> Số dòng trên 1 trang </span>
            <v-select
              :model-value="hooks.limit.value"
              :items="ITEM_PER_PAGES"
              variant="outlined"
              rounded="lg"
              max-width="90px"
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
            :length="numPages"
            rounded="circle"
            variant="elevated"
            elevation="0"
            size="small"
            :total-visible="$vuetify.display.smAndDown ? 3 : 7"
            active-color="erp-brand"
            border="sm"
            @update:model-value="onPageChange"
          />
        </div>
      </template>
    </v-data-table>

    <v-dialog
      v-model="isCreateDialog"
      max-width="700"
      persistent
    >
      <v-form
        ref="formRef"
        @submit.prevent="onFormSubmit"
      >
        <v-card class="pb-2 pe-2 pt-2">
          <template v-slot:title>
            <div class="d-flex align-center justify-space-between">
              Tạo mới khoa
              <v-btn
                size="small"
                icon="mdi-close"
                variant="outlined"
                class="text-body-2"
                color="grey-darken-1"
                @click="isCreateDialog = false"
              />
            </div>
          </template>

          <div class="ps-6 pe-6 pb-6">
            <CommonDivider label="Tạo mới dữ liệu khoa cho tổ chức của bạn" />

            <v-row>
              <v-col
                cols="12"
                sm="12"
                md="12"
                class="pb-0"
              >
                <v-text-field
                  v-model="createFormPayload.name"
                  placeholder="Nhập tên khoa"
                  :rules="[formRules.required]"
                >
                  <template #label>
                    <span>Tên Khoa <span class="text-red">*</span></span>
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
                  v-model="createFormPayload.code"
                  placeholder="Nhập mã khoa"
                  :rules="[formRules.required]"
                >
                  <template #label>
                    <span>Mã Khoa <span class="text-red">*</span></span>
                  </template>
                </v-text-field>
              </v-col>

              <v-col
                cols="12"
                sm="12"
                md="8"
                class="pb-0"
              >
                <v-select
                  v-model="createFormPayload.dean"
                  label="Trưởng khoa"
                  placeholder="Chọn trưởng khoa"
                  :items="members"
                  :item-title="(item) => item?.full_name"
                  :item-value="(item) => item?.id"
                >
                  <template v-slot:item="{ props: itemProps, item: { raw } }">
                    <v-list-item v-bind="itemProps">
                      <template #prepend>
                        <v-avatar
                          size="48"
                          :image="raw?.avatar"
                          border="sm"
                          :text="raw?.full_name?.charAt(0).toUpperCase()"
                        />
                      </template>
                      <template #title>
                        <div class="d-flex align-center ga-1">
                          <span>{{ raw?.full_name }}</span>
                          <v-icon
                            size="8"
                            class="text-erp-gray-800"
                            style="margin-top: -1px"
                            :color="raw?.is_active ? 'erp-brand' : 'erp-error'"
                          >
                            mdi-circle
                          </v-icon>
                        </div>
                      </template>
                      <template #subtitle>
                        <span>{{ raw?.phone_number || raw?.phone_number }}</span>
                      </template>
                    </v-list-item>
                  </template>
                </v-select>
              </v-col>

              <v-col
                cols="12"
                sm="12"
                md="12"
                class="pb-0"
              >
                <v-textarea
                  v-model="createFormPayload.description"
                  label="Mô tả"
                  placeholder="Nhập mô tả"
                />
              </v-col>
            </v-row>
          </div>

          <div class="d-flex justify-end pe-6 ps-6 pb-4 ga-3">
            <v-btn
              color="pmg-gray-700"
              elevation="0"
              variant="outlined"
              rounded="pill"
              size="large"
              class="flex-grow-1 flex-md-grow-0"
              @click="isCreateDialog = false"
            >
              <template #prepend>
                <v-icon
                  size="20"
                  class="me-n2"
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
              class="flex-grow-1 flex-md-grow-0 border"
              :loading="isCreateLoading"
              :disabled="!hasChanged"
              :class="{
                'border-success': !hasChanged,
              }"
            >
              <template #prepend>
                <Icon
                  name="mdi-plus"
                  size="22"
                  class="me-n2"
                />
              </template>
              <span class="text-body-1">Tạo mới</span>
            </v-btn>
          </div>
        </v-card>
      </v-form>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
  import type { VForm } from 'vuetify/components'
  import type { DataTableHeader, SubmitEventPromise } from 'vuetify'
  import { ITEM_PER_PAGES } from '~/constants/core.constants'
  import type { IDepartmentCreatePayload } from '~/types/department.types'
  import type { IStaff } from '~/types/account.types'
  import { ROUTE_DANH_SACH_KHOA } from '~/constants/route.constants'

  definePageMeta({
    layout: 'default',
    middleware: ['auth'],
  })

  useHead({
    title: 'Danh sách khoa',
  })

  const router = useRouter()
  const isLoading = ref(false)
  const members = ref<IStaff[]>([])
  const { organizationSelected } = useAuth()
  const { onFetchMemberOfOrganizationNoRole } = useStaff()
  const formRef = ref<InstanceType<typeof VForm> | null>(null)

  const { departments, numPages, page, setPage, search, setSearch, ...hooks } = useDepartment()

  const onPageChange = async (value: number) => {
    setPage(value)
    isLoading.value = true
    await hooks.onFetchDepartment(organizationSelected.value?.id)
    isLoading.value = false
  }

  onMounted(async () => {
    members.value = await onFetchMemberOfOrganizationNoRole(organizationSelected.value?.id)
  })

  onMounted(async () => {
    isLoading.value = true
    await hooks.onFetchDepartment(organizationSelected.value?.id)
    isLoading.value = false
  })

  const onSelectItemsPerPage = async (value: number) => {
    setPage(1)
    hooks.setLimit(value)
    isLoading.value = true
    await hooks.onFetchDepartment(organizationSelected.value?.id)
    isLoading.value = false
  }

  const { $toast } = useNuxtApp()

  const hasChanged = ref(false)
  const isCreateDialog = ref(false)
  const isCreateLoading = ref(false)
  const formRules = useFormRules()

  const createFormPayload = ref<IDepartmentCreatePayload>({
    code: '',
    name: '',
    dean: null,
    description: '',
    organization: organizationSelected.value?.id,
  })

  const createFormPayloadJSON = ref(JSON.stringify(createFormPayload.value))

  watch(
    createFormPayload,
    (newValue) => {
      const newValueJSON = JSON.stringify(newValue)
      hasChanged.value = newValueJSON !== createFormPayloadJSON.value
    },
    { immediate: true, deep: true }
  )

  watch(
    () => isCreateDialog.value,
    (newValue) => {
      if (!newValue) {
        formRef.value?.reset()
        formRef.value?.resetValidation()
      }
    },
    { immediate: true }
  )

  const headers = ref<DataTableHeader[]>([
    {
      title: 'Mã khoa',
      key: 'code',
      minWidth: '100px',
      value: (item) => '#' + item?.['code'],
    },
    {
      title: 'Tên khoa',
      key: 'name',
      minWidth: '100px',
    },
    {
      title: 'Trưởng khoa',
      key: 'dean.full_name',
      minWidth: '120px',
    },
    {
      title: 'Số lượng nhân viên',
      key: 'staff_count',
      minWidth: '180px',
    },
    {
      title: 'Số lượng kho',
      key: 'warehouse_count',
      minWidth: '160px',
    },
    {
      title: 'Ngày tạo',
      key: 'created_at',
      minWidth: '180px',
    },
  ])

  const onRowClick = (_: unknown, { item }) => {
    router.push(ROUTE_DANH_SACH_KHOA.DETAIL.pathFunc(item.id))
  }

  function onLoadTable({ page, itemsPerPage, sortBy, ...args }) {}

  async function onFormSubmit(formEvent: SubmitEventPromise) {
    const results = await formEvent
    if (results.valid) {
      let isSuccess = false
      try {
        isCreateLoading.value = true
        await hooks.onCreateDepartment(
          createFormPayload.value,
          async () => {
            isSuccess = true
            isCreateDialog.value = false
            $toast.success('Tạo khoa thành công', {
              description: 'Khoa đã được tạo thành công',
            })
          },
          (error) => {
            $toast.error('Tạo khoa thất bại', {
              description: error,
            })
          }
        )
      } catch {
        $toast.error('Thất bại', {
          description: 'Hệ thống gặp sự cố, vui lòng thử lại sau',
        })
      } finally {
        isCreateLoading.value = false
      }

      if (isSuccess) {
        isLoading.value = true
        await hooks.onFetchDepartment(organizationSelected.value?.id)
        isLoading.value = false
        members.value = await onFetchMemberOfOrganizationNoRole(organizationSelected.value?.id)
      }
    }
  }

  const onSearch = useDebounce(async (value: string) => {
    setPage(1)
    setSearch(value)
    isLoading.value = true
    await hooks.onFetchDepartment(organizationSelected.value?.id)
    isLoading.value = false
  }, 1000)
</script>

<style scoped lang="scss"></style>
