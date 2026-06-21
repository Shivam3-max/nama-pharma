import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      users: [], // local user registry

      register: ({ name, email, password, phone }) => {
        const existing = get().users.find(u => u.email === email)
        if (existing) return { error: 'An account with this email already exists.' }
        const newUser = {
          id: Date.now(),
          name,
          email,
          phone: phone || '',
          password, // in real app: hashed
          createdAt: new Date().toISOString(),
          orders: [],
          wishlist: [],
        }
        set({ users: [...get().users, newUser], user: { ...newUser, password: undefined } })
        return { success: true }
      },

      login: ({ email, password }) => {
        const found = get().users.find(u => u.email === email && u.password === password)
        if (!found) return { error: 'Invalid email or password.' }
        set({ user: { ...found, password: undefined } })
        return { success: true }
      },

      logout: () => set({ user: null }),

      updateProfile: (data) => {
        const user = get().user
        if (!user) return
        const updated = { ...user, ...data }
        set({
          user: updated,
          users: get().users.map(u => u.id === user.id ? { ...u, ...data } : u),
        })
      },
    }),
    {
      name: 'nama-auth',
      partialize: (state) => ({ user: state.user, users: state.users }),
    }
  )
)
