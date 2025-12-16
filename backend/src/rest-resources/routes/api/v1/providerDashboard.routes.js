import express from 'express'
import { checkPermission, isAdminAuthenticated } from '../../../middlewares'
import contextMiddleware from '../../../middlewares/context.middleware'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import ProviderDashboardController from '../../../controllers/providerDashboard.controller'
import { createProviderRateSchema, deleteProviderRateSchema, getProviderDashboardDetailSchema, getProviderRateSchema, updateProviderRateSchema } from '../../../middlewares/validation/provider-dashboard.schemas'

const providerDashboardRoutes = express.Router()

providerDashboardRoutes
  .route('/')
  .get(
    requestValidationMiddleware(getProviderDashboardDetailSchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    ProviderDashboardController.getProviderDashboardData,
    responseValidationMiddleware()
  )

providerDashboardRoutes
  .route('/provider-rate')
  .get(
    requestValidationMiddleware(getProviderRateSchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    ProviderDashboardController.getProviderRateDetail,
    responseValidationMiddleware()
  )
  .post(
    requestValidationMiddleware(createProviderRateSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    ProviderDashboardController.createProviderRate,
    responseValidationMiddleware()
  )
  .put(
    requestValidationMiddleware(updateProviderRateSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    ProviderDashboardController.updateProviderRate,
    responseValidationMiddleware()
  )
  .delete(
    requestValidationMiddleware(deleteProviderRateSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    ProviderDashboardController.deleteProviderRateDetail,
    responseValidationMiddleware()
  )

providerDashboardRoutes
  .route('/aggregator-provider-detail')
  .get(
    requestValidationMiddleware(),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    ProviderDashboardController.getAggregatorProviderDetail,
    responseValidationMiddleware()
  )

export default providerDashboardRoutes
