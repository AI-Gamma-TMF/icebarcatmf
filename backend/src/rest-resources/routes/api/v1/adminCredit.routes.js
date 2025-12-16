import express from 'express'
import { checkPermission, isAdminAuthenticated } from '../../../middlewares'
import contextMiddleware from '../../../middlewares/context.middleware'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import {} from '../../../middlewares/validation/admin-validation.schemas'
import AdminCreditController from '../../../controllers/adminCredit.controller'
import { getAdminCreditCoinsSchemas, getAdminCreditUserSchemas } from '../../../middlewares/validation/adminCredit-validation.schemas'
const args = { mergeParams: true }
const adminCreditRouter = express.Router(args)

adminCreditRouter
  .route('/admin-credit-coins')
  .get(
    requestValidationMiddleware(getAdminCreditCoinsSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    AdminCreditController.getAdminCreditCoins,
    responseValidationMiddleware({})
  )

adminCreditRouter
  .route('/admin-credit-user')
  .get(
    requestValidationMiddleware(getAdminCreditUserSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    AdminCreditController.getAdminCreditUser,
    responseValidationMiddleware({})
  )

export default adminCreditRouter
