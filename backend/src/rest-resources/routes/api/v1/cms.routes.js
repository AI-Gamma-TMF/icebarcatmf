import express from 'express'
import CmsController from '../../../controllers/cms.controller'
import { isAdminAuthenticated, checkPermission } from '../../../middlewares'
import contextMiddleware from '../../../middlewares/context.middleware'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import {
  getCmsDetailsSchemas,
  setCmsSchemas,
  updateCmsSchemas,
  deleteCmsSchemas,
  getListSchemas,
  getDynamicListSchemas,
  deleteCmsPagesSchemas
} from '../../../middlewares/validation/cms-validation.schemas'

const args = { mergeParams: true }
const cmsRouter = express.Router(args)

cmsRouter
  .route('/')
  .get(
    requestValidationMiddleware(getListSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    CmsController.getAllCmsPage,
    responseValidationMiddleware(getListSchemas)
  )

cmsRouter
  .route('/details')
  .get(
    requestValidationMiddleware(getCmsDetailsSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    CmsController.getCmsPage,
    responseValidationMiddleware(getCmsDetailsSchemas)
  )

cmsRouter
  .route('/')
  .post(
    requestValidationMiddleware(setCmsSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    CmsController.createCmsPage,
    responseValidationMiddleware(setCmsSchemas)
  )

cmsRouter
  .route('/')
  .put(
    requestValidationMiddleware(updateCmsSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    CmsController.updateCmsPage,
    responseValidationMiddleware(updateCmsSchemas)
  )

cmsRouter
  .route('/')
  .delete(
    requestValidationMiddleware(deleteCmsSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    CmsController.deleteCmsPageLanguage,
    responseValidationMiddleware(deleteCmsSchemas)
  )
cmsRouter
  .route('/pages')
  .delete(
    requestValidationMiddleware(deleteCmsPagesSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    CmsController.deleteCmsPage,
    responseValidationMiddleware(deleteCmsPagesSchemas)
  )
cmsRouter
  .route('/dynamic-data')
  .get(
    requestValidationMiddleware(getDynamicListSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    CmsController.getCmsDynamicData,
    responseValidationMiddleware(getDynamicListSchemas)
  )
export default cmsRouter
