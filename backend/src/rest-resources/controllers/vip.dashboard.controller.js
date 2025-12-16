import { sendResponse } from '../../utils/response.helpers'
import { GetVipUserService, GetVipManagers, UpdateVipUserService, GetVipUserByIdService, UpdateVipUserTierService, GetAllLoyaltyTiersService, GetBiggestWinnerLooserService, GetQuestionnaireService, CreateQuestionnaireService, CreateQuestionnaireAnswerService, GetQuestionnaireAnswerService, UpdateQuestionnaireService, DeleteQuestionnaireService, UpdateQuestionnaireStatusService, OrderQuestionnaireService, UpdateVipManagerService, AddVipQuestionnaireAnswerFromCSV, GetVipUserOptimizedReportService, VipUsersDashBoardReportOptimized, GetVipManagerReportService, UpdateVipManagedByFromCsv, GetVipQuestionnaireFormulaValuesService, UpdateVipAssignmentService } from '../../services/vipDashboard'

export default class VipDashboardController {
  static async getVipUsers (req, res, next) {
    try {
      const { result, successful, errors } = await GetVipUserService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getVipUserById (req, res, next) {
    try {
      const { result, successful, errors } = await GetVipUserByIdService.execute({ ...req.params, ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateVipUsers (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateVipUserService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateLoyaltyTier (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateVipUserTierService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getLoyaltyTiers (req, res, next) {
    try {
      const { result, successful, errors } = await GetAllLoyaltyTiersService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getVipUsersDashboardReportOptimized (req, res, next) {
    try {
      const { result, successful, errors } = await VipUsersDashBoardReportOptimized.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getBiggestWinnerLooser (req, res, next) {
    try {
      const { result, successful, errors } = await GetBiggestWinnerLooserService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getQuestionnaire (req, res, next) {
    try {
      const { result, successful, errors } = await GetQuestionnaireService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async addQuestionnaire (req, res, next) {
    try {
      const { result, successful, errors } = await CreateQuestionnaireService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async addQuestionnaireAnswer (req, res, next) {
    try {
      const { result, successful, errors } = await CreateQuestionnaireAnswerService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getQuestionnaireAnswer (req, res, next) {
    try {
      const { result, successful, errors } = await GetQuestionnaireAnswerService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateQuestionnaire (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateQuestionnaireService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deleteQuestionnaire (req, res, next) {
    try {
      const { result, successful, errors } = await DeleteQuestionnaireService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateQuestionnaireActiveStatus (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateQuestionnaireStatusService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async orderQuestionnaire (req, res, next) {
    try {
      const { result, successful, errors } = await OrderQuestionnaireService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateVipManager (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateVipManagerService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getVipManager (req, res, next) {
    try {
      const { result, successful, errors } = await GetVipManagers.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async seedQuestionnaireAnswer (req, res, next) {
    try {
      const { result, successful, errors } = await AddVipQuestionnaireAnswerFromCSV.execute({ ...req.body, ...req.query, file: req.file }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getOptimizedUserReport (req, res, next) {
    try {
      const { result, successful, errors } = await GetVipUserOptimizedReportService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getVipManagerReport (req, res, next) {
    try {
      const { result, successful, errors } = await GetVipManagerReportService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateVipMangedByFromCsv (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateVipManagedByFromCsv.execute({ ...req.body, file: req.file }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getVipQuestionnaireFormulaValues (req, res, next) {
    try {
      const { result, successful, errors } = await GetVipQuestionnaireFormulaValuesService.execute({}, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateVipAssignment (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateVipAssignmentService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
