import multer from 'multer'
import express from 'express'
import TierController from '../../../controllers/tier.controller'
import contextMiddleware from '../../../middlewares/context.middleware'
import { checkPermission, isAdminAuthenticated } from '../../../middlewares'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import { createTierSchema, getAllTierSchema, getTierDetailSchema, getTierUsersSchema, updateTierSchema, updateTierStatusSchema } from '../../../middlewares/validation/tier-validation.schema'

const upload = multer()
const args = { mergeParams: true }
const tierRouter = express.Router(args)

tierRouter
  .route('/')
  .get(
    requestValidationMiddleware(getAllTierSchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    TierController.getAllTier,
    responseValidationMiddleware(getAllTierSchema)
  )
  .post(
    upload.single('icon'),
    requestValidationMiddleware(createTierSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    TierController.createTier,
    responseValidationMiddleware(createTierSchema)
  )
  .put(
    upload.single('icon'),
    requestValidationMiddleware(updateTierSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    TierController.updateTier,
    responseValidationMiddleware(updateTierSchema)
  )
  .patch(
    requestValidationMiddleware(updateTierStatusSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    TierController.updateTierStatus,
    responseValidationMiddleware(updateTierStatusSchema)
  )
  // .delete(
  //   requestValidationMiddleware(),
  //   contextMiddleware(true),
  //   isAdminAuthenticated,
  //   checkPermission,
  //   TierController.deleteTier,
  //   responseValidationMiddleware()
  // )

tierRouter
  .route('/:tierId')
  .get(
    requestValidationMiddleware(getTierDetailSchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    TierController.getTierDetail,
    responseValidationMiddleware(getTierDetailSchema)
  )

tierRouter
  .route('/:tierId/users')
  .get(
    requestValidationMiddleware(getTierUsersSchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    TierController.getTierUsers,
    responseValidationMiddleware(getTierUsersSchema)
  )

export default tierRouter
