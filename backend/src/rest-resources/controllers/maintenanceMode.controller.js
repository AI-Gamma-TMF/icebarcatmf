import { CreateMaintenanceModeService, CreateRibbonService, DeleteMaintenanceModeService, DeleteRibbonDataService, GetMaintenanceModeService, GetRibbonDataService, ManageMaintenanceModeService, UpdateMaintenanceModeService } from '../../services/maintenanceMode'
import { sendResponse } from '../../utils/response.helpers'

export default class MaintenanceModeController {
  static async createMaintenanceMode (req, res, next) {
    try {
      const { result, successful, errors } = await CreateMaintenanceModeService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateMaintenanceMode (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateMaintenanceModeService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deleteMaintenanceMode (req, res, next) {
    try {
      const { result, successful, errors } = await DeleteMaintenanceModeService.execute({ ...req.body, ...req.query, ...req.params }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getMaintenanceModeDetail (req, res, next) {
    try {
      const { result, successful, errors } = await GetMaintenanceModeService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async manageMaintenanceMode (req, res, next) {
    try {
      const { result, successful, errors } = await ManageMaintenanceModeService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async createRibbonData (req, res, next) {
    try {
      const { result, successful, errors } = await CreateRibbonService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getRibbonData (req, res, next) {
    try {
      const { result, successful, errors } = await GetRibbonDataService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }


  static async deleteRibbonData (req, res, next) {
    try {
      const { result, successful, errors } = await DeleteRibbonDataService.execute({ ...req.body, ...req.query, ...req.params }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
