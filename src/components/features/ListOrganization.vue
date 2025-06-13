<template>
  <div class="erp-organization-list">
    <v-list>
      <v-list-item
        v-for="organization in organizations"
        :key="organization.id"
        variant="outlined"
        base-color="grey-lighten-1"
        class="mb-4 pt-3 pb-3 ps-3 pe-6"
        :ripple="organization.infor?.value !== 'REQUESTED_TO_JOIN'"
        :rounded="!$vuetify.display.lgAndUp ? 'xl' : 'pill'"
        :disabled="organizationSelected?.id === organization.id"
        @click.prevent="onSelectOrganizationModule(organization)"
      >
        <template #prepend>
          <v-avatar
            size="80"
            variant="outlined"
            color="grey-lighten-1"
            class="d-flex align-center bg-white justify-center"
            style="user-select: none; pointer-events: none"
          >
            <v-img
              v-if="organization.profile_picture"
              :src="organization.profile_picture"
              class="position-absolute top-0 left-0"
            />
            <span
              v-else
              class="text-blue-grey-darken-3 text-lg-h4 text-h6 font-weight-bold"
              style="line-height: 1; margin-right: -2px"
            >
              {{ organization.name.charAt(0).toUpperCase() }}
            </span>
          </v-avatar>
        </template>
        <div
          :class="['d-flex flex-lg-row flex-column align-start', 'align-lg-center justify-space-between w-100 ga-2']"
        >
          <div class="d-flex flex-lg-row flex-column ga-1">
            <div class="text-h6 font-weight-bold text-black mb-1 mb-lg-0">
              {{ organization.name }}
              <v-icon
                v-if="organization.is_verified"
                color="blue-darken-1"
                :size="!$vuetify.display.mdAndUp ? 20 : 24"
                class="mt-n1"
              >
                mdi-check-circle
              </v-icon>
            </div>

            <div class="d-flex align-center ga-2 select-none ms-lg-4 flex-wrap">
              <v-chip
                size="small"
                :color="organization.infor?.value === 'REQUESTED_TO_JOIN' ? 'yellow-darken-4' : 'grey-darken-4'"
                class="select-none"
              >
                {{ organization.infor.label }}
              </v-chip>
              <v-chip
                v-if="organization.is_active"
                size="small"
                color="green-darken-1"
                class="select-none"
              >
                Đang hoạt động
              </v-chip>
              <v-chip
                v-else
                size="small"
                color="red-darken-1"
                class="select-none"
              >
                Bị khóa
              </v-chip>
            </div>
          </div>

          <div class="d-flex ga-2 ms-lg-auto">
            <v-btn
              icon
              variant="outlined"
              color="erp-gray"
              size="32"
              nuxt
              :to="ROUTE_DON_VI_TO_CHUC.DETAIL.pathFunc(organization.id)"
              @click.stop
            >
              <Icon
                name="custom-eye"
                class="text-erp-gray-800"
                size="18"
              />
            </v-btn>

            <v-btn
              v-if="organization.is_owner && organization.is_active"
              icon
              variant="outlined"
              color="erp-gray"
              size="32"
              @click.stop="onConfirm(organization, 'DEACTIVATE')"
            >
              <Icon
                name="custom-lock"
                class="text-erp-gray-800"
                size="18"
              />
            </v-btn>

            <v-btn
              v-if="organization.is_owner && !organization.is_active"
              icon
              variant="outlined"
              color="erp-gray"
              size="32"
              @click.stop="onConfirm(organization, 'ACTIVATE')"
            >
              <Icon
                name="custom-lock-open"
                class="text-erp-brand"
                size="18"
              />
            </v-btn>

            <v-btn
              v-if="organization.is_owner && organization.is_active"
              icon
              variant="outlined"
              color="erp-gray"
              size="32"
              @click.stop="onConfirm(organization, 'DELETE')"
            >
              <Icon
                name="custom-trash"
                class="text-erp-error"
                size="18"
              />
            </v-btn>

            <v-btn
              v-if="notOwnerCheckStatus(organization, 'REQUESTED_TO_JOIN')"
              icon
              variant="outlined"
              color="erp-gray"
              size="32"
              @click.stop="onConfirm(organization, 'CANCEL_REQUESTED_TO_JOIN')"
            >
              <v-icon
                class="text-erp-error"
                size="24"
              >
                mdi-close
              </v-icon>
            </v-btn>

            <v-btn
              v-if="notOwnerCheckStatus(organization, 'ACTIVATED')"
              icon
              variant="outlined"
              color="erp-gray"
              size="32"
              @click.stop="onConfirm(organization, 'LEAVE')"
            >
              <Icon
                name="custom:right-from-line"
                class="text-erp-error"
                size="14"
                style="margin-right: -3px"
              />
            </v-btn>
          </div>
        </div>
      </v-list-item>
    </v-list>

    <v-dialog
      v-model="isShowConfirm"
      transition="fade-transition"
      max-width="fit-content"
      persistent
    >
      <v-card
        v-if="dialogOptions[confirmType]"
        class="pt-2"
      >
        <template #prepend>
          <v-icon
            size="24"
            style="margin-top: -2px"
          >
            mdi-info-outline
          </v-icon>
        </template>
        <template #title>
          <p
            class="font-weight-regular text-wrap"
            :class="[$vuetify.display.mdAndUp ? 'text-body-1' : 'text-body-2']"
          >
            {{ dialogOptions[confirmType].title }}
          </p>
        </template>
        <div class="d-flex ga-2 ps-4 pe-4 pb-4 align-center justify-end">
          <v-btn
            rounded="pill"
            variant="outlined"
            color="erp-gray-700"
            @click="isShowConfirm = false"
          >
            <template #prepend>
              <v-icon
                size="18"
                class="me-n1"
              >
                mdi-close
              </v-icon>
            </template>
            <span style="margin-bottom: -1px"> Hủy bỏ </span>
          </v-btn>

          <v-btn
            elevation="0"
            rounded="pill"
            :color="dialogOptions[confirmType].color"
            :loading="isLoading"
            @click="onFinishConfirm"
          >
            <template #prepend>
              <v-icon
                class="ms-1"
                :size="dialogOptions[confirmType]?.iconSize || 16"
                :class="dialogOptions[confirmType]?.iconClass"
              >
                {{ dialogOptions[confirmType].icon }}
              </v-icon>
            </template>
            <span style="margin-bottom: -1px">
              {{ dialogOptions[confirmType].confirmText }}
            </span>
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <FeatureOrganizationSelectedModule
      :organization="organizationSelectedModule"
      @close="organizationSelectedModule = null"
    />
  </div>
