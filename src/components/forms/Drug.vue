<template>
  <div class="erp-drug-form">
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
                  v-model="formPayload.TenThuoc"
                  placeholder="Nhập tên thuốc"
                  :rules="[formRules.required]"
                >
                  <template #label>
                    <div class="d-flex align-center justify-start w-100">
                      <span>
                        Tên thuốc
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
                  v-model="formPayload.BYT_TenThuoc"
                  placeholder="Nhập tên thuốc"
                  :rules="[formRules.required]"
                >
                  <template #label>
                    <div class="d-flex align-center justify-start w-100">
                      <span>
                        Tên thuốc theo BYT
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
                  v-model="formPayload.MaThuoc"
                  label="Mã thuốc"
                  placeholder="Nhập mã thuốc"
                />
              </v-col>

              <v-col
                cols="12"
                md="6"
                lg="3"
                class="pb-0"
              >
                <v-text-field
                  v-model="formPayload.BYT_MaThuoc"
                  placeholder="Nhập mã thuốc BYT"
                  :rules="[formRules.required]"
                >
                  <template #label>
                    <div class="d-flex align-center justify-start w-100">
                      <span>
                        Mã thuốc BYT
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
                <v-autocomplete
                  v-model="formPayload.NhomThuoc"
                  autocomplete="off"
                  :menu-icon="props.isCreate || props.isUpdate ? 'mdi-chevron-down' : null"
                  :items="autocompleteGroupService?.NHOM_THUOC?.items || []"
                  label="Nhóm thuốc"
                  placeholder="Chọn nhóm thuốc"
                  item-title="name"
                  item-value="id"
                  :loading="autocompleteGroupService?.NHOM_THUOC?.loading || false"
                  :rules="[formRules.required]"
                >
                  <template #label>
                    <div class="d-flex align-center justify-start w-100">
                      <span>
                        Nhóm thuốc
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
                      class="text-body-1 font-weight-medium"
                      @click="createGroupService = 'NHOM_THUOC'"
                    >
                      <v-icon size="32"> mdi-plus </v-icon>
                    </v-btn>
                  </template>
                  <template v-slot:append-item>
                    <div v-intersect="endIntersect('NHOM_THUOC')" />
                  </template>
                </v-autocomplete>
              </v-col>

              <v-col
                cols="12"
                md="6"
                lg="3"
                class="pb-0"
              >
                <v-text-field
                  v-model="formPayload.LoaiHang"
                  label="Loại hàng"
                  placeholder="Nhập loại hàng"
                />
              </v-col>

              <v-col
                cols="12"
                md="6"
                lg="3"
                class="pb-0"
              >
                <v-text-field
                  v-model="formPayload.Barcode"
                  label="Mã barcode"
                  placeholder="Nhập mã barcode"
                />
              </v-col>

              <v-col
                cols="12"
                md="6"
                lg="3"
                class="pb-0"
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
                  <template
                    v-if="props.isCreate || props.isUpdate"
                    #append
                  >
                    <v-btn
                      icon
                      class="text-body-1 font-weight-medium"
                      @click="createGroupService = 'HOAT_CHAT'"
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
                cols="12"
                md="6"
                lg="3"
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
                lg="3"
                class="pb-0"
              >
                <v-text-field
                  v-model="formPayload.TenHoatChatSDK"
                  label="Tên hoạt chất SDK"
                  placeholder="Nhập tên hoạt chất SDK"
                />
              </v-col>

              <v-col
                cols="12"
                md="6"
                lg="3"
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
                lg="3"
                class="pb-0"
              >
                <v-text-field
                  v-model="formPayload.SoNgayCanHan"
                  label="Số ngày CH (ngày)"
                  placeholder="Nhập số ngày CH (ngày)"
                />
              </v-col>

              <v-col
                cols="12"
                md="6"
                lg="3"
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
                      class="text-body-1 font-weight-medium"
                      @click="createGroupService = 'DON_VI_TINH'"
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
                lg="3"
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
                      class="text-body-1 font-weight-medium"
                      @click="createGroupService = 'DON_VI_TINH'"
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
                lg="3"
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
                      class="text-body-1 font-weight-medium"
                      @click="createGroupService = 'DON_VI_TINH'"
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
                lg="3"
                class="pb-0"
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
                      class="text-body-1 font-weight-medium"
                      @click="createGroupService = 'DUONG_DUNG'"
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
                md="6"
                lg="3"
                class="pb-0"
              >
                <v-autocomplete
                  v-model="formPayload.CongTyDangKy"
                  autocomplete="off"
                  :menu-icon="props.isCreate || props.isUpdate ? 'mdi-chevron-down' : null"
                  :items="autocompleteGroupService?.CONG_TY_DANG_KY?.items || []"
                  label="Công ty Đăng ký"
                  placeholder="Chọn công ty đăng ký"
                  item-title="name"
                  item-value="id"
                  :loading="autocompleteGroupService?.CONG_TY_DANG_KY?.loading || false"
                >
                  <template
                    v-if="props.isCreate || props.isUpdate"
                    #append
                  >
                    <v-btn
                      icon
                      class="text-body-1 font-weight-medium"
                      @click="createGroupService = 'CONG_TY_DANG_KY'"
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
                lg="3"
                class="pb-0"
              >
                <v-text-field
                  v-model="formPayload.SoDangKy"
                  placeholder="Nhập số Đăng ký"
                  :rules="[formRules.required]"
                >
                  <template #label>
                    <div class="d-flex align-center justify-start w-100">
                      <span>
                        Số Đăng ký
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
                      <span>
                        Nước sản xuất
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
                      class="text-body-1 font-weight-medium"
                      @click="createGroupService = 'QUOC_GIA'"
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
                md="6"
                lg="3"
                class="pb-0"
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
                      <span>
                        Nhà sản xuất
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
                      class="text-body-1 font-weight-medium"
                      @click="createGroupService = 'NHA_SAN_XUAT'"
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
                <v-text-field
                  v-model="formPayload.DangBaoChe"
                  placeholder="Nhập dạng bào chế"
                  :rules="[formRules.required]"
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
                </v-text-field>
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
                <v-autocomplete
                  v-model="formPayload.PhanLoaiHangHoa"
                  autocomplete="off"
                  :menu-icon="props.isCreate || props.isUpdate ? 'mdi-chevron-down' : null"
                  :items="autocompleteGroupService?.PHAN_LOAI_HANG_HOA?.items || []"
                  label="Phân loại hàng hóa"
                  placeholder="Chọn phân loại hàng hóa"
                  item-title="name"
                  item-value="id"
                  :loading="autocompleteGroupService?.PHAN_LOAI_HANG_HOA?.loading || false"
                  :rules="[formRules.required]"
                >
                  <template #label>
                    <div class="d-flex align-center justify-start w-100">
                      <span>
                        Phân loại hàng hóa
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
                    <div v-intersect="endIntersect('PHAN_LOAI_HANG_HOA')" />
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
                  v-model="formPayload.LoiNhuan"
                  label="Lợi nhuận"
                  placeholder="Nhập lợi nhuận"
                  :control-variant="!props.isCreate && !props.isUpdate ? 'hidden' : null"
                />
              </v-col>

              <v-col
                cols="12"
                md="6"
                lg="3"
                class="pb-0"
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
                cols="12"
                md="6"
                lg="3"
                class="pb-0"
              >
                <v-autocomplete
                  v-model="formPayload.PhanLoaiThuoc"
                  autocomplete="off"
                  :menu-icon="props.isCreate || props.isUpdate ? 'mdi-chevron-down' : null"
                  label="Phân loại thuốc"
                  placeholder="Chọn phân loại thuốc"
                  :items="autocompleteGroupService?.PHAN_LOAI_THUOC?.items || []"
                  item-title="name"
                  item-value="id"
                  :loading="autocompleteGroupService?.PHAN_LOAI_THUOC?.loading || false"
                >
                  <template v-slot:append-item>
                    <div v-intersect="endIntersect('PHAN_LOAI_THUOC')" />
                  </template>
                </v-autocomplete>
              </v-col>

              <v-col
                cols="12"
                md="6"
                lg="3"
                class="pb-0"
              >
                <v-text-field
                  v-model="formPayload.MaThuocLienKet"
                  label="Mã thuốc liên kết"
                  placeholder="Nhập mã thuốc liên kết"
                />
              </v-col>

              <v-col
                cols="12"
                md="6"
                lg="3"
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
                      v-if="!props.isCreate && !props.isUpdate"
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
                <v-text-field
                  v-model="formPayload.ThongTu30"
                  label="Thông tư 30"
                  placeholder="Nhập thông tư 30"
                />
              </v-col>

              <v-col
                cols="12"
                md="6"
                lg="3"
                class="pb-0"
              >
                <v-text-field
                  v-model="formPayload.ThongTu40"
                  label="Thông tư 40"
                  placeholder="Nhập thông tư 40"
                />
              </v-col>

              <v-col
                cols="12"
                md="6"
                lg="3"
                class="pb-0"
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
                  <template
                    v-if="props.isCreate || props.isUpdate"
                    #append
                  >
                    <v-btn
                      icon
                      class="text-body-1 font-weight-medium"
                      @click="createGroupService = 'PHAN_LOAI_CSKCB'"
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
                md="6"
                lg="3"
                class="pb-0"
              >
                <v-autocomplete
                  v-model="formPayload.TenCSKCB"
                  autocomplete="off"
                  :menu-icon="props.isCreate || props.isUpdate ? 'mdi-chevron-down' : null"
                  :items="autocompleteGroupService?.CSKCB?.items || []"
                  label="Tên CSKCB"
                  placeholder="Chọn CSKCB"
                  item-title="name"
                  item-value="id"
                  :loading="autocompleteGroupService?.CSKCB?.loading || false"
                >
                  <template
                    v-if="props.isCreate || props.isUpdate"
                    #append
                  >
                    <v-btn
                      icon
                      class="text-body-1 font-weight-medium"
                      @click="createGroupService = 'CSKCB'"
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
                      class="text-body-1 font-weight-medium"
                      @click="createGroupService = 'LOAI_BENH_AN'"
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
                lg="3"
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
                      class="text-body-1 font-weight-medium"
                      @click="createGroupService = 'LOAI_THANH_TOAN'"
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
                lg="2"
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
                md="6"
                lg="4"
                class="pt-0"
              >
                <div class="d-flex align-center justify-space-between flex-wrap h-100">
                  <v-checkbox
                    :model-value="formPayload.IsQLSoLo"
                    label="QL số lô"
                    hide-details
                    density="compact"
                    true-icon="custom-circle-check"
                    false-icon="mdi-radiobox-blank"
                    :color="formPayload.IsQLSoLo ? 'erp-brand-700' : ''"
                    @click="formPayload.IsQLSoLo = !formPayload.IsQLSoLo"
                  />
                  <v-checkbox
                    :model-value="formPayload.IsQLHanDung"
                    label="QL hạn dùng"
                    hide-details
                    density="compact"
                    true-icon="custom-circle-check"
                    false-icon="mdi-radiobox-blank"
                    :color="formPayload.IsQLHanDung ? 'erp-brand-700' : ''"
                    @click="formPayload.IsQLHanDung = !formPayload.IsQLHanDung"
                  />
                  <v-checkbox
                    :model-value="formPayload.IsSendBYT"
                    label="Gửi BYT"
                    hide-details
                    density="compact"
                    true-icon="custom-circle-check"
                    false-icon="mdi-radiobox-blank"
                    :color="formPayload.IsSendBYT ? 'erp-brand-700' : ''"
                    @click="formPayload.IsSendBYT = !formPayload.IsSendBYT"
                  />
                  <v-checkbox
                    :model-value="formPayload.IsHienThiWeb"
                    label="Hiển thị trên web"
                    hide-details
                    density="compact"
                    true-icon="custom-circle-check"
                    false-icon="mdi-radiobox-blank"
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
                  :model-value="formPayload.IsThuocKeDon"
                  label="Thuốc kê đơn"
                  hide-details
                  density="compact"
                  true-icon="custom-circle-check"
                  false-icon="mdi-radiobox-blank"
                  :color="formPayload.IsThuocKeDon ? 'erp-brand-700' : ''"
                  @click="formPayload.IsThuocKeDon = !formPayload.IsThuocKeDon"
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
  </div>
