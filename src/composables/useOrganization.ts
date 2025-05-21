import type {
  IOrganization,
  IOrganizationActionRequest,
} from '~/types/oranization.types'
import type { IPagination } from '~/types/response.types'

import * as apiConstants from '~/constants/api.constants'

type IMetadata = {
  pagination: IPagination
}

export const useOrganization = () => {
  const page = ref<number>(1)
  const limit = ref<number>(5)
  const count = ref<number>(0)
  const search = ref<string>('')
  const numPages = ref<number>(0)
  const organizations = ref<IOrganization[]>([])
  const organization = ref<IOrganization | null>(null)

  const fetchApi = usePrivateApi()

  const setPage = (value: number) => {
    page.value = value
  }

  const setLimit = (value: number) => {
    limit.value = value
  }

  const setSearch = (value: string) => {
    search.value = value
  }

  const onFetchOrganization = async () => {
    const params: Record<string, string | number> = {
      limit: limit.value,
      page: page.value,
    }
    if (search.value && search.value) {
      params.search = search.value
    }
    const { data: response } = await fetchApi.get<IOrganization[], IMetadata>(
      'api/v1/organization/current-user-organization',
      params
    )
    if (response.success) {
      organizations.value = response.data
      count.value = response.metadata.pagination.count ?? 0
      numPages.value = response.metadata.pagination.num_pages ?? 0
    }
  }

  const onFetchOrganizationById = async (organizationId: string | number) => {
    const { data: response } = await fetchApi.get<IOrganization>(
      `api/v1/organization/${organizationId}/current-user-organization-retrieve`
    )
    if (response.success) {
      organization.value = response.data
    }
  }

  const onRequestOrganization = async (
    organizationId: number,
    onSuccess: (organization: IOrganization) => void,
    onError: (error: string) => void
  ) => {
    const { data: response } = await fetchApi.post(
      'api/v1/organization/current-user-request-join-organization',
      {
        organization: organizationId,
      }
    )
    if (response.success) {
      onSuccess(response.data)
    } else {
      onError(response.message)
    }
  }

  const onSearchOrganization = async (search: string) => {
    const { data: response } = await fetchApi.get<IOrganization>(
      `api/v1/organization/find-exact-organization-by-code`,
      {
        search,
      }
    )
    if (response.success) {
      organization.value = response.data
    }
  }

  const onActionOrganization = async (
    organizationId: number,
    action: IOrganizationActionRequest,
    onSuccess: (organization: IOrganization) => void,
    onError: (error: string) => void
  ) => {
    const { data: response } = await fetchApi.post(
      `api/v1/organization/current-user-organization-action`,
      {
        organization: organizationId,
        action,
      }
    )
    if (response.success) {
      onSuccess(response.data)
    } else {
      onError(response.message)
    }
  }

  const onCreateOrganization = async (
    formData: FormData,
    onSuccess: (organization: IOrganization) => void,
    onError: (error: string) => void
  ) => {
    const { data: response } = await fetchApi.post<IOrganization>(
      'api/v1/organization/current-user-organization-create',
      formData,
      {
        headers: {
          'Content-Type': apiConstants.API_CONTENT_TYPE_MULTIPART_FORM_DATA,
        },
      }
    )

    if (response.success) {
      onSuccess(response.data)
    } else {
      onError(response.message)
    }
  }

  return {
    onFetchOrganization,
    setSearch,
    setLimit,
    setPage,
    organizations,
    count,
    numPages,
    page,
    limit,
    search,
    organization,
    onRequestOrganization,
    onSearchOrganization,
    onActionOrganization,
    onCreateOrganization,
    onFetchOrganizationById,
  }
}
