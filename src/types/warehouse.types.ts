import type { IBasicAccount } from './account.types'
import type { IBasicDepartment } from './department.types'

export type IWarehouseCreatePayload = {
  code: string
  name: string
  department?: number | null
  description?: string
  keeper?: number | null
}

export interface IWarehouse {
  id?: number
  staff_count?: number
  keeper?: IBasicAccount
  created_by?: IBasicAccount
  updated_by?: IBasicAccount
  updated_at?: string
  created_at?: string
  name?: string
  code?: string
  description?: string
  is_active?: boolean
  department?: IBasicDepartment
  minimum_stock_limit?: number
  maximum_stock_limit?: number
}
