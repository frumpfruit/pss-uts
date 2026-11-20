import axios from 'axios'

// API Gateway base URL pointing to Django backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Helper to check if a token is a real JWT (header.payload.signature)
function isValidJwt(token) {
  if (!token || typeof token !== 'string') return false
  if (token.startsWith('fake-')) return false
  // A valid JWT has three base64url segments separated by dots
  const parts = token.split('.')
  return parts.length === 3 && parts.every(p => p.length > 0)
}

// Request Interceptor: Attach JWT Bearer Token only if valid
apiClient.interceptors.request.use(
  (config) => {
    try {
      const rawToken = localStorage.getItem('siakad_token')
      // Remove double quotes if stored via JSON.stringify
      const token = rawToken ? rawToken.replace(/^"(.*)"$/, '$1') : null

      if (isValidJwt(token)) {
        config.headers.Authorization = `Bearer ${token}`
      } else if (token && token.startsWith('fake-')) {
        // Purge dummy demo token from interfering with real backend
        localStorage.removeItem('siakad_token')
      }
    } catch (e) {
      console.warn('Could not retrieve token from storage', e)
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor: Format error responses & auto-purge invalid tokens
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // If backend reports invalid or expired token, clear it immediately
    if (error.response?.status === 401) {
      const detail = error.response.data?.detail || ''
      const code = error.response.data?.code || ''
      if (code === 'token_not_valid' || detail.toLowerCase().includes('token')) {
        try {
          localStorage.removeItem('siakad_token')
        } catch {}
      }
    }

    const errorMsg =
      error.response?.data?.message ||
      error.response?.data?.detail ||
      error.message ||
      'Terjadi kesalahan pada server backend.'
    return Promise.reject(new Error(errorMsg))
  }
)
