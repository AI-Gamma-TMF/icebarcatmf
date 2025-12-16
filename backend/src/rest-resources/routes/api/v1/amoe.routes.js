import express from 'express'
import { checkPermission, isAdminAuthenticated } from '../../../middlewares'
import contextMiddleware from '../../../middlewares/context.middleware'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import AmoeController from '../../../controllers/amoe.controller'

const amoeRoutes = express.Router()

amoeRoutes
  .route('/history')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    AmoeController.amoeBonusHistory,
    responseValidationMiddleware({})
  )

amoeRoutes
  .route('/graph-data')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    AmoeController.amoeBonusGraphData,
    responseValidationMiddleware({})
  )

amoeRoutes
  .route('/bonus-time')
  .put(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    AmoeController.amoeBonusTimeUpdate,
    responseValidationMiddleware({})
  )
export default amoeRoutes
