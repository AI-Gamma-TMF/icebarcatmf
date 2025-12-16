
import { sendResponse } from '../../utils/response.helpers'
import { AddRemoveBalanceService } from '../../services/wallet'

export default class WalletController {
  static async addBalance (req, res, next) {
    try {
      const { result, successful, errors } = await AddRemoveBalanceService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
