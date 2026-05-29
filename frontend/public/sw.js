// frontend/public/sw.js
const CACHE = 'ethoslife-v1'

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) =>
  e.waitUntil(self.clients.claim())
)

// ── Push handler ──────────────────────────────────────────────
self.addEventListener('push', (e) => {
  if (!e.data) return
  const payload = e.data.json()
  const { title, body, ai_message, action_url, chat_url, notification_id } = payload

  e.waitUntil(
    self.registration.showNotification(title, {
      body: ai_message || body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      tag: notification_id,
      requireInteraction: true,
      data: { action_url, chat_url, notification_id },
      actions: [
        { action: 'done', title: '✓ Выполнено' },
        { action: 'snooze', title: '+15 мин' }
      ]
    })
  )
})

// ── Notification click ─────────────────────────────────────────
self.addEventListener('notificationclick', (e) => {
  e.notification.close()
  const { action_url, chat_url, notification_id } = e.notification.data || {}

  if (e.action === 'done') {
    e.waitUntil(
      fetch('/api/notifications/done', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notification_id })
      }).catch(() => {})
    )
    return
  }

  if (e.action === 'snooze') {
    e.waitUntil(
      fetch('/api/notifications/snooze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notification_id, minutes: 15 })
      }).catch(() => {})
    )
    return
  }

  // Default click — open app
  const url = e.notification.data?.action_url || '/notifications'
  e.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      const existing = clients.find((c) => c.url.includes(self.location.origin))
      if (existing) return existing.focus()
      return self.clients.openWindow(url)
    })
  )
})

self.addEventListener('notificationclose', () => {
  // Dismissal logged server-side if needed
})
