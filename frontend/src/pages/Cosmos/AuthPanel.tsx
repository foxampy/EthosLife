/**
 * AuthPanel — floats over the constellation after Magic Moment.
 * Supabase signup: email + password + telegram handle.
 * Graphite dark palette, zero blue.
 */

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabase'

interface AuthPanelProps {
  onSuccess: (userId: string) => void
  onDismiss: () => void
}

type AuthMode = 'register' | 'login'

export const AuthPanel: React.FC<AuthPanelProps> = ({ onSuccess, onDismiss }) => {
  const [mode, setMode] = useState<AuthMode>('register')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [telegram, setTelegram] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [done, setDone]         = useState(false)

  const handleSubmit = useCallback(async () => {
    if (!email.trim() || !password.trim()) return
    setLoading(true)
    setError(null)

    try {
      if (mode === 'register') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              telegram_handle: telegram.trim().replace(/^@/, ''),
            },
          },
        })
        if (signUpError) throw signUpError
        if (data.user) {
          setDone(true)
          setTimeout(() => onSuccess(data.user!.id), 1200)
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })
        if (signInError) throw signInError
        if (data.user) {
          setDone(true)
          setTimeout(() => onSuccess(data.user!.id), 800)
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка. Попробуй снова.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [email, password, telegram, mode, onSuccess])

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit()
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12,
    color: 'rgba(232,226,215,0.92)',
    fontSize: 15,
    padding: '11px 14px',
    outline: 'none',
    fontFamily: 'inherit',
    caretColor: 'rgba(210,175,80,0.8)',
    transition: 'border 0.15s',
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: done ? 0 : 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 24, stiffness: 240 }}
        style={{
          position: 'absolute',
          bottom: 120,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(360px, calc(100vw - 32px))',
          background: 'rgba(10,10,14,0.95)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 22,
          padding: '22px 20px 20px',
          zIndex: 45,
          boxShadow: '0 16px 60px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.04)',
        }}
      >
        {/* Dismiss */}
        <button
          onClick={onDismiss}
          style={{
            position: 'absolute', top: 14, right: 14,
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(160,155,145,0.5)', fontSize: 20, lineHeight: 1,
            padding: 2,
          }}
          aria-label="Закрыть"
        >
          ×
        </button>

        {/* Header */}
        <div style={{ marginBottom: 18, paddingRight: 24 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.14em', color: 'rgba(210,175,80,0.55)', textTransform: 'uppercase', marginBottom: 6 }}>
            ✦ твоя вселенная
          </div>
          <div style={{ fontSize: 18, fontWeight: 500, color: 'rgba(240,235,225,0.95)', letterSpacing: '-0.01em', lineHeight: 1.35 }}>
            {mode === 'register' ? 'Сохрани свою вселенную' : 'Войти в свою вселенную'}
          </div>
          <div style={{ fontSize: 13, color: 'rgba(155,150,140,0.6)', marginTop: 5, lineHeight: 1.45 }}>
            {mode === 'register'
              ? 'Зарегистрируйся — созвездие сохранится и будет расти'
              : 'Войди, чтобы продолжить с того места, где остановился'}
          </div>
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Email"
            style={inputStyle}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Пароль"
            style={inputStyle}
          />
          {mode === 'register' && (
            <input
              type="text"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Telegram (@username) — необязательно"
              style={{ ...inputStyle, fontSize: 14 }}
            />
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={{ marginTop: 10, fontSize: 13, color: 'rgba(200,90,80,0.85)', lineHeight: 1.4 }}>
            {error}
          </div>
        )}

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={loading || !email.trim() || !password.trim()}
          style={{
            marginTop: 14,
            width: '100%',
            background: loading || !email.trim() || !password.trim()
              ? 'rgba(255,255,255,0.05)'
              : 'rgba(210,175,80,0.88)',
            border: 'none',
            borderRadius: 13,
            padding: '13px 20px',
            fontSize: 15,
            fontWeight: 600,
            color: loading || !email.trim() || !password.trim()
              ? 'rgba(160,155,145,0.35)'
              : 'rgba(20,16,10,0.95)',
            cursor: loading || !email.trim() || !password.trim() ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
            transition: 'background 0.2s, color 0.2s',
            boxShadow: email.trim() && password.trim() ? '0 4px 20px rgba(210,175,80,0.2)' : 'none',
          }}
        >
          {loading ? '...' : done ? '✓ Готово' : mode === 'register' ? 'Создать аккаунт' : 'Войти'}
        </button>

        {/* Mode toggle */}
        <div style={{ marginTop: 14, textAlign: 'center' }}>
          <button
            onClick={() => { setMode(mode === 'register' ? 'login' : 'register'); setError(null) }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, color: 'rgba(165,160,150,0.55)',
              fontFamily: 'inherit', padding: 0,
              textDecoration: 'underline', textUnderlineOffset: '2px',
            }}
          >
            {mode === 'register' ? 'Уже есть аккаунт — войти' : 'Нет аккаунта — зарегистрироваться'}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default AuthPanel
