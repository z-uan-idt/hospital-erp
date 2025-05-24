<template>
  <div class="erp-phieu-nhap-kho pa-6">
    <div
      :class="[
        'd-flex align-center flex-md-row',
        'flex-column justify-space-between ga-4',
      ]"
    >
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
          Phiếu nhập kho
        </h1>
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
      style="max-height: calc(100vh - 240px)"
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
            size="x-small"
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
  definePageMeta({
    layout: 'default',
    middleware: ['auth'],
    keepalive: true,
  })

  useHead({
    title: 'Phiếu nhập kho',
  })

  const headers = ref([
    {
      title: 'Mã khoa',
      key: 'code',
      sortable: false,
    },
    {
      title: 'Tên khoa',
      key: 'name',
      sortable: false,
    },
    {
      title: 'Trưởng khoa',
      key: 'dean',
      sortable: false,
    },
    {
      title: 'Số lượng nhân viên',
      key: 'staff_count',
      sortable: false,
    },
    {
      title: 'Số lượng kho',
      key: 'warehouse_count',
      sortable: false,
    },
    {
      title: 'Ngày tạo',
      key: 'created_at',
      sortable: false,
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
