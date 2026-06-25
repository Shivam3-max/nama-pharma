import { create } from 'zustand'
import { api } from '../lib/api'

export const useSubscriptionsStore = create((set, get) => ({
  subscriptions: [],
  loading: false,

  fetchSubscriptions: async () => {
    set({ loading: true })
    const { ok, data } = await api.get('/subscriptions/list.php')
    if (ok) set({ subscriptions: data.subscriptions || [] })
    set({ loading: false })
  },

  createSubscription: async (payload) => {
    const { ok, data } = await api.post('/subscriptions/create.php', payload)
    if (!ok) return { error: data.error || 'Failed to create subscription' }
    set({ subscriptions: [data.subscription, ...get().subscriptions] })
    return { success: true, subscription: data.subscription }
  },

  updateStatus: async (id, status) => {
    const { ok, data } = await api.post('/subscriptions/update.php', { id, status })
    if (!ok) return { error: data.error || 'Failed to update' }
    set({ subscriptions: get().subscriptions.map(s => s.id === id ? { ...s, status } : s) })
    return { success: true }
  },
}))
