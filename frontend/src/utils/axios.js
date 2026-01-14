import axios from 'axios'
import { toast } from '../components/Toast'
import { AdminRoutes, AffiliateRoute } from '../routes'
import { isAffiliateLogin, removeLoginToken } from './storageUtils'

const axiosInstance = axios.create({
  withCredentials: true
})

let lastErrorMessage = ''; // Store the last error message

export const setupInterceptors = () => {
  axiosInstance.interceptors.response.use(
    (res) => {
      return res.data;
    },
    (error) => {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 403) {
          localStorage.clear()
          const user = isAffiliateLogin();
          window.location.href = user === "Affiliate" ? AffiliateRoute.AffiliateSignIn : AdminRoutes.AdminSignin;
          removeLoginToken()
        } else if (status === 503) {
          toast('No internet connection', 'error');
        } else if (status === 406) {
          const errorMessage = data?.errors?.[0]?.description || 'Something went wrong';
          if (errorMessage !== lastErrorMessage) {
            lastErrorMessage = errorMessage;
            toast(errorMessage, 'error');
            setTimeout(() => {
              lastErrorMessage = '';
            }, 5000);
          }
        }
      }
      return Promise.reject(error)
    }
  )
}

const METHODS = {
  get: 'GET',
  post: 'POST',
  put: 'PUT',
  delete: 'DELETE',
  patch: 'PATCH'
}

const makeRequest = async (url, method, data = {}, params = {}, headers = null) => {
  // Default JSON content-type unless caller overrides.
  if (!headers) {
    headers = { 'Content-Type': 'application/json' }
  }

  // ------------------------------------------------------------
  // IMPORTANT: File uploads (FormData) must NOT hardcode Content-Type.
  // The browser/axios will set: multipart/form-data; boundary=...
  // If we set an incorrect type (e.g. multipart/formdata) the backend
  // won't parse files and uploads "silently" fail.
  // ------------------------------------------------------------
  const isFormData =
    typeof FormData !== 'undefined' &&
    data &&
    typeof data === 'object' &&
    data instanceof FormData

  if (isFormData) {
    // Clone so we don't mutate callers' objects.
    const nextHeaders = { ...headers }

    // Remove Content-Type regardless of casing.
    Object.keys(nextHeaders).forEach((key) => {
      if (key.toLowerCase() === 'content-type') {
        delete nextHeaders[key]
      }
    })

    headers = nextHeaders
  } else if (headers && typeof headers === 'object') {
    // Normalize a common typo found across the codebase:
    // 'multipart/formdata' -> 'multipart/form-data'
    Object.keys(headers).forEach((key) => {
      if (key.toLowerCase() !== 'content-type') return
      const val = String(headers[key] ?? '')
      if (val.toLowerCase().includes('multipart/formdata')) {
        headers[key] = 'multipart/form-data'
      }
    })
  }

  return axiosInstance({
    url,
    params,
    method,
    data,
    headers,
    withCredentials: true
  })
}

const getRequest = (url, params) => makeRequest(url, METHODS.get, {}, params)

const postRequest = (url, data, headers = null) => makeRequest(url, METHODS.post, data, {}, headers)

const putRequest = (url, data, headers = null) => makeRequest(url, METHODS.put, data, {}, headers)

const patchRequest = (url, data, headers = null) => makeRequest(url, METHODS.patch, data, {}, headers)

const deleteRequest = (url, data) => makeRequest(url, METHODS.delete, data)

const deleteParamsRequest = (url, params) => makeRequest(url, METHODS.delete, {}, params)

export { getRequest, postRequest, putRequest, deleteRequest, patchRequest, deleteParamsRequest }
