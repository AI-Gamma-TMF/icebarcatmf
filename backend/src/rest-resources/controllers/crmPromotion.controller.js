import { AddCRMPromocodeService, DeleteCRMPromocodeService, GetAllCRMPromocodeService, GetCRMBonusHistoryService, GetCRMPromocodeDetailsById, GetExpiredCrmBonusService, ScheduledCampaignsCRMWebhookService, TriggeredCampaignsCRMWebhookService, UpdateCRMPromocodeService, UpdateCRMPromocodeStatusService } from '../../services/crmPromotions'
import { sendResponse } from '../../utils/response.helpers'

export default class CRMPromotionController {
  static async addPromotion (req, res, next) {
    try {
      const { result, successful, errors } = await AddCRMPromocodeService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deletePromotion (req, res, next) {
    try {
      const { result, successful, errors } = await DeleteCRMPromocodeService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getAllPromotions (req, res, next) {
    try {
      const { result, successful, errors } = await GetAllCRMPromocodeService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getPromotionDetails (req, res, next) {
    try {
      const { result, successful, errors } = await GetCRMPromocodeDetailsById.execute({ ...req.params }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getBonusHistory (req, res, next) {
    try {
      const { result, successful, errors } = await GetCRMBonusHistoryService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updatePromocode (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateCRMPromocodeService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateStatusPromocode (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateCRMPromocodeStatusService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async scheduledCampaignsWebhook (req, res, next) {
    try {
      const { result, successful, errors } = await ScheduledCampaignsCRMWebhookService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async triggeredCampaignsWebhook (req, res, next) {
    try {
      const { result, successful, errors } = await TriggeredCampaignsCRMWebhookService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getExpiredBonusDetails (req, res, next) {
    try {
      const { result, successful, errors } = await GetExpiredCrmBonusService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
