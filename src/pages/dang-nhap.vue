<template>
  <v-container class="d-flex justify-center align-center flex-column h-100">
    <Icon
      name="custom:logo"
      class="mb-12"
      size="159"
    />

    <v-form
      class="login-form"
      @submit.prevent="onSubmitForm"
    >
      <v-row>
        <v-col
          cols="12"
          class="pb-0"
        >
          <v-text-field
            v-model="formPayload.username"
            bg-color="white"
            autocomplete="username"
            ref="usernameTextfieldRef"
            placeholder="Nhập tên đăng nhập"
            :rules="[formRules.required]"
            :readonly="isLoading"
            :error-messages="usernameErrorMessages"
          >
            <template #label>
              Tên đăng nhập
              <span class="text-error">*</span>
            </template>
          </v-text-field>
        </v-col>

        <v-col
          cols="12"
          class="pb-4"
        >
          <v-text-field
            v-model="formPayload.password"
            bg-color="white"
            autocomplete="new-password"
            :append-inner-icon="isShowPassword ? 'mdi-eye-off' : 'mdi-eye'"
            placeholder="Nhập mật khẩu"
            :type="isShowPassword ? 'text' : 'password'"
            :rules="[formRules.required]"
            :readonly="isLoading"
            @click:append-inner="isShowPassword = !isShowPassword"
          >
            <template #label>
              Mật khẩu
              <span class="text-error">*</span>
            </template>
          </v-text-field>
        </v-col>

        <v-col cols="12">
          <v-btn
            type="submit"
            color="erp-brand"
            size="x-large"
            rounded="pill"
            block
            elevation="0"
            :loading="isLoading"
          >
            <span class="font-weight-regular">Đăng nhập</span>
          </v-btn>
        </v-col>

        <v-col
          cols="12"
          class="d-none"
        >
          <div class="mt-4 mb-4">
            <v-divider>Hoặc</v-divider>
          </div>
        </v-col>

        <v-col
          cols="12"
          class="d-none"
        >
          <div class="d-flex justify-center">
            <v-btn
              variant="outlined"
              rounded="xl"
              color="erp-gray-600"
              class="bg-white ps-2 pt-4 pb-4 pe-6"
              max-width="fit-content"
              height="fit-content"
              @click="isDialog = true"
            >
              <Icon
                name="custom:qr-scan-example"
                size="112"
              />
              <span class="ms-4 text-h6 font-weight-medium text-erp-gray-800"> Đăng nhập bằng mã QR </span>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-form>

    <v-dialog
      v-model="isDialog"
      max-width="600"
      persistent
    >
      <v-card>
        <template v-slot:title>
          <div class="d-flex justify-start align-center ga-2">
            <Icon
              name="custom:logo"
              style="width: 36px; height: 36px"
            />
            <span class="text-h6">Mã QR</span>
          </div>
        </template>

        <div class="ps-6 pe-6">
          <p class="text-body-2 text-blue-grey-lighten-1 border-opacity-25 text-start">
            Quét mã QR bằng điện thoại để đăng nhập vào tài khoản của bạn
          </p>

          <div class="d-flex align-center justify-center mt-4 mb-4 position-relative">
            <div
              v-if="!qrCode"
              class="qr-code-example position-absolute top-0 left-n1 w-100 h-100 bg-grey-darken-1 border-lg rounded-xl opacity-60 d-flex align-center justify-center w-100 h-100"
            >
              <v-progress-circular
                indeterminate
                color="white"
                bg-color="erp-brand"
                size="46"
                width="2"
              />
            </div>
            <div class="qr-code-example border-md rounded-xl pa-4 w-100 h-100">
              <Icon
                v-if="!qrCode"
                name="custom:qr-example"
                id="qr-code-example"
                size="310"
              />
              <img
                v-else
                :src="qrCode"
                alt="QR Code"
                style="object-fit: cover; vertical-align: middle"
              />
            </div>
          </div>
          <div
            v-if="qrCode"
            class="d-flex align-center justify-center"
          >
            <p>Mã hết hạn trong: {{ formattedTime }}</p>
          </div>
        </div>

        <template v-slot:actions>
          <div class="ps-4 pe-4 pb-4">
            <v-btn
              size="large"
              class="text-none ps-4 pe-4"
              color="blue-grey-lighten-3"
              variant="outlined"
              rounded="pill"
              @click="isDialog = false"
            >
              <v-icon
                class="text-black me-1"
                style="width: 18px; height: 18px"
              >
                mdi-window-close
              </v-icon>
              <span class="text-black">Hủy bỏ</span>
            </v-btn>
          </div>
        </template>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
  import type { ILoginPayload } from '~/types/auth.types'
  import type { SubmitEventPromise } from 'vuetify'
  import { v4 as uuidv4 } from 'uuid'

  const SESSION_ID_EXPIRED_TIME = 60 * 5 // 5 minutes

  definePageMeta({
    layout: 'empty',
    middleware: ['auth'],
  })

  useHead({
    title: 'Đăng nhập',
    meta: [
      {
        name: 'description',
        content: 'Đăng nhập vào hệ thống kho Bệnh viện',
      },
    ],
  })

  const { $toast } = useNuxtApp()
  const formRules = useFormRules()
  const webSocket = useWebSocket('ws/guest')
  const { onLogin, setAuthData } = useAuth()

  const sessionCookie = useCookie('session_id', {
    maxAge: SESSION_ID_EXPIRED_TIME,
    watch: true,
  })

  const isDialog = ref(false)
  const isLoading = ref<boolean>(false)
  const isShowPassword = ref<boolean>(false)

  const usernameTextfieldRef = ref<any>(null)

  const formPayload = reactive<ILoginPayload>({
    username: '',
    password: '',
  })

  const usernameErrorMessages = ref<string[]>([])

  const remainingTime = ref(0)
  const qrCode = ref<string | null>(null)
  const socket = ref<WebSocket | null>(null)
  const sessionId = ref<string | null>(null)
  let timer: ReturnType<typeof setInterval> | null = null

  const formattedTime = computed(() => {
    const minutes = Math.floor(remainingTime.value / 60)
    const seconds = remainingTime.value % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  })

  const startTimer = () => {
    if (timer) {
      clearInterval(timer)
    }
    timer = setInterval(() => {
      if (remainingTime.value > 0) {
        remainingTime.value--
      } else {
        timer && clearInterval(timer)
        sessionCookie.value = null
        sessionId.value = ''
      }
    }, 1000)
  }

  watch(sessionCookie, (newValue) => {
    if (!newValue && webSocket.isConnected) {
      sessionId.value = uuidv4()
      sessionCookie.value = sessionId.value
      remainingTime.value = SESSION_ID_EXPIRED_TIME
      startTimer()
      socket.value = webSocket.connect(sessionId.value)
    }
  })

  onMounted(() => {
    if (!sessionCookie.value) {
      sessionId.value = uuidv4()
      sessionCookie.value = sessionId.value
    } else {
      sessionId.value = uuidv4()
      sessionCookie.value = sessionId.value
    }
    remainingTime.value = SESSION_ID_EXPIRED_TIME
    startTimer()
    socket.value = webSocket.connect(sessionId.value)
  })

  onUnmounted(() => {
    if (timer) {
      clearInterval(timer)
    }
    webSocket.disconnect()
  })

  watch(webSocket.message, async (newMessage) => {
    qrCode.value = newMessage?.qr_code
    if (newMessage?.login) {
      try {
        webSocket.disconnect()
        const loginData = JSON.parse(newMessage.login?.data)
        setAuthData(loginData)
        await navigateTo('/')
        $toast.success('Thành công', {
          description: 'Đăng nhập thành công',
          duration: 5000,
        })
      } catch {
        $toast.error('Thất bại', {
          description: 'Hệ thống gặp sự cố, vui lòng thử lại sau',
        })
      }
    }
  })

  const onSubmitForm = async (submitEvent: SubmitEventPromise) => {
    usernameErrorMessages.value = []
    const results = await submitEvent
    if (results.valid) {
      try {
        isLoading.value = true
        await onLogin(formPayload, (message) => {
          usernameErrorMessages.value.push(message)
          usernameTextfieldRef.value && usernameTextfieldRef.value.focus()
        })
      } catch {
        $toast.error('Thất bại', {
          description: 'Hệ thống gặp sự cố, vui lòng thử lại sau',
        })
      } finally {
        isLoading.value = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .login-form {
    max-width: 436px;
    width: 100%;
  }

  .qr-code-example {
    min-height: 300px;
    min-width: 300px;
    max-width: 340px;
    max-height: 347px;
  }
</style>
