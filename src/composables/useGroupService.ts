import type { IGroupService, IGroupServiceFormPayload, IGroupServiceType } from '~/types/core.types'
import type { IMedicalProductType } from '~/types/medical_product.types'

export const useGroupService = () => {
  const fetchApi = usePrivateApi()
  const { organizationSelected, selectedMedicalProductType } = useAuth()

  const onFetchGroupServiceAutocomplete = async (
    page: number,
    type: IGroupServiceType,
    limit: number = 10,
    search: string = ''
  ) => {
    const params = {
      oid: organizationSelected.value?.id,
      mp_type: selectedMedicalProductType.value,
      limit,
      page,
      type,
    }
    if (search && search.trim() !== '') {
      params['search'] = search.trim()
    }
    const { data: response } = await fetchApi.get<IGroupService[]>('/api/v1/services/group-service', params)
    if (response.success) {
      return {
        items: response.data,
        count: response.metadata?.pagination?.count,
        num_pages: response.metadata?.pagination?.num_pages,
      }
    }
    return {
      items: [],
      count: 0,
      num_pages: 0,
    }
  }

  const onFetchGroupService = async (
    mp_type: IMedicalProductType,
    type: IGroupServiceType,
    page: number = -1,
    limit: number = 10,
    search: string = ''
  ) => {
    const params = {
      oid: organizationSelected.value?.id,
      mp_type: mp_type,
      limit,
      page,
      type,
    }
    if (search && search.trim() !== '') {
      params['search'] = search.trim()
    }
    const { data: response } = await fetchApi.get<IGroupService[]>('/api/v1/services/group-service', params)
    if (response.success) {
      return {
        items: response.data,
        count: response.metadata?.pagination?.count,
        num_pages: response.metadata?.pagination?.num_pages,
      }
    }
    return {
      items: [],
      count: 0,
      num_pages: 0,
    }
  }

  const onCreateGroupService = async (
    payload: IGroupServiceFormPayload,
    onSuccess?: (data: IGroupService) => void,
    onError?: (error: any) => void
  ) => {
    payload.organization = organizationSelected.value?.id
    const { data: response } = await fetchApi.post<IGroupService>('/api/v1/services/group-service', payload)
    if (response.success) {
      onSuccess?.(response.data)
    } else {
      onError?.(response.message)
    }
    return response.success
  }

  return { onFetchGroupServiceAutocomplete, onFetchGroupService, onCreateGroupService }
}
