import { sendResponse } from '../../utils/response.helpers'
import { GetGameDashboard, GetGameInfos } from '../../services/gameDashboard'

export default class gameDashboardControllers {
  static async getGameDashboardData (req, res, next) {
    try {
      const { result, successful, errors } = await GetGameDashboard.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getGameInfos (req, res, next) {
    try {
      const { result, successful, errors } = await GetGameInfos.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
