// Thin fetch wrapper for our PHP API
// On Hostinger, /api is in the same domain as the React build

const BASE = '/api'

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('nama_token')
  const res = await fetch(BASE + path, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  })
  // Parse JSON — PHP always returns JSON
  const data = await res.json().catch(() => ({ error: 'Server error' }))
  return { ok: res.ok, status: res.status, data }
}

export const api = {
  post: (path, body) => apiFetch(path, { method: 'POST', body: JSON.stringify(body) }),
  get:  (path)       => apiFetch(path, { method: 'GET' }),
}
