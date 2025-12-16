import multer from 'multer'
import express from 'express'
import { checkPermission, isAdminAuthenticated } from '../../../middlewares'
import contextMiddleware from '../../../middlewares/context.middleware'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import VipDashboardController from '../../../controllers/vip.dashboard.controller'
const args = { mergeParams: true }
const vipManagedBydRouter = express.Router(args)

const upload = multer()
vipManagedBydRouter
  .route('/')
  .put(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    VipDashboardController.updateVipManager,
    responseValidationMiddleware({})
  ).get(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    VipDashboardController.getVipManager,
    responseValidationMiddleware({})
  )

vipManagedBydRouter
  .route('/csv')
  .put(
    upload.single('file'),
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    VipDashboardController.updateVipMangedByFromCsv,
    responseValidationMiddleware({})
  )

export default vipManagedBydRouter
