import type { IBasicAccount } from './account.types'
import type { IChoice, IdName } from './core.types'
import type { IMedicalProduct } from './medical_product.types'

export interface IReceiptBatch {
  id?: number
  medical_product?: IMedicalProduct
  unit?: IdName
  created_by?: IBasicAccount
  updated_by?: IBasicAccount
  updated_at?: string
  created_at?: string
  code?: string
  quantity?: number
  input_quantity?: number
  real_quantity?: number
  available_quantity?: number
  MFG_date?: string
  expired_date?: string
  price?: number
  goods_received_note?: number
  max_quantity?: number | null
  min_quantity?: number | null
  is_unlimited?: boolean | null
}

export interface IReceipt {
  id?: number
  status?: IChoice
  reason?: string
  is_other_reason?: boolean
  warehouse?: IdName
  created_by?: IBasicAccount
  updated_by?: IBasicAccount
  batches?: IReceiptBatch[]
  batch_count?: number
  batch_price?: number
  updated_at?: string
  created_at?: string
  code?: string
  reject_reason?: string
  is_transfer?: boolean
}

export type IReceiptFormPayload = {
  warehouse?: number | null
  code?: string | null
  is_other_reason?: boolean | null
  reason?: string | null
  batches?: {
    id?: number | null
    medical_product?: number | null
    medical_product_info?: IMedicalProduct | null
    quantity?: number | null
    MFG_date?: string | null
    expired_date?: string | null
    unit?: number | null
    price?: number | null
    code?: string | null
  }[]
}

export interface IReceiptExportBatch {
  id?: number
  medical_product?: IMedicalProduct
  unit?: IdName
  created_by?: IBasicAccount
  updated_by?: IBasicAccount
  updated_at?: string
  created_at?: string
  quantity?: number
  real_quantity?: number
  input_quantity?: number
  available_quantity?: number
  price?: number
  goods_received_note?: number
  goods_received_note_batch?: IReceiptBatch
  max_quantity?: number | null
  min_quantity?: number | null
  is_unlimited?: boolean | null
}

export interface IReceiptExport {
  id?: number
  status?: IChoice
  reason?: string
  is_other_reason?: boolean
  warehouse?: IdName
  created_by?: IBasicAccount
  updated_by?: IBasicAccount
  batches?: IReceiptExportBatch[]
  batch_count?: number
  batch_price?: number
  updated_at?: string
  created_at?: string
  code?: string
  reject_reason?: string
  is_transfer?: boolean
}

export type IReceiptExportFormPayload = {
  warehouse?: number | null
  code?: string | null
  is_other_reason?: boolean | null
  reason?: string | null
  batches?: {
    id?: number | null
    medical_product?: number | null
    medical_product_info?: IMedicalProduct | null
    goods_received_note_batch_info?: IReceiptBatch | null
    goods_received_note_batch?: number | null
    quantity?: number | null
    unit?: number | null
    price?: number | null
    batches?: IReceiptBatch[]
    [x: string]: any
  }[]
}
