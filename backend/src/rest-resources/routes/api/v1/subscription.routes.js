import express from 'express'
import multer from 'multer'
import { checkPermission, isAdminAuthenticated } from '../../../middlewares'
import contextMiddleware from '../../../middlewares/context.middleware'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import SubscriptionController from '../../../controllers/subscription.controller'
import { cancelUserSubscriptionSchema, createSubscriptionPlanSchema, getAllSubscriptionPlanSchema, getAllUserSubscriptionSchema, getSubscriptionFeatureSchema, getSubscriptionPlanDetailSchema, subscriptionResponseSchema, updateSubscriptionFeatureSchema, updateSubscriptionFeatureStatusSchema, updateSubscriptionPlanSchema, updateSubscriptionStatusSchema } from '../../../middlewares/validation/subscription-validation.schemas'

const upload = multer()
const args = { mergeParams: true }
const subscriptionRouter = express.Router(args)

// Subscription Feature Routes

subscriptionRouter
  .route('/feature')
  .get(
    requestValidationMiddleware(getSubscriptionFeatureSchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    SubscriptionController.getAllSubscriptionFeatures,
    responseValidationMiddleware(subscriptionResponseSchema)
  )
  .put(
    requestValidationMiddleware(updateSubscriptionFeatureSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    SubscriptionController.updateSubscriptionFeature,
    responseValidationMiddleware(subscriptionResponseSchema)
  )
  .patch(
    requestValidationMiddleware(updateSubscriptionFeatureStatusSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    SubscriptionController.updateSubscriptionFeature,
    responseValidationMiddleware(subscriptionResponseSchema)
  )

// Subscription Plan Routes
subscriptionRouter
  .route('/')
  .get(
    requestValidationMiddleware(getAllSubscriptionPlanSchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    SubscriptionController.getAllSubscriptionPlan,
    responseValidationMiddleware(subscriptionResponseSchema)
  )
  .post(
    upload.single('thumbnail'),
    requestValidationMiddleware(createSubscriptionPlanSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    SubscriptionController.createSubscriptionPlan,
    responseValidationMiddleware(subscriptionResponseSchema)
  )
  .put(
    upload.single('thumbnail'),
    requestValidationMiddleware(updateSubscriptionPlanSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    SubscriptionController.updateSubscriptionPlan,
    responseValidationMiddleware(subscriptionResponseSchema)
  )
  .patch(
    requestValidationMiddleware(updateSubscriptionStatusSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    SubscriptionController.updateSubscriptionPlan,
    responseValidationMiddleware(subscriptionResponseSchema)
  )

subscriptionRouter
  .route('/detail')
  .get(
    requestValidationMiddleware(getSubscriptionPlanDetailSchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    SubscriptionController.getSubscriptionPlanDetail,
    responseValidationMiddleware(subscriptionResponseSchema)
  )

// Subscription Plan Dashboard
subscriptionRouter
  .route('/dashboard')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    SubscriptionController.getUserSubscriptionDashboard,
    responseValidationMiddleware(subscriptionResponseSchema)
  )

// Subscription Plan Routes
subscriptionRouter
  .route('/user-subscription')
  .get(
    requestValidationMiddleware(getAllUserSubscriptionSchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    SubscriptionController.getAllUserSubscription,
    responseValidationMiddleware(subscriptionResponseSchema)
  ).patch(
    requestValidationMiddleware(cancelUserSubscriptionSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    SubscriptionController.cancelUserSubscription,
    responseValidationMiddleware(subscriptionResponseSchema)
  )

export default subscriptionRouter
