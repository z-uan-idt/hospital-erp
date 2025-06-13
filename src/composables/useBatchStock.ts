import { ITEM_PER_PAGE } from '~/constants/core.constants'
import type { IMedicalProductType } from '~/types/medical_product.types'
import type { IPagination } from '~/types/response.types'
import type { IBatchStock, IBatchWarningSettings, IBatchWarningSettingsFormPayload } from '~/types/warehouse.types'

type IMetadata = {
  pagination: IPagination
}

export const useBatchStock = () => {
  const batchStocks = ref<IBatchStock[]>([])
  const batchStock = ref<IBatchStock | null>(null)

  const fetchApi = usePrivateApi()
  const page = ref(1)
  const limit = ref(ITEM_PER_PAGE)
  const search = ref('')
  const mpType = ref<IMedicalProductType>('THUOC')
  const count = ref(0)
  const numPages = ref(0)

  const setPage = (value: number) => {
    page.value = value
  }

  const setLimit = (value: number) => {
    limit.value = value
  }

  const setSearch = (value: string) => {
    search.value = value
  }

  const setMPType = (value: IMedicalProductType) => {
    mpType.value = value
  }

  const onFetchBatchStock = async (warehouseId: string | number) => {
    const params = {
      page: page.value,
      limit: limit.value,
      wid: warehouseId,
    }
    if (search.value) {
      params['search'] = search.value
    }
    if (mpType.value) {
      params['mp_type'] = mpType.value
    }
    const { data: response } = await fetchApi.get<IBatchStock[], IMetadata>(
      '/api/v1/warehouse/batch/batch-stocks',
      params
    )
    if (response.success) {
      const metadata = response.metadata
      batchStocks.value = response.data
      count.value = metadata.pagination.count ?? 0
      numPages.value = metadata.pagination.num_pages ?? 0
    }
  }

  const onFetchBatchWarningSettings = async (warehouseId: string | number) => {
    const { data: response } = await fetchApi.get<IBatchWarningSettings[]>(
      `/api/v1/warehouse/batch/batch-warning-settings`,
      {
        wid: warehouseId,
      }
    )
    if (response.success) {
      return response.data
    }

    return []
  }

  const onBatchWarningSetting = async (
    payload: IBatchWarningSettingsFormPayload,
    onSuccess: (data: IBatchWarningSettings[]) => void,
    onError: (error: string) => void
  ) => {
    const { data: response } = await fetchApi.post<IBatchWarningSettings[]>(
      `/api/v1/warehouse/batch/batch-warning-setting`,
      payload
    )
    if (response.success) {
      onSuccess(response.data)
    } else {
      onError(response.message)
    }
  }

  return {
    batchStocks,
    batchStock,
    page,
    limit,
    search,
    setPage,
    setLimit,
    setSearch,
    numPages,
    count,
    mpType,
    setMPType,
    onFetchBatchStock,
    onFetchBatchWarningSettings,
    onBatchWarningSetting,
  }
}
