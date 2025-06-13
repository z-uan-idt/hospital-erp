import { getAuth } from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getMessaging, getToken, isSupported, onMessage } from 'firebase/messaging'

interface TokenOptions {
  vapidKey: string
  serviceWorkerRegistration?: ServiceWorkerRegistration
}

export interface NotifyStatus {
  permission: null | NotificationPermission
  token: null | string
  error: null | string
  subscribedTopics: string[]
}

export default defineNuxtPlugin(async () => {
  const runtimeConfig = useRuntimeConfig()

  const firebaseConfig = {
    apiKey: 'AIzaSyD_CI5_y0TB7B-38vk4Nk7iyhWcOK_vLqs',
    authDomain: 'pharmago-de418.firebaseapp.com',
    projectId: 'pharmago-de418',
    storageBucket: 'pharmago-de418.firebasestorage.app',
    messagingSenderId: '211762754489',
    appId: '1:211762754489:web:aa6fea179ccf54910b7c68',
    measurementId: 'G-X5TV595GQ5',
  }

  const app = initializeApp(firebaseConfig)
  const isMessagingSupported = ref(false)
  const firestore = getFirestore(app)
  const { $toast } = useNuxtApp()
  const auth = getAuth(app)
  const deviceId = ref('')

  const notifyStatus = ref({
    permission: null as null | NotificationPermission,
    token: null as null | string,
    error: null as null | string,
    subscribedTopics: [] as string[],
  })

  const REGISTRATION_URL = '/firebase-messaging-sw.js'

  try {
    isMessagingSupported.value = await isSupported()

    if (isMessagingSupported.value) {
      let swRegistration: TokenOptions['serviceWorkerRegistration']
      try {
        const serviceWorker = navigator.serviceWorker
        // Register service worker if not already registered
        swRegistration = await serviceWorker.register(REGISTRATION_URL)
        if (!swRegistration) {
          swRegistration = await serviceWorker.getRegistration(REGISTRATION_URL)
        }
      } catch (swError) {
        notifyStatus.value.error = `Lỗi đăng ký Service Worker: ${swError instanceof Error ? swError.message : String(swError)}`
      }

      const messaging = getMessaging(app)
      const systemStore = useSystemStore()

      onMessage(messaging, (payload) => {
        systemStore.setNotification(payload)
        if (payload.notification && 'Notification' in window && Notification.permission === 'granted') {
          if (!document.hasFocus()) {
            const title = payload.notification.title || 'Thông báo mới'
            const options = {
              body: payload.notification.body,
              icon: payload.notification.icon || '/favicon.svg',
            }
            new Notification(title, options)
          } else {
            $toast.success(payload.notification.title || 'Thông báo mới', {
              description: payload.notification.body,
            })
          }
        }
      })

      const permission = await requestNotificationPermission()
      notifyStatus.value.permission = permission

      if (permission === 'granted') {
        try {
          const tokenOptions: TokenOptions = {
            vapidKey: runtimeConfig.public.vapidKey,
          }

          if (swRegistration) {
            tokenOptions.serviceWorkerRegistration = swRegistration
          }

          const token = await getToken(messaging, tokenOptions)

          if (token) {
            deviceId.value = token
            notifyStatus.value.token = token
          } else {
            notifyStatus.value.error = 'Không thể lấy được FCM token'
          }
        } catch (error) {
          notifyStatus.value.error = `Lỗi khi lấy FCM token: ${error instanceof Error ? error.message : String(error)}`
        }
      } else {
        notifyStatus.value.error = `Quyền thông báo: ${permission}`
      }
    } else {
      notifyStatus.value.error = 'Firebase Cloud Messaging không được hỗ trợ'
    }
  } catch (error) {
    notifyStatus.value.error = `Lỗi khi thiết lập Firebase Messaging: ${error instanceof Error ? error.message : String(error)}`
  }

  return {
    provide: {
      auth,
      firestore,
      deviceId,
      notifyStatus,
      firebaseApp: app,
      isMessagingSupported,
    },
  }
})
