import express from 'express'
import { isAdminAuthenticated } from '../../../middlewares'
import contextMiddleware from '../../../middlewares/context.middleware'
import AleaCasinoController from '../../../controllers/alea.controller'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'

const args = { mergeParams: true }

const aleaRouter = express.Router(args)
aleaRouter
  .route('/')
  .post(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    AleaCasinoController.addGames,
    responseValidationMiddleware({})
  )

export default aleaRouter
