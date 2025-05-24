export const ROUTE_LOGIN = {
  path: '/dang-nhap',
  name: 'dang-nhap',
}
export const ROUTE_REGISTER = {
  path: '/dang-ky',
  name: 'dang-ky',
}
export const ROUTE_FORGOT_PASSWORD = {
  path: '/quen-mat-khau',
  name: 'quen-mat-khau',
}
export const ROUTE_RESET_PASSWORD = {
  path: '/doi-mat-khau',
  name: 'doi-mat-khau',
}
export const ROUTE_VERIFY_EMAIL = {
  path: '/xac-thuc-email',
  name: 'xac-thuc-email',
}
export const ROUTE_VERIFY_PHONE = {
  path: '/xac-thuc-sdt',
  name: 'xac-thuc-sdt',
}
export const ROUTE_VERIFY_OTP = {
  path: '/xac-thuc-otp',
  name: 'xac-thuc-otp',
}
export const ROUTE_DASHBOARD = {
  path: '/trang-chu',
  name: 'trang-chu',
}
export const ROUTE_DANH_SACH_THUOC = {
  path: '/danh-sach-thuoc',
  name: 'danh-sach-thuoc',
  CREATE: {
    name: 'danh-sach-thuoc-tao-moi',
    path: '/danh-sach-thuoc/tao-moi',
  },
  DETAIL: {
    name: 'danh-sach-thuoc-drug_id',
    path: (pk: number | string) => `/danh-sach-thuoc/${pk}`,
  },
}
export const ROUTE_KHO_TRUC_THUOC = {
  path: '/kho-truc-thuoc',
  name: 'kho-truc-thuoc',
  CREATE: {
    name: 'kho-truc-thuoc-tao-moi',
    path: '/kho-truc-thuoc/tao-moi',
  },
  DETAIL: {
    name: 'kho-truc-thuoc-warehouse_id',
    path: (pk: number | string) => `/kho-truc-thuoc/${pk}`,
  },
}
export const ROUTE_PHIEU_KIEM_KHO = {
  path: '/phieu-kiem-kho',
  name: 'phieu-kiem-kho',
  CREATE: {
    name: 'phieu-kiem-kho-tao-moi',
    path: '/phieu-kiem-kho/tao-moi',
  },
  DETAIL: {
    name: 'phieu-kiem-kho-receipt_id',
    path: (pk: number | string) => `/phieu-kiem-kho/${pk}`,
  },
}
export const ROUTE_PHIEU_NHAP_KHO = {
  path: '/phieu-nhap-kho',
  name: 'phieu-nhap-kho',
  CREATE: {
    name: 'phieu-nhap-kho-tao-moi',
    path: '/phieu-nhap-kho/tao-moi',
  },
  DETAIL: {
    name: 'phieu-nhap-kho-receipt_id',
    path: (pk: number | string) => `/phieu-nhap-kho/${pk}`,
  },
}
export const ROUTE_PHIEU_XUAT_KHO = {
  path: '/phieu-xuat-kho',
  name: 'phieu-xuat-kho',
  CREATE: {
    name: 'phieu-xuat-kho-tao-moi',
    path: '/phieu-xuat-kho/tao-moi',
  },
  DETAIL: {
    name: 'phieu-xuat-kho-receipt_id',
    path: (pk: number | string) => `/phieu-xuat-kho/${pk}`,
  },
}
export const ROUTE_LO_HANG = {
  path: '/lo-hang',
  name: 'lo-hang',
  CREATE: {
    name: 'lo-hang-tao-moi',
    path: '/lo-hang/tao-moi',
  },
  DETAIL: {
    name: 'lo-hang-csm_id',
    path: (pk: number | string) => `/lo-hang/${pk}`,
  },
}
export const ROUTE_NHAN_VIEN = {
  path: '/nhan-vien',
  name: 'nhan-vien',
  CREATE: {
    name: 'nhan-vien-tao-moi',
    path: '/nhan-vien/tao-moi',
  },
  DETAIL: {
    name: 'nhan-vien-staff_id',
    path: (pk: number | string) => `/nhan-vien/${pk}`,
  },
}
export const ROUTE_DON_VI_TO_CHUC = {
  name: 'don-vi-to-chuc',
  path: '/don-vi-to-chuc',
  CREATE: {
    name: 'don-vi-to-chuc-tao-moi',
    path: '/don-vi-to-chuc/tao-moi',
  },
  DETAIL: {
    name: 'don-vi-to-chuc-org_id',
    path: (pk: number | string) => `/don-vi-to-chuc/${pk}`,
  },
}
export const ROUTE_PHIEU_LINH = {
  name: 'phieu-linh',
  path: '/phieu-linh',
  CREATE: {
    name: 'phieu-linh-tao-moi',
    path: '/phieu-linh/tao-moi',
  },
  DETAIL: {
    name: 'phieu-linh-receipt_id',
    path: (pk: number | string) => `/phieu-linh/${pk}`,
  },
}
export const ROUTE_THONG_TIN_CA_NHAN = {
  name: 'thong-tin-ca-nhan',
  path: '/thong-tin-ca-nhan',
}
export const ROUTE_DON_VI_TINH = {
  name: 'don-vi-tinh',
  path: '/don-vi-tinh',
  CREATE: {
    name: 'don-vi-tinh-tao-moi',
    path: '/don-vi-tinh/tao-moi',
  },
  DETAIL: {
    name: 'don-vi-tinh-unit_id',
    path: (pk: number | string) => `/don-vi-tinh/${pk}`,
  },
}
export const ROUTE_DON_THUOC = {
  name: 'don-thuoc',
  path: '/don-thuoc',
  CREATE: {
    name: 'don-thuoc-tao-moi',
    path: '/don-thuoc/tao-moi',
  },
  DETAIL: {
    name: 'don-thuoc-prescription_id',
    path: (pk: number | string) => `/don-thuoc/${pk}`,
  },
}
export const ROUTE_PHIEU_CHUYEN_HANG = {
  name: 'phieu-chuyen-hang',
  path: '/phieu-chuyen-hang',
  CREATE: {
    name: 'phieu-chuyen-hang-tao-moi',
    path: '/phieu-chuyen-hang/tao-moi',
  },
  DETAIL: {
    name: 'phieu-chuyen-hang-receipt_id',
    path: (pk: number | string) => `/phieu-chuyen-hang/${pk}`,
  },
}

export const ROUTE_DANH_SACH_KHOA = {
  name: 'danh-sach-khoa',
  path: '/danh-sach-khoa',
  CREATE: {
    name: 'danh-sach-khoa-tao-moi',
    path: '/danh-sach-khoa/tao-moi',
  },
  DETAIL: {
    name: 'danh-sach-khoa-department_id',
    path: (pk: number | string) => `/danh-sach-khoa/${pk}`,
  },
}
