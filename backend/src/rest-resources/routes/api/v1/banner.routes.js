import express from 'express'
import BannerController from '../../../controllers/banner.controller'
import { checkPermission, isAdminAuthenticated } from '../../../middlewares'
import contextMiddleware from '../../../middlewares/context.middleware'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'

import {
  bannerGetAllSchemas,
  bannerUploadSchemas,
  bannerUpdateSchemas,
  bannerDeleteSchemas,
  bannerOrderSchemas
} from '../../../../rest-resources/middlewares/validation/banner-validation.schemas'
import multer from 'multer'
const upload = multer()
const args = { mergeParams: true }
const bannerRouter = express.Router(args)

bannerRouter
  .route('/')
  .get(
    requestValidationMiddleware(bannerGetAllSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    BannerController.getAllBanner,
    responseValidationMiddleware(bannerGetAllSchemas)
  )
  .post(
    upload.fields([{ name: 'desktopBannerImage' }, { name: 'mobileBannerImage' }]),
    requestValidationMiddleware(bannerUploadSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    BannerController.uploadBanner,
    responseValidationMiddleware(bannerUploadSchemas)
  )
  .put(
    upload.fields([{ name: 'desktopBannerImage' }, { name: 'mobileBannerImage' }]),
    requestValidationMiddleware(bannerUpdateSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    BannerController.updateBanner,
    responseValidationMiddleware(bannerUpdateSchemas)
  )
  .delete(
    upload.single('image'),
    requestValidationMiddleware(bannerDeleteSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    BannerController.deleteBanner,
    responseValidationMiddleware(bannerDeleteSchemas)
  )

bannerRouter
  .route('/order')
  .put(
    requestValidationMiddleware(bannerOrderSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    BannerController.orderBanner,
    responseValidationMiddleware(bannerOrderSchemas)
  )
export default bannerRouter
