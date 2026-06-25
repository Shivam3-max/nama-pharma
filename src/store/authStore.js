import { create } from 'zustand'
import { api } from '../lib/api'

function storedUser() {
  try { return JSON.parse(localStorage.getItem('nama_user') || 'null') } catch { return null }
}

export const useAuthStore = create((set, get) => ({
  user: storedUser(),
  loading: false,

  init: async () => {
    const token = localStorage.getItem('nama_token')
    if (!token) { set({ user: null }); return }
    const { ok, data } = await api.get('/auth/me.php')
    if (ok) {
      localStorage.setItem('nama_user', JSON.stringify(data.user))
      set({ user: data.user })
    } else {
      localStorage.removeItem('nama_token')
      localStorage.removeItem('nama_user')
      set({ user: null })
    }
  },

  // Called after Google OAuth callback sets token in URL hash
  loginWithToken: (token, user) => {
    localStorage.setItem('nama_token', token)
    localStorage.setItem('nama_user', JSON.stringify(user))
    set({ user })
  },

  register: async ({ name, email, password, phone }) => {
    const { ok, data } = await api.post('/auth/register.php', { name, email, password, phone })
    if (!ok) return { error: data.error || 'Registration failed' }
    localStorage.setItem('nama_token', data.token)
    localStorage.setItem('nama_user', JSON.stringify(data.user))
    set({ user: data.user })
    return { success: true }
  },

  login: async ({ email, password }) => {
    const { ok, data } = await api.post('/auth/login.php', { email, password })
    if (!ok) return { error: data.error || 'Invalid email or password' }
    localStorage.setItem('nama_token', data.token)
    localStorage.setItem('nama_user', JSON.stringify(data.user))
    set({ user: data.user })
    return { success: true }
  },

  logout: async () => {
    await api.post('/auth/logout.php', {})
    localStorage.removeItem('nama_token')
    localStorage.removeItem('nama_user')
    set({ user: null })
  },

  forgotPassword: async (email) => {
    const { ok, data } = await api.post('/auth/forgot.php', { email })
    if (!ok) return { error: data.error || 'Failed to send reset email' }
    return { success: true }
  },

  resetPassword: async (token, password) => {
    const { ok, data } = await api.post('/auth/reset.php', { token, password })
    if (!ok) return { error: data.error || 'Reset failed' }
    localStorage.setItem('nama_token', data.token)
    localStorage.setItem('nama_user', JSON.stringify(data.user))
    set({ user: data.user })
    return { success: true }
  },

  sendOtp: async (phone) => {
    const { ok, data } = await api.post('/auth/send-otp.php', { phone })
    if (!ok) return { error: data.error || 'Failed to send OTP' }
    return { success: true, phone: data.phone }
  },

  verifyOtp: async (phone, otp, name) => {
    const { ok, data } = await api.post('/auth/verify-otp.php', { phone, otp, name })
    if (!ok) return { error: data.error || 'Invalid OTP' }
    localStorage.setItem('nama_token', data.token)
    localStorage.setItem('nama_user', JSON.stringify(data.user))
    set({ user: data.user })
    return { success: true }
  },

  updateProfile: async (updates) => {
    const { ok, data } = await api.post('/auth/update.php', updates)
    if (!ok) return { error: data.error || 'Update failed' }
    const user = { ...get().user, ...data.user }
    localStorage.setItem('nama_user', JSON.stringify(user))
    set({ user })
    return { success: true }
  },
}))
