import { sendResponse } from '../../utils/response.helpers'
import { CreateTierService, DeleteTierService, GetAllTiersService, GetTierDetailService, GetUserDetailTierService, UpdateTierService, UpdateTierStatusService } from '../../services/tiers'

export default class TierController {
  static async getAllTier (req, res, next) {
    try {
      const { result, successful, errors } = await GetAllTiersService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getTierDetail (req, res, next) {
    try {
      const { result, successful, errors } = await GetTierDetailService.execute({ ...req.params }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateTierStatus (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateTierStatusService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deleteTier (req, res, next) {
    try {
      const { result, successful, errors } = await DeleteTierService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async createTier (req, res, next) {
    try {
      const { result, successful, errors } = await CreateTierService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateTier (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateTierService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getTierUsers (req, res, next) {
    try {
      const { result, successful, errors } = await GetUserDetailTierService.execute({ ...req.params, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
