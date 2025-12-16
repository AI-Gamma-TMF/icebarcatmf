import express from 'express'
import { checkPermission, isAdminAuthenticated } from '../../../middlewares'
import contextMiddleware from '../../../middlewares/context.middleware'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import multer from 'multer'
import PromotionThumbnailController from '../../../controllers/promotion.thumbnail.controller'
const upload = multer()
const args = { mergeParams: true }
const promotionThumbnail = express.Router(args)

promotionThumbnail
  .route('/')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    PromotionThumbnailController.getPromotionThumbnail,
    responseValidationMiddleware({})
  )
  .post(
    upload.single('promotionThumbnailImage'),
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    PromotionThumbnailController.createPromotionThumbnail,
    responseValidationMiddleware({})
  )
  .put(
    upload.single('promotionThumbnailImage'),
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    PromotionThumbnailController.updatePromotionThumbnail,
    responseValidationMiddleware({})
  )
  .delete(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    PromotionThumbnailController.deletePromotionThumbnail,
    responseValidationMiddleware({})
  )
  .patch(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    PromotionThumbnailController.updatePromotionThumbnailActiveStatus,
    responseValidationMiddleware({})
  )

promotionThumbnail
  .route('/order')
  .put(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    PromotionThumbnailController.orderPromotionThumbnail,
    responseValidationMiddleware({})
  )

export default promotionThumbnail
