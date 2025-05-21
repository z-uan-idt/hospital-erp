importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js')

firebase.initializeApp({
  apiKey: 'AIzaSyCv-5kUCPIOO4MRvZnu-yIBkTYZRzYANPY',
  authDomain: 'pharmago-5ec03.firebaseapp.com',
  projectId: 'pharmago-5ec03',
  storageBucket: 'pharmago-5ec03.firebasestorage.app',
  messagingSenderId: '595897266511',
  appId: '1:595897266511:web:12db6fff2ab031904e953a',
  measurementId: 'G-NDPSDKBJ4W',
})

const messaging = firebase.messaging()

self.addEventListener('install', event => {
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', event => {})

messaging.onBackgroundMessage(payload => {
  const notificationTitle = payload.notification?.title || 'Thông báo mới'
  const notificationOptions = {
    icon: payload.notification?.icon || '/assets/icons/pharmago.svg',
    body: payload.notification?.body || 'Bạn có thông báo mới',
    badge: '/assets/icons/pharmago.svg',
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