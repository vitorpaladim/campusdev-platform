const isVercelDeployment = typeof window !== 'undefined'
  && window.location.hostname.endsWith('.vercel.app')
export const API_BASE_URL = isVercelDeployment
  ? '/api-proxy'
    : (import.meta.env.VITE_API_URL || 'https://campus-dev-api-teste.onrender.com')

export function resolveMediaUrl(url) {
  if (!url || url.startsWith('blob:') || url.startsWith('data:') || /^https?:\/\//.test(url)) return url
  return `${API_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`
}

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token')
  if (token === 'demo-local-token') {
    const demoError = new Error('Modo demonstração local')
    demoError.code = 'DEMO_MODE'
    throw demoError
  }

  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), 5000)
  const isFormData = options.body instanceof FormData
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers, signal: controller.signal })
    if (response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.dispatchEvent(new Event('auth:expired'))
    }
    return response
  } finally {
    window.clearTimeout(timeoutId)
  }
}
