const API_BASE_URL = import.meta.env.VITE_API_URL || ''

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token')
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers })
  if (response.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.dispatchEvent(new Event('auth:expired'))
  }
  return response
}