</template>

<script setup lang="ts">
  import { ROUTE_DON_VI_TO_CHUC } from '~/constants/route.constants'
  import type { IOrganization, IOrganizationActionRequest } from '~/types/oranization.types'

  type IDialogOptions = {
    [key in IOrganizationActionRequest]?: {
      title: string
      icon: string
      color: string
      confirmText: string
      msgDone?: string
      iconSize?: number
      iconClass?: string
    }
  }

  defineProps<{
    organizations: IOrganization[]
  }>()

  const listEmits = defineEmits<{
    (e: 'update'): void
  }>()

  const dialogOptions: IDialogOptions = {
    DELETE: {
      title: 'Bạn có chắc chắn muốn xóa tổ chức này?',
      msgDone: 'Xóa tổ chức thành công',
      icon: 'custom-trash',
      color: 'red',
      confirmText: 'Xóa',
    },
    ACTIVATE: {
      title: 'Bạn có chắc chắn muốn bật hoạt động tổ chức này?',
      msgDone: 'Tổ chức đã được mở khóa',
      icon: 'custom-lock-open',
      color: 'green',
      confirmText: 'Mở khóa',
    },
    DEACTIVATE: {
      title: 'Bạn có chắc chắn muốn khóa tổ chức này?',
      msgDone: 'Tổ chức đã được khóa',
      icon: 'custom-lock',
      color: 'red',
      confirmText: 'Khóa',
    },
    LEAVE: {
      title: 'Bạn có chắc chắn muốn thoát tổ chức này?',
      msgDone: 'Yêu cầu thoát tổ chức thành công',
      icon: 'custom-left-from-line',
      color: 'red',
      confirmText: 'Yêu cầu thoát',
    },
    CANCEL_REQUESTED_TO_JOIN: {
      title: 'Bạn có chắc chắn muốn hủy yêu cầu tham gia tổ chức này?',
      msgDone: 'Yêu cầu tham gia tổ chức đã được hủy',
      icon: 'mdi-close',
      color: 'red',
      confirmText: 'Hủy yêu cầu',
      iconSize: 20,
      iconClass: 'me-n1',
    },
  }

  const { $toast } = useNuxtApp()
  const isLoading = ref<boolean>(false)
  const isShowConfirm = ref<boolean>(false)
  const confirmType = ref<IOrganizationActionRequest>(null)
  const organizationSelected = ref<IOrganization | null>(null)
  const organizationSelectedModule = ref<IOrganization | null>(null)

  const { onActionOrganization } = useOrganization()

  const onSelectOrganizationModule = (organization: IOrganization) => {
    if (!organization.is_owner && !organization.is_active) return
    if (organization.infor?.value === 'REQUESTED_TO_JOIN') return
    organizationSelectedModule.value = organization
  }

  const onConfirm = async (organization: IOrganization, type: IOrganizationActionRequest) => {
    organizationSelected.value = organization
    isShowConfirm.value = true
    confirmType.value = type
  }

  const onFinishConfirm = async () => {
    if (!organizationSelected.value) return

    try {
      isLoading.value = true
      await onActionOrganization(
        organizationSelected.value.id,
        confirmType.value,
        async () => {
          listEmits('update')
          $toast.success('Thành công', {
            description: dialogOptions[confirmType.value].msgDone,
          })
        },
        (error) => {
          $toast.error('Thất bại', {
            description: error || 'Thao tác không thành công',
          })
        }
      )
    } catch {
      $toast.error('Thất bại', {
        description: 'Hệ thống gặp sự cố, vui lòng thử lại sau',
      })
    } finally {
      organizationSelected.value = null
      isShowConfirm.value = false
      confirmType.value = null
      isLoading.value = false
    }
  }

  watch(isShowConfirm, (value) => {
    if (!value) {
      organizationSelected.value = null
      isShowConfirm.value = false
      confirmType.value = null
      isLoading.value = false
    }
  })

  const notOwnerCheckStatus = (organization: IOrganization, target: string) => {
    return organization.status.value === target && !organization.is_owner
  }
</script>
