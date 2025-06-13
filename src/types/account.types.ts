import type { IChoice, IdName } from './core.types'

export type IBasicAccount = {
  id?: number
  code?: string
  phone_number?: string
  full_name?: string
  is_active?: boolean
  avatar?: string
  requested_at?: string
}

export type IAccount = IBasicAccount & {
  gender?: IChoice
  created_by?: IBasicAccount
  updated_by?: IBasicAccount
  referral_by?: IBasicAccount
  devices?: string[]
  updated_at?: string | null
  created_at?: string | null
  full_name?: string | null
  CCCD_number?: string | null
  CCCD_issued_by?: string | null
  CCCD_issued_date?: string | null
  CCCD_expired_date?: string | null
  BHXH_code?: string | null
  BHXH_issued_by?: string | null
  BHXH_issued_date?: string | null
  BHXH_expired_date?: string | null
  BHYT_code?: string | null
  BHYT_issued_by?: string | null
  BHYT_issued_date?: string | null
  BHYT_expired_date?: string | null
  address?: string | null
  temporary_address?: string | null
  hometown?: string | null
  date_of_birth?: string | null
  nationality?: string | null
  ethnicity?: string | null
  religion?: string | null
  username?: string | null
  nickname?: string | null
  phone_number?: string | null
  avatar?: string | null
  avatar_file?: File | null
  email?: string | null
  primary_contact_number?: string | null
  secondary_contact_number?: string | null
  is_hidden?: boolean
  is_active?: boolean
  code?: string
  referral_code?: string
}

export type IStaff = {
  id?: number
  phone_number?: string | null
  email?: string | null
  full_name?: string | null
  username?: string | null
  staff_code?: string | null
  joined_at?: string | null
  document_file?: string | null
  avatar?: string | null
  is_active?: boolean
  warehouse?: IdName | null
  department?: IdName | null
  role?: IdName | null
  created_by?: IBasicAccount | null
  updated_by?: IBasicAccount | null
  updated_at?: string | null
  created_at?: string | null
}
