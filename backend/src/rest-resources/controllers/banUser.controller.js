import { sendResponse } from '../../utils/response.helpers'
import { CreateBanReasonSettingService, GetAllBanReasonService, UpdateBanReasonSettingService, GetBanReasonService, DeleteBanReasonService, UpdateBanReasonStatusService, GetUserBanReasonService } from '../../services/banUserSetting'

export default class BanUserSettingController {
  static async createReasonSetting (req, res, next) {
    try {
      const { result, successful, errors } = await CreateBanReasonSettingService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateReasonSetting (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateBanReasonSettingService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getAllBanReasons (req, res, next) {
    try {
      const { result, successful, errors } = await GetAllBanReasonService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getBanReason (req, res, next) {
    try {
      const { result, successful, errors } = await GetBanReasonService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deleteBanReason (req, res, next) {
    try {
      const { result, successful, errors } = await DeleteBanReasonService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateBanReasonStatus (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateBanReasonStatusService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getUserBanReason (req, res, next) {
    try {
      const { result, successful, errors } = await GetUserBanReasonService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
