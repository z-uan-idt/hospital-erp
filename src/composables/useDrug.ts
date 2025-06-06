import { API_CONTENT_TYPE_MULTIPART_FORM_DATA } from '~/constants/api.constants'
import { ITEM_PER_PAGE } from '~/constants/core.constants'
import type { IDrug, IDrugFormPayload } from '~/types/drug.types'
import type { IPagination } from '~/types/response.types'

type IMetadata = {
  pagination: IPagination
}

export const useDrug = () => {
  const drugs = ref<IDrug[]>([])
  const drug = ref<IDrug | null>(null)

  const fetchApi = usePrivateApi()
  const page = ref(1)
  const limit = ref(ITEM_PER_PAGE)
  const search = ref('')
  const count = ref(0)
  const numPages = ref(0)
  const source = ref<string | null>(null)
  const sid = ref<number | null>(null)
  const gid = ref<number | null>(null)

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

  const onFetchDrug = async (organizationId: string | number) => {
    const params = {
      page: page.value,
      limit: limit.value,
      oid: organizationId,
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
    const { data: response } = await fetchApi.get<IDrug[], IMetadata>('api/v1/services/drug', params)
    if (response.success) {
      const metadata = response.metadata
      drugs.value = response.data
      count.value = metadata.pagination.count ?? 0
      numPages.value = metadata.pagination.num_pages ?? 0
    }
  }

  const onFetchDrugById = async (drugId: string | number) => {
    const { data: response } = await fetchApi.get<IDrug>(`api/v1/services/drug/${drugId}`)
    if (response.success) {
      drug.value = response.data
    }
  }

  const onCreateDrug = async (
    payload: FormData,
    onSuccess?: (result: IDrug) => void,
    onError?: (error: any) => void
  ) => {
    const { data: response } = await fetchApi.post<IDrug>('api/v1/services/drug', payload, {
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

  const onUpdateDrug = async (
    id: string | number,
    payload: FormData,
    onSuccess?: (result: IDrug) => void,
    onError?: (error: any) => void
  ) => {
    const { data: response } = await fetchApi.put<IDrug>(`api/v1/services/drug/${id}`, payload, {
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

  return {
    drugs,
    drug,
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
    setSource,
    setGid,
    setPage,
    setLimit,
    onFetchDrug,
    onFetchDrugById,
    onCreateDrug,
    onUpdateDrug,
  }
}
