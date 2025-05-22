import type { IChoice } from './core.types'
import type { IBasicAccount } from './account.types'

export type IOrganizationFormPayload = {
  profile_picture?: File | null
  name?: string
  code?: string
  representative?: string
  tax_number?: string
  phone_number?: string
  emergency_phone_number?: string
  email?: string
  address?: string
  website?: string
  description?: string
}

export type IOrganization = {
  id?: number
  code?: string
  name?: string
  representative?: string
  tax_number?: string
  phone_number?: string
  email?: string
  infor?: IChoice
  status?: IChoice
  address?: string
  website?: string
  description?: string
  profile_picture?: string
  emergency_phone_number?: string
  is_owner?: boolean
  is_active?: boolean
  is_verified?: boolean
  created_at?: string
  updated_at?: string
  updated_by?: IBasicAccount
  created_by?: IBasicAccount
}

export type IOrganizationActionRequest =
  | 'CANCEL_REQUEST'
  | 'DEACTIVATE'
  | 'ACTIVATE'
  | 'DELETE'
  | 'LEAVE'