</template>

<script setup lang="ts">
  import type { SubmitEventPromise } from 'vuetify'
  import type { IDrug, IDrugFormPayload } from '~/types/drug.types'
  import type { IGroupService, IGroupServiceType } from '~/types/core.types'

  type Props = {
    pageLabel?: string
    isLoading?: boolean
    isUpdate?: boolean
    isCreate?: boolean
    drug?: IDrug | null
  }

  const props = withDefaults(defineProps<Props>(), {
    pageLabel: 'Tạo mới thuốc',
    isLoading: false,
    isUpdate: false,
    isCreate: false,
    drug: null,
  })

  const createGroupService = ref<IGroupServiceType | null>(null)

  const formEmit = defineEmits<{
    (e: 'submit', payload: IDrugFormPayload): void
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
  const { organizationSelected } = useAuth()
  const groupServiceHooks = useGroupService()

  const formPayload = ref<IDrugFormPayload>({
    source: 'SELF',
    NhomThuoc: null,
    TrangThai: null,
    organization: organizationSelected.value?.id,
    DuongDung: null,
    DonViDGNN: null,
    DonViThuongDung: null,
    DonViNhap: null,
    CongTyDangKy: null,
    NuocSanXuat: null,
    NhaSanXuat: null,
    PhanLoaiHangHoa: null,
    PhanLoaiThuoc: null,
    TenCSKCB: null,
    PhanLoaiCSKCB: null,
    LoaiBenhAn: null,
    LoaiThanhToan: null,
    PhuThuBaoHiem: null,
    DonViThau: null,
    image_file: null,
    TenThuoc: null,
    BYT_TenThuoc: null,
    MaThuoc: null,
    BYT_MaThuoc: null,
    LoaiHang: null,
    Barcode: null,
    HoatChat: null,
    HamLuong: null,
    TenHoatChatSDK: null,
    QuyCach: null,
    SoNgayCanHan: null,
    DangBaoChe: null,
    SoDangKy: null,
    HoaHong: null,
    LoiNhuan: null,
    MaThuocLienKet: null,
    ThongTu30: null,
    ThongTu40: null,
    MaACT: null,
    GhiChu: null,
    NamThau: null,
    NhomThau: null,
    GoiThau: null,
    LoaiThau: null,
    SoNgayVuotThau: null,
    SoLuongTrungThau: null,
    ThongTinHopDong: null,
    ThongTinThau: null,
    SoQuyetDinh: null,
    NgayQuyetDinh: null,
    NgayHieuLuc: null,
    NgayHetHieuLuc: null,
    DonGia: null,
    TiLeThanhToanBHYT: null,
    IsQLSoLo: null,
    IsQLHanDung: null,
    IsBHYT: null,
    IsHienThiWeb: null,
    IsSendBYT: null,
    LuongDung: null,
    DonViDung: null,
    LanDung: null,
    MoiLanDung: null,
    IsThau: false,
    IsThuocKeDon: false,
  })

  watchEffect(() => {
    if (props.drug) {
      Object.assign(formPayload.value, props.drug)
      formPayload.value['source'] = formPayload.value['source']?.['value']
    }
  })

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
      'NhomThuoc',
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
      'PhanLoaiThuoc',
      'TenCSKCB',
      'PhanLoaiCSKCB',
      'LoaiBenhAn',
      'LoaiThanhToan',
      'PhuThuBaoHiem',
      'DonViThau',
      'HoatChat',
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
      Object.assign(formPayload.value, props.drug)
      formEmit('update', false)
    }
  }

  const onSuccessDropdown = async (groupServiceData: IGroupService) => {
    autocompleteGroupService.value[createGroupService.value].items.unshift(groupServiceData)
    createGroupService.value = null
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
