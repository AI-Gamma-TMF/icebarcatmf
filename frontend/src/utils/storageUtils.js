export const setLoginToken = (token) =>
  window.localStorage.setItem('userId', token)

export const getItem = (key) => window.localStorage.getItem(key)

export const setItem = (key, value) => window.localStorage.setItem(key, value)

export const removeItem = (key) => window.localStorage.removeItem(key)

export const getLoginToken = () => window.localStorage.getItem('userId') || ''

export const getAffiliateLoginToken = () => window.localStorage.getItem('affiliateUserId') || ''

export const removeLoginToken = () => {
  window.localStorage.clear()
}

export const isAffiliateLogin = () => {
  return window.localStorage.getItem('userId')
}