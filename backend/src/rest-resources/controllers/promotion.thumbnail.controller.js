import { CreatePromotionThumbnailService, DeletePromotionThumbnailService, GetPromotionThumbnailService, OrderPromotionThumbnailService, UpdatePromotionThumbnailService, UpdatePromotionThumbnailStatusService } from '../../services/promotionThumbnail'
import { InvalidFileErrorType } from '../../utils/constants/errors'
import { sendResponse } from '../../utils/response.helpers'
import { validateFile } from '../../utils/common'
import { OK } from '../../utils/constants/constant'

export default class PromotionThumbnailController {
  static async createPromotionThumbnail (req, res, next) {
    try {
      if (req && typeof req.file !== 'undefined') {
        const promotionThumbnailFileCheckResponse = validateFile(res, req.file)
        if (promotionThumbnailFileCheckResponse !== OK) return next(InvalidFileErrorType)
      }
      const { result, successful, errors } = await CreatePromotionThumbnailService.execute(
        { ...req.body, promotionThumbnailImage: req.file }, req.context)

      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updatePromotionThumbnail (req, res, next) {
    try {
      if (req && typeof req.file !== 'undefined') {
        const promotionThumbnailFileCheckResponse = validateFile(res, req?.file)
        if (promotionThumbnailFileCheckResponse !== OK) return next(InvalidFileErrorType)
      }

      const { result, successful, errors } = await UpdatePromotionThumbnailService.execute(
        { ...req.body, promotionThumbnailImage: req?.file }, req.context)

      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deletePromotionThumbnail (req, res, next) {
    try {
      const { result, successful, errors } = await DeletePromotionThumbnailService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getPromotionThumbnail (req, res, next) {
    try {
      const { result, successful, errors } = await GetPromotionThumbnailService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async orderPromotionThumbnail (req, res, next) {
    try {
      const { result, successful, errors } = await OrderPromotionThumbnailService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updatePromotionThumbnailActiveStatus (req, res, next) {
    try {
      const { result, successful, errors } = await UpdatePromotionThumbnailStatusService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
