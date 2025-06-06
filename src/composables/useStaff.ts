import { ITEM_PER_PAGE } from '~/constants/core.constants'
import type { IStaff } from '~/types/account.types'
import type { IPagination } from '~/types/response.types'

type IMetadata = {
  pagination: IPagination
}

export const useStaff = () => {
  const staffs = ref<IStaff[]>([])
  const staff = ref<IStaff | null>(null)

  const fetchApi = usePrivateApi()
  const page = ref(1)
  const limit = ref(ITEM_PER_PAGE)
  const search = ref('')
  const count = ref(0)
  const numPages = ref(0)
  const orderBy = ref<string[]>([])
  const role = ref<number | null>(null)
  const wid = ref<number | null>(null)
  const aid = ref<number | null>(null)
  const did = ref<number | null>(null)

  const setPage = (value: number) => {
    page.value = value
  }

  const setLimit = (value: number) => {
    limit.value = value
  }

  const setSearch = (value: string) => {
    search.value = value
  }

  const setRole = (value: number) => {
    role.value = value
  }

  const setWid = (value: number) => {
    wid.value = value
  }

  const setAid = (value: number) => {
    aid.value = value
  }

  const setDid = (value: number) => {
    did.value = value
  }

  const setOrderBy = (value: string) => {
    const index = orderBy.value.findIndex((item) => item === value)
    if (index !== -1) {
      orderBy.value.splice(index, 1)
    } else {
      orderBy.value.push(value)
    }
  }

  const onFetchMemberOfOrganizationNoRole = async (organizationId: string | number, departmentId?: string | number) => {
    const params = {
      oid: organizationId,
    }

    if (departmentId) {
      params['did'] = departmentId
    }

    const { data: response } = await fetchApi.get<IStaff[]>('api/v1/organization/member-department-no-role', params)
    if (response.success) {
      return response.data
    }

    return []
  }

  const onFetchStaff = async (organizationId: string | number) => {
    const params = {
      page: page.value,
      limit: limit.value,
      oid: organizationId,
    }
    if (search.value) {
      params['search'] = search.value
    }
    if (role.value) {
      params['role'] = role.value
    }
    if (wid.value) {
      params['wid'] = wid.value
    }
    if (aid.value) {
      params['aid'] = aid.value
    }
    if (did.value) {
      params['did'] = did.value
    }
    const { data: response } = await fetchApi.get<IStaff[], IMetadata>('api/v1/organization/members', params)
    if (response.success) {
      const metadata = response.metadata
      staffs.value = response.data
      count.value = metadata.pagination.count ?? 0
      numPages.value = metadata.pagination.num_pages ?? 0
    }
  }

  return {
    staffs,
    staff,
    page,
    limit,
    search,
    setPage,
    setLimit,
    setSearch,
    setOrderBy,
    numPages,
    count,
    onFetchStaff,
    setRole,
    setWid,
    setAid,
    setDid,
    onFetchMemberOfOrganizationNoRole,
  }
}
