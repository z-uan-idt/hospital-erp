export type IRouteBase = {
  pathFunc?: (pk: number | string) => string
  path?: string
  name: string
}

export interface IRoute extends IRouteBase {
  CREATE?: IRouteBase
  DETAIL?: IRouteBase
}

export const QUAN_TRI_TONG_PREFIX: string & IRoute = Object.assign('quan-tri-tong', {
  path: '/quan-tri-tong',
  name: 'quan-tri-tong',
})
export const KHO_DUOC_PREFIX = Object.assign('kho-duoc', {
  path: '/kho-duoc',
  name: 'kho-duoc',
})
export const KHAM_CHUA_BENH_PREFIX = Object.assign('kham-chua-benh', {
  path: '/kham-chua-benh',
  name: 'kham-chua-benh',
})

// GM router
export const ROUTE_DANH_MUC_HANG_HOA: IRoute = {
  path: `/${QUAN_TRI_TONG_PREFIX}/danh-muc-hang-hoa`,
  name: `${QUAN_TRI_TONG_PREFIX}-danh-muc-hang-hoa`,
  CREATE: {
    name: `${QUAN_TRI_TONG_PREFIX}-danh-muc-hang-hoa-tao-moi`,
    path: `/${QUAN_TRI_TONG_PREFIX}/danh-muc-hang-hoa/tao-moi`,
  },
  DETAIL: {
    name: `${QUAN_TRI_TONG_PREFIX}-danh-muc-hang-hoa-medical_product_id`,
    pathFunc: (pk) => `/${QUAN_TRI_TONG_PREFIX}/danh-muc-hang-hoa/${pk}`,
  },
}
export const ROUTE_KHO_TRUC_THUOC: IRoute = {
  path: `/${QUAN_TRI_TONG_PREFIX}/kho-truc-thuoc`,
  name: `${QUAN_TRI_TONG_PREFIX}-kho-truc-thuoc`,
  CREATE: {
    name: `${QUAN_TRI_TONG_PREFIX}-kho-truc-thuoc-tao-moi`,
    path: `/${QUAN_TRI_TONG_PREFIX}/kho-truc-thuoc/tao-moi`,
  },
  DETAIL: {
    name: `${QUAN_TRI_TONG_PREFIX}-kho-truc-thuoc-warehouse_id`,
    pathFunc: (pk) => `/${QUAN_TRI_TONG_PREFIX}/kho-truc-thuoc/${pk}`,
  },
}
export const ROUTE_NHAN_VIEN: IRoute = {
  path: `/${QUAN_TRI_TONG_PREFIX}/nhan-vien`,
  name: `${QUAN_TRI_TONG_PREFIX}-nhan-vien`,
  CREATE: {
    name: `${QUAN_TRI_TONG_PREFIX}-nhan-vien-tao-moi`,
    path: `/${QUAN_TRI_TONG_PREFIX}/nhan-vien/tao-moi`,
  },
  DETAIL: {
    name: `${QUAN_TRI_TONG_PREFIX}-nhan-vien-staff_id`,
    pathFunc: (pk) => `/${QUAN_TRI_TONG_PREFIX}/nhan-vien/${pk}`,
  },
}
export const ROUTE_DANH_SACH_KHOA: IRoute = {
  name: `${QUAN_TRI_TONG_PREFIX}-danh-sach-khoa-index`,
  path: `/${QUAN_TRI_TONG_PREFIX}/danh-sach-khoa`,
  CREATE: {
    name: `${QUAN_TRI_TONG_PREFIX}-danh-sach-khoa-tao-moi`,
    path: `/${QUAN_TRI_TONG_PREFIX}/danh-sach-khoa/tao-moi`,
  },
  DETAIL: {
    name: `${QUAN_TRI_TONG_PREFIX}-danh-sach-khoa-department_id`,
    pathFunc: (pk) => `/${QUAN_TRI_TONG_PREFIX}/danh-sach-khoa/${pk}`,
  },
}

