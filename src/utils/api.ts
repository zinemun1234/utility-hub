import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

// API functions
export const apiService = {
  // Link shortener
  shortenLink: async (url: string, customCode?: string) => {
    return api.post('/shorten', { url, customCode })
  },

  getLinkAnalytics: async (code: string) => {
    return api.get(`/analytics/${code}`)
  },

  getMyLinks: async () => {
    return api.get('/my-links')
  },

  // Password generator
  generatePassword: async (options: {
    length?: number
    includeUppercase?: boolean
    includeLowercase?: boolean
    includeNumbers?: boolean
    includeSymbols?: boolean
    excludeSimilar?: boolean
  }) => {
    return api.post('/generate-password', options)
  },

  // QR Code
  generateQR: async (text: string, options?: {
    size?: number
    errorLevel?: string
  }) => {
    return api.post('/qr-generate', { text, ...options })
  },

  // Statistics
  getStats: async () => {
    return api.get('/stats')
  },

  // Health check
  healthCheck: async () => {
    return api.get('/health')
  },
}

export default api 