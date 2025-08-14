import axios from 'axios'
import store from '../app/store'
import { setCredentials, clearAuth } from '../features/auth/authSlice'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true 
})

api.interceptors.request.use((config) => {
  const token = store.getState()?.auth?.accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let refreshPromise = null

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error?.response?.status !== 401) {
      return Promise.reject(error)
    }

    if (original._retry) {
      store.dispatch(clearAuth())
      return Promise.reject(error)
    }
    original._retry = true

    try {
      if (!refreshPromise) {
        refreshPromise = axios.post('/api/auth/refreshToken', {}, { withCredentials: true })
          .finally(() => { refreshPromise = null })
      }

      const { data } = await refreshPromise
      const { accessToken } = data || {}

      if (!accessToken) {
        store.dispatch(clearAuth())
        return Promise.reject(error)
      }

      store.dispatch(setCredentials({ accessToken }))

      original.headers = original.headers || {}
      original.headers.Authorization = `Bearer ${accessToken}`
      return api(original)
    } catch (error) {
      store.dispatch(clearAuth())
      return Promise.reject(error)
    }
  }
)

export default api
