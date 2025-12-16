import express from 'express'
import multer from 'multer'
import contextMiddleware from '../../../middlewares/context.middleware'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import PaymentController from '../../../controllers/payment.controller'
import { updatePaymentProviderStatus } from '../../../middlewares/validation/payment-validation.schema'
import { checkPermission, isAdminAuthenticated } from '../../../middlewares'

const cashierManagementRoutes = express.Router()
const upload = multer()

// Payment Provider
cashierManagementRoutes
  .route('/payment-provider')
  .get(
    requestValidationMiddleware(),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    PaymentController.getAllPaymentMethods,
    responseValidationMiddleware()
  )
  .put(
    requestValidationMiddleware(updatePaymentProviderStatus),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    PaymentController.updatePaymentMethodStatus,
    responseValidationMiddleware(updatePaymentProviderStatus)
  )

// Redeem Rule Imp

cashierManagementRoutes
  .route('/redeem-rule')
  .post(
    requestValidationMiddleware(),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    PaymentController.createRedeemRule,
    responseValidationMiddleware()
  )
  .put(
    requestValidationMiddleware(),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    PaymentController.updateRedeemRule,
    responseValidationMiddleware()
  )
  .get(
    requestValidationMiddleware(),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    PaymentController.getRedeemRule,
    responseValidationMiddleware()
  )
  .delete(
    requestValidationMiddleware(),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    PaymentController.deleteRedeemRule,
    responseValidationMiddleware()
  )

cashierManagementRoutes
  .route('/redeem-rule/users-from-csv')
  .post(
    upload.single('file'),
    requestValidationMiddleware(),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    PaymentController.getUsersFromCsv,
    responseValidationMiddleware()
  )

cashierManagementRoutes
  .route('/redeem-rule/user-details')
  .get(
    requestValidationMiddleware(),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    PaymentController.getRuleUserDetails,
    responseValidationMiddleware()
  )

cashierManagementRoutes
  .route('/redeem-rule/remove-users')
  .put(
    requestValidationMiddleware(),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    PaymentController.removeUsersFromRedeemRule,
    responseValidationMiddleware()
  )

cashierManagementRoutes
  .route('/redeem-rule/withdraw-details')
  .get(
    requestValidationMiddleware(),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    PaymentController.getRuleWiseWithdrawRequestDetails,
    responseValidationMiddleware()
  )

export default cashierManagementRoutes
