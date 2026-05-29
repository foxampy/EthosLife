// frontend/src/hooks/usePWA.ts
import { useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY ?? ''

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
}

export function usePWA(userId: string | null) {
  const registered = useRef(false)

  useEffect(() => {
    if (!userId || registered.current) return
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return
    if (!VAPID_PUBLIC_KEY) return

    registered.current = true

    const setup = async () => {
      try {
        // Register SW
        const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' })
        await navigator.serviceWorker.ready

        // Request permission
        const permission = await Notification.requestPermission()
        if (permission !== 'granted') return

        // Subscribe to push
        const existing = await registration.pushManager.getSubscription()
        const subscription = existing ?? await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        })

        const { endpoint, keys } = subscription.toJSON() as {
          endpoint: string
          keys: { p256dh: string; auth: string }
        }

        // Save to Supabase
        await supabase.from('push_subscriptions').upsert({
          user_id: userId,
          endpoint,
          p256dh: keys.p256dh,
          auth: keys.auth,
          ua_hint: navigator.userAgent.slice(0, 200),
        }, { onConflict: 'endpoint' })
      } catch (err) {
        console.warn('PWA setup error:', err)
      }
    }

    setup()
  }, [userId])
}
