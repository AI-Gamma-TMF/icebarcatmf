import { CreatePromocodesService, DeletePromocodeService, GetExpiredCrmPromocodeService, GetPromocodeDetailService, GetPromocodePackagesService, PromocodeAppliedDetailsService, ReusePromocodesService, UpdatePromocodeService, ViewReusePromocodesService } from '../../services/promocode'
import { CreatePromocodesFromCSV } from '../../services/promocode/createPromocodeFromCsv.service'
import { validateCsvFile } from '../../utils/common'
import { InvalidFileErrorType } from '../../utils/constants/errors'
import { sendResponse } from '../../utils/response.helpers'

export default class PromocodeController {
  static async createPromocodes (req, res, next) {
    try {
      const { result, successful, errors } = await CreatePromocodesService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updatePromocode (req, res, next) {
    try {
      const { result, successful, errors } = await UpdatePromocodeService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deletePromocode (req, res, next) {
    try {
      const { result, successful, errors } = await DeletePromocodeService.execute({ ...req.body, ...req.query, ...req.params }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getPromocodeDetail (req, res, next) {
    try {
      const { result, successful, errors } = await GetPromocodeDetailService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async promocodeAppliedDetail (req, res, next) {
    try {
      const { result, successful, errors } = await PromocodeAppliedDetailsService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async promocodePackages (req, res, next) {
    try {
      const { result, successful, errors } = await GetPromocodePackagesService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getExpiredPromocodes (req, res, next) {
    try {
      const { result, successful, errors } = await GetExpiredCrmPromocodeService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async reusePromocodes (req, res, next) {
    try {
      const { result, successful, errors } = await ReusePromocodesService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async viewReusePromocodes (req, res, next) {
    try {
      const { result, successful, errors } = await ViewReusePromocodesService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async createPromocodesFromCsv (req, res, next) {
    try {
      if (req.file) {
        const fileCheckResponse = validateCsvFile(req.file)
        if (!fileCheckResponse) return next(InvalidFileErrorType)
      }
      const { result, successful, errors } = await CreatePromocodesFromCSV.execute({ ...req.body, ...req.params, file: req.file }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
