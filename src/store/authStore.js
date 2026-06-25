import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: true, // true while checking existing session on mount

  // Call once on app mount to restore session
  init: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    set({ user: session?.user ?? null, loading: false })

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null })
    })
  },

  register: async ({ name, email, password, phone }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password, // Supabase hashes this with bcrypt — never stored plain
      options: {
        data: { name, phone: phone || '' }, // stored in user_metadata
      },
    })
    if (error) return { error: error.message }
    set({ user: data.user })
    return { success: true }
  },

  login: async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: 'Invalid email or password.' }
    set({ user: data.user })
    return { success: true }
  },

  logout: async () => {
    await supabase.auth.signOut()
    set({ user: null })
  },

  updateProfile: async (data) => {
    const { error } = await supabase.auth.updateUser({ data })
    if (error) return { error: error.message }
    const user = get().user
    set({ user: { ...user, user_metadata: { ...user?.user_metadata, ...data } } })
    return { success: true }
  },
}))
