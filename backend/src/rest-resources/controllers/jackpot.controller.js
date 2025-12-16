import { sendResponse } from '../../utils/response.helpers'
import { CreateJackpotService, UpdateJackpotService, DeleteJackpotService, GetAllJackpotDetailService, GetJackpotTabsInfoService, GetCurrentJackpotInfoService, GenerateRnGService, GetJackpotGraphService } from '../../services/jackpot'

export default class JackpotController {
  static async createJackpot (req, res, next) {
    try {
      const { result, successful, errors } = await CreateJackpotService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateJackpot (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateJackpotService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deleteJackpot (req, res, next) {
    try {
      const { result, successful, errors } = await DeleteJackpotService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getAllJackpot (req, res, next) {
    try {
      const { result, successful, errors } = await GetAllJackpotDetailService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getJackpotTabs (req, res, next) {
    try {
      const { result, successful, errors } = await GetJackpotTabsInfoService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getCurrentJackpotInfo (req, res, next) {
    try {
      const { result, successful, errors } = await GetCurrentJackpotInfoService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async generateRandomWinningData (req, res, next) {
    try {
      const { result, successful, errors } = await GenerateRnGService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getJackpotGraph (req, res, next) {
    try {
      const { result, successful, errors } = await GetJackpotGraphService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
