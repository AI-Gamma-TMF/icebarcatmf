import express from 'express'

import { checkPermission, isAdminAuthenticated } from '../../../middlewares'
import contextMiddleware from '../../../middlewares/context.middleware'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import getExportCenterListController from '../../../controllers/exportcenter.controller'
import { exportCenterSchema } from '../../../middlewares/validation/exportcenter-validation.schema'

const args = { mergeParams: true }
const exportCenterRouter = express.Router(args)
exportCenterRouter
  .route('/getExportList')
  .get(
    requestValidationMiddleware({ exportCenterSchema }),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    getExportCenterListController.getlist,
    responseValidationMiddleware({ exportCenterSchema })
  )

export default exportCenterRouter
