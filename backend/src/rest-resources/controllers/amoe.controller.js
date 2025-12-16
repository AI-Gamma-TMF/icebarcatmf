import { AmoeBonusGraphDataService, AmoeBonusHistoryService, UpdateAmoeBonusTimeService } from '../../services/amoe'
import { sendResponse } from '../../utils/response.helpers'

export default class AmoeController {
  static async amoeBonusHistory (req, res, next) {
    try {
      const { result, successful, errors } = await AmoeBonusHistoryService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async amoeBonusGraphData (req, res, next) {
    try {
      const { result, successful, errors } = await AmoeBonusGraphDataService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async amoeBonusTimeUpdate (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateAmoeBonusTimeService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
