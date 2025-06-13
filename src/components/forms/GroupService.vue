<template>
  <v-dialog
    v-if="props.visible"
    :model-value="props.visible"
    max-width="1287"
    persistent
  >
    <v-form validate-on="submit">
      <v-card class="pb-6 pt-2">
        <template v-slot:title>
          <div class="d-flex align-center justify-space-between">
            {{ labelCreate }}
            <v-btn
              size="x-small"
              icon="mdi-close"
              variant="outlined"
              class="text-body-2"
              color="grey-darken-1"
              @click="isCreate && !props.isNew ? (isCreate = false) : formEmit('close')"
            />
          </div>
        </template>

        <template v-if="!isCreate && !props.isNew">
          <CommonDivider
            :label="subLabelCreate"
            class="ms-6 me-6"
          />
          <v-tabs
            v-model="tabActive"
            class="pt-2 pb-2"
            show-arrows
            hide-slider
            bg-color="erp-gray-300"
            height="59"
            selected-class="bg-white border rounded-xl border-opacity-25"
            density="compact"
            style="min-height: 59px"
          >
            <v-tab
              v-for="tab in tabs"
              :key="tab.name"
              :text="tab.label"
              :value="tab.name"
              height="100%"
              class="rounded-xl border border-opacity-0 ps-4 pe-4 text-body-2"
            />
          </v-tabs>
        </template>

        <div class="ps-6 pe-6">
          <template v-if="!isCreate && !props.isNew">
            <v-tabs-window v-model="tabActive">
              <v-tabs-window-item
                v-for="(item, index) in tabs"
                :key="index"
                :value="item.name"
              >
                <div class="mt-5 mb-4 d-flex align-center justify-space-between">
                  <v-text-field
                    :model-value="groupService[tabActive]?.search"
                    prepend-inner-icon="mdi-magnify"
                    label="Tìm kiếm"
                    variant="outlined"
                    single-line
                    placeholder="Nhập từ khóa"
                    rounded="pill"
                    bg-color="grey-lighten-5"
                    hide-details
                    density="comfortable"
                    :style="{
                      maxWidth: $vuetify.display.smAndDown ? '100%' : $vuetify.display.mdAndDown ? '300px' : '400px',
                    }"
                    @update:model-value="onSearch"
                  />
                  <v-btn
                    icon="mdi-plus"
                    variant="outlined"
                    class="text-h6"
                    color="grey-darken-1"
                    @click="isCreate = true"
                  />
                </div>
                <v-data-table
                  :model-value:page="groupService[item.name]?.page"
                  :model-value:items-per-page="groupService[item.name]?.itemsPerPage"
                  :items="groupService[item.name]?.items || []"
                  :items-length="groupService[item.name]?.count || 0"
                  :headers="headers"
                  class="mt-3"
                  fixed-header
                  hover
                  :loading="groupService[item.name]?.loading || false"
                  disable-sort
                  style="min-height: 50dvh"
                >
                  <template v-slot:bottom>
                    <div class="d-flex align-center w-100 pa-2 ga-2 mt-4">
                      <template v-if="!$vuetify.display.smAndDown && groupService[item.name]">
                        <span> Số dòng trên 1 trang </span>
                        <v-select
                          v-model="groupService[item.name].itemsPerPage"
                          :items="ITEM_PER_PAGES"
                          variant="outlined"
                          rounded="lg"
                          max-width="100px"
                          hide-details
                          density="compact"
                          @update:model-value="onSelectItemsPerPage"
                        />
                        <span>
                          Trong tổng số: <strong>{{ groupService[item.name].count }}</strong> bản ghi
                        </span>
                      </template>
                      <v-spacer />
                      <v-pagination
                        :model-value="groupService[item.name]?.page"
                        :length="groupService[item.name]?.num_pages"
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
              </v-tabs-window-item>
            </v-tabs-window>
          </template>
          <template v-else>
            <v-form @submit.prevent="onSubmit">
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                  lg="6"
                  class="pb-0"
                >
                  <v-text-field
                    v-model="formPayload.name"
                    label="Tên"
                    placeholder="Nhập tên"
                  >
                    <template #label>
                      <span> Tên <span class="text-red-darken-3">*</span> </span>
                    </template>
                  </v-text-field>
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                  lg="6"
                  class="pb-0"
                >
                  <v-text-field
                    v-model="formPayload.code"
                    label="Mã"
                    placeholder="Nhập mã"
                  >
                    <template #label>
                      <span> Mã <span class="text-red-darken-3">*</span> </span>
                    </template>
                  </v-text-field>
                </v-col>

                <v-col
                  cols="12"
                  md="12"
                  lg="12"
                  class="pb-0"
                >
                  <v-textarea
                    v-model="formPayload.description"
                    label="Ghi chú"
                    placeholder="Nhập ghi chú"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="12"
                  lg="12"
                  class="pb-0"
                >
                  <div
                    v-if="isCreate"
                    class="d-flex justify-end ga-3 mb-4"
                  >
                    <v-btn
                      color="pmg-gray-700"
                      elevation="0"
                      variant="outlined"
                      rounded="pill"
                      size="large"
                      class="flex-grow-1 flex-md-grow-0"
                      @click="isCreate && !props.isNew ? (isCreate = false) : formEmit('close')"
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
                      color="erp-brand"
                      elevation="0"
                      variant="elevated"
                      rounded="pill"
                      type="submit"
                      size="large"
                      class="flex-grow-1 flex-md-grow-0"
                      :loading="isLoadingCreate"
                    >
                      <template #prepend>
                        <v-icon
                          size="20"
                          class="me-n1"
                        >
                          mdi-plus
                        </v-icon>
                      </template>
                      <span class="text-body-1">Tạo mới</span>
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-form>
          </template>
        </div>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup lang="ts">
  import type { DataTableHeader, SubmitEventPromise } from 'vuetify'
  import { ITEM_PER_PAGES, MEDICAL_PRODUCT_TYPES } from '~/constants/core.constants'
  import type { IGroupService, IGroupServiceFormPayload, IGroupServiceType } from '~/types/core.types'

  const { selectedMedicalProductType } = useAuth()

  const currentLabelMedicalProduct = computed(() => {
    return MEDICAL_PRODUCT_TYPES.find((item) => item.value === selectedMedicalProductType.value)?.label.toLowerCase()
  })

  const formEmit = defineEmits<{
    (e: 'close'): void
    (e: 'success', data: IGroupService): void
  }>()

  const props = withDefaults(
    defineProps<{
      visible: boolean
      isNew?: boolean
      type?: IGroupServiceType | null
    }>(),
    {
      visible: false,
      isNew: false,
      type: null,
    }
  )

  const hooks = useGroupService()

  const isCreate = ref(false)
  const tabActive = ref<IGroupServiceType>('NHOM_HANG_HOA')

  watch(
    () => props.visible,
    () => {
      if (props.visible) {
        isCreate.value = false
        groupService.value = {}
        onFetchService()
      }
    }
  )

  watchEffect(() => {
    if (props.type) {
      tabActive.value = props.type
    }
    isCreate.value = props.isNew
  })

  const tabs = computed(() => {
    return [
      {
        name: 'NHOM_HANG_HOA',
        label: `Nhóm ${currentLabelMedicalProduct.value}`,
        type: ['THUOC', 'VAT_TU', 'HOA_CHAT'],
      },
      {
        name: 'HOAT_CHAT',
        label: 'Hoạt chất',
        type: ['THUOC', 'HOA_CHAT'],
      },
      {
        name: 'DON_VI_TINH',
        label: 'Đơn vị tính',
        type: ['THUOC', 'VAT_TU', 'HOA_CHAT'],
      },
      {
        name: 'DUONG_DUNG',
        label: 'Đường dùng',
        type: ['THUOC', 'HOA_CHAT'],
      },
      {
        name: 'CONG_TY_DANG_KY',
        label: 'Công ty đăng ký',
        type: ['THUOC', 'VAT_TU', 'HOA_CHAT'],
      },
      {
        name: 'QUOC_GIA',
        label: 'Nước sản xuất',
        type: ['THUOC', 'VAT_TU', 'HOA_CHAT'],
      },
      {
        name: 'NHA_SAN_XUAT',
        label: 'Nhà sản xuất',
        type: ['THUOC', 'VAT_TU', 'HOA_CHAT'],
      },
      {
        name: 'DANG_BAO_CHE',
        label: 'Dạng bào chế',
        type: ['THUOC', 'HOA_CHAT'],
      },
      {
        name: 'PHAN_LOAI_HANG_HOA',
        label: `Phân loại ${currentLabelMedicalProduct.value}`,
        type: ['THUOC', 'VAT_TU', 'HOA_CHAT'],
      },
      {
        name: 'PHAN_LOAI_CSKCB',
        label: 'Phân loại CSKCB',
        type: ['THUOC', 'VAT_TU', 'HOA_CHAT'],
      },
      {
        name: 'CSKCB',
        label: 'Tên CSKCB',
        type: ['THUOC', 'VAT_TU', 'HOA_CHAT'],
      },
      {
        name: 'LOAI_BENH_AN',
        label: 'Loại bệnh án',
        type: ['THUOC', 'VAT_TU', 'HOA_CHAT'],
      },
      {
        name: 'LOAI_THANH_TOAN',
        label: 'Loại thanh toán',
        type: ['THUOC', 'VAT_TU', 'HOA_CHAT'],
      },
      {
        name: 'PHU_THU_BHYT',
        label: 'Phụ thu Bảo Hiểm',
        type: ['THUOC', 'VAT_TU', 'HOA_CHAT'],
      },
      {
        name: 'DON_VI_THAU',
        label: 'Đơn vị thầu',
        type: ['THUOC', 'VAT_TU', 'HOA_CHAT'],
      },
    ].filter((item) => item.type.includes(selectedMedicalProductType.value))
  })

  const formPayload = ref<IGroupServiceFormPayload>({
    name: '',
    code: '',
    description: '',
    type: selectedMedicalProductType.value,
    group_type: tabActive.value,
  })

  const currentLabel = computed(() => {
    return tabs.value.find((tab) => tab.name === tabActive.value)?.label?.toLowerCase()
  })

  const labelCreate = computed(() => {
    return isCreate.value ? `Tạo mới ${currentLabel.value}` : `Cấu hình ${currentLabel.value}`
  })

  const subLabelCreate = computed(() => {
    return isCreate.value
      ? `Tạo mới dữ liệu ${currentLabel.value} cho tổ chức của bạn`
      : `Cấu hình dữ liệu quản lý ${currentLabel.value} cho tổ chức của bạn`
  })

  const groupServiceHooks = useGroupService()

  const groupService = ref<{
    [x in IGroupServiceType]?: {
      type?: string
      search?: string
      loading: boolean
      page: number
      count: number
      num_pages: number
      itemsPerPage: number
      items: IGroupService[]
    }
  }>({})

  const headers = ref<DataTableHeader[]>([
    {
      title: 'Mã',
      key: 'code',
      value: (v: IGroupService) => v.code || 'Không có dữ liệu',
      width: 200,
    },
    {
      title: 'Tên',
      key: 'name',
      value: (v: IGroupService) => v.name || 'Không có dữ liệu',
      width: 280,
    },
    {
      title: 'Số lượng thuốc/vật tư',
      key: 'item_count',
      value: (v: IGroupService) => v?.['item_count'] || 'Không có dữ liệu',
    },
    {
      title: 'Ghi chú',
      key: 'description',
      value: (v: IGroupService) => v.description || 'Không có dữ liệu',
      width: 280,
    },
    {
      title: 'Thời gian tạo',
      key: 'created_at',
      value: (v: IGroupService) => v.created_at || 'Không có dữ liệu',
    },
    {
      title: 'Thao tác',
      key: 'action',
    },
  ])

  const onFetchService = async () => {
    if (!Object.keys(groupService.value).includes(tabActive.value)) {
      groupService.value[tabActive.value] = {
        type: selectedMedicalProductType.value,
        search: '',
        loading: false,
        items: [],
        page: 1,
        count: 0,
        num_pages: 0,
        itemsPerPage: 5,
      }
    }

    const itemsCount = groupService.value[tabActive.value].items.length
    const currentType = groupService.value[tabActive.value]?.type
    const totalCount = groupService.value[tabActive.value].count

    if (totalCount > 0 && totalCount >= itemsCount && currentType === selectedMedicalProductType.value) {
      return
    }

    groupService.value[tabActive.value].loading = true
    groupService.value[tabActive.value].type = selectedMedicalProductType.value
    const result = await groupServiceHooks.onFetchGroupServiceAutocomplete(
      groupService.value[tabActive.value].page,
      tabActive.value,
      groupService.value[tabActive.value].itemsPerPage
    )
    groupService.value[tabActive.value].items = [...groupService.value[tabActive.value].items, ...result.items]
    groupService.value[tabActive.value].num_pages = result.num_pages
    groupService.value[tabActive.value].count = result.count
    groupService.value[tabActive.value].loading = false
  }

  const onSelectItemsPerPage = async (value: number) => {
    if (Object.keys(groupService.value).includes(tabActive.value)) {
      groupService.value[tabActive.value].page = 1
      groupService.value[tabActive.value].loading = true
      groupService.value[tabActive.value].itemsPerPage = value
      groupService.value[tabActive.value].type = selectedMedicalProductType.value
      const result = await groupServiceHooks.onFetchGroupServiceAutocomplete(
        groupService.value[tabActive.value].page,
        tabActive.value,
        groupService.value[tabActive.value].itemsPerPage
      )
      groupService.value[tabActive.value].items = result.items
      groupService.value[tabActive.value].num_pages = result.num_pages
      groupService.value[tabActive.value].count = result.count
      groupService.value[tabActive.value].loading = false
    }
  }

  watch(
    () => tabActive.value,
    async () => {
      formPayload.value = {
        name: '',
        code: '',
        description: '',
        type: selectedMedicalProductType.value,
        group_type: tabActive.value,
      }
      if (Object.keys(groupService.value).includes(tabActive.value)) {
        groupService.value[tabActive.value].search = ''
      }
      await onFetchService()
    }
  )

  const { $toast } = useNuxtApp()
  const isLoadingCreate = ref(false)

  const onSubmit = async (formEvent: SubmitEventPromise) => {
    const results = await formEvent
    if (results.valid) {
      isLoadingCreate.value = true
      if (Object.keys(groupService.value).includes(tabActive.value)) {
        try {
          formPayload.value.type = selectedMedicalProductType.value
          await hooks.onCreateGroupService(
            formPayload.value,
            async (groupServiceData) => {
              formEmit('success', groupServiceData)
              if (!props.isNew) {
                groupService.value[tabActive.value].page = 1
                groupService.value[tabActive.value].loading = true
                groupService.value[tabActive.value].search = ''
                const result = await groupServiceHooks.onFetchGroupServiceAutocomplete(
                  groupService.value[tabActive.value].page,
                  tabActive.value,
                  groupService.value[tabActive.value].itemsPerPage,
                  groupService.value[tabActive.value].search
                )
                groupService.value[tabActive.value].items = result.items
                groupService.value[tabActive.value].num_pages = result.num_pages
                groupService.value[tabActive.value].count = result.count
                groupService.value[tabActive.value].loading = false
              }
              formPayload.value = {
                name: '',
                code: '',
                description: '',
                type: selectedMedicalProductType.value,
                group_type: tabActive.value,
              }
              $toast.success('Tạo mới thành công', {
                description: `Dữ liệu ${currentLabel.value} đã được tạo thành công`,
              })
            },
            (error) => {
              $toast.error('Tạo mới thất bại', {
                description: error || `Hệ thống đã xảy ra lỗi, vui lòng thử lại sau`,
              })
            }
          )
        } catch (error) {
          $toast.error('Tạo mới thất bại', {
            description: `Hệ thống đã xảy ra lỗi, vui lòng thử lại sau`,
          })
        } finally {
          isLoadingCreate.value = false
          isCreate.value = false
        }
      }
    }
  }

  const onSearch = useDebounce(async (value: string) => {
    if (Object.keys(groupService.value).includes(tabActive.value)) {
      groupService.value[tabActive.value].page = 1
      groupService.value[tabActive.value].search = value
      groupService.value[tabActive.value].loading = true
      const result = await groupServiceHooks.onFetchGroupServiceAutocomplete(
        groupService.value[tabActive.value].page,
        tabActive.value,
        groupService.value[tabActive.value].itemsPerPage,
        value
      )
      groupService.value[tabActive.value].items = result.items
      groupService.value[tabActive.value].num_pages = result.num_pages
      groupService.value[tabActive.value].count = result.count
      groupService.value[tabActive.value].loading = false
    }
  }, 1000)
</script>