// Kho router
export const ROUTE_PHIEU_KIEM_KHO: IRoute = {
  path: `/${KHO_DUOC_PREFIX}/phieu-kiem-kho`,
  name: `${KHO_DUOC_PREFIX}-phieu-kiem-kho`,
  CREATE: {
    name: `${KHO_DUOC_PREFIX}-phieu-kiem-kho-tao-moi`,
    path: `/${KHO_DUOC_PREFIX}/phieu-kiem-kho/tao-moi`,
  },
  DETAIL: {
    name: `${KHO_DUOC_PREFIX}-phieu-kiem-kho-receipt_id`,
    pathFunc: (pk) => `/${KHO_DUOC_PREFIX}/phieu-kiem-kho/${pk}`,
  },
}
export const ROUTE_PHIEU_NHAP_KHO: IRoute = {
  path: `/${KHO_DUOC_PREFIX}/phieu-nhap-kho`,
  name: `${KHO_DUOC_PREFIX}-phieu-nhap-kho`,
  CREATE: {
    name: `${KHO_DUOC_PREFIX}-phieu-nhap-kho-tao-moi`,
    path: `/${KHO_DUOC_PREFIX}/phieu-nhap-kho/tao-moi`,
  },
  DETAIL: {
    name: `${KHO_DUOC_PREFIX}-phieu-nhap-kho-receipt_id`,
    pathFunc: (pk) => `/${KHO_DUOC_PREFIX}/phieu-nhap-kho/${pk}`,
  },
}
export const ROUTE_PHIEU_XUAT_KHO: IRoute = {
  path: `/${KHO_DUOC_PREFIX}/phieu-xuat-kho`,
  name: `${KHO_DUOC_PREFIX}-phieu-xuat-kho`,
  CREATE: {
    name: `${KHO_DUOC_PREFIX}-phieu-xuat-kho-tao-moi`,
    path: `/${KHO_DUOC_PREFIX}/phieu-xuat-kho/tao-moi`,
  },
  DETAIL: {
    name: `${KHO_DUOC_PREFIX}-phieu-xuat-kho-receipt_id`,
    pathFunc: (pk) => `/${KHO_DUOC_PREFIX}/phieu-xuat-kho/${pk}`,
  },
}
export const ROUTE_LO_HANG: IRoute = {
  path: `/${KHO_DUOC_PREFIX}/lo-hang`,
  name: `${KHO_DUOC_PREFIX}-lo-hang`,
  CREATE: {
    name: `${KHO_DUOC_PREFIX}-lo-hang-tao-moi`,
    path: `/${KHO_DUOC_PREFIX}/lo-hang/tao-moi`,
  },
  DETAIL: {
    name: `${KHO_DUOC_PREFIX}-lo-hang-csm_id`,
    pathFunc: (pk) => `/${KHO_DUOC_PREFIX}/lo-hang/${pk}`,
  },
}
export const ROUTE_PHIEU_TRA: IRoute = {
  name: `${KHO_DUOC_PREFIX}-phieu-tra`,
  path: `/${KHO_DUOC_PREFIX}/phieu-tra`,
  CREATE: {
    name: `${KHO_DUOC_PREFIX}-phieu-tra-tao-moi`,
    path: `/${KHO_DUOC_PREFIX}/phieu-tra/tao-moi`,
  },
  DETAIL: {
    name: `${KHO_DUOC_PREFIX}-phieu-tra-receipt_id`,
    pathFunc: (pk) => `/${KHO_DUOC_PREFIX}/phieu-tra/${pk}`,
  },
}
export const ROUTE_PHIEU_LINH: IRoute = {
  name: `${KHO_DUOC_PREFIX}-phieu-linh`,
  path: `/${KHO_DUOC_PREFIX}/phieu-linh`,
  CREATE: {
    name: `${KHO_DUOC_PREFIX}-phieu-linh-tao-moi`,
    path: `/${KHO_DUOC_PREFIX}/phieu-linh/tao-moi`,
  },
  DETAIL: {
    name: `${KHO_DUOC_PREFIX}-phieu-linh-receipt_id`,
    pathFunc: (pk) => `/${KHO_DUOC_PREFIX}/phieu-linh/${pk}`,
  },
}
export const ROUTE_DON_VI_TINH: IRoute = {
  name: `${KHO_DUOC_PREFIX}-don-vi-tinh`,
  path: `/${KHO_DUOC_PREFIX}/don-vi-tinh`,
  CREATE: {
    name: `${KHO_DUOC_PREFIX}-don-vi-tinh-tao-moi`,
    path: `/${KHO_DUOC_PREFIX}/don-vi-tinh/tao-moi`,
  },
  DETAIL: {
    name: `${KHO_DUOC_PREFIX}-don-vi-tinh-unit_id`,
    pathFunc: (pk) => `/${KHO_DUOC_PREFIX}/don-vi-tinh/${pk}`,
  },
}
export const ROUTE_PHIEU_CHUYEN_HANG: IRoute = {
  name: `${KHO_DUOC_PREFIX}-phieu-chuyen-hang`,
  path: `/${KHO_DUOC_PREFIX}/phieu-chuyen-hang`,
  CREATE: {
    name: `${KHO_DUOC_PREFIX}-phieu-chuyen-hang-tao-moi`,
    path: `/${KHO_DUOC_PREFIX}/phieu-chuyen-hang/tao-moi`,
  },
  DETAIL: {
    name: `${KHO_DUOC_PREFIX}-phieu-chuyen-hang-receipt_id`,
    pathFunc: (pk) => `/${KHO_DUOC_PREFIX}/phieu-chuyen-hang/${pk}`,
  },
}
export const ROUTE_TON_KHO: IRoute = {
  name: `${KHO_DUOC_PREFIX}-ton-kho`,
  path: `/${KHO_DUOC_PREFIX}/ton-kho`,
}

