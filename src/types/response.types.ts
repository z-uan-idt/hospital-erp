export type IResponse<T = any, K = any> = {
  code: number
  status: number
  success: boolean
  status_text: string
  message: string
  timestamp: number
  metadata: K
  data: T
}

export type IPagination = {
  count: number | null
  current_page: number | null
  next_page: number | null
  num_pages: number | null
  per_page: number | null
  previous_page: number | null
}

export interface IBasicWarehouse {
  id?: number
  name?: string
  code?: string
}
