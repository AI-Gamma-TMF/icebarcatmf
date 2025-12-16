import multer from 'multer'
import express from 'express'
import contextMiddleware from '../../../middlewares/context.middleware'
import { checkPermission, isAdminAuthenticated } from '../../../middlewares'
import VipDashboardController from '../../../controllers/vip.dashboard.controller'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
const upload = multer()
const args = { mergeParams: true }
const vipDashBoardRouter = express.Router(args)

vipDashBoardRouter
  .route('/')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    VipDashboardController.getVipUsers,
    responseValidationMiddleware({})
  )
  .put(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    VipDashboardController.updateVipUsers,
    responseValidationMiddleware({})
  )
vipDashBoardRouter
  .route('/detail')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    VipDashboardController.getVipUserById,
    responseValidationMiddleware({})
  )

vipDashBoardRouter
  .route('/user-report')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    VipDashboardController.getOptimizedUserReport,
    responseValidationMiddleware({})
  )

vipDashBoardRouter
  .route('/loyalty-tier')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    VipDashboardController.getLoyaltyTiers,
    responseValidationMiddleware({})
  )
  .put(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    VipDashboardController.updateLoyaltyTier,
    responseValidationMiddleware({})
  )

vipDashBoardRouter
  .route('/dashboard-report')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    VipDashboardController.getVipUsersDashboardReportOptimized,
    responseValidationMiddleware({})
  )

vipDashBoardRouter
  .route('/biggest-looser-winner')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    VipDashboardController.getBiggestWinnerLooser,
    responseValidationMiddleware({})
  )

vipDashBoardRouter
  .route('/questionnaire')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    VipDashboardController.getQuestionnaire,
    responseValidationMiddleware({})
  ).post(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    VipDashboardController.addQuestionnaire,
    responseValidationMiddleware({})
  ).put(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    VipDashboardController.updateQuestionnaire,
    responseValidationMiddleware({})
  ).delete(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    VipDashboardController.deleteQuestionnaire,
    responseValidationMiddleware({})
  ).patch(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    VipDashboardController.updateQuestionnaireActiveStatus,
    responseValidationMiddleware({})
  )

vipDashBoardRouter
  .route('/user-questionnaire-answer')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    VipDashboardController.getQuestionnaireAnswer,
    responseValidationMiddleware({})
  ).post(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    VipDashboardController.addQuestionnaireAnswer,
    responseValidationMiddleware({})
  )

vipDashBoardRouter.route('/order')
  .put(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    VipDashboardController.orderQuestionnaire,
    responseValidationMiddleware({})
  )

vipDashBoardRouter.route('/seedQuestions')
  .post(
    upload.single('file'),
    requestValidationMiddleware({}),
    contextMiddleware(true),
    // isAdminAuthenticated,
    // checkPermission,
    VipDashboardController.seedQuestionnaireAnswer,
    responseValidationMiddleware({})
  )

vipDashBoardRouter
  .route('/manager')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    VipDashboardController.getVipManagerReport,
    responseValidationMiddleware({})
  )

vipDashBoardRouter
  .route('/vip-managed-by')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    VipDashboardController.getVipManager,
    responseValidationMiddleware({})
  )

vipDashBoardRouter
  .route('/questionnaire-formula-values')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    VipDashboardController.getVipQuestionnaireFormulaValues,
    responseValidationMiddleware({})
  )

vipDashBoardRouter.route('/vip-assignment')
  .post(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    // isAdminAuthenticated,
    // checkPermission,
    VipDashboardController.updateVipAssignment,
    responseValidationMiddleware({})
  )
export default vipDashBoardRouter
