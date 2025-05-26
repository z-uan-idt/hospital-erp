import type { IBasicAccount } from './account.types'

export type IDepartmentCreatePayload = {
  code: string
  name: string
  dean?: number | null
  description?: string
}

export interface IDepartment {
  id?: number
  code?: string
  name?: string
  dean?: IBasicAccount | null
  description?: string
  created_at?: string | null
  updated_at?: string | null
  updated_by?: IBasicAccount | null
  created_by?: IBasicAccount | null
  staff_count?: number | null
  warehouse_count?: number | null
}
