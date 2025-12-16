import express from 'express'
import contextMiddleware from '../../../middlewares/context.middleware'
import { checkPermission, isAdminAuthenticated } from '../../../middlewares'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import MaintenanceModeController from '../../../controllers/maintenanceMode.controller'

const args = { mergeParams: true }
const maintenanceModeRouter = express.Router(args)

maintenanceModeRouter
  .route('/')
  .get(
    requestValidationMiddleware(),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    MaintenanceModeController.getMaintenanceModeDetail,
    responseValidationMiddleware()
  )
  .post(
    requestValidationMiddleware(),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    MaintenanceModeController.createMaintenanceMode,
    responseValidationMiddleware()
  )
  .put(
    requestValidationMiddleware(),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    MaintenanceModeController.updateMaintenanceMode,
    responseValidationMiddleware()
  )
  .delete(
    requestValidationMiddleware(),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    MaintenanceModeController.deleteMaintenanceMode,
    responseValidationMiddleware()
  )

maintenanceModeRouter
  .route('/manage-mode')
  .patch(
    requestValidationMiddleware(),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    MaintenanceModeController.manageMaintenanceMode,
    responseValidationMiddleware()
  )

maintenanceModeRouter
  .route('/ribbon')
  .post(
    requestValidationMiddleware(),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    MaintenanceModeController.createRibbonData,
    responseValidationMiddleware()
  )
  .get(
    requestValidationMiddleware(),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    MaintenanceModeController.getRibbonData,
    responseValidationMiddleware()
  )
  .delete(
    requestValidationMiddleware(),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    MaintenanceModeController.deleteRibbonData,
    responseValidationMiddleware()
  )

export default maintenanceModeRouter
