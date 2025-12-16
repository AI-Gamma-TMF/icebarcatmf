import express from 'express'
import CountryController from '../../../controllers/country.controller'
import { isAdminAuthenticated, checkPermission } from '../../../middlewares'
import contextMiddleware from '../../../middlewares/context.middleware'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import {
  countryListSchemas,
  countryListForDropdownSchemas,
  countryRestrictedSchemas,
  countryUnrestrictedSchemas,
  countryRestrictedItemSchemas,
  countryUnRestrictedItemSchemas,
  countryRestrictedAddSchemas,
  countryRestrictedItemAddSchemas,
  countryRestrictedItemDeleteSchemas,
  countryRestrictedDeleteSchemas
} from '../../../middlewares/validation/country-validation.schemas'
import RedisClient from '../../../../libs/redisClient'

const args = { mergeParams: true }
const countryRoutes = express.Router(args)

countryRoutes
  .route('/')
  .get(
    requestValidationMiddleware(countryListSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    CountryController.getCountryList,
    responseValidationMiddleware(countryListSchemas)
  )
countryRoutes
  .route('/all')
  .get(
    requestValidationMiddleware(countryListForDropdownSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    CountryController.getAllCountry,
    responseValidationMiddleware(countryListForDropdownSchemas)
  )
countryRoutes
  .route('/restricted')
  .get(
    requestValidationMiddleware(countryRestrictedSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    CountryController.getRestrictedCountries,
    responseValidationMiddleware(countryRestrictedSchemas)
  )
countryRoutes
  .route('/unrestricted')
  .get(
    requestValidationMiddleware(countryUnrestrictedSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    CountryController.getUnrestrictedCountries,
    responseValidationMiddleware(countryUnrestrictedSchemas)
  )
countryRoutes
  .route('/restricted/items')
  .get(
    requestValidationMiddleware(countryRestrictedItemSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    CountryController.getRestrictedItems,
    responseValidationMiddleware(countryRestrictedItemSchemas)
  )
countryRoutes
  .route('/unrestricted/items')
  .get(
    requestValidationMiddleware(countryUnRestrictedItemSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    CountryController.getUnrestrictedItems,
    responseValidationMiddleware(countryUnRestrictedItemSchemas)
  )
countryRoutes
  .route('/restricted')
  .put(
    requestValidationMiddleware(countryRestrictedAddSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    CountryController.updateRestrictedCountry,
    responseValidationMiddleware(countryRestrictedAddSchemas)
  )
countryRoutes
  .route('/restricted/items')
  .put(
    requestValidationMiddleware(countryRestrictedItemAddSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    CountryController.updateRestrictedItems,
    responseValidationMiddleware(countryRestrictedItemAddSchemas)
  )
countryRoutes
  .route('/restricted/items')
  .delete(
    requestValidationMiddleware(countryRestrictedItemDeleteSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    CountryController.deleteRestrictedItems,
    responseValidationMiddleware(countryRestrictedItemDeleteSchemas)
  )
countryRoutes
  .route('/restricted')
  .delete(
    requestValidationMiddleware(countryRestrictedDeleteSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    CountryController.deleteRestrictedCountries,
    responseValidationMiddleware(countryRestrictedDeleteSchemas)
  )

countryRoutes
  .route('/get-state')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    CountryController.getState,
    responseValidationMiddleware({})
  )

countryRoutes
  .route('/get-city')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    CountryController.getCity,
    responseValidationMiddleware({})
  )

countryRoutes
  .route('/delete-redis-key')
  .get(
    async (req, res, next) => {
      const data = await RedisClient.client.del('allowed_states')
      res.payload = {
        data,
        errors: []
      }
      next()
    },
    responseValidationMiddleware({})
  )

export default countryRoutes
