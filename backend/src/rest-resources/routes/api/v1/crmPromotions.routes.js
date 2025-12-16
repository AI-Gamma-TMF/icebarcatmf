import express from 'express'
import { isAdminAuthenticated } from '../../../middlewares'
import contextMiddleware from '../../../middlewares/context.middleware'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import CRMPromotionController from '../../../controllers/crmPromotion.controller'

const args = { mergeParams: true }

const crmPromotionRouter = express.Router(args)
crmPromotionRouter
  .route('/')
  .post(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    CRMPromotionController.addPromotion,
    responseValidationMiddleware({})
  )
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    CRMPromotionController.getAllPromotions,
    responseValidationMiddleware({})
  )
  .put(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    CRMPromotionController.updatePromocode,
    responseValidationMiddleware({})
  )
  .delete(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    CRMPromotionController.deletePromotion,
    responseValidationMiddleware({})
  )
  .patch(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    CRMPromotionController.updateStatusPromocode,
    responseValidationMiddleware({})
  )

crmPromotionRouter
  .route('/user-details')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    CRMPromotionController.getBonusHistory,
    responseValidationMiddleware({})
  )

crmPromotionRouter
  .route('/scheduled-webhook')
  .post(
    requestValidationMiddleware(),
    contextMiddleware(true),
    CRMPromotionController.scheduledCampaignsWebhook,
    responseValidationMiddleware()
  )

crmPromotionRouter
  .route('/triggered-webhook')
  .post(
    requestValidationMiddleware(),
    contextMiddleware(true),
    CRMPromotionController.triggeredCampaignsWebhook,
    responseValidationMiddleware()
  )

crmPromotionRouter
  .route('/expired-bonus')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    CRMPromotionController.getExpiredBonusDetails,
    responseValidationMiddleware({})
  )

crmPromotionRouter
  .route('/:crmPromotionId')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    CRMPromotionController.getPromotionDetails,
    responseValidationMiddleware({})
  )

export default crmPromotionRouter
