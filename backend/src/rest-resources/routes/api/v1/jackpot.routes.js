import express from 'express'
import contextMiddleware from '../../../middlewares/context.middleware'
import JackpotController from '../../../controllers/jackpot.controller'
import { checkPermission, isAdminAuthenticated } from '../../../middlewares'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import { createJackpotSchema, deleteJackpotSchema, getJackpotGraphSchema, getJackpotSchema, jackpotRnGSchema, updateJackpotSchema } from '../../../middlewares/validation/jackpot-validation.schema'

const args = { mergeParams: true }
const jackpotRoutes = express.Router(args)

jackpotRoutes
  .route('/')
  .post(
    requestValidationMiddleware(createJackpotSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    JackpotController.createJackpot,
    responseValidationMiddleware()
  )
  .put(
    requestValidationMiddleware(updateJackpotSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    JackpotController.updateJackpot,
    responseValidationMiddleware()
  )
  .delete(
    requestValidationMiddleware(deleteJackpotSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    JackpotController.deleteJackpot,
    responseValidationMiddleware()
  )
  .get(
    requestValidationMiddleware(getJackpotSchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    JackpotController.getAllJackpot,
    responseValidationMiddleware()
  )

jackpotRoutes
  .route('/info')
  .get(
    requestValidationMiddleware(),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    JackpotController.getJackpotTabs,
    responseValidationMiddleware()
  )

jackpotRoutes
  .route('/current')
  .get(
    requestValidationMiddleware(),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    JackpotController.getCurrentJackpotInfo,
    responseValidationMiddleware()
  )

jackpotRoutes
  .route('/rng')
  .get(
    requestValidationMiddleware(jackpotRnGSchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    JackpotController.generateRandomWinningData,
    responseValidationMiddleware()
  )

jackpotRoutes
  .route('/graph')
  .get(
    requestValidationMiddleware(getJackpotGraphSchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    JackpotController.getJackpotGraph,
    responseValidationMiddleware()
  )
export default jackpotRoutes
