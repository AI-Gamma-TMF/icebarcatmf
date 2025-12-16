import express from 'express'
import WalletController from '../../../controllers/wallet.controller'
import { checkPermission, isAdminAuthenticated } from '../../../middlewares'
import contextMiddleware from '../../../middlewares/context.middleware'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import { addBalanceSchemas } from '../../../middlewares/validation/admin-validation.schemas'
const args = { mergeParams: true }
const walletPermission = express.Router(args)
walletPermission
  .route('/add-remove-balance')
  .put(
    requestValidationMiddleware(addBalanceSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    WalletController.addBalance,
    responseValidationMiddleware(addBalanceSchemas)
  )
export default walletPermission
