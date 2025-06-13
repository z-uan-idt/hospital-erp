import { ITEM_PER_PAGE } from '~/constants/core.constants'
import type {
  IReceipt,
  IReceiptBatch,
  IReceiptExport,
  IReceiptExportFormPayload,
  IReceiptFormPayload,
} from '~/types/receipt.types'
import type { IPagination } from '~/types/response.types'

type IMetadata = {
  draft_count?: number
  pagination: IPagination
}

export const useReceipt = () => {
  const receipts = ref<IReceipt[]>([])
  const receipt = ref<IReceipt | null>(null)
  const receiptExports = ref<IReceiptExport[]>([])
  const receiptExport = ref<IReceiptExport | null>(null)

  const { warehouseSelected } = useAuth()

  const fetchApi = usePrivateApi()
  const page = ref(1)
  const limit = ref(ITEM_PER_PAGE)
  const search = ref('')
  const count = ref(0)
  const numPages = ref(0)
  const draftCount = ref(0)

  const setReceipt = (value: IReceipt | null) => {
    receipt.value = value
  }

  const setReceiptExport = (value: IReceiptExport | null) => {
    receiptExport.value = value
  }

  const setPage = (value: number | null) => {
    page.value = value
  }

  const setLimit = (value: number | null) => {
    limit.value = value
  }

  const setSearch = (value: string) => {
    search.value = value
  }

  const onFetchGoodsReceivedNote = async (warehouseId: string | number) => {
    if (!warehouseId) {
      setPage(1)
      setLimit(15)
      receipts.value = []
      count.value = 0
      numPages.value = 0
      draftCount.value = 0
      return
    }

    const params = {
      page: page.value,
      limit: limit.value,
      wid: warehouseId,
    }
    if (search.value) {
      params['search'] = search.value
    }
    const { data: response } = await fetchApi.get<IReceipt[], IMetadata>('api/v1/warehouse/goods-received-note', params)
    if (response.success) {
      const metadata = response.metadata
      receipts.value = response.data
      count.value = metadata.pagination.count ?? 0
      numPages.value = metadata.pagination.num_pages ?? 0
      draftCount.value = metadata.draft_count ?? 0
    }
  }

  const onFetchGoodsReceivedNoteById = async (goodsReceivedNoteId: string | number) => {
    const { data: response } = await fetchApi.get<IReceipt>(
      `api/v1/warehouse/goods-received-note/${goodsReceivedNoteId}`
    )
    if (response.success) {
      receipt.value = response.data
    }
  }

  const onCreateGoodsReceivedNote = async (
    payload: IReceiptFormPayload,
    onSuccess?: (result: IReceipt) => void,
    onError?: (error: any) => void
  ) => {
    const { data: response } = await fetchApi.post<IReceipt>('api/v1/warehouse/goods-received-note', payload)
    if (response.success) {
      onSuccess?.(response.data)
    } else {
      onError?.(response.message)
    }
  }

  const onUpdateGoodsReceivedNote = async (
    id: string | number,
    payload: IReceiptFormPayload,
    onSuccess?: (result: IReceipt) => void,
    onError?: (error: any) => void
  ) => {
    const { data: response } = await fetchApi.put<IReceipt>(`api/v1/warehouse/goods-received-note/${id}`, payload)
    if (response.success) {
      onSuccess?.(response.data)
    } else {
      onError?.(response.message)
    }
  }

  const onUpdateGoodsReceivedNoteStatus = async (
    id: string | number,
    payload: {
      status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
      reject_reason: string
    },
    onSuccess?: (result: IReceipt) => void,
    onError?: (error: any) => void
  ) => {
    const { data: response } = await fetchApi.put<IReceipt>(
      `api/v1/warehouse/goods-received-note/${id}/update-status`,
      payload
    )
    if (response.success) {
      onSuccess?.(response.data)
    } else {
      onError?.(response.message)
    }
  }

  const onFetchGoodsDeliveryNote = async (warehouseId: string | number) => {
    if (!warehouseId) {
      setPage(1)
      setLimit(15)
      receipts.value = []
      count.value = 0
      numPages.value = 0
      draftCount.value = 0
      return
    }

    const params = {
      page: page.value,
      limit: limit.value,
      wid: warehouseId,
    }
    if (search.value) {
      params['search'] = search.value
    }
    const { data: response } = await fetchApi.get<IReceiptExport[], IMetadata>(
      'api/v1/warehouse/goods-delivery-note',
      params
    )
    if (response.success) {
      const metadata = response.metadata
      receiptExports.value = response.data
      count.value = metadata.pagination.count ?? 0
      numPages.value = metadata.pagination.num_pages ?? 0
      draftCount.value = metadata.draft_count ?? 0
    }
  }

  const onFetchGoodsDeliveryNoteById = async (goodsDeliveryNoteId: string | number) => {
    const { data: response } = await fetchApi.get<IReceiptExport>(
      `api/v1/warehouse/goods-delivery-note/${goodsDeliveryNoteId}`
    )
    if (response.success) {
      receiptExport.value = response.data
    }
  }

  const onCreateGoodsDeliveryNote = async (
    payload: IReceiptExportFormPayload,
    onSuccess?: (result: IReceipt) => void,
    onError?: (error: any) => void
  ) => {
    const { data: response } = await fetchApi.post<IReceiptExport>('api/v1/warehouse/goods-delivery-note', payload)
    if (response.success) {
      onSuccess?.(response.data)
    } else {
      onError?.(response.message)
    }
  }

  const onUpdateGoodsDeliveryNote = async (
    id: string | number,
    payload: IReceiptExportFormPayload,
    onSuccess?: (result: IReceiptExport) => void,
    onError?: (error: any) => void
  ) => {
    const { data: response } = await fetchApi.put<IReceiptExport>(`api/v1/warehouse/goods-delivery-note/${id}`, payload)
    if (response.success) {
      onSuccess?.(response.data)
    } else {
      onError?.(response.message)
    }
  }

  const onUpdateGoodsDeliveryNoteStatus = async (
    id: string | number,
    payload: {
      status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
      reject_reason: string
    },
    onSuccess?: (result: IReceiptExport) => void,
    onError?: (error: any) => void
  ) => {
    const { data: response } = await fetchApi.put<IReceiptExport>(
      `api/v1/warehouse/goods-delivery-note/${id}/update-status`,
      payload
    )
    if (response.success) {
      onSuccess?.(response.data)
    } else {
      onError?.(response.message)
    }
  }

  const onFetchGoodsReceivedNoteBatchByMedicalProduct = async (
    medicalProductId: string | number,
    rid?: string | number
  ) => {
    const params = {
      mpid: medicalProductId,
      wid: warehouseSelected?.value,
    }

    if (rid) {
      params['rid'] = rid
    }

    const { data: response } = await fetchApi.get<IReceiptBatch[]>(
      'api/v1/warehouse/goods-received-note/batches-by-medical-product',
      params
    )
    if (response.success) {
      return response.data
    }

    return []
  }

  return {
    receipts,
    receipt,
    receiptExports,
    receiptExport,
    page,
    limit,
    count,
    numPages,
    search,
    setSearch,
    setPage,
    setLimit,
    setReceipt,
    setReceiptExport,
    draftCount,
    onFetchGoodsReceivedNote,
    onFetchGoodsReceivedNoteById,
    onCreateGoodsReceivedNote,
    onUpdateGoodsReceivedNote,
    onUpdateGoodsReceivedNoteStatus,
    onFetchGoodsDeliveryNote,
    onFetchGoodsDeliveryNoteById,
    onCreateGoodsDeliveryNote,
    onUpdateGoodsDeliveryNote,
    onUpdateGoodsDeliveryNoteStatus,
    onFetchGoodsReceivedNoteBatchByMedicalProduct,
  }
}
