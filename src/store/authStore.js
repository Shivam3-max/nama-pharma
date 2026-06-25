import { create } from 'zustand'
import { api } from '../lib/api'

function storedUser() {
  try { return JSON.parse(localStorage.getItem('nama_user') || 'null') } catch { return null }
}

export const useAuthStore = create((set, get) => ({
  user: storedUser(),
  loading: false,

  // Verify token is still valid on app boot
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

  updateProfile: async (updates) => {
    const { ok, data } = await api.post('/auth/update.php', updates)
    if (!ok) return { error: data.error || 'Update failed' }
    const user = { ...get().user, ...data.user }
    localStorage.setItem('nama_user', JSON.stringify(user))
    set({ user })
    return { success: true }
  },
}))
