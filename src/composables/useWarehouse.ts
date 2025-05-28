import type { IPagination } from '~/types/response.types'
import type { IWarehouse, IWarehouseCreatePayload } from '~/types/warehouse.types'

type IMetadata = {
  pagination: IPagination
}

export const useWarehouse = () => {
  const warehouses = ref<IWarehouse[]>([])
  const warehouse = ref<IWarehouse | null>(null)

  const fetchApi = usePrivateApi()
  const page = ref(1)
  const limit = ref(10)
  const search = ref('')
  const count = ref(0)
  const numPages = ref(0)
  const orderBy = ref<string[]>([])
  const aid = ref<number | null>(null)
  const did = ref<number | null>(null)

  const setAid = (value: number) => {
    aid.value = value
  }

  const setDid = (value: number) => {
    did.value = value
  }

  const setPage = (value: number) => {
    page.value = value
  }

  const setLimit = (value: number) => {
    limit.value = value
  }

  const setSearch = (value: string) => {
    search.value = value
  }

  const setOrderBy = (value: string) => {
    const index = orderBy.value.findIndex((item) => item === value)
    if (index !== -1) {
      orderBy.value.splice(index, 1)
    } else {
      orderBy.value.push(value)
    }
  }

  const onFetchWarehouse = async (organizationId: string | number) => {
    const params = {
      page: page.value,
      limit: limit.value,
      oid: organizationId,
    }
    if (search.value) {
      params['search'] = search.value
    }
    if (orderBy.value.length > 0) {
      params['order_by'] = orderBy.value.join(',')
    }
    if (aid.value) {
      params['aid'] = aid.value
    }
    if (did.value) {
      params['did'] = did.value
    }
    const { data: response } = await fetchApi.get<IWarehouse[], IMetadata>(
      '/api/v1/warehouse',
      params
    )
    if (response.success) {
      const metadata = response.metadata
      warehouses.value = response.data
      count.value = metadata.pagination.count ?? 0
      numPages.value = metadata.pagination.num_pages ?? 0
    }
  }

  const onFetchWarehouseById = async (warehouseId: string | number) => {
    const { data: response } = await fetchApi.get<IWarehouse>(`/api/v1/warehouse/${warehouseId}`)
    if (response.success) {
      warehouse.value = response.data
      console.log(warehouse.value)
    }
  }

  const onCreateWarehouse = async (
    payload: IWarehouseCreatePayload,
    onSuccess: (warehouse: IWarehouse) => void,
    onError: (error: string) => void
  ) => {
    const { data: response } = await fetchApi.post<IWarehouse>('/api/v1/warehouse', payload)

    if (response.success) {
      onSuccess(response.data)
    } else {
      onError(response.message)
    }
  }

  return {
    warehouses,
    warehouse,
    page,
    limit,
    search,
    setPage,
    setLimit,
    setSearch,
    setOrderBy,
    numPages,
    count,
    setAid,
    setDid,
    onFetchWarehouse,
    onFetchWarehouseById,
    onCreateWarehouse,
  }
}
