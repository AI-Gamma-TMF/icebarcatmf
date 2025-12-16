import express from 'express'
import FreeSpinController from '../../../controllers/freeSpin.controller'
import { checkPermission, isAdminAuthenticated } from '../../../middlewares'
import contextMiddleware from '../../../middlewares/context.middleware'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'

import multer from 'multer'
const args = { mergeParams: true }
const freeSpinRoutes = express.Router(args)
const upload = multer()

freeSpinRoutes
  .route('/provider')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    FreeSpinController.getProviderListAllowFreeSpin,
    responseValidationMiddleware({})
  )

freeSpinRoutes
  .route('/games')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    FreeSpinController.getGameListAllowFreeSpin,
    responseValidationMiddleware({})
  )

freeSpinRoutes
  .route('/getBetAmountList')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    FreeSpinController.getFreeSpinAmountScaleList,
    responseValidationMiddleware({})
  )

freeSpinRoutes
  .route('/upload-csv')
  .post(
    upload.single('file'),
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    FreeSpinController.uploadUserCsv,
    responseValidationMiddleware({})
  )

freeSpinRoutes
  .route('/preview-user')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    FreeSpinController.showPreview,
    responseValidationMiddleware({})
  )

freeSpinRoutes
  .route('/remove-user')
  .delete(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    FreeSpinController.removePreview,
    responseValidationMiddleware({})
  )
freeSpinRoutes
  .route('/get-cache-user')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    FreeSpinController.getCacheUser,
    responseValidationMiddleware({})
  )

freeSpinRoutes
  .route('/free-spin-grant')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    FreeSpinController.getAllFreeSpin,
    responseValidationMiddleware({})
  )
  .post(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    FreeSpinController.createFreeSpin,
    responseValidationMiddleware({})
  )
  .put(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    FreeSpinController.updateFreeSpin,
    responseValidationMiddleware({})
  )
  .patch(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    FreeSpinController.updateFreeSpinStatus,
    responseValidationMiddleware({})
  )

freeSpinRoutes
  .route('/dashboard')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    FreeSpinController.getFreeSpinDashboard,
    responseValidationMiddleware({})
  )

freeSpinRoutes
  .route('/details/:freeSpinId')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    FreeSpinController.getFreeSpinDetails,
    responseValidationMiddleware({})
  )

freeSpinRoutes
  .route('/:freeSpinId/users')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    FreeSpinController.getFreeSpinUserDetails,
    responseValidationMiddleware({})
  )

freeSpinRoutes
  .route('/discard-user')
  .put(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    FreeSpinController.removeUserFromFreeSpin,
    responseValidationMiddleware({})
  )

export default freeSpinRoutes
