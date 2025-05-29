import type { IChoice } from './core.types'

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
  role?: IChoice
  created_by?: IBasicAccount
  updated_by?: IBasicAccount
  referral_by?: IBasicAccount
  devices?: string[]
  updated_at?: string
  created_at?: string
  CCCD_number?: string
  CCCD_issued_by?: string
  CCCD_issued_date?: string
  CCCD_expired_date?: string
  BHXH_code?: string
  BHXH_issued_by?: string
  BHXH_issued_date?: string
  BHXH_expired_date?: string
  BHYT_code?: string
  BHYT_issued_by?: string
  BHYT_issued_date?: string
  BHYT_expired_date?: string
  address?: string
  temporary_address?: string
  hometown?: string
  date_of_birth?: string
  nationality?: string
  ethnic?: string
  religion?: string
  username?: string
  is_phone_number_verified?: boolean
  email?: string
  is_email_verified?: boolean
  avatar?: string
  avatar_file?: File
  is_active?: boolean
  referral_code?: string
  nickname?: string
  primary_contact_number?: string
  secondary_contact_number?: string
}

export type IStaff = {
  id?: number
  code?: string
  phone_number?: string
  full_name?: string
  username?: string
  organization_phone_number?: string | null
  department_role?: string
  organization_email?: string | null
  department?: string
  warehouse?: string
  created_at?: string
  updated_at?: string
  staff_code?: string | null
  joined_at?: string
  avatar?: string
  is_active?: boolean
}
