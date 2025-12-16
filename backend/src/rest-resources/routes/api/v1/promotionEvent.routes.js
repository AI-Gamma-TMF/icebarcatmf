import express from 'express'
import contextMiddleware from '../../../middlewares/context.middleware'
import { checkPermission, isAdminAuthenticated } from '../../../middlewares'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import PromotionController from '../../../controllers/promotionEvent.controller'

const args = { mergeParams: true }
const promotionEventRouter = express.Router(args)

promotionEventRouter
  .route('/')
  .get(
    requestValidationMiddleware(),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    PromotionController.getPromoCodes,
    responseValidationMiddleware()
  )
  .post(
    requestValidationMiddleware(),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    PromotionController.createPromoCodes,
    responseValidationMiddleware()
  )
  .put(
    requestValidationMiddleware(),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    PromotionController.updatePromoCode,
    responseValidationMiddleware()
  )
  .patch(
    requestValidationMiddleware(),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    PromotionController.updateStatusPromoCode,
    responseValidationMiddleware()
  )
  .delete(
    requestValidationMiddleware(),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    PromotionController.deletePromoCode,
    responseValidationMiddleware()
  )

promotionEventRouter
  .route('/generate')
  .get(
    requestValidationMiddleware(),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    PromotionController.getRandomPromoCode,
    responseValidationMiddleware()
  )

promotionEventRouter
  .route('/graph')
  .get(
    requestValidationMiddleware(),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    PromotionController.getAffiliateGraph,
    responseValidationMiddleware()
  )

promotionEventRouter
  .route('/:promocodeId')
  .get(
    requestValidationMiddleware(),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    PromotionController.getPromocodeDetail,
    responseValidationMiddleware()
  )

export default promotionEventRouter
