import express from 'express'
import contextMiddleware from '../../../middlewares/context.middleware'
import RafflesController from '../../../controllers/raffles.controller'
import { checkPermission, isAdminAuthenticated } from '../../../middlewares'
import RafflesPayoutController from '../../../controllers/RafflesPayoutController'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'

import {
  defaultResponseSchemas,
  getRaffleDetailSchema,
  getUserPayoutSearchSchema,
  userPayoutSchema
} from '../../../middlewares/validation/raffle-validation.schemas'

const args = { mergeParams: true }
const rafflePayoutRouter = express.Router(args)

rafflePayoutRouter
  .route('/')
  .get(
    requestValidationMiddleware(getRaffleDetailSchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    RafflesPayoutController.getRafflePayout,
    responseValidationMiddleware()
  )

rafflePayoutRouter
  .route('/search')
  .get(
    requestValidationMiddleware(getUserPayoutSearchSchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    RafflesPayoutController.getUserPayoutSearch,
    responseValidationMiddleware()
  )

rafflePayoutRouter
  .route('/payout')
  .put(
    requestValidationMiddleware(userPayoutSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    RafflesPayoutController.userPayout,
    responseValidationMiddleware(defaultResponseSchemas)
  )

rafflePayoutRouter
  .route('/:raffleId')
  .get(
    requestValidationMiddleware(),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    RafflesController.getRaffle,
    responseValidationMiddleware()
  )

export default rafflePayoutRouter
