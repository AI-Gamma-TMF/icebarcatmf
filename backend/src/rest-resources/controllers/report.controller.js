import { sendResponse } from '../../utils/response.helpers'
import { DashBoardReport } from '../../services/report/dashboardReports'
import { AuditSessionLogsService, BonusGraphReportService, DashboardReportService, PurchaseDataReportService, MervReportService, RedemptionRateReportService } from '../../services/report'
import { AllReportService } from '../../services/report/allReport'
import { GetWhalePlayersService } from '../../services/report/getWhalePlayers.service'

export default class ReportController {
  static async dashboardController (req, res, next) {
    try {
      const { result, successful, errors } = await DashBoardReport.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async auditSessionLogs (req, res, next) {
    try {
      const { result, successful, errors } = await AuditSessionLogsService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async allReport (req, res, next) {
    try {
      const { result, successful, errors } = await AllReportService.execute({ ...req.query, ...req?.body?.user }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getWhalePlayers (req, res, next) {
    try {
      const { result, successful, errors } = await GetWhalePlayersService.execute({ ...req.query, ...req?.body?.user }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async dashboardReportOptimized (req, res, next) {
    try {
      const { result, successful, errors } = await DashboardReportService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async purchaseReport (req, res, next) {
    try {
      const { result, successful, errors } = await PurchaseDataReportService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async bonusGraphReport (req, res, next) {
    try {
      const { result, successful, errors } = await BonusGraphReportService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async bonusDataReport (req, res, next) {
    try {
      const { result, successful, errors } = await DashboardReportService.execute({ ...req.body, ...req.query, playerType: 'real', reportType: 'bonusData' }, req.context)
      sendResponse({ req, res, next }, { result: result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async mervReport (req, res, next) {
    try {
      const { result, successful, errors } = await MervReportService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async redemptionRateReport (req, res, next) {
    try {
      const { result, successful, errors } = await RedemptionRateReportService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
