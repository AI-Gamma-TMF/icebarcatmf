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
  if(!headers) {
    headers = {
      'Content-Type': 'application/json'
    }
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
