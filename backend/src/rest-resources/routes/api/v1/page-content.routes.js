import express from 'express'
import { isAdminAuthenticated } from '../../../middlewares'
import contextMiddleware from '../../../middlewares/context.middleware'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import PageContentController from '../../../controllers/page-content.controller'
import multer from 'multer'

const upload = multer()
const pageContentRoutes = express.Router()

pageContentRoutes
  .route('/')
  .post(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    PageContentController.addNewPage,
    responseValidationMiddleware({})
  )
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    PageContentController.getPages,
    responseValidationMiddleware({})
  )
  .put(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    PageContentController.editPage,
    responseValidationMiddleware({})
  )
  .delete(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    PageContentController.deletePage,
    responseValidationMiddleware({})
  )

pageContentRoutes
  .route('/details')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    PageContentController.getPageDetails,
    responseValidationMiddleware({})
  )

pageContentRoutes
  .route('/asset')
  .post(
    upload.single('assetValue'),
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    PageContentController.addNewPageAsset,
    responseValidationMiddleware({})
  )
  .put(
    upload.single('assetValue'),
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    PageContentController.updatePageAsset,
    responseValidationMiddleware({})
  )
  .delete(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    PageContentController.deletePageAsset,
    responseValidationMiddleware({})
  )

pageContentRoutes
  .route('/seo')
  .post(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    PageContentController.updatePageSEOInfo,
    responseValidationMiddleware({})
  )
export default pageContentRoutes
