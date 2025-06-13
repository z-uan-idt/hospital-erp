<template>
  <v-container
    class="erp-chi-tiet-kho-truc-thuoc pa-md-6 pa-3"
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
          <h1 :class="['text-lg-h5 text-h6 font-weight-medium', 'text-blue-grey-darken-3']">Chi tiết kho trực thuộc</h1>
        </div>
        <div class="action-buttons d-flex align-center ga-2">
          <v-btn
            icon
            variant="outlined"
            color="erp-gray"
            size="small"
            @click="isSetting = true"
          >
            <v-icon
              size="20"
              class="text-erp-gray-800"
            >
              mdi-cog-outline
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
        title="Thông tin kho trực thuộc"
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
              :model-value="warehouse?.code"
              placeholder="Nhập mã kho trực thuộc"
              label="Mã kho trực thuộc"
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
              :model-value="warehouse?.name"
              placeholder="Nhập tên kho trực thuộc"
              label="Tên kho trực thuộc"
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
              :model-value="warehouse?.department?.name"
              label="Trực thuộc khoa"
              placeholder="Chọn khoa"
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
            <v-select
              :model-value="warehouse?.keeper?.full_name"
              label="Thủ kho"
              placeholder="Chọn thủ kho"
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
              :model-value="warehouse?.staff_count"
              label="Số lượng nhân viên"
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
            <v-combobox
              :model-value="warehouse?.medical_product_group_storages"
              label="Nhóm hàng hóa được lưu tồn"
              placeholder="Chọn nhóm hàng hóa"
              menu-icon=""
              chips
              multiple
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
              :model-value="warehouse?.description"
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
              :model-value="warehouse?.created_at ? formatDateTime(warehouse?.created_at) : 'Chưa cập nhật'"
              placeholder="Chưa cập nhật"
              label="Tạo lúc"
              readonly
            >
              <template v-slot:details>
                <p class="text-caption text-black w-100">
                  Bởi
                  <strong class="font-weight-medium">
                    {{ warehouse?.created_by?.full_name || 'Hệ thống' }}
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
              :model-value="warehouse?.updated_at ? formatDateTime(warehouse?.updated_at) : 'Chưa cập nhật'"
              placeholder="Chưa cập nhật"
              label="Cập nhật lúc"
              readonly
            >
              <template
                v-if="warehouse?.updated_by?.full_name"
                v-slot:details
              >
                <p class="text-caption text-black w-100">
                  Bởi
                  <strong class="font-weight-medium">
                    {{ warehouse?.updated_by?.full_name }}
                  </strong>
                </p>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
      </CommonFieldset>

      <CommonFieldset
        class="mt-6"
        title="Thông tin nhân viên trực thuộc"
      >
        <div class="w-100 pa-4 pt-0 pb-0">
          <FeatureListDirectStaff :warehouse-id="warehouseId" />
        </div>
      </CommonFieldset>
    </v-form>

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

    <v-dialog
      v-model="isSetting"
      max-width="850"
      persistent
    >
      <v-form
        ref="formRef"
        @submit.prevent="onFormSubmit"
      >
        <v-card class="pb-2 pt-2 erp-scrollbar">
          <template v-slot:title>
            <div class="d-flex align-center justify-space-between">
              <div class="d-flex align-center ga-2">
                <v-icon
                  size="24"
                  class="mt-n1"
                >
                  mdi-cog-outline
                </v-icon>
                Cấu hình kho
              </div>
              <v-btn
                size="small"
                icon="mdi-close"
                variant="outlined"
                class="text-body-2"
                color="grey-darken-1"
                @click="isSetting = false"
              />
            </div>
          </template>

          <div class="ps-6 pe-6 pb-6">
            <v-divider>
              <v-tabs
                v-model="tabActive"
                density="compact"
              >
                <v-tab
                  v-for="item in tabItems"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.title }}
                </v-tab>
              </v-tabs>
            </v-divider>
          </div>

          <div class="h-100">
            <v-tabs-window v-model="tabActive">
              <v-tabs-window-item value="INVENTORY_LEVELS">
                <div class="pe-6 ps-6 pb-4">
                  <p class="text-subtitle-2 d-flex align-center ga-2">
                    <v-icon
                      size="20"
                      style="margin-top: -2px"
                    >
                      mdi-information-outline
                    </v-icon>
                    Định mức này được tính theo lô.
                  </p>

                  <v-row class="mt-2">
                    <v-col
                      cols="12"
                      sm="12"
                      md="6"
                      lg="6"
                    >
                      <v-number-input
                        v-model="inventoryLevels.minimum_stock_limit"
                        label="Số lượng tối thiểu"
                        placeholder="0"
                        :rules="[formRules.required]"
                      >
                        <template #label>
                          <div class="d-flex align-center justify-start w-100">
                            <span>
                              Số lượng tối thiểu
                              <span class="text-red-darken-3"> * </span>
                            </span>
                          </div>
                        </template>
                      </v-number-input>
                    </v-col>

                    <v-col
                      cols="12"
                      sm="12"
                      md="6"
                      lg="6"
                    >
                      <v-number-input
                        v-model="inventoryLevels.maximum_stock_limit"
                        label="Số lượng tối đa"
                        placeholder="0"
                        :rules="[formRules.required]"
                      >
                        <template #label>
                          <div class="d-flex align-center justify-start w-100">
                            <span>
                              Số lượng tối đa
                              <span class="text-red-darken-3"> * </span>
                            </span>
                          </div>
                        </template>
                      </v-number-input>
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
                    @click="isSetting = false"
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
                  >
                    <template #prepend>
                      <Icon
                        name="mdi-check"
                        size="22"
                        class="me-n2"
                      />
                    </template>
                    <span class="text-body-1">Xác nhận</span>
                  </v-btn>
                </div>
              </v-tabs-window-item>
              <v-tabs-window-item value="MEDICAL_PRODUCT_GROUP_STORAGES">
                <div class="pe-6 ps-6 pb-4 mb-4">
                  <p class="text-subtitle-2 d-flex align-center ga-2">
                    <v-icon
                      size="20"
                      style="margin-top: -2px"
                    >
                      mdi-information-outline
                    </v-icon>
                    Chọn nhóm hàng hóa được lưu tồn tại kho này.
                  </p>

                  <v-divider>
                    <div
                      class="bg-erp-gray-300 px-2 py-1 mt-4 mb-2"
                      :class="{
                        'rounded-pill': $vuetify.display.smAndUp,
                      }"
                    >
                      <v-tabs
                        v-model="tabChildActive"
                        density="compact"
                        @update:model-value="onFetchWarehouseMedicalProductGroupStorages"
                        @vue:mounted="onFetchWarehouseMedicalProductGroupStorages($event?.props?.modelValue)"
                      >
                        <v-tab
                          v-for="item in tabChildItems"
                          :key="item.value"
                          :value="item.value"
                          variant="elevated"
                          class="rounded-pill text-body-2 font-weight-regular border border-opacity-0"
                          :border="false"
                          elevation="0"
                          color="bg-white"
                          base-color="erp-gray-300"
                          selected-class="erp-gray-300 border-opacity-25"
                        >
                          {{ item.title }}
                        </v-tab>
                      </v-tabs>
                    </div>
                  </v-divider>

                  <v-tabs-window v-model="tabChildActive">
                    <v-tabs-window-item value="THUOC">
                      <v-radio-group
                        v-model="warehouseMedicalProductGroupStorages.is_drug_storage"
                        hide-details
                      >
                        <v-list-item
                          class="w-100 px-2"
                          variant="outlined"
                          size="auto"
                          color="erp-gray-400"
                          border="sm"
                          density="compact"
                          rounded="pill"
                        >
                          <v-radio
                            label="Tất cả nhóm thuốc"
                            hide-details
                            class="text-erp-gray-900"
                            width="100%"
                            :value="true"
                          />
                        </v-list-item>
                        <v-list-item
                          class="w-100 px-2 mt-2"
                          variant="outlined"
                          size="auto"
                          color="erp-gray-400"
                          :border="warehouseMedicalProductGroupStorages.is_drug_storage ? 'sm' : 'sm b-0'"
                          density="compact"
                          :rounded="warehouseMedicalProductGroupStorages.is_drug_storage ? 'pill' : 't-lg'"
                        >
                          <v-radio
                            label="Nhóm thuốc chỉ định"
                            hide-details
                            class="text-erp-gray-900"
                            width="100%"
                            :value="false"
                          />
                        </v-list-item>
                      </v-radio-group>

                      <div
                        v-if="!warehouseMedicalProductGroupStorages.is_drug_storage"
                        class="border border-t-0 rounded-b-lg px-2"
                        :height="300"
                        :items="warehouseMedicalProductGroupStorages.drug_groups"
                      >
                        <v-list
                          class="mb-2"
                          rounded="lg"
                          color="erp-gray-400"
                          border="sm"
                        >
                          <v-virtual-scroll
                            :height="warehouseMedicalProductGroupStorages.drug_groups.length > 0 ? 300 : 0"
                            :items="warehouseMedicalProductGroupStorages.drug_groups"
                          >
                            <template v-slot:default="{ item }">
                              <v-list-item
                                class="py-0"
                                :loading="true"
                              >
                                <v-checkbox
                                  v-model="item.is_selected"
                                  hide-details
                                  class="text-erp-gray-900"
                                  width="100%"
                                  :label="item.name"
                                />
                              </v-list-item>
                            </template>
                          </v-virtual-scroll>
                          <div
                            v-if="warehouseMedicalProductGroupStorages.drug_groups.length === 0"
                            class="d-flex justify-center align-center h-100"
                          >
                            <p class="text-body-2 text-erp-gray-900 mt-1">Không có dữ liệu</p>
                          </div>
                        </v-list>
                      </div>
                    </v-tabs-window-item>
                    <v-tabs-window-item value="VAT_TU">
                      <v-radio-group
                        v-model="warehouseMedicalProductGroupStorages.is_material_storage"
                        hide-details
                      >
                        <v-list-item
                          class="w-100 px-2"
                          variant="outlined"
                          size="auto"
                          color="erp-gray-400"
                          border="sm"
                          density="compact"
                          rounded="pill"
                        >
                          <v-radio
                            label="Tất cả nhóm vật tư"
                            hide-details
                            class="text-erp-gray-900"
                            width="100%"
                            :value="true"
                          />
                        </v-list-item>
                        <v-list-item
                          class="w-100 px-2 mt-2"
                          variant="outlined"
                          size="auto"
                          color="erp-gray-400"
                          :border="warehouseMedicalProductGroupStorages.is_material_storage ? 'sm' : 'sm b-0'"
                          density="compact"
                          :rounded="warehouseMedicalProductGroupStorages.is_material_storage ? 'pill' : 't-lg'"
                        >
                          <v-radio
                            label="Nhóm vật tư chỉ định"
                            hide-details
                            class="text-erp-gray-900"
                            width="100%"
                            :value="false"
                          />
                        </v-list-item>
                      </v-radio-group>

                      <div
                        v-if="!warehouseMedicalProductGroupStorages.is_material_storage"
                        class="border border-t-0 rounded-b-lg px-2"
                        :height="300"
                        :items="warehouseMedicalProductGroupStorages.material_groups"
                      >
                        <v-list
                          class="mb-2"
                          rounded="lg"
                          color="erp-gray-400"
                          border="sm"
                        >
                          <v-virtual-scroll
                            :height="warehouseMedicalProductGroupStorages.material_groups.length > 0 ? 300 : 0"
                            :items="warehouseMedicalProductGroupStorages.material_groups"
                          >
                            <template v-slot:default="{ item }">
                              <v-list-item class="py-0">
                                <v-checkbox
                                  v-model="item.is_selected"
                                  hide-details
                                  class="text-erp-gray-900"
                                  width="100%"
                                  :label="item.name"
                                />
                              </v-list-item>
                            </template>
                          </v-virtual-scroll>
                          <div
                            v-if="warehouseMedicalProductGroupStorages.material_groups.length === 0"
                            class="d-flex justify-center align-center h-100"
                          >
                            <p class="text-body-2 text-erp-gray-900 mt-1">Không có dữ liệu</p>
                          </div>
                        </v-list>
                      </div>
                    </v-tabs-window-item>
                    <v-tabs-window-item value="HOA_CHAT">
                      <v-radio-group
                        v-model="warehouseMedicalProductGroupStorages.is_chemical_storage"
                        hide-details
                      >
                        <v-list-item
                          class="w-100 px-2"
                          variant="outlined"
                          size="auto"
                          color="erp-gray-400"
                          border="sm"
                          density="compact"
                          rounded="pill"
                        >
                          <v-radio
                            label="Tất cả nhóm hóa chất"
                            hide-details
                            class="text-erp-gray-900"
                            width="100%"
                            :value="true"
                          />
                        </v-list-item>
                        <v-list-item
                          class="w-100 px-2 mt-2"
                          variant="outlined"
                          size="auto"
                          color="erp-gray-400"
                          :border="warehouseMedicalProductGroupStorages.is_chemical_storage ? 'sm' : 'sm b-0'"
                          density="compact"
                          :rounded="warehouseMedicalProductGroupStorages.is_chemical_storage ? 'pill' : 't-lg'"
                        >
                          <v-radio
                            label="Nhóm hóa chất chỉ định"
                            hide-details
                            class="text-erp-gray-900"
                            width="100%"
                            :value="false"
                          />
                        </v-list-item>
                      </v-radio-group>

                      <div
                        v-if="!warehouseMedicalProductGroupStorages.is_chemical_storage"
                        class="border border-t-0 rounded-b-lg px-2"
                        :height="300"
                        :items="warehouseMedicalProductGroupStorages.chemical_groups"
                      >
                        <v-list
                          rounded="lg"
                          color="erp-gray-400"
                          border="sm"
                          class="mb-2"
                        >
                          <v-virtual-scroll
                            :height="warehouseMedicalProductGroupStorages.chemical_groups.length > 0 ? 300 : 0"
                            :items="warehouseMedicalProductGroupStorages.chemical_groups"
                          >
                            <template v-slot:default="{ item }">
                              <v-list-item class="py-0">
                                <v-checkbox
                                  v-model="item.is_selected"
                                  hide-details
                                  class="text-erp-gray-900"
                                  width="100%"
                                  :label="item.name"
                                />
                              </v-list-item>
                            </template>
                          </v-virtual-scroll>
                          <div
                            v-if="warehouseMedicalProductGroupStorages.chemical_groups.length === 0"
                            class="d-flex justify-center align-center h-100"
                          >
                            <p class="text-body-2 text-erp-gray-900 mt-1">Không có dữ liệu</p>
                          </div>
                        </v-list>
                      </div>
                    </v-tabs-window-item>
                  </v-tabs-window>
                </div>

                <div class="d-flex justify-end pe-6 ps-6 pb-4 ga-3">
                  <v-btn
                    color="pmg-gray-700"
                    elevation="0"
                    variant="outlined"
                    rounded="pill"
                    size="large"
                    class="flex-grow-1 flex-md-grow-0"
                    @click="isSetting = false"
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
                  >
                    <template #prepend>
                      <Icon
                        name="mdi-check"
                        size="22"
                        class="me-n2"
                      />
                    </template>
                    <span class="text-body-1">Xác nhận</span>
                  </v-btn>
                </div>
              </v-tabs-window-item>
              <v-tabs-window-item value="MEDICAL_PRODUCT_STORAGES">
                <div class="pe-6 ps-6 pb-4 mb-4">
                  <p class="text-subtitle-2 d-flex align-center ga-2">
                    <v-icon
                      size="20"
                      style="margin-top: -2px"
                    >
                      mdi-information-outline
                    </v-icon>
                    Cài đặt định mức của từng hàng hóa được lưu tại kho.
                  </p>

                  <v-divider>
                    <div class="bg-erp-gray-300 rounded-pill px-2 py-1 mt-4 mb-2">
                      <v-tabs
                        v-model="tabChildActive"
                        density="compact"
                      >
                        <v-tab
                          v-for="item in tabChildItems"
                          :key="item.value"
                          :value="item.value"
                          variant="elevated"
                          class="rounded-pill text-body-2 font-weight-regular border border-opacity-0"
                          :border="false"
                          elevation="0"
                          color="bg-white"
                          base-color="erp-gray-300"
                          selected-class="erp-gray-300 border-opacity-25"
                        >
                          {{ item.title }}
                        </v-tab>
                      </v-tabs>
                    </div>
                  </v-divider>

                  <v-tabs-window v-model="tabChildActive">
                    <v-tabs-window-item value="THUOC">1</v-tabs-window-item>
                    <v-tabs-window-item value="VAT_TU">2</v-tabs-window-item>
                    <v-tabs-window-item value="HOA_CHAT">3</v-tabs-window-item>
                  </v-tabs-window>
                </div>

                <div class="d-flex justify-end pe-6 ps-6 pb-4 ga-3">
                  <v-btn
                    color="pmg-gray-700"
                    elevation="0"
                    variant="outlined"
                    rounded="pill"
                    size="large"
                    class="flex-grow-1 flex-md-grow-0"
                    @click="isSetting = false"
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
              </v-tabs-window-item>
            </v-tabs-window>
          </div>
        </v-card>
      </v-form>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
  import type { SubmitEventPromise } from 'vuetify'
  import type { IMedicalProductType } from '~/types/medical_product.types'
  import type { IWarehouseMedicalProductGroupStorages } from '~/types/warehouse.types'

  definePageMeta({
    layout: 'default',
    middleware: ['auth'],
  })

  const route = useRoute()
  const router = useRouter()

  const isLoading = ref(false)
  const isSetting = ref(false)
  const tabActive = ref('INVENTORY_LEVELS')
  const tabChildActive = ref('THUOC')
  const tabChildItems = ref([
    {
      title: 'Nhóm thuốc',
      value: 'THUOC',
    },
    {
      title: 'Nhóm vật tư',
      value: 'VAT_TU',
    },
    {
      title: 'Nhóm hóa chất',
      value: 'HOA_CHAT',
    },
  ])
  const tabItems = ref([
    {
      title: 'Định mức tồn',
      value: 'INVENTORY_LEVELS',
    },
    {
      title: 'Nhóm hàng hóa lưu tồn',
      value: 'MEDICAL_PRODUCT_GROUP_STORAGES',
    },
    // {
    //   title: 'Định mức hàng hóa',
    //   value: 'MEDICAL_PRODUCT_STORAGES',
    // },
  ])
  const warehouseId = route.params?.['warehouse_id'] as string

  const formRules = useFormRules()
  const serviceHooks = useGroupService()
  const { warehouse, ...hooks } = useWarehouse()

  const inventoryLevels = ref({
    minimum_stock_limit: 0,
    maximum_stock_limit: 0,
  })

  watch(isSetting, async (newVal) => {
    if (newVal) {
      inventoryLevels.value = {
        minimum_stock_limit: warehouse.value?.minimum_stock_limit ?? 0,
        maximum_stock_limit: warehouse.value?.maximum_stock_limit ?? 0,
      }
      const result = await hooks.onFetchWarehouseMedicalProductGroupStorages(warehouseId)
      warehouseMedicalProductGroupStorages.value = result.data
      warehouseMedicalProductGroupStorages.value.drug_groups.forEach((item) => {
        item.is_selected = true
      })
      warehouseMedicalProductGroupStorages.value.material_groups.forEach((item) => {
        item.is_selected = true
      })
      warehouseMedicalProductGroupStorages.value.chemical_groups.forEach((item) => {
        item.is_selected = true
      })
    }
  })

  watch(tabActive, (newVal, oldVal) => {
    tabChildActive.value = 'THUOC'
  })

  const { $toast } = useNuxtApp()

  const warehouseMedicalProductGroupStorages = ref<IWarehouseMedicalProductGroupStorages>({
    drug_groups: [],
    material_groups: [],
    chemical_groups: [],
    is_drug_storage: false,
    is_material_storage: false,
    is_chemical_storage: false,
  })

  const onFormSubmit = async (formEvent: SubmitEventPromise) => {
    const result = await formEvent
    if (result.valid) {
      if (tabActive.value === 'INVENTORY_LEVELS') {
        try {
          isLoading.value = true
          const result = await hooks.onSaveInventoryLevels({
            warehouse: warehouseId as unknown as number,
            ...inventoryLevels.value,
          })
          if (result.success) {
            $toast.success('Cập nhật định mức tồn thành công')
            warehouse.value = {
              ...warehouse.value,
              minimum_stock_limit: inventoryLevels.value.minimum_stock_limit,
              maximum_stock_limit: inventoryLevels.value.maximum_stock_limit,
            }
            isSetting.value = false
          } else {
            $toast.error(result.message)
          }
        } catch (error) {
          $toast.error('Hệ thống đang gặp sự cố, vui lòng thử lại sau')
        } finally {
          isLoading.value = false
        }
      }
      if (tabActive.value === 'MEDICAL_PRODUCT_GROUP_STORAGES') {
        const payload = {
          warehouse: warehouseId as unknown as number,
          drug_groups: !warehouseMedicalProductGroupStorages.value.is_drug_storage
            ? warehouseMedicalProductGroupStorages.value.drug_groups
                .filter((e) => e?.is_selected)
                .map((item) => item.id)
            : [],
          material_groups: !warehouseMedicalProductGroupStorages.value.is_material_storage
            ? warehouseMedicalProductGroupStorages.value.material_groups
                .filter((e) => e?.is_selected)
                .map((item) => item.id)
            : [],
          chemical_groups: !warehouseMedicalProductGroupStorages.value.is_chemical_storage
            ? warehouseMedicalProductGroupStorages.value.chemical_groups
                .filter((e) => e?.is_selected)
                .map((item) => item.id)
            : [],
        }
        try {
          isLoading.value = true
          const result = await hooks.onSaveWarehouseMedicalProductGroupStorage(payload)
          if (result.success) {
            warehouse.value.medical_product_group_storages = []
            $toast.success('Cập nhật nhóm hàng hóa lưu tồn thành công')
            if (payload.drug_groups.length === 0) {
              warehouse.value.medical_product_group_storages.push('Tất cả nhóm thuốc')
            }
            if (payload.material_groups.length === 0) {
              warehouse.value.medical_product_group_storages.push('Tất cả nhóm vật tư')
            }
            if (payload.chemical_groups.length === 0) {
              warehouse.value.medical_product_group_storages.push('Tất cả nhóm hóa chất')
            }
            warehouse.value.medical_product_group_storages = [
              ...warehouse.value.medical_product_group_storages,
              ...warehouseMedicalProductGroupStorages.value.drug_groups
                .filter((e) => !warehouseMedicalProductGroupStorages.value.is_drug_storage && e?.is_selected)
                .map((item) => item.name),
              ...warehouseMedicalProductGroupStorages.value.material_groups
                .filter((e) => !warehouseMedicalProductGroupStorages.value.is_material_storage && e?.is_selected)
                .map((item) => item.name),
              ...warehouseMedicalProductGroupStorages.value.chemical_groups
                .filter((e) => !warehouseMedicalProductGroupStorages.value.is_chemical_storage && e?.is_selected)
                .map((item) => item.name),
            ]
            isSetting.value = false
          } else {
            $toast.error(result.message)
          }
        } catch (error) {
          $toast.error('Hệ thống đang gặp sự cố, vui lòng thử lại sau')
        } finally {
          isLoading.value = false
        }
      }
    }
  }

  onMounted(async () => {
    isLoading.value = true
    await hooks.onFetchWarehouseById(warehouseId)
    isLoading.value = false

    inventoryLevels.value = {
      minimum_stock_limit: warehouse.value?.minimum_stock_limit ?? 0,
      maximum_stock_limit: warehouse.value?.maximum_stock_limit ?? 0,
    }

    useHead({
      title: `Chi tiết kho trực thuộc ${warehouse.value?.name}`,
    })
  })

  const onFetchWarehouseMedicalProductGroupStorages = async (mp_type: IMedicalProductType) => {
    const result = await serviceHooks.onFetchGroupService(mp_type, 'NHOM_HANG_HOA', -1, -1)
    const data_key = mp_type === 'THUOC' ? 'drug_groups' : mp_type === 'VAT_TU' ? 'material_groups' : 'chemical_groups'
    warehouseMedicalProductGroupStorages.value[data_key] = result.items.map((item) => {
      const selected = warehouseMedicalProductGroupStorages.value[data_key]?.find((group) => group.id === item.id)
      return {
        id: item.id,
        name: item.name,
        code: item.code,
        type: item.type,
        is_selected: selected?.is_selected ?? false,
      }
    })
  }
</script>
