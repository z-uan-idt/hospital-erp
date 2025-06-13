import type { IOrganization, IOrganizationActionRequest } from '~/types/oranization.types'
import type { IPagination } from '~/types/response.types'

import * as apiConstants from '~/constants/api.constants'
import type { IBasicAccount, IStaff } from '~/types/account.types'

type IMetadata = {
  pagination: IPagination
  nested_count: number
}

export const useOrganization = () => {
  const page = ref<number>(1)
  const limit = ref<number>(5)
  const count = ref<number>(0)
  const search = ref<string>('')
  const numPages = ref<number>(0)
  const organizations = ref<IOrganization[]>([])
  const organization = ref<IOrganization | null>(null)
  const emptyOrganizationCookie = useCookie('is_not_org')

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
      'api/v1/organization/current-user-organizations',
      params
    )
    if (response.success) {
      const metadata = response.metadata
      organizations.value = response.data
      count.value = metadata.pagination.count ?? 0
      numPages.value = metadata.pagination.num_pages ?? 0
      emptyOrganizationCookie.value = metadata?.nested_count === 0 ? '1' : '0'
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

  const onFetchRequestJoinOrganizations = async (organizationId: string | number) => {
    const { data: response } = await fetchApi.get<IBasicAccount[]>(`api/v1/organization/member-request-to-joins`, {
      oid: organizationId,
    })
    if (response.success) {
      return response.data
    }

    return []
  }

  const onFetchInvitationSentOrganizations = async (organizationId: string | number) => {
    const { data: response } = await fetchApi.get<IBasicAccount[]>(`api/v1/organization/member-invitation-sent`, {
      oid: organizationId,
    })
    if (response.success) {
      return response.data
    }

    return []
  }

  const onFetchInvitationSentOrganizationsByCurrentUser = async <T>(): Promise<T> => {
    const { data: response } = await fetchApi.get<T>(`api/v1/organization/current-user-invitation-sent-organizations`)
    if (response.success) {
      return response.data
    }

    return [] as T
  }

  const onFindExactByPhoneNumberWithoutCurrentOrganization = async (
    organizationId: string | number,
    phoneNumber: string
  ) => {
    const { data: response } = await fetchApi.get<IBasicAccount>(
      `api/v1/organization/find-exact-phone-number-without-organization`,
      { search: phoneNumber, oid: organizationId }
    )
    if (response.success) {
      return response.data
    }

    return null
  }

  const onRequestOrganization = async (
    organizationId: number,
    onSuccess: (organization: IOrganization) => void,
    onError: (error: string) => void
  ) => {
    const { data: response } = await fetchApi.post('api/v1/organization/current-user-request-to-join-organization', {
      organization: organizationId,
    })
    if (response.success) {
      onSuccess(response.data)
    } else {
      onError(response.message)
    }
  }

  const onRejectRequestToJoinOrganizationAction = async (
    payload: {
      organization?: number
      account?: number
    },
    onSuccess: () => void,
    onError: (error: string) => void
  ) => {
    const { data: response } = await fetchApi.post('api/v1/organization/reject-request-to-join-organization', payload)
    if (response.success) {
      onSuccess()
    } else {
      onError(response.message)
    }
  }

  const onCancelInvitationSentOrganizationAction = async (
    payload: {
      organization?: number
      account?: number
    },
    onSuccess: () => void,
    onError: (error: string) => void
  ) => {
    const { data: response } = await fetchApi.post(
      'api/v1/organization/cancel-request-invitation-organization',
      payload
    )
    if (response.success) {
      onSuccess()
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
    const { data: response } = await fetchApi.post(`api/v1/organization/current-user-organization-action`, {
      organization: organizationId,
      action,
    })
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

  const onAcceptRequestJoinOrganization = async (
    formData: FormData,
    onSuccess: () => void,
    onError: (error: string) => void
  ) => {
    const { data: response } = await fetchApi.post<IOrganization>(
      'api/v1/organization/accept-request-to-join-organization',
      formData,
      {
        headers: {
          'Content-Type': apiConstants.API_CONTENT_TYPE_MULTIPART_FORM_DATA,
        },
      }
    )

    if (response.success) {
      onSuccess()
    } else {
      onError(response.message)
    }
  }

  const onUpdateStaffOrganization = async (
    formData: FormData,
    onSuccess: () => void,
    onError: (error: string) => void
  ) => {
    const { data: response } = await fetchApi.post(`api/v1/organization/update-staff-organization`, formData, {
      headers: {
        'Content-Type': apiConstants.API_CONTENT_TYPE_MULTIPART_FORM_DATA,
      },
    })

    if (response.success) {
      onSuccess()
    } else {
      onError(response.message)
    }
  }

  const onInviteRequestJoinOrganization = async (
    formData: FormData,
    onSuccess: () => void,
    onError: (error: string) => void
  ) => {
    const { data: response } = await fetchApi.post<IOrganization>(
      'api/v1/organization/send-invitation-to-join-organization',
      formData,
      {
        headers: {
          'Content-Type': apiConstants.API_CONTENT_TYPE_MULTIPART_FORM_DATA,
        },
      }
    )

    if (response.success) {
      onSuccess()
    } else {
      onError(response.message)
    }
  }

  const onUpdateOrganization = async (
    organizationId: number,
    formData: FormData,
    onSuccess: (organization: IOrganization) => void,
    onError: (error: string) => void
  ) => {
    const { data: response } = await fetchApi.put<IOrganization>(
      `api/v1/organization/${organizationId}/current-user-organization-update`,
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

  const isEmptyOrganization = computed(() => {
    return emptyOrganizationCookie.value?.toString() === '1'
  })

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
    onUpdateOrganization,
    isEmptyOrganization,
    onFetchRequestJoinOrganizations,
    onFetchInvitationSentOrganizations,
    onRejectRequestToJoinOrganizationAction,
    onAcceptRequestJoinOrganization,
    onFindExactByPhoneNumberWithoutCurrentOrganization,
    onInviteRequestJoinOrganization,
    onCancelInvitationSentOrganizationAction,
    onFetchInvitationSentOrganizationsByCurrentUser,
    onUpdateStaffOrganization,
  }
}
