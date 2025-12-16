import { sendResponse } from '../../utils/response.helpers'
import { CreatePromoCodeService, DeletePromoCodeService, GetPromoCodeDetailService, GetPromoCodesService, UpdatePromoCodeService, UpdateStatusPromoCodeService, GenerateRandomPromoCodeService, GetAffiliateGraphService } from '../../services/promotionEvent'

export default class PromotionController {
  static async createPromoCodes (req, res, next) {
    try {
      const { result, successful, errors } = await CreatePromoCodeService.execute({ ...req.body, ...req.query, ...req.params }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getPromoCodes (req, res, next) {
    try {
      const { result, successful, errors } = await GetPromoCodesService.execute({ ...req.body, ...req.query, ...req.params }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updatePromoCode (req, res, next) {
    try {
      const { result, successful, errors } = await UpdatePromoCodeService.execute({ ...req.body, ...req.query, ...req.params }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deletePromoCode (req, res, next) {
    try {
      const { result, successful, errors } = await DeletePromoCodeService.execute({ ...req.body, ...req.query, ...req.params }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateStatusPromoCode (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateStatusPromoCodeService.execute({ ...req.body, ...req.query, ...req.params }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getPromocodeDetail (req, res, next) {
    try {
      const { result, successful, errors } = await GetPromoCodeDetailService.execute({ ...req.body, ...req.query, ...req.params }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getRandomPromoCode (req, res, next) {
    try {
      const { result, successful, errors } = await GenerateRandomPromoCodeService.execute({ ...req.body, ...req.query, ...req.params }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getAffiliateGraph (req, res, next) {
    try {
      const { result, successful, errors } = await GetAffiliateGraphService.execute({ ...req.body, ...req.query, ...req.params }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
