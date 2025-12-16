import express from 'express'
import multer from 'multer'
import RafflesController from '../../../controllers/raffles.controller'
import contextMiddleware from '../../../middlewares/context.middleware'
import { checkPermission, isAdminAuthenticated } from '../../../middlewares'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'

import {
  createRafflesSchemas,
  updateRaffleSchema,
  getRaffleSchema,
  updateRaffleStatusSchema,
  getRaffleDetailSchema,
  defaultResponseSchemas,
  deleteRaffleDetailSchema
} from '../../../middlewares/validation/raffle-validation.schemas'

const args = { mergeParams: true }
const raffleRouter = express.Router(args)
const upload = multer()

raffleRouter
  .route('/')
  .get(
    requestValidationMiddleware(getRaffleSchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    RafflesController.getAllRaffles,
    responseValidationMiddleware()
  )
  .post(
    upload.single('bannerImg'),
    requestValidationMiddleware(createRafflesSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    RafflesController.createRaffle,
    responseValidationMiddleware(defaultResponseSchemas)
  )
  .put(
    upload.single('bannerImg'),
    requestValidationMiddleware(updateRaffleSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    RafflesController.updateRaffle,
    responseValidationMiddleware(defaultResponseSchemas)
  )
  .delete(
    requestValidationMiddleware(deleteRaffleDetailSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    RafflesController.deleteRaffle,
    responseValidationMiddleware(defaultResponseSchemas)
  )
  .patch(
    requestValidationMiddleware(updateRaffleStatusSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    RafflesController.updateRaffleStatus,
    responseValidationMiddleware(defaultResponseSchemas)
  )

raffleRouter
  .route('/details')
  .get(
    requestValidationMiddleware(getRaffleDetailSchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    RafflesController.getRaffleDetails,
    responseValidationMiddleware()
  )

raffleRouter
  .route('/:raffleId')
  .get(
    requestValidationMiddleware(),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    RafflesController.getRaffle,
    responseValidationMiddleware()
  )

export default raffleRouter
