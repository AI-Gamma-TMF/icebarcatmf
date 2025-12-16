import { CreateGameMonthlyDiscountService, CreateGamePageFaqService, CreateGamePageService, DeleteGameMonthlyDiscountService, DeleteGamePageCardService, DeleteGamePageFaqService, DeleteGamePageService, GetGameLobbyDetailsService, GetGameMonthlyDiscountService, GetGamePageCardService, GetGamePageFaqService, GetGamePageService, UpdateGameMonthlyDiscountService, UpdateGamePageCardService, UpdateGamePageService } from '../../services/gamePages'
import { CreateGamePageCardService } from '../../services/gamePages/createGamePageCard.service'
import { sendResponse } from '../../utils/response.helpers'

export default class GamePageController {
  static async createGamePage (req, res, next) {
    try {
      const { result, successful, errors } = await CreateGamePageService.execute({ ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateGamePage (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateGamePageService.execute({ ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getGamePage (req, res, next) {
    try {
      const { result, successful, errors } = await GetGamePageService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deleteGamePage (req, res, next) {
    try {
      const { result, successful, errors } = await DeleteGamePageService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async createGamePageFaq (req, res, next) {
    try {
      const { result, successful, errors } = await CreateGamePageFaqService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getGamePageFaq (req, res, next) {
    try {
      const { result, successful, errors } = await GetGamePageFaqService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deleteGamePageFaq (req, res, next) {
    try {
      const { result, successful, errors } = await DeleteGamePageFaqService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async createGamePageCard (req, res, next) {
    try {
      const { result, successful, errors } = await CreateGamePageCardService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getGamePageCard (req, res, next) {
    try {
      const { result, successful, errors } = await GetGamePageCardService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateGamePageCard (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateGamePageCardService.execute({ ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deleteGamePageCard (req, res, next) {
    try {
      const { result, successful, errors } = await DeleteGamePageCardService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getGamesLobbyDetail (req, res, next) {
    try {
      const { result, successful, errors } = await GetGameLobbyDetailsService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async createGameMonthlyDiscount (req, res, next) {
    try {
      const { result, successful, errors } = await CreateGameMonthlyDiscountService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateGameMonthlyDiscount (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateGameMonthlyDiscountService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deleteGameMonthlyDiscount (req, res, next) {
    try {
      const { result, successful, errors } = await DeleteGameMonthlyDiscountService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async GetGameMonthlyDiscount (req, res, next) {
    try {
      const { result, successful, errors } = await GetGameMonthlyDiscountService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
