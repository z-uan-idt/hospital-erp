importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js')

const CACHE_NAME = 'hospital-erp-v1'

firebase.initializeApp({
  apiKey: 'AIzaSyD_CI5_y0TB7B-38vk4Nk7iyhWcOK_vLqs',
  authDomain: 'pharmago-de418.firebaseapp.com',
  projectId: 'pharmago-de418',
  storageBucket: 'pharmago-de418.firebasestorage.app',
  messagingSenderId: '211762754489',
  appId: '1:211762754489:web:aa6fea179ccf54910b7c68',
  measurementId: 'G-X5TV595GQ5',
})

const messaging = firebase.messaging()

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        '/',
        '/login',
        '/favicon.ico',
        '/pharmago.svg'
      ])
    })
  )
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== CACHE_NAME)
            .map(cacheName => caches.delete(cacheName))
        )
      })
    ])
  )
})

self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request)
      })
    )
  }
})

messaging.onBackgroundMessage(payload => {
  const notificationTitle = payload.notification?.title || 'Thông báo mới'
  const notificationOptions = {
    icon: payload.notification?.icon || '/pharmago.svg',
    body: payload.notification?.body || 'Bạn có thông báo mới',
    badge: '/pharmago.svg',
    tag: 'notification-' + Date.now(),
    data: {
      ...payload.data,
      timestamp: Date.now(),
    },
    vibrate: [200, 100, 200],
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})

self.addEventListener('notificationclick', event => {
  event.notification.close()

  const action = event.action
  const notification = event.notification
  const data = notification.data || {}

  let url = '/'
  if (data.url) {
    url = data.url
  }

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.postMessage({
            type: 'NOTIFICATION_CLICK',
            notification: {
              title: notification.title,
              body: notification.body,
              data: data,
              action: action,
            },
          })
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    })
  )
})
