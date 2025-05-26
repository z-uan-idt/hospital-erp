<template>
  <div class="erp-nhan-vien pa-6">
    <div class="d-flex align-center flex-row justify-space-between ga-4">
      <div class="d-flex align-center justify-start ga-3 w-100 w-md-auto">
        <v-btn
          icon="mdi-chevron-left"
          variant="outlined"
          color="erp-gray-700"
          class="text-body-1 font-weight-medium"
          size="x-small"
        />
        <h1
          :class="[
            'text-lg-h5 text-h6 font-weight-medium',
            'text-blue-grey-darken-3',
          ]"
        >
          Nhân viên
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
      :items="departments"
      item-value="name"
      :headers="headers"
      class="mt-3"
      fixed-header
      hover
      disable-sort
      style="max-height: calc(100dvh - 240px)"
    >
      <template
        v-for="header in ['staff_count', 'warehouse_count', 'created_at']"
        v-slot:[`header.${header}`]="{ column }"
      >
        <div
          v-if="header"
          class="d-flex align-center ga-2 cursor-pointer"
          :key="header"
          @click="sortBy(column)"
        >
          <span>{{ column.title }}</span>
          <v-icon
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
        </div>
      </template>

      <template v-slot:item.created_at="{ item }">
        {{ formatDate(item.created_at, 'HH:mm:ss dd/MM/yyyy') }}
      </template>

      <template v-slot:bottom>
        <div class="d-flex align-center w-100 pa-2">
          <v-spacer />
          <v-pagination
            :model-value="1"
            :length="10"
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
  </div>
</template>

<script setup lang="ts">
  import type { DataTableHeader } from 'vuetify'

  definePageMeta({
    layout: 'default',
    middleware: ['auth'],
    keepalive: true,
  })

  useHead({
    title: 'Danh sách khoa',
  })

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
    Array.from({ length: 100 }, (_, index) => ({
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

    console.log(column)
  }
</script>

<style scoped lang="scss"></style>
