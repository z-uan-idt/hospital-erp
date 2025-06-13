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
  infor?: IChoice
  status?: IChoice
  is_owner?: boolean
  created_by?: IBasicAccount
  updated_by?: IBasicAccount
  updated_at?: string
  created_at?: string
  profile_picture?: string
  name?: string
  code?: string
  representative?: string | null
  tax_number?: string | null
  phone_number?: string | null
  emergency_phone_number?: string | null
  hotline?: string | null
  email?: string | null
  address?: string | null
  website?: string | null
  description?: string | null
  type?: IChoice
  is_active?: boolean
  is_verified?: boolean
}

export type IOrganizationActionRequest =
  | 'CANCEL_REQUESTED_TO_JOIN'
  | 'REJECT_REQUESTED_TO_JOIN'
  | 'REJECT_INVITATION_SENT'
  | 'ACCEPT_INVITATION_SENT'
  | 'CANCEL_INVITATION_SENT'
  | 'ACTIVATE'
  | 'DEACTIVATE'
  | 'DELETE'
  | 'LEAVE'

export type IBasicOrganization = {
  id: number
  code: string
  name: string
}
