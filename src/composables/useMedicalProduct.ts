import { API_CONTENT_TYPE_MULTIPART_FORM_DATA } from '~/constants/api.constants'
import { ITEM_PER_PAGE } from '~/constants/core.constants'
import type { IMedicalProduct, IMedicalProductFormPayload, IMedicalProductType } from '~/types/medical_product.types'
import type { IPagination } from '~/types/response.types'

type IMetadata = {
  pagination: IPagination
}

export const useMedicalProduct = () => {
  const medicalProducts = ref<IMedicalProduct[]>([])
  const medicalProduct = ref<IMedicalProduct | null>(null)

  const { selectedMedicalProductType } = useAuth()

  const fetchApi = usePrivateApi()
  const page = ref(1)
  const limit = ref(ITEM_PER_PAGE)
  const search = ref('')
  const count = ref(0)
  const numPages = ref(0)
  const source = ref<string | null>(null)
  const sid = ref<number | null>(null)
  const gid = ref<number | null>(null)
  const wid = ref<number | null>(null)

  const setPage = (value: number | null) => {
    page.value = value
  }

  const setLimit = (value: number | null) => {
    limit.value = value
  }

  const setSearch = (value: string) => {
    search.value = value
  }

  const setSid = (value: number | null) => {
    sid.value = value
  }

  const setSource = (value: string | null) => {
    source.value = value
  }

  const setGid = (value: number | null) => {
    gid.value = value
  }

  const setWid = (value: number | null) => {
    wid.value = value
  }

  const onFetchMedicalProduct = async (organizationId: string | number, mp_type?: IMedicalProductType) => {
    const params = {
      page: page.value,
      limit: limit.value,
      oid: organizationId,
      mp_type: mp_type || selectedMedicalProductType.value,
    }
    if (wid.value) {
      params['wid'] = wid.value
    }
    if (search.value) {
      params['search'] = search.value
    }
    if (source.value) {
      params['source'] = source.value
    }
    if (sid.value) {
      params['sid'] = sid.value
    }
    if (gid.value) {
      params['gid'] = gid.value
    }
    const { data: response } = await fetchApi.get<IMedicalProduct[], IMetadata>(
      'api/v1/services/medical-product',
      params
    )
    if (response.success) {
      const metadata = response.metadata
      medicalProducts.value = response.data
      count.value = metadata.pagination.count ?? 0
      numPages.value = metadata.pagination.num_pages ?? 0
    }
  }

  const onFetchMedicalProductById = async (medicalProductId: string | number) => {
    const { data: response } = await fetchApi.get<IMedicalProduct>(
      `api/v1/services/medical-product/${medicalProductId}`
    )
    if (response.success) {
      medicalProduct.value = response.data
    }
  }

  const onCreateMedicalProduct = async (
    payload: FormData,
    onSuccess?: (result: IMedicalProduct) => void,
    onError?: (error: any) => void
  ) => {
    const { data: response } = await fetchApi.post<IMedicalProduct>('api/v1/services/medical-product', payload, {
      headers: {
        'Content-Type': API_CONTENT_TYPE_MULTIPART_FORM_DATA,
      },
    })
    if (response.success) {
      onSuccess?.(response.data)
    } else {
      onError?.(response.message)
    }
  }

  const onUpdateMedicalProduct = async (
    id: string | number,
    payload: FormData,
    onSuccess?: (result: IMedicalProduct) => void,
    onError?: (error: any) => void
  ) => {
    const { data: response } = await fetchApi.put<IMedicalProduct>(`api/v1/services/medical-product/${id}`, payload, {
      headers: {
        'Content-Type': API_CONTENT_TYPE_MULTIPART_FORM_DATA,
      },
    })
    if (response.success) {
      onSuccess?.(response.data)
    } else {
      onError?.(response.message)
    }
  }

  const onFetchWarehouseByMedicalProductGroup = async <T>(medicalProductId: string | number) => {
    const { data: response } = await fetchApi.get<T>(
      `api/v1/services/medical-product/get-warehouse-by-medical-product-group`,
      {
        did: medicalProductId,
      }
    )
    if (response.success) {
      return response.data
    }
    return []
  }

  return {
    medicalProducts,
    medicalProduct,
    page,
    limit,
    count,
    numPages,
    search,
    source,
    sid,
    gid,
    setSearch,
    setSid,
    setWid,
    setSource,
    setGid,
    setPage,
    setLimit,
    onFetchMedicalProduct,
    onFetchMedicalProductById,
    onCreateMedicalProduct,
    onUpdateMedicalProduct,
    onFetchWarehouseByMedicalProductGroup,
  }
}
