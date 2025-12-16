import { sendResponse } from '../../utils/response.helpers'
import { GetRafflePayoutService, GetUserPayoutSearchService, UserPayoutService } from '../../services/raffles'
export default class RafflesPayoutController {
  static async getRafflePayout (req, res, next) {
    try {
      const { result, successful, errors } = await GetRafflePayoutService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors }
      )
    } catch (error) {
      next(error)
    }
  }

  static async getUserPayoutSearch (req, res, next) {
    try {
      const { result, successful, errors } = await GetUserPayoutSearchService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors }
      )
    } catch (error) {
      next(error)
    }
  }

  static async userPayout (req, res, next) {
    try {
      const { result, successful, errors } = await UserPayoutService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors }
      )
    } catch (error) {
      next(error)
    }
  }
}
