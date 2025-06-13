import { ITEM_PER_PAGE } from '~/constants/core.constants'
import type {
  IBasicDepartment,
  IBasicRolePermission,
  IDepartment,
  IDepartmentCreatePayload,
} from '~/types/department.types'
import type { IPagination } from '~/types/response.types'

type IMetadata = {
  pagination: IPagination
}

export const useDepartment = () => {
  const departments = ref<IDepartment[]>([])
  const department = ref<IDepartment | null>(null)

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

  const onFetchDepartment = async (organizationId: string | number) => {
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
    const { data: response } = await fetchApi.get<IDepartment[], IMetadata>('/api/v1/organization/department', params)
    if (response.success) {
      const metadata = response.metadata
      departments.value = response.data
      count.value = metadata.pagination.count ?? 0
      numPages.value = metadata.pagination.num_pages ?? 0
    }
  }

  const onFetchDepartmentById = async (departmentId: string | number) => {
    const { data: response } = await fetchApi.get<IDepartment>(`/api/v1/organization/department/${departmentId}`)
    if (response.success) {
      department.value = response.data
    }
  }

  const onCreateDepartment = async (
    payload: IDepartmentCreatePayload,
    onSuccess: (department: IDepartment) => void,
    onError: (error: string) => void
  ) => {
    const { data: response } = await fetchApi.post<IDepartment>('/api/v1/organization/department', payload)

    if (response.success) {
      onSuccess(response.data)
    } else {
      onError(response.message)
    }
  }

  const onFetchDepartmentDropdown = async (organizationId: string | number, accountId?: number) => {
    const params = {
      oid: organizationId,
    }

    if (accountId) {
      params['aid'] = accountId
    }

    const { data: response } = await fetchApi.get<IBasicDepartment[]>(
      'api/v1/organization/department/departments-dropdown',
      params
    )
    if (response.success) {
      return response.data
    }

    return []
  }

  const onFetchRolePermissionDropdown = async (departmentId: string | number) => {
    const params = {
      did: departmentId,
    }

    const { data: response } = await fetchApi.get<IBasicRolePermission[]>(
      'api/v1/organization/department/roles-dropdown',
      params
    )
    if (response.success) {
      return response.data
    }

    return []
  }

  return {
    departments,
    department,
    page,
    limit,
    search,
    setPage,
    setLimit,
    setSearch,
    setOrderBy,
    numPages,
    count,
    onFetchDepartment,
    onFetchDepartmentById,
    onCreateDepartment,
    onFetchDepartmentDropdown,
    onFetchRolePermissionDropdown,
  }
}
