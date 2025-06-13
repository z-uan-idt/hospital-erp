<template>
  <div class="erp-medical-product-form">
    <v-form
      :readonly="!props.isUpdate && !props.isCreate"
      @submit.prevent="onFormSubmit"
    >
      <div class="d-flex align-center flex-row justify-space-between ga-4 mb-6">
        <div class="d-flex align-center justify-start ga-3 w-100 w-md-auto">
          <v-btn
            icon="mdi-chevron-left"
            variant="outlined"
            color="erp-gray-700"
            class="text-body-1 font-weight-medium"
            size="x-small"
            @click="onButtonBack"
          />
          <h1 :class="['text-lg-h5 text-h6 font-weight-medium', 'text-blue-grey-darken-3']">
            {{ props?.pageLabel }}
          </h1>
        </div>
        <div class="action-buttons d-flex align-center ga-2">
          <slot name="action-buttons" />

          <v-btn
            v-if="tabActive === 'DINH_MUC_TON'"
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
            v-if="!props.isCreate && !props.isUpdate"
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
            v-if="props.isCreate || props.isUpdate"
            color="erp-brand"
            rounded="pill"
            elevation="0"
            type="submit"
            height="38"
          >
            <template #prepend>
              <v-icon
                class="me-n1"
                size="22"
              >
                mdi-check
              </v-icon>
            </template>
            <span class="text-body-1">Lưu lại</span>
          </v-btn>
          <v-btn
            v-else
            icon
            variant="outlined"
            color="erp-gray"
            size="small"
            @click="formEmit('update', true)"
          >
            <v-icon
              size="18"
              class="me-n1 text-erp-gray-800"
            >
              custom-edit-box
            </v-icon>
          </v-btn>
        </div>
      </div>

      <div
        class="mb-4"
        v-if="!props.isCreate && !props.isUpdate"
      >
        <v-divider>
          <div class="bg-erp-gray-300 px-2 py-1 mt-4 mb-2 rounded-pill">
            <v-tabs
              v-model="tabActive"
              density="compact"
            >
              <v-tab
                v-for="item in tabItems"
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
      </div>

      <v-tabs-window v-model="tabActive">
        <v-tabs-window-item value="HANG_HOA">
          <v-row>
            <v-col
              :class="{
                'form-readonly': !props.isCreate && !props.isUpdate,
              }"
            >
              <CommonFieldset
                title="Thông tin chung"
                class="pb-6"
              >
                <v-row>
                  <v-col
                    cols="12"
                    md="6"
                    lg="3"
                    class="pb-0"
                  >
                    <v-text-field
                      v-model="formPayload.TenHangHoa"
                      :placeholder="`Nhập ${formLabel.TenHangHoa.toLowerCase()}`"
                      :rules="[formRules.required]"
                    >
                      <template #label>
                        <div class="d-flex align-center justify-start w-100">
                          <span>
                            {{ formLabel.TenHangHoa }}
                            <span
                              v-if="props.isCreate || props.isUpdate"
                              class="text-red-darken-3"
                            >
                              *
                            </span>
                          </span>
                        </div>
                      </template>
                    </v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                    lg="3"
                    class="pb-0"
                  >
                    <v-text-field
                      v-model="formPayload.BYT_TenHangHoa"
                      :placeholder="`Nhập ${formLabel.BYT_TenHangHoa.toLowerCase()}`"
                      :rules="[formRules.required]"
                    >
                      <template #label>
                        <div class="d-flex align-center justify-start w-100">
                          <span>
                            {{ formLabel.BYT_TenHangHoa }}
                            <span
                              v-if="props.isCreate || props.isUpdate"
                              class="text-red-darken-3"
                            >
                              *
                            </span>
                          </span>
                        </div>
                      </template>
                    </v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                    lg="3"
                    class="pb-0"
                  >
                    <v-text-field
                      v-model="formPayload.MaHangHoa"
                      :label="formLabel.MaHangHoa"
                      :placeholder="`Nhập ${formLabel.MaHangHoa.toLowerCase()}`"
                    />
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                    lg="3"
                    class="pb-0"
                  >
                    <v-text-field
                      v-model="formPayload.BYT_MaHangHoa"
                      :placeholder="`Nhập ${formLabel.BYT_MaHangHoa.toLowerCase()}`"
                      :rules="[formRules.required]"
                    >
                      <template #label>
                        <div class="d-flex align-center justify-start w-100">
                          <span>
                            {{ formLabel.BYT_MaHangHoa }}
                            <span
                              v-if="props.isCreate || props.isUpdate"
                              class="text-red-darken-3"
                            >
                              *
                            </span>
                          </span>
                        </div>
                      </template>
                    </v-text-field>
                  </v-col>

                  <v-col
                    v-if="selectedMedicalProductType === 'THUOC'"
                    cols="12"
                    md="6"
                    lg="4"
                    class="pb-0"
                  >
                    <v-autocomplete
                      v-model="formPayload.LoaiDangKy"
                      autocomplete="off"
                      :menu-icon="props.isCreate || props.isUpdate ? 'mdi-chevron-down' : null"
                      :items="autocompleteGroupService?.LOAI_DANG_KY?.items || []"
                      label="Loại đăng ký"
                      placeholder="Chọn loại đăng ký"
                      item-title="name"
                      item-value="id"
                      :loading="autocompleteGroupService?.LOAI_DANG_KY?.loading || false"
                      :rules="[formRules.required]"
                    >
                      <template #label>
                        <div class="d-flex align-center justify-start w-100">
                          <span>
                            Loại đăng ký
                            <span
                              v-if="props.isCreate || props.isUpdate"
                              class="text-red-darken-3"
                            >
                              *
                            </span>
                          </span>
                        </div>
                      </template>
                      <template v-slot:append-item>
                        <div v-intersect="endIntersect('LOAI_DANG_KY')" />
                      </template>
                    </v-autocomplete>
                  </v-col>

                  <v-col
                    cols="12"
                    class="pb-0"
                    md="6"
                    :lg="selectedMedicalProductType !== 'VAT_TU' ? 4 : 3"
                  >
                    <v-autocomplete
                      v-model="formPayload.NhomHangHoa"
                      autocomplete="off"
                      :menu-icon="props.isCreate || props.isUpdate ? 'mdi-chevron-down' : null"
                      :items="autocompleteGroupService?.NHOM_HANG_HOA?.items || []"
                      :label="formLabel.NhomHangHoa"
                      :placeholder="`Chọn ${formLabel.NhomHangHoa.toLowerCase()}`"
                      item-title="name"
                      item-value="id"
                      :loading="autocompleteGroupService?.NHOM_HANG_HOA?.loading || false"
                      :rules="[formRules.required]"
                    >
                      <template #label>
                        <div class="d-flex align-center justify-start w-100">
                          <span>
                            {{ formLabel.NhomHangHoa }}
                            <span
                              v-if="props.isCreate || props.isUpdate"
                              class="text-red-darken-3"
                            >
                              *
                            </span>
                          </span>
                        </div>
                      </template>
                      <template
                        v-if="props.isCreate || props.isUpdate"
                        #append
                      >
                        <v-btn
                          icon
                          rounded="lg"
                          class="text-body-1 font-weight-medium"
                          @click="onCreateGroupService('NHOM_HANG_HOA', 'NhomHangHoa')"
                        >
                          <v-icon size="32"> mdi-plus </v-icon>
                        </v-btn>
                      </template>
                      <template v-slot:append-item>
                        <div v-intersect="endIntersect('NHOM_HANG_HOA')" />
                      </template>
                    </v-autocomplete>
                  </v-col>

                  <v-col
                    cols="12"
                    class="pb-0"
                    md="6"
                    :lg="selectedMedicalProductType !== 'VAT_TU' ? 4 : 3"
                  >
                    <v-autocomplete
                      v-model="formPayload.HoatChat"
                      autocomplete="off"
                      :menu-icon="props.isCreate || props.isUpdate ? 'mdi-chevron-down' : null"
                      :items="autocompleteGroupService?.HOAT_CHAT?.items || []"
                      label="Hoạt chất"
                      placeholder="Chọn hoạt chất"
                      item-title="name"
                      item-value="id"
                      :loading="autocompleteGroupService?.HOAT_CHAT?.loading || false"
                    >
                      <template #label>
                        <div class="d-flex align-center justify-start w-100">
                          <span> Hoạt chất </span>
                        </div>
                      </template>
                      <template
                        v-if="props.isCreate || props.isUpdate"
                        #append
                      >
                        <v-btn
                          icon
                          rounded="lg"
                          class="text-body-1 font-weight-medium"
                          @click="onCreateGroupService('HOAT_CHAT', 'HoatChat')"
                        >
                          <v-icon size="32"> mdi-plus </v-icon>
                        </v-btn>
                      </template>
                      <template v-slot:append-item>
                        <div v-intersect="endIntersect('HOAT_CHAT')" />
                      </template>
                    </v-autocomplete>
                  </v-col>

                  <v-col
                    v-if="selectedMedicalProductType !== 'VAT_TU'"
                    cols="12"
                    md="6"
                    :lg="selectedMedicalProductType === 'THUOC' ? 2 : 4"
                    class="pb-0"
                  >
                    <v-text-field
                      v-model="formPayload.HamLuong"
                      placeholder="Nhập hàm lượng"
                      :rules="[formRules.required]"
                    >
                      <template #label>
                        <div class="d-flex align-center justify-start w-100">
                          <span>
                            Hàm lượng
                            <span
                              v-if="props.isCreate || props.isUpdate"
                              class="text-red-darken-3"
                            >
                              *
                            </span>
                          </span>
                        </div>
                      </template>
                    </v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                    :lg="selectedMedicalProductType === 'THUOC' ? 2 : 3"
                    class="pb-0"
                  >
                    <v-text-field
                      v-model="formPayload.TenHoatChatSDK"
                      placeholder="Nhập hoạt chất SDK"
                    >
                      <template #label>
                        <div class="d-flex align-center justify-start w-100">
                          <span> Hoạt chất SDK </span>
                        </div>
                      </template>
                    </v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                    :lg="selectedMedicalProductType === 'THUOC' ? 2 : 3"
                    class="pb-0"
                  >
                    <v-text-field
                      v-model="formPayload.QuyCach"
                      placeholder="Nhập quy cách"
                      :rules="[formRules.required]"
                    >
                      <template #label>
                        <div class="d-flex align-center justify-start w-100">
                          <span>
                            Quy cách
                            <span
                              v-if="props.isCreate || props.isUpdate"
                              class="text-red-darken-3"
                            >
                              *
                            </span>
                          </span>
                        </div>
                      </template>
                    </v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                    :lg="selectedMedicalProductType === 'THUOC' ? 2 : selectedMedicalProductType !== 'VAT_TU' ? 3 : 4"
                    class="pb-0"
                  >
                    <v-number-input
                      v-model="formPayload.SoNgayCanHan"
                      placeholder="Nhập số ngày CH (ngày)"
                      control-variant="hidden"
                    >
                      <template #label>
                        <div class="d-flex align-center justify-start w-100">
                          <span> Số ngày CH (ngày) </span>
                        </div>
                      </template>
                    </v-number-input>
                  </v-col>

                  <v-col
                    v-if="selectedMedicalProductType !== 'VAT_TU'"
                    cols="12"
                    class="pb-0"
                    md="6"
                    :lg="selectedMedicalProductType === 'THUOC' ? 4 : 3"
                  >
                    <v-autocomplete
                      v-model="formPayload.DangBaoChe"
                      autocomplete="off"
                      :menu-icon="props.isCreate || props.isUpdate ? 'mdi-chevron-down' : null"
                      :items="autocompleteGroupService?.DANG_BAO_CHE?.items || []"
                      label="Dạng bào chế"
                      placeholder="Chọn dạng bào chế"
                      item-title="name"
                      item-value="id"
                      :loading="autocompleteGroupService?.HOAT_CHAT?.loading || false"
                    >
                      <template #label>
                        <div class="d-flex align-center justify-start w-100">
                          <span>
                            Dạng bào chế
                            <span
                              v-if="props.isCreate || props.isUpdate"
                              class="text-red-darken-3"
                            >
                              *
                            </span>
                          </span>
                        </div>
                      </template>
                      <template
                        v-if="props.isCreate || props.isUpdate"
                        #append
                      >
                        <v-btn
                          icon
                          rounded="lg"
                          class="text-body-1 font-weight-medium"
                          @click="onCreateGroupService('DANG_BAO_CHE', 'DangBaoChe')"
                        >
                          <v-icon size="32"> mdi-plus </v-icon>
                        </v-btn>
                      </template>
                      <template v-slot:append-item>
                        <div v-intersect="endIntersect('DANG_BAO_CHE')" />
                      </template>
                    </v-autocomplete>
                  </v-col>

                  <v-col
                    cols="12"
                    class="pb-0"
                    md="6"
                    :lg="selectedMedicalProductType === 'THUOC' ? 3 : 4"
                  >
                    <v-autocomplete
                      v-model="formPayload.TrangThai"
                      autocomplete="off"
                      :menu-icon="props.isCreate || props.isUpdate ? 'mdi-chevron-down' : null"
                      :items="autocompleteGroupService?.TRANG_THAI?.items || []"
                      label="Trạng thái"
                      placeholder="Chọn trạng thái"
                      item-title="name"
                      item-value="id"
                      :loading="autocompleteGroupService?.TRANG_THAI?.loading || false"
                      :rules="[formRules.required]"
                    >
                      <template #label>
                        <div class="d-flex align-center justify-start w-100">
                          <span>
                            Trạng thái
                            <span
                              v-if="props.isCreate || props.isUpdate"
                              class="text-red-darken-3"
                            >
                              *
                            </span>
                          </span>
                        </div>
                      </template>
                      <template v-slot:append-item>
                        <div v-intersect="endIntersect('TRANG_THAI')" />
                      </template>
                    </v-autocomplete>
                  </v-col>

                  <v-col
                    v-if="selectedMedicalProductType !== 'VAT_TU'"
                    cols="12"
                    class="pb-0"
                    md="6"
                    :lg="selectedMedicalProductType === 'THUOC' ? 3 : 4"
                  >
                    <v-autocomplete
                      v-model="formPayload.DuongDung"
                      autocomplete="off"
                      :menu-icon="props.isCreate || props.isUpdate ? 'mdi-chevron-down' : null"
                      :items="autocompleteGroupService?.DUONG_DUNG?.items || []"
                      label="Đường dùng"
                      placeholder="Chọn đường dùng"
                      item-title="name"
                      item-value="id"
                      :loading="autocompleteGroupService?.DUONG_DUNG?.loading || false"
                      :rules="[formRules.required]"
                    >
                      <template #label>
                        <div class="d-flex align-center justify-start w-100">
                          <span>
                            Đường dùng
                            <span
                              v-if="props.isCreate || props.isUpdate"
                              class="text-red-darken-3"
                            >
                              *
                            </span>
                          </span>
                        </div>
                      </template>
                      <template
                        v-if="props.isCreate || props.isUpdate"
                        #append
                      >
                        <v-btn
                          icon
                          rounded="lg"
                          class="text-body-1 font-weight-medium"
                          @click="onCreateGroupService('DUONG_DUNG', 'DuongDung')"
                        >
                          <v-icon size="32"> mdi-plus </v-icon>
                        </v-btn>
                      </template>
                      <template v-slot:append-item>
                        <div v-intersect="endIntersect('DUONG_DUNG')" />
                      </template>
                    </v-autocomplete>
                  </v-col>

                  <v-col
                    cols="12"
                    class="pb-0"
                    md="6"
                    :lg="selectedMedicalProductType === 'THUOC' ? 3 : 4"
                  >
                    <v-autocomplete
                      v-model="formPayload.CongTyDangKy"
                      autocomplete="off"
                      :menu-icon="props.isCreate || props.isUpdate ? 'mdi-chevron-down' : null"
                      :items="autocompleteGroupService?.CONG_TY_DANG_KY?.items || []"
                      label="Công ty đăng ký"
                      placeholder="Chọn công ty đăng ký"
                      item-title="name"
                      item-value="id"
                      :loading="autocompleteGroupService?.CONG_TY_DANG_KY?.loading || false"
                    >
                      <template #label>
                        <div class="d-flex align-center justify-start w-100">
                          <span> Công ty đăng ký </span>
                        </div>
                      </template>
                      <template
                        v-if="props.isCreate || props.isUpdate"
                        #append
                      >
                        <v-btn
                          icon
                          rounded="lg"
                          class="text-body-1 font-weight-medium"
                          @click="onCreateGroupService('CONG_TY_DANG_KY', 'CongTyDangKy')"
                        >
                          <v-icon size="32"> mdi-plus </v-icon>
                        </v-btn>
                      </template>
                      <template v-slot:append-item>
                        <div v-intersect="endIntersect('CONG_TY_DANG_KY')" />
                      </template>
                    </v-autocomplete>
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                    :lg="selectedMedicalProductType === 'THUOC' ? 3 : 4"
                    class="pb-0"
                  >
                    <v-text-field
                      v-model="formPayload.SoDangKy"
                      placeholder="Nhập số đăng ký"
                      :rules="[formRules.required]"
                    >
                      <template #label>
                        <div class="d-flex align-center justify-start w-100">
                          <span>
                            Số đăng ký
                            <span
                              v-if="props.isCreate || props.isUpdate"
                              class="text-red-darken-3"
                            >
                              *
                            </span>
                          </span>
                        </div>
                      </template>
                    </v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                    class="pb-0"
                    md="6"
                    :lg="selectedMedicalProductType === 'THUOC' ? 3 : 4"
                  >
                    <v-autocomplete
                      v-model="formPayload.NuocSanXuat"
                      autocomplete="off"
                      :menu-icon="props.isCreate || props.isUpdate ? 'mdi-chevron-down' : null"
                      :items="autocompleteGroupService?.QUOC_GIA?.items || []"
                      label="Nước sản xuất"
                      placeholder="Chọn nước sản xuất"
                      item-title="name"
                      item-value="id"
                      :loading="autocompleteGroupService?.QUOC_GIA?.loading || false"
                      :rules="[formRules.required]"
                    >
                      <template #label>
                        <div class="d-flex align-center justify-start w-100">
                          <span> Nước sản xuất </span>
                          <span
                            v-if="props.isCreate || props.isUpdate"
                            class="text-red-darken-3"
                          >
                            *
                          </span>
                        </div>
                      </template>
                      <template
                        v-if="props.isCreate || props.isUpdate"
                        #append
                      >
                        <v-btn
                          icon
                          rounded="lg"
                          class="text-body-1 font-weight-medium"
                          @click="onCreateGroupService('QUOC_GIA', 'NuocSanXuat')"
                        >
                          <v-icon size="32"> mdi-plus </v-icon>
                        </v-btn>
                      </template>
                      <template v-slot:append-item>
                        <div v-intersect="endIntersect('QUOC_GIA')" />
                      </template>
                    </v-autocomplete>
                  </v-col>

                  <v-col
                    cols="12"
                    class="pb-0"
                    md="6"
                    :lg="selectedMedicalProductType === 'THUOC' ? 3 : 4"
                  >
                    <v-autocomplete
                      v-model="formPayload.NhaSanXuat"
                      autocomplete="off"
                      :menu-icon="props.isCreate || props.isUpdate ? 'mdi-chevron-down' : null"
                      :items="autocompleteGroupService?.NHA_SAN_XUAT?.items || []"
                      label="Nhà sản xuất"
                      placeholder="Chọn nhà sản xuất"
                      item-title="name"
                      item-value="id"
                      :loading="autocompleteGroupService?.NHA_SAN_XUAT?.loading || false"
                      :rules="[formRules.required]"
                    >
                      <template #label>
                        <div class="d-flex align-center justify-start w-100">
                          <span> Nhà sản xuất </span>
                          <span
                            v-if="props.isCreate || props.isUpdate"
                            class="text-red-darken-3"
                          >
                            *
                          </span>
                        </div>
                      </template>
                      <template
                        v-if="props.isCreate || props.isUpdate"
                        #append
                      >
                        <v-btn
                          icon
                          rounded="lg"
                          class="text-body-1 font-weight-medium"
                          @click="onCreateGroupService('NHA_SAN_XUAT', 'NhaSanXuat')"
                        >
                          <v-icon size="32"> mdi-plus </v-icon>
                        </v-btn>
                      </template>
                      <template v-slot:append-item>
                        <div v-intersect="endIntersect('NHA_SAN_XUAT')" />
                      </template>
                    </v-autocomplete>
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                    lg="3"
                    class="pb-0"
                  >
                    <v-number-input
                      v-model="formPayload.HoaHong"
                      label="Hoa hồng"
                      placeholder="Nhập hoa hồng"
                      :control-variant="!props.isCreate && !props.isUpdate ? 'hidden' : null"
                    />
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                    lg="3"
                    class="pb-0"
                  >
                    <v-number-input
                      v-model="formPayload.LoiNhuan"
                      label="Lợi nhuận"
                      placeholder="Nhập lợi nhuận"
                      :control-variant="!props.isCreate && !props.isUpdate ? 'hidden' : null"
                    />
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                    :lg="selectedMedicalProductType === 'THUOC' ? 2 : 3"
                    class="pb-0"
                  >
                    <v-text-field
                      v-model="formPayload.ThongTu30"
                      placeholder="Nhập thông tư 30"
                    >
                      <template #label>
                        <div class="d-flex align-center justify-start w-100">
                          <span> Thông tư 30 </span>
                        </div>
                      </template>
                    </v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                    :lg="selectedMedicalProductType === 'THUOC' ? 2 : 3"
                    class="pb-0"
                  >
                    <v-text-field
                      v-model="formPayload.ThongTu40"
                      placeholder="Nhập thông tư 40"
                    >
                      <template #label>
                        <div class="d-flex align-center justify-start w-100">
                          <span> Thông tư 40 </span>
                        </div>
                      </template>
                    </v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                    :lg="selectedMedicalProductType === 'THUOC' ? 2 : 4"
                    class="pb-0"
                  >
                    <v-text-field
                      v-model="formPayload.MaHangHoaLienKet"
                      :placeholder="`Nhập ${formLabel.MaHangHoaLienKet.toLowerCase()}`"
                    >
                      <template #label>
                        <div class="d-flex align-center justify-start w-100">
                          <span>
                            {{ formLabel.MaHangHoaLienKet }}
                          </span>
                        </div>
                      </template>
                    </v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                    :lg="selectedMedicalProductType === 'THUOC' ? 2 : 4"
                    class="pb-0"
                  >
                    <v-text-field
                      v-model="formPayload.MaACT"
                      label="Mã ATC"
                      placeholder="Nhập mã ATC"
                    />
                  </v-col>

                  <v-col
                    cols="12"
                    class="pb-0"
                    md="6"
                    lg="4"
                  >
                    <v-autocomplete
                      v-model="formPayload.PhanLoaiHangHoa"
                      autocomplete="off"
                      :menu-icon="props.isCreate || props.isUpdate ? 'mdi-chevron-down' : null"
                      :items="autocompleteGroupService?.PHAN_LOAI_HANG_HOA?.items || []"
                      :label="formLabel.PhanLoaiHangHoa"
                      :placeholder="`Chọn ${formLabel.PhanLoaiHangHoa.toLowerCase()}`"
                      item-title="name"
                      item-value="id"
                      :loading="autocompleteGroupService?.PHAN_LOAI_HANG_HOA?.loading || false"
                    >
                      <template #label>
                        <div class="d-flex align-center justify-start w-100">
                          <span> {{ formLabel.PhanLoaiHangHoa }} </span>
                        </div>
                      </template>
                      <template
                        v-if="props.isCreate || props.isUpdate"
                        #append
                      >
                        <v-btn
                          icon
                          rounded="lg"
                          class="text-body-1 font-weight-medium"
                          @click="onCreateGroupService('PHAN_LOAI_HANG_HOA', 'PhanLoaiHangHoa')"
                        >
                          <v-icon size="32"> mdi-plus </v-icon>
                        </v-btn>
                      </template>
                      <template v-slot:append-item>
                        <div v-intersect="endIntersect('PHAN_LOAI_HANG_HOA')" />
                      </template>
                    </v-autocomplete>
                  </v-col>

                  <v-col
                    cols="12"
                    class="pb-0"
                    md="6"
                    lg="4"
                  >
                    <v-autocomplete
                      v-model="formPayload.PhanLoaiCSKCB"
                      autocomplete="off"
                      :menu-icon="props.isCreate || props.isUpdate ? 'mdi-chevron-down' : null"
                      :items="autocompleteGroupService?.PHAN_LOAI_CSKCB?.items || []"
                      label="Phân loại CSKCB"
                      placeholder="Chọn phân loại CSKCB"
                      item-title="name"
                      item-value="id"
                      :loading="autocompleteGroupService?.PHAN_LOAI_CSKCB?.loading || false"
                    >
                      <template #label>
                        <div class="d-flex align-center justify-start w-100">
                          <span> Phân loại CSKCB </span>
                        </div>
                      </template>
                      <template
                        v-if="props.isCreate || props.isUpdate"
                        #append
                      >
                        <v-btn
                          icon
                          rounded="lg"
                          class="text-body-1 font-weight-medium"
                          @click="onCreateGroupService('PHAN_LOAI_CSKCB', 'PhanLoaiCSKCB')"
                        >
                          <v-icon size="32"> mdi-plus </v-icon>
                        </v-btn>
                      </template>
                      <template v-slot:append-item>
                        <div v-intersect="endIntersect('PHAN_LOAI_CSKCB')" />
                      </template>
                    </v-autocomplete>
                  </v-col>

                  <v-col
                    cols="12"
                    class="pb-0"
                    md="6"
                    lg="4"
                  >
                    <v-autocomplete
                      v-model="formPayload.TenCSKCB"
                      autocomplete="off"
                      :menu-icon="props.isCreate || props.isUpdate ? 'mdi-chevron-down' : null"
                      :items="autocompleteGroupService?.CSKCB?.items || []"
                      label="Tên CSKCB"
                      placeholder="Chọn tên CSKCB"
                      item-title="name"
                      item-value="id"
                      :loading="autocompleteGroupService?.CSKCB?.loading || false"
                    >
                      <template #label>
                        <div class="d-flex align-center justify-start w-100">
                          <span> Tên CSKCB </span>
                        </div>
                      </template>
                      <template
                        v-if="props.isCreate || props.isUpdate"
                        #append
                      >
                        <v-btn
                          icon
                          rounded="lg"
                          class="text-body-1 font-weight-medium"
                          @click="onCreateGroupService('CSKCB', 'TenCSKCB')"
                        >
                          <v-icon size="32"> mdi-plus </v-icon>
                        </v-btn>
                      </template>
                      <template v-slot:append-item>
                        <div v-intersect="endIntersect('CSKCB')" />
                      </template>
                    </v-autocomplete>
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                    lg="4"
                    class="pb-0"
                  >
                    <v-number-input
                      v-model="formPayload.TiLeThanhToanBHYT"
                      :rules="[formRules.required]"
                      class="custom-input-message"
                      placeholder="Nhập tỉ lệ thanh toán Bảo Hiểm"
                      :control-variant="!props.isCreate && !props.isUpdate ? 'hidden' : null"
                    >
                      <template #label>
                        <div class="d-flex align-center justify-start w-100">
                          <span>
                            Tỉ lệ thanh toán Bảo Hiểm
                            <span
                              v-if="props.isCreate || props.isUpdate"
                              class="text-red-darken-3"
                            >
                              *
                            </span>
                          </span>
                        </div>
                      </template>
                      <template #details>
                        <div
                          v-if="props.isCreate || props.isUpdate"
                          class="d-flex align-center justify-start w-100 mb-2"
                        >
                          <v-checkbox
                            :model-value="formPayload.IsBHYT === true"
                            label="Thuốc BHYT"
                            style="margin-left: -1px"
                            class="flex-grow-1 border border-opacity-50 border-t-0 border-e-0 rounded-bs-lg ps-2"
                            hide-details
                            density="compact"
                            true-icon="custom-circle-check"
                            false-icon="mdi-radiobox-blank"
                            :color="formPayload.IsBHYT === true ? 'erp-brand-700' : ''"
                            @click="formPayload.IsBHYT = formPayload.IsBHYT === true ? null : true"
                          />
                          <v-checkbox
                            :model-value="formPayload.IsBHYT === false"
                            label="Thuốc ngoài BHYT"
                            class="flex-grow-1 border border-opacity-50 border-t-0 rounded-be-lg ps-2"
                            hide-details
                            density="compact"
                            true-icon="custom-circle-check"
                            false-icon="mdi-radiobox-blank"
                            :color="formPayload.IsBHYT === false ? 'erp-brand-700' : ''"
                            @click="formPayload.IsBHYT = formPayload.IsBHYT === false ? null : false"
                          />
                        </div>
                      </template>
                      <template #append-inner>
                        <div
                          v-if="!props.isCreate && !props.isUpdate && formPayload.IsBHYT !== null"
                          class="text-subtitle-2 font-weight-medium mt-4"
                          style="width: max-content"
                        >
                          {{ formPayload.IsBHYT ? 'Thuốc BHYT' : 'Thuốc ngoài BHYT' }}
                        </div>
                      </template>
                      <template #message></template>
                    </v-number-input>
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                    lg="3"
                    class="pb-0"
                  >
                    <v-autocomplete
                      v-model="formPayload.LoaiBenhAn"
                      autocomplete="off"
                      :menu-icon="props.isCreate || props.isUpdate ? 'mdi-chevron-down' : null"
                      :items="autocompleteGroupService?.LOAI_BENH_AN?.items || []"
                      label="Loại bệnh án"
                      placeholder="Chọn loại bệnh án"
                      multiple
                      item-title="name"
                      item-value="id"
                      :chips="!props.isCreate && !props.isUpdate"
                      :loading="autocompleteGroupService?.LOAI_BENH_AN?.loading || false"
                      :rules="[formRules.required]"
                    >
                      <template #label>
                        <div class="d-flex align-center justify-start w-100">
                          <span>
                            Loại bệnh án
                            <span
                              v-if="props.isCreate || props.isUpdate"
                              class="text-red-darken-3"
                            >
                              *
                            </span>
                          </span>
                        </div>
                      </template>
                      <template
                        v-if="props.isCreate || props.isUpdate"
                        #append
                      >
                        <v-btn
                          icon
                          rounded="lg"
                          class="text-body-1 font-weight-medium"
                          @click="onCreateGroupService('LOAI_BENH_AN', 'LoaiBenhAn')"
                        >
                          <v-icon size="32"> mdi-plus </v-icon>
                        </v-btn>
                      </template>
                      <template v-slot:append-item>
                        <div v-intersect="endIntersect('LOAI_BENH_AN')" />
                      </template>
                    </v-autocomplete>
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                    lg="4"
                    class="pb-0"
                  >
                    <v-autocomplete
                      v-model="formPayload.LoaiThanhToan"
                      autocomplete="off"
                      :menu-icon="props.isCreate || props.isUpdate ? 'mdi-chevron-down' : null"
                      :chips="!props.isCreate && !props.isUpdate"
                      :items="autocompleteGroupService?.LOAI_THANH_TOAN?.items || []"
                      label="Loại thanh toán"
                      placeholder="Chọn loại thanh toán"
                      multiple
                      item-title="name"
                      item-value="id"
                      :loading="autocompleteGroupService?.LOAI_THANH_TOAN?.loading || false"
                      :rules="[formRules.required]"
                    >
                      <template #label>
                        <div class="d-flex align-center justify-start w-100">
                          <span>
                            Loại thanh toán
                            <span
                              v-if="props.isCreate || props.isUpdate"
                              class="text-red-darken-3"
                            >
                              *
                            </span>
                          </span>
                        </div>
                      </template>
                      <template
                        v-if="props.isCreate || props.isUpdate"
                        #append
                      >
                        <v-btn
                          icon
                          rounded="lg"
                          class="text-body-1 font-weight-medium"
                          @click="onCreateGroupService('LOAI_THANH_TOAN', 'LoaiThanhToan')"
                        >
                          <v-icon size="32"> mdi-plus </v-icon>
                        </v-btn>
                      </template>
                      <template v-slot:append-item>
                        <div v-intersect="endIntersect('LOAI_THANH_TOAN')" />
                      </template>
                    </v-autocomplete>
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                    lg="5"
                    class="pt-0"
                  >
                    <div class="d-flex align-center justify-space-between flex-wrap h-100">
                      <v-checkbox
                        :model-value="formPayload.IsQLSoLo"
                        label="QL số lô"
                        hide-details
                        density="compact"
                        :color="formPayload.IsQLSoLo ? 'erp-brand-700' : ''"
                        @click="formPayload.IsQLSoLo = !formPayload.IsQLSoLo"
                      />
                      <v-checkbox
                        :model-value="formPayload.IsQLHanDung"
                        label="QL hạn dùng"
                        hide-details
                        density="compact"
                        :color="formPayload.IsQLHanDung ? 'erp-brand-700' : ''"
                        @click="formPayload.IsQLHanDung = !formPayload.IsQLHanDung"
                      />
                      <v-checkbox
                        :model-value="formPayload.IsSendBYT"
                        label="Gửi BYT"
                        hide-details
                        density="compact"
                        :color="formPayload.IsSendBYT ? 'erp-brand-700' : ''"
                        @click="formPayload.IsSendBYT = !formPayload.IsSendBYT"
                      />
                      <v-checkbox
                        :model-value="formPayload.IsHienThiWeb"
                        label="Hiển thị trên web"
                        hide-details
                        density="compact"
                        :color="formPayload.IsHienThiWeb ? 'erp-brand-700' : ''"
                        @click="formPayload.IsHienThiWeb = !formPayload.IsHienThiWeb"
                      />
                    </div>
                  </v-col>

                  <v-col
                    cols="12"
                    md="12"
                    lg="12"
                    class="pb-0"
                  >
                    <v-textarea
                      v-model="formPayload.GhiChu"
                      label="Ghi chú"
                      placeholder="Nhập ghi chú"
                    />
                  </v-col>

                  <v-col
                    cols="12"
                    md="12"
                    lg="12"
                    class="pt-0 d-flex align-center justify-start ga-4"
                  >
                    <v-checkbox
                      :model-value="formPayload.IsHangHoaKeDon"
                      label="Thuốc kê đơn"
                      hide-details
                      density="compact"
                      true-icon="custom-circle-check"
                      false-icon="mdi-radiobox-blank"
                      :color="formPayload.IsHangHoaKeDon ? 'erp-brand-700' : ''"
                      @click="formPayload.IsHangHoaKeDon = !formPayload.IsHangHoaKeDon"
                    />
                    <v-checkbox
                      :model-value="formPayload.IsThau"
                      label="Thuốc đấu thầu"
                      hide-details
                      density="compact"
                      true-icon="custom-circle-check"
                      false-icon="mdi-radiobox-blank"
                      :color="formPayload.IsThau ? 'erp-brand-700' : ''"
                      @click="formPayload.IsThau = !formPayload.IsThau"
                    />
                  </v-col>
                </v-row>
              </CommonFieldset>

              <CommonFieldset
                v-if="formPayload.IsThau"
                title="Thông tin thầu"
                class="pb-6 mt-10"
              >
                <v-row>
                  <v-col
                    cols="12"
                    md="6"
                    lg="3"
                    class="pb-0"
                  >
                    <v-number-input
                      v-model="formPayload.NamThau"
                      placeholder="Nhập năm thầu"
                      :rules="[formRules.required]"
                      :control-variant="!props.isCreate && !props.isUpdate ? 'hidden' : null"
                    >
                      <template #label>
                        <div class="d-flex align-center justify-start w-100">
                          <span>
                            Năm thầu
                            <span
                              v-if="props.isCreate || props.isUpdate"
                              class="text-red-darken-3"
                            >
                              *
                            </span>
                          </span>
                        </div>
                      </template>
                    </v-number-input>
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                    lg="3"
                    class="pb-0"
                  >
                    <v-text-field
                      v-model="formPayload.NhomThau"
                      placeholder="Nhập nhóm thầu"
                      :rules="[formRules.required]"
                    >
                      <template #label>
                        <div class="d-flex align-center justify-start w-100">
                          <span>
                            Nhóm thầu
                            <span
                              v-if="props.isCreate || props.isUpdate"
                              class="text-red-darken-3"
                            >
                              *
                            </span>
                          </span>
                        </div>
                      </template>
                    </v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                    lg="3"
                    class="pb-0"
                  >
                    <v-number-input
                      v-model="formPayload.SoNgayVuotThau"
                      label="Số ngày cảnh báo vượt thầu"
                      placeholder="Nhập số ngày cảnh báo vượt thầu"
                      :control-variant="!props.isCreate && !props.isUpdate ? 'hidden' : null"
                    />
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                    lg="3"
                    class="pb-0"
                  >
                    <v-number-input
                      v-model="formPayload.SoLuongTrungThau"
                      placeholder="Nhập số lượng trúng thầu"
                      :rules="[formRules.required]"
                      :control-variant="!props.isCreate && !props.isUpdate ? 'hidden' : null"
                    >
                      <template #label>
                        <div class="d-flex align-center justify-start w-100">
                          <span>
                            Số lượng trúng thầu
                            <span
                              v-if="props.isCreate || props.isUpdate"
                              class="text-red-darken-3"
                            >
                              *
                            </span>
                          </span>
                        </div>
                      </template>
                    </v-number-input>
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                    lg="3"
                    class="pb-0"
                  >
                    <v-text-field
                      v-model="formPayload.ThongTinHopDong"
                      label="Thông tin hợp đồng"
                      placeholder="Nhập thông tin hợp đồng"
                    />
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                    lg="3"
                    class="pb-0"
                  >
                    <v-text-field
                      v-model="formPayload.LoaiThau"
                      placeholder="Nhập loại thầu"
                      :rules="[formRules.required]"
                    >
                      <template #label>
                        <div class="d-flex align-center justify-start w-100">
                          <span>
                            Loại thầu
                            <span
                              v-if="props.isCreate || props.isUpdate"
                              class="text-red-darken-3"
                            >
                              *
                            </span>
                          </span>
                        </div>
                      </template>
                    </v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                    lg="3"
                    class="pb-0"
                  >
                    <v-text-field
                      v-model="formPayload.GoiThau"
                      placeholder="Nhập gói thầu"
                      :rules="[formRules.required]"
                    >
                      <template #label>
                        <div class="d-flex align-center justify-start w-100">
                          <span>
                            Gói thầu
                            <span
                              v-if="props.isCreate || props.isUpdate"
                              class="text-red-darken-3"
                            >
                              *
                            </span>
                          </span>
                        </div>
                      </template>
                    </v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                    lg="3"
                    class="pb-0"
                  >
                    <v-text-field
                      v-model="formPayload.ThongTinThau"
                      label="Thông tin thầu"
                      placeholder="Nhập thông tin thầu"
                    />
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                    lg="3"
                    class="pb-0"
                  >
                    <v-text-field
                      v-model="formPayload.SoQuyetDinh"
                      label="Số quyết định"
                      placeholder="Nhập số quyết định"
                      :rules="[formRules.required]"
                    >
                      <template #label>
                        <div class="d-flex align-center justify-start w-100">
                          <span>
                            Số quyết định
                            <span
                              v-if="props.isCreate || props.isUpdate"
                              class="text-red-darken-3"
                            >
                              *
                            </span>
                          </span>
                        </div>
                      </template>
                    </v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                    lg="3"
                    class="pb-0"
                  >
                    <v-date-input
                      v-model="formPayload.NgayQuyetDinh"
                      placeholder="Chọn ngày quyết định"
                      :append-inner-icon="props.isCreate || props.isUpdate ? 'mdi-calendar-outline' : ''"
                      input-format="DD/MM/YYYY"
                      dense
                      :rules="[formRules.required]"
                    >
                      <template #label>
                        <div class="d-flex align-center justify-start w-100">
                          <span>
                            Ngày quyết định
                            <span
                              v-if="props.isCreate || props.isUpdate"
                              class="text-red-darken-3"
                            >
                              *
                            </span>
                          </span>
                        </div>
                      </template>
                    </v-date-input>
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                    lg="3"
                    class="pb-0"
                  >
                    <v-date-input
                      v-model="formPayload.NgayHieuLuc"
                      placeholder="Chọn hiệu lực trúng thầu từ"
                      :append-inner-icon="props.isCreate || props.isUpdate ? 'mdi-calendar-outline' : ''"
                      input-format="DD/MM/YYYY"
                      dense
                      :rules="[formRules.required]"
                    >
                      <template #label>
                        <div class="d-flex align-center justify-start w-100">
                          <span>
                            Hiệu lực trúng thầu từ
                            <span
                              v-if="props.isCreate || props.isUpdate"
                              class="text-red-darken-3"
                            >
                              *
                            </span>
                          </span>
                        </div>
                      </template>
                    </v-date-input>
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                    lg="3"
                    class="pb-0"
                  >
                    <v-date-input
                      v-model="formPayload.NgayHetHieuLuc"
                      placeholder="Chọn hiệu lực trúng thầu đến"
                      :append-inner-icon="props.isCreate || props.isUpdate ? 'mdi-calendar-outline' : ''"
                      input-format="DD/MM/YYYY"
                      dense
                      :rules="[formRules.required]"
                    >
                      <template #label>
                        <div class="d-flex align-center justify-start w-100">
                          <span>
                            Hiệu lực trúng thầu đến
                            <span
                              v-if="props.isCreate || props.isUpdate"
                              class="text-red-darken-3"
                            >
                              *
                            </span>
                          </span>
                        </div>
                      </template>
                    </v-date-input>
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                    lg="4"
                    class="pb-0"
                  >
                    <v-number-input
                      v-model="formPayload.DonGia"
                      placeholder="Nhập đơn giá"
                      :control-variant="!props.isCreate && !props.isUpdate ? 'hidden' : null"
                      :rules="[formRules.required]"
                    >
                      <template #label>
                        <div class="d-flex align-center justify-start w-100">
                          <span>
                            Đơn giá
                            <span
                              v-if="props.isCreate || props.isUpdate"
                              class="text-red-darken-3"
                            >
                              *
                            </span>
                          </span>
                        </div>
                      </template>
                    </v-number-input>
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                    lg="4"
                    class="pb-0"
                  >
                    <v-autocomplete
                      v-model="formPayload.PhuThuBaoHiem"
                      autocomplete="off"
                      :menu-icon="props.isCreate || props.isUpdate ? 'mdi-chevron-down' : null"
                      :items="autocompleteGroupService?.PHU_THU_BHYT?.items || []"
                      label="Phụ thu Bảo Hiểm"
                      placeholder="Chọn phụ thu bảo hiểm"
                      item-title="name"
                      item-value="id"
                      :loading="autocompleteGroupService?.PHU_THU_BHYT?.loading || false"
                      :rules="[formRules.required]"
                    >
                      <template #label>
                        <div class="d-flex align-center justify-start w-100">
                          <span>
                            Phụ thu Bảo Hiểm
                            <span
                              v-if="props.isCreate || props.isUpdate"
                              class="text-red-darken-3"
                            >
                              *
                            </span>
                          </span>
                        </div>
                      </template>
                      <template
                        v-if="props.isCreate || props.isUpdate"
                        #append
                      >
                        <v-btn
                          icon
                          rounded="lg"
                          class="text-body-1 font-weight-medium"
                          @click="createGroupService = 'PHU_THU_BHYT'"
                        >
                          <v-icon size="32"> mdi-plus </v-icon>
                        </v-btn>
                      </template>
                      <template v-slot:append-item>
                        <div v-intersect="endIntersect('PHU_THU_BHYT')" />
                      </template>
                    </v-autocomplete>
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                    lg="4"
                    class="pb-0"
                  >
                    <v-autocomplete
                      v-model="formPayload.DonViThau"
                      autocomplete="off"
                      :menu-icon="props.isCreate || props.isUpdate ? 'mdi-chevron-down' : null"
                      :items="autocompleteGroupService?.DON_VI_THAU?.items || []"
                      label="Đơn vị thầu"
                      placeholder="Chọn đơn vị thầu"
                      item-title="name"
                      item-value="id"
                      :loading="autocompleteGroupService?.DON_VI_THAU?.loading || false"
                    >
                      <template
                        v-if="props.isCreate || props.isUpdate"
                        #append
                      >
                        <v-btn
                          icon
                          rounded="lg"
                          class="text-body-1 font-weight-medium"
                          @click="createGroupService = 'DON_VI_THAU'"
                        >
                          <v-icon size="32"> mdi-plus </v-icon>
                        </v-btn>
                      </template>
                      <template v-slot:append-item>
                        <div v-intersect="endIntersect('DON_VI_THAU')" />
                      </template>
                    </v-autocomplete>
                  </v-col>
                </v-row>
              </CommonFieldset>

              <CommonFieldset
                title="Thông tin đơn vị tính và quy đổi"
                class="pb-6 mt-10"
              >
                <v-row>
                  <v-col
                    cols="12"
                    md="6"
                    lg="4"
                    class="pb-0"
                  >
                    <v-autocomplete
                      v-model="formPayload.DonViDGNN"
                      autocomplete="off"
                      :menu-icon="props.isCreate || props.isUpdate ? 'mdi-chevron-down' : null"
                      :items="autocompleteGroupService?.DON_VI_TINH?.items || []"
                      label="Đơn vị ĐGNN"
                      placeholder="Chọn đơn vị ĐGNN"
                      item-title="name"
                      item-value="id"
                      :loading="autocompleteGroupService?.DON_VI_TINH?.loading || false"
                      :rules="[formRules.required]"
                    >
                      <template #label>
                        <div class="d-flex align-center justify-start w-100">
                          <span>
                            Đơn vị ĐGNN
                            <span
                              v-if="props.isCreate || props.isUpdate"
                              class="text-red-darken-3"
                            >
                              *
                            </span>
                          </span>
                        </div>
                      </template>
                      <template
                        v-if="props.isCreate || props.isUpdate"
                        #append
                      >
                        <v-btn
                          icon
                          rounded="lg"
                          class="text-body-1 font-weight-medium"
                          @click="onCreateGroupService('DON_VI_TINH', 'DonViDGNN')"
                        >
                          <v-icon size="32"> mdi-plus </v-icon>
                        </v-btn>
                      </template>
                      <template v-slot:append-item>
                        <div v-intersect="endIntersect('DON_VI_TINH')" />
                      </template>
                    </v-autocomplete>
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                    lg="4"
                    class="pb-0"
                  >
                    <v-autocomplete
                      v-model="formPayload.DonViThuongDung"
                      autocomplete="off"
                      :menu-icon="props.isCreate || props.isUpdate ? 'mdi-chevron-down' : null"
                      :items="autocompleteGroupService?.DON_VI_TINH?.items || []"
                      label="Đơn vị thường dùng"
                      placeholder="Chọn đơn vị thường dùng"
                      item-title="name"
                      item-value="id"
                      :loading="autocompleteGroupService?.DON_VI_TINH?.loading || false"
                      :rules="[formRules.required]"
                    >
                      <template #label>
                        <div class="d-flex align-center justify-start w-100">
                          <span>
                            Đơn vị thường dùng
                            <span
                              v-if="props.isCreate || props.isUpdate"
                              class="text-red-darken-3"
                            >
                              *
                            </span>
                          </span>
                        </div>
                      </template>
                      <template
                        v-if="props.isCreate || props.isUpdate"
                        #append
                      >
                        <v-btn
                          icon
                          rounded="lg"
                          class="text-body-1 font-weight-medium"
                          @click="onCreateGroupService('DON_VI_TINH', 'DonViThuongDung')"
                        >
                          <v-icon size="32"> mdi-plus </v-icon>
                        </v-btn>
                      </template>
                      <template v-slot:append-item>
                        <div v-intersect="endIntersect('DON_VI_TINH')" />
                      </template>
                    </v-autocomplete>
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                    lg="4"
                    class="pb-0"
                  >
                    <v-autocomplete
                      v-model="formPayload.DonViNhap"
                      autocomplete="off"
                      :menu-icon="props.isCreate || props.isUpdate ? 'mdi-chevron-down' : null"
                      :items="autocompleteGroupService?.DON_VI_TINH?.items || []"
                      label="Đơn vị nhập"
                      placeholder="Chọn đơn vị nhập"
                      item-title="name"
                      item-value="id"
                      :loading="autocompleteGroupService?.DON_VI_TINH?.loading || false"
                      :rules="[formRules.required]"
                    >
                      <template #label>
                        <div class="d-flex align-center justify-start w-100">
                          <span>
                            Đơn vị nhập
                            <span
                              v-if="props.isCreate || props.isUpdate"
                              class="text-red-darken-3"
                            >
                              *
                            </span>
                          </span>
                        </div>
                      </template>
                      <template
                        v-if="props.isCreate || props.isUpdate"
                        #append
                      >
                        <v-btn
                          icon
                          rounded="lg"
                          class="text-body-1 font-weight-medium"
                          @click="onCreateGroupService('DON_VI_TINH', 'DonViNhap')"
                        >
                          <v-icon size="32"> mdi-plus </v-icon>
                        </v-btn>
                      </template>
                      <template v-slot:append-item>
                        <div v-intersect="endIntersect('DON_VI_TINH')" />
                      </template>
                    </v-autocomplete>
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                    lg="4"
                    class="pb-0"
                  >
                    <v-text-field
                      v-model="formPayload.Barcode"
                      label="Mã vạch"
                      placeholder="Nhập mã vạch"
                    />
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                    lg="4"
                    class="pb-0"
                  >
                    <v-number-input
                      v-model="formPayload.GiaBHYT"
                      label="Giá bảo hiểm"
                      placeholder="Nhập giá bảo hiểm"
                      :control-variant="!props.isCreate && !props.isUpdate ? 'hidden' : 'default'"
                    >
                      <template #label>
                        <div class="d-flex align-center justify-start w-100">
                          <span> Giá bảo hiểm </span>
                        </div>
                      </template>
                    </v-number-input>
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                    lg="4"
                    class="pb-0"
                  >
                    <v-number-input
                      v-model="formPayload.GiaDichVu"
                      label="Giá dịch vụ"
                      placeholder="Nhập giá dịch vụ"
                      :control-variant="!props.isCreate && !props.isUpdate ? 'hidden' : 'default'"
                    >
                      <template #label>
                        <div class="d-flex align-center justify-start w-100">
                          <span> Giá dịch vụ </span>
                        </div>
                      </template>
                    </v-number-input>
                  </v-col>
                </v-row>
              </CommonFieldset>

              <CommonFieldset
                title="Hướng dẫn sử dụng"
                class="pb-6 mt-10"
              >
                <v-row>
                  <v-col
                    cols="12"
                    md="6"
                    lg="3"
                    class="pb-0"
                  >
                    <v-text-field
                      v-model="formPayload.LuongDung"
                      label="Lượng dùng"
                      placeholder="Nhập lượng dùng"
                    />
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                    lg="3"
                    class="pb-0"
                  >
                    <v-text-field
                      v-model="formPayload.DonViDung"
                      label="Đơn vị dùng"
                      placeholder="Nhập đơn vị dùng"
                    />
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                    lg="3"
                    class="pb-0"
                  >
                    <v-text-field
                      v-model="formPayload.LanDung"
                      label="Lần dùng"
                      placeholder="Nhập lần dùng"
                    />
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                    lg="3"
                    class="pb-0"
                  >
                    <v-text-field
                      v-model="formPayload.MoiLanDung"
                      label="Mỗi lần"
                      placeholder="Nhập mỗi lần"
                    />
                  </v-col>
                </v-row>
              </CommonFieldset>
            </v-col>
          </v-row>
        </v-tabs-window-item>
        <v-tabs-window-item value="DINH_MUC_TON">
          <v-data-table
            :headers="medicalProductStorageHeaders"
            :page="currentPage"
            :items-per-page="currentLimit"
            :items="medicalProductStorages"
            class="mt-3"
            fixed-header
            hover
            :loading="isLoading"
            :items-length="medicalProductStorages.length"
            disable-sort
            style="height: calc(100dvh - 300px)"
            :no-data-text="'Không có dữ liệu'"
          >
            <template v-slot:item.max_quantity="{ item }">
              <span v-if="item.is_unlimited"> Không giới hạn </span>
              <span v-else> {{ typeof item.max_quantity === 'number' ? item.max_quantity : 'Không có dữ liệu' }} </span>
            </template>

            <template v-slot:bottom>
              <div class="d-flex align-center w-100 pa-2 ga-2">
                <template v-if="!$vuetify.display.smAndDown">
                  <span> Số dòng trên 1 trang </span>
                  <v-select
                    :model-value="currentLimit"
                    :items="ITEM_PER_PAGES"
                    variant="outlined"
                    rounded="lg"
                    max-width="100px"
                    hide-details
                    density="compact"
                  />
                  <span>
                    Trong tổng số: <strong>{{ medicalProductStorages.length }}</strong> bản ghi
                  </span>
                </template>
                <v-spacer />
                <v-pagination
                  v-model="currentPage"
                  :length="Math.ceil(medicalProductStorages.length / currentLimit)"
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
    </v-form>

    <v-overlay
      :model-value="props.isLoading"
      class="d-flex justify-center align-center"
      persistent
    >
      <v-progress-circular
        indeterminate
        size="80"
      />
    </v-overlay>

    <FormGroupService
      :visible="createGroupService !== null"
      :type="createGroupService"
      :is-new="true"
      @close="createGroupService = null"
      @success="onSuccessDropdown"
    />

    <v-dialog
      v-model="isSetting"
      max-width="850"
      persistent
    >
      <v-form
        ref="formRef"
        @submit.prevent="onFormSettingSubmit"
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

          <div class="h-100">
            <div class="pe-6 ps-6 pb-4">
              <div class="text-subtitle-2 d-flex align-center ga-2">
                <v-icon
                  size="20"
                  style="margin-top: -2px"
                >
                  mdi-information-outline
                </v-icon>
                <p class="font-weight-regular">
                  Định mức này được tính cho các kho đã cài đặt lưu tồn với nhóm thuốc:
                  <span class="font-weight-medium">{{ props.medicalProduct?.NhomHangHoa?.name }}</span>
                </p>
              </div>
            </div>

            <div
              class="overflow-y-auto erp-scrollbar mt-2 pe-4 me-2 ps-6 pb-4 mb-4"
              style="max-height: 55dvh"
            >
              <CommonFieldset
                v-for="item in medicalProductStoragesForm"
                :key="item.id"
                class="mt-2"
                :title="item.name"
              >
                <v-row>
                  <v-col
                    cols="12"
                    sm="12"
                    md="6"
                    lg="6"
                    class="pb-1"
                  >
                    <v-number-input
                      v-model="item.min_quantity"
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
                    class="pb-1"
                  >
                    <v-number-input
                      v-model="item.max_quantity"
                      label="Số lượng tối đa"
                      placeholder="0"
                      :rules="item.is_unlimited ? [] : [formRules.required]"
                    >
                      <template
                        v-if="!item.is_unlimited"
                        #label
                      >
                        <div class="d-flex align-center justify-start w-100">
                          <span>
                            Số lượng tối đa
                            <span class="text-red-darken-3"> * </span>
                          </span>
                        </div>
                      </template>

                      <template #details>
                        <div
                          class="d-flex align-center justify-start ms-auto mb-2 pe-2 me-auto mt-n2"
                          style="order: -1; margin-left: -14px !important"
                        >
                          <v-checkbox
                            v-model="item.is_unlimited"
                            label="Không giới hạn"
                            style="margin-left: -2px"
                            class="flex-grow-1 border border-opacity-50 border-t-0 rounded-b-lg px-2 pe-4"
                            hide-details
                            density="compact"
                            true-icon="custom-circle-check"
                            false-icon="mdi-radiobox-blank"
                            :color="item.is_unlimited ? 'erp-brand-700' : ''"
                          >
                            <template #label>
                              <span style="margin-left: 3px; margin-top: 1px"> Không giới hạn </span>
                            </template>
                          </v-checkbox>
                        </div>
                      </template>
                      <template #message> </template>
                    </v-number-input>
                  </v-col>
                </v-row>
              </CommonFieldset>
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
                :loading="isLoadingMedicalProductStorageHandler"
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
          </div>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
  import type { SubmitEventPromise, DataTableHeader } from 'vuetify'
  import { MEDICAL_PRODUCT_TYPES } from '~/constants/core.constants'
  import type { IGroupService, IGroupServiceType } from '~/types/core.types'
  import type { IMedicalProduct, IMedicalProductFormPayload, IMedicalProductType } from '~/types/medical_product.types'
  import { ITEM_PER_PAGES } from '~/constants/core.constants'

  type Props = {
    pageLabel?: string
    isLoading?: boolean
    isUpdate?: boolean
    isCreate?: boolean
    medicalProduct?: IMedicalProduct | null
  }

  const { selectedMedicalProductType } = useAuth()

  const currentLabel = computed(() => {
    return MEDICAL_PRODUCT_TYPES.find((item) => item.value === selectedMedicalProductType.value)?.label?.toLowerCase()
  })

  const medicalProductHooks = useMedicalProduct()

  type IMedicalProductStorage = {
    id?: number | null
    name?: string | null
    code?: string | null
    medical_product_group_id?: number | null
    min_quantity?: number | null
    max_quantity?: number | null
    is_unlimited?: boolean | null
  }

  const currentPage = ref(1)
  const isSetting = ref(false)
  const currentLimit = ref(10)
  const medicalProductStorages = ref<IMedicalProductStorage[]>([])
  const medicalProductStoragesForm = ref<IMedicalProductStorage[]>([])
  const isLoadingMedicalProductStorage = ref(false)
  const isLoadingMedicalProductStorageHandler = ref(false)

  watchEffect(() => {
    if (isSetting.value) {
      medicalProductStoragesForm.value = JSON.parse(JSON.stringify(medicalProductStorages.value))
    } else {
      medicalProductStoragesForm.value = []
    }
  })

  const formLabel = computed(() => {
    return {
      TenHangHoa: `Tên ${currentLabel.value}`,
      BYT_TenHangHoa: `Tên ${currentLabel.value} theo BYT`,
      MaHangHoa: `Mã ${currentLabel.value}`,
      BYT_MaHangHoa: `Mã ${currentLabel.value} BYT`,
      PhanLoaiHangHoa: `Phân loại ${currentLabel.value}`,
      NhomHangHoa: `Nhóm ${currentLabel.value}`,
      MaHangHoaLienKet: `Mã ${currentLabel.value} liên kết`,
    }
  })

  const medicalProductStorageHeaders = ref<DataTableHeader[]>([
    {
      title: 'Tên kho',
      key: 'name',
    },
    {
      title: 'Tồn tối thiểu',
      key: 'min_quantity',
    },
    {
      title: 'Tồn tối đa',
      key: 'max_quantity',
    },
  ])

  const tabActive = ref('HANG_HOA')
  const tabItems = ref([
    {
      title: `Thông tin ${currentLabel.value}`,
      value: 'HANG_HOA',
    },
    {
      title: 'Định mức tồn',
      value: 'DINH_MUC_TON',
    },
  ])

  const props = withDefaults(defineProps<Props>(), {
    isLoading: false,
    isUpdate: false,
    isCreate: false,
    medicalProduct: null,
  })

  const createGroupService = ref<IGroupServiceType | null>(null)
  const createModel = ref<string | null>(null)

  const formEmit = defineEmits<{
    (e: 'submit', payload: IMedicalProductFormPayload): void
    (e: 'update:preview', payload: boolean): void
    (e: 'update', payload: boolean): void
  }>()

  const autocompleteGroupService = ref<{
    [x in IGroupServiceType]?: {
      loading: boolean
      page: number
      count: number
      items: IGroupService[]
      search?: string
    }
  }>({})

  const router = useRouter()
  const formRules = useFormRules()
  const warehouseHooks = useWarehouse()
  const { organizationSelected } = useAuth()
  const groupServiceHooks = useGroupService()

  const formPayload = ref<IMedicalProductFormPayload>({
    organization: organizationSelected.value?.id,
    LoaiHangHoa: selectedMedicalProductType.value as IMedicalProductType,
    source: 'SELF',
    delete_image: null,
    LoaiBenhAn: null,
    LoaiThanhToan: null,
    TenHangHoa: null,
    BYT_TenHangHoa: null,
    MaHangHoa: null,
    BYT_MaHangHoa: null,
    HamLuong: null,
    TenHoatChatSDK: null,
    QuyCach: null,
    SoNgayCanHan: null,
    DangBaoChe: null,
    SoDangKy: null,
    HoaHong: null,
    LoiNhuan: null,
    MaHangHoaLienKet: null,
    TiLeThanhToanBHYT: null,
    IsBHYT: null,
    ThongTu30: null,
    ThongTu40: null,
    MaACT: null,
    IsQLSoLo: null,
    IsQLHanDung: null,
    IsHienThiWeb: null,
    IsSendBYT: null,
    GhiChu: null,
    IsHangHoaKeDon: null,
    IsThau: null,
    NamThau: null,
    NhomThau: null,
    SoNgayVuotThau: null,
    SoLuongTrungThau: null,
    ThongTinHopDong: null,
    LoaiThau: null,
    GoiThau: null,
    ThongTinThau: null,
    SoQuyetDinh: null,
    NgayQuyetDinh: null,
    NgayHieuLuc: null,
    NgayHetHieuLuc: null,
    DonGia: null,
    Barcode: null,
    GiaBHYT: null,
    GiaDichVu: null,
    LuongDung: null,
    DonViDung: null,
    LanDung: null,
    MoiLanDung: null,
    LoaiDangKy: null,
    NhomHangHoa: null,
    HoatChat: null,
    DuongDung: null,
    CongTyDangKy: null,
    NuocSanXuat: null,
    NhaSanXuat: null,
    TrangThai: null,
    PhanLoaiHangHoa: null,
    TenCSKCB: null,
    PhanLoaiCSKCB: null,
    PhuThuBaoHiem: null,
    DonViThau: null,
    DonViDGNN: null,
    DonViThuongDung: null,
    DonViNhap: null,
    image_file: null,
  })

  watchEffect(async () => {
    if (props.medicalProduct) {
      Object.assign(formPayload.value, props.medicalProduct)
      formPayload.value['source'] = formPayload.value['source']?.['value']

      const id = props.medicalProduct?.id
      isLoadingMedicalProductStorage.value = true
      const response = await medicalProductHooks.onFetchWarehouseByMedicalProductGroup<IMedicalProductStorage[]>(id)
      isLoadingMedicalProductStorage.value = false

      if (response.length > 0) {
        medicalProductStorages.value = JSON.parse(JSON.stringify(response))
      }
    }
  })

  const { $toast } = useNuxtApp()

  const onFormSettingSubmit = async (formEvent: SubmitEventPromise) => {
    const results = await formEvent
    if (!results.valid) {
      return
    }

    try {
      isLoadingMedicalProductStorageHandler.value = true
      const result = await warehouseHooks.onSaveWarehouseMedicalProductStorage(
        medicalProductStoragesForm.value.map((item) => ({
          warehouse: item.id,
          medical_product: props.medicalProduct?.id,
          min_quantity: item.min_quantity || 0,
          max_quantity: item.max_quantity || 0,
          is_unlimited: item.is_unlimited,
        }))
      )
      if (result.success) {
        $toast.success('Cập nhật định mức tồn thành công')
        medicalProductStorages.value = medicalProductStorages.value.map((item) => {
          const currentItem = medicalProductStoragesForm.value.find((formItem) => formItem.id === item.id)
          if (!currentItem) {
            return item
          }

          return {
            ...item,
            min_quantity: currentItem.min_quantity,
            max_quantity: currentItem.max_quantity,
            is_unlimited: currentItem.is_unlimited,
          }
        })
        isSetting.value = false
      } else {
        $toast.error(result.message)
      }
    } catch (error) {
      $toast.error('Hệ thống đang gặp sự cố, vui lòng thử lại sau')
    } finally {
      isLoadingMedicalProductStorageHandler.value = false
    }
  }

  const onFormSubmit = async (formEvent: SubmitEventPromise) => {
    const results = await formEvent

    if (!results.valid) {
      return
    }
    const clone = JSON.stringify(formPayload.value)
    const _formPayload = { ...JSON.parse(clone) }
    _formPayload['image'] = _formPayload['image_file']
    _formPayload['NgayQuyetDinh'] = _formPayload['NgayQuyetDinh']
      ? formatDate(_formPayload['NgayQuyetDinh'], 'yyyy-MM-dd')
      : null
    _formPayload['NgayHieuLuc'] = _formPayload['NgayHieuLuc']
      ? formatDate(_formPayload['NgayHieuLuc'], 'yyyy-MM-dd')
      : null
    _formPayload['NgayHetHieuLuc'] = _formPayload['NgayHetHieuLuc']
      ? formatDate(_formPayload['NgayHetHieuLuc'], 'yyyy-MM-dd')
      : null

    const idNames = [
      'NhomHangHoa',
      'TrangThai',
      'organization',
      'DuongDung',
      'DonViDGNN',
      'DonViThuongDung',
      'DonViNhap',
      'CongTyDangKy',
      'NuocSanXuat',
      'NhaSanXuat',
      'PhanLoaiHangHoa',
      'TenCSKCB',
      'PhanLoaiCSKCB',
      'LoaiBenhAn',
      'LoaiThanhToan',
      'PhuThuBaoHiem',
      'DonViThau',
      'LoaiDangKy',
      'HoatChat',
      'LoaiHangHoa',
      'DangBaoChe',
    ]
    Object.entries(_formPayload).forEach(([key, value]) => {
      if (['id', 'created_by', 'updated_by', 'created_at', 'updated_at'].includes(key)) {
        delete _formPayload[key]
      } else if (idNames.includes(key)) {
        if (value && typeof value === 'object' && 'id' in value) {
          _formPayload[key] = value?.['id']
        } else if (value && typeof value === 'object' && Array.isArray(value)) {
          _formPayload[key] = value.map((item) => item?.['id'] || item)
        } else if (value && typeof value === 'object' && 'value' in value) {
          _formPayload[key] = value?.['value']
        } else {
          _formPayload[key] = value
        }
      }
    })
    if ('image_file' in _formPayload) {
      _formPayload['image'] = _formPayload['image_file']
      delete _formPayload['image_file']
    }
    formEmit('submit', _formPayload)
  }

  const onButtonBack = () => {
    if (props.isCreate || !props.isUpdate) {
      router.back()
    } else {
      Object.assign(formPayload.value, props.medicalProduct)
      formEmit('update', false)
    }
  }

  const onCreateGroupService = (type: IGroupServiceType, model: string) => {
    createGroupService.value = type
    createModel.value = model
  }

  const onSuccessDropdown = async (groupServiceData: IGroupService) => {
    if (!Object.keys(autocompleteGroupService.value).includes(createGroupService.value)) {
      autocompleteGroupService.value[createGroupService.value] = {
        loading: false,
        items: [],
        page: 1,
        count: 0,
        search: '',
      }
    }
    autocompleteGroupService.value[createGroupService.value].items.unshift(groupServiceData)
    if (['LoaiBenhAn', 'LoaiThanhToan'].includes(createModel.value)) {
      if (formPayload.value[createModel.value]?.length > 0) {
        formPayload.value[createModel.value].push(groupServiceData)
      } else {
        formPayload.value[createModel.value] = [groupServiceData]
      }
    } else {
      formPayload.value[createModel.value] = groupServiceData.id
    }
    createGroupService.value = null
    createModel.value = null
  }

  const endIntersect = (type: IGroupServiceType, isReload: boolean = false) => {
    return async (isIntersecting: boolean) => {
      if (isIntersecting) {
        if (!Object.keys(autocompleteGroupService.value).includes(type)) {
          autocompleteGroupService.value[type] = {
            loading: false,
            items: [],
            page: 1,
            count: 0,
            search: '',
          }
        }

        const itemsCount = autocompleteGroupService.value[type].items.length

        if (itemsCount > 0 && !isReload) {
          return
        }

        if (isReload) {
          autocompleteGroupService.value[type].items = []
          autocompleteGroupService.value[type].count = 0
          autocompleteGroupService.value[type].page = 1
        }

        autocompleteGroupService.value[type].loading = true
        const result = await groupServiceHooks.onFetchGroupServiceAutocomplete(1, type, -1)
        autocompleteGroupService.value[type].items = result.items
        autocompleteGroupService.value[type].loading = false
      }
    }
  }
</script>
