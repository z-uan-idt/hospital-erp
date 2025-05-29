import type { IBasicAccount } from './account.types'
import type { IBasicOrganization } from './oranization.types'

export type IDepartmentCreatePayload = {
  code: string
  name: string
  dean?: number | null
  description?: string
  organization?: number
}

export interface IDepartment {
  id?: number
  staff_count?: number
  warehouse_count?: number
  dean?: IBasicAccount
  created_by?: IBasicAccount
  updated_by?: IBasicAccount
  organization?: IBasicOrganization
  updated_at?: string
  created_at?: string
  name?: string
  code?: string
  description?: string
  is_active?: boolean
}

export interface IBasicDepartment {
  id?: number
  name?: string
  code?: string
}

export interface IBasicRolePermission {
  id?: number
  name?: string
}
