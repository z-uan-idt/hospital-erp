import type { IBasicAccount } from './account.types'
import type { IChoice, IdName } from './core.types'
import type { IBasicDepartment } from './department.types'
import type { IDrug } from './drug.types'

export type IWarehouseCreatePayload = {
  code: string
  name: string
  department?: number | null
  description?: string
  keeper?: number | null
  organization?: number | null
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

export interface IBatchStock {
  id: number
  drug: IDrug
  unit: IdName
  available_quantity: number
  created_by: IBasicAccount
  updated_by: IBasicAccount
  updated_at: string
  created_at: string
  code: string
  quantity: number
  MFG_date: string
  expired_date: string
  price: number
  goods_received_note: number
}

export interface IBatchWarningSettings {
  id?: number
  type?: IChoice
  level?: number
  level_type?: IChoice
  amount?: number
}

export type IBatchWarningSettingsFormPayload = {
  warehouse: number
  batch_warnings: {
    id?: number
    type?: 'QUANTITY' | 'DAY' | 'MONTH' | 'YEAR'
    level?: number
    level_type?: 1 | 2 | 3 | 4 | 5
    amount?: number
  }[]
}
