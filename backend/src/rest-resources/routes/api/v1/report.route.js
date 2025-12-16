import express from 'express'
import ReportController from '../../../controllers/report.controller'
import { DASHBOARD_REPORT } from '../../../../utils/constants/constant'
import contextMiddleware from '../../../middlewares/context.middleware'
import { checkPermission, isAdminAuthenticated } from '../../../middlewares'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'

const args = { mergeParams: true }
const reportRoute = express.Router(args)

const dashboardReportSchema = {
  querySchema: {
    type: 'object',
    properties: {
      startDate: { type: 'string' },
      endDate: { type: 'string' },
      playerType: { type: 'string', enum: ['internal', 'real', 'all'] },
      reportType: { type: 'string', enum: Object.values(DASHBOARD_REPORT) },
      timezone: { type: 'string' }
    },
    required: ['playerType', 'reportType', 'timezone']
  }
}

const purchaseReportSchema = {
  querySchema: {
    type: 'object',
    properties: {
      search: { type: 'string' },
      filterBy: { type: 'string', enum: ['purchase', 'redeem', 'play', 'balance', 'win', 'ngr', 'ggr', 'playThrough', 'totalPendingRedemptionAmount'] },
      filterOperator: { type: 'string', enum: ['=', '!=', '>', '<', '>=', '<='] },
      filterValue: { type: 'string', pattern: '^(?:[+-]?([0-9]*[.])?[0-9]+)?$' },
      limit: { type: 'number', minimum: 1, pattern: '^[0-9]+$' },
      pageNo: { type: 'number', minimum: 1, pattern: '^[0-9]+$' },
      csvDownload: { type: 'string', enum: ['true', 'false'] },
      sortBy: { type: 'string', enum: ['ASC', 'DESC', 'asc', 'desc'] },
      orderBy: { type: 'string' },
      timezone: { type: 'string' }
    },
    required: ['timezone']
  }
}

const bonusReportSchema = {
  querySchema: {
    type: 'object',
    properties: {
      startDate: { anyOf: [{ type: 'string', format: 'date' }, { type: 'string', format: 'date-time' }] },
      endDate: { anyOf: [{ type: 'string', format: 'date' }, { type: 'string', format: 'date-time' }] },
      timezone: { type: 'string' },
      bonusType: { type: 'array', items: { type: 'string', enum: ['all', 'amoeBonus', 'tierBonus', 'dailyBonus', 'packageBonus', 'rafflePayout', 'welcomeBonus', 'jackpotWinner', 'personalBonus', 'providerBonus', 'referralBonus', 'vipQuestionnaireBonus', 'affiliateBonus', 'promotionBonus', 'wheelSpinBonus', 'weeklyTierBonus', 'monthlyTierBonus', 'tournamentWinner', 'adminAddedScBonus', 'crmPromocodeBonus', 'purchasePromocodeBonus', 'scratchCardBonus'] } },
      timeInterval: { type: 'string', enum: ['auto', '30-minutes', 'hour', '3-hours', '12-hours', 'day', '3-days', 'week', 'month'] }
    },
    required: ['timezone', 'startDate', 'endDate']
  }
}

reportRoute
  .route('/')
  .get(
    requestValidationMiddleware(dashboardReportSchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    ReportController.dashboardController,
    responseValidationMiddleware()
  )

reportRoute
  .route('/session-logs')
  .get(
    requestValidationMiddleware(),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    ReportController.auditSessionLogs,
    responseValidationMiddleware()
  )

reportRoute
  .route('/all')
  .get(
    requestValidationMiddleware(),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    ReportController.allReport,
    responseValidationMiddleware()
  )

reportRoute
  .route('/whale-players')
  .get(
    requestValidationMiddleware(),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    ReportController.getWhalePlayers,
    responseValidationMiddleware()
  )

reportRoute
  .route('/v2')
  .get(
    requestValidationMiddleware(dashboardReportSchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    ReportController.dashboardReportOptimized,
    responseValidationMiddleware()
  )

reportRoute
  .route('/purchase-report')
  .get(
    requestValidationMiddleware(purchaseReportSchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    ReportController.purchaseReport,
    responseValidationMiddleware()
  )
reportRoute
  .route('/bonus-graph-report')
  .get(
    requestValidationMiddleware(bonusReportSchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    ReportController.bonusGraphReport,
    responseValidationMiddleware()
  )

reportRoute
  .route('/bonus-detail-report')
  .get(
    requestValidationMiddleware(bonusReportSchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    ReportController.bonusDataReport,
    responseValidationMiddleware()
  )

reportRoute
  .route('/merv-report')
  .get(
    requestValidationMiddleware(),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    ReportController.mervReport,
    responseValidationMiddleware()
  )

reportRoute
  .route('/redemption-rate-report')
  .get(
    requestValidationMiddleware(),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    ReportController.redemptionRateReport,
    responseValidationMiddleware()
  )

export default reportRoute
