import _ from 'lodash'
import BaseError from '../errors/base.error'
import * as errorTypes from '../utils/constants/errors'
import { extractErrorAttributes } from './error.utils'

export const sendResponse = ({ req, res, next }, { successful, result, serviceErrors, defaultError }) => {
  if (successful && !_.isEmpty(result)) {
    res.payload = { data: result, errors: [] }
    next()
  } else {
    if (!_.isEmpty(serviceErrors)) {
      // executed when addError is called from service
      const responseErrors = extractErrorAttributes(serviceErrors).map(errorAttr => errorTypes[errorAttr] || errorAttr)
      return next(responseErrors)
    }
    const responseError = new BaseError({ ...defaultError })
    next(responseError)
  }
}

export const sendAccessTokenResponse = ({ req, res, next }, { successful, result, serviceErrors, defaultError }) => {
  if (successful && !_.isEmpty(result)) {
    result?.affiliate.affiliateAccessToken ? res.cookie('affiliateAccessToken', result?.affiliate?.affiliateAccessToken, { httpOnly: true }) : res.cookie()
    delete result?.affiliate?.affiliateAccessToken
    res.payload = { data: result, errors: [] }
    next()
  } else {
    if (!_.isEmpty(serviceErrors)) {
      // executed when addError is called from service
      const responseErrors = extractErrorAttributes(serviceErrors).map(errorAttr => errorTypes[errorAttr] || errorAttr)
      return next(responseErrors)
    }
    const responseError = new BaseError({ ...defaultError })
    next(responseError)
  }
}

export const sendSocketResponse = ({ reqData, resCallback }, { successful, result, serviceErrors, defaultError }) => {
  if (successful && !_.isEmpty(result)) {
    return resCallback({ data: result, errors: [] })
  } else {
    if (!_.isEmpty(serviceErrors)) {
      // executed when addError is called from service
      const responseErrors = extractErrorAttributes(serviceErrors).map(errorAttr => errorTypes[errorAttr] || errorAttr)
      return resCallback({ data: {}, errors: responseErrors })
    }
    const responseError = new BaseError({ ...defaultError })
    return resCallback({ data: {}, errors: [responseError] })
  }
}

export const convertUTCToLocalTime = (utcDateString) => {
  const utcDate = new Date(utcDateString)
  const localDate = new Date(utcDate.getTime() - (utcDate.getTimezoneOffset() * 60000))
  const offsetDate = new Date(localDate.getTime() + (5 * 3600000) + (30 * 60000)) // Convert to local time
  const formattedDate = offsetDate.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  })
  const formattedTime = offsetDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
  return `${formattedDate} ${formattedTime}`
}
