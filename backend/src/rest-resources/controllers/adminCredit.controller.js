import { GetAdminCreditCoinsService, GetAdminCreditUserService } from '../../services/payment'
import { sendResponse } from '../../utils/response.helpers'

export default class AdminCreditController {
  static async getAdminCreditCoins (req, res, next) {
    try {
      const { result, successful, errors } = await GetAdminCreditCoinsService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getAdminCreditUser (req, res, next) {
    try {
      const { result, successful, errors } = await GetAdminCreditUserService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
