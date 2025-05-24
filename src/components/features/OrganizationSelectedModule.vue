<template>
  <v-dialog
    v-model="isShow"
    max-width="852px"
    persistent
    transition="slide-y-transition"
  >
    <v-card
      :class="$vuetify.display.mdAndUp ? 'pa-3 pt-4' : 'pt-3'"
      min-height="575"
      rounded="xl"
    >
      <template v-slot:title>
        <div class="d-flex align-start justify-space-between">
          <div class="d-flex align-start ga-3">
            <v-avatar
              size="60"
              variant="outlined"
              color="grey-lighten-1"
              style="user-select: none; pointer-events: none"
            >
              <v-img
                v-if="organizationSelected?.profile_picture"
                :src="organizationSelected?.profile_picture"
              />
              <span
                v-else
                class="text-blue-grey-darken-3 text-lg-h4 text-h6 font-weight-bold"
              >
                {{ organizationSelected?.name?.charAt(0).toUpperCase() }}
              </span>
            </v-avatar>

            <div class="d-flex flex-column align-start ga-1">
              <p class="text-lg-h6 text-subtitle-1 font-weight-bold text-wrap">
                {{ organizationSelected?.name }}
                <v-icon
                  v-if="organizationSelected?.is_verified"
                  color="blue-darken-1"
                  :size="!$vuetify.display.mdAndUp ? 20 : 24"
                  class="mt-n1"
                >
                  mdi-check-circle
                </v-icon>
              </p>
              <div class="d-flex ga-2">
                <v-chip
                  size="small"
                  color="grey-darken-3"
                >
                  {{ organizationSelected?.infor?.label }}
                </v-chip>
                <v-chip
                  v-if="organizationSelected?.is_active"
                  size="small"
                  color="green-darken-1"
                >
                  Đang hoạt động
                </v-chip>
                <v-chip
                  v-else
                  size="small"
                  color="red-darken-1"
                >
                  Bị khóa
                </v-chip>
              </div>
            </div>
          </div>

          <v-btn
            icon="mdi-close"
            variant="outlined"
            color="grey-darken-1 text-body-1 flex-basis-0 ms-2"
            size="small"
            @click="selectedEmits('close')"
          />
        </div>
      </template>

      <div class="ps-6 pe-6 pb-6">
        <div class="d-flex align-center justify-start ga-2 mb-4">
          <span
            style="min-width: max-content"
            class="text-grey-darken-3"
          >
            Chọn chức năng
          </span>
          <v-divider />
        </div>

        <v-row>
          <v-col
            v-for="module in modules"
            :key="module.name"
            cols="12"
            sm="6"
            md="3"
            lg="3"
          >
            <v-btn
              border="sm"
              :to="module.path"
              height="183"
              rounded="lg"
              elevation="0"
              width="100%"
              min-width="183"
              nuxt
              color="erp-gray-25"
              @click="onSelectModule(module)"
            >
              <div class="d-flex flex-column align-center justify-center ga-3">
                <v-icon
                  :icon="module.icon"
                  size="50"
                  color="grey-darken-1"
                />
                <p class="text-subtitle-1 text-erp-gray-800 font-weight-medium">
                  {{ module.name }}
                </p>
              </div>
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import type { IOrganization } from '~/types/oranization.types'

  type Props = {
    organization: IOrganization | null
  }

  type IModule = {
    name: string
    icon: string
    isActive: boolean
    path: string
  }

  const selectedEmits = defineEmits<{
    (e: 'close'): void
  }>()

  const props = withDefaults(defineProps<Props>(), {
    organization: null,
  })

  const { setSelectedOrganization } = useAuth()
  const organizationSelected = ref<IOrganization | null>(null)

  const modules: IModule[] = [
    {
      name: 'Quản trị tổng',
      icon: 'custom-module-hospital',
      isActive: true,
      path: '/',
    },
    {
      name: 'Quản lý kho',
      icon: 'custom-module-warehouse',
      isActive: false,
      path: '/warehouse',
    },
    {
      name: 'Khách hàng',
      icon: 'custom-module-people',
      isActive: false,
      path: '/customer',
    },
    {
      name: 'Người dùng',
      icon: 'custom-module-user',
      isActive: false,
      path: '/',
    },
    {
      name: 'Đặt lịch khám',
      icon: 'custom-module-stethoscope',
      isActive: false,
      path: '/',
    },
    {
      name: 'Mua thuốc',
      icon: 'custom-module-drug',
      isActive: false,
      path: '/',
    },
    {
      name: 'Sổ bệnh án',
      icon: 'custom-module-book',
      isActive: false,
      path: '/',
    },
  ].filter((module) => module.isActive)

  const isShow = ref(false)

  onUnmounted(() => {
    organizationSelected.value = null
    selectedEmits('close')
  })

  watchEffect(() => {
    let timer: NodeJS.Timeout | null = null
    if (props.organization) {
      isShow.value = true
      organizationSelected.value = props.organization
    } else {
      isShow.value = false
      timer = setTimeout(() => {
        organizationSelected.value = null
      }, 250)
    }

    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  })

  const onSelectModule = (module: IModule) => {
    if (organizationSelected.value) {
      setSelectedOrganization(JSON.stringify(organizationSelected.value))
    }
  }
</script>
