import express from 'express'
import BonusController from '../../../controllers/bonus.controller'
import { checkPermission, isAdminAuthenticated } from '../../../middlewares'
import contextMiddleware from '../../../middlewares/context.middleware'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import {
  getBonusSchemas,
  createBonusSchemas,
  updateBonusSchemas,
  deleteBonusSchemas,
  updateSpinWheelSchemas,
  createStreakDailyBonusSchemas,
  updateScratchCardSchema,
  createScratchCardSchema,
  createBudgetsSchema,
  updateOrResetBudgetsSchema
} from '../../../../rest-resources/middlewares/validation/bonus-validation.schema'
import multer from 'multer'
const args = { mergeParams: true }
const bonusRouter = express.Router(args)
const upload = multer()

bonusRouter
  .route('/')
  .get(
    requestValidationMiddleware(getBonusSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    BonusController.getBonus,
    responseValidationMiddleware(getBonusSchemas)
  )

  .post(
    upload.any(),
    requestValidationMiddleware(createBonusSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    BonusController.createBonus,
    responseValidationMiddleware(createBonusSchemas)
  )

  .put(
    requestValidationMiddleware(updateBonusSchemas),
    upload.single('bonusImg'),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    BonusController.editBonus,
    responseValidationMiddleware(updateBonusSchemas)
  )

  .delete(
    requestValidationMiddleware(deleteBonusSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    BonusController.deleteBonus,
    responseValidationMiddleware(deleteBonusSchemas)
  )

bonusRouter
  .route('/spin-wheel')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    BonusController.getSpinWheelList,
    responseValidationMiddleware({})
  )
  .put(
    requestValidationMiddleware(updateSpinWheelSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    BonusController.updateSpinWheel,
    responseValidationMiddleware({})
  )

bonusRouter
  .route('/referral-bonuses')
  .post(
    requestValidationMiddleware(),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    BonusController.createProgressiveReferralBonus,
    responseValidationMiddleware()
  )

bonusRouter
  .route('/streak-daily-bonus')
  .post(
    upload.single('dailyBonusImg'),
    requestValidationMiddleware(createStreakDailyBonusSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    BonusController.createStreakDailyBonus,
    responseValidationMiddleware(createStreakDailyBonusSchemas)
  )

bonusRouter
  .route('/scratch-card')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    BonusController.getScratchCardList,
    responseValidationMiddleware({})
  )
  .post(
    requestValidationMiddleware(createScratchCardSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    BonusController.createScratchCard,
    responseValidationMiddleware(createScratchCardSchema)
  )
  .put(
    upload.single('image'),
    requestValidationMiddleware(updateScratchCardSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    BonusController.updateScratchCard,
    responseValidationMiddleware(updateScratchCardSchema)
  )
  .delete(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    BonusController.deleteScratchCard,
    responseValidationMiddleware({})
  )

bonusRouter
  .route('/scratch-card-dropdown')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    BonusController.getScratchCardDropDown,
    responseValidationMiddleware({})
  )

bonusRouter
  .route('/template-scratch-card')
  .post(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    BonusController.createTemplateScratchCard,
    responseValidationMiddleware({})
  )

bonusRouter
  .route('/scratch-card-bonus-graph')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    BonusController.scratchCardBonusGraph,
    responseValidationMiddleware({})
  )

bonusRouter
  .route('/scratch-card-bonus-details')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    BonusController.scratchCardBonusDetails,
    responseValidationMiddleware({})
  )

bonusRouter
  .route('/all-scratch-card-images')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    BonusController.getAllScratchCardImages,
    responseValidationMiddleware({})
  )

bonusRouter
  .route('/budgets')
  .post(
    requestValidationMiddleware(createBudgetsSchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    BonusController.createScratchCardBudgets,
    responseValidationMiddleware(createBudgetsSchema)
  )
  .put(
    requestValidationMiddleware(updateOrResetBudgetsSchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    BonusController.resetScratchCardBudgets,
    responseValidationMiddleware(updateOrResetBudgetsSchema)
  )

bonusRouter
  .route('/upload-scratch-card-images')
  .post(
    upload.single('image'),
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    BonusController.uploadScratchCardImages,
    responseValidationMiddleware({})
  )

bonusRouter
  .route('/attached-grant-dropdown')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    BonusController.getAttachedGrantDropDown,
    responseValidationMiddleware({})
  )
export default bonusRouter
