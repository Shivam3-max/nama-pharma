import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  console.warn('Supabase env vars not set. Auth and orders will not work.')
}

export const supabase = createClient(url || 'https://placeholder.supabase.co', key || 'placeholder')