// Kham chua benh router
export const ROUTE_DON_THUOC: IRoute = {
  name: `${KHAM_CHUA_BENH_PREFIX}-don-thuoc`,
  path: `/${KHAM_CHUA_BENH_PREFIX}/don-thuoc`,
  CREATE: {
    name: `${KHAM_CHUA_BENH_PREFIX}-don-thuoc-tao-moi`,
    path: `/${KHAM_CHUA_BENH_PREFIX}/don-thuoc/tao-moi`,
  },
  DETAIL: {
    name: `${KHAM_CHUA_BENH_PREFIX}-don-thuoc-prescription_id`,
    pathFunc: (pk) => `/${KHAM_CHUA_BENH_PREFIX}/don-thuoc/${pk}`,
  },
}

// Other router
export const ROUTE_DON_VI_TO_CHUC: IRoute = {
  path: '/',
  name: 'index',
  CREATE: {
    name: 'to-chuc-tao-moi',
    path: '/to-chuc/tao-moi',
  },
  DETAIL: {
    name: 'to-chuc-org_id',
    pathFunc: (pk) => `/to-chuc/${pk}`,
  },
}

export const ROUTE_THONG_TIN_CA_NHAN: IRoute = {
  name: 'thong-tin-ca-nhan',
  path: '/thong-tin-ca-nhan',
}

export const ROUTE_DANG_NHAP: IRoute = {
  path: '/dang-nhap',
  name: 'dang-nhap',
}

const reduceRoutes = (route: IRoute) => {
  return [route.name, route?.CREATE?.name, route?.DETAIL?.name]
}

export const ROUTES_QUAN_TRI_TONG = [
  QUAN_TRI_TONG_PREFIX.name,
  ...reduceRoutes(ROUTE_DANH_MUC_HANG_HOA),
  ...reduceRoutes(ROUTE_KHO_TRUC_THUOC),
  ...reduceRoutes(ROUTE_NHAN_VIEN),
  ...reduceRoutes(ROUTE_DANH_SACH_KHOA),
]
export const ROUTES_KHO_DUOC = [
  KHO_DUOC_PREFIX.name,
  ...reduceRoutes(ROUTE_PHIEU_KIEM_KHO),
  ...reduceRoutes(ROUTE_PHIEU_NHAP_KHO),
  ...reduceRoutes(ROUTE_PHIEU_XUAT_KHO),
  ...reduceRoutes(ROUTE_LO_HANG),
  ...reduceRoutes(ROUTE_PHIEU_LINH),
  ...reduceRoutes(ROUTE_DON_VI_TINH),
  ...reduceRoutes(ROUTE_DON_THUOC),
  ...reduceRoutes(ROUTE_PHIEU_CHUYEN_HANG),
]
