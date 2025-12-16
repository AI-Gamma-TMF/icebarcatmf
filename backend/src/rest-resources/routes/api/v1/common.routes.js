import express from 'express'
import AdminController from '../../../controllers/admin.controller'
import { checkPermission, isAdminAuthenticated } from '../../../middlewares'
import contextMiddleware from '../../../middlewares/context.middleware'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import {
  statusSchemas
} from '../../../../rest-resources/middlewares/validation/status-validation.schemas'
const commonRoutes = express.Router()

commonRoutes
  .route('/status')
  .put(
    requestValidationMiddleware(statusSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    AdminController.updateStatus,
    responseValidationMiddleware(statusSchemas)
  )

commonRoutes
  .route('/elastic/healthcheck')
  .get(
    requestValidationMiddleware({}),
    isAdminAuthenticated,
    AdminController.elasticHealthCheck,
    responseValidationMiddleware({})
  )

export default commonRoutes
