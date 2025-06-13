<template>
  <v-dialog
    :model-value="props.visible"
    max-width="900"
    persistent
  >
    <v-form
      validate-on="submit"
      @submit.prevent="onFormSubmit"
    >
      <v-card class="pb-2 pe-2 pt-2">
        <template v-slot:title>
          <div class="d-flex align-center justify-space-between">
            {{
              props.active === 'search'
                ? 'Gửi lời mời gia nhập tổ chức'
                : props.staff
                  ? 'Chỉnh sửa thông tin nhân viên'
                  : 'Xét duyệt yêu cầu gia nhập'
            }}
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
            <CommonDivider
              :label="
                props.staff
                  ? 'Chỉnh sửa thông tin nhân viên làm việc trong tổ chức'
                  : 'Thêm tài khoản vào làm nhân viên trong tổ chức của bạn'
              "
            />
          </div>

          <div
            v-if="tabActive === 'search' || accountSearch"
            class="ps-4 pe-4 pt-2"
            :class="!accountSearch ? 'mb-6' : 'mb-0'"
          >
            <v-text-field
              v-model="search"
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              @update:model-value="onSearch"
            >
              <template #label>
                <span> Số điện thoại </span>
                <span class="text-red"> * </span>
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
                  :class="accountSearch ? 'text-green-darken-1' : 'text-red-darken-1'"
                  size="24"
                >
                  {{ accountSearch ? 'mdi-check-circle' : 'mdi-close' }}
                </v-icon>
              </template>
            </v-text-field>
          </div>

          <div
            v-if="accountSearch"
            class="ps-5 pe-5 mb-n3"
          >
            <CommonDivider label="Kết quả tìm kiếm" />
          </div>

          <v-card
            v-if="tabActive === 'accept' || accountSearch"
            class="pa-0"
            elevation="0"
          >
            <template #prepend>
              <v-avatar
                size="46"
                variant="outlined"
                color="grey-darken-4"
                class="text-body-1 text-black"
                :image="(props?.account || accountSearch || props?.staff)?.avatar"
                :text="(props?.account || accountSearch || props?.staff)?.full_name.charAt(0).toUpperCase()"
              />
            </template>
            <template #title>
              <div class="d-flex align-center ga-1 mt-1">
                <span class="text-body-1 font-weight-medium">{{
                  (props?.account || accountSearch || props?.staff)?.full_name
                }}</span>
                <v-icon
                  size="8"
                  class="text-erp-gray-800"
                  style="margin-top: -1px"
                  :color="(props?.account || accountSearch || props?.staff)?.is_active ? 'erp-brand' : 'erp-error'"
                >
                  mdi-circle
                </v-icon>
              </div>
            </template>
            <template
              v-if="(props?.account || accountSearch || props?.staff)?.phone_number"
              #subtitle
            >
              <span class="text-body-2 text-erp-gray-700">{{
                (props?.account || accountSearch || props?.staff)?.phone_number
              }}</span>
            </template>
            <div
              v-if="tabActive === 'accept'"
              class="text-body-2 text-erp-gray-700 ps-5 pb-3"
            >
              {{
                props?.staff?.joined_at
                  ? `Đã tham gia lúc: ${formatDate(props?.staff?.joined_at, 'HH:mm:ss dd/MM/yyyy')}`
                  : `Đã yêu cầu lúc: ${formatDate(props?.account?.requested_at, 'HH:mm:ss dd/MM/yyyy')}`
              }}
            </div>

            <div
              v-if="tabActive === 'accept' || accountSearch"
              class="ps-5 pe-5 pt-3"
            >
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
                  v-model="acceptFormPayload.department"
                  :loading="isLoadingDepartmentDropdown"
                  clearable
                  label="Khoa"
                  placeholder="Chọn khoa"
                  :rules="[rules.required]"
                  :items="departmentsDropdown"
                  item-title="name"
                  item-value="id"
                  @update:model-value="onFetchDepartmentRelationshipDropdown"
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
                  v-model="acceptFormPayload.warehouse"
                  :loading="isLoadingRelationshipDropdown"
                  clearable
                  label="Kho trực thuộc"
                  placeholder="Chọn kho trực thuộc"
                  :items="warehousesDropdown"
                  item-title="name"
                  item-value="id"
                  :disabled="!acceptFormPayload.department"
                />
              </v-col>

              <v-col
                cols="12"
                sm="12"
                md="12"
                class="pb-0"
              >
                <v-select
                  v-model="acceptFormPayload.role"
                  :loading="isLoadingRelationshipDropdown"
                  clearable
                  label="Chức vụ"
                  placeholder="Chọn chức vụ"
                  variant="outlined"
                  :items="rolePermissionsDropdown"
                  item-title="name"
                  item-value="id"
                  :disabled="!acceptFormPayload.department"
                />
              </v-col>

              <v-col
                cols="12"
                sm="12"
                md="4"
                class="pb-0"
              >
                <v-text-field
                  v-model="acceptFormPayload.staff_code"
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
                  v-model="acceptFormPayload.phone_number"
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
                  v-model="acceptFormPayload.email"
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
                size="20"
                class="me-n1"
              >
                mdi-close
              </v-icon>
            </template>
            <span class="text-body-1">Hủy bỏ</span>
          </v-btn>

          <v-btn
            v-if="tabActive === 'search'"
            type="submit"
            color="erp-brand"
            elevation="0"
            rounded="pill"
            size="large"
            :disabled="!hasChanged"
            class="flex-grow-1 flex-md-grow-0 border border-success"
            :loading="isLoading"
          >
            <template #prepend>
              <Icon
                name="custom:paper-plane"
                size="18"
                class="me-n1"
              />
            </template>
            <span class="text-body-1">Gửi lời mời</span>
          </v-btn>
          <v-btn
            v-if="tabActive === 'accept'"
            type="submit"
            color="erp-brand"
            elevation="0"
            rounded="pill"
            size="large"
            :disabled="!hasChanged"
            class="flex-grow-1 flex-md-grow-0"
            :loading="isLoading"
          >
            <template #prepend>
              <v-icon
                size="22"
                class="me-n1"
                color="white"
              >
                mdi-check
              </v-icon>
            </template>
            <span class="text-body-1">{{ props.staff ? 'Cập nhật' : 'Xét duyệt' }}</span>
          </v-btn>
        </div>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup lang="ts">
  import type { SubmitEventPromise } from 'vuetify'
  import type { IBasicAccount, IStaff } from '~/types/account.types'
  import type { IBasicDepartment, IBasicRolePermission } from '~/types/department.types'
  import type { IBasicWarehouse } from '~/types/response.types'

  type Props = {
    visible: boolean
    active?: 'search' | 'accept'
    account?: IBasicAccount
    staff?: IStaff
  }

  const props = withDefaults(defineProps<Props>(), {
    visible: false,
  })
  const requestEmit = defineEmits<{
    (e: 'success'): void
    (e: 'close'): void
  }>()

  const rules = useFormRules()
  const { $toast } = useNuxtApp()
  const { organizationSelected } = useAuth()
  const { organization, ...hooks } = useOrganization()
  const tabActive = ref<'search' | 'accept'>('search')

  const departmentsDropdown = ref<IBasicDepartment[]>([])
  const warehousesDropdown = ref<IBasicWarehouse[]>([])
  const rolePermissionsDropdown = ref<IBasicRolePermission[]>([])

  const acceptFormPayload = ref<{
    account: number | null
    department: number | null
    warehouse: number | null
    role: number | null
    organization: number | null
    staff_code: string | null
    phone_number: string | null
    email: string | null
    current_warehouse_id?: number | null
    current_department_id?: number | null
  }>({
    account: props.account?.id,
    department: null,
    warehouse: null,
    role: null,
    organization: organizationSelected.value?.id,
    staff_code: '',
    phone_number: '',
    email: '',
    current_warehouse_id: null,
    current_department_id: null,
  })

  const isLoadingDepartmentDropdown = ref<boolean>(false)
  const isLoadingRelationshipDropdown = ref<boolean>(false)

  const acceptFormPayloadJson = ref<string>(JSON.stringify(acceptFormPayload.value))

  const hasChanged = computed(() => {
    return acceptFormPayloadJson.value !== JSON.stringify(acceptFormPayload.value)
  })

  const { onFetchDepartmentDropdown, onFetchRolePermissionDropdown } = useDepartment()
  const {
    onAcceptRequestJoinOrganization,
    onFindExactByPhoneNumberWithoutCurrentOrganization,
    onInviteRequestJoinOrganization,
  } = useOrganization()
  const { onFetchWarehouseDropdown } = useWarehouse()

  const onFetchDepartmentRelationshipDropdown = async (departmentId: string | number) => {
    warehousesDropdown.value = []
    rolePermissionsDropdown.value = []
    acceptFormPayload.value.role = null
    acceptFormPayload.value.warehouse = null
    isLoadingRelationshipDropdown.value = false
    isLoadingDepartmentDropdown.value = false
    if (departmentId) {
      isLoadingRelationshipDropdown.value = true
      onFetchWarehouseDropdown(departmentId)
        .then((res) => {
          warehousesDropdown.value = res
        })
        .finally(() => {
          isLoadingRelationshipDropdown.value = false
        })
      isLoadingRelationshipDropdown.value = true
      onFetchRolePermissionDropdown(departmentId)
        .then((res) => {
          rolePermissionsDropdown.value = res
        })
        .finally(() => {
          isLoadingRelationshipDropdown.value = false
        })
    }
  }

  const search = ref<string>('')
  const isLoading = ref<boolean>(false)
  const isHandleSearch = ref<boolean>(false)
  const isSearchLoading = ref<boolean>(false)
  const accountSearch = ref<IBasicAccount | null>(null)

  const onSearch = useDebounce(async () => {
    isHandleSearch.value = false
    isSearchLoading.value = true
    const searchValue = search.value.trim()
    if (searchValue) {
      accountSearch.value = await onFindExactByPhoneNumberWithoutCurrentOrganization(
        organizationSelected.value?.id,
        search.value
      )
      acceptFormPayload.value.account = accountSearch.value?.id
      acceptFormPayload.value.phone_number = accountSearch.value?.phone_number
    } else {
      accountSearch.value = null
    }
    isHandleSearch.value = !!searchValue
    isSearchLoading.value = false
  }, 1000)

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
    async (value) => {
      if (value) {
        isLoadingDepartmentDropdown.value = true
        departmentsDropdown.value = await onFetchDepartmentDropdown(organizationSelected.value?.id)
        isLoadingDepartmentDropdown.value = false
      }
    }
  )

  watch(
    () => props.visible,
    (value) => {
      if (!value) {
        search.value = ''
        isLoading.value = false
        organization.value = null
        accountSearch.value = null
        isHandleSearch.value = false
        isSearchLoading.value = false
        if (!props.staff) {
          acceptFormPayload.value.account = null
          acceptFormPayload.value.phone_number = null
          acceptFormPayload.value.department = null
          acceptFormPayload.value.warehouse = null
          acceptFormPayload.value.role = null
          acceptFormPayload.value.staff_code = null
        }
      } else {
        if (props.staff) {
          acceptFormPayload.value = {
            account: props.staff.id,
            department: props.staff?.department?.id,
            warehouse: props.staff?.warehouse?.id,
            role: props.staff?.role?.id,
            organization: organizationSelected?.value?.id,
            staff_code: props.staff?.staff_code,
            phone_number: props.staff.phone_number,
            email: props.staff.email,
            current_warehouse_id: props.staff?.warehouse.id,
            current_department_id: props.staff?.department.id,
          }
          if (props.staff?.department) {
            if (departmentsDropdown.value.filter((item) => item.id === props.staff?.department?.id).length === 0) {
              if (props.staff?.department?.id) {
                departmentsDropdown.value = [props.staff?.department, ...departmentsDropdown.value]
              } else {
                departmentsDropdown.value = departmentsDropdown.value
              }
            }
            isLoadingRelationshipDropdown.value = true
            onFetchWarehouseDropdown(props.staff?.department?.id)
              .then((res) => {
                warehousesDropdown.value = res
                if (warehousesDropdown.value.filter((item) => item.id === props.staff?.warehouse?.id).length === 0) {
                  if (props.staff?.warehouse?.id) {
                    warehousesDropdown.value = [props.staff?.warehouse, ...warehousesDropdown.value]
                  } else {
                    warehousesDropdown.value = warehousesDropdown.value
                  }
                }
              })
              .finally(() => {
                isLoadingRelationshipDropdown.value = false
              })
            isLoadingRelationshipDropdown.value = true
            onFetchRolePermissionDropdown(props.staff?.department?.id)
              .then((res) => {
                rolePermissionsDropdown.value = res
                if (rolePermissionsDropdown.value.filter((item) => item.id === props.staff?.role?.id).length === 0) {
                  if (props.staff?.role?.id) {
                    rolePermissionsDropdown.value = [props.staff?.role, ...rolePermissionsDropdown.value]
                  } else {
                    rolePermissionsDropdown.value = rolePermissionsDropdown.value
                  }
                }
              })
              .finally(() => {
                isLoadingRelationshipDropdown.value = false
              })
          }
        } else {
          acceptFormPayload.value.account = props.account?.id
          acceptFormPayload.value.phone_number = props.account?.phone_number
          acceptFormPayload.value.organization = organizationSelected.value?.id
        }
      }
    }
  )

  const onFormSubmit = async (formEvent: SubmitEventPromise) => {
    const results = await formEvent
    if (results.valid) {
      try {
        isLoading.value = true
        const formData = new FormData()
        Object.entries(acceptFormPayload.value).forEach(([key, value]) => {
          if (value) {
            formData.append(key, value as string)
          }
        })
        if (tabActive.value === 'accept' && !props.staff) {
          await onAcceptRequestJoinOrganization(
            formData,
            () => {
              requestEmit('success')
              $toast.success('Thông báo', {
                description: 'Đã xét duyệt yêu cầu gia nhập',
              })
            },
            (error) => {
              $toast.error('Thông báo', {
                description: error || 'Hệ thống gặp sự cố, vui lòng thử lại sau',
              })
            }
          )
        } else if (tabActive.value === 'accept' && props.staff) {
          await hooks.onUpdateStaffOrganization(
            formData,
            () => {
              requestEmit('success')
              $toast.success('Thông báo', {
                description: 'Đã cập nhật thông tin nhân viên',
              })
            },
            (error) => {
              $toast.error('Thông báo', {
                description: error || 'Hệ thống gặp sự cố, vui lòng thử lại sau',
              })
            }
          )
        } else {
          await onInviteRequestJoinOrganization(
            formData,
            () => {
              requestEmit('success')
              $toast.success('Thông báo', {
                description: `Đã gửi lời mời gia nhập tới ${accountSearch.value?.phone_number}`,
              })
            },
            (error) => {
              $toast.error('Thông báo', {
                description: error || 'Hệ thống gặp sự cố, vui lòng thử lại sau',
              })
            }
          )
        }
      } catch {
        $toast.error('Thông báo', {
          description: 'Hệ thống gặp sự cố, vui lòng thử lại sau',
        })
      } finally {
        isLoading.value = false
      }
    }
  }
</script>
