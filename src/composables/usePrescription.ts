import { ITEM_PER_PAGE } from '~/constants/core.constants'
import type { IPrescription } from '~/types/prescription.types'
import type { IPagination } from '~/types/response.types'

type IMetadata = {
  pagination: IPagination
}

export const usePrescription = () => {
  const prescriptions = ref<IPrescription[]>([])
  const prescription = ref<IPrescription | null>(null)

  const fetchApi = usePrivateApi()
  const page = ref(1)
  const limit = ref(ITEM_PER_PAGE)
  const search = ref('')
  const count = ref(0)
  const numPages = ref(0)
  const orderBy = ref<string[]>([])

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

  const onFetchPrescription = async (organizationId: string | number) => {
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
    const { data: response } = await fetchApi.get<IPrescription[], IMetadata>('/api/v1/services/prescription', params)
    if (response.success) {
      const metadata = response.metadata
      prescriptions.value = response.data
      count.value = metadata.pagination.count ?? 0
      numPages.value = metadata.pagination.num_pages ?? 0
    }
  }

  return {
    prescriptions,
    prescription,
    page,
    limit,
    search,
    setPage,
    setLimit,
    setSearch,
    setOrderBy,
    numPages,
    count,
    onFetchPrescription,
  }
}
