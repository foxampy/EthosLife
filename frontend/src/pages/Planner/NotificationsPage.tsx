// frontend/src/pages/Planner/NotificationsPage.tsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'
import { supabase } from '../../lib/supabase'
import { usePlannerStore } from './plannerStore'
import type { PlannerNotification } from './plannerTypes'

export default function NotificationsPage() {
  const navigate = useNavigate()
  const { notifications, setNotifications, markNotificationRead } = usePlannerStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: user } = await supabase.auth.getUser()
      if (!user?.user) { setLoading(false); return }
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.user.id)
        .order('sent_at', { ascending: false })
        .limit(50)
      if (data) setNotifications(data as PlannerNotification[])
      setLoading(false)
    }
    load()
  }, [])

  const handleMarkDone = async (n: PlannerNotification) => {
    await supabase
      .from('notifications')
      .update({ done_at: new Date().toISOString(), read_at: new Date().toISOString() })
      .eq('id', n.id)
    markNotificationRead(n.id)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: 'rgba(232,226,215,0.9)', paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 22 }}>←</button>
        <span style={{ fontSize: 17, fontWeight: 700, color: 'rgba(210,175,80,0.9)' }}>Уведомления</span>
      </div>

      {loading && (
        <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>Загрузка...</div>
      )}

      {!loading && notifications.length === 0 && (
        <div style={{ padding: 60, textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔔</div>
          <div style={{ color: 'rgba(255,255,255,0.3)' }}>Уведомлений пока нет</div>
        </div>
      )}

      {notifications.map((n) => {
        const isUnread = !n.read_at
        const isDone = !!n.done_at
        return (
          <div key={n.id} style={{
            padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)',
            background: isUnread && !isDone ? 'rgba(210,175,80,0.04)' : 'transparent',
            opacity: isDone ? 0.5 : 1,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
              <span style={{ fontSize: 14, fontWeight: isUnread ? 600 : 400, color: 'rgba(232,226,215,0.9)' }}>
                {isUnread && !isDone && (
                  <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'rgba(210,175,80,0.9)', marginRight: 6, marginBottom: 1, verticalAlign: 'middle' }} />
                )}
                {n.title ?? 'Напоминание'}
              </span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', whiteSpace: 'nowrap', marginLeft: 8 }}>
                {format(parseISO(n.sent_at), 'd MMM HH:mm', { locale: ru })}
              </span>
            </div>

            {n.ai_message && (
              <div style={{ fontSize: 13, color: 'rgba(210,175,80,0.7)', fontStyle: 'italic', marginBottom: 8, lineHeight: 1.4 }}>
                «{n.ai_message}»
              </div>
            )}

            {!isDone && (
              <button onClick={() => handleMarkDone(n)} style={{
                padding: '5px 14px', borderRadius: 6, border: '1px solid rgba(210,175,80,0.3)',
                background: 'none', color: 'rgba(210,175,80,0.7)', fontSize: 12, cursor: 'pointer',
              }}>
                ✓ Выполнено
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
