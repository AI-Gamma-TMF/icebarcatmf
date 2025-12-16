import { sendResponse } from '../../utils/response.helpers'
import AleaGetGamesService from '../../services/alea/getGames.service'

export default class AleaCasinoController {
  static async addGames (req, res, next) {
    try {
      const { result, successful, errors } = await AleaGetGamesService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
