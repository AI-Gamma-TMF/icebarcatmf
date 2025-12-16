
import { CancelUserSubscriptionService, CreateSubscriptionPlanService, GetAllSubscriptionFeatureService, GetAllSubscriptionPlanService, GetAllUserSubscriptionService, GetSubscriptionPlanDetailService, GetUserSubscriptionDashboardService, UpdateSubscriptionFeatureService, UpdateSubscriptionPlanService } from '../../services/subscription'
import { validateFile } from '../../utils/common'
import { OK } from '../../utils/constants/constant'
import { InvalidFileErrorType } from '../../utils/constants/errors'
import { sendResponse } from '../../utils/response.helpers'

export default class SubscriptionController {
  // Subscription Features
  static async getAllSubscriptionFeatures (req, res, next) {
    try {
      const { result, successful, errors } = await GetAllSubscriptionFeatureService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateSubscriptionFeature (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateSubscriptionFeatureService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getAllSubscriptionPlan (req, res, next) {
    try {
      const { result, successful, errors } = await GetAllSubscriptionPlanService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async createSubscriptionPlan (req, res, next) {
    try {
      // validating the tournament image file
      if (req.file) {
        const fileCheckResponse = validateFile(res, req.file)
        if (fileCheckResponse !== OK) return next(InvalidFileErrorType)
      }
      const { result, successful, errors } = await CreateSubscriptionPlanService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateSubscriptionPlan (req, res, next) {
    try {
      // validating the tournament image file
      if (req.file) {
        const fileCheckResponse = validateFile(res, req.file)
        if (fileCheckResponse !== OK) return next(InvalidFileErrorType)
      }
      const { result, successful, errors } = await UpdateSubscriptionPlanService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getSubscriptionPlanDetail (req, res, next) {
    try {
      const { result, successful, errors } = await GetSubscriptionPlanDetailService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getAllUserSubscription (req, res, next) {
    try {
      const { result, successful, errors } = await GetAllUserSubscriptionService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async cancelUserSubscription (req, res, next) {
    try {
      const { result, successful, errors } = await CancelUserSubscriptionService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  // Subscription Dashboard
  static async getUserSubscriptionDashboard (req, res, next) {
    try {
      const { result, successful, errors } = await GetUserSubscriptionDashboardService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
