<template>
  <v-container
    class="erp-danh-sach-khoa pa-md-6 pa-3"
    fluid
  >
    <v-form readonly>
      <div class="d-flex align-center flex-row justify-space-between ga-4 mb-6">
        <div class="d-flex align-center justify-start ga-3 w-100 w-md-auto">
          <v-btn
            icon="mdi-chevron-left"
            variant="outlined"
            color="erp-gray-700"
            class="text-body-1 font-weight-medium"
            size="x-small"
            @click="router.back()"
          />
          <h1 :class="['text-lg-h5 text-h6 font-weight-medium', 'text-blue-grey-darken-3']">Chi tiết khoa</h1>
        </div>
        <div class="action-buttons d-flex align-center ga-2">
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
          <!-- <v-btn
            icon
            variant="outlined"
            color="erp-gray"
            size="x-small"
            @click="isUpdate = !isUpdate"
          >
            <v-icon
              size="18"
              class="me-n1 text-erp-gray-800"
            >
              custom-edit-box
            </v-icon>
          </v-btn> -->
        </div>
      </div>

      <CommonFieldset
        title="Thông tin khoa"
        class="pb-9"
      >
        <v-row class="form-readonly">
          <v-col
            cols="12"
            sm="12"
            md="6"
            lg="6"
            class="pb-0"
          >
            <v-text-field
              :model-value="department?.code"
              placeholder="Nhập mã khoa"
              label="Mã khoa"
            />
          </v-col>

          <v-col
            cols="12"
            sm="12"
            md="6"
            lg="6"
            class="pb-0"
          >
            <v-text-field
              :model-value="department?.name"
              placeholder="Nhập tên khoa"
              label="Tên khoa"
            />
          </v-col>

          <v-col
            cols="12"
            sm="12"
            md="6"
            lg="4"
            class="pb-0"
          >
            <v-select
              :model-value="department?.dean?.full_name"
              label="Trưởng khoa"
              placeholder="Chọn trưởng khoa"
              menu-icon=""
            />
          </v-col>

          <v-col
            cols="12"
            sm="12"
            md="6"
            lg="4"
            class="pb-0"
          >
            <v-text-field
              :model-value="department?.staff_count"
              label="Số lượng nhân viên"
              placeholder="0"
            />
          </v-col>

          <v-col
            cols="12"
            sm="12"
            md="6"
            lg="4"
            class="pb-0"
          >
            <v-text-field
              :model-value="department?.warehouse_count"
              label="Số lượng kho trực thuộc"
              placeholder="0"
            />
          </v-col>

          <v-col
            cols="12"
            sm="12"
            md="12"
            lg="12"
            class="pb-0"
          >
            <v-textarea
              :model-value="department?.description"
              label="Mô tả"
              placeholder="Nhập mô tả"
            />
          </v-col>

          <v-col
            cols="12"
            sm="12"
            md="6"
            lg="6"
            class="pb-0"
          >
            <v-text-field
              :model-value="department?.created_at ? formatDateTime(department?.created_at) : 'Chưa cập nhật'"
              placeholder="Chưa cập nhật"
              label="Tạo lúc"
              readonly
            >
              <template v-slot:details>
                <p class="text-caption text-black w-100">
                  Bởi
                  <strong class="font-weight-medium">
                    {{ department?.created_by?.full_name || 'Hệ thống' }}
                  </strong>
                </p>
              </template>
            </v-text-field>
          </v-col>

          <v-col
            cols="12"
            sm="12"
            md="6"
            lg="6"
            class="pb-0"
          >
            <v-text-field
              :model-value="department?.updated_at ? formatDateTime(department?.updated_at) : 'Chưa cập nhật'"
              placeholder="Chưa cập nhật"
              label="Cập nhật lúc"
              readonly
            >
              <template
                v-if="department?.updated_by?.full_name"
                v-slot:details
              >
                <p class="text-caption text-black w-100">
                  Bởi
                  <strong class="font-weight-medium">
                    {{ department?.updated_by?.full_name }}
                  </strong>
                </p>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
      </CommonFieldset>
    </v-form>

    <CommonFieldset
      class="mt-6"
      center
    >
      <template #title>
        <v-tabs
          v-model="currentTab"
          density="compact"
        >
          <v-tab
            variant="elevated"
            value="staff"
            text="Nhân viên trực thuộc"
            class="rounded-pill me-2 text-body-2 font-weight-regular border border-opacity-0"
            :border="false"
            elevation="0"
            color="bg-white"
            base-color="erp-gray-300"
            selected-class="erp-gray-300 border-opacity-25"
          />
          <v-tab
            variant="elevated"
            value="warehouse"
            text="Kho trực thuộc"
            class="rounded-pill text-body-2 font-weight-regular border border-opacity-0"
            :border="false"
            elevation="0"
            color="bg-white"
            base-color="erp-gray-300"
            selected-class="erp-gray-300 border-opacity-25"
          />
        </v-tabs>
      </template>

      <div
        v-show="currentTab === 'staff'"
        class="w-100 pa-4 pt-0 pb-0"
      >
        <FeatureListDirectStaff :department-id="departmentId" />
      </div>

      <div
        v-show="currentTab === 'warehouse'"
        class="w-100 pa-4 pt-0 pb-0"
      >
        <FeatureListDirectWarehouse :department-id="departmentId" />
      </div>
    </CommonFieldset>

    <v-dialog
      v-model="isUpdate"
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
              Chỉnh sửa thông tin khoa
              <v-btn
                size="x-small"
                icon="mdi-close"
                variant="outlined"
                class="text-body-2"
                color="grey-darken-1"
                @click="isUpdate = false"
              />
            </div>
          </template>

          <div class="ps-6 pe-6 pb-6">
            <CommonDivider label="Chỉnh sửa thông tin khoa" />

            <v-row>
              <v-col
                cols="12"
                sm="12"
                md="12"
                class="pb-0"
              >
                <v-text-field
                  v-model="formPayload.name"
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
                  v-model="formPayload.code"
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
                  v-model="formPayload.dean"
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
                  v-model="formPayload.description"
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
              @click="isUpdate = false"
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
              :loading="isUpdateLoading"
            >
              <template #prepend>
                <Icon
                  name="mdi-check"
                  size="22"
                  class="me-n2"
                />
              </template>
              <span class="text-body-1">Lưu lại</span>
            </v-btn>
          </div>
        </v-card>
      </v-form>
    </v-dialog>

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
  </v-container>
</template>

<script setup lang="ts">
  import type { SubmitEventPromise } from 'vuetify'
  import type { VForm } from 'vuetify/components/VForm'
  import type { IDepartment } from '~/types/department.types'

  definePageMeta({
    layout: 'default',
    middleware: ['auth'],
  })

  const route = useRoute()
  const router = useRouter()

  const isLoading = ref(false)
  const isUpdate = ref(false)
  const isUpdateLoading = ref(false)
  const currentTab = ref('staff')
  const formRef = ref<InstanceType<typeof VForm> | null>(null)
  const departmentId = route.params?.['department_id'] as string

  const { department, ...hooks } = useDepartment()

  onMounted(async () => {
    isLoading.value = true
    await hooks.onFetchDepartmentById(departmentId)
    isLoading.value = false
  })

  const formRules = useFormRules()

  const formPayload = ref<IDepartment>({
    code: '',
    name: '',
    dean: null,
    description: '',
  })

  watchEffect(() => {
    formPayload.value = {
      code: department.value?.code || '',
      name: department.value?.name || '',
      dean: department.value?.dean || null,
      description: department.value?.description || '',
    }
  })

  const onFormSubmit = async (formEvent: SubmitEventPromise) => {
    const results = await formEvent
  }
</script>
