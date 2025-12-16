import express from 'express'
import PaymentController from '../../../controllers/payment.controller'
import contextMiddleware from '../../../middlewares/context.middleware'
import { checkPermission, isAdminAuthenticated } from '../../../middlewares'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import { getUsersWithVaultCoinsValidationSchema, paymentTransactionSchema, redeemRequestsActionSchema, redeemRequestsSchema } from '../../../middlewares/validation/payment-validation.schema'
import CasinoController from '../../../controllers/casino.controller'
import { getCasinoTransactionsSchemas } from '../../../middlewares/validation/casino-validation.schemas'

const args = { mergeParams: true }
const paymentRoutes = express.Router(args)

// Casino Transactions
paymentRoutes.route('/casino-transactions')
  .get(
    requestValidationMiddleware(getCasinoTransactionsSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    PaymentController.getCasinoTransactions,
    responseValidationMiddleware(getCasinoTransactionsSchemas)
  )

// Transactions Banking
paymentRoutes
  .route('/transactions')
  .get(
    requestValidationMiddleware(paymentTransactionSchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    PaymentController.transactions,
    responseValidationMiddleware(paymentTransactionSchema)
  )

paymentRoutes
  .route('/redeem-requests')
  .get(
    requestValidationMiddleware(redeemRequestsSchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    PaymentController.getRedeemRequest,
    responseValidationMiddleware(redeemRequestsSchema)
  )
  .put(
    requestValidationMiddleware(redeemRequestsActionSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    PaymentController.redeemRequest,
    responseValidationMiddleware(redeemRequestsActionSchema)
  )
  .patch(
    requestValidationMiddleware(),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    PaymentController.updateRedeemRequestStatus,
    responseValidationMiddleware()
  )

// getUserRedeemRequest
paymentRoutes
  .route('/redeem-details')
  .get(
    requestValidationMiddleware(),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    PaymentController.getUserRedeemRequest,
    responseValidationMiddleware()
  )

paymentRoutes
  .route('/skrill-balance')
  .get(
    requestValidationMiddleware(),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    PaymentController.getSkrillBalance,
    responseValidationMiddleware()
  )

paymentRoutes
  .route('/approve-redeem-requests')
  .put(
    requestValidationMiddleware(),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    PaymentController.approveAllRedeemRequest,
    responseValidationMiddleware()
  )

paymentRoutes
  .route('/vault-data')
  .get(
    requestValidationMiddleware(getUsersWithVaultCoinsValidationSchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    PaymentController.getVaultCoinStorage,
    responseValidationMiddleware(getUsersWithVaultCoinsValidationSchema)
  )

paymentRoutes
  .route('/game')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    CasinoController.getCasinoGame,
    responseValidationMiddleware({})
  )

paymentRoutes
  .route('/games')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    CasinoController.getAllCasinoGame,
    responseValidationMiddleware({})
  )

paymentRoutes
  .route('/redeem-dashboard')
  .get(
    requestValidationMiddleware(),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    PaymentController.getRedeemDashboardData,
    responseValidationMiddleware()
  )

export default paymentRoutes
