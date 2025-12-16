import { CreateProviderRateService, DeleteProviderRateService, GetAggregatorProviderDetailService, GetProviderDashboardDataService, GetProvidersRateDetailService, UpdateProviderRateService } from '../../services/providerDashboard'
import { sendResponse } from '../../utils/response.helpers'

export default class ProviderDashboardController {
  static async createProviderRate (req, res, next) {
    try {
      const { result, successful, errors } = await CreateProviderRateService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateProviderRate (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateProviderRateService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getProviderRateDetail (req, res, next) {
    try {
      const { result, successful, errors } = await GetProvidersRateDetailService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deleteProviderRateDetail (req, res, next) {
    try {
      const { result, successful, errors } = await DeleteProviderRateService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getProviderDashboardData (req, res, next) {
    try {
      const { result, successful, errors } = await GetProviderDashboardDataService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getAggregatorProviderDetail (req, res, next) {
    try {
      const { result, successful, errors } = await GetAggregatorProviderDetailService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
