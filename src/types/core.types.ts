import type { IBasicAccount } from './account.types'
import type { IMedicalProductType } from './medical_product.types'

export type IChoice = {
  label: string
  value: string
}

export type IdName = {
  id?: number
  name?: string
  code?: string
}

export type IGroupServiceType =
  | 'HOAT_CHAT'
  | 'NHOM_HANG_HOA'
  | 'DON_VI_TINH'
  | 'DUONG_DUNG'
  | 'CONG_TY_DANG_KY'
  | 'NHA_SAN_XUAT'
  | 'QUOC_GIA'
  | 'PHAN_LOAI_HANG_HOA'
  | 'TRANG_THAI'
  | 'PHAN_LOAI_THUOC'
  | 'PHAN_LOAI_CSKCB'
  | 'CSKCB'
  | 'LOAI_BENH_AN'
  | 'LOAI_THANH_TOAN'
  | 'PHU_THU_BHYT'
  | 'DON_VI_THAU'
  | 'UNKNOWN'
  | 'NHA_CUNG_CAP'
  | 'LY_DO_NHAP_HANG'
  | 'LOAI_DANG_KY'
  | 'DANG_BAO_CHE'
  | 'LY_DO_XUAT_HANG'

export type IGroupServiceFormPayload = {
  id?: number
  name?: string
  code?: string
  type?: IMedicalProductType
  group_type?: IGroupServiceType
  description?: string
  organization?: number
}

export type IGroupService = {
  id?: number
  type?: IChoice
  created_by?: IBasicAccount | null
  updated_by?: IBasicAccount | null
  updated_at?: string | null
  created_at?: string | null
  name?: string
  code?: string
  description?: string
  organization?: number
  is_selected?: boolean
}
