import { sendResponse } from '../../utils/response.helpers'
import { CreateRaffleService, GetAllRafflesService, UpdateRaffleService, UpdateRaffleStatusService, DeleteRaffleService, GetRaffleDetailsService, GetRaffleService } from '../../services/raffles'
export default class RafflesController {
  static async createRaffle (req, res, next) {
    try {
      const { result, successful, errors } = await CreateRaffleService.execute({ ...req.body, bannerImg: req.file }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors }
      )
    } catch (error) {
      next(error)
    }
  }

  static async getAllRaffles (req, res, next) {
    try {
      const { result, successful, errors } = await GetAllRafflesService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getRaffleDetails (req, res, next) {
    try {
      const { result, successful, errors } = await GetRaffleDetailsService.execute(req.query, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors }
      )
    } catch (error) {
      next(error)
    }
  }

  static async updateRaffle (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateRaffleService.execute({ ...req.body, ...req.query, bannerImg: req.file }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors }
      )
    } catch (error) {
      next(error)
    }
  }

  static async updateRaffleStatus (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateRaffleStatusService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors }
      )
    } catch (error) {
      next(error)
    }
  }

  static async deleteRaffle (req, res, next) {
    try {
      const { result, successful, errors } = await DeleteRaffleService.execute(req.query, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors }
      )
    } catch (error) {
      next(error)
    }
  }

  static async getRaffle (req, res, next) {
    try {
      const { result, successful, errors } = await GetRaffleService.execute({ ...req.params, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors }
      )
    } catch (error) {
      next(error)
    }
  }
}
