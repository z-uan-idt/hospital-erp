<template>
  <v-container
    class="erp-danh-sach-khoa pa-6"
    fluid
  >
    <div class="d-flex align-center flex-row justify-space-between ga-4">
      <div class="d-flex align-center justify-start ga-3 w-100 w-md-auto">
        <h1 :class="['text-lg-h5 text-h6 font-weight-medium', 'text-blue-grey-darken-3']">
          Danh sách khoa
        </h1>
      </div>

      <div class="action-buttons d-flex align-center ga-2">
        <v-btn
          icon
          variant="outlined"
          color="erp-gray"
          size="x-small"
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
          size="x-small"
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
          size="x-small"
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
      prepend-inner-icon="mdi-magnify"
      label="Tìm kiếm"
      variant="outlined"
      single-line
      placeholder="Nhập từ khóa"
      rounded="pill"
      bg-color="grey-lighten-5"
      hide-details
      density="compact"
      class="mt-5"
      :style="{
        maxWidth: $vuetify.display.smAndDown
          ? '100%'
          : $vuetify.display.mdAndDown
            ? '300px'
            : '400px',
      }"
    />

    <v-data-table
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      :items="departments"
      item-value="name"
      :headers="headers"
      class="mt-3"
      fixed-header
      hover
      :loading="isLoading"
      :items-length="departments.length"
      disable-sort
      style="height: calc(100dvh - 240px)"
      @click:row="onRowClick"
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
              :items="ITEM_PER_PAGES"
              variant="outlined"
              rounded="lg"
              max-width="90px"
              hide-details
              density="compact"
            />
            <span>
              Trong tổng số: <strong>{{ departments.length }}</strong> bản ghi
            </span>
          </template>
          <v-spacer />
          <v-pagination
            v-model="page"
            :length="Math.ceil(departments.length / itemsPerPage)"
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
                size="x-small"
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
                  :items="[]"
                />
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
  import { ITEM_PER_PAGE, ITEM_PER_PAGES } from '~/constants/core.constants'
  import type { IDepartmentCreatePayload } from '~/types/department.types'

  definePageMeta({
    layout: 'default',
    middleware: ['auth'],
    keepalive: true,
  })

  useHead({
    title: 'Danh sách khoa',
  })

  const page = ref(1)
  const router = useRouter()
  const isLoading = ref(false)
  const itemsPerPage = ref(ITEM_PER_PAGE)
  const formRef = ref<InstanceType<typeof VForm> | null>(null)
  const sortableColumns = ['staff_count', 'warehouse_count', 'created_at']

  const search = ref('')
  const hasChanged = ref(false)
  const isCreateDialog = ref(false)
  const isCreateLoading = ref(false)
  const formRules = useFormRules()

  const createFormPayload = ref<IDepartmentCreatePayload>({
    code: '',
    name: '',
    dean: null,
    description: '',
  })

  const createFormPayloadJSON = ref(JSON.stringify(createFormPayload.value))

  watch(
    createFormPayload,
    (newValue) => {
      const newValueJSON = JSON.stringify(newValue)
      hasChanged.value = newValueJSON !== createFormPayloadJSON.value
    },
    { deep: true }
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
    },
    {
      title: 'Tên khoa',
      key: 'name',
      minWidth: '100px',
    },
    {
      title: 'Trưởng khoa',
      key: 'dean',
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

  const departments = ref(
    Array.from({ length: 1000 }, (_, index) => ({
      id: index + 1,
      code: `KHOA_${index + 1}`,
      name: `Khoa ${index + 1}`,
      dean: `Nguyễn Văn ${index + 1}`,
      staff_count: Math.floor(Math.random() * 100),
      warehouse_count: Math.floor(Math.random() * 10),
      created_at: new Date().toISOString(),
    }))
  )

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

  const onRowClick = (_: unknown, { item }) => {
    router.push(`/quan-tri-tong/danh-sach-khoa/${item.id}`)
  }

  function onLoadTable({ page, itemsPerPage, sortBy, ...args }) {
    console.log(page, itemsPerPage, sortBy, args)
  }

  async function onFormSubmit(formEvent: SubmitEventPromise) {
    const results = await formEvent
    console.log(results)
  }
</script>

<style scoped lang="scss"></style>
