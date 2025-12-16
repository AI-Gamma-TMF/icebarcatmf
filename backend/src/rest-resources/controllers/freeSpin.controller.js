import { CreateFreeSpinBonusService, DeleteUserFromCacheService, FreeSpinGameBetScaleAmountService, GetAllFreeSpinService, GetFreeSpinDetailsService, GetFreeSpinUserDetailsService, GetGameListAllowFreeSpin, GetProviderListAllowFreeSpin, GetUserFromCacheService, RemovePlayerFromFreeSpinService, UpdateFreeSpinBonusService, UpdateFreeSpinStatusService, UserUploadCsvFreeSpin, ViewUserFromCacheService, GetFreeSpinDashboardService } from '../../services/bonus/freeSpin'
import { isValidCsvFile } from '../../utils/common'
import { OK } from '../../utils/constants/constant'
import { InvalidFileErrorType } from '../../utils/constants/errors'
import { sendResponse } from '../../utils/response.helpers'

export default class FreeSpinController {
  static async getProviderListAllowFreeSpin (req, res, next) {
    try {
      const { result, successful, errors } = await GetProviderListAllowFreeSpin.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getGameListAllowFreeSpin (req, res, next) {
    try {
      const { result, successful, errors } = await GetGameListAllowFreeSpin.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  // csv response
  static async uploadUserCsv (req, res, next) {
    try {
      if (req && typeof req.file !== 'undefined') {
        const fileCheckResponse = isValidCsvFile(req.file)
        if (fileCheckResponse !== OK) {
          return next(InvalidFileErrorType)
        }
      }
      const { result, successful, errors } = await UserUploadCsvFreeSpin.execute({ ...req.body, ...req.query, file: req.file }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  // preview show
  static async showPreview (req, res, next) {
    try {
      const { result, successful, errors } = await ViewUserFromCacheService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  // preview deletion
  static async removePreview (req, res, next) {
    try {
      const { result, successful, errors } = await DeleteUserFromCacheService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getCacheUser (req, res, next) {
    try {
      const { result, successful, errors } = await GetUserFromCacheService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  // on submit form
  static async createFreeSpin (req, res, next) {
    try {
      const { result, successful, errors } = await CreateFreeSpinBonusService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateFreeSpin (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateFreeSpinBonusService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateFreeSpinStatus (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateFreeSpinStatusService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getAllFreeSpin (req, res, next) {
    try {
      const { result, successful, errors } = await GetAllFreeSpinService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getFreeSpinDetails (req, res, next) {
    try {
      const { result, successful, errors } = await GetFreeSpinDetailsService.execute({ ...req.params, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getFreeSpinUserDetails (req, res, next) {
    try {
      const { result, successful, errors } = await GetFreeSpinUserDetailsService.execute({ ...req.params, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async removeUserFromFreeSpin (req, res, next) {
    try {
      const { result, successful, errors } = await RemovePlayerFromFreeSpinService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getFreeSpinAmountScaleList (req, res, next) {
    try {
      const { result, successful, errors } = await FreeSpinGameBetScaleAmountService.execute(req.query, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getFreeSpinDashboard (req, res, next) {
    try {
      const { result, successful, errors } = await GetFreeSpinDashboardService.execute(req.query, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
