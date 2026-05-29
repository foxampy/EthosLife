// supabase/functions/send-push/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
// @deno-types="https://esm.sh/web-push@3.6.7/src/index.d.ts"
import webpush from 'https://esm.sh/web-push@3.6.7'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

const VAPID_PUBLIC_KEY = Deno.env.get('VITE_VAPID_PUBLIC_KEY')!
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY')!
const VAPID_EMAIL = Deno.env.get('VAPID_EMAIL') ?? 'mailto:admin@ethoslife.app'

webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)

function calcNextScheduledAt(rule: Record<string, unknown>, from: Date): string | null {
  const type = rule.type as string
  if (type === 'none') return null

  const next = new Date(from)
  if (type === 'daily') {
    next.setDate(next.getDate() + ((rule.interval as number) ?? 1))
    if ((rule.times as string[])?.length > 0) {
      const [h, m] = (rule.times as string[])[0].split(':').map(Number)
      next.setHours(h, m, 0, 0)
    }
    return next.toISOString()
  }
  if (type === 'custom' && rule.every_n_hours) {
    next.setTime(next.getTime() + (rule.every_n_hours as number) * 3600000)
    return next.toISOString()
  }
  // weekly / monthly — simplified: add 1 day and let next cron recalculate
  next.setDate(next.getDate() + 1)
  return next.toISOString()
}

Deno.serve(async (_req) => {
  try {
    const now = new Date()
    const oneMinuteLater = new Date(now.getTime() + 60000)

    // Get due reminders
    const { data: reminders, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('is_active', true)
      .lte('scheduled_at', oneMinuteLater.toISOString())
      .not('scheduled_at', 'is', null)

    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    if (!reminders?.length) return new Response('no reminders due', { status: 200 })

    for (const reminder of reminders) {
      // Get push subscriptions for this user
      const { data: subs } = await supabase
        .from('push_subscriptions')
        .select('*')
        .eq('user_id', reminder.user_id)

      if (!subs?.length) continue

      const payload = JSON.stringify({
        notification_id: crypto.randomUUID(),
        title: `${reminder.emoji ?? '⚡'} ${reminder.title}`,
        body: `${reminder.category}`,
        ai_message: reminder.ai_message ?? '',
        action_url: '/notifications',
        chat_url: '/cosmos',
      })

      // Send to all devices
      for (const sub of subs) {
        try {
          await webpush.sendNotification(
            { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
            payload
          )
        } catch (err: unknown) {
          // Remove expired subscriptions
          if ((err as { statusCode?: number }).statusCode === 410) {
            await supabase.from('push_subscriptions').delete().eq('id', sub.id)
          }
        }
      }

      // Log notification
      await supabase.from('notifications').insert({
        user_id: reminder.user_id,
        reminder_id: reminder.id,
        title: reminder.title,
        body: reminder.category,
        ai_message: reminder.ai_message,
        action_url: '/notifications',
      })

      // Update next scheduled_at
      const nextAt = calcNextScheduledAt(reminder.repeat_rule, new Date(reminder.scheduled_at))
      if (nextAt) {
        await supabase.from('reminders').update({ scheduled_at: nextAt }).eq('id', reminder.id)
      } else {
        await supabase.from('reminders').update({ is_active: false }).eq('id', reminder.id)
      }
    }

    return new Response(JSON.stringify({ sent: reminders.length }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
})
