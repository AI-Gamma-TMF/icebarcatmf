import express from 'express'
import { checkPermission, isAdminAuthenticated } from '../../../middlewares'
import contextMiddleware from '../../../middlewares/context.middleware'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import multer from 'multer'
import GamePageController from '../../../controllers/gamePage.controller'

const args = { mergeParams: true }
const gamePageRouter = express.Router(args)
const upload = multer()

gamePageRouter
  .route('/')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    GamePageController.getGamePage,
    responseValidationMiddleware({})
  )
  .post(
    upload.fields([{ name: 'image[]', maxCount: 10 }]),
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    GamePageController.createGamePage,
    responseValidationMiddleware({})
  )
  .put(
    upload.fields([{ name: 'image[]', maxCount: 10 }]),
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    GamePageController.updateGamePage,
    responseValidationMiddleware({})
  )
  .delete(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    GamePageController.deleteGamePage,
    responseValidationMiddleware({})
  )

gamePageRouter
  .route('/faq')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    GamePageController.getGamePageFaq,
    responseValidationMiddleware({})
  )
  .post(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    GamePageController.createGamePageFaq,
    responseValidationMiddleware({})
  )
  .delete(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    GamePageController.deleteGamePageFaq,
    responseValidationMiddleware({})
  )

gamePageRouter
  .route('/card')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    GamePageController.getGamePageCard,
    responseValidationMiddleware({})
  )
  .post(
    upload.fields([{ name: 'image[]', maxCount: 10 }]),
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    GamePageController.createGamePageCard,
    responseValidationMiddleware({})
  )
  .put(
    upload.fields([{ name: 'image[]', maxCount: 10 }]),
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    GamePageController.updateGamePageCard,
    responseValidationMiddleware({})
  )
  .delete(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    GamePageController.deleteGamePageCard,
    responseValidationMiddleware({})
  )

gamePageRouter
  .route('/game-lobby')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    GamePageController.getGamesLobbyDetail,
    responseValidationMiddleware({})
  )

gamePageRouter
  .route('/monthly-discount')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    GamePageController.GetGameMonthlyDiscount,
    responseValidationMiddleware({})
  )
  .post(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    GamePageController.createGameMonthlyDiscount,
    responseValidationMiddleware({})
  )
  .put(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    GamePageController.updateGameMonthlyDiscount,
    responseValidationMiddleware({})
  )
  .delete(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    GamePageController.deleteGameMonthlyDiscount,
    responseValidationMiddleware({})
  )

export default gamePageRouter
