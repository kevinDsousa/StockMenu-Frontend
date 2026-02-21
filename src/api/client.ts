import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request: opcionalmente adicionar token/tenant (company_id) quando houver auth
apiClient.interceptors.request.use((config) => {
  // const token = getToken()
  // if (token) config.headers.Authorization = `Bearer ${token}`
  // config.headers['X-Company-Id'] = getCompanyId()
  return config
})

// Response: tratamento global de erro (toast, redirect 401, etc.)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // if (error.response?.status === 401) redirect to login
    // notifications.show({ message: error.message, color: 'red' })
    return Promise.reject(error)
  }
)
