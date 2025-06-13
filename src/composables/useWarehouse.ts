import { ITEM_PER_PAGE } from '~/constants/core.constants'
import type { IBasicWarehouse, IPagination } from '~/types/response.types'
import type {
  IWarehouse,
  IWarehouseCreatePayload,
  IWarehouseMedicalProductGroupStorages,
} from '~/types/warehouse.types'

type IMetadata = {
  pagination: IPagination
}

export const useWarehouse = () => {
  const warehouses = ref<IWarehouse[]>([])
  const warehouse = ref<IWarehouse | null>(null)

  const fetchApi = usePrivateApi()
  const page = ref(1)
  const limit = ref(ITEM_PER_PAGE)
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
    const { data: response } = await fetchApi.get<IWarehouse[], IMetadata>('/api/v1/warehouse', params)
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

  const onFetchWarehouseDropdown = async (departmentId: string | number) => {
    const params = {
      did: departmentId,
    }

    const { data: response } = await fetchApi.get<IBasicWarehouse[]>(
      'api/v1/organization/department/warehouses-dropdown',
      params
    )
    if (response.success) {
      return response.data
    }

    return []
  }

  const onSaveInventoryLevels = async (payload: {
    warehouse: number
    minimum_stock_limit: number
    maximum_stock_limit: number
  }) => {
    const { data: response } = await fetchApi.post(`/api/v1/warehouse/save-inventory-levels`, payload)
    return response
  }

  const onSaveWarehouseMedicalProductGroupStorage = async (payload: {
    warehouse: number
    drug_groups: number[]
    material_groups: number[]
    chemical_groups: number[]
  }) => {
    const { data: response } = await fetchApi.post(
      `/api/v1/warehouse/save-warehouse-medical-product-group-storage`,
      payload
    )
    return response
  }

  const onSaveWarehouseMedicalProductStorage = async (
    payload: {
      warehouse: number
      medical_product: number
      min_quantity: number
      max_quantity: number
      is_unlimited: boolean
    }[]
  ) => {
    const { data: response } = await fetchApi.post(`/api/v1/warehouse/save-warehouse-medical-product-storage`, payload)
    return response
  }

  const onFetchWarehouseMedicalProductGroupStorages = async (warehouseId: string | number) => {
    const { data: response } = await fetchApi.get<IWarehouseMedicalProductGroupStorages>(
      `/api/v1/warehouse/warehouse-medical-product-group-storage`,
      {
        wid: warehouseId,
      }
    )
    return response
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
    onFetchWarehouseDropdown,
    onSaveInventoryLevels,
    onSaveWarehouseMedicalProductGroupStorage,
    onFetchWarehouseMedicalProductGroupStorages,
    onSaveWarehouseMedicalProductStorage,
  }
}
